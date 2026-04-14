"""
AgroBrain AI — User Pydantic Schemas (v2)
Input validation + output serialization.
"""
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from bson import ObjectId
import re


# ─── Validators ──────────────────────────────────────────────────

def validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if len(v) > 64:
        raise ValueError("Password must not exceed 64 characters")
    if not any(c.isupper() for c in v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not any(c.islower() for c in v):
        raise ValueError("Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in v):
        raise ValueError("Password must contain at least one number")
    return v


# ─── Request Schemas ──────────────────────────────────────────────

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=64)
    name: str = Field(..., min_length=2, max_length=50)
    phone: Optional[str] = None
    language: Literal["hi", "en"] = "hi"
    role: Literal["farmer", "agronomist", "admin"] = "farmer"

    @field_validator("username")
    @classmethod
    def username_valid(cls, v: str) -> str:
        v = v.lower().strip()
        if not re.match(r'^[a-z0-9_]+$', v):
            raise ValueError("Username can only contain lowercase letters, numbers, and underscores")
        return v

    @field_validator("password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        return validate_password_strength(v)

    @field_validator("phone")
    @classmethod
    def phone_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        # Remove spaces/dashes
        v = re.sub(r'[\s\-\(\)]', '', v)
        if not re.match(r'^\+?[1-9]\d{9,14}$', v):
            raise ValueError("Invalid phone number format")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8, max_length=64)

    @field_validator("new_password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        return validate_password_strength(v)


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=64)

    @field_validator("new_password")
    @classmethod
    def password_strong(cls, v: str) -> str:
        return validate_password_strength(v)


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=50)
    username: Optional[str] = Field(None, min_length=3, max_length=20)
    bio: Optional[str] = Field(None, max_length=200)
    language: Optional[Literal["hi", "en"]] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# ─── Response Schemas ─────────────────────────────────────────────

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    name: str
    role: str
    is_verified: bool
    is_active: bool
    language: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    created_at: datetime

    @classmethod
    def from_mongo(cls, user: dict) -> "UserResponse":
        """Convert MongoDB document to response schema."""
        return cls(
            id=str(user["_id"]),
            username=user.get("username", ""),
            email=user.get("email", ""),
            name=user.get("name", ""),
            role=user.get("role", "farmer"),
            is_verified=user.get("is_verified", False),
            is_active=user.get("is_active", True),
            language=user.get("language", "hi"),
            avatar_url=user.get("avatar_url"),
            bio=user.get("bio"),
            created_at=user.get("created_at", datetime.utcnow()),
        )


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse


class MessageResponse(BaseModel):
    success: bool
    message: str
    message_hi: Optional[str] = None


class CheckAvailabilityResponse(BaseModel):
    available: bool
    message: str
