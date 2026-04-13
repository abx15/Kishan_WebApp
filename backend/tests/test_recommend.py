import pytest
import json
from unittest.mock import patch, AsyncMock, MagicMock
from app.services.recommendation_service import RecommendationService

@pytest.mark.asyncio
async def test_crop_recommendation_valid_input(client, auth_headers, mock_openai):
    """Test crop recommendation with valid input."""
    # Mocking the predictor
    with patch("app.ml.predictor.CropPredictor.predict") as mock_predict:
        mock_predict.return_value = [
            {"crop": "Rice", "confidence_pct": 95.0},
            {"crop": "Maize", "confidence_pct": 80.0},
            {"crop": "Jute", "confidence_pct": 70.0}
        ]
        mock_predict.return_value_is_healthy = True
        
        # Mocking weather service
        with patch("app.services.weather_service.weather_service.fetch_current_weather", new_callable=AsyncMock) as mock_weather:
            mock_weather.return_value = MagicMock()
            mock_weather.return_value.current.temp_c = 30.0
            mock_weather.return_value.current.humidity_pct = 70.0
            mock_weather.return_value.forecast = []
            
            rec_request = {
                "soil": {
                    "nitrogen_kg_ha": 50.0,
                    "phosphorus_kg_ha": 40.0,
                    "potassium_kg_ha": 40.0,
                    "ph": 6.5,
                    "soil_type": "Loamy"
                },
                "lat": 28.6139,
                "lng": 77.2090,
                "season": "kharif",
                "area_acres": 2.0,
                "language": "en"
            }
            
            response = await client.post("/recommend/crop", headers=auth_headers, json=rec_request)
            assert response.status_code == 200
            data = response.json()
            assert len(data["top_crops"]) == 3
            assert data["top_crops"][0]["crop"] == "Rice"
            assert "ai_explanation" in data

@pytest.mark.asyncio
async def test_crop_recommendation_cached(client, auth_headers, redis):
    """Test crop recommendation retrieval from cache."""
    # Create a deterministic cache key for the input
    # In service: reco:{hash}
    # For simplicity, we'll just mock the redis.get to return a value
    cached_response = {
        "top_crops": [{"crop": "Rice", "confidence_pct": 95.0}],
        "ai_explanation": {"summary_en": "Cached advice"},
        "cached": True
    }
    
    with patch("app.core.redis.RedisManager.get", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = json.dumps(cached_response)
        
        rec_request = {
            "soil": {"nitrogen_kg_ha": 50, "phosphorus_kg_ha": 40, "potassium_kg_ha": 40, "ph": 6.5},
            "lat": 28.6139, "lng": 77.2090, "season": "kharif", "area_acres": 2.0
        }
        
        response = await client.post("/recommend/crop", headers=auth_headers, json=rec_request)
        assert response.status_code == 200
        assert response.json()["cached"] is True

@pytest.mark.asyncio
async def test_crop_recommendation_invalid_ph(client, auth_headers):
    """Test crop recommendation with invalid pH value."""
    rec_request = {
        "soil": {"nitrogen_kg_ha": 50, "phosphorus_kg_ha": 40, "potassium_kg_ha": 40, "ph": 15.0}, # Max ph is 14
        "lat": 28.6139, "lng": 77.2090, "season": "kharif"
    }
    response = await client.post("/recommend/crop", headers=auth_headers, json=rec_request)
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_irrigation_suggestion(client, auth_headers):
    """Test irrigation suggestion endpoint."""
    with patch("app.services.weather_service.weather_service.fetch_current_weather", new_callable=AsyncMock) as mock_weather:
        mock_weather.return_value = MagicMock()
        mock_weather.return_value.current.temp_c = 35.0
        mock_weather.return_value.current.humidity_pct = 40.0
        mock_weather.return_value.forecast = [MagicMock(rain_mm=0)]
        
        irr_request = {
            "soil": {"ph": 6.5},
            "lat": 28.6139,
            "lng": 77.2090,
            "crop": "Rice"
        }
        
        response = await client.post("/recommend/irrigation", headers=auth_headers, json=irr_request)
        assert response.status_code == 200
        assert "irrigation_schedule" in response.json()

@pytest.mark.asyncio
async def test_daily_tips(client, auth_headers, mock_openai):
    """Test daily tips endpoint."""
    response = await client.get("/recommend/daily-tips", headers=auth_headers)
    assert response.status_code == 200
    assert "tips" in response.json()
    assert len(response.json()["tips"]) >= 1

@pytest.mark.asyncio
async def test_feedback_submission(client, auth_headers, db):
    """Test submitting feedback for a recommendation."""
    from bson import ObjectId
    # 1. Insert a dummy recommendation
    rec_id = ObjectId()
    await db.crop_recommendations.insert_one({
        "_id": rec_id,
        "user_id": "test_user_id",
        "created_at": "2026-04-13T10:00:00Z"
    })
    
    feedback_request = {
        "rating": 5,
        "comment": "Excellent advice!",
        "recommendation_accurate": True
    }
    
    response = await client.post(f"/recommend/{rec_id}/feedback", headers=auth_headers, json=feedback_request)
    assert response.status_code == 200
    assert response.json()["success"] is True
    
    # 2. Verify in DB
    updated_rec = await db.crop_recommendations.find_one({"_id": rec_id})
    assert updated_rec["feedback"]["rating"] == 5
