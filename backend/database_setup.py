import sys
import logging
from pathlib import Path
from app.services.data_loader import data_loader
from app.models.database import db_manager


def setup_database():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    logger = logging.getLogger(__name__)

    try:
        logger.info("Starting database setup...")

        logger.info("Creating database tables...")
        db_manager.create_tables()

        logger.info("Loading data from CSV files...")
        matches_count, deliveries_count = data_loader.load_all_data()

        logger.info("Generating data summary...")
        summary = data_loader.get_data_summary()

        logger.info("Database setup completed successfully!")
        logger.info(f"Summary: {summary}")

        return True

    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        return False


if __name__ == "__main__":
    success = setup_database()
    if not success:
        sys.exit(1)

    print("\n" + "=" * 50)
    print("DATABASE SETUP COMPLETED SUCCESSFULLY!")
    print("=" * 50)
    print("Next steps:")
    print("1. Run: python run.py")
    print("2. API will be available at: http://localhost:5000")
    print("3. Test endpoint: http://localhost:5000/api/health")
