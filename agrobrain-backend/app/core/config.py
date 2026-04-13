"""
Configuration module for AgroBrain AI backend.

This module handles all application configuration using Pydantic settings
with environment variable loading and validation.
"""

from functools import lru_cache
from typing import List, Optional

from pydantic import Field, validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # App Configuration
    app_name: str = Field(default="AgroBrain AI", description="Application name")
    app_version: str = Field(default="1.0.0", description="Application version")
    debug: bool = Field(default=False, description="Enable debug mode")
    secret_key: str = Field(..., description="JWT secret key")
    algorithm: str = Field(default="HS256", description="JWT algorithm")
    access_token_expire_minutes: int = Field(default=60, description="Access token expiration in minutes")
    refresh_token_expire_days: int = Field(default=30, description="Refresh token expiration in days")
    
    # Database Configuration
    mongodb_url: str = Field(..., description="MongoDB connection URL")
    mongodb_db_name: str = Field(default="agrobrain", description="MongoDB database name")
    
    # Redis Configuration
    redis_url: str = Field(default="redis://localhost:6379", description="Redis connection URL")
    redis_password: Optional[str] = Field(default=None, description="Redis password")
    
    # OpenAI Configuration
    openai_api_key: str = Field(..., description="OpenAI API key")
    openai_model: str = Field(default="gpt-4o", description="OpenAI model to use")
    
    # OpenWeatherMap Configuration
    openweather_api_key: str = Field(..., description="OpenWeatherMap API key")
    openweather_base_url: str = Field(
        default="https://api.openweathermap.org/data/2.5",
        description="OpenWeatherMap API base URL"
    )
    
    # Firebase Configuration
    firebase_project_id: str = Field(..., description="Firebase project ID")
    firebase_credentials_path: str = Field(..., description="Path to Firebase credentials file")
    
    # Rate Limiting Configuration
    rate_limit_per_minute: int = Field(default=60, description="Rate limit per minute")
    rate_limit_per_hour: int = Field(default=500, description="Rate limit per hour")
    
    # CORS Configuration
    cors_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:8080"],
        description="CORS allowed origins"
    )
    
    class Config:
        """Pydantic configuration."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @validator("cors_origins", pre=True)
    def assemble_cors_origins(cls, v):
        """Parse CORS origins from string or list."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError("CORS origins must be a list or comma-separated string")
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return not self.debug
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.debug
    
    @property
    def jwt_secret_key(self) -> str:
        """Get JWT secret key."""
        return self.secret_key


@lru_cache()
def get_settings() -> Settings:
    """
    Get cached settings instance.
    
    Returns:
        Settings: Application settings instance
    """
    return Settings()


# Global settings instance
settings = get_settings()
