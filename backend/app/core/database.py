"""
AgroBrain AI — MongoDB Atlas Connection
Uses motor (async) with connection pooling and retry logic.
"""
import asyncio
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from loguru import logger
from app.core.config import settings


class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None


db_instance = Database()


async def connect_db(retries: int = 3, delay: float = 2.0) -> None:
    """Connect to MongoDB Atlas with retry logic."""
    for attempt in range(1, retries + 1):
        try:
            logger.info(f"Connecting to MongoDB Atlas (attempt {attempt}/{retries})...")

            # Fix for DNS issues on Indian ISPs
            import dns.resolver
            dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
            dns.resolver.default_resolver.nameservers = ["8.8.8.8", "8.8.4.4"]

            db_instance.client = AsyncIOMotorClient(
                settings.MONGODB_URL,
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=10000,
                maxPoolSize=20,
                minPoolSize=5,
            )

            # Test connection
            await db_instance.client.admin.command("ping")
            db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]

            # Create indexes
            await create_indexes()

            logger.success(f"✅ MongoDB Atlas connected → {settings.MONGODB_DB_NAME}")
            return

        except Exception as e:
            logger.error(f"❌ MongoDB connection failed (attempt {attempt}): {e}")
            if attempt < retries:
                await asyncio.sleep(delay * attempt)
            else:
                raise RuntimeError(f"Cannot connect to MongoDB after {retries} attempts: {e}")


async def disconnect_db() -> None:
    """Close MongoDB connection."""
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")


async def create_indexes() -> None:
    """Create all required MongoDB indexes."""
    db = db_instance.db
    try:
        # users collection
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.users.create_index(
            "phone", unique=True, sparse=True
        )
        await db.users.create_index("created_at")
        await db.users.create_index("role")

        # weather_logs - TTL: auto-delete after 7 days
        await db.weather_logs.create_index(
            "created_at", expireAfterSeconds=604800
        )
        await db.weather_logs.create_index([("user_id", 1), ("created_at", -1)])

        # crop_recommendations
        await db.crop_recommendations.create_index(
            [("user_id", 1), ("created_at", -1)]
        )

        # chat_history - TTL: auto-delete after 90 days
        await db.chat_history.create_index(
            "created_at", expireAfterSeconds=7776000
        )
        await db.chat_history.create_index("session_id", unique=True)
        await db.chat_history.create_index([("user_id", 1), ("created_at", -1)])

        # locations
        await db.locations.create_index([("coordinates", "2dsphere")])
        await db.locations.create_index("user_id")

        logger.info("✅ MongoDB indexes created")
    except Exception as e:
        logger.warning(f"Index creation warning (may already exist): {e}")


def get_db() -> AsyncIOMotorDatabase:
    """Dependency injection for FastAPI routes."""
    if db_instance.db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return db_instance.db
