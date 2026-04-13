import pytest
import json
from unittest.mock import patch, MagicMock, AsyncMock
from app.services.weather_service import weather_service

@pytest.mark.asyncio
async def test_get_weather_valid_coords(client, auth_headers):
    """Test getting weather for valid coordinates."""
    # Mocking the service method directly for simplicity in route testing
    with patch.object(weather_service, "_fetch_from_openweathermap", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = {
            "current": {
                "temp_c": 30.5,
                "feels_like_c": 32.0,
                "humidity_pct": 65,
                "wind_speed_kmh": 12.5,
                "wind_direction": 180,
                "pressure_hpa": 1012,
                "visibility_km": 10.0,
                "uv_index": 5.0,
                "condition": "Clear",
                "description": "clear sky",
                "icon_code": "01d"
            },
            "forecast": [
                {
                    "date": "2026-04-13T12:00:00",
                    "temp_max_c": 32.0,
                    "temp_min_c": 25.0,
                    "humidity_pct": 60,
                    "rain_probability_pct": 10,
                    "rain_mm": 0,
                    "condition": "Sunny"
                }
            ],
            "alerts": [],
            "location_name": "Test Farm",
            "coordinates": {"lat": 28.6139, "lng": 77.2090},
            "fetched_at": "2026-04-13T14:20:00Z",
            "source": "openweathermap"
        }
        
        response = await client.get("/weather/current?lat=28.6139&lng=77.2090", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["current"]["temp_c"] == 30.5
        assert data["cached"] is False

@pytest.mark.asyncio
async def test_get_weather_cached(client, auth_headers, redis):
    """Test getting weather from cache."""
    lat, lng = 25.0, 75.0
    cache_key = f"weather:25.00:75.00"
    
    cached_data = {
        "current": {"temp_c": 28.0, "condition": "Cloudy"},
        "forecast": [],
        "alerts": [],
        "location_name": "Cached Location",
        "coordinates": {"lat": lat, "lng": lng},
        "fetched_at": "2026-04-13T14:00:00Z",
        "source": "openweathermap"
    }
    await redis.set(cache_key, json.dumps(cached_data))
    
    response = await client.get(f"/weather/current?lat={lat}&lng={lng}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["current"]["temp_c"] == 28.0
    assert data["cached"] is True

@pytest.mark.asyncio
async def test_get_weather_invalid_lat(client, auth_headers):
    """Test getting weather with invalid latitude."""
    response = await client.get("/weather/current?lat=100&lng=77.2090", headers=auth_headers)
    assert response.status_code == 422 # Pydantic validation error

@pytest.mark.asyncio
async def test_get_weather_unauthenticated(client):
    """Test getting weather without authentication."""
    response = await client.get("/weather/current?lat=28.6139&lng=77.2090")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_alerts_detected_high_temp():
    """Test alert detection for extreme heat."""
    weather_data = {
        "current": {"temp_c": 45, "wind_speed_kmh": 10},
        "forecast": []
    }
    alerts = weather_service._detect_alerts(weather_data)
    assert any(a["type"] == "heatwave" for a in alerts)

@pytest.mark.asyncio
async def test_alerts_detected_heavy_rain():
    """Test alert detection for heavy rain."""
    weather_data = {
        "current": {"temp_c": 30, "wind_speed_kmh": 10},
        "forecast": [
            {
                "date": "2026-04-14T00:00:00Z",
                "rain_probability_pct": 85,
                "temp_max_c": 28,
                "temp_min_c": 22
            }
        ]
    }
    alerts = weather_service._detect_alerts(weather_data)
    assert any(a["type"] == "heavy_rain" for a in alerts)
