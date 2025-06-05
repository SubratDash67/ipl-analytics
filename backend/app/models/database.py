import sqlite3
import logging
from pathlib import Path
from contextlib import contextmanager
from app.config.settings import Config


class DatabaseManager:
    def __init__(self, db_path=None):
        self.db_path = db_path or Config.DATABASE_PATH
        self.logger = logging.getLogger(__name__)

    def create_connection(self):
        try:
            conn = sqlite3.connect(str(self.db_path))
            conn.row_factory = sqlite3.Row
            return conn
        except sqlite3.Error as e:
            self.logger.error(f"Database connection error: {e}")
            raise

    @contextmanager
    def get_connection(self):
        conn = None
        try:
            conn = self.create_connection()
            yield conn
        except sqlite3.Error as e:
            if conn:
                conn.rollback()
            self.logger.error(f"Database operation error: {e}")
            raise
        finally:
            if conn:
                conn.close()

    def create_tables(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS matches (
                    id INTEGER PRIMARY KEY,
                    season TEXT,
                    city TEXT,
                    date TEXT,
                    match_type TEXT,
                    player_of_match TEXT,
                    venue TEXT,
                    team1 TEXT,
                    team2 TEXT,
                    toss_winner TEXT,
                    toss_decision TEXT,
                    winner TEXT,
                    result TEXT,
                    result_margin INTEGER,
                    target_runs INTEGER,
                    target_overs INTEGER,
                    super_over TEXT,
                    method TEXT,
                    umpire1 TEXT,
                    umpire2 TEXT
                )
            """
            )

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
                    bowler TEXT,
                    non_striker TEXT,
                    batsman_runs INTEGER,
                    extra_runs INTEGER,
                    total_runs INTEGER,
                    extras_type TEXT,
                    is_wicket INTEGER,
                    player_dismissed TEXT,
                    dismissal_kind TEXT,
                    fielder TEXT,
                    FOREIGN KEY (match_id) REFERENCES matches (id)
                )
            """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_deliveries_match_id 
                ON deliveries(match_id)
            """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_deliveries_batter_bowler 
                ON deliveries(batter, bowler)
            """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_deliveries_batting_team 
                ON deliveries(batting_team)
            """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_deliveries_bowling_team 
                ON deliveries(bowling_team)
            """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_matches_season 
                ON matches(season)
            """
            )

            cursor.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_matches_venue 
                ON matches(venue)
            """
            )

            conn.commit()
            self.logger.info("Database tables created successfully")

    def table_exists(self, table_name):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name=?
            """,
                (table_name,),
            )
            return cursor.fetchone() is not None

    def get_table_count(self, table_name):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            return cursor.fetchone()[0]

    def execute_query(self, query, params=None):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
            return cursor.fetchall()

    def execute_insert(self, query, params):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            conn.commit()
            return cursor.lastrowid

    def execute_bulk_insert(self, query, data_list):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(query, data_list)
            conn.commit()
            return cursor.rowcount


db_manager = DatabaseManager()
