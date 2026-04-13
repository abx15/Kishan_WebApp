"""
Weather service for AgroBrain AI backend.

This module handles weather data fetching from OpenWeatherMap,
caching with Redis, alert detection, and farming advisories.
"""

import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple

import httpx
from fastapi import HTTPException, status

from app.core.config import settings
from app.core.logger import logger
from app.core.database import get_database
from app.core.redis import get_redis_client
from app.models.weather import WeatherLog
from app.schemas.weather import (
    CurrentWeatherResponse,
    ForecastDayResponse,
    WeatherAlertResponse,
    FullWeatherResponse
)


class WeatherService:
    """Service class for weather operations."""
    
    def __init__(self):
        """Initialize WeatherService with OpenWeatherMap API."""
        self.logger = logger.bind(service="weather")
        self.api_key = settings.openweather_api_key
        self.base_url = settings.openweather_base_url
        self.http_client = None
    
    async def get_http_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client with proper configuration."""
        if self.http_client is None:
            self.http_client = httpx.AsyncClient(
                timeout=10.0,
                limits=httpx.Limits(max_keepalive_connections=5, max_connections=10)
            )
        return self.http_client
    
    def _get_cache_key(self, lat: float, lng: float) -> str:
        """
        Generate cache key for weather data.
        
        Args:
            lat: Latitude
            lng: Longitude
            
        Returns:
            Cache key string
        """
        # Round to 2 decimal places for city-level precision
        lat_rounded = round(lat, 2)
        lng_rounded = round(lng, 2)
        return f"weather:{lat_rounded:.2f}:{lng_rounded:.2f}"
    
    async def fetch_current_weather(
        self, 
        lat: float, 
        lng: float, 
        user_id: Optional[str] = None
    ) -> FullWeatherResponse:
        """
        Fetch current weather with caching and alert detection.
        
        Args:
            lat: Latitude
            lng: Longitude
            user_id: Optional user ID for logging
            
        Returns:
            FullWeatherResponse with current, forecast, and alerts
            
        Raises:
            HTTPException: If weather fetch fails
        """
        start_time = datetime.utcnow()
        cache_key = self._get_cache_key(lat, lng)
        
        try:
            redis_client = get_redis_client()
            
            # Check Redis cache first
            cached_data = await redis_client.get(cache_key)
            if cached_data:
                self.logger.info(f"Cache HIT for weather at {lat}, {lng}")
                weather_data = json.loads(cached_data)
                weather_data["cached"] = True
                
                # Add cache info
                weather_data["cache_info"] = {
                    "hit": True,
                    "key": cache_key,
                    "fetched_at": weather_data.get("fetched_at")
                }
                
                return FullWeatherResponse(**weather_data)
            
            # Cache miss - fetch from OpenWeatherMap
            self.logger.info(f"Cache MISS for weather at {lat}, {lng}")
            weather_data = await self._fetch_from_openweathermap(lat, lng)
            
            # Detect alerts
            alerts = self._detect_alerts(weather_data)
            weather_data["alerts"] = alerts
            
            # Generate farming advisories
            forecast_with_advisories = []
            for day in weather_data.get("forecast", []):
                day["farming_advisory"] = self._generate_advisory(day)
                forecast_with_advisories.append(day)
            weather_data["forecast"] = forecast_with_advisories
            
            # Store in Redis cache (10 minutes TTL)
            weather_data["cached"] = False
            weather_data["cache_info"] = {
                "hit": False,
                "key": cache_key,
                "fetched_at": weather_data.get("fetched_at")
            }
            
            await redis_client.setex(cache_key, 600, json.dumps(weather_data))
            
            # Store in MongoDB
            await self._store_weather_log(weather_data, user_id)
            
            # Log performance
            duration_ms = (datetime.utcnow() - start_time).total_seconds() * 1000
            self.logger.info(
                f"Weather fetched in {duration_ms:.2f}ms for {lat}, {lng}",
                extra={
                    "duration_ms": duration_ms,
                    "cache_hit": False,
                    "user_id": user_id,
                    "coordinates": {"lat": lat, "lng": lng}
                }
            )
            
            return FullWeatherResponse(**weather_data)
            
        except httpx.HTTPError as e:
            self.logger.error(f"OpenWeatherMap API error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail={
                    "error": "Weather service unavailable",
                    "message": "Unable to fetch weather data at this time",
                    "message_hi": "Mausam data abhi available nahi hai"
                }
            )
        except Exception as e:
            self.logger.error(f"Weather fetch failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "error": "Weather fetch failed",
                    "message": "Failed to fetch weather data",
                    "message_hi": "Mausam data fetch karne mein asafalta"
                }
            )
    
    async def _fetch_from_openweathermap(self, lat: float, lng: float) -> Dict[str, Any]:
        """
        Fetch weather data from OpenWeatherMap API.
        
        Args:
            lat: Latitude
            lng: Longitude
            
        Returns:
            Weather data dictionary
        """
        client = await self.get_http_client()
        
        # Fetch current weather
        current_url = f"{self.base_url}/weather"
        current_params = {
            "lat": lat,
            "lon": lng,
            "units": "metric",
            "appid": self.api_key
        }
        
        current_response = await client.get(current_url, params=current_params)
        current_response.raise_for_status()
        current_data = current_response.json()
        
        # Fetch 7-day forecast
        forecast_url = f"{self.base_url}/forecast"
        forecast_params = {
            "lat": lat,
            "lon": lng,
            "units": "metric",
            "cnt": 56,  # 8 forecasts per day * 7 days
            "appid": self.api_key
        }
        
        forecast_response = await client.get(forecast_url, params=forecast_params)
        forecast_response.raise_for_status()
        forecast_data = forecast_response.json()
        
        # Fetch UV index (current only)
        try:
            uv_url = f"{self.base_url}/uvi"
            uv_params = {
                "lat": lat,
                "lon": lng,
                "appid": self.api_key
            }
            
            uv_response = await client.get(uv_url, params=uv_params)
            uv_response.raise_for_status()
            uv_data = uv_response.json()
            uv_index = uv_data.get("value", 0)
        except Exception:
            uv_index = 0  # Fallback if UV API fails
        
        # Transform to our schema
        weather_data = self._transform_openweather_data(
            current_data, forecast_data, uv_index, lat, lng
        )
        
        return weather_data
    
    def _transform_openweather_data(
        self, 
        current: Dict[str, Any], 
        forecast: Dict[str, Any], 
        uv_index: float,
        lat: float,
        lng: float
    ) -> Dict[str, Any]:
        """
        Transform OpenWeatherMap data to our schema.
        
        Args:
            current: Current weather data from OWM
            forecast: Forecast data from OWM
            uv_index: UV index value
            lat: Latitude
            lng: Longitude
            
        Returns:
            Transformed weather data
        """
        # Transform current weather
        current_weather = {
            "temp_c": current["main"]["temp"],
            "feels_like_c": current["main"]["feels_like"],
            "humidity_pct": current["main"]["humidity"],
            "wind_speed_kmh": current["wind"]["speed"] * 3.6,  # Convert m/s to km/h
            "wind_direction": current["wind"].get("deg", 0),
            "pressure_hpa": current["main"]["pressure"],
            "visibility_km": current.get("visibility", 0) / 1000,  # Convert m to km
            "uv_index": uv_index,
            "condition": current["weather"][0]["main"],
            "description": current["weather"][0]["description"],
            "icon_code": current["weather"][0]["icon"]
        }
        
        # Transform forecast (group by day)
        daily_forecasts = self._group_forecast_by_day(forecast["list"])
        
        return {
            "current": current_weather,
            "forecast": daily_forecasts,
            "alerts": [],  # Will be filled by _detect_alerts
            "location_name": current.get("name", f"{lat:.2f}, {lng:.2f}"),
            "coordinates": {"lat": lat, "lng": lng},
            "fetched_at": datetime.utcnow().isoformat(),
            "source": "openweathermap"
        }
    
    def _group_forecast_by_day(self, forecast_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Group 3-hourly forecasts into daily forecasts.
        
        Args:
            forecast_list: List of 3-hourly forecasts from OWM
            
        Returns:
            List of daily forecasts
        """
        daily_data = {}
        
        for item in forecast_list:
            # Get date from timestamp
            dt = datetime.fromtimestamp(item["dt"])
            date_key = dt.date()
            
            if date_key not in daily_data:
                daily_data[date_key] = {
                    "date": dt.isoformat(),
                    "temp_max_c": item["main"]["temp_max"],
                    "temp_min_c": item["main"]["temp_min"],
                    "humidity_pct": item["main"]["humidity"],
                    "rain_probability_pct": 0,
                    "rain_mm": 0,
                    "condition": item["weather"][0]["main"],
                    "descriptions": []
                }
            
            # Update min/max temps
            daily_data[date_key]["temp_max_c"] = max(
                daily_data[date_key]["temp_max_c"], 
                item["main"]["temp_max"]
            )
            daily_data[date_key]["temp_min_c"] = min(
                daily_data[date_key]["temp_min_c"], 
                item["main"]["temp_min"]
            )
            
            # Accumulate rain data
            if "rain" in item:
                daily_data[date_key]["rain_mm"] += item["rain"].get("3h", 0)
                daily_data[date_key]["rain_probability_pct"] = max(
                    daily_data[date_key]["rain_probability_pct"],
                    int(item.get("pop", 0) * 100)
                )
            else:
                daily_data[date_key]["rain_probability_pct"] = max(
                    daily_data[date_key]["rain_probability_pct"],
                    int(item.get("pop", 0) * 100)
                )
            
            # Store descriptions for advisory
            daily_data[date_key]["descriptions"].append(item["weather"][0]["description"])
        
        # Convert to list and sort by date
        daily_forecasts = []
        for date_key in sorted(daily_data.keys()):
            day_data = daily_data[date_key]
            # Remove descriptions field (used only for advisory)
            del day_data["descriptions"]
            daily_forecasts.append(day_data)
        
        return daily_forecasts[:7]  # Return only 7 days
    
    def _detect_alerts(self, weather_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Detect weather alerts based on current and forecast data.
        
        Args:
            weather_data: Weather data with current and forecast
            
        Returns:
            List of weather alerts
        """
        alerts = []
        current = weather_data.get("current", {})
        forecast = weather_data.get("forecast", [])
        
        # Check current conditions for immediate alerts
        temp = current.get("temp_c", 0)
        wind_speed = current.get("wind_speed_kmh", 0)
        
        # Heatwave alert
        if temp > 42:
            alerts.append({
                "type": "heatwave",
                "severity": "high",
                "message_hi": " bahut garmi hai! fasalon ko paani zaroor dijiye aur din mein kaam na karein.",
                "message_en": "Extreme heat! Water crops urgently and avoid field work during peak hours.",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow() + timedelta(hours=6)).isoformat()
            })
        
        # Storm alert
        if wind_speed > 60:
            alerts.append({
                "type": "storm",
                "severity": "critical",
                "message_hi": "tez hawa aur toofan ki sambhavna hai! bahar mat niklein aur paudhon ko bachayein.",
                "message_en": "Severe storm warning! Stay indoors and secure crops and equipment.",
                "valid_from": datetime.utcnow().isoformat(),
                "valid_until": (datetime.utcnow() + timedelta(hours=4)).isoformat()
            })
        
        # Check forecast for upcoming alerts
        for i, day in enumerate(forecast[:3]):  # Check next 3 days
            date = datetime.fromisoformat(day["date"].replace('Z', '+00:00'))
            max_temp = day.get("temp_max_c", 0)
            min_temp = day.get("temp_min_c", 0)
            rain_prob = day.get("rain_probability_pct", 0)
            
            # Frost alert
            if min_temp < 2:
                alerts.append({
                    "type": "frost",
                    "severity": "high",
                    "message_hi": "sardi ki wajah se paudhon ko nuksan ho sakta hai. raat ko dhakan chadayein.",
                    "message_en": "Frost warning! Cover sensitive crops tonight to prevent damage.",
                    "valid_from": (date - timedelta(hours=6)).isoformat(),
                    "valid_until": (date + timedelta(hours=6)).isoformat()
                })
            
            # Heavy rain alert
            if rain_prob > 70:
                alerts.append({
                    "type": "heavy_rain",
                    "severity": "moderate" if rain_prob < 85 else "high",
                    "message_hi": "bhari barish hone ki sambhavna hai! paani ka prabandh karein.",
                    "message_en": "Heavy rain expected! Prepare drainage and avoid irrigation.",
                    "valid_from": (date - timedelta(hours=12)).isoformat(),
                    "valid_until": (date + timedelta(hours=12)).isoformat()
                })
        
        return alerts
    
    def _generate_advisory(self, day_forecast: Dict[str, Any]) -> str:
        """
        Generate farming advisory based on weather conditions.
        
        Args:
            day_forecast: Single day forecast data
            
        Returns:
            Farming advisory string
        """
        rain_prob = day_forecast.get("rain_probability_pct", 0)
        max_temp = day_forecast.get("temp_max_c", 0)
        humidity = day_forecast.get("humidity_pct", 0)
        condition = day_forecast.get("condition", "").lower()
        
        # Rule-based advisories
        if rain_prob > 60:
            return (
                "Aaj barish hone ki sambhavna hai. paani na dijein aur khet mein paani na jamne dein. "
                "Today rain is expected. Avoid irrigation and ensure proper drainage."
            )
        elif max_temp > 38:
            return (
                "bahut garmi hai. subah-jaldi paani dijiye taki paudhon garmi se bach sake. "
                "Very hot day. Water crops early morning to prevent heat stress."
            )
        elif humidity > 85:
            return (
                "nami bahut zyada hai. fungas rog ki sambhavna hai, hawa ki achhi suvidha dijiin. "
                "High humidity. Watch for fungal diseases and ensure proper ventilation."
            )
        elif "clear" in condition or "sunny" in condition:
            return (
                "mausam accha hai. khet ka kaam kar sakte hain aur khad bhi dal sakte hain. "
                "Good weather conditions. Field work and fertilizer application recommended."
            )
        else:
            return (
                "mausam theek hai. paudhon haalat dekhein aur anusaar paani dijiin. "
                "Normal weather. Monitor crop conditions and water as needed."
            )
    
    async def _store_weather_log(self, weather_data: Dict[str, Any], user_id: Optional[str]) -> None:
        """
        Store weather log in MongoDB.
        
        Args:
            weather_data: Weather data to store
            user_id: Optional user ID
        """
        try:
            db = get_database()
            weather_logs_collection = db.weather_logs
            
            # Create WeatherLog document
            weather_log = WeatherLog()
            weather_log.set_coordinates(
                weather_data["coordinates"]["lat"],
                weather_data["coordinates"]["lng"]
            )
            weather_log.set_current_weather(weather_data["current"])
            weather_log.user_id = user_id
            weather_log.source = weather_data["source"]
            weather_log.fetched_at = datetime.fromisoformat(
                weather_data["fetched_at"].replace('Z', '+00:00')
            )
            
            # Add forecast days
            for day in weather_data.get("forecast", []):
                weather_log.add_forecast_day(day)
            
            # Add alerts
            for alert in weather_data.get("alerts", []):
                alert["valid_from"] = datetime.fromisoformat(
                    alert["valid_from"].replace('Z', '+00:00')
                )
                alert["valid_until"] = datetime.fromisoformat(
                    alert["valid_until"].replace('Z', '+00:00')
                )
                weather_log.add_alert(alert)
            
            # Store in MongoDB
            await weather_logs_collection.insert_one(weather_log.to_dict())
            
        except Exception as e:
            self.logger.error(f"Failed to store weather log: {str(e)}")
            # Don't raise exception - this is non-critical
    
    async def get_weather_history(self, user_id: str, days: int = 7) -> List[Dict[str, Any]]:
        """
        Get weather history for a user.
        
        Args:
            user_id: User ID
            days: Number of days to retrieve
            
        Returns:
            List of weather history entries
        """
        try:
            db = get_database()
            weather_logs_collection = db.weather_logs
            
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Fetch weather logs
            cursor = weather_logs_collection.find({
                "user_id": user_id,
                "fetched_at": {"$gte": start_date, "$lte": end_date}
            }).sort("fetched_at", -1)
            
            history = []
            async for document in cursor:
                # Convert ObjectId to string
                document["_id"] = str(document["_id"])
                history.append(document)
            
            return history
            
        except Exception as e:
            self.logger.error(f"Failed to get weather history: {str(e)}")
            return []
    
    async def get_alerts_for_location(self, lat: float, lng: float) -> List[WeatherAlertResponse]:
        """
        Get active weather alerts for a location.
        
        Args:
            lat: Latitude
            lng: Longitude
            
        Returns:
            List of active weather alerts
        """
        try:
            # Try to get from cache first
            cache_key = f"alerts:{self._get_cache_key(lat, lng)}"
            redis_client = get_redis_client()
            
            cached_alerts = await redis_client.get(cache_key)
            if cached_alerts:
                alerts_data = json.loads(cached_alerts)
                return [WeatherAlertResponse(**alert) for alert in alerts_data]
            
            # Fetch current weather (this will include alerts)
            weather_response = await self.fetch_current_weather(lat, lng)
            
            # Cache alerts for 30 minutes
            alerts_data = [alert.dict() for alert in weather_response.alerts]
            await redis_client.setex(cache_key, 1800, json.dumps(alerts_data))
            
            return weather_response.alerts
            
        except Exception as e:
            self.logger.error(f"Failed to get alerts: {str(e)}")
            return []
    
    async def cleanup_cache(self) -> int:
        """
        Clean up expired cache entries.
        
        Returns:
            Number of cache keys cleaned up
        """
        try:
            redis_client = get_redis_client()
            
            # Get all weather cache keys
            keys = await redis_client.keys("weather:*")
            
            cleaned_count = 0
            for key in keys:
                ttl = await redis_client.ttl(key)
                if ttl == -1:  # No expiration set
                    await redis_client.expire(key, 600)  # Set 10 minute TTL
                    cleaned_count += 1
            
            self.logger.info(f"Cleaned up {cleaned_count} cache entries")
            return cleaned_count
            
        except Exception as e:
            self.logger.error(f"Cache cleanup failed: {str(e)}")
            return 0


# Create singleton instance
weather_service = WeatherService()
