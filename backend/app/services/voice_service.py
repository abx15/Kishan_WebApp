"""
Voice service for AgroBrain AI backend.

Handles intent detection from voice-to-text inputs and routes to 
appropriate services (Weather, Recommendations, Chat).
"""

import time
from typing import Dict, Any, Optional

from app.core.logger import logger
from app.schemas.chat import VoiceRequest, VoiceResponse
from app.services.chat_service import chat_service
from app.services.weather_service import weather_service
# Note: recommendation_service imported inside method to avoid circular imports if any

class VoiceService:
    """Service to process voice-driven text queries."""

    def __init__(self):
        self.logger = logger.bind(service="voice")

    def detect_intent(self, text: str) -> str:
        """
        Keyword-based intent detection for Indian farming context.
        Fast and reliable for common queries.
        """
        text = text.lower()
        
        # Crop Recommendation keywords
        crop_kw = ["बुवाई", "फसल", "crop", "sow", "plant", "seed", "beej", "fasal"]
        if any(kw in text for kw in crop_kw):
            return "crop_recommendation"
            
        # Weather keywords
        weather_kw = ["मौसम", "बारिश", "weather", "rain", "temperature", "barish", "mausam", "dhup"]
        if any(kw in text for kw in weather_kw):
            return "weather_query"
            
        # Irrigation keywords
        irr_kw = ["सिंचाई", "पानी", "irrigation", "water", "paani", "sinchai"]
        if any(kw in text for kw in irr_kw):
            return "irrigation_query"
            
        # Default fallback
        return "general_chat"

    async def process_voice_query(self, request: VoiceRequest, current_user: Dict[str, Any], db, redis) -> Dict[str, Any]:
        """Route transcribed text to correct service based on intent."""
        start_time = time.time()
        intent = self.detect_intent(request.text)
        
        response_data = {
            "intent": intent,
            "action_taken": "",
            "response_text": "",
            "response_hi": "",
            "response_en": "",
            "response_time_ms": 0
        }

        user_id = str(current_user["_id"])
        lat = request.lat or current_user.get("default_location", {}).get("lat")
        lng = request.lng or current_user.get("default_location", {}).get("lng")

        try:
            if intent == "weather_query":
                if lat and lng:
                    res = await weather_service.fetch_current_weather(lat, lng, user_id)
                    # Custom TTS formatting for weather
                    hi = f"Aaj {res.location_name} mein tapman {res.current.temp_c} degree hai. {res.current.description}."
                    en = f"Weather in {res.location_name} is {res.current.temp_c}°C with {res.current.description}."
                    response_data["response_hi"] = hi
                    response_data["response_en"] = en
                    response_data["response_text"] = hi if request.language == "hi" else en
                    response_data["action_taken"] = "fetched_weather"
                else:
                    response_data["response_text"] = "Location not found. Please enable GPS."

            elif intent == "irrigation_query":
                from app.services.recommendation_service import RecommendationService
                # We need a predictor for recommendation service, usually from app state
                # For voice query fallback, we'll try to find an active crop from user profile
                active_crop = current_user.get("farm_profile", {}).get("primary_crops", ["Wheat"])[0]
                rec_service = RecommendationService()
                
                # Mock weather data for irrigation suggestion if not available
                weather_ctx = {"temperature": 30, "humidity": 60, "recent_rainfall": 0}
                if lat and lng:
                    w = await weather_service.fetch_current_weather(lat, lng, user_id)
                    weather_ctx = {
                        "temperature": w.current.temp_c,
                        "humidity": w.current.humidity_pct,
                        "recent_rainfall": 0 # simplified
                    }

                suggestion = await rec_service.get_irrigation_suggestion(
                    soil_data=current_user.get("farm_profile", {}),
                    weather_data=weather_ctx,
                    crop=active_crop
                )
                
                hi = f"{active_crop} ke liye: {suggestion['action_hi']}. {suggestion['quantity_hi']}."
                en = f"For {active_crop}: {suggestion['action_en']}. {suggestion['quantity_en']}."
                response_data.update({
                    "response_hi": hi,
                    "response_en": en,
                    "response_text": hi if request.language == "hi" else en,
                    "action_taken": "irrigation_plan"
                })

            else:
                # Fallback to LLM Chat for complex or general queries
                from app.schemas.chat import ChatRequest
                chat_req = ChatRequest(
                    message=request.text,
                    language=request.language,
                    context={"lat": lat, "lng": lng}
                )
                chat_res = await chat_service.send_message(chat_req, current_user, db, redis)
                response_data.update({
                    "response_text": chat_res.ai_response.content,
                    "action_taken": "chat_service_call"
                })

        except Exception as e:
            self.logger.error(f"Voice query processing failed: {e}")
            response_data["response_text"] = "Maaf kijiye, abhi processing mein deri ho rahi hai." if request.language == "hi" else "Sorry, I'm having trouble processing that right now."

        response_data["response_time_ms"] = int((time.time() - start_time) * 1000)
        return response_data


# Singleton instance
voice_service = VoiceService()
