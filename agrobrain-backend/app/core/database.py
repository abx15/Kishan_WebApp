"""
Database configuration module for AgroBrain AI backend.

This module handles async MongoDB connection using motor with connection pooling,
retry logic, and proper error handling.
"""

import asyncio
from typing import AsyncGenerator, Optional

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import ConnectionFailure, OperationFailure

from app.core.config import settings
from app.core.logger import logger


class DatabaseManager:
    """MongoDB connection manager with retry logic and connection pooling."""
    
    def __init__(self):
        """Initialize database manager."""
        self.client: Optional[AsyncIOMotorClient] = None
        self.database: Optional[AsyncIOMotorDatabase] = None
        self._connection_attempts = 0
        self._max_retries = 3
        self._retry_delay = 1  # Initial delay in seconds
    
    async def connect(self) -> None:
        """
        Establish MongoDB connection with retry logic.
        
        Raises:
            ConnectionFailure: If unable to connect after max retries
        """
        for attempt in range(self._max_retries):
            try:
                self._connection_attempts = attempt + 1
                
                # Create client with connection pooling
                self.client = AsyncIOMotorClient(
                    settings.mongodb_url,
                    maxPoolSize=20,
                    minPoolSize=5,
                    maxIdleTimeMS=30000,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                    retryWrites=True,
                    w="majority"
                )
                
                # Test connection
                await self.client.admin.command('ping')
                
                # Get database instance
                self.database = self.client[settings.mongodb_db_name]
                
                logger.info(
                    f"Successfully connected to MongoDB database '{settings.mongodb_db_name}' "
                    f"(attempt {self._connection_attempts}/{self._max_retries})"
                )
                return
                
            except ConnectionFailure as e:
                logger.error(
                    f"MongoDB connection failed (attempt {self._connection_attempts}/{self._max_retries}): {str(e)}"
                )
                
                if attempt < self._max_retries - 1:
                    # Exponential backoff
                    delay = self._retry_delay * (2 ** attempt)
                    logger.info(f"Retrying MongoDB connection in {delay} seconds...")
                    await asyncio.sleep(delay)
                else:
                    raise ConnectionFailure(
                        f"Failed to connect to MongoDB after {self._max_retries} attempts"
                    ) from e
            
            except Exception as e:
                logger.error(f"Unexpected error connecting to MongoDB: {str(e)}")
                raise
    
    async def disconnect(self) -> None:
        """Close MongoDB connection."""
        if self.client:
            try:
                self.client.close()
                logger.info("MongoDB connection closed successfully")
            except Exception as e:
                logger.error(f"Error closing MongoDB connection: {str(e)}")
            finally:
                self.client = None
                self.database = None
    
    async def health_check(self) -> bool:
        """
        Check MongoDB connection health.
        
        Returns:
            bool: True if connection is healthy, False otherwise
        """
        if not self.client or not self.database:
            return False
        
        try:
            await self.client.admin.command('ping')
            return True
        except Exception as e:
            logger.error(f"MongoDB health check failed: {str(e)}")
            return False
    
    def get_database(self) -> AsyncIOMotorDatabase:
        """
        Get database instance.
        
        Returns:
            AsyncIOMotorDatabase: Database instance
            
        Raises:
            RuntimeError: If database is not connected
        """
        if not self.database:
            raise RuntimeError("Database not connected. Call connect() first.")
        return self.database


# Global database manager instance
db_manager = DatabaseManager()


async def connect_db() -> None:
    """Connect to MongoDB database."""
    await db_manager.connect()


async def disconnect_db() -> None:
    """Disconnect from MongoDB database."""
    await db_manager.disconnect()


async def get_database() -> AsyncGenerator[AsyncIOMotorDatabase, None]:
    """
    Dependency injection function to get database instance.
    
    Yields:
        AsyncIOMotorDatabase: Database instance
        
    Raises:
        HTTPException: If database is not available
    """
    try:
        database = db_manager.get_database()
        yield database
    except RuntimeError as e:
        logger.error(f"Database dependency injection failed: {str(e)}")
        raise


async def get_db_health() -> bool:
    """
    Get database health status.
    
    Returns:
        bool: True if database is healthy, False otherwise
    """
    return await db_manager.health_check()
