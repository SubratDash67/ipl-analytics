import pandas as pd
import logging
from pathlib import Path
from typing import Tuple, List, Dict, Any
from app.models.database import db_manager
from app.config.settings import Config


class DataLoader:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.matches_csv_path = Config.MATCHES_CSV_PATH
        self.deliveries_csv_path = Config.DELIVERIES_CSV_PATH

    def validate_csv_files(self) -> bool:
        if not self.matches_csv_path.exists():
            self.logger.error(f"Matches CSV not found: {self.matches_csv_path}")
            return False

        if not self.deliveries_csv_path.exists():
            self.logger.error(f"Deliveries CSV not found: {self.deliveries_csv_path}")
            return False

        return True

    def load_matches_csv(self) -> pd.DataFrame:
        try:
            df = pd.read_csv(self.matches_csv_path)
            self.logger.info(f"Loaded {len(df)} matches from CSV")

            df = df.fillna("")

            expected_columns = [
                "id",
                "season",
                "city",
                "date",
                "match_type",
                "player_of_match",
                "venue",
                "team1",
                "team2",
                "toss_winner",
                "toss_decision",
                "winner",
                "result",
                "result_margin",
                "target_runs",
                "target_overs",
                "super_over",
                "method",
                "umpire1",
                "umpire2",
            ]

            missing_columns = set(expected_columns) - set(df.columns)
            if missing_columns:
                self.logger.error(f"Missing columns in matches CSV: {missing_columns}")
                raise ValueError(f"Missing required columns: {missing_columns}")

            return df

        except Exception as e:
            self.logger.error(f"Error loading matches CSV: {e}")
            raise

    def load_deliveries_csv(self) -> pd.DataFrame:
        try:
            df = pd.read_csv(self.deliveries_csv_path)
            self.logger.info(f"Loaded {len(df)} deliveries from CSV")

            df = df.fillna("")

            expected_columns = [
                "match_id",
                "inning",
                "batting_team",
                "bowling_team",
                "over",
                "ball",
                "batter",
                "bowler",
                "non_striker",
                "batsman_runs",
                "extra_runs",
                "total_runs",
                "extras_type",
                "is_wicket",
                "player_dismissed",
                "dismissal_kind",
                "fielder",
            ]

            missing_columns = set(expected_columns) - set(df.columns)
            if missing_columns:
                self.logger.error(
                    f"Missing columns in deliveries CSV: {missing_columns}"
                )
                raise ValueError(f"Missing required columns: {missing_columns}")

            return df

        except Exception as e:
            self.logger.error(f"Error loading deliveries CSV: {e}")
            raise

    def prepare_matches_data(self, df: pd.DataFrame) -> List[Tuple]:
        data = []
        for _, row in df.iterrows():
            data.append(
                (
                    int(row["id"]),
                    str(row["season"]),
                    str(row["city"]) if row["city"] else None,
                    str(row["date"]),
                    str(row["match_type"]),
                    str(row["player_of_match"]) if row["player_of_match"] else None,
                    str(row["venue"]),
                    str(row["team1"]),
                    str(row["team2"]),
                    str(row["toss_winner"]),
                    str(row["toss_decision"]),
                    str(row["winner"]) if row["winner"] else None,
                    str(row["result"]),
                    int(row["result_margin"]) if row["result_margin"] else None,
                    int(row["target_runs"]) if row["target_runs"] else None,
                    int(row["target_overs"]) if row["target_overs"] else None,
                    str(row["super_over"]),
                    str(row["method"]) if row["method"] else None,
                    str(row["umpire1"]) if row["umpire1"] else None,
                    str(row["umpire2"]) if row["umpire2"] else None,
                )
            )
        return data

    def prepare_deliveries_data(self, df: pd.DataFrame) -> List[Tuple]:
        data = []
        for _, row in df.iterrows():
            data.append(
                (
                    int(row["match_id"]),
                    int(row["inning"]),
                    str(row["batting_team"]),
                    str(row["bowling_team"]),
                    int(row["over"]),
                    int(row["ball"]),
                    str(row["batter"]),
                    str(row["bowler"]),
                    str(row["non_striker"]),
                    int(row["batsman_runs"]),
                    int(row["extra_runs"]),
                    int(row["total_runs"]),
                    str(row["extras_type"]) if row["extras_type"] else None,
                    int(row["is_wicket"]),
                    str(row["player_dismissed"]) if row["player_dismissed"] else None,
                    str(row["dismissal_kind"]) if row["dismissal_kind"] else None,
                    str(row["fielder"]) if row["fielder"] else None,
                )
            )
        return data

    def insert_matches_data(self, data: List[Tuple]) -> int:
        query = """
            INSERT OR REPLACE INTO matches (
                id, season, city, date, match_type, player_of_match, venue,
                team1, team2, toss_winner, toss_decision, winner, result,
                result_margin, target_runs, target_overs, super_over, method,
                umpire1, umpire2
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        return db_manager.execute_bulk_insert(query, data)

    def insert_deliveries_data(self, data: List[Tuple]) -> int:
        query = """
            INSERT INTO deliveries (
                match_id, inning, batting_team, bowling_team, over, ball,
                batter, bowler, non_striker, batsman_runs, extra_runs,
                total_runs, extras_type, is_wicket, player_dismissed,
                dismissal_kind, fielder
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """

        return db_manager.execute_bulk_insert(query, data)

    def load_all_data(self) -> Tuple[int, int]:
        if not self.validate_csv_files():
            raise FileNotFoundError("Required CSV files not found")

        try:
            db_manager.create_tables()

            if db_manager.get_table_count("matches") > 0:
                self.logger.info("Database already populated, skipping data load")
                matches_count = db_manager.get_table_count("matches")
                deliveries_count = db_manager.get_table_count("deliveries")
                return matches_count, deliveries_count

            self.logger.info("Loading matches data...")
            matches_df = self.load_matches_csv()
            matches_data = self.prepare_matches_data(matches_df)
            matches_inserted = self.insert_matches_data(matches_data)

            self.logger.info(f"Inserted {matches_inserted} matches")

            self.logger.info("Loading deliveries data...")
            deliveries_df = self.load_deliveries_csv()
            deliveries_data = self.prepare_deliveries_data(deliveries_df)
            deliveries_inserted = self.insert_deliveries_data(deliveries_data)

            self.logger.info(f"Inserted {deliveries_inserted} deliveries")

            self.logger.info("Data loading completed successfully")
            return matches_inserted, deliveries_inserted

        except Exception as e:
            self.logger.error(f"Error during data loading: {e}")
            raise

    def get_data_summary(self) -> Dict[str, Any]:
        try:
            summary = {
                "matches_count": db_manager.get_table_count("matches"),
                "deliveries_count": db_manager.get_table_count("deliveries"),
                "seasons": len(
                    db_manager.execute_query("SELECT DISTINCT season FROM matches")
                ),
                "venues": len(
                    db_manager.execute_query("SELECT DISTINCT venue FROM matches")
                ),
                "batters": len(
                    db_manager.execute_query("SELECT DISTINCT batter FROM deliveries")
                ),
                "bowlers": len(
                    db_manager.execute_query("SELECT DISTINCT bowler FROM deliveries")
                ),
            }
            return summary
        except Exception as e:
            self.logger.error(f"Error generating data summary: {e}")
            return {}


data_loader = DataLoader()
