import logging
from typing import Dict, List, Any, Optional
from app.models.database import db_manager


class DatabaseService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_data_summary(self) -> Dict[str, Any]:
        """Get summary statistics of the dataset"""
        try:
            matches_query = "SELECT COUNT(*) as count FROM matches"
            matches_result = db_manager.execute_query(matches_query)
            matches_count = matches_result[0]["count"] if matches_result else 0

            deliveries_query = "SELECT COUNT(*) as count FROM deliveries"
            deliveries_result = db_manager.execute_query(deliveries_query)
            deliveries_count = deliveries_result[0]["count"] if deliveries_result else 0

            batters_query = "SELECT COUNT(DISTINCT batter) as count FROM deliveries WHERE batter IS NOT NULL"
            batters_result = db_manager.execute_query(batters_query)
            batters_count = batters_result[0]["count"] if batters_result else 0

            bowlers_query = "SELECT COUNT(DISTINCT bowler) as count FROM deliveries WHERE bowler IS NOT NULL"
            bowlers_result = db_manager.execute_query(bowlers_query)
            bowlers_count = bowlers_result[0]["count"] if bowlers_result else 0

            return {
                "matches_count": matches_count,
                "deliveries_count": deliveries_count,
                "batters": batters_count,
                "bowlers": bowlers_count,
            }

        except Exception as e:
            self.logger.error(f"Error getting data summary: {e}")
            return {"error": str(e)}

    def search_players(
        self, query: str, player_type: str = "both"
    ) -> Dict[str, List[str]]:
        """Search for players by name"""
        try:
            batters = []
            bowlers = []

            if player_type in ["both", "batter"]:
                batter_query = """
                    SELECT DISTINCT batter 
                    FROM deliveries 
                    WHERE batter LIKE ? AND batter IS NOT NULL
                    ORDER BY batter 
                    LIMIT 20
                """
                batter_results = db_manager.execute_query(batter_query, (f"%{query}%",))
                batters = [row["batter"] for row in batter_results]

            if player_type in ["both", "bowler"]:
                bowler_query = """
                    SELECT DISTINCT bowler 
                    FROM deliveries 
                    WHERE bowler LIKE ? AND bowler IS NOT NULL
                    ORDER BY bowler 
                    LIMIT 20
                """
                bowler_results = db_manager.execute_query(bowler_query, (f"%{query}%",))
                bowlers = [row["bowler"] for row in bowler_results]

            return {"batters": batters, "bowlers": bowlers}

        except Exception as e:
            self.logger.error(f"Error searching players: {e}")
            return {"batters": [], "bowlers": []}

    def get_head_to_head_stats(
        self, batter: str, bowler: str, filters: Dict = None
    ) -> Dict[str, Any]:
        """Get head-to-head statistics between batter and bowler"""
        try:
            base_query = """
                SELECT d.*, m.season, m.venue, m.date
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

            deliveries = db_manager.execute_query(base_query, params)

            if not deliveries:
                return {"error": "No data found for this matchup"}

            total_deliveries = len(deliveries)
            runs = sum(d["batsman_runs"] or 0 for d in deliveries)

            # Count balls faced (excluding wides)
            balls_faced = sum(1 for d in deliveries if d["extras_type"] != "wides")

            dismissals = sum(
                1
                for d in deliveries
                if d["is_wicket"] and d["player_dismissed"] == batter
            )
            boundaries = sum(1 for d in deliveries if d["batsman_runs"] in [4, 6])

            # Correct strike rate calculation: (runs/balls) * 100
            strike_rate = (
                round((runs / balls_faced) * 100, 2) if balls_faced > 0 else 0.0
            )

            # Correct average calculation: runs/dismissals
            average = round(runs / dismissals, 2) if dismissals > 0 else runs

            batting_stats = {
                "runs": runs,
                "balls_faced": balls_faced,
                "strike_rate": strike_rate,
                "dismissals": dismissals,
                "boundaries": boundaries,
                "average": average,
            }

            # Count balls bowled (excluding wides for economy calculation)
            balls_bowled = sum(
                1 for d in deliveries if d["extras_type"] not in ["wides", "noballs"]
            )

            # Correct economy rate calculation: (runs_conceded / overs)
            economy = round((runs / (balls_bowled / 6)), 2) if balls_bowled > 0 else 0.0

            bowling_stats = {
                "runs_conceded": runs,
                "balls_bowled": balls_bowled,
                "wickets": dismissals,
                "economy": economy,
                "dot_balls": sum(1 for d in deliveries if d["total_runs"] == 0),
            }

            return {
                "total_deliveries": total_deliveries,
                "batting_stats": batting_stats,
                "bowling_stats": bowling_stats,
                "batter": batter,
                "bowler": bowler,
            }

        except Exception as e:
            self.logger.error(f"Error getting head-to-head stats: {e}")
            return {"error": str(e)}

    def get_player_stats(self, player: str, player_type: str) -> Dict[str, Any]:
        """Get individual player statistics with correct calculations"""
        try:
            if player_type == "batter":
                query = """
                    SELECT 
                        COUNT(DISTINCT match_id) as matches,
                        SUM(batsman_runs) as runs,
                        COUNT(CASE WHEN extras_type IS NULL OR extras_type != 'wides' THEN 1 END) as balls,
                        COUNT(CASE WHEN is_wicket = 1 AND player_dismissed = batter THEN 1 END) as dismissals,
                        COUNT(CASE WHEN batsman_runs IN (4, 6) THEN 1 END) as boundaries
                    FROM deliveries d
                    WHERE d.batter = ?
                """

                result = db_manager.execute_query(query, (player,))

                if result and result[0]:
                    stats = dict(result[0])
                    runs = stats.get("runs", 0) or 0
                    balls = stats.get("balls", 0) or 0
                    dismissals = stats.get("dismissals", 0) or 0

                    # Calculate correct strike rate: (runs/balls) * 100
                    stats["strike_rate"] = (
                        round((runs / balls) * 100, 2) if balls > 0 else 0.0
                    )

                    # Calculate correct average: runs/dismissals
                    stats["average"] = (
                        round(runs / dismissals, 2) if dismissals > 0 else runs
                    )

                    return {"stats": stats}

            else:  # bowler
                query = """
                    SELECT 
                        COUNT(DISTINCT match_id) as matches,
                        SUM(total_runs) as runs_conceded,
                        COUNT(CASE WHEN extras_type IS NULL OR extras_type NOT IN ('wides', 'noballs') THEN 1 END) as balls,
                        COUNT(CASE WHEN is_wicket = 1 THEN 1 END) as wickets
                    FROM deliveries
                    WHERE bowler = ?
                """

                result = db_manager.execute_query(query, (player,))

                if result and result[0]:
                    stats = dict(result[0])
                    runs_conceded = stats.get("runs_conceded", 0) or 0
                    balls = stats.get("balls", 0) or 0
                    wickets = stats.get("wickets", 0) or 0

                    # Calculate correct economy rate: (runs_conceded / overs)
                    stats["economy"] = (
                        round((runs_conceded / (balls / 6)), 2) if balls > 0 else 0.0
                    )

                    # Calculate bowling average: runs_conceded/wickets
                    stats["bowling_average"] = (
                        round(runs_conceded / wickets, 2) if wickets > 0 else 0.0
                    )

                    # Calculate bowling strike rate: balls/wickets
                    stats["bowling_strike_rate"] = (
                        round(balls / wickets, 2) if wickets > 0 else 0.0
                    )

                    return {"stats": stats}

            return {"stats": {}}

        except Exception as e:
            self.logger.error(f"Error getting player stats: {e}")
            return {"error": str(e)}

    def get_available_filters(self) -> Dict[str, List[str]]:
        """Get available filter options"""
        try:
            seasons_query = "SELECT DISTINCT season FROM matches WHERE season IS NOT NULL ORDER BY season"
            seasons = [row["season"] for row in db_manager.execute_query(seasons_query)]

            venues_query = "SELECT DISTINCT venue FROM matches WHERE venue IS NOT NULL ORDER BY venue"
            venues = [row["venue"] for row in db_manager.execute_query(venues_query)]

            return {"seasons": seasons, "venues": venues}

        except Exception as e:
            self.logger.error(f"Error getting filters: {e}")
            return {"seasons": [], "venues": []}

    def get_venues(self) -> List[str]:
        """Get all unique venues"""
        try:
            venues_query = "SELECT DISTINCT venue FROM matches WHERE venue IS NOT NULL ORDER BY venue"
            venues = [row["venue"] for row in db_manager.execute_query(venues_query)]
            return venues

        except Exception as e:
            self.logger.error(f"Error getting venues: {e}")
            return []

    def get_player_matchups(self, player: str, player_type: str) -> Dict[str, Any]:
        """Get player matchups"""
        try:
            if player_type == "batter":
                query = """
                    SELECT bowler, COUNT(*) as encounters
                    FROM deliveries
                    WHERE batter = ? AND bowler IS NOT NULL
                    GROUP BY bowler
                    ORDER BY encounters DESC
                    LIMIT 10
                """
            else:
                query = """
                    SELECT batter, COUNT(*) as encounters
                    FROM deliveries
                    WHERE bowler = ? AND batter IS NOT NULL
                    GROUP BY batter
                    ORDER BY encounters DESC
                    LIMIT 10
                """

            results = db_manager.execute_query(query, (player,))
            return {"matchups": [dict(row) for row in results]}

        except Exception as e:
            self.logger.error(f"Error getting matchups: {e}")
            return {"error": str(e)}

    def get_match_details(self, match_id: int) -> Dict[str, Any]:
        """Get match details"""
        try:
            query = "SELECT * FROM matches WHERE id = ?"
            result = db_manager.execute_query(query, (match_id,))
            return dict(result[0]) if result else {"error": "Match not found"}

        except Exception as e:
            self.logger.error(f"Error getting match details: {e}")
            return {"error": str(e)}


database_service = DatabaseService()
