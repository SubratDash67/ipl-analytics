import logging
from typing import Dict, List, Any
from dataclasses import dataclass
from app.models.database import db_manager
from datetime import datetime


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
        """Analyze recent form of a player"""
        try:
            if player_type == "batter":
                return self._get_batting_form(player, last_n_matches)
            else:
                return self._get_bowling_form(player, last_n_matches)

        except Exception as e:
            self.logger.error(f"Error analyzing form: {e}")
            return {"error": str(e)}

    def _get_batting_form(self, batter: str, last_n_matches: int) -> Dict:
        """Get recent batting form with proper date handling"""
        try:
            query = """
                SELECT 
                    d.match_id, 
                    d.batter,
                    COALESCE(m.date, '2020-01-01') as match_date,
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
                        THEN 1 
                        ELSE 0 
                    END) as dismissed
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.batter = ?
                GROUP BY d.match_id, d.batter, m.date, m.season
                HAVING balls_faced > 0
                ORDER BY m.date DESC, d.match_id DESC
                LIMIT ?
            """

            results = db_manager.execute_query(query, (batter, last_n_matches))

            if not results:
                return {"error": "No recent matches found"}

            matches_data = []
            for row in results:
                match_dict = dict(row)

                # Handle date formatting properly
                try:
                    if (
                        match_dict["match_date"]
                        and match_dict["match_date"] != "Unknown"
                    ):
                        # Try to parse and format the date
                        if isinstance(match_dict["match_date"], str):
                            # Handle various date formats
                            date_str = match_dict["match_date"]
                            if len(date_str) == 10 and "-" in date_str:  # YYYY-MM-DD
                                match_dict["date"] = date_str
                            else:
                                match_dict["date"] = "2020-01-01"  # Default fallback
                        else:
                            match_dict["date"] = "2020-01-01"
                    else:
                        match_dict["date"] = "2020-01-01"
                except:
                    match_dict["date"] = "2020-01-01"

                # Calculate individual match strike rate with proper validation
                runs = match_dict["runs"] or 0
                balls = match_dict["balls_faced"] or 0

                if balls > 0 and runs >= 0:
                    strike_rate = (runs / balls) * 100
                    # Validate strike rate is realistic (0-400%)
                    if strike_rate <= 400:
                        match_dict["strike_rate"] = round(strike_rate, 2)
                    else:
                        match_dict["strike_rate"] = 0.0
                else:
                    match_dict["strike_rate"] = 0.0

                matches_data.append(match_dict)

            # Calculate aggregate statistics with validation
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

            # Calculate batting average
            if total_dismissals > 0:
                form_stats.average = round(total_runs / total_dismissals, 2)
            else:
                form_stats.average = total_runs if total_runs > 0 else 0.0

            # Calculate strike rate with validation
            if total_balls > 0:
                calculated_sr = (total_runs / total_balls) * 100
                if calculated_sr <= 400:  # Realistic strike rate
                    form_stats.strike_rate = round(calculated_sr, 2)
                else:
                    form_stats.strike_rate = 0.0
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

        except Exception as e:
            self.logger.error(f"Error getting batting form: {e}")
            return {"error": str(e)}

    def _get_bowling_form(self, bowler: str, last_n_matches: int) -> Dict:
        """Get recent bowling form with proper date handling"""
        try:
            query = """
                SELECT 
                    d.match_id, 
                    d.bowler,
                    COALESCE(m.date, '2020-01-01') as match_date,
                    COALESCE(m.season, 'Unknown') as season,
                    SUM(CASE WHEN d.total_runs IS NOT NULL THEN d.total_runs ELSE 0 END) as runs_conceded,
                    COUNT(CASE 
                        WHEN d.extras_type IS NULL 
                        OR d.extras_type NOT IN ('wides', 'noballs') 
                        THEN 1 
                    END) as balls_bowled,
                    COUNT(CASE 
                        WHEN d.is_wicket = 1 
                        THEN 1 
                    END) as wickets
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE d.bowler = ?
                GROUP BY d.match_id, d.bowler, m.date, m.season
                HAVING balls_bowled > 0
                ORDER BY m.date DESC, d.match_id DESC
                LIMIT ?
            """

            results = db_manager.execute_query(query, (bowler, last_n_matches))

            if not results:
                return {"error": "No recent matches found"}

            matches_data = []
            for row in results:
                match_dict = dict(row)

                # Handle date formatting
                try:
                    if (
                        match_dict["match_date"]
                        and match_dict["match_date"] != "Unknown"
                    ):
                        date_str = match_dict["match_date"]
                        if len(date_str) == 10 and "-" in date_str:
                            match_dict["date"] = date_str
                        else:
                            match_dict["date"] = "2020-01-01"
                    else:
                        match_dict["date"] = "2020-01-01"
                except:
                    match_dict["date"] = "2020-01-01"

                # Calculate individual match economy rate
                runs_conceded = match_dict["runs_conceded"] or 0
                balls_bowled = match_dict["balls_bowled"] or 0

                if balls_bowled > 0:
                    overs = balls_bowled / 6.0
                    economy = runs_conceded / overs
                    # Validate economy rate is realistic (0-25)
                    if economy <= 25:
                        match_dict["economy_rate"] = round(economy, 2)
                    else:
                        match_dict["economy_rate"] = 0.0
                else:
                    match_dict["economy_rate"] = 0.0

                matches_data.append(match_dict)

            # Calculate bowling statistics
            total_runs = sum(match["runs_conceded"] for match in matches_data)
            total_balls = sum(match["balls_bowled"] for match in matches_data)
            total_wickets = sum(match["wickets"] for match in matches_data)

            form_stats = FormStats(
                matches_played=len(matches_data),
                runs_scored=total_runs,  # runs_conceded for bowlers
                balls_faced=total_balls,  # balls_bowled for bowlers
            )

            # Calculate economy rate
            if total_balls > 0:
                overs = total_balls / 6.0
                economy = total_runs / overs
                if economy <= 25:  # Realistic economy
                    form_stats.strike_rate = round(economy, 2)  # economy rate
                else:
                    form_stats.strike_rate = 0.0
            else:
                form_stats.strike_rate = 0.0

            # Calculate bowling average
            if total_wickets > 0:
                form_stats.average = round(total_runs / total_wickets, 2)
            else:
                form_stats.average = 0.0

            # Calculate form trend
            wicket_scores = [match["wickets"] for match in matches_data]
            form_stats.form_trend = self._calculate_trend(wicket_scores)
            form_stats.consistency_rating = self._calculate_consistency(wicket_scores)

            return {
                "player": bowler,
                "type": "bowling",
                "form_stats": form_stats.__dict__,
                "recent_matches": matches_data,
            }

        except Exception as e:
            self.logger.error(f"Error getting bowling form: {e}")
            return {"error": str(e)}

    def _calculate_trend(self, scores: List[int]) -> str:
        """Calculate form trend based on recent scores"""
        if len(scores) < 3:
            return "insufficient_data"

        # Compare first half with second half
        mid = len(scores) // 2
        first_half_avg = sum(scores[:mid]) / mid if mid > 0 else 0
        second_half_avg = (
            sum(scores[mid:]) / (len(scores) - mid) if len(scores) - mid > 0 else 0
        )

        if second_half_avg > first_half_avg * 1.2:
            return "improving"
        elif second_half_avg < first_half_avg * 0.8:
            return "declining"
        else:
            return "stable"

    def _calculate_consistency(self, scores: List[int]) -> float:
        """Calculate consistency rating based on score variance"""
        if len(scores) < 2:
            return 0.0

        mean_score = sum(scores) / len(scores)
        if mean_score == 0:
            return 0.0

        variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
        std_dev = variance**0.5

        # Consistency rating (lower std dev relative to mean = higher consistency)
        consistency = max(0, 100 - (std_dev / mean_score * 100))
        return round(consistency, 1)


form_analysis_service = FormAnalysisService()
