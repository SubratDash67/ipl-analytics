import sqlite3
import logging
from typing import List, Dict, Any, Optional
import os


class DatabaseManager:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or os.path.join(
            os.path.dirname(__file__), "..", "..", "data", "ipl_data.db"
        )
        self.logger = logging.getLogger(__name__)

    def get_connection(self):
        """Get database connection with row factory"""
        try:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row  # This allows dict-like access to rows
            return conn
        except Exception as e:
            self.logger.error(f"Database connection error: {e}")
            raise

    def execute_query(self, query: str, params: tuple = None) -> List[Dict[str, Any]]:
        """Execute a query and return results as list of dictionaries"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()

                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)

                # Convert rows to dictionaries
                columns = [description[0] for description in cursor.description]
                results = []
                for row in cursor.fetchall():
                    results.append(dict(zip(columns, row)))

                return results

        except Exception as e:
            self.logger.error(f"Query execution error: {e}")
            self.logger.error(f"Query: {query}")
            self.logger.error(f"Params: {params}")
            raise

    def execute_insert(self, query: str, params: tuple = None) -> int:
        """Execute an insert query and return the last row id"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()

                if params:
                    cursor.execute(query, params)
                else:
                    cursor.execute(query)

                conn.commit()
                return cursor.lastrowid

        except Exception as e:
            self.logger.error(f"Insert execution error: {e}")
            raise

    def execute_many(self, query: str, params_list: List[tuple]) -> None:
        """Execute a query with multiple parameter sets"""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.executemany(query, params_list)
                conn.commit()

        except Exception as e:
            self.logger.error(f"Batch execution error: {e}")
            raise


# Global database manager instance
db_manager = DatabaseManager()
