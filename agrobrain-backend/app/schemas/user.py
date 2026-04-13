"""
Pydantic schemas for user authentication and profile management.

This module defines request/response schemas for authentication endpoints
with proper validation and error handling for Indian farmer use case.
"""

from datetime import datetime
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field, validator, ConfigDict
import re


class PhoneOTPRequest(BaseModel):
    """Request schema for sending OTP to phone number."""
    
    phone: str = Field(
        ...,
        description="Phone number in E.164 format (+91XXXXXXXXXX)",
        min_length=13,
        max_length=13
    )
    
    @validator('phone')
    def validate_phone_format(cls, v):
        """Validate phone number is in E.164 format for India."""
        # E.164 format for India: +91 followed by 10 digits
        pattern = r'^\+91[6-9]\d{9}$'
        if not re.match(pattern, v):
            raise ValueError(
                "Phone number must be in E.164 format for India: +91XXXXXXXXXX"
            )
        return v


class VerifyOTPRequest(BaseModel):
    """Request schema for verifying OTP with Firebase ID token."""
    
    phone: str = Field(
        ...,
        description="Phone number in E.164 format (+91XXXXXXXXXX)",
        min_length=13,
        max_length=13
    )
    otp_token: str = Field(
        ...,
        description="Firebase ID token from client-side authentication"
    )
    
    @validator('phone')
    def validate_phone_format(cls, v):
        """Validate phone number is in E.164 format for India."""
        pattern = r'^\+91[6-9]\d{9}$'
        if not re.match(pattern, v):
            raise ValueError(
                "Phone number must be in E.164 format for India: +91XXXXXXXXXX"
            )
        return v


class RefreshTokenRequest(BaseModel):
    """Request schema for refreshing access token."""
    
    refresh_token: str = Field(
        ...,
        description="JWT refresh token"
    )


class LocationUpdate(BaseModel):
    """Schema for updating user location."""
    
    lat: Optional[float] = Field(None, ge=-90, le=90, description="Latitude")
    lng: Optional[float] = Field(None, ge=-180, le=180, description="Longitude")
    village: Optional[str] = Field(None, max_length=100, description="Village name")
    district: Optional[str] = Field(None, max_length=100, description="District name")
    state: Optional[str] = Field(None, max_length=100, description="State name")
    pincode: Optional[str] = Field(None, pattern=r'^\d{6}$', description="6-digit PIN code")


class FarmProfileUpdate(BaseModel):
    """Schema for updating farm profile."""
    
    total_area_acres: Optional[float] = Field(None, gt=0, description="Total farm area in acres")
    soil_type: Optional[str] = Field(None, max_length=50, description="Soil type")
    primary_crops: Optional[List[str]] = Field(None, max_items=10, description="Primary crops grown")
    irrigation_type: Optional[str] = Field(None, max_length=50, description="Irrigation type")
    has_soil_sensor: Optional[bool] = Field(None, description="Whether user has soil sensor")


class UserProfileUpdate(BaseModel):
    """Schema for updating user profile."""
    
    name: Optional[str] = Field(None, min_length=2, max_length=100, description="User name")
    language: Optional[str] = Field(None, pattern=r'^(hi|en)$', description="Language preference")
    farm_profile: Optional[FarmProfileUpdate] = Field(None, description="Farm profile updates")
    
    @validator('language')
    def validate_language(cls, v):
        """Validate language is either Hindi or English."""
        if v not in ["hi", "en"]:
            raise ValueError("Language must be either 'hi' (Hindi) or 'en' (English)")
        return v


class UserResponse(BaseModel):
    """Response schema for user profile (safe, no sensitive data)."""
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
    
    id: str = Field(..., description="User ID")
    phone: str = Field(..., description="Phone number (masked)")
    name: Optional[str] = Field(None, description="User name")
    language: str = Field(..., description="Language preference")
    avatar_url: Optional[str] = Field(None, description="Avatar URL")
    default_location: Dict[str, Any] = Field(default_factory=dict, description="Default location")
    farm_profile: Dict[str, Any] = Field(default_factory=dict, description="Farm profile")
    is_verified: bool = Field(..., description="Whether user is verified")
    is_active: bool = Field(..., description="Whether user is active")
    role: str = Field(..., description="User role")
    created_at: datetime = Field(..., description="Account creation time")
    last_login: Optional[datetime] = Field(None, description="Last login time")
    
    @validator('phone', pre=True, always=True)
    def mask_phone(cls, v):
        """Mask phone number for privacy."""
        if isinstance(v, str) and len(v) == 13 and v.startswith('+91'):
            return f"+91XXXXXX{v[-4:]}"
        return v


class TokenResponse(BaseModel):
    """Response schema for authentication tokens."""
    
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="Bearer", description="Token type")
    expires_in: int = Field(..., description="Access token expiration in seconds")


class AuthResponse(BaseModel):
    """Combined response for authentication endpoints."""
    
    success: bool = Field(default=True, description="Request success status")
    data: Dict[str, Any] = Field(..., description="Response data")
    message: Optional[str] = Field(None, description="Success message")
    message_hi: Optional[str] = Field(None, description="Success message in Hindi")


class ErrorResponse(BaseModel):
    """Standard error response schema."""
    
    success: bool = Field(default=False, description="Request success status")
    error: str = Field(..., description="Error type")
    message: str = Field(..., description="Error message in English")
    message_hi: str = Field(..., description="Error message in Hindi")
    retry_after: Optional[int] = Field(None, description="Retry after seconds (for rate limits)")


class NewUserResponse(BaseModel):
    """Response for first-time user login."""
    
    is_new_user: bool = Field(..., description="Whether this is a new user")
    user: UserResponse = Field(..., description="User profile")
    tokens: TokenResponse = Field(..., description="Authentication tokens")
    onboarding_required: bool = Field(default=True, description="Whether onboarding is required")


class HealthResponse(BaseModel):
    """Health check response schema."""
    
    status: str = Field(..., description="Health status")
    version: str = Field(..., description="App version")
    environment: str = Field(..., description="Environment")
    services: Dict[str, str] = Field(..., description="Service health status")
    timestamp: float = Field(..., description="Response timestamp")
