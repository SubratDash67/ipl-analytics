import logging
from typing import Dict, List, Any
from app.models.database import db_manager


class VenueAnalysisService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_venue_breakdown(
        self, batter: str, bowler: str, filters: Dict = None
    ) -> Dict[str, Any]:
        """Get venue-wise breakdown for batter vs bowler with correct calculations"""
        try:
            base_query = """
                SELECT 
                    m.venue as name,
                    COUNT(DISTINCT d.match_id) as matches,
                    SUM(d.batsman_runs) as runs,
                    COUNT(CASE WHEN d.extras_type IS NULL OR d.extras_type != 'wides' THEN 1 END) as balls,
                    COUNT(CASE WHEN d.is_wicket = 1 AND d.player_dismissed = d.batter THEN 1 END) as dismissals
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.batter = ? AND d.bowler = ?
                    AND m.venue IS NOT NULL
            """

            params = [batter, bowler]

            if filters:
                if filters.get("season"):
                    base_query += " AND m.season = ?"
                    params.append(filters["season"])

            base_query += """
                GROUP BY m.venue
                HAVING matches > 0 AND balls > 0
                ORDER BY runs DESC
            """

            results = db_manager.execute_query(base_query, params)

            venues = []
            for row in results:
                runs = row["runs"] or 0
                balls = row["balls"] or 0

                # Calculate correct strike rate: (runs/balls) * 100
                strike_rate = round((runs / balls) * 100, 2) if balls > 0 else 0.0

                # Validate strike rate is realistic
                if strike_rate > 400:
                    self.logger.warning(
                        f"Unrealistic strike rate {strike_rate} for {batter} vs {bowler} at {row['name']}"
                    )
                    strike_rate = 0.0

                venues.append(
                    {
                        "name": row["name"],
                        "matches": row["matches"],
                        "runs": runs,
                        "balls": balls,
                        "strike_rate": strike_rate,
                        "dismissals": row["dismissals"] or 0,
                    }
                )

            return {"venues": venues}

        except Exception as e:
            self.logger.error(f"Error getting venue breakdown: {e}")
            return {"error": str(e)}

    def get_season_trends(
        self, batter: str, bowler: str, filters: Dict = None
    ) -> Dict[str, Any]:
        """Get season-wise trends for batter vs bowler with correct calculations"""
        try:
            base_query = """
                SELECT 
                    m.season,
                    SUM(d.batsman_runs) as runs,
                    COUNT(CASE WHEN d.extras_type IS NULL OR d.extras_type != 'wides' THEN 1 END) as balls,
                    COUNT(CASE WHEN d.is_wicket = 1 AND d.player_dismissed = d.batter THEN 1 END) as dismissals,
                    COUNT(CASE WHEN d.batsman_runs IN (4, 6) THEN 1 END) as boundaries
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.batter = ? AND d.bowler = ?
                    AND m.season IS NOT NULL
            """

            params = [batter, bowler]

            if filters:
                if filters.get("venue"):
                    base_query += " AND m.venue = ?"
                    params.append(filters["venue"])

            base_query += """
                GROUP BY m.season
                HAVING balls > 0
                ORDER BY m.season
            """

            results = db_manager.execute_query(base_query, params)

            seasons = []
            for row in results:
                runs = row["runs"] or 0
                balls = row["balls"] or 0

                # Calculate correct strike rate: (runs/balls) * 100
                strike_rate = round((runs / balls) * 100, 2) if balls > 0 else 0.0

                # Validate strike rate is realistic
                if strike_rate > 400:
                    self.logger.warning(
                        f"Unrealistic strike rate {strike_rate} for {batter} vs {bowler} in {row['season']}"
                    )
                    strike_rate = 0.0

                seasons.append(
                    {
                        "season": row["season"],
                        "runs": runs,
                        "balls": balls,
                        "strike_rate": strike_rate,
                        "dismissals": row["dismissals"] or 0,
                        "boundaries": row["boundaries"] or 0,
                    }
                )

            return {"seasons": seasons}

        except Exception as e:
            self.logger.error(f"Error getting season trends: {e}")
            return {"error": str(e)}


venue_analysis_service = VenueAnalysisService()
