"""
Rate limiting middleware for AgroBrain AI backend.

This module provides Redis-based rate limiting using SlowAPI with
custom error responses in both Hindi and English for Indian farmers.
"""

from typing import Dict, Any
from fastapi import Request, Response
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.requests import Request as StarletteRequest

from app.core.redis import get_redis_client
from app.core.logger import logger


class CustomRateLimiter:
    """Custom rate limiter with Redis backend and bilingual error messages."""
    
    def __init__(self):
        """Initialize rate limiter with Redis backend."""
        self.logger = logger.bind(middleware="rate_limiter")
        self.redis_client = get_redis_client()
        
        # Create SlowAPI limiter with custom key function
        self.limiter = Limiter(
            key_func=self._get_key,
            storage_uri=f"redis://localhost:6379",  # Will use our Redis client
            default_limits=["60/minute"]  # Default: 60 requests per minute per IP
        )
    
    def _get_key(self, request: Request) -> str:
        """
        Generate rate limit key based on IP address and user ID if available.
        
        Args:
            request: FastAPI request object
            
        Returns:
            Rate limit key string
        """
        # Get client IP
        ip = get_remote_address(request)
        
        # Get user ID from header if available (for authenticated requests)
        user_id = request.headers.get("X-User-ID")
        
        if user_id:
            return f"user:{user_id}"
        else:
            return f"ip:{ip}"
    
    async def get_redis_key(self, key: str) -> str:
        """
        Get current value for rate limit key from Redis.
        
        Args:
            key: Rate limit key
            
        Returns:
            Current count as string
        """
        try:
            value = await self.redis_client.get(key)
            return value or "0"
        except Exception as e:
            self.logger.error(f"Redis get failed for key {key}: {str(e)}")
            return "0"
    
    async def set_redis_key(self, key: str, value: str, expire: int = 60) -> bool:
        """
        Set rate limit key in Redis with expiration.
        
        Args:
            key: Rate limit key
            value: Value to set
            expire: Expiration time in seconds
            
        Returns:
            True if successful
        """
        try:
            await self.redis_client.setex(key, expire, value)
            return True
        except Exception as e:
            self.logger.error(f"Redis set failed for key {key}: {str(e)}")
            return False
    
    async def increment_key(self, key: str, expire: int = 60) -> int:
        """
        Increment rate limit counter and return new value.
        
        Args:
            key: Rate limit key
            expire: Expiration time in seconds
            
        Returns:
            New count value
        """
        try:
            # Use Redis INCR with expiration
            pipe = self.redis_client.pipeline()
            pipe.incr(key)
            pipe.expire(key, expire)
            result = await pipe.execute()
            return result[0] or 0
        except Exception as e:
            self.logger.error(f"Redis increment failed for key {key}: {str(e)}")
            return 0


# Custom rate limit exception handler
async def custom_rate_limit_handler(request: Request, exc: RateLimitExceeded) -> Response:
    """
    Handle rate limit exceeded with bilingual error messages.
    
    Args:
        request: FastAPI request object
        exc: Rate limit exceeded exception
        
    Returns:
        JSON response with error details
    """
    logger.warning(f"Rate limit exceeded for {get_remote_address(request)} on {request.url.path}")
    
    # Get retry after from exception if available
    retry_after = getattr(exc, 'retry-after', 60)
    
    # Bilingual error response
    error_response = {
        "success": False,
        "error": "Too many requests",
        "message": "You have exceeded the rate limit. Please try again later.",
        "message_hi": "aapne rate limit cross kar li hai. Kripya thodi der baad phir koshish karein.",
        "retry_after": retry_after,
        "path": request.url.path
    }
    
    return Response(
        content=str(error_response),
        status_code=429,
        media_type="application/json",
        headers={"Retry-After": str(retry_after)}
    )


# Rate limiting decorators for different endpoints
def rate_limit_auth_otp():
    """Rate limit decorator for OTP send endpoint: 3 requests per 10 minutes per phone."""
    def decorator(func):
        async def wrapper(request: Request, *args, **kwargs):
            # Extract phone from request body for phone-specific limiting
            try:
                body = await request.json()
                phone = body.get('phone', '')
                if phone:
                    # Phone-specific rate limiting
                    key = f"otp_phone:{phone}"
                    redis_client = get_redis_client()
                    
                    current_count = await redis_client.get(key)
                    if current_count and int(current_count) >= 3:
                        retry_after = await redis_client.ttl(key)
                        return Response(
                            content=str({
                                "success": False,
                                "error": "Too many OTP requests",
                                "message": "Please wait before requesting another OTP.",
                                "message_hi": "Ek aur OTP maangne se pehle kripya intezaar karein.",
                                "retry_after": retry_after
                            }),
                            status_code=429,
                            media_type="application/json"
                        )
                    
                    # Increment counter
                    await redis_client.incr(key)
                    if current_count is None:
                        await redis_client.expire(key, 600)  # 10 minutes
            except Exception:
                pass  # If we can't extract phone, continue with normal rate limiting
            
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator


def rate_limit_auth_verify():
    """Rate limit decorator for OTP verification: 10 requests per minute per IP."""
    def decorator(func):
        func.__rate_limit__ = "10/minute"
        return func
    return decorator


def rate_limit_profile():
    """Rate limit decorator for profile updates: 10 requests per minute per user."""
    def decorator(func):
        func.__rate_limit__ = "10/minute"
        return func
    return decorator


def rate_limit_general():
    """Rate limit decorator for general endpoints: 60 requests per minute per IP."""
    def decorator(func):
        func.__rate_limit__ = "60/minute"
        return func
    return decorator


# Create global rate limiter instance
rate_limiter = CustomRateLimiter()

# Export the limiter for use in main.py
limiter = rate_limiter.limiter

# Export custom exception handler
rate_limit_exception_handler = custom_rate_limit_handler
