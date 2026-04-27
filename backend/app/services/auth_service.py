"""
AgroBrain AI — Authentication Service
Handles: register, login, token refresh, logout, password reset.
Security: bcrypt hashing, JWT tokens, Redis session management.
"""
import uuid
from datetime import datetime, timezone
from typing import Optional
from bson import ObjectId
from loguru import logger

from app.core.security import (
    hash_password, verify_password,
    create_access_token, create_refresh_token, decode_token
)
from app.core.redis import (
    store_refresh_token, get_refresh_token, delete_refresh_token
)
from app.core.config import settings
from app.schemas.user import (
    RegisterRequest, LoginRequest, TokenResponse, UserResponse
)


class AuthService:

    # ─── Register ─────────────────────────────────────────────────

    @staticmethod
    async def register(request: RegisterRequest, db) -> dict:
        """Register new user. Checks uniqueness, hashes password."""

        # 1. Check email uniqueness (case-insensitive)
        existing_email = await db.users.find_one(
            {"email": request.email.lower()}
        )
        if existing_email:
            raise ValueError("EMAIL_EXISTS")

        # 2. Check username uniqueness
        existing_username = await db.users.find_one(
            {"username": request.username.lower()}
        )
        if existing_username:
            raise ValueError("USERNAME_EXISTS")

        # 3. Check phone uniqueness (if provided)
        if request.phone:
            existing_phone = await db.users.find_one({"phone": request.phone})
            if existing_phone:
                raise ValueError("PHONE_EXISTS")

        # 4. Hash password with bcrypt
        hashed_pw = hash_password(request.password)

        # 5. Build user document
        now = datetime.now(timezone.utc)
        user_doc = {
            "username"              : request.username.lower(),
            "email"                 : request.email.lower(),
            "phone"                 : request.phone,
            "name"                  : request.name.strip(),
            "hashed_password"       : hashed_pw,
            "auth_provider"         : "email",
            "role"                  : request.role,
            "language"              : request.language,
            "is_verified"           : True,   # Auto-verify in dev (set False in prod + send email)
            "is_active"             : True,
            "is_banned"             : False,
            "avatar_url"            : None,
            "bio"                   : None,
            "email_verify_token"    : str(uuid.uuid4()),
            "password_reset_token"  : None,
            "password_reset_expires": None,
            "default_location"      : {
                "lat": 0.0, "lng": 0.0,
                "village": "", "district": "", "state": "", "pincode": ""
            },
            "farm_profile": {
                "total_area_acres": 0.0,
                "soil_type": "",
                "primary_crops": [],
                "irrigation_type": "",
                "has_soil_sensor": False,
            },
            "agronomist_profile": {
                "specialization": [],
                "experience_years": 0,
                "states_served": [],
                "is_approved": False,
            },
            "login_count": 0,
            "last_login" : None,
            "created_at" : now,
            "updated_at" : now,
        }

        # 6. Insert into MongoDB
        result = await db.users.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id

        logger.info(f"New user registered: {request.email} | role: {request.role}")

        return {
            "user_id": str(result.inserted_id),
            "email"  : request.email,
            "message": "Registration successful! You can now login.",
        }

    # ─── Login ────────────────────────────────────────────────────

    @staticmethod
    async def login(request: LoginRequest, db) -> TokenResponse:
        """
        Authenticate user and return JWT tokens.
        Security: Never reveal whether email or password is wrong.
        """
        GENERIC_ERROR = "Invalid email or password"

        # 1. Find user by email (case-insensitive)
        user = await db.users.find_one({"email": request.email.lower()})
        if not user:
            # Timing attack prevention: still run hash even if user not found
            verify_password("dummy", hash_password("dummy"))
            raise ValueError(GENERIC_ERROR)

        # 2. Verify password
        if not user.get("hashed_password"):
            raise ValueError("This account uses Google login. Please use Google.")

        is_valid = verify_password(request.password, user["hashed_password"])
        if not is_valid:
            logger.warning(f"Failed login attempt for: {request.email}")
            raise ValueError(GENERIC_ERROR)

        # 3. Check account status
        if not user.get("is_active", True):
            raise ValueError("Your account has been deactivated. Contact support.")

        if user.get("is_banned", False):
            raise ValueError("Your account has been suspended. Contact support.")

        # 4. Update last_login + login_count
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {"last_login": datetime.now(timezone.utc)},
                "$inc": {"login_count": 1},
            }
        )

        # 5. Create tokens
        user_id = str(user["_id"])
        token_data = {
            "sub" : user_id,
            "role": user.get("role", "farmer"),
            "email": user.get("email", ""),
        }

        access_token  = create_access_token(token_data)
        refresh_token = create_refresh_token({"sub": user_id})

        # 6. Store refresh token in Redis
        await store_refresh_token(
            user_id, refresh_token,
            ttl_days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

        logger.info(f"User logged in: {request.email}")

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_seconds,
            user=UserResponse.from_mongo(user),
        )

    # ─── Refresh Token ────────────────────────────────────────────

    @staticmethod
    async def refresh_access_token(refresh_token: str, db) -> TokenResponse:
        """Issue new access token using valid refresh token."""
        from fastapi import HTTPException, status

        try:
            payload = decode_token(refresh_token)
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user_id = payload.get("sub")

        # Verify token is in Redis (not revoked)
        stored = await get_refresh_token(user_id)
        if not stored or stored != refresh_token:
            raise HTTPException(
                status_code=401,
                detail="Refresh token expired or revoked. Please login again."
            )

        # Fetch user
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user or not user.get("is_active"):
            raise HTTPException(status_code=401, detail="User not found")

        # Issue new access token
        new_access = create_access_token({
            "sub"  : user_id,
            "role" : user.get("role", "farmer"),
            "email": user.get("email", ""),
        })

        return TokenResponse(
            access_token=new_access,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_seconds,
            user=UserResponse.from_mongo(user),
        )

    # ─── Logout ───────────────────────────────────────────────────

    @staticmethod
    async def logout(user_id: str) -> None:
        """Invalidate refresh token (Redis delete)."""
        await delete_refresh_token(user_id)
        logger.info(f"User logged out: {user_id}")

    # ─── Check Availability ───────────────────────────────────────

    @staticmethod
    async def check_email_available(email: str, db) -> bool:
        user = await db.users.find_one({"email": email.lower()})
        return user is None

    @staticmethod
    async def check_username_available(username: str, db) -> bool:
        user = await db.users.find_one({"username": username.lower()})
        return user is None

    # ─── Get User by ID ───────────────────────────────────────────

    @staticmethod
    async def get_user_by_id(user_id: str, db) -> Optional[dict]:
        try:
            return await db.users.find_one({"_id": ObjectId(user_id)})
        except Exception:
            return None

    # ─── Change Password ──────────────────────────────────────────

    @staticmethod
    async def change_password(
        user: dict, current_password: str, new_password: str, db
    ) -> None:
        if not verify_password(current_password, user["hashed_password"]):
            raise ValueError("Current password is incorrect")
        new_hash = hash_password(new_password)
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"hashed_password": new_hash, "updated_at": datetime.now(timezone.utc)}}
        )
        # Invalidate all sessions
        await delete_refresh_token(str(user["_id"]))
        logger.info(f"Password changed for user: {user['email']}")


# ─── Singleton instance (for legacy imports) ───────────────────────────────────────
auth_service = AuthService()

# Re-export get_current_user here so routes importing from auth_service still work
from app.core.security import get_current_user  # noqa: E402,F401

