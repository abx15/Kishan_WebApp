"""
Recommendation routes for AgroBrain AI backend.

This module defines API endpoints for crop recommendations, irrigation
suggestions, and daily farming tips using ML and AI services.
"""

import time
from typing import List, Dict, Any, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.logger import logger
from app.core.database import get_db
from app.core.redis import get_redis
from app.core.security import get_current_user
from app.services.recommendation_service import RecommendationService
from app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
    IrrigationRequest,
    IrrigationResponse,
    DailyTipsResponse,
    FeedbackRequest,
    FeedbackResponse,
    RecommendationHistoryResponse
)

# Create router
router = APIRouter(prefix="/recommend", tags=["Recommendations"])

# Rate limiter
limiter = Limiter(key_func=get_remote_address)

# Helper to get recommendation service
def get_recommendation_service(request: Request) -> RecommendationService:
    """Dependency to get RecommendationService with predictor from app state."""
    predictor = getattr(request.app.state, "predictor", None)
    return RecommendationService(predictor=predictor)


@router.post("/crop", response_model=RecommendationResponse)
@limiter.limit("10/minute")
async def get_crop_recommendation(
    request: Request,
    rec_request: RecommendationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: RecommendationService = Depends(get_recommendation_service),
    db = Depends(get_db),
    redis = Depends(get_redis)
):
    """
    Get personalized crop recommendations based on soil and weather data.
    
    This endpoint:
    1. Fetches current weather for the coordinates.
    2. Runs ML model to find top 3 suitable crops.
    3. Uses GPT-4o to generate a detailed explanation and fertilizer plan.
    4. Caches results and stores history in MongoDB.
    """
    try:
        start_time = time.time()
        user_id = str(current_user["_id"])
        
        # Log request
        logger.info(
            f"Crop recommendation requested by user {user_id}",
            extra={"soil": rec_request.soil.model_dump(), "location": {"lat": rec_request.lat, "lng": rec_request.lng}}
        )
        
        # Get recommendation
        result = await service.get_recommendation(rec_request, redis, db, user_id)
        
        # Add request context
        result["request_id"] = f"rec_{int(time.time())}"
        
        duration_ms = (time.time() - start_time) * 1000
        logger.info(
            f"Crop recommendation completed in {duration_ms:.2f}ms",
            extra={
                "user_id": user_id,
                "top_crop": result["top_crops"][0]["crop"],
                "cache_hit": result.get("cached", False)
            }
        )
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Crop recommendation endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate crop recommendation. Please try again later."
        )


@router.post("/irrigation")
@limiter.limit("20/minute")
async def get_irrigation_suggestion(
    request: Request,
    irr_request: IrrigationRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Get detailed irrigation suggestions for a specific crop and location.
    
    Adjusts based on current temperature, humidity, and recent rainfall.
    """
    try:
        # For simplicity, we'll use current weather for the location
        from app.services.weather_service import weather_service
        user_id = str(current_user["_id"])
        weather_res = await weather_service.fetch_current_weather(irr_request.lat, irr_request.lng, user_id)
        
        weather_data = {
            "temperature": weather_res.current.temp_c,
            "humidity": weather_res.current.humidity_pct,
            "recent_rainfall": sum(day.rain_mm for day in weather_res.forecast[:1]) # Just some proxy
        }
        
        suggestion = await service.get_irrigation_suggestion(
            soil_data=irr_request.soil.model_dump(),
            weather_data=weather_data,
            crop=irr_request.crop
        )
        
        return {
            "irrigation_schedule": suggestion,
            "crop_specific_needs": {"base_mm_day": service.base_water_needs.get(irr_request.crop, 5.0)},
            "weather_adjusted": True,
            "cached": False,
            "inference_time_ms": 0.0
        }
    except Exception as e:
        logger.error(f"Irrigation suggestion endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate irrigation suggestion."
        )


@router.get("/daily-tips")
@limiter.limit("30/minute")
async def get_daily_tips(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user),
    service: RecommendationService = Depends(get_recommendation_service),
    db = Depends(get_db),
    redis = Depends(get_redis)
):
    """
    Get 3 personalized daily farming tips.
    
    Tips are generated via AI and cached per user per day.
    """
    try:
        user_id = str(current_user["_id"])
        tips = await service.get_daily_suggestions(user_id, db, redis)
        
        return {
            "tips": tips,
            "cached": True, # Usually cached
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Daily tips endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch daily tips."
        )


@router.get("/history", response_model=RecommendationHistoryResponse)
async def get_recommendation_history(
    limit: int = Query(10, ge=1, le=50),
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_db)
):
    """Retrieve history of previous crop recommendations."""
    try:
        user_id = str(current_user["_id"])
        
        history_cursor = db.crop_recommendations.find({"user_id": user_id}).sort("created_at", -1).limit(limit)
        
        recommendations = []
        async for doc in history_cursor:
            recommendations.append({
                "id": str(doc["_id"]),
                "user_id": doc["user_id"],
                "created_at": doc["created_at"].isoformat(),
                "soil_data": doc["request"]["soil"],
                "season": doc["request"]["season"],
                "location": {"lat": doc["request"]["lat"], "lng": doc["request"]["lng"]},
                "top_crop": doc["response"]["top_crops"][0]["crop"],
                "confidence": doc["response"]["top_crops"][0]["confidence_pct"],
                "feedback": doc.get("feedback")
            })
            
        return {
            "recommendations": recommendations,
            "total_count": len(recommendations),
            "has_more": False,
            "limit": limit
        }
    except Exception as e:
        logger.error(f"History endpoint failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch history.")


@router.post("/{rec_id}/feedback", response_model=FeedbackResponse)
async def submit_feedback(
    rec_id: str,
    feedback: FeedbackRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db = Depends(get_db)
):
    """Submit user feedback for a recommendation."""
    try:
        user_id = str(current_user["_id"])
        from bson import ObjectId
        
        res = await db.crop_recommendations.update_one(
            {"_id": ObjectId(rec_id), "user_id": user_id},
            {"$set": {
                "feedback": feedback.model_dump(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Recommendation not found.")
            
        return {
            "success": True,
            "message": "Feedback submitted successfully.",
            "feedback_id": rec_id
        }
    except Exception as e:
        logger.error(f"Feedback submission failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit feedback.")
