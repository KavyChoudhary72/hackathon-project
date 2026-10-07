import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str = "mongodb://localhost:27017/surplus2shelter"
    DB_NAME: str = "surplus2shelter"

    LLM_API_KEY: str = "mock_llm_key"
    WHATSAPP_CLOUD_API_TOKEN: str = "mock_whatsapp_token"
    WHATSAPP_PHONE_NUMBER_ID: str = "mock_phone_id"

    CORS_ORIGINS: List[str] = [
        "https://hackathon-project-yy5i.onrender.com",
        "http://localhost:3000",
        "http://localhost:5173",
        "https://surplus2shelter.vercel.app",
        "*"
    ]

    # Feature Flags
    ENABLE_REWARDS: bool = True
    ENABLE_RESCUE_DEALS: bool = True
    ENABLE_DIVERSION: bool = True
    ENABLE_CHAT: bool = True

    # Engine & Threshold Configurations
    CASCADE_TIMEOUT_SECONDS: int = 180
    REWARDS_DAILY_CAP: int = 500
    MEAL_KG: float = 0.4
    MAX_SEARCH_RADIUS_KM: float = 20.0
    DEAL_COLLECT_BUFFER_MIN: int = 30
    DEAL_MAX_PER_BUYER: int = 50

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
