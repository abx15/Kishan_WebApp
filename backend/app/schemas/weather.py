"""
Pydantic schemas for weather API endpoints.

This module defines request/response schemas for weather services
with proper validation for coordinates and weather data.
"""

from datetime import datetime
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, validator, field_validator


class WeatherRequest(BaseModel):
    """Request schema for weather data by coordinates."""
    
    lat: float = Field(
        ...,
        ge=-90,
        le=90,
        description="Latitude (-90 to 90)"
    )
    lng: float = Field(
        ...,
        ge=-180,
        le=180,
        description="Longitude (-180 to 180)"
    )
    
    @field_validator('lat')
    @classmethod
    def validate_lat_range(cls, v):
        """Validate latitude is within valid range."""
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90 degrees")
        return v
    
    @field_validator('lng')
    @classmethod
    def validate_lng_range(cls, v):
        """Validate longitude is within valid range."""
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180 degrees")
        return v


class CurrentWeatherResponse(BaseModel):
    """Response schema for current weather data."""
    
    temp_c: float = Field(..., description="Temperature in Celsius")
    feels_like_c: float = Field(..., description="Feels like temperature in Celsius")
    humidity_pct: int = Field(..., ge=0, le=100, description="Humidity percentage")
    wind_speed_kmh: float = Field(..., ge=0, description="Wind speed in km/h")
    wind_direction: int = Field(..., ge=0, le=360, description="Wind direction in degrees")
    pressure_hpa: float = Field(..., ge=0, description="Atmospheric pressure in hPa")
    visibility_km: Optional[float] = Field(None, ge=0, description="Visibility in km")
    uv_index: Optional[float] = Field(None, ge=0, description="UV index")
    condition: str = Field(..., description="Weather condition (e.g., Clear, Rain)")
    description: str = Field(..., description="Weather description")
    icon_code: str = Field(..., description="Weather icon code")


class ForecastDayResponse(BaseModel):
    """Response schema for single day forecast."""
    
    date: datetime = Field(..., description="Forecast date")
    temp_max_c: float = Field(..., description="Maximum temperature in Celsius")
    temp_min_c: float = Field(..., description="Minimum temperature in Celsius")
    humidity_pct: int = Field(..., ge=0, le=100, description="Humidity percentage")
    rain_probability_pct: int = Field(..., ge=0, le=100, description="Rain probability percentage")
    rain_mm: float = Field(..., ge=0, description="Expected rainfall in mm")
    condition: str = Field(..., description="Weather condition")
    farming_advisory: Optional[str] = Field(None, description="Farming advisory for the day")


class WeatherAlertResponse(BaseModel):
    """Response schema for weather alerts."""
    
    type: str = Field(..., description="Alert type (e.g., heatwave, heavy_rain)")
    severity: str = Field(..., description="Alert severity (low, moderate, high, critical)")
    message_hi: str = Field(..., description="Alert message in Hindi")
    message_en: str = Field(..., description="Alert message in English")
    valid_from: datetime = Field(..., description="Alert validity start time")
    valid_until: datetime = Field(..., description="Alert validity end time")


class FullWeatherResponse(BaseModel):
    """Complete weather response with current, forecast, and alerts."""
    
    current: CurrentWeatherResponse = Field(..., description="Current weather data")
    forecast: List[ForecastDayResponse] = Field(..., description="7-day forecast")
    alerts: List[WeatherAlertResponse] = Field(..., description="Weather alerts")
    location_name: Optional[str] = Field(None, description="Location name")
    cached: bool = Field(..., description="Whether data was retrieved from cache")
    coordinates: Dict[str, float] = Field(..., description="Coordinates")
    fetched_at: datetime = Field(..., description="When data was fetched")
    source: str = Field(..., description="Data source")


class WeatherHistoryRequest(BaseModel):
    """Request schema for weather history."""
    
    days: int = Field(
        default=7,
        ge=1,
        le=30,
        description="Number of days of history to retrieve (1-30)"
    )


class WeatherHistoryResponse(BaseModel):
    """Response schema for weather history."""
    
    user_id: str = Field(..., description="User ID")
    days_requested: int = Field(..., description="Number of days requested")
    history: List[Dict[str, Any]] = Field(..., description="Weather history data")
    summary: Dict[str, Any] = Field(..., description="Summary statistics")


class ForecastRequest(BaseModel):
    """Request schema for forecast data."""
    
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")
    days: int = Field(
        default=7,
        ge=1,
        le=7,
        description="Number of forecast days (1-7)"
    )


class AlertsRequest(BaseModel):
    """Request schema for weather alerts."""
    
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lng: float = Field(..., ge=-180, le=180, description="Longitude")


class AlertsResponse(BaseModel):
    """Response schema for weather alerts."""
    
    coordinates: Dict[str, float] = Field(..., description="Coordinates")
    alerts: List[WeatherAlertResponse] = Field(..., description="Active weather alerts")
    location_name: Optional[str] = Field(None, description="Location name")
    has_alerts: bool = Field(..., description="Whether there are active alerts")
    fetched_at: datetime = Field(..., description="When alerts were fetched")


class WeatherErrorResponse(BaseModel):
    """Error response for weather endpoints."""
    
    success: bool = Field(default=False, description="Request success status")
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message in English")
    message_hi: str = Field(..., description="Error message in Hindi")
    coordinates: Optional[Dict[str, float]] = Field(None, description="Requested coordinates")


class WeatherSuccessResponse(BaseModel):
    """Success response wrapper for weather endpoints."""
    
    success: bool = Field(default=True, description="Request success status")
    data: Dict[str, Any] = Field(..., description="Response data")
    message: Optional[str] = Field(None, description="Success message")
    message_hi: Optional[str] = Field(None, description="Success message in Hindi")


class CacheInfo(BaseModel):
    """Cache information for weather responses."""
    
    hit: bool = Field(..., description="Whether cache was hit")
    ttl_seconds: Optional[int] = Field(None, description="Cache TTL in seconds")
    key: Optional[str] = Field(None, description="Cache key")
    fetched_at: Optional[datetime] = Field(None, description="When cached data was fetched")


class WeatherMetrics(BaseModel):
    """Weather service metrics for monitoring."""
    
    api_calls_today: int = Field(..., description="Number of API calls today")
    cache_hit_rate: float = Field(..., ge=0, le=1, description="Cache hit rate (0-1)")
    avg_response_time_ms: float = Field(..., ge=0, description="Average response time in ms")
    active_alerts_count: int = Field(..., ge=0, description="Number of active alerts")
    last_api_call: Optional[datetime] = Field(None, description="Last API call timestamp")
