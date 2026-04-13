"""
Authentication routes for AgroBrain AI backend.

This module defines all authentication endpoints including OTP verification,
user registration, token management, and profile updates.
"""

from datetime import datetime
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status, Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings
from app.core.logger import logger
from app.core.redis import get_redis_client
from app.core.database import get_database
from app.services.auth_service import auth_service, get_current_user
from app.schemas.user import (
    PhoneOTPRequest, 
    VerifyOTPRequest, 
    RefreshTokenRequest,
    UserProfileUpdate, 
    LocationUpdate,
    UserResponse, 
    TokenResponse,
    AuthResponse,
    ErrorResponse,
    NewUserResponse
)

# Create router
router = APIRouter(prefix="/auth", tags=["Authentication"])

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@router.post("/send-otp", response_model=AuthResponse)
@limiter.limit("3/10minute")  # 3 requests per phone per 10 minutes
async def send_otp(request: Request, otp_request: PhoneOTPRequest):
    """
    Send OTP to phone number via Firebase Authentication.
    
    This endpoint validates the phone format and instructs the client
    to use Firebase for OTP generation. Rate limited to prevent abuse.
    """
    try:
        phone = otp_request.phone
        
        # Additional rate limiting per phone number
        redis_client = get_redis_client()
        rate_limit_key = f"otp_rate:{phone}"
        current_count = await redis_client.get(rate_limit_key)
        
        if current_count and int(current_count) >= 3:
            retry_after = await redis_client.ttl(rate_limit_key)
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={
                    "error": "Too many OTP requests",
                    "message": "Please wait before requesting another OTP",
                    "message_hi": "Please wait before requesting another OTP",
                    "retry_after": retry_after
                }
            )
        
        # Increment rate limit counter
        await redis_client.incr(rate_limit_key)
        if current_count is None:
            await redis_client.expire(rate_limit_key, 600)  # 10 minutes
        
        # Log OTP request (masked phone)
        masked_phone = f"+91XXXXXX{phone[-4:]}" if len(phone) > 4 else phone
        logger.info(f"OTP requested for phone: {masked_phone}")
        
        return AuthResponse(
            data={
                "message": "OTP sent via Firebase Authentication",
                "message_hi": "OTP Firebase Authentication ke through bheja gaya hai",
                "phone": phone,
                "instruction": "Use Firebase Auth SDK on client to generate OTP"
            }
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"OTP send failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "OTP send failed",
                "message": "Failed to process OTP request",
                "message_hi": "OTP request process karne mein asafalta"
            }
        )


@router.post("/verify-otp", response_model=NewUserResponse)
@limiter.limit("10/minute")
async def verify_otp(request: Request, verify_request: VerifyOTPRequest):
    """
    Verify OTP using Firebase ID token and authenticate user.
    
    This endpoint verifies the Firebase ID token, creates/retrieves user,
    and generates JWT tokens for API access.
    """
    try:
        phone = verify_request.phone
        otp_token = verify_request.otp_token
        
        # Verify Firebase token
        firebase_data = await auth_service.verify_firebase_token(otp_token)
        
        # Ensure phone matches Firebase token
        if firebase_data["phone"] != phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "Phone mismatch",
                    "message": "Phone number does not match Firebase token",
                    "message_hi": "Phone number Firebase token se match nahi kar raha"
                }
            )
        
        # Get or create user
        user_data = await auth_service.get_or_create_user(phone)
        
        # Create tokens
        tokens = await auth_service.create_tokens(
            user_id=str(user_data["_id"]),
            phone=user_data["phone"],
            role=user_data["role"]
        )
        
        # Check if new user (created within last 5 minutes)
        is_new_user = (
            datetime.utcnow() - user_data["created_at"]
        ).total_seconds() < 300
        
        # Convert to response format
        user_response = UserResponse.model_validate(user_data)
        
        logger.info(f"User authenticated: {phone}")
        
        return NewUserResponse(
            is_new_user=is_new_user,
            user=user_response,
            tokens=tokens,
            onboarding_required=is_new_user
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"OTP verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Verification failed",
                "message": "Failed to verify OTP",
                "message_hi": "OTP verify karne mein asafalta"
            }
        )


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("5/minute")
async def refresh_token(request: Request, refresh_request: RefreshTokenRequest):
    """
    Refresh access token using valid refresh token.
    
    This endpoint validates the refresh token and issues a new access token.
    """
    try:
        tokens = await auth_service.refresh_access_token(refresh_request.refresh_token)
        
        logger.info("Access token refreshed")
        
        return tokens
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Token refresh failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Token refresh failed",
                "message": "Failed to refresh access token",
                "message_hi": "Access token refresh karne mein asafalta"
            }
        )


@router.post("/logout", response_model=AuthResponse)
@limiter.limit("10/minute")
async def logout(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Logout user by invalidating refresh token.
    
    This endpoint removes the refresh token from Redis, effectively
    logging out the user from all sessions.
    """
    try:
        user_id = str(current_user["_id"])
        
        # Logout user
        success = await auth_service.logout(user_id)
        
        if success:
            logger.info(f"User logged out: {user_id}")
            return AuthResponse(
                data={
                    "message": "Logged out successfully",
                    "message_hi": "Safalta se logout kar diya gaya hai"
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "error": "Logout failed",
                    "message": "Failed to logout user",
                    "message_hi": "User logout karne mein asafalta"
                }
            )
            
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Logout failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Logout failed",
                "message": "Failed to logout user",
                "message_hi": "User logout karne mein asafalta"
            }
        )


@router.get("/me", response_model=UserResponse)
@limiter.limit("30/minute")
async def get_current_user_profile(
    request: Request, 
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Get current user profile.
    
    This endpoint returns the complete user profile for the authenticated user.
    """
    try:
        user_response = UserResponse.model_validate(current_user)
        
        logger.info(f"Profile retrieved for user: {current_user['_id']}")
        
        return user_response
        
    except Exception as e:
        logger.error(f"Profile retrieval failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Profile retrieval failed",
                "message": "Failed to get user profile",
                "message_hi": "User profile prapt karne mein asafalta"
            }
        )


@router.patch("/profile", response_model=UserResponse)
@limiter.limit("10/minute")
async def update_profile(
    request: Request,
    profile_update: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user profile information.
    
    This endpoint allows users to update their name, language preference,
    and farm profile information.
    """
    try:
        db = get_database()
        users_collection = db.users
        user_id = current_user["_id"]
        
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        
        if profile_update.name is not None:
            update_data["name"] = profile_update.name
        
        if profile_update.language is not None:
            update_data["language"] = profile_update.language
        
        if profile_update.farm_profile is not None:
            # Merge farm profile updates
            farm_profile = current_user.get("farm_profile", {})
            profile_dict = profile_update.farm_profile.model_dump(exclude_none=True)
            farm_profile.update(profile_dict)
            update_data["farm_profile"] = farm_profile
        
        # Update user in database
        await users_collection.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user = await users_collection.find_one({"_id": user_id})
        
        logger.info(f"Profile updated for user: {user_id}")
        
        return UserResponse.model_validate(updated_user)
        
    except Exception as e:
        logger.error(f"Profile update failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Profile update failed",
                "message": "Failed to update profile",
                "message_hi": "Profile update karne mein asafalta"
            }
        )


@router.patch("/location", response_model=AuthResponse)
@limiter.limit("10/minute")
async def update_location(
    request: Request,
    location_update: LocationUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user's default location.
    
    This endpoint updates the user's default location and also
    upserts the location data into the locations collection.
    """
    try:
        db = get_database()
        users_collection = db.users
        locations_collection = db.locations
        user_id = current_user["_id"]
        
        # Prepare location data
        location_data = location_update.model_dump(exclude_none=True)
        
        if not location_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": "No location data",
                    "message": "At least one location field must be provided",
                    "message_hi": "Kam se kam ek location field dena zaroori hai"
                }
            )
        
        # Update user's default location
        await users_collection.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "default_location": location_data,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Upsert into locations collection
        location_document = {
            "user_id": user_id,
            "location": location_data,
            "is_default": True,
            "updated_at": datetime.utcnow()
        }
        
        await locations_collection.update_one(
            {"user_id": user_id, "is_default": True},
            {"$set": location_document},
            upsert=True
        )
        
        logger.info(f"Location updated for user: {user_id}")
        
        return AuthResponse(
            data={
                "message": "Location updated successfully",
                "message_hi": "Location safalta se update kar diya gaya hai",
                "location": location_data
            }
        )
        
    except HTTPException:
        raise
        
    except Exception as e:
        logger.error(f"Location update failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Location update failed",
                "message": "Failed to update location",
                "message_hi": "Location update karne mein asafalta"
            }
        )
