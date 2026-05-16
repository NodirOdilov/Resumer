"""Конфигурация Telegram-бота Resumer."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    bot_token: str
    app_version: str = "2.7.0"
    bot_username: str = "ResumerBot"
    api_base_url: str = "http://localhost:8000/api/v1"
    api_timeout: int = 30
    redis_url: str = "redis://localhost:6379/4"
    bot_mode: str = "polling"
    webhook_url: str = ""
    webhook_secret: str = ""
    log_level: str = "INFO"


settings = Settings()
