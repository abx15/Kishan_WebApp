"""
AgroBrain AI — Upstash Redis Connection
Async Redis with graceful fallback if unavailable.
"""
import json
from typing import Any, Optional
from loguru import logger
import redis.asyncio as aioredis
from app.core.config import settings


class RedisClient:
    client: Optional[aioredis.Redis] = None
    available: bool = False


redis_instance = RedisClient()


async def connect_redis() -> None:
    """Connect to Upstash Redis."""
    try:
        logger.info("Connecting to Upstash Redis...")
        redis_instance.client = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
            retry_on_timeout=True,
        )
        # Test connection
        await redis_instance.client.ping()
        redis_instance.available = True
        logger.success("✅ Upstash Redis connected")
    except Exception as e:
        redis_instance.available = False
        logger.warning(f"⚠️ Redis unavailable (will run without cache): {e}")


async def disconnect_redis() -> None:
    if redis_instance.client:
        await redis_instance.client.aclose()
        logger.info("Redis connection closed.")


def get_redis() -> Optional[aioredis.Redis]:
    """Dependency injection. Returns None if Redis unavailable."""
    return redis_instance.client if redis_instance.available else None


# Alias so both get_redis and get_redis_client work as dependency names
get_redis_client = get_redis


# ─── Cache Helpers ────────────────────────────────────────────────

async def set_cache(key: str, value: Any, ttl: int = 300) -> bool:
    """Store JSON value with TTL. Returns False silently if Redis down."""
    if not redis_instance.available or not redis_instance.client:
        return False
    try:
        await redis_instance.client.setex(key, ttl, json.dumps(value, default=str))
        return True
    except Exception as e:
        logger.debug(f"Cache set failed for {key}: {e}")
        return False


async def get_cache(key: str) -> Optional[Any]:
    """Get cached value. Returns None if missing or Redis down."""
    if not redis_instance.available or not redis_instance.client:
        return None
    try:
        data = await redis_instance.client.get(key)
        return json.loads(data) if data else None
    except Exception as e:
        logger.debug(f"Cache get failed for {key}: {e}")
        return None


async def delete_cache(key: str) -> bool:
    if not redis_instance.available or not redis_instance.client:
        return False
    try:
        await redis_instance.client.delete(key)
        return True
    except Exception:
        return False


async def set_otp_rate_limit(phone_or_email: str) -> int:
    """Increment OTP attempt counter. Returns current count."""
    if not redis_instance.available or not redis_instance.client:
        return 0
    key = f"otp_rl:{phone_or_email}"
    try:
        count = await redis_instance.client.incr(key)
        if count == 1:
            await redis_instance.client.expire(key, 600)  # 10 min window
        return count
    except Exception:
        return 0


async def store_refresh_token(user_id: str, token: str, ttl_days: int = 30) -> None:
    """Store refresh token in Redis."""
    key = f"refresh:{user_id}"
    await set_cache(key, token, ttl=ttl_days * 86400)


async def get_refresh_token(user_id: str) -> Optional[str]:
    """Get stored refresh token."""
    return await get_cache(f"refresh:{user_id}")


async def delete_refresh_token(user_id: str) -> None:
    """Invalidate refresh token (logout)."""
    await delete_cache(f"refresh:{user_id}")
