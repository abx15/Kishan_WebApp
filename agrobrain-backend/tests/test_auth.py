import pytest
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import settings

@pytest.mark.asyncio
async def test_send_otp_valid_phone(client):
    """Test sending OTP with a valid phone number."""
    response = await client.post(
        "/auth/send-otp",
        json={"phone": "+919876543210"}
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert "OTP sent" in data["message"]
    assert data["phone"] == "+919876543210"

@pytest.mark.asyncio
async def test_send_otp_invalid_phone(client):
    """Test sending OTP with an invalid phone number format."""
    # Pydantic validation should catch this
    response = await client.post(
        "/auth/send-otp",
        json={"phone": "invalid-phone"}
    )
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_send_otp_rate_limit(client, redis):
    """Test OTP rate limiting after 3 attempts."""
    phone = "+919999999999"
    # Force rate limit in redis
    await redis.set(f"otp_rate:{phone}", 3)
    
    response = await client.post(
        "/auth/send-otp",
        json={"phone": phone}
    )
    assert response.status_code == 429
    assert "Too many OTP requests" in response.json()["detail"]["error"]

@pytest.mark.asyncio
async def test_verify_otp_valid_token(client, mock_firebase, db):
    """Test verifying a valid OTP token."""
    phone = "+919876543210"
    response = await client.post(
        "/auth/verify-otp",
        json={"phone": phone, "otp_token": "valid_firebase_token"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "tokens" in data
    assert "access_token" in data["tokens"]
    assert data["user"]["phone"] == phone

@pytest.mark.asyncio
async def test_verify_otp_invalid_token(client, mock_firebase):
    """Test verifying an invalid OTP token."""
    mock_firebase.side_effect = Exception("Invalid token")
    
    response = await client.post(
        "/auth/verify-otp",
        json={"phone": "+919876543210", "otp_token": "invalid_token"}
    )
    assert response.status_code == 500 # Backend returns 500 for general verification failure in routes/auth.py

@pytest.mark.asyncio
async def test_refresh_token_valid(client, test_user):
    """Test refreshing access token with a valid refresh token."""
    from app.core.security import create_refresh_token
    refresh_token = create_refresh_token(data={"sub": test_user["_id"]})
    
    response = await client.post(
        "/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_refresh_token_expired(client, test_user):
    """Test refreshing token with an expired refresh token."""
    from app.core.security import create_refresh_token
    # Manually create an expired token
    to_encode = {"sub": test_user["_id"], "type": "refresh", "exp": datetime.utcnow() - timedelta(days=1)}
    expired_token = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    
    response = await client.post(
        "/auth/refresh",
        json={"refresh_token": expired_token}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_logout(client, auth_headers):
    """Test user logout."""
    response = await client.post("/auth/logout", headers=auth_headers)
    assert response.status_code == 200
    assert "Logged out successfully" in response.json()["data"]["message"]

@pytest.mark.asyncio
async def test_get_profile_authenticated(client, auth_headers, test_user):
    """Test getting profile for an authenticated user."""
    response = await client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["phone"] == test_user["phone"]

@pytest.mark.asyncio
async def test_get_profile_unauthenticated(client):
    """Test getting profile without authentication."""
    response = await client.get("/auth/me")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_update_profile(client, auth_headers, test_user, db):
    """Test updating user profile."""
    new_name = "Arunkumar Kishan"
    response = await client.patch(
        "/auth/profile",
        headers=auth_headers,
        json={"name": new_name, "language": "hi"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == new_name
    assert response.json()["language"] == "hi"
    
    # Verify in DB
    updated_user = await db.users.find_one({"_id": test_user["_id"]})
    assert updated_user["name"] == new_name
