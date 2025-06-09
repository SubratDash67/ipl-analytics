import os
from pathlib import Path


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"
    DEBUG = False
    TESTING = False

    # Database configuration
    BASE_DIR = Path(__file__).parent.parent.parent
    DATABASE_PATH = os.environ.get("DATABASE_URL") or str(
        BASE_DIR / "data" / "ipl_data.db"
    )

    # API Configuration
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = True


class DevelopmentConfig(Config):
    DEBUG = True
    FLASK_ENV = "development"


class ProductionConfig(Config):
    DEBUG = False
    FLASK_ENV = "production"

    # Use environment variable for secret key in production
    SECRET_KEY = os.environ.get("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("No SECRET_KEY set for production environment")


class TestingConfig(Config):
    TESTING = True
    DEBUG = True


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
