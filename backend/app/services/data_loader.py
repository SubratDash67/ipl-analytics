import pandas as pd
import sqlite3
import os
import logging
from app.config.settings import Config


class DataLoader:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

        # Use Config attributes safely
        self.matches_csv_path = getattr(Config, "MATCHES_CSV_PATH", "data/matches.csv")
        self.deliveries_csv_path = getattr(
            Config, "DELIVERIES_CSV_PATH", "data/deliveries.csv"
        )
        self.database_path = getattr(Config, "DATABASE_PATH", "data/ipl_data.db")

        # Ensure data directory exists
        self.data_dir = os.path.dirname(self.database_path)
        os.makedirs(self.data_dir, exist_ok=True)

        self.logger.info(f"DataLoader initialized with:")
        self.logger.info(f"  Matches CSV: {self.matches_csv_path}")
        self.logger.info(f"  Deliveries CSV: {self.deliveries_csv_path}")
        self.logger.info(f"  Database: {self.database_path}")

    def check_data_files(self):
        """Check if required data files exist"""
        files_status = {
            "matches_csv": os.path.exists(self.matches_csv_path),
            "deliveries_csv": os.path.exists(self.deliveries_csv_path),
            "database": os.path.exists(self.database_path),
        }

        self.logger.info(f"Data files status: {files_status}")
        return files_status

    def load_csv_data(self):
        """Load data from CSV files"""
        try:
            if not os.path.exists(self.matches_csv_path):
                self.logger.error(f"Matches CSV not found: {self.matches_csv_path}")
                return None, None

            if not os.path.exists(self.deliveries_csv_path):
                self.logger.error(
                    f"Deliveries CSV not found: {self.deliveries_csv_path}"
                )
                return None, None

            matches_df = pd.read_csv(self.matches_csv_path)
            deliveries_df = pd.read_csv(self.deliveries_csv_path)

            self.logger.info(
                f"Loaded {len(matches_df)} matches and {len(deliveries_df)} deliveries"
            )
            return matches_df, deliveries_df

        except Exception as e:
            self.logger.error(f"Error loading CSV data: {e}")
            return None, None

    def create_database_tables(self):
        """Create database tables if they don't exist"""
        try:
            conn = sqlite3.connect(self.database_path)
            cursor = conn.cursor()

            # Create matches table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS matches (
                    id INTEGER PRIMARY KEY,
                    season TEXT,
                    city TEXT,
                    date TEXT,
                    team1 TEXT,
                    team2 TEXT,
                    toss_winner TEXT,
                    toss_decision TEXT,
                    result TEXT,
                    dl_applied INTEGER,
                    winner TEXT,
                    win_by_runs INTEGER,
                    win_by_wickets INTEGER,
                    player_of_match TEXT,
                    venue TEXT,
                    umpire1 TEXT,
                    umpire2 TEXT,
                    umpire3 TEXT,
                    target_runs INTEGER,
                    target_overs REAL,
                    super_over INTEGER,
                    method TEXT,
                    eliminator TEXT
                )
            """
            )

            # Create deliveries table
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS deliveries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    match_id INTEGER,
                    inning INTEGER,
                    batting_team TEXT,
                    bowling_team TEXT,
                    over INTEGER,
                    ball INTEGER,
                    batter TEXT,
                    non_striker TEXT,
                    bowler TEXT,
                    batsman_runs INTEGER,
                    extra_runs INTEGER,
                    total_runs INTEGER,
                    is_wicket INTEGER,
                    dismissal_kind TEXT,
                    player_dismissed TEXT,
                    fielder TEXT,
                    extras_type TEXT,
                    FOREIGN KEY (match_id) REFERENCES matches (id)
                )
            """
            )

            conn.commit()
            conn.close()
            self.logger.info("Database tables created successfully")
            return True

        except Exception as e:
            self.logger.error(f"Error creating database tables: {e}")
            return False

    def load_all_data(self):
        """Load CSV data into SQLite database"""
        try:
            matches_df, deliveries_df = self.load_csv_data()

            if matches_df is None or deliveries_df is None:
                self.logger.error("Failed to load CSV data")
                return False

            # Create tables
            if not self.create_database_tables():
                return False

            # Check if data already exists
            conn = sqlite3.connect(self.database_path)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM matches")
            existing_matches = cursor.fetchone()[0]

            if existing_matches > 0:
                self.logger.info(
                    f"Database already contains {existing_matches} matches. Skipping data load."
                )
                conn.close()
                return True

            # Load data into database
            matches_df.to_sql("matches", conn, if_exists="replace", index=False)
            self.logger.info(f"Loaded {len(matches_df)} matches into database")

            deliveries_df.to_sql("deliveries", conn, if_exists="replace", index=False)
            self.logger.info(f"Loaded {len(deliveries_df)} deliveries into database")

            conn.close()
            return True

        except Exception as e:
            self.logger.error(f"Error loading data to database: {e}")
            return False

    def get_database_stats(self):
        """Get basic statistics about the database"""
        try:
            if not os.path.exists(self.database_path):
                return {"error": "Database not found"}

            conn = sqlite3.connect(self.database_path)
            cursor = conn.cursor()

            # Get table counts
            cursor.execute("SELECT COUNT(*) FROM matches")
            matches_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(*) FROM deliveries")
            deliveries_count = cursor.fetchone()[0]

            # Get unique players
            cursor.execute("SELECT COUNT(DISTINCT batter) FROM deliveries")
            batters_count = cursor.fetchone()[0]

            cursor.execute("SELECT COUNT(DISTINCT bowler) FROM deliveries")
            bowlers_count = cursor.fetchone()[0]

            conn.close()

            return {
                "matches": matches_count,
                "deliveries": deliveries_count,
                "batters": batters_count,
                "bowlers": bowlers_count,
            }

        except Exception as e:
            self.logger.error(f"Error getting database stats: {e}")
            return {"error": str(e)}


# Create global instance
data_loader = DataLoader()
