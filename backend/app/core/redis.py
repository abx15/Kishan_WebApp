"""
Redis configuration module for AgroBrain AI backend.

This module handles async Redis connection using aioredis with connection pooling,
caching utilities, and graceful fallback handling.
"""

import json
import asyncio
from typing import Any, AsyncGenerator, Optional, Union

import redis.asyncio as aioredis
from redis.asyncio import Redis
from redis.exceptions import ConnectionError, RedisError
from app.core.config import settings
from app.core.logger import logger

# CACHE KEY CONSTANTS
WEATHER_CACHE = "weather:{lat}:{lng}"            # TTL: 600s (10 min)
RECO_CACHE = "reco:{soil_hash}:{season}"          # TTL: 3600s (1 hr)
AI_QUERY_CACHE = "ai:{query_hash}"                # TTL: 3600s (1 hr)
DAILY_TIPS_CACHE = "tips:{user_id}:{date}"        # TTL: till midnight
OTP_RATE_LIMIT = "otp_rl:{phone}"                 # TTL: 600s
SESSION_CACHE = "session:{user_id}"               # TTL: 3600s
ALERT_CACHE = "alerts:{lat}:{lng}"               # TTL: 1800s (30 min)


class RedisManager:
    """Redis connection manager with caching utilities and fallback handling."""
    
    def __init__(self):
        """Initialize Redis manager."""
        self.redis: Optional[Redis] = None
        self._is_available = False
        self._connection_attempts = 0
        self._max_retries = 3
    
    async def connect(self) -> None:
        """Establish Redis connection with retry logic."""
        for attempt in range(self._max_retries):
            try:
                self._connection_attempts = attempt + 1
                
                # Create connection pool
                self.redis = await aioredis.from_url(
                    settings.redis_url,
                    password=settings.redis_password,
                    max_connections=20,
                    retry_on_timeout=True,
                    socket_keepalive=True,
                    socket_keepalive_options={},
                    health_check_interval=30
                )
                
                # Test connection
                await self.redis.ping()
                
                self._is_available = True
                logger.info(
                    f"Successfully connected to Redis (attempt {self._connection_attempts}/{self._max_retries})"
                )
                return
                
            except (ConnectionError, RedisError) as e:
                logger.error(
                    f"Redis connection failed (attempt {self._connection_attempts}/{self._max_retries}): {str(e)}"
                )
                
                if attempt < self._max_retries - 1:
                    delay = 1 * (2 ** attempt)  # Exponential backoff
                    logger.info(f"Retrying Redis connection in {delay} seconds...")
                    await asyncio.sleep(delay)
                else:
                    logger.warning("Redis unavailable - continuing without cache")
                    self._is_available = False
                    self.redis = None
                    return
            
            except Exception as e:
                logger.error(f"Unexpected error connecting to Redis: {str(e)}")
                self._is_available = False
                self.redis = None
                return
    
    async def disconnect(self) -> None:
        """Close Redis connection."""
        if self.redis:
            try:
                await self.redis.close()
                logger.info("Redis connection closed successfully")
            except Exception as e:
                logger.error(f"Error closing Redis connection: {str(e)}")
            finally:
                self.redis = None
                self._is_available = False
    
    async def get_redis_client() -> Redis:
        """
        Get Redis client instance.
        
        Returns:
            Redis: Redis client instance.
        """
        if self.redis is None:
            await self.connect()
        return self.redis

    async def health_check(self) -> bool:
        """
        Check Redis connection health.
        
        Returns:
            bool: True if connection is healthy, False otherwise
        """
        if not self.redis or not self._is_available:
            return False
        
        try:
            await self.redis.ping()
            return True
        except Exception as e:
            logger.error(f"Redis health check failed: {str(e)}")
            self._is_available = False
            return False
    
    def is_available(self) -> bool:
        """
        Check if Redis is available.
        
        Returns:
            bool: True if Redis is available, False otherwise
        """
        return self._is_available and self.redis is not None
    
    async def set_cache(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        serialize: bool = True
    ) -> bool:
        """
        Set value in cache with optional TTL.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds
            serialize: Whether to serialize value as JSON
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.is_available():
            logger.log_cache_operation("set", key, error="Redis unavailable")
            return False
        
        try:
            if serialize:
                value = json.dumps(value, default=str)
            
            if ttl:
                await self.redis.setex(key, ttl, value)
            else:
                await self.redis.set(key, value)
            
            logger.log_cache_operation("set", key)
            return True
            
        except Exception as e:
            logger.log_cache_operation("set", key, error=str(e))
            return False
    
    async def get_cache(
        self,
        key: str,
        deserialize: bool = True
    ) -> Optional[Any]:
        """
        Get value from cache.
        
        Args:
            key: Cache key
            deserialize: Whether to deserialize value from JSON
            
        Returns:
            Optional[Any]: Cached value or None if not found
        """
        if not self.is_available():
            logger.log_cache_operation("get", key, hit=False, error="Redis unavailable")
            return None
        
        try:
            value = await self.redis.get(key)
            
            if value is None:
                logger.log_cache_operation("get", key, hit=False)
                return None
            
            if deserialize:
                value = json.loads(value)
            
            logger.log_cache_operation("get", key, hit=True)
            return value
            
        except Exception as e:
            logger.log_cache_operation("get", key, error=str(e))
            return None
    
    async def delete_cache(self, key: str) -> bool:
        """
        Delete value from cache.
        
        Args:
            key: Cache key
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.is_available():
            logger.log_cache_operation("delete", key, error="Redis unavailable")
            return False
        
        try:
            result = await self.redis.delete(key)
            logger.log_cache_operation("delete", key)
            return bool(result)
            
        except Exception as e:
            logger.log_cache_operation("delete", key, error=str(e))
            return False
    
    async def delete_cache_pattern(self, pattern: str) -> int:
        """
        Delete multiple cache keys matching pattern.
        
        Args:
            pattern: Cache key pattern (supports wildcards)
            
        Returns:
            int: Number of deleted keys
        """
        if not self.is_available():
            logger.log_cache_operation("delete_pattern", pattern, error="Redis unavailable")
            return 0
        
        try:
            keys = await self.redis.keys(pattern)
            if keys:
                result = await self.redis.delete(*keys)
                logger.log_cache_operation("delete_pattern", pattern)
                return result
            return 0
            
        except Exception as e:
            logger.log_cache_operation("delete_pattern", pattern, error=str(e))
            return 0

    # SPECIALIZED HELPERS
    async def set_weather_cache(self, lat: float, lng: float, data: Dict[str, Any]) -> bool:
        """Store weather data in JSON, TTL 600s."""
        # Round to 2 decimals for city-level precision
        lat_r, lng_r = round(lat, 2), round(lng, 2)
        key = WEATHER_CACHE.format(lat=f"{lat_r:.2f}", lng=f"{lng_r:.2f}")
        return await self.set_cache(key, data, ttl=600)

    async def get_weather_cache(self, lat: float, lng: float) -> Optional[Dict[str, Any]]:
        """Return parsed weather dict or None."""
        lat_r, lng_r = round(lat, 2), round(lng, 2)
        key = WEATHER_CACHE.format(lat=f"{lat_r:.2f}", lng=f"{lng_r:.2f}")
        return await self.get_cache(key)

    async def set_reco_cache(self, soil_hash: str, season: str, data: Dict[str, Any]) -> bool:
        """Store recommendation data, TTL 3600s."""
        key = RECO_CACHE.format(soil_hash=soil_hash, season=season)
        return await self.set_cache(key, data, ttl=3600)

    async def get_reco_cache(self, soil_hash: str, season: str) -> Optional[Dict[str, Any]]:
        """Return parsed recommendation dict or None."""
        key = RECO_CACHE.format(soil_hash=soil_hash, season=season)
        return await self.get_cache(key)

    async def increment_otp_attempts(self, phone: str) -> int:
        """Increment OTP attempts, returns count, sets TTL on first call."""
        if not self.is_available():
            return 0
        key = OTP_RATE_LIMIT.format(phone=phone)
        try:
            count = await self.redis.incr(key)
            if count == 1:
                await self.redis.expire(key, 600)
            return count
        except Exception as e:
            logger.error(f"Error incrementing OTP attempts: {str(e)}")
            return 0

    async def get_cache_stats(self) -> Dict[str, Any]:
        """Return cache health stats for /health endpoint."""
        if not self.is_available():
            return {"status": "unavailable"}
        try:
            info = await self.redis.info()
            keyspace = await self.redis.dbsize()
            return {
                "total_keys": keyspace,
                "memory_used": info.get("used_memory_human"),
                "hit_rate": f"{(float(info.get('keyspace_hits', 0)) / (float(info.get('keyspace_hits', 0)) + float(info.get('keyspace_misses', 1))) * 100):.2f}%"
            }
        except Exception as e:
            logger.error(f"Error getting cache stats: {str(e)}")
            return {"status": "error", "message": str(e)}


# Global Redis manager instance
redis_manager = RedisManager()


async def connect_redis() -> None:
    """Connect to Redis."""
    await redis_manager.connect()


async def disconnect_redis() -> None:
    """Disconnect from Redis."""
    await redis_manager.disconnect()


async def get_redis_client() -> Redis:
    """
    Get Redis client instance.
    
    Returns:
        Redis: Redis client instance.
    """
    if redis_manager.redis is None:
        await redis_manager.connect()
    return redis_manager.redis


async def get_redis() -> AsyncGenerator[Redis, None]:
    """
    Dependency injection function to get Redis instance.
    
    Yields:
        Redis: Redis instance
        
    Raises:
        RuntimeError: If Redis is not available
    """
    if not redis_manager.is_available():
        raise RuntimeError("Redis not available")
    
    yield redis_manager.redis


async def get_redis_health() -> bool:
    """
    Get Redis health status.
    
    Returns:
        bool: True if Redis is healthy, False otherwise
    """
    return await redis_manager.health_check()


# Export cache utility functions
async def set_cache(key: str, value: Any, ttl: Optional[int] = None) -> bool:
    """Set value in cache."""
    return await redis_manager.set_cache(key, value, ttl)


async def get_cache(key: str) -> Optional[Any]:
    """Get value from cache."""
    return await redis_manager.get_cache(key)


async def delete_cache(key: str) -> bool:
    """Delete value from cache."""
    return await redis_manager.delete_cache(key)
