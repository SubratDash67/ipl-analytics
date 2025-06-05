import logging
from typing import List, Dict, Any, Optional
from app.models.database import db_manager
from app.models.match import Match
from app.models.delivery import Delivery


class DatabaseService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_database_status(self) -> Dict[str, Any]:
        try:
            status = {
                "database_exists": db_manager.table_exists("matches")
                and db_manager.table_exists("deliveries"),
                "matches_count": (
                    db_manager.get_table_count("matches")
                    if db_manager.table_exists("matches")
                    else 0
                ),
                "deliveries_count": (
                    db_manager.get_table_count("deliveries")
                    if db_manager.table_exists("deliveries")
                    else 0
                ),
            }
            return status
        except Exception as e:
            self.logger.error(f"Error checking database status: {e}")
            return {"error": str(e)}

    def search_players(
        self, query: str, player_type: str = "both"
    ) -> Dict[str, List[str]]:
        try:
            results = {"batters": [], "bowlers": []}

            if player_type in ["both", "batter"]:
                batter_query = """
                    SELECT DISTINCT batter FROM deliveries 
                    WHERE batter LIKE ? 
                    ORDER BY batter LIMIT 20
                """
                batter_results = db_manager.execute_query(batter_query, (f"%{query}%",))
                results["batters"] = [row[0] for row in batter_results]

            if player_type in ["both", "bowler"]:
                bowler_query = """
                    SELECT DISTINCT bowler FROM deliveries 
                    WHERE bowler LIKE ? 
                    ORDER BY bowler LIMIT 20
                """
                bowler_results = db_manager.execute_query(bowler_query, (f"%{query}%",))
                results["bowlers"] = [row[0] for row in bowler_results]

            return results

        except Exception as e:
            self.logger.error(f"Error searching players: {e}")
            return {"error": str(e)}

    def get_head_to_head_deliveries(
        self, batter: str, bowler: str, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict]:
        try:
            base_query = """
                SELECT d.*, m.season, m.venue, m.match_type, m.date, m.winner, m.city
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.batter = ? AND d.bowler = ?
            """
            params = [batter, bowler]

            if filters:
                if filters.get("season"):
                    base_query += " AND m.season = ?"
                    params.append(filters["season"])

                if filters.get("venue"):
                    base_query += " AND m.venue = ?"
                    params.append(filters["venue"])

                if filters.get("match_type"):
                    base_query += " AND m.match_type = ?"
                    params.append(filters["match_type"])

                if filters.get("phase"):
                    phase = filters["phase"]
                    if phase == "powerplay":
                        base_query += " AND d.over < 6"
                    elif phase == "middle":
                        base_query += " AND d.over >= 6 AND d.over < 15"
                    elif phase == "death":
                        base_query += " AND d.over >= 15"

            base_query += " ORDER BY m.date, d.inning, d.over, d.ball"

            results = db_manager.execute_query(base_query, params)
            return [dict(row) for row in results]

        except Exception as e:
            self.logger.error(f"Error fetching head-to-head deliveries: {e}")
            return []

    def get_batter_deliveries(
        self, batter: str, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict]:
        try:
            base_query = """
                SELECT d.*, m.season, m.venue, m.match_type, m.date, m.winner, m.city
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.batter = ?
            """
            params = [batter]

            if filters:
                if filters.get("season"):
                    base_query += " AND m.season = ?"
                    params.append(filters["season"])

                if filters.get("venue"):
                    base_query += " AND m.venue = ?"
                    params.append(filters["venue"])

                if filters.get("match_type"):
                    base_query += " AND m.match_type = ?"
                    params.append(filters["match_type"])

                if filters.get("phase"):
                    phase = filters["phase"]
                    if phase == "powerplay":
                        base_query += " AND d.over < 6"
                    elif phase == "middle":
                        base_query += " AND d.over >= 6 AND d.over < 15"
                    elif phase == "death":
                        base_query += " AND d.over >= 15"

            base_query += " ORDER BY m.date, d.inning, d.over, d.ball"

            results = db_manager.execute_query(base_query, params)
            return [dict(row) for row in results]

        except Exception as e:
            self.logger.error(f"Error fetching batter deliveries: {e}")
            return []

    def get_bowler_deliveries(
        self, bowler: str, filters: Optional[Dict[str, Any]] = None
    ) -> List[Dict]:
        try:
            base_query = """
                SELECT d.*, m.season, m.venue, m.match_type, m.date, m.winner, m.city
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.bowler = ?
            """
            params = [bowler]

            if filters:
                if filters.get("season"):
                    base_query += " AND m.season = ?"
                    params.append(filters["season"])

                if filters.get("venue"):
                    base_query += " AND m.venue = ?"
                    params.append(filters["venue"])

                if filters.get("match_type"):
                    base_query += " AND m.match_type = ?"
                    params.append(filters["match_type"])

                if filters.get("phase"):
                    phase = filters["phase"]
                    if phase == "powerplay":
                        base_query += " AND d.over < 6"
                    elif phase == "middle":
                        base_query += " AND d.over >= 6 AND d.over < 15"
                    elif phase == "death":
                        base_query += " AND d.over >= 15"

            base_query += " ORDER BY m.date, d.inning, d.over, d.ball"

            results = db_manager.execute_query(base_query, params)
            return [dict(row) for row in results]

        except Exception as e:
            self.logger.error(f"Error fetching bowler deliveries: {e}")
            return []

    def get_player_matchups(
        self, player: str, player_type: str
    ) -> List[Dict[str, str]]:
        try:
            if player_type == "batter":
                query = """
                    SELECT DISTINCT bowler, COUNT(*) as encounters
                    FROM deliveries 
                    WHERE batter = ?
                    GROUP BY bowler
                    ORDER BY encounters DESC, bowler
                """
                results = db_manager.execute_query(query, (player,))
                return [
                    {"opponent": row[0], "encounters": row[1], "type": "bowler"}
                    for row in results
                ]

            elif player_type == "bowler":
                query = """
                    SELECT DISTINCT batter, COUNT(*) as encounters
                    FROM deliveries 
                    WHERE bowler = ?
                    GROUP BY batter
                    ORDER BY encounters DESC, batter
                """
                results = db_manager.execute_query(query, (player,))
                return [
                    {"opponent": row[0], "encounters": row[1], "type": "batter"}
                    for row in results
                ]

            return []

        except Exception as e:
            self.logger.error(f"Error fetching player matchups: {e}")
            return []

    def get_available_filters(self) -> Dict[str, List[str]]:
        try:
            filters = {}

            seasons_query = "SELECT DISTINCT season FROM matches ORDER BY season"
            seasons = db_manager.execute_query(seasons_query)
            filters["seasons"] = [row[0] for row in seasons]

            venues_query = "SELECT DISTINCT venue FROM matches ORDER BY venue"
            venues = db_manager.execute_query(venues_query)
            filters["venues"] = [row[0] for row in venues]

            match_types_query = (
                "SELECT DISTINCT match_type FROM matches ORDER BY match_type"
            )
            match_types = db_manager.execute_query(match_types_query)
            filters["match_types"] = [row[0] for row in match_types]

            teams_query = """
                SELECT DISTINCT team FROM (
                    SELECT team1 as team FROM matches
                    UNION
                    SELECT team2 as team FROM matches
                ) ORDER BY team
            """
            teams = db_manager.execute_query(teams_query)
            filters["teams"] = [row[0] for row in teams]

            filters["phases"] = ["powerplay", "middle", "death"]

            return filters

        except Exception as e:
            self.logger.error(f"Error fetching available filters: {e}")
            return {}

    def get_match_details(self, match_id: int) -> Optional[Match]:
        try:
            return Match.get_by_id(match_id)
        except Exception as e:
            self.logger.error(f"Error fetching match details: {e}")
            return None


database_service = DatabaseService()
