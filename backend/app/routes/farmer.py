"""
Farmer Routes for AgroBrain AI
Provides endpoints for farmer dashboard functionality
"""

from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger
from app.core.database import get_db
from app.core.security import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/farmer", tags=["Farmer"])

# ─────────────────────────────────────────────────────────────────────────────────
# GET /farmer/stats - Get farmer dashboard statistics
# ─────────────────────────────────────────────────────────────────────────
@router.get("/stats", status_code=200)
async def get_farmer_stats(db=Depends(get_db)):
    """Get farmer dashboard statistics"""
    try:
        current_user = await get_current_user(db)
        
        # Check if user is farmer or admin or agronomist
        if current_user.get("role") not in ["farmer", "admin", "agronomist"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Farmer access required"
            )
        
        # Get farmer-specific stats
        total_farmers = await db.users.count_documents({"role": "farmer"})
        
        # Get active weather logs for this farmer
        active_threshold = datetime.now() - timedelta(hours=24)
        recent_weather = await db.weather_logs.count_documents({
            "user_id": current_user["_id"],
            "created_at": {"$gte": active_threshold}
        })
        
        # Get crop recommendations for this farmer
        crop_recommendations = await db.crop_recommendations.count_documents({
            "user_id": current_user["_id"]
        })
        
        stats = {
            "totalFarmers": total_farmers,
            "activeWeatherLogs": recent_weather,
            "cropRecommendations": crop_recommendations,
            "soilMoisture": 68,  # Mock data for now
            "weatherCondition": "Sunny",
            "temperature": 28,
            "cropHealth": "Excellent"
        }
        
        logger.info(f"Farmer stats fetched: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"Error fetching farmer stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch statistics"
        )

# ─────────────────────────────────────────────────────────────────────────
# GET /farmer/weather - Get weather data for farmer
# ─────────────────────────────────────────────────────────────────────────
@router.get("/weather", status_code=200)
async def get_weather_data(db=Depends(get_db)):
    """Get weather data for farmer dashboard"""
    try:
        current_user = await get_current_user(db)
        
        # Check if user is farmer or admin or agronomist
        if current_user.get("role") not in ["farmer", "admin", "agronomist"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Farmer access required"
            )
        
        # Get weather data from database
        weather_logs = await db.weather_logs.find({
            "user_id": current_user["_id"]
        }).sort("created_at", -1).limit(7)
        
        # Format weather data
        weather_data = {
            "current": {
                "temp": 28,
                "condition": "Sunny",
                "humidity": 65,
                "windSpeed": 12
            },
            "forecast": []
        }
        
        if weather_logs:
            # Get the most recent weather log
            latest_log = weather_logs[0] if weather_logs else None
            if latest_log:
                weather_data["current"] = {
                    "temp": latest_log.get("temperature", 28),
                    "condition": latest_log.get("condition", "Clear"),
                    "humidity": latest_log.get("humidity", 65),
                    "windSpeed": latest_log.get("windSpeed", 12)
                }
        
        logger.info(f"Weather data fetched for user {current_user.get('email')}")
        return weather_data
        
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch weather data"
        )

# ─────────────────────────────────────────────────────────────────────────
# GET /farmer/crop-recommendations - Get crop recommendations for farmer
# ─────────────────────────────────────────────────────────────────────────
@router.get("/crop-recommendations", status_code=200)
async def get_crop_recommendations(db=Depends(get_db)):
    """Get crop recommendations for farmer dashboard"""
    try:
        current_user = await get_current_user(db)
        
        # Check if user is farmer or admin or agronomist
        if current_user.get("role") not in ["farmer", "admin", "agronomist"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Farmer access required"
            )
        
        # Get crop recommendations from database
        recommendations = await db.crop_recommendations.find({
            "user_id": current_user["_id"]
        }).sort("created_at", -1).limit(10)
        
        logger.info(f"Crop recommendations fetched: {len(recommendations)} for user {current_user.get('email')}")
        return recommendations
        
    except Exception as e:
        logger.error(f"Error fetching crop recommendations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch crop recommendations"
        )
