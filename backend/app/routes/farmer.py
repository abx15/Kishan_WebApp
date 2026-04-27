"""
Farmer Routes for AgroBrain AI
Provides endpoints for farmer dashboard functionality.
Enterprise-level: All routes use Depends(get_current_user) properly.
"""

from datetime import datetime, timedelta, timezone
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from loguru import logger

from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/farmer", tags=["Farmer"])


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _require_farmer_access(current_user: Dict[str, Any]) -> None:
    """Raise 403 if user is not farmer/agronomist/admin."""
    if current_user.get("role") not in ["farmer", "admin", "agronomist"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Farmer access required",
        )


# ─── GET /farmer/stats ─────────────────────────────────────────────────────────
@router.get("/stats", status_code=200)
async def get_farmer_stats(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get farmer dashboard statistics."""
    try:
        _require_farmer_access(current_user)

        user_id = current_user["_id"]
        active_threshold = datetime.now(timezone.utc) - timedelta(hours=24)

        total_farmers = await db.users.count_documents({"role": "farmer"})
        recent_weather = await db.weather_logs.count_documents({
            "user_id": str(user_id),
            "created_at": {"$gte": active_threshold},
        })
        crop_recommendations = await db.crop_recommendations.count_documents({
            "user_id": str(user_id),
        })
        chat_sessions = await db.chat_sessions.count_documents({
            "user_id": str(user_id),
        })

        return {
            "success": True,
            "data": {
                "totalFarmers": total_farmers,
                "activeWeatherLogs": recent_weather,
                "cropRecommendations": crop_recommendations,
                "chatSessions": chat_sessions,
                "soilMoisture": 68,          # Placeholder — replace with sensor data
                "weatherCondition": "Sunny",
                "temperature": 28,
                "cropHealth": "Good",
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching farmer stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch farmer statistics",
        )


# ─── GET /farmer/weather ───────────────────────────────────────────────────────
@router.get("/weather", status_code=200)
async def get_farmer_weather(
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get recent weather logs for the farmer dashboard."""
    try:
        _require_farmer_access(current_user)

        user_id = str(current_user["_id"])

        # Fetch latest 7 weather logs
        cursor = db.weather_logs.find({"user_id": user_id}).sort("created_at", -1).limit(7)
        logs = []
        async for doc in cursor:
            logs.append({
                "id": str(doc["_id"]),
                "temp": doc.get("temperature", 28),
                "condition": doc.get("condition", "Clear"),
                "humidity": doc.get("humidity", 65),
                "windSpeed": doc.get("windSpeed", 12),
                "fetched_at": doc.get("created_at", datetime.now(timezone.utc)).isoformat(),
            })

        # Build a sensible current-weather summary
        current_weather = logs[0] if logs else {
            "temp": 28, "condition": "Clear", "humidity": 65, "windSpeed": 12
        }

        return {
            "success": True,
            "data": {
                "current": current_weather,
                "history": logs,
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching farmer weather: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch weather data",
        )


# ─── GET /farmer/crop-recommendations ─────────────────────────────────────────
@router.get("/crop-recommendations", status_code=200)
async def get_farmer_crop_recommendations(
    limit: int = 10,
    current_user: Dict[str, Any] = Depends(get_current_user),
    db=Depends(get_db),
):
    """Get crop recommendation history for the farmer dashboard."""
    try:
        _require_farmer_access(current_user)

        user_id = str(current_user["_id"])

        cursor = db.crop_recommendations.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(min(limit, 50))

        recommendations = []
        async for doc in cursor:
            recommendations.append({
                "id": str(doc["_id"]),
                "top_crop": doc.get("response", {}).get("top_crops", [{}])[0].get("crop", "N/A"),
                "confidence": doc.get("response", {}).get("top_crops", [{}])[0].get("confidence_pct", 0),
                "season": doc.get("request", {}).get("season", ""),
                "created_at": doc.get("created_at", datetime.now(timezone.utc)).isoformat(),
            })

        return {
            "success": True,
            "data": {
                "recommendations": recommendations,
                "total": len(recommendations),
            },
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching crop recommendations: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch crop recommendations",
        )


# ─── GET /farmer/profile ───────────────────────────────────────────────────────
@router.get("/profile", status_code=200)
async def get_farmer_profile(
    current_user: Dict[str, Any] = Depends(get_current_user),
):
    """Get the authenticated farmer's profile summary."""
    _require_farmer_access(current_user)

    return {
        "success": True,
        "data": {
            "id": str(current_user["_id"]),
            "name": current_user.get("name", ""),
            "email": current_user.get("email", ""),
            "username": current_user.get("username", ""),
            "role": current_user.get("role", "farmer"),
            "language": current_user.get("language", "hi"),
            "farm_profile": current_user.get("farm_profile", {}),
            "default_location": current_user.get("default_location", {}),
            "is_verified": current_user.get("is_verified", False),
            "login_count": current_user.get("login_count", 0),
            "last_login": (
                current_user["last_login"].isoformat()
                if current_user.get("last_login") else None
            ),
            "created_at": current_user.get("created_at", "").isoformat()
            if current_user.get("created_at") else "",
        },
    }
