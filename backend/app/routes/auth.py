"""
AgroBrain AI — Auth Routes
All authentication endpoints with proper error handling.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from loguru import logger

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.auth_service import AuthService
from app.schemas.user import (
    RegisterRequest, LoginRequest, RefreshTokenRequest,
    ChangePasswordRequest, UpdateProfileRequest,
    TokenResponse, UserResponse, MessageResponse,
    CheckAvailabilityResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


def success(data: dict = None, message: str = "Success") -> dict:
    """Standard success response wrapper."""
    return {"success": True, "message": message, "data": data or {}}


def error_response(status_code: int, detail: str) -> HTTPException:
    """Standard error response."""
    return HTTPException(status_code=status_code, detail=detail)


# ─────────────────────────────────────────────────────────────────
# POST /auth/register
# ─────────────────────────────────────────────────────────────────
@router.post("/register", status_code=201)
async def register(request: RegisterRequest, db=Depends(get_db)):
    """Register new farmer or agronomist account."""
    try:
        result = await AuthService.register(request, db)
        return success(result, "Account created successfully!")
    except ValueError as e:
        error_map = {
            "EMAIL_EXISTS"   : (409, "This email is already registered. Please login."),
            "USERNAME_EXISTS": (409, "This username is already taken. Try another."),
            "PHONE_EXISTS"   : (409, "This phone number is already registered."),
        }
        code, msg = error_map.get(str(e), (400, str(e)))
        raise error_response(code, msg)
    except Exception as e:
        logger.error(f"Registration error: {e}")
        raise error_response(500, "Registration failed. Please try again.")


# ─────────────────────────────────────────────────────────────────
# POST /auth/login
# ─────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db=Depends(get_db)):
    """Login with email and password. Returns JWT tokens."""
    try:
        token_response = await AuthService.login(request, db)
        return token_response
    except ValueError as e:
        raise error_response(401, str(e))
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise error_response(500, "Login failed. Please try again.")


# ─────────────────────────────────────────────────────────────────
# POST /auth/refresh
# ─────────────────────────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, db=Depends(get_db)):
    """Refresh access token using valid refresh token."""
    return await AuthService.refresh_access_token(request.refresh_token, db)


# ─────────────────────────────────────────────────────────────────
# POST /auth/logout
# ─────────────────────────────────────────────────────────────────
@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout — invalidates refresh token."""
    await AuthService.logout(str(current_user["_id"]))
    return success(message="Logged out successfully")


# ─────────────────────────────────────────────────────────────────
# GET /auth/me
# ─────────────────────────────────────────────────────────────────
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return UserResponse.from_mongo(current_user)


# ─────────────────────────────────────────────────────────────────
# PATCH /auth/profile
# ─────────────────────────────────────────────────────────────────
@router.patch("/profile")
async def update_profile(
    request: UpdateProfileRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Update user profile (name, username, bio, language)."""
    from datetime import datetime, timezone
    from bson import ObjectId

    update_data = {}

    if request.username and request.username != current_user.get("username"):
        if not await AuthService.check_username_available(request.username, db):
            raise error_response(409, "Username already taken")
        update_data["username"] = request.username.lower()

    if request.name:
        update_data["name"] = request.name.strip()
    if request.bio is not None:
        update_data["bio"] = request.bio
    if request.language:
        update_data["language"] = request.language

    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )

    updated = await db.users.find_one({"_id": current_user["_id"]})
    return UserResponse.from_mongo(updated)


# ─────────────────────────────────────────────────────────────────
# POST /auth/change-password
# ─────────────────────────────────────────────────────────────────
@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    """Change password. Invalidates all sessions."""
    try:
        await AuthService.change_password(
            current_user,
            request.current_password,
            request.new_password,
            db,
        )
        return success(message="Password changed. Please login again.")
    except ValueError as e:
        raise error_response(400, str(e))


# ─────────────────────────────────────────────────────────────────
# GET /auth/check-username
# ─────────────────────────────────────────────────────────────────
@router.get("/check-username", response_model=CheckAvailabilityResponse)
async def check_username(username: str, db=Depends(get_db)):
    """Check if username is available (for real-time validation)."""
    available = await AuthService.check_username_available(username, db)
    return CheckAvailabilityResponse(
        available=available,
        message="Username is available" if available else "Username is already taken",
    )


# ─────────────────────────────────────────────────────────────────
# GET /auth/check-email
# ─────────────────────────────────────────────────────────────────
@router.get("/check-email", response_model=CheckAvailabilityResponse)
async def check_email(email: str, db=Depends(get_db)):
    """Check if email is available (for real-time validation)."""
    available = await AuthService.check_email_available(email, db)
    return CheckAvailabilityResponse(
        available=available,
        message="Email is available" if available else "Email already registered",
    )
