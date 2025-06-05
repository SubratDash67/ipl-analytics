import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or "dev-secret-key-for-local-development"

    # Database configuration for local development
    DATABASE_PATH = os.environ.get("DATABASE_PATH") or os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "data",
        "ipl_data.db",
    )

    # CSV file paths for data loading
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    DATA_DIR = os.path.join(BASE_DIR, "data")

    MATCHES_CSV_PATH = os.path.join(DATA_DIR, "matches.csv")
    DELIVERIES_CSV_PATH = os.path.join(DATA_DIR, "deliveries.csv")

    # CORS configuration
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")

    # Dismissal types that credit the bowler
    DISMISSAL_TYPES_BOWLER_CREDIT = ["bowled", "lbw", "caught", "stumped", "hit wicket"]


class DevelopmentConfig(Config):
    DEBUG = True
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]


class ProductionConfig(Config):
    DEBUG = False
    CORS_ORIGINS = ["https://bowlervbatsman.netlify.app"]


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
