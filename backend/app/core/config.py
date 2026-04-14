"""
AgroBrain AI — Application Configuration
All settings loaded from environment variables via pydantic-settings.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "AgroBrain AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # MongoDB
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "agrobrain"

    # Redis
    REDIS_URL: str
    REDIS_PASSWORD: Optional[str] = None

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o"

    # Weather
    OPENWEATHER_API_KEY: Optional[str] = None
    OPENWEATHER_BASE_URL: str = "https://api.openweathermap.org/data/2.5"

    @field_validator("SECRET_KEY")
    @classmethod
    def secret_key_must_be_long(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters")
        return v

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def access_token_expire_seconds(self) -> int:
        return self.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    # ─── Compatibility Aliases (for existing code) ───
    @property
    def debug(self) -> bool: return self.DEBUG
    @property
    def openai_api_key(self) -> Optional[str]: return self.OPENAI_API_KEY
    @property
    def openai_model(self) -> str: return self.OPENAI_MODEL
    @property
    def openweather_api_key(self) -> Optional[str]: return self.OPENWEATHER_API_KEY
    @property
    def openweather_base_url(self) -> str: return self.OPENWEATHER_BASE_URL
    @property
    def mongodb_db_name(self) -> str: return self.MONGODB_DB_NAME
    @property
    def jwt_secret_key(self) -> str: return self.SECRET_KEY


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
