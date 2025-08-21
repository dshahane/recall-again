# config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_MODE: str = "mock"  # Can be 'mock' or 'real'
    RUST_BACKEND_URL: str = "http://localhost:8080/agents"

    class Config:
        env_file = ".env"

settings = Settings()