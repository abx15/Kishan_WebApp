"""
Redis configuration module for AgroBrain AI backend.

This module handles async Redis connection using aioredis with connection pooling,
caching utilities, and graceful fallback handling.
"""

import json
import asyncio
from typing import Any, AsyncGenerator, Optional, Union

import aioredis
from aioredis import Redis
from aioredis.exceptions import ConnectionError, RedisError
+
from app.core.config import settings
from app.core.logger import logger


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


# Global Redis manager instance
redis_manager = RedisManager()


async def connect_redis() -> None:
    """Connect to Redis."""
    await redis_manager.connect()


async def disconnect_redis() -> None:
    """Disconnect from Redis."""
    await redis_manager.disconnect()


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
