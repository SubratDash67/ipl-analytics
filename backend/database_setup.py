import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)


def setup_database():
    """Setup database with tables and initial data"""
    try:
        logger.info("Starting database setup...")

        # Import after environment is loaded
        from app.models.database import db_manager
        from app.services.data_loader import data_loader

        # Create database tables
        logger.info("Creating database tables...")
        db_manager.create_tables()

        # Load data from CSV files
        logger.info("Loading data from CSV files...")
        success = data_loader.load_all_data()

        if success:
            logger.info("Database setup completed successfully!")

            # Show summary
            stats = data_loader.get_database_stats()
            logger.info(f"Database statistics: {stats}")

        else:
            logger.error("Failed to load data into database")
            return False

        return True

    except Exception as e:
        logger.error(f"Database setup failed: {e}")
        return False


if __name__ == "__main__":
    success = setup_database()
    if success:
        print("✅ Database setup completed successfully!")
    else:
        print("❌ Database setup failed!")
        exit(1)
