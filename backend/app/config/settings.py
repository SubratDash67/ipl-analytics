import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-change-in-production"
    DATABASE_PATH = os.environ.get("DATABASE_PATH") or os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "data",
        "ipl_data.db",
    )
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")

    # Dismissal types that credit the bowler
    DISMISSAL_TYPES_BOWLER_CREDIT = ["bowled", "lbw", "caught", "stumped", "hit wicket"]


class DevelopmentConfig(Config):
    DEBUG = True
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]


class ProductionConfig(Config):
    DEBUG = False
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*").split(",")


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
