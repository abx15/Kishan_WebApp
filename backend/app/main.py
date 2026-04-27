"""
AgroBrain AI — FastAPI Application Entry Point
Enterprise-Level Configuration
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from loguru import logger
import time
import sys

from app.core.config import settings
from app.core.database import connect_db, disconnect_db
from app.core.redis import connect_redis, disconnect_redis


# ─── Logging Setup ────────────────────────────────────────────────
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:HH:mm:ss}</green> | <level>{level}</level> | {message}",
    level="DEBUG" if settings.DEBUG else "INFO",
    colorize=True,
)
logger.add("logs/app.log",   rotation="10 MB", retention="7 days",  level="INFO")
logger.add("logs/error.log", rotation="10 MB", retention="30 days", level="ERROR")


# ─── Lifespan ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"🌾 Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # Connect services
    await connect_db()
    await connect_redis()

    # Load ML model (if available)
    try:
        from app.ml.predictor import crop_predictor
        crop_predictor.load()
        app.state.predictor = crop_predictor
        logger.success("✅ ML model loaded")
    except Exception as e:
        logger.warning(f"ML model not loaded (run train_model.py first): {e}")
        app.state.predictor = None

    logger.success(f"✅ {settings.APP_NAME} is ready!")
    yield

    # Cleanup
    await disconnect_db()
    await disconnect_redis()
    logger.info(f"{settings.APP_NAME} stopped.")


# ─── Rate Limiter ─────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


# ─── App Instance ─────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-Powered Smart Farming Platform for Indian Farmers. "
        "Provides crop recommendations, weather insights, AI chat, "
        "and role-based dashboards for farmers, agronomists, and admins."
    ),
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",    # Always available (restrict in nginx in prod)
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Attach limiter state
app.state.limiter = limiter


# ─── Middleware ───────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
    expose_headers=["X-Cache", "X-Response-Time", "X-Request-Id"],
)

app.add_middleware(SlowAPIMiddleware)


# ─── Request Timing Middleware ────────────────────────────────────
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = round((time.perf_counter() - start) * 1000, 2)
    response.headers["X-Response-Time"] = f"{duration_ms}ms"
    if not request.url.path.startswith("/health"):
        logger.info(
            f"{request.method} {request.url.path} → "
            f"{response.status_code} ({duration_ms}ms)"
        )
    return response


# ─── Exception Handlers ───────────────────────────────────────────
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": "Too Many Requests",
            "message": "Rate limit exceeded. Please slow down.",
            "retry_after": "60 seconds",
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for error in exc.errors():
        field = " → ".join(str(e) for e in error["loc"] if e != "body")
        errors.append({"field": field, "message": error["msg"]})
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": "Validation Error", "details": errors},
    )


@app.exception_handler(404)
async def not_found_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "Endpoint not found",
            "path": str(request.url.path),
            "docs": "/docs",
        },
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    logger.error(f"Internal Server Error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error. Our team has been notified."},
    )


# ─── Routers ──────────────────────────────────────────────────────
from app.routes.auth import router as auth_router
app.include_router(auth_router, prefix="/api")

from app.routes.farmer import router as farmer_router
app.include_router(farmer_router, prefix="/api")

from app.routes.agronomist import router as agronomist_router
app.include_router(agronomist_router, prefix="/api")

from app.routes.admin import router as admin_router
app.include_router(admin_router, prefix="/api")

try:
    from app.routes.weather import router as weather_router
    app.include_router(weather_router, prefix="/api")
    logger.info("✅ Weather router registered")
except ImportError as e:
    logger.warning(f"Weather router not loaded: {e}")

try:
    from app.routes.recommend import router as recommend_router
    app.include_router(recommend_router, prefix="/api")
    logger.info("✅ Recommend router registered")
except ImportError as e:
    logger.warning(f"Recommend router not loaded: {e}")

try:
    from app.routes.chat import router as chat_router
    app.include_router(chat_router, prefix="/api")
    logger.info("✅ Chat router registered")
except ImportError as e:
    logger.warning(f"Chat router not loaded: {e}")

try:
    from app.routes.voice import router as voice_router
    app.include_router(voice_router, prefix="/api")
    logger.info("✅ Voice router registered")
except ImportError as e:
    logger.warning(f"Voice router not loaded: {e}")


# ─── Health Check ─────────────────────────────────────────────────
@app.get("/health", tags=["System"], include_in_schema=True)
async def health_check():
    """Quick health check — no auth required."""
    from app.core.database import db_instance
    from app.core.redis import redis_instance

    db_status = "connected" if db_instance.db is not None else "disconnected"
    redis_status = "connected" if redis_instance.available else "unavailable"

    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "cache": redis_status,
    }


@app.get("/", tags=["System"])
async def root():
    """Root endpoint."""
    return {
        "message": f"Welcome to {settings.APP_NAME} API v{settings.APP_VERSION}",
        "docs": "/docs",
        "health": "/health",
        "status": "running",
    }
