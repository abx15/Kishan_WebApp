import asyncio
import pytest
import json
from datetime import datetime, timedelta
from typing import AsyncGenerator, Dict, Any
from unittest.mock import MagicMock, AsyncMock, patch

import pytest_asyncio
from httpx import AsyncClient
from motor.motor_asyncio import AsyncIOMotorClient
from mongomock_motor import AsyncMongoMockClient

from app.main import app
from app.core.config import settings
from app.core.database import get_database, db_manager
from app.core.redis import get_redis, redis_manager
from app.core.security import create_access_token, get_password_hash

# 1. Test Database Fixture (Mocked)
@pytest_asyncio.fixture(scope="session")
async def db_client():
    """Mock MongoDB Client using mongomock-motor."""
    client = AsyncMongoMockClient()
    return client

@pytest_asyncio.fixture(scope="function")
async def db(db_client):
    """Mock MongoDB Database fixture."""
    database = db_client[settings.mongodb_db_name]
    
    # Reset database before each test
    collections = await database.list_collection_names()
    for collection in collections:
        await database[collection].delete_many({})
        
    # Override the app dependency
    async def override_get_database():
        yield database
    
    app.dependency_overrides[get_database] = override_get_database
    
    # Also override the global db_manager.database for services that use it directly
    original_db = db_manager.database
    db_manager.database = database
    
    yield database
    
    # Cleanup
    app.dependency_overrides.pop(get_database, None)
    db_manager.database = original_db

# 2. Test Redis Fixture (Mocked)
@pytest_asyncio.fixture(scope="function")
async def redis():
    """Mock Redis using fakeredis."""
    import fakeredis.aioredis
    
    fake_redis = fakeredis.aioredis.FakeRedis()
    
    # Override the app dependency
    async def override_get_redis():
        yield fake_redis
    
    app.dependency_overrides[get_redis] = override_get_redis
    
    # Also override the global redis_manager.redis
    original_redis = redis_manager.redis
    original_available = redis_manager._is_available
    
    redis_manager.redis = fake_redis
    redis_manager._is_available = True
    
    yield fake_redis
    
    # Cleanup
    app.dependency_overrides.pop(get_redis, None)
    redis_manager.redis = original_redis
    redis_manager._is_available = original_available
    await fake_redis.close()

# 3. Test Client Fixture
@pytest_asyncio.fixture(scope="function")
async def client(db, redis) -> AsyncGenerator[AsyncClient, None]:
    """Async client for testing."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

# 4. Mock External APIs Fixtures
@pytest.fixture(autouse=True)
def mock_firebase():
    """Mock Firebase Admin auth verification."""
    with patch("firebase_admin.auth.verify_id_token") as mock_verify:
        mock_verify.return_value = {
            "uid": "fb_test_user_id",
            "phone_number": "+919876543210",
            "firebase": {"sign_in_provider": "phone"}
        }
        yield mock_verify

@pytest.fixture(autouse=True)
def mock_openai():
    """Mock OpenAI API calls."""
    with patch("openai.resources.chat.completions.AsyncCompletions.create") as mock_create:
        mock_create.return_value = AsyncMock()
        mock_create.return_value.choices = [
            MagicMock(message=MagicMock(content=json.dumps({
                "summary": "This is a mock AI farming advice.",
                "irrigation_advice": "Water every 2 days.",
                "fertilizer_plan": {
                    "basal": {"name": "DAP", "qty": "50kg/acre"},
                    "top_dress_1": {"name": "Urea", "qty": "25kg/acre"},
                    "total_cost_estimate_inr": 2500
                }
            })))
        ]
        mock_create.return_value.usage = MagicMock(total_tokens=150)
        yield mock_create

# 5. Auth Fixtures
@pytest_asyncio.fixture
async def test_user(db) -> Dict[str, Any]:
    """Create a test user in the database."""
    user_data = {
        "_id": "test_user_id",
        "phone": "+919876543210",
        "full_name": "Test Farmer",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_onboarded": True,
        "language": "en"
    }
    await db.users.insert_one(user_data)
    return user_data

@pytest.fixture
def auth_headers(test_user) -> Dict[str, str]:
    """Generate auth headers for the test user."""
    access_token = create_access_token(data={"sub": test_user["_id"]})
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for each test case."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()
