"""
Recommendation service for AgroBrain AI.

This module provides the RecommendationService class that coordinates
crop prediction, AI explanation generation, and irrigation planning.
"""

import json
import time
import asyncio
import hashlib
from datetime import datetime, date
from typing import Dict, List, Any, Optional

import httpx
from openai import AsyncOpenAI
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.logger import logger
from app.core.database import get_database
from app.core.redis import get_redis_client
from app.ml.predictor import CropPredictor, get_fallback_recommendations
from app.schemas.recommendation import (
    RecommendationRequest, 
    RecommendationResponse,
    CropResult,
    AIExplanation,
    FertilizerPlan,
    DailyTip,
    DailyTipCategory
)

class RecommendationService:
    """
    Service for generating agricultural recommendations.
    
    Coordinates ML models, weather data, and LLMs to provide
    actionable insights for farmers.
    """
    
    def __init__(self, predictor: Optional[CropPredictor] = None):
        """Initialize the service."""
        self.predictor = predictor
        self.openai_client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.logger = logger.bind(service="recommendation")
        
        # Base water needs (mm/day) lookup for common Indian crops
        self.base_water_needs = {
            "Rice": 15.0,
            "Wheat": 5.0,
            "Maize": 6.5,
            "Cotton": 7.5,
            "Sugarcane": 10.0,
            "Pulses": 4.0,
            "Millets": 3.5,
            "Barley": 4.5,
            "Groundnut": 5.5,
            "Soybean": 5.0,
            "Mustard": 4.0,
            "Tomato": 6.0,
            "Potato": 5.5,
            "Onion": 5.0,
            "Garlic": 4.5,
            "Cabbage": 5.5,
            "Cauliflower": 5.5,
            "Chilli": 5.0,
            "Brinjal": 5.5,
            "Peas": 4.0,
            "Lentil": 3.5,
            "Gram": 3.0
        }

    async def get_recommendation(
        self, 
        request: RecommendationRequest, 
        redis, 
        db, 
        user_id: str
    ) -> Dict[str, Any]:
        """
        Generate comprehensive crop recommendations.
        
        Orchestrates: Cache -> Weather -> ML -> OpenAI -> DB -> Return
        """
        start_time = time.time()
        
        # 1. Generate cache key
        soil_dict = request.soil.model_dump()
        # Round NPK to nearest 5 for better cache hits as requested
        soil_data_for_hash = {
            "N": round(soil_dict['nitrogen_kg_ha'] / 5) * 5,
            "P": round(soil_dict['phosphorus_kg_ha'] / 5) * 5,
            "K": round(soil_dict['potassium_kg_ha'] / 5) * 5,
            "ph": round(soil_dict['ph'], 1),
            "season": request.season
        }
        hash_obj = hashlib.md5(json.dumps(soil_data_for_hash, sort_keys=True).encode())
        cache_key = f"reco:{hash_obj.hexdigest()}"
        
        # 2. Check Redis cache (TTL: 1 hour)
        try:
            cached_res = await redis.get(cache_key)
        except Exception as e:
            self.logger.warning(f"Redis get failed: {e}")
            cached_res = None

        if cached_res:
            self.logger.info(f"Recommendation cache HIT for user {user_id}")
            result = json.loads(cached_res)
            result["cached"] = True
            return result
        
        self.logger.info(f"Recommendation cache MISS for user {user_id}")
        
        # 3. Fetch current weather (via weather_service internally)
        # We'll use the singleton weather_service or call its method
        from app.services.weather_service import weather_service
        weather_res = await weather_service.fetch_current_weather(request.lat, request.lng, user_id)
        
        # Prepare data for ML
        # Rainfall: annual estimate from 7-day forecast
        total_forecast_rain = sum(day.rain_mm for day in weather_res.forecast)
        annual_rainfall_estimate = total_forecast_rain * (365 / 7)
        
        soil_ml_input = {
            "N": soil_dict['nitrogen_kg_ha'],
            "P": soil_dict['phosphorus_kg_ha'],
            "K": soil_dict['potassium_kg_ha'],
            "ph": soil_dict['ph']
        }
        weather_ml_input = {
            "temperature": weather_res.current.temp_c,
            "humidity": weather_res.current.humidity_pct,
            "rainfall": annual_rainfall_estimate
        }
        
        # 4. Run ML Prediction
        try:
            if self.predictor and self.predictor.is_healthy():
                top_crops_ml = self.predictor.predict(soil_ml_input, weather_ml_input)
            else:
                self.logger.warning("Predictor unavailable, using fallback recommendations")
                top_crops_ml = get_fallback_recommendations(soil_ml_input, weather_ml_input)
        except Exception as e:
            self.logger.error(f"ML Prediction failed: {str(e)}")
            top_crops_ml = get_fallback_recommendations(soil_ml_input, weather_ml_input)
            
        # 5. Call AI Explanation for the top crop
        top_crop = top_crops_ml[0]
        ai_explanation = await self._generate_ai_explanation(
            top_crop=top_crop['crop'],
            confidence=top_crop['confidence_pct'],
            soil_data=soil_dict,
            weather_data=weather_ml_input,
            language=request.language,
            area_acres=request.area_acres
        )
        
        # 6. Build full response object
        inference_time = (time.time() - start_time) * 1000
        response_data = {
            "top_crops": top_crops_ml,
            "ai_explanation": ai_explanation,
            "model_version": self.predictor.model_info.get("version", "1.0.0") if self.predictor else "fallback",
            "inference_time_ms": round(inference_time, 2),
            "cached": False,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # 7. Store in Redis (1 hour)
        try:
            await redis.setex(cache_key, 3600, json.dumps(response_data))
        except Exception as e:
            self.logger.warning(f"Redis set failed: {e}")
        
        # 8. Store in MongoDB
        rec_doc = {
            "user_id": user_id,
            "request": request.model_dump(),
            "response": response_data,
            "created_at": datetime.utcnow()
        }
        await db.crop_recommendations.insert_one(rec_doc)
        
        return response_data

    async def _generate_ai_explanation(
        self, 
        top_crop: str, 
        confidence: float,
        soil_data: dict, 
        weather_data: dict, 
        language: str, 
        area_acres: float
    ) -> Dict[str, Any]:
        """Generate AI explanation for the top recommended crop."""
        
        lang_name = "Hindi" if language == "hi" else "English"
        
        system_prompt = (
            "You are an expert Indian agricultural advisor. A farmer has provided the following data:\n"
            f"- Soil: N={soil_data['nitrogen_kg_ha']}, P={soil_data['phosphorus_kg_ha']}, "
            f"K={soil_data['potassium_kg_ha']}, pH={soil_data['ph']}, Type={soil_data.get('soil_type', 'Unknown')}\n"
            f"- Weather: Temp={weather_data['temperature']}°C, Humidity={weather_data['humidity']}%\n"
            f"- Location Context: Estimated annual rainfall based on current forecast is {weather_data['rainfall']:.1f}mm\n"
            f"- Farm Size: {area_acres} acres\n\n"
            f"The ML model recommends: {top_crop} with {confidence}% confidence.\n\n"
            f"Instructions:\n"
            f"1. Explain WHY {top_crop} is the best fit for this soil and weather.\n"
            f"2. Provide a practical irrigation schedule.\n"
            f"3. Provide a localized fertilizer plan using common Indian product names (like Urea, DAP, MOP).\n"
            f"4. Be practical and use simple, encouraging language.\n"
            f"5. Respond ONLY in {lang_name}.\n"
            f"6. Format your response AS A VALID JSON with keys: 'summary', 'irrigation_advice', 'fertilizer_plan'.\n"
            f"   The 'fertilizer_plan' should be an object with keys: 'basal', 'top_dress_1', 'top_dress_2', 'total_cost_estimate_inr'."
        )
        
        try:
            start_ai = time.time()
            completion = await self.openai_client.chat.completions.create(
                model=settings.openai_model,
                messages=[{"role": "system", "content": system_prompt}],
                response_format={"type": "json_object"},
                timeout=30.0
            )
            
            ai_content = json.loads(completion.choices[0].message.content)
            duration_ms = (time.time() - start_ai) * 1000
            
            # Log usage
            self.logger.info(
                "OpenAI API call completed",
                extra={
                    "duration_ms": duration_ms,
                    "tokens": completion.usage.total_tokens,
                    "model": settings.openai_model,
                    "cost_est": (completion.usage.total_tokens / 1000) * 0.01 # Rough estimate
                }
            )
            
            # Construct AIExplanation dict
            explanation = {
                "summary_hi": ai_content.get("summary") if language == "hi" else None,
                "summary_en": ai_content.get("summary") if language == "en" else "AI explanation follows.",
                "irrigation_advice_hi": ai_content.get("irrigation_advice") if language == "hi" else None,
                "irrigation_advice_en": ai_content.get("irrigation_advice") if language == "en" else "Irrigation advice follows.",
                "fertilizer_plan": ai_content.get("fertilizer_plan")
            }
            
            # Fallback for the other language fields if missing
            if language == "en" and not explanation["summary_en"]:
                explanation["summary_en"] = ai_content.get("summary", "Recommendation summary.")
            
            return explanation
            
        except Exception as e:
            self.logger.error(f"OpenAI call failed: {str(e)}")
            # Fallback simple explanation
            return {
                "summary_en": f"Based on your soil and weather, {top_crop} is highly recommended.",
                "summary_hi": f"आपके मिट्टी और मौसम के आधार पर, {top_crop} की अत्यधिक अनुशंसा की जाती है।",
                "irrigation_advice_en": "Standard irrigation based on soil moisture monitoring.",
                "irrigation_advice_hi": "मिट्टी की नमी की निगरानी के आधार पर मानक सिंचाई।",
                "fertilizer_plan": {
                    "basal": {"name": "DAP", "qty": "50kg/acre"},
                    "top_dress_1": {"name": "Urea", "qty": "25kg/acre"},
                    "total_cost_estimate_inr": 2500
                }
            }

    async def get_irrigation_suggestion(self, soil_data: dict, weather_data: dict, crop: str) -> Dict[str, Any]:
        """
        Rule-based irrigation logic.
        
        Logic:
        - base_water_need (crop-specific)
        - Adjust for: humidity (-), temp (+), rainfall (-), ph (minor)
        """
        base_need = self.base_water_needs.get(crop, 5.0) # mm/day
        
        # Adjustments
        temp = weather_data.get('temperature', 25)
        humidity = weather_data.get('humidity', 60)
        recent_rain = weather_data.get('recent_rainfall', 0)
        
        # Simple adjustment factors
        temp_factor = 1.0 + max(0, (temp - 25) * 0.05) # +5% per deg above 25
        humidity_factor = 1.0 - max(0, (humidity - 50) * 0.01) # -1% per 1% moisture above 50
        
        adjusted_need = base_need * temp_factor * humidity_factor
        adjusted_need = max(1.0, adjusted_need - (recent_rain / 7)) # Deduct avg daily rain
        
        # Output construction
        frequency = "Every 2 days" if adjusted_need > 8 else "Every 3-4 days"
        if adjusted_need > 12: frequency = "Daily"
        
        duration = round(adjusted_need / 4, 1) # Simple heuristic: 1 hour per 4mm need
        
        result = {
            "frequency": frequency,
            "duration_hours": duration,
            "best_time": "6:00 AM - 8:00 AM",
            "weekly_schedule": [
                "Monday: Morning",
                "Wednesday: Morning",
                "Friday: Morning"
            ] if "2 days" in frequency else ["Tuesday", "Saturday"],
            "water_saving_tip_hi": "ड्रिप सिंचाई का उपयोग करें और शाम या सुबह जल्दी पानी दें।",
            "water_saving_tip_en": "Use drip irrigation and water early morning or late evening to reduce evaporation.",
            "adjusted_need_mm_day": round(adjusted_need, 2),
            "action_hi": f"Sinchai {frequency} karein" if "hi" in frequency.lower() else f"सिंचाई {frequency} करें",
            "action_en": f"Irrigate {frequency}",
            "quantity_hi": f"{duration} ghante ke liye",
            "quantity_en": f"for {duration} hours"
        }
        
        return result

    async def get_daily_suggestions(self, user_id, db, redis) -> List[Dict[str, Any]]:
        """
        Generate 3 daily tips via OpenAI.
        Cached per user per day (TTL till midnight).
        """
        cache_key = f"tips:{user_id}:{date.today().isoformat()}"
        # 3. Fetch/Generate Tips
        try:
            cached_tips = await redis.get(cache_key)
        except Exception as e:
            self.logger.warning(f"Redis get failed (tips): {e}")
            cached_tips = None

        if cached_tips:
            return json.loads(cached_tips)
        
        # Fetch context
        user_profile = await db.users.find_one({"_id": user_id})
        # Logic to get farm details if available
        
        prompt = (
            "Generate 3 short, actionable daily farming tips for an Indian farmer today. "
            "Context: Current monsoon season, loamy soil. "
            "Categories to include: Irrigation, Pest Control, General. "
            "Respond in JSON format: [{'tip_hi', 'tip_en', 'category', 'priority'}]"
        )
        
        try:
            completion = await self.openai_client.chat.completions.create(
                model=settings.openai_model,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            tips_data = json.loads(completion.choices[0].message.content)
            tips = tips_data.get("tips", []) if "tips" in tips_data else list(tips_data.values())[0]
            
            # Cache until midnight
            now = datetime.now()
            seconds_until_midnight = (24 - now.hour - 1) * 3600 + (60 - now.minute - 1) * 60 + (60 - now.second)
            try:
                await redis.setex(cache_key, seconds_until_midnight, json.dumps(tips))
            except Exception as e:
                self.logger.warning(f"Redis set failed (tips): {e}")
            
            return tips
        except Exception:
            # Fallback static tips
            return [
                {"tip_en": "Monitor soil moisture before next irrigation.", "tip_hi": "अगली सिंचाई से पहले मिट्टी की नमी की जांच करें।", "category": "irrigation", "priority": "medium"},
                {"tip_en": "Check for pests on leaves early morning.", "tip_hi": "सुबह जल्दी पत्तों पर कीटों की जांच करें।", "category": "pest_control", "priority": "high"},
                {"tip_en": "Keep cattle in shade during peak heat hours.", "tip_hi": "गर्मी के चरम समय में मवेशियों को छाया में रखें।", "category": "general", "priority": "medium"}
            ]

# Create singleton instance (though usually initialized with app.state.predictor)
# recommendation_service = RecommendationService()
