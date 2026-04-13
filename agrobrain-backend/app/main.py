"""
Main FastAPI application for AgroBrain AI backend.

This module configures the FastAPI app with middleware, routers,
lifecycle management, and global exception handlers.
"""

import dns
import os
import time
from contextlib import asynccontextmanager
from typing import Dict, Any

# Configure DNS for reliable MongoDB connection (Override as requested)
try:
    import dns.resolver
    dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
    dns.resolver.default_resolver.nameservers = ['8.8.8.8', '8.8.4.4']
    print("DNS servers overridden for MongoDB connection: 8.8.8.8, 8.8.4.4")
except Exception as e:
    print(f"DNS configuration failed: {e}")
    # Fallback: try to set DNS using system configuration
    try:
        import socket
        # This might help with DNS resolution
        socket.getaddrinfo('mongodb.com', 27017)
        print("DNS resolution test passed")
    except Exception as fallback_e:
        print(f"DNS fallback failed: {fallback_e}")

from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.core.logger import _logger_config, logger
from app.core.database import connect_db, disconnect_db, get_db_health
from app.core.redis import connect_redis, disconnect_redis, get_redis_health, redis_manager
import firebase_admin
from firebase_admin import credentials
from app.routes.auth import router as auth_router
from app.routes.weather import router as weather_router
from app.ml.predictor import CropPredictor
from app.routes.recommend import router as recommend_router
from app.routes.chat import router as chat_router
from app.routes.voice import router as voice_router
from app.routes.admin import router as admin_router
from app.core.scheduler import agro_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown."""
    # Startup
    logger.info("Starting AgroBrain AI backend...")
    
    try:
        # Initialize ML Predictor
        try:
            app.state.predictor = CropPredictor()
            app.state.predictor.load()  # Call the load method to initialize model
            logger.info("Crop ML Predictor initialized and loaded successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Crop ML Predictor: {e}")
            app.state.predictor = None

        # Connect to database (temporarily disabled due to SSL issues)
        await connect_db()
        
        # Connect to Redis
        await connect_redis()
        
        # Initialize Firebase Admin SDK
        if not firebase_admin._apps:
            try:
                if settings.firebase_credentials_path and os.path.exists(settings.firebase_credentials_path):
                    cred = credentials.Certificate(settings.firebase_credentials_path)
                    firebase_admin.initialize_app(cred)
                    logger.info("Firebase Admin SDK initialized successfully")
                else:
                    logger.warning("Firebase credentials file not found, Firebase features will be disabled")
            except Exception as e:
                logger.error(f"Failed to initialize Firebase Admin SDK: {e}")
                logger.warning("Continuing without Firebase - some features may not work")
        
        # Start Background Scheduler
        await agro_scheduler.setup()
        
        logger.info("AgroBrain AI backend started successfully")
        yield
        
    except Exception as e:
        logger.error(f"Failed to start AgroBrain AI backend: {str(e)}")
        raise
    
    # Shutdown
    logger.info("Shutting down AgroBrain AI backend...")
    
    try:
        await agro_scheduler.shutdown()
        await disconnect_redis()
        await disconnect_db()
        logger.info("AgroBrain AI backend shutdown complete")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="AI-powered smart farming platform for India",
    version=settings.app_version,
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
    openapi_url="/openapi.json" if settings.debug else None,
)

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all HTTP requests with timing and context."""
    start_time = time.time()
    
    # Extract request information
    method = request.method
    path = request.url.path
    client_ip = get_remote_address(request)
    
    # Get user ID from header if available
    user_id = request.headers.get("X-User-ID")
    
    try:
        response = await call_next(request)
        duration_ms = (time.time() - start_time) * 1000
        
        # Log request
        _logger_config.log_request(
            method=method,
            path=path,
            status_code=response.status_code,
            duration_ms=duration_ms,
            user_id=user_id,
            ip_address=client_ip
        )
        
        return response
        
    except Exception as e:
        duration_ms = (time.time() - start_time) * 1000
        
        # Log error
        _logger_config.log_request(
            method=method,
            path=path,
            status_code=500,
            duration_ms=duration_ms,
            user_id=user_id,
            ip_address=client_ip
        )
        
        logger.error(f"Request failed: {str(e)}")
        raise


# Global exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions with consistent error response format."""
    logger.warning(f"HTTP exception: {exc.status_code} - {exc.detail}")
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
            "path": request.url.path
        }
    )


@app.exception_handler(RateLimitExceeded)
async def rate_limit_exception_handler(request: Request, exc: RateLimitExceeded):
    """Handle rate limit exceeded exceptions."""
    logger.warning(f"Rate limit exceeded for {get_remote_address(request)}")
    
    return JSONResponse(
        status_code=429,
        content={
            "error": True,
            "message": "Rate limit exceeded. Please try again later.",
            "status_code": 429,
            "path": request.url.path
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions without exposing internal details."""
    logger.error(f"Unexpected exception: {str(exc)}")
    
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error" if not settings.debug else str(exc),
            "status_code": 500,
            "path": request.url.path
        }
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
@limiter.limit("100/minute")
async def health_check(request: Request):
    """
    Check application and service health.
    
    Returns:
        Dict[str, Any]: Health status information
    """
    try:
        # Check database health
        db_healthy = await get_db_health()
        
        # Check Redis health and stats
        redis_healthy = await get_redis_health()
        cache_stats = await redis_manager.get_cache_stats()
        
        # Overall health status
        overall_healthy = db_healthy and redis_healthy
        
        status_code = 200 if overall_healthy else 503
        
        health_data = {
            "status": "healthy" if overall_healthy else "unhealthy",
            "version": settings.app_version,
            "environment": "development" if settings.debug else "production",
            "services": {
                "database": "healthy" if db_healthy else "unhealthy",
                "redis": "healthy" if redis_healthy else "unhealthy"
            },
            "cache": cache_stats,
            "timestamp": time.time()
        }
        
        return JSONResponse(
            status_code=status_code,
            content=health_data
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "version": settings.app_version,
                "error": "Health check failed",
                "timestamp": time.time()
            }
        )


# Root endpoint
@app.get("/", tags=["Root"])
@limiter.limit("60/minute")
async def root(request: Request):
    """Root endpoint with basic API information."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "description": "AI-powered smart farming platform for India",
        "docs_url": "/docs" if settings.debug else None,
        "health_url": "/health"
    }


# Include routers
app.include_router(
    auth_router,
    prefix="/api/v1",
    tags=["Authentication"]
)

app.include_router(
    weather_router,
    prefix="/api/v1",
    tags=["Weather"]
)

app.include_router(
    recommend_router,
    prefix="/api/v1",
    tags=["Recommendations"]
)

app.include_router(
    chat_router,
    prefix="/api/v1",
    tags=["Chat"]
)

app.include_router(
    voice_router,
    prefix="/api/v1",
    tags=["Voice"]
)

app.include_router(
    admin_router,
    prefix="/api/v1/admin",
    tags=["Admin"]
)


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level="info"
    )
