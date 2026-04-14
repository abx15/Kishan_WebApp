"""
Logging configuration module for AgroBrain AI backend.

This module provides structured logging using loguru with file rotation,
separate log levels, and consistent formatting.
"""

import sys
from pathlib import Path
from typing import Any, Dict, Optional

from loguru import logger

from app.core.config import settings


class LoggerConfig:
    """Logger configuration class."""
    
    def __init__(self):
        """Initialize logger configuration."""
        self.log_dir = Path("logs")
        self.log_dir.mkdir(exist_ok=True)
        
        # Remove default logger
        logger.remove()
        
        # Add console logger for development
        if settings.debug:
            logger.add(
                sys.stdout,
                format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan> | <level>{message}</level>",
                level="DEBUG",
                colorize=True
            )
        
        # Add file logger for all logs
        logger.add(
            self.log_dir / "app.log",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name} | {message} | {extra}",
            level="INFO",
            rotation="10 MB",
            retention="7 days",
            compression="zip",
            enqueue=True,
            backtrace=True,
            diagnose=True,
            encoding="utf-8"
        )
        
        # Add error file logger
        logger.add(
            self.log_dir / "error.log",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name} | {message} | {extra}",
            level="ERROR",
            rotation="10 MB",
            retention="30 days",
            compression="zip",
            enqueue=True,
            backtrace=True,
            diagnose=True,
            encoding="utf-8"
        )
    
    def get_logger(self, name: Optional[str] = None) -> Any:
        """
        Get configured logger instance.
        
        Args:
            name: Optional logger name for context
            
        Returns:
            Configured logger instance
        """
        if name:
            return logger.bind(name=name)
        return logger
    
    def log_request(
        self,
        method: str,
        path: str,
        status_code: int,
        duration_ms: float,
        user_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> None:
        """
        Log HTTP request with context.
        
        Args:
            method: HTTP method
            path: Request path
            status_code: Response status code
            duration_ms: Request duration in milliseconds
            user_id: Optional user ID
            ip_address: Optional IP address
        """
        extra_context = {
            "method": method,
            "path": path,
            "status_code": status_code,
            "duration_ms": duration_ms,
            "user_id": user_id,
            "ip_address": ip_address
        }
        
        if status_code >= 400:
            logger.error(
                f"HTTP {method} {path} - {status_code} - {duration_ms:.2f}ms",
                extra=extra_context
            )
        else:
            logger.info(
                f"HTTP {method} {path} - {status_code} - {duration_ms:.2f}ms",
                extra=extra_context
            )
    
    def log_cache_operation(
        self,
        operation: str,
        key: str,
        hit: Optional[bool] = None,
        error: Optional[str] = None
    ) -> None:
        """
        Log cache operations.
        
        Args:
            operation: Cache operation (get, set, delete)
            key: Cache key
            hit: Whether it was a cache hit (for get operations)
            error: Error message if operation failed
        """
        extra_context = {
            "cache_operation": operation,
            "cache_key": key,
            "cache_hit": hit,
            "cache_error": error
        }
        
        if error:
            logger.error(f"Cache {operation} failed for key {key}: {error}", extra=extra_context)
        elif operation == "get":
            if hit:
                logger.debug(f"Cache hit for key {key}", extra=extra_context)
            else:
                logger.debug(f"Cache miss for key {key}", extra=extra_context)
        else:
            logger.debug(f"Cache {operation} for key {key}", extra=extra_context)
    
    def log_database_operation(
        self,
        operation: str,
        collection: str,
        duration_ms: Optional[float] = None,
        error: Optional[str] = None
    ) -> None:
        """
        Log database operations.
        
        Args:
            operation: Database operation
            collection: Collection name
            duration_ms: Operation duration in milliseconds
            error: Error message if operation failed
        """
        extra_context = {
            "db_operation": operation,
            "collection": collection,
            "duration_ms": duration_ms,
            "db_error": error
        }
        
        if error:
            logger.error(
                f"DB {operation} on {collection} failed: {error}",
                extra=extra_context
            )
        else:
            logger.debug(
                f"DB {operation} on {collection} - {duration_ms:.2f}ms" if duration_ms else f"DB {operation} on {collection}",
                extra=extra_context
            )


# Initialize logger configuration
_logger_config = LoggerConfig()

# Export the configured logger instance
logger = _logger_config.get_logger("agrobrain")
