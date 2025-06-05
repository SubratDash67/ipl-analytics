from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import logging
from app.models.database import db_manager


@dataclass
class FormStats:
    matches_played: int = 0
    runs_scored: int = 0
    balls_faced: int = 0
    dismissals: int = 0
    average: float = 0.0
    strike_rate: float = 0.0
    form_trend: str = "stable"
    recent_scores: List[int] = None
    consistency_rating: float = 0.0
    boundaries: int = 0
    fours: int = 0
    sixes: int = 0


class FormAnalysisService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_recent_form(
        self, player: str, player_type: str, last_n_matches: int = 10
    ) -> Dict:
        """Analyze recent form of a player following ICC standards"""
        try:
            if player_type == "batter":
                return self._get_batting_form(player, last_n_matches)
            else:
                return self._get_bowling_form(player, last_n_matches)

        except Exception as e:
            self.logger.error(f"Error analyzing form: {e}")
            return {}

    def _get_batting_form(self, batter: str, last_n_matches: int) -> Dict:
        """Get recent batting form with proper ICC calculations and date handling"""
        query = """
            SELECT 
                d.match_id, 
                d.batter, 
                COALESCE(m.date, 'Unknown') as date,
                COALESCE(m.season, 'Unknown') as season,
                SUM(CASE WHEN d.batsman_runs IS NOT NULL THEN d.batsman_runs ELSE 0 END) as runs,
                COUNT(CASE 
                    WHEN d.extras_type IS NULL OR d.extras_type != 'wides' 
                    THEN 1 
                END) as balls_faced,
                COUNT(CASE WHEN d.batsman_runs = 4 THEN 1 END) as fours,
                COUNT(CASE WHEN d.batsman_runs = 6 THEN 1 END) as sixes,
                MAX(CASE 
                    WHEN d.is_wicket = 1 
                    AND d.player_dismissed = d.batter 
                    AND d.dismissal_kind IN ('bowled', 'lbw', 'caught', 'stumped', 'hit wicket') 
                    THEN 1 
                    ELSE 0 
                END) as dismissed
            FROM deliveries d
            JOIN matches m ON d.match_id = m.id
            WHERE d.batter = ?
            GROUP BY d.match_id, d.batter, m.date, m.season
            HAVING balls_faced > 0
            ORDER BY 
                CASE 
                    WHEN m.date IS NULL OR m.date = '' THEN 1 
                    ELSE 0 
                END,
                m.date DESC,
                d.match_id DESC
            LIMIT ?
        """

        results = db_manager.execute_query(query, (batter, last_n_matches))

        if not results:
            return {"error": "No recent matches found"}

        matches_data = []
        for row in results:
            match_dict = dict(row)

            # Handle date formatting
            if match_dict["date"] and match_dict["date"] != "Unknown":
                try:
                    # Try to parse and reformat the date
                    if isinstance(match_dict["date"], str):
                        # Handle different date formats
                        date_str = match_dict["date"]
                        if "/" in date_str:
                            # Convert DD/MM/YYYY to YYYY-MM-DD for consistency
                            parts = date_str.split("/")
                            if len(parts) == 3 and len(parts[2]) == 4:
                                match_dict["date"] = (
                                    f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                                )
                        elif "-" in date_str and len(date_str.split("-")[0]) == 2:
                            # Convert DD-MM-YYYY to YYYY-MM-DD
                            parts = date_str.split("-")
                            if len(parts) == 3:
                                match_dict["date"] = (
                                    f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                                )
                except Exception as e:
                    self.logger.warning(
                        f"Date parsing issue for {match_dict['date']}: {e}"
                    )
                    match_dict["date"] = "Invalid Date"

            # Calculate individual match strike rate
            if match_dict["balls_faced"] > 0:
                match_dict["strike_rate"] = round(
                    (match_dict["runs"] / match_dict["balls_faced"]) * 100, 2
                )
            else:
                match_dict["strike_rate"] = 0.0

            matches_data.append(match_dict)

        # Calculate aggregate statistics following ICC rules
        total_runs = sum(match["runs"] for match in matches_data)
        total_balls = sum(match["balls_faced"] for match in matches_data)
        total_dismissals = sum(match["dismissed"] for match in matches_data)
        total_fours = sum(match["fours"] for match in matches_data)
        total_sixes = sum(match["sixes"] for match in matches_data)
        recent_scores = [match["runs"] for match in matches_data]

        form_stats = FormStats(
            matches_played=len(matches_data),
            runs_scored=total_runs,
            balls_faced=total_balls,
            dismissals=total_dismissals,
            recent_scores=recent_scores,
            boundaries=total_fours + total_sixes,
            fours=total_fours,
            sixes=total_sixes,
        )

        # Calculate batting average (ICC standard: runs/dismissals)
        if total_dismissals > 0:
            form_stats.average = round(total_runs / total_dismissals, 2)
        else:
            form_stats.average = total_runs if total_runs > 0 else 0.0

        # Calculate strike rate (ICC standard: (runs/balls) * 100)
        if total_balls > 0:
            form_stats.strike_rate = round((total_runs / total_balls) * 100, 2)
        else:
            form_stats.strike_rate = 0.0

        # Calculate form trend and consistency
        form_stats.form_trend = self._calculate_trend(recent_scores)
        form_stats.consistency_rating = self._calculate_consistency(recent_scores)

        return {
            "player": batter,
            "type": "batting",
            "form_stats": form_stats.__dict__,
            "recent_matches": matches_data,
        }

    def _get_bowling_form(self, bowler: str, last_n_matches: int) -> Dict:
        """Get recent bowling form with proper ICC calculations and date handling"""
        query = """
            SELECT 
                d.match_id, 
                d.bowler, 
                COALESCE(m.date, 'Unknown') as date,
                COALESCE(m.season, 'Unknown') as season,
                SUM(CASE WHEN d.total_runs IS NOT NULL THEN d.total_runs ELSE 0 END) as runs_conceded,
                COUNT(CASE 
                    WHEN d.extras_type IS NULL 
                    OR d.extras_type NOT IN ('wides', 'noballs') 
                    THEN 1 
                END) as balls_bowled,
                COUNT(CASE 
                    WHEN d.is_wicket = 1 
                    AND d.dismissal_kind IN ('bowled', 'lbw', 'caught', 'stumped', 'hit wicket') 
                    THEN 1 
                END) as wickets
            FROM deliveries d
            JOIN matches m ON d.match_id = m.id
            WHERE d.bowler = ?
            GROUP BY d.match_id, d.bowler, m.date, m.season
            HAVING balls_bowled > 0
            ORDER BY 
                CASE 
                    WHEN m.date IS NULL OR m.date = '' THEN 1 
                    ELSE 0 
                END,
                m.date DESC,
                d.match_id DESC
            LIMIT ?
        """

        results = db_manager.execute_query(query, (bowler, last_n_matches))

        if not results:
            return {"error": "No recent matches found"}

        matches_data = []
        for row in results:
            match_dict = dict(row)

            # Handle date formatting (same as batting)
            if match_dict["date"] and match_dict["date"] != "Unknown":
                try:
                    if isinstance(match_dict["date"], str):
                        date_str = match_dict["date"]
                        if "/" in date_str:
                            parts = date_str.split("/")
                            if len(parts) == 3 and len(parts[2]) == 4:
                                match_dict["date"] = (
                                    f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                                )
                        elif "-" in date_str and len(date_str.split("-")[0]) == 2:
                            parts = date_str.split("-")
                            if len(parts) == 3:
                                match_dict["date"] = (
                                    f"{parts[2]}-{parts[1].zfill(2)}-{parts[0].zfill(2)}"
                                )
                except Exception as e:
                    self.logger.warning(
                        f"Date parsing issue for {match_dict['date']}: {e}"
                    )
                    match_dict["date"] = "Invalid Date"

            # Calculate individual match economy rate
            if match_dict["balls_bowled"] > 0:
                overs = match_dict["balls_bowled"] / 6.0
                match_dict["economy_rate"] = round(
                    match_dict["runs_conceded"] / overs, 2
                )
            else:
                match_dict["economy_rate"] = 0.0

            matches_data.append(match_dict)

        # Calculate bowling statistics following ICC rules
        total_runs = sum(match["runs_conceded"] for match in matches_data)
        total_balls = sum(match["balls_bowled"] for match in matches_data)
        total_wickets = sum(match["wickets"] for match in matches_data)

        form_stats = FormStats(
            matches_played=len(matches_data),
            runs_scored=total_runs,
            balls_faced=total_balls,
        )

        # Calculate economy rate (runs per over)
        if total_balls > 0:
            overs = total_balls / 6.0
            form_stats.strike_rate = round(total_runs / overs, 2)

        # Calculate bowling average
        if total_wickets > 0:
            form_stats.average = round(total_runs / total_wickets, 2)

        return {
            "player": bowler,
            "type": "bowling",
            "form_stats": form_stats.__dict__,
            "recent_matches": matches_data,
        }

    def _calculate_trend(self, scores: List[int]) -> str:
        """Calculate performance trend based on recent vs older scores"""
        if len(scores) < 4:
            return "insufficient_data"

        recent_avg = sum(scores[:3]) / 3
        older_scores = scores[3:]

        if not older_scores:
            return "insufficient_data"

        older_avg = sum(older_scores) / len(older_scores)

        if recent_avg > older_avg * 1.15:
            return "improving"
        elif recent_avg < older_avg * 0.85:
            return "declining"
        else:
            return "stable"

    def _calculate_consistency(self, scores: List[int]) -> float:
        """Calculate consistency rating based on score variance"""
        if len(scores) < 3:
            return 0.0

        mean_score = sum(scores) / len(scores)
        if mean_score == 0:
            return 0.0

        variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
        std_dev = variance**0.5

        cv = std_dev / mean_score if mean_score > 0 else 0
        consistency = max(0, 100 - (cv * 100))
        return round(consistency, 2)


form_analysis_service = FormAnalysisService()
