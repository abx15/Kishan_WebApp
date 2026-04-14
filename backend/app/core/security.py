"""
AgroBrain AI — Security & JWT
bcrypt password hashing + JWT token management.
SECURITY: No shortcuts, no bypasses possible.
"""
from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from loguru import logger
from app.core.config import settings
from app.core.database import get_db


# ─── Password Hashing (bcrypt) ────────────────────────────────────
# bcrypt with 12 rounds — strong enough, not too slow
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def hash_password(password: str) -> str:
    """Hash password with bcrypt (12 rounds). Returns hash string."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against bcrypt hash. Constant-time comparison."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


# ─── JWT Token Management ─────────────────────────────────────────
security_scheme = HTTPBearer(auto_error=False)


def create_access_token(data: dict[str, Any]) -> str:
    """Create short-lived JWT access token (60 min default)."""
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    })
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(data: dict[str, Any]) -> str:
    """Create long-lived JWT refresh token (30 days default)."""
    payload = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    payload.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
    })
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> dict:
    """
    Decode and validate JWT token.
    Raises HTTPException 401 on any failure — no details leaked to client.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id: str = payload.get("sub")
        token_type: str = payload.get("type")

        if not user_id:
            raise credentials_exception
        return payload

    except JWTError as e:
        logger.debug(f"JWT decode failed: {e}")
        raise credentials_exception


# ─── FastAPI Dependencies ─────────────────────────────────────────

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db=Depends(get_db),
) -> dict:
    """
    FastAPI dependency — validates JWT and returns user from DB.
    Use in any protected route: user = Depends(get_current_user)
    """
    from bson import ObjectId

    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_token(token)

    # Must be access token, not refresh token
    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    user_id = payload.get("sub")

    # Fetch user from MongoDB
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    if user.get("is_banned", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended",
        )

    return user


# ─── Role-based Authorization ──────────────────────────────────────

def require_roles(*roles: str):
    """
    Role-based access control dependency.
    Usage: Depends(require_roles("admin", "agronomist"))
    """
    async def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        if current_user.get("role") not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {' or '.join(roles)}",
            )
        return current_user
    return role_checker


# Pre-built role dependencies
require_any_user     = Depends(get_current_user)
require_farmer       = Depends(require_roles("farmer", "agronomist", "admin"))
require_agronomist   = Depends(require_roles("agronomist", "admin"))
require_admin        = Depends(require_roles("admin"))
