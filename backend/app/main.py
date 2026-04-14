"""
AgroBrain AI — FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
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
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="7 days",
    level="INFO",
)
logger.add(
    "logs/error.log",
    rotation="10 MB",
    retention="30 days",
    level="ERROR",
)


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
    except Exception as e:
        logger.warning(f"ML model not loaded (run train_model.py first): {e}")
        app.state.predictor = None

    logger.success("✅ AgroBrain AI is ready!")
    yield

    # Cleanup
    await disconnect_db()
    await disconnect_redis()
    logger.info("AgroBrain AI stopped.")


# ─── App Instance ─────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-Powered Smart Farming Platform for Indian Farmers",
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)


# ─── CORS Middleware ──────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Requested-With"],
    expose_headers=["X-Cache", "X-Response-Time"],
)


# ─── Request Logging Middleware ────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = round((time.time() - start) * 1000, 2)
    response.headers["X-Response-Time"] = f"{duration}ms"
    if not request.url.path.startswith("/health"):
        logger.info(
            f"{request.method} {request.url.path} → "
            f"{response.status_code} ({duration}ms)"
        )
    return response


# ─── Exception Handlers ───────────────────────────────────────────
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
        content={"success": False, "error": "Endpoint not found", "path": str(request.url.path)},
    )


@app.exception_handler(500)
async def internal_error_handler(request: Request, exc):
    logger.error(f"Internal Server Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "Internal server error"},
    )


# ─── Routers ──────────────────────────────────────────────────────
# ─── Routers ──────────────────────────────────────────────────────
from app.routes.auth import router as auth_router
app.include_router(auth_router, prefix="/api")

# Include other routers
try:
    from app.routes.admin import router as admin_router
    app.include_router(admin_router, prefix="/api")
except ImportError:
    logger.debug("Admin router not found, skipping")

try:
    from app.routes.weather import router as weather_router
    app.include_router(weather_router, prefix="/api")
except ImportError:
    logger.debug("Weather router not found, skipping")

try:
    from app.routes.recommend import router as recommend_router
    app.include_router(recommend_router, prefix="/api")
except ImportError:
    logger.debug("Recommend router not found, skipping")

try:
    from app.routes.chat import router as chat_router
    app.include_router(chat_router, prefix="/api")
except ImportError:
    logger.debug("Chat router not found, skipping")

try:
    from app.routes.voice import router as voice_router
    app.include_router(voice_router, prefix="/api")
except ImportError:
    logger.debug("Voice router not found, skipping")

# Include new dashboard routes
try:
    from app.routes.farmer import router as farmer_router
    app.include_router(farmer_router, prefix="/api")
except ImportError:
    logger.debug("Farmer router not found, skipping")

try:
    from app.routes.agronomist import router as agronomist_router
    app.include_router(agronomist_router, prefix="/api")
except ImportError:
    logger.debug("Agronomist router not found, skipping")


# ─── Health Check ─────────────────────────────────────────────────
@app.get("/health", tags=["System"])
async def health_check():
    from app.core.database import db_instance
    from app.core.redis import redis_instance

    db_status = "connected" if db_instance.db is not None else "disconnected"
    redis_status = "connected" if redis_instance.available else "unavailable"

    return {
        "status"  : "healthy",
        "app"     : settings.APP_NAME,
        "version" : settings.APP_VERSION,
        "database": db_status,
        "cache"   : redis_status,
        "debug"   : settings.DEBUG,
    }


@app.get("/", tags=["System"])
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API", "docs": "/docs"}
