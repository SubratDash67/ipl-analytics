import logging
from typing import Dict, List, Any
from app.models.database import db_manager


class PhaseAnalysisService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_phase_analysis(
        self, batter: str, bowler: str, filters: Dict = None
    ) -> Dict[str, Any]:
        """Get phase-wise analysis for batter vs bowler"""
        try:
            powerplay = self._get_phase_stats(batter, bowler, 1, 6, filters)
            middle_overs = self._get_phase_stats(batter, bowler, 7, 15, filters)
            death_overs = self._get_phase_stats(batter, bowler, 16, 20, filters)

            return {
                "batter": batter,
                "bowler": bowler,
                "phase_analysis": {
                    "powerplay": powerplay,
                    "middle_overs": middle_overs,
                    "death_overs": death_overs,
                },
            }

        except Exception as e:
            self.logger.error(f"Error in phase analysis: {e}")
            return {"error": str(e)}

    def _get_phase_stats(
        self,
        batter: str,
        bowler: str,
        start_over: int,
        end_over: int,
        filters: Dict = None,
    ) -> Dict[str, Any]:
        """Get statistics for a specific phase"""
        try:
            base_query = """
                SELECT 
                    SUM(d.batsman_runs) as runs,
                    COUNT(CASE WHEN d.extras_type IS NULL OR d.extras_type != 'wides' THEN 1 END) as balls,
                    COUNT(CASE WHEN d.batsman_runs IN (4, 6) THEN 1 END) as boundaries,
                    COUNT(CASE WHEN d.is_wicket = 1 AND d.player_dismissed = d.batter THEN 1 END) as dismissals,
                    COUNT(CASE WHEN d.total_runs = 0 THEN 1 END) as dot_balls
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.batter = ? 
                    AND d.bowler = ?
                    AND d.over BETWEEN ? AND ?
            """

            params = [batter, bowler, start_over, end_over]

            if filters:
                if filters.get("season"):
                    base_query += " AND m.season = ?"
                    params.append(filters["season"])
                if filters.get("venue"):
                    base_query += " AND m.venue = ?"
                    params.append(filters["venue"])

            results = db_manager.execute_query(base_query, params)

            if not results:
                return {
                    "runs": 0,
                    "balls": 0,
                    "strike_rate": 0.0,
                    "boundaries": 0,
                    "dismissals": 0,
                    "dot_balls": 0,
                }

            row = results[0]
            runs = row["runs"] or 0
            balls = row["balls"] or 0
            boundaries = row["boundaries"] or 0
            dismissals = row["dismissals"] or 0
            dot_balls = row["dot_balls"] or 0

            # Correct strike rate calculation: (runs/balls) * 100
            strike_rate = (runs / balls * 100) if balls > 0 else 0.0

            return {
                "runs": runs,
                "balls": balls,
                "strike_rate": round(strike_rate, 2),
                "boundaries": boundaries,
                "dismissals": dismissals,
                "dot_balls": dot_balls,
            }

        except Exception as e:
            self.logger.error(f"Error getting phase stats: {e}")
            return {
                "runs": 0,
                "balls": 0,
                "strike_rate": 0.0,
                "boundaries": 0,
                "dismissals": 0,
                "dot_balls": 0,
            }


phase_analysis_service = PhaseAnalysisService()
