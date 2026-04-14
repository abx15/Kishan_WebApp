#!/usr/bin/env python3
"""
Test Redis connection
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.redis import connect_redis, disconnect_redis, get_redis_client

async def test_redis():
    """Test Redis connection"""
    try:
        print("Connecting to Redis...")
        await connect_redis()
        
        redis = get_redis_client()
        print(f"Redis client: {redis}")
        
        # Test set/get
        await redis.set("test_key", "test_value", ex=60)
        value = await redis.get("test_key")
        print(f"Redis test: {value}")
        
        await disconnect_redis()
        print("Redis test successful!")
        
    except Exception as e:
        print(f"Redis test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_redis())
