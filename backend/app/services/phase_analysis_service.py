from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import logging
from app.models.database import db_manager


@dataclass
class PhaseStats:
    phase_name: str
    overs_range: str
    runs_scored: int = 0
    balls_faced: int = 0
    wickets_lost: int = 0
    boundaries: int = 0
    strike_rate: float = 0.0
    run_rate: float = 0.0
    dot_ball_percentage: float = 0.0
    boundary_percentage: float = 0.0


class PhaseAnalysisService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_powerplay_analysis(
        self, batter: str, bowler: str, filters: Optional[Dict] = None
    ) -> Dict:
        """Analyze powerplay performance following ICC powerplay rules [6]"""
        try:
            # Powerplay: Overs 1-6 in T20, only 2 fielders outside 30-yard circle
            powerplay_deliveries = self._get_phase_deliveries(
                batter, bowler, 0, 5, filters
            )
            return self._calculate_phase_stats(powerplay_deliveries, "Powerplay", "1-6")

        except Exception as e:
            self.logger.error(f"Error analyzing powerplay: {e}")
            return {}

    def get_middle_overs_analysis(
        self, batter: str, bowler: str, filters: Optional[Dict] = None
    ) -> Dict:
        """Analyze middle overs performance [6]"""
        try:
            # Middle overs: 7-15 in T20
            middle_deliveries = self._get_phase_deliveries(
                batter, bowler, 6, 14, filters
            )
            return self._calculate_phase_stats(
                middle_deliveries, "Middle Overs", "7-15"
            )

        except Exception as e:
            self.logger.error(f"Error analyzing middle overs: {e}")
            return {}

    def get_death_overs_analysis(
        self, batter: str, bowler: str, filters: Optional[Dict] = None
    ) -> Dict:
        """Analyze death overs performance following ICC standards [5]"""
        try:
            # Death overs: 16-20 in T20, maximum 5 fielders outside circle
            death_deliveries = self._get_phase_deliveries(
                batter, bowler, 15, 19, filters
            )
            return self._calculate_phase_stats(death_deliveries, "Death Overs", "16-20")

        except Exception as e:
            self.logger.error(f"Error analyzing death overs: {e}")
            return {}

    def _get_phase_deliveries(
        self,
        batter: str,
        bowler: str,
        start_over: int,
        end_over: int,
        filters: Optional[Dict] = None,
    ) -> List[Dict]:
        """Get deliveries for specific phase"""
        base_query = """
            SELECT d.*, m.season, m.venue, m.date, m.winner
            FROM deliveries d
            JOIN matches m ON d.match_id = m.id
            WHERE d.batter = ? AND d.bowler = ? AND d.over >= ? AND d.over <= ?
        """
        params = [batter, bowler, start_over, end_over]

        if filters:
            if filters.get("season"):
                base_query += " AND m.season = ?"
                params.append(filters["season"])
            if filters.get("venue"):
                base_query += " AND m.venue = ?"
                params.append(filters["venue"])

        base_query += " ORDER BY m.date, d.over, d.ball"

        results = db_manager.execute_query(base_query, params)
        return [dict(row) for row in results]

    def _calculate_phase_stats(
        self, deliveries: List[Dict], phase_name: str, overs_range: str
    ) -> Dict:
        """Calculate phase statistics following ICC calculation rules [3]"""
        if not deliveries:
            return {
                "phase_name": phase_name,
                "overs_range": overs_range,
                "stats": PhaseStats(phase_name, overs_range).__dict__,
            }

        stats = PhaseStats(phase_name, overs_range)
        dot_balls = 0

        for delivery in deliveries:
            # Count balls faced (exclude wides) [3]
            if delivery["extras_type"] != "wides":
                stats.balls_faced += 1

                if delivery["total_runs"] == 0:
                    dot_balls += 1

            # Count runs scored by batsman
            stats.runs_scored += delivery["batsman_runs"] or 0

            # Count boundaries
            if delivery["batsman_runs"] in [4, 6]:
                stats.boundaries += 1

            # Count wickets
            if (
                delivery["is_wicket"]
                and delivery["player_dismissed"] == delivery["batter"]
            ):
                stats.wickets_lost += 1

        # Calculate derived statistics
        if stats.balls_faced > 0:
            stats.strike_rate = round((stats.runs_scored / stats.balls_faced) * 100, 2)
            stats.dot_ball_percentage = round((dot_balls / stats.balls_faced) * 100, 2)
            stats.boundary_percentage = round(
                (stats.boundaries / stats.balls_faced) * 100, 2
            )

            # Calculate run rate (runs per over)
            overs_played = stats.balls_faced / 6.0
            stats.run_rate = (
                round(stats.runs_scored / overs_played, 2) if overs_played > 0 else 0
            )

        return {
            "phase_name": phase_name,
            "overs_range": overs_range,
            "total_deliveries": len(deliveries),
            "stats": stats.__dict__,
        }


phase_analysis_service = PhaseAnalysisService()
