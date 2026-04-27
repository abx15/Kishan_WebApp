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
    """Create all required MongoDB indexes for performance and constraints."""
    db = db_instance.db
    try:
        # ── users ──────────────────────────────────────────────────
        await db.users.create_index("email", unique=True)
        await db.users.create_index("username", unique=True)
        await db.users.create_index("phone", unique=True, sparse=True)
        await db.users.create_index("created_at")
        await db.users.create_index("role")
        await db.users.create_index("last_login")

        # ── weather_logs — TTL: auto-delete after 7 days ────────────
        await db.weather_logs.create_index(
            "created_at", expireAfterSeconds=604800
        )
        await db.weather_logs.create_index([("user_id", 1), ("created_at", -1)])

        # ── crop_recommendations ────────────────────────────────────
        await db.crop_recommendations.create_index(
            [("user_id", 1), ("created_at", -1)]
        )

        # ── chat_sessions (active sessions) ─────────────────────────
        await db.chat_sessions.create_index("session_id", unique=True)
        await db.chat_sessions.create_index([("user_id", 1), ("started_at", -1)])
        await db.chat_sessions.create_index("agronomist_id")
        await db.chat_sessions.create_index("is_active")

        # ── chat_history — TTL: auto-delete after 90 days ──────────
        await db.chat_history.create_index(
            "created_at", expireAfterSeconds=7776000
        )
        await db.chat_history.create_index([("user_id", 1), ("created_at", -1)])

        # ── api_logs — TTL: auto-delete after 30 days ───────────────
        await db.api_logs.create_index(
            "timestamp", expireAfterSeconds=2592000
        )
        await db.api_logs.create_index("level")

        # ── locations (geo) ─────────────────────────────────────────
        await db.locations.create_index([("coordinates", "2dsphere")])
        await db.locations.create_index("user_id")

        # ── advisory_tips ────────────────────────────────────────────
        await db.advisory_tips.create_index([("created_at", -1)])
        await db.advisory_tips.create_index("priority")

        logger.success("✅ MongoDB indexes created/verified")
    except Exception as e:
        logger.warning(f"Index creation warning (may already exist): {e}")


def get_db() -> AsyncIOMotorDatabase:
    """Dependency injection for FastAPI routes."""
    if db_instance.db is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return db_instance.db


# Alias for backward compatibility with routes that import get_database
get_database = get_db
