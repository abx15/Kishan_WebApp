"""
Weather routes for AgroBrain AI backend.

This module defines weather API endpoints including current weather,
forecast, alerts, and weather history with proper caching.
"""

from datetime import datetime
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.logger import logger
from app.services.auth_service import get_current_user
from app.services.weather_service import weather_service
from app.schemas.weather import (
    WeatherRequest,
    ForecastRequest,
    AlertsRequest,
    WeatherHistoryRequest,
    FullWeatherResponse,
    AlertsResponse,
    WeatherHistoryResponse,
    WeatherErrorResponse,
    WeatherSuccessResponse
)

# Create router
router = APIRouter(prefix="/weather", tags=["Weather"])

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@router.get("/current", response_model=FullWeatherResponse)
@limiter.limit("30/minute")
async def get_current_weather(
    request: Request,
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get current weather with 7-day forecast and alerts.
    
    This endpoint provides comprehensive weather information including:
    - Current conditions (temperature, humidity, wind, etc.)
    - 7-day forecast with farming advisories
    - Weather alerts (heatwave, frost, heavy rain, etc.)
    - Data cached for 10 minutes for performance
    
    Rate limited to 30 requests per minute per user.
    """
    try:
        start_time = datetime.utcnow()
        user_id = str(current_user["_id"])
        
        # Fetch weather data
        weather_response = await weather_service.fetch_current_weather(lat, lng, user_id)
        
        # Calculate response time
        response_time_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
        
        # Log request
        logger.info(
            f"Weather request completed",
            extra={
                "user_id": user_id,
                "coordinates": {"lat": lat, "lng": lng},
                "response_time_ms": response_time_ms,
                "cache_hit": weather_response.cached,
                "alert_count": len(weather_response.alerts)
            }
        )
        
        return weather_response
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Current weather endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Weather service error",
                "message": "Failed to fetch current weather",
                "message_hi": "Mausam data prapt karne mein asafalta"
            }
        )


@router.get("/forecast", response_model=Dict[str, Any])
@limiter.limit("20/minute")
async def get_weather_forecast(
    request: Request,
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude"),
    days: int = Query(default=7, ge=1, le=7, description="Number of forecast days"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get weather forecast for specified number of days.
    
    This endpoint returns forecast data with farming advisories.
    Uses the same cache as current weather for consistency.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Fetch weather data (includes forecast)
        weather_response = await weather_service.fetch_current_weather(lat, lng, user_id)
        
        # Return only requested number of days
        forecast_days = weather_response.forecast[:days]
        
        return {
            "success": True,
            "data": {
                "coordinates": weather_response.coordinates,
                "location_name": weather_response.location_name,
                "forecast": forecast_days,
                "cached": weather_response.cached,
                "fetched_at": weather_response.fetched_at,
                "source": weather_response.source
            },
            "days_returned": len(forecast_days)
        }
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Forecast endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Forecast service error",
                "message": "Failed to fetch weather forecast",
                "message_hi": "Mausam forecast prapt karne mein asafalta"
            }
        )


@router.get("/alerts", response_model=AlertsResponse)
@limiter.limit("30/minute")
async def get_weather_alerts(
    request: Request,
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get active weather alerts for a location.
    
    This endpoint returns only active weather alerts that are currently valid.
    Alerts are cached for 30 minutes to improve performance.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Get alerts for location
        alerts = await weather_service.get_alerts_for_location(lat, lng)
        
        # Determine location name (from coordinates if not available)
        location_name = f"{lat:.2f}, {lng:.2f}"
        
        logger.info(
            f"Weather alerts requested",
            extra={
                "user_id": user_id,
                "coordinates": {"lat": lat, "lng": lng},
                "alert_count": len(alerts)
            }
        )
        
        return AlertsResponse(
            coordinates={"lat": lat, "lng": lng},
            alerts=alerts,
            location_name=location_name,
            has_alerts=len(alerts) > 0,
            fetched_at=datetime.utcnow()
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Weather alerts endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Alerts service error",
                "message": "Failed to fetch weather alerts",
                "message_hi": "Mausam alerts prapt karne mein asafalta"
            }
        )


@router.get("/history", response_model=WeatherHistoryResponse)
@limiter.limit("10/minute")
async def get_weather_history(
    request: Request,
    days: int = Query(default=7, ge=1, le=30, description="Number of days of history"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get weather history for the authenticated user.
    
    This endpoint returns historical weather data for the user's
    previous requests, useful for tracking weather patterns.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Fetch weather history
        history = await weather_service.get_weather_history(user_id, days)
        
        # Generate summary statistics
        summary = {
            "total_requests": len(history),
            "date_range": {
                "start": history[-1]["fetched_at"] if history else None,
                "end": history[0]["fetched_at"] if history else None
            },
            "unique_locations": len(set(
                f"{h['coordinates']['lat']:.2f},{h['coordinates']['lng']:.2f}" 
                for h in history
            )) if history else 0,
            "avg_temperature": None,
            "total_alerts": sum(len(h.get("alerts", [])) for h in history)
        }
        
        # Calculate average temperature if data available
        if history:
            temps = []
            for h in history:
                current = h.get("current", {})
                if "temp_c" in current:
                    temps.append(current["temp_c"])
            if temps:
                summary["avg_temperature"] = sum(temps) / len(temps)
        
        logger.info(
            f"Weather history requested",
            extra={
                "user_id": user_id,
                "days_requested": days,
                "records_returned": len(history)
            }
        )
        
        return WeatherHistoryResponse(
            user_id=user_id,
            days_requested=days,
            history=history,
            summary=summary
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Weather history endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "History service error",
                "message": "Failed to fetch weather history",
                "message_hi": "Mausam history prapt karne mein asafalta"
            }
        )


@router.get("/summary", response_model=Dict[str, Any])
@limiter.limit("20/minute")
async def get_weather_summary(
    request: Request,
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lng: float = Query(..., ge=-180, le=180, description="Longitude"),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get weather summary for quick overview.
    
    This endpoint returns a condensed weather summary with key metrics
    suitable for dashboard displays and quick checks.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Fetch weather data
        weather_response = await weather_service.fetch_current_weather(lat, lng, user_id)
        
        # Create summary
        summary = {
            "current": {
                "temp_c": weather_response.current.temp_c,
                "condition": weather_response.current.condition,
                "humidity_pct": weather_response.current.humidity_pct,
                "wind_speed_kmh": weather_response.current.wind_speed_kmh
            },
            "today_forecast": {
                "temp_max_c": weather_response.forecast[0].temp_max_c if weather_response.forecast else None,
                "temp_min_c": weather_response.forecast[0].temp_min_c if weather_response.forecast else None,
                "rain_probability_pct": weather_response.forecast[0].rain_probability_pct if weather_response.forecast else None,
                "farming_advisory": weather_response.forecast[0].farming_advisory if weather_response.forecast else None
            },
            "alerts": {
                "count": len(weather_response.alerts),
                "has_critical": any(alert.severity == "critical" for alert in weather_response.alerts),
                "types": list(set(alert.type for alert in weather_response.alerts))
            },
            "location": {
                "coordinates": weather_response.coordinates,
                "name": weather_response.location_name
            },
            "meta": {
                "cached": weather_response.cached,
                "fetched_at": weather_response.fetched_at,
                "source": weather_response.source
            }
        }
        
        logger.info(
            f"Weather summary requested",
            extra={
                "user_id": user_id,
                "coordinates": {"lat": lat, "lng": lng},
                "cache_hit": weather_response.cached,
                "alert_count": len(weather_response.alerts)
            }
        )
        
        return {
            "success": True,
            "data": summary
        }
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Weather summary endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Summary service error",
                "message": "Failed to fetch weather summary",
                "message_hi": "Mausam summary prapt karne mein asafalta"
            }
        )


@router.post("/cache/clear", response_model=Dict[str, Any])
@limiter.limit("5/minute")
async def clear_weather_cache(
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Clear weather cache (admin function).
    
    This endpoint allows clearing expired or stale weather cache entries.
    Only available to authenticated users with rate limiting.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Clean up cache
        cleaned_count = await weather_service.cleanup_cache()
        
        logger.info(
            f"Weather cache cleanup requested",
            extra={
                "user_id": user_id,
                "cleaned_entries": cleaned_count
            }
        )
        
        return {
            "success": True,
            "data": {
                "cleaned_entries": cleaned_count,
                "message": "Weather cache cleanup completed",
                "message_hi": "Mausam cache safalta se saf kar di gaya"
            }
        }
        
    except Exception as e:
        logger.error(f"Cache cleanup failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Cache cleanup failed",
                "message": "Failed to clear weather cache",
                "message_hi": "Mausam cache saf karne mein asafalta"
            }
        )
