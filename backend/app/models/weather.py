"""
Weather model for AgroBrain AI backend.

This module defines the WeatherLog document model for MongoDB
weather logs collection using Motor (async MongoDB driver).
"""

from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from bson import ObjectId


@dataclass
class WeatherLog:
    """Weather log document model for MongoDB weather_logs collection."""
    
    # Basic fields
    _id: Optional[ObjectId] = None
    user_id: Optional[str] = None  # User who requested this weather data
    location_id: Optional[str] = None  # Reference to locations collection
    
    # Coordinates
    coordinates: Dict[str, float] = field(default_factory=dict)
    
    # Current weather data
    current: Dict[str, Any] = field(default_factory=dict)
    
    # 7-day forecast
    forecast: List[Dict[str, Any]] = field(default_factory=list)
    
    # Weather alerts
    alerts: List[Dict[str, Any]] = field(default_factory=list)
    
    # Metadata
    source: str = "openweathermap"  # Data source
    fetched_at: datetime = field(default_factory=datetime.utcnow)
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert WeatherLog to dictionary for MongoDB storage."""
        result = {}
        
        # Handle ObjectId conversion
        if self._id is not None:
            result["_id"] = self._id
        
        # Add all fields
        result.update({
            "user_id": self.user_id,
            "location_id": self.location_id,
            "coordinates": self.coordinates,
            "current": self.current,
            "forecast": self.forecast,
            "alerts": self.alerts,
            "source": self.source,
            "fetched_at": self.fetched_at,
            "created_at": self.created_at
        })
        
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "WeatherLog":
        """Create WeatherLog from MongoDB document."""
        return cls(
            _id=data.get("_id"),
            user_id=data.get("user_id"),
            location_id=data.get("location_id"),
            coordinates=data.get("coordinates", {}),
            current=data.get("current", {}),
            forecast=data.get("forecast", []),
            alerts=data.get("alerts", []),
            source=data.get("source", "openweathermap"),
            fetched_at=data.get("fetched_at", datetime.utcnow()),
            created_at=data.get("created_at", datetime.utcnow())
        )
    
    def set_current_weather(self, weather_data: Dict[str, Any]) -> None:
        """Set current weather data with standardized fields."""
        self.current = {
            "temp_c": weather_data.get("temp_c"),
            "feels_like_c": weather_data.get("feels_like_c"),
            "humidity_pct": weather_data.get("humidity_pct"),
            "wind_speed_kmh": weather_data.get("wind_speed_kmh"),
            "wind_direction": weather_data.get("wind_direction"),
            "pressure_hpa": weather_data.get("pressure_hpa"),
            "visibility_km": weather_data.get("visibility_km"),
            "uv_index": weather_data.get("uv_index"),
            "condition": weather_data.get("condition"),
            "description": weather_data.get("description"),
            "icon_code": weather_data.get("icon_code")
        }
    
    def add_forecast_day(self, forecast_data: Dict[str, Any]) -> None:
        """Add a single day to the forecast."""
        forecast_day = {
            "date": forecast_data.get("date"),
            "temp_max_c": forecast_data.get("temp_max_c"),
            "temp_min_c": forecast_data.get("temp_min_c"),
            "humidity_pct": forecast_data.get("humidity_pct"),
            "rain_probability_pct": forecast_data.get("rain_probability_pct"),
            "rain_mm": forecast_data.get("rain_mm"),
            "condition": forecast_data.get("condition"),
            "farming_advisory": forecast_data.get("farming_advisory")
        }
        self.forecast.append(forecast_day)
    
    def add_alert(self, alert_data: Dict[str, Any]) -> None:
        """Add a weather alert."""
        alert = {
            "type": alert_data.get("type"),
            "severity": alert_data.get("severity"),
            "message_hi": alert_data.get("message_hi"),
            "message_en": alert_data.get("message_en"),
            "valid_from": alert_data.get("valid_from"),
            "valid_until": alert_data.get("valid_until")
        }
        self.alerts.append(alert)
    
    def set_coordinates(self, lat: float, lng: float) -> None:
        """Set coordinates."""
        self.coordinates = {"lat": lat, "lng": lng}
    
    def get_location_key(self) -> str:
        """Get location cache key (rounded to 2 decimal places)."""
        lat = round(self.coordinates.get("lat", 0), 2)
        lng = round(self.coordinates.get("lng", 0), 2)
        return f"{lat:.2f}:{lng:.2f}"
    
    def is_cache_valid(self, max_age_minutes: int = 10) -> bool:
        """Check if weather data is still valid (not expired)."""
        age_minutes = (datetime.utcnow() - self.fetched_at).total_seconds() / 60
        return age_minutes < max_age_minutes
    
    def has_active_alerts(self) -> bool:
        """Check if there are any active alerts."""
        now = datetime.utcnow()
        for alert in self.alerts:
            valid_until = alert.get("valid_until")
            if valid_until and valid_until > now:
                return True
        return False
    
    def get_active_alerts(self) -> List[Dict[str, Any]]:
        """Get all currently active alerts."""
        now = datetime.utcnow()
        active_alerts = []
        
        for alert in self.alerts:
            valid_until = alert.get("valid_until")
            if valid_until and valid_until > now:
                active_alerts.append(alert)
        
        return active_alerts
    
    def get_forecast_summary(self) -> Dict[str, Any]:
        """Get summary of forecast data."""
        if not self.forecast:
            return {}
        
        # Calculate averages and extremes
        temps = [day.get("temp_max_c", 0) for day in self.forecast if day.get("temp_max_c")]
        rain_probs = [day.get("rain_probability_pct", 0) for day in self.forecast if day.get("rain_probability_pct")]
        
        return {
            "days_count": len(self.forecast),
            "max_temp_c": max(temps) if temps else None,
            "min_temp_c": min([day.get("temp_min_c", 0) for day in self.forecast if day.get("temp_min_c")]) if self.forecast else None,
            "avg_rain_probability_pct": sum(rain_probs) / len(rain_probs) if rain_probs else 0,
            "has_rain_expected": any(prob > 50 for prob in rain_probs),
            "alert_count": len(self.get_active_alerts())
        }
