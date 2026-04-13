import pytest
import json
from unittest.mock import patch, AsyncMock, MagicMock

@pytest.mark.asyncio
async def test_send_message_english(client, auth_headers, mock_openai):
    """Test sending an English chat message."""
    mock_openai.return_value.choices[0].message.content = "I suggest using balanced NPK fertilizers for your crop."
    
    chat_request = {
        "message": "Which fertilizer should I use?",
        "language": "en",
        "session_id": "test_session_123"
    }
    
    response = await client.post("/chat/message", headers=auth_headers, json=chat_request)
    assert response.status_code == 200
    data = response.json()
    assert "NPK" in data["response"]
    assert data["session_id"] == "test_session_123"

@pytest.mark.asyncio
async def test_send_message_hindi(client, auth_headers, mock_openai):
    """Test sending a Hindi chat message."""
    mock_openai.return_value.choices[0].message.content = "aapko balanced NPK urvarak ka upyog karna chahiye."
    
    chat_request = {
        "message": "kon sa urvarak?",
        "language": "hi",
        "session_id": "test_session_123"
    }
    
    response = await client.post("/chat/message", headers=auth_headers, json=chat_request)
    assert response.status_code == 200
    assert "urvarak" in response.json()["response"]

@pytest.mark.asyncio
async def test_session_created_on_first_message(client, auth_headers, mock_openai, db):
    """Test that a session is created if not provided."""
    chat_request = {
        "message": "Hello",
        "language": "en"
    }
    
    response = await client.post("/chat/message", headers=auth_headers, json=chat_request)
    assert response.status_code == 200
    assert "session_id" in response.json()
    
    # Verify in DB
    session_id = response.json()["session_id"]
    session = await db.chat_sessions.find_one({"session_id": session_id})
    assert session is not None

@pytest.mark.asyncio
async def test_session_history(client, auth_headers, db):
    """Test retrieving chat session history."""
    session_id = "hist_session_1"
    await db.chat_sessions.insert_one({
        "session_id": session_id,
        "user_id": "test_user_id",
        "messages": [
            {"role": "user", "content": "Hi", "timestamp": "2026-04-13T10:00:00Z"},
            {"role": "assistant", "content": "Hello", "timestamp": "2026-04-13T10:00:01Z"}
        ],
        "total_messages": 2,
        "started_at": "2026-04-13T10:00:00Z",
        "is_active": True
    })
    
    response = await client.get(f"/chat/sessions/{session_id}", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()["messages"]) == 2

@pytest.mark.asyncio
async def test_voice_query_crop_intent(client, auth_headers):
    """Test voice query routing with crop recommendation intent."""
    from app.services.voice_service import voice_service
    with patch.object(voice_service, "process_voice_query", new_callable=AsyncMock) as mock_process:
        mock_process.return_value = {
            "response_text": "I can help with crop advice.",
            "intent": "crop_recommendation",
            "action_taken": "direct_reply",
            "response_time_ms": 100
        }
        
        voice_request = {
            "text": "what should I grow in my farm?",
            "language": "en"
        }
        
        response = await client.post("/voice/query", headers=auth_headers, json=voice_request)
        assert response.status_code == 200
        assert response.json()["intent"] == "crop_recommendation"

@pytest.mark.asyncio
async def test_voice_query_weather_intent(client, auth_headers):
    """Test voice query routing with weather intent."""
    from app.services.voice_service import voice_service
    with patch.object(voice_service, "process_voice_query", new_callable=AsyncMock) as mock_process:
        mock_process.return_value = {
            "response_text": "The weather is sunny.",
            "intent": "weather_query",
            "action_taken": "weather_fetch",
            "response_time_ms": 150
        }
        
        voice_request = {
            "text": "mausam kaisa hai?",
            "language": "hi"
        }
        
        response = await client.post("/voice/query", headers=auth_headers, json=voice_request)
        assert response.status_code == 200
        assert response.json()["intent"] == "weather_query"
