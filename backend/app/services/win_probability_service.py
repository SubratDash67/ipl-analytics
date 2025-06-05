from typing import List, Dict, Any, Optional
import logging
import math
from app.models.database import db_manager


class WinProbabilityService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def calculate_win_probability(
        self, current_score: int, target: int, overs_remaining: float, wickets_left: int
    ) -> Dict:
        """Calculate win probability using WASP-like model [11]"""
        try:
            # Get historical data for similar situations
            historical_data = self._get_historical_chase_data(
                target, overs_remaining, wickets_left
            )

            runs_needed = target - current_score
            balls_remaining = overs_remaining * 6

            if runs_needed <= 0:
                return {
                    "win_probability": 100.0,
                    "runs_needed": 0,
                    "required_run_rate": 0.0,
                    "situation": "target_achieved",
                }

            if wickets_left <= 0 or balls_remaining <= 0:
                return {
                    "win_probability": 0.0,
                    "runs_needed": runs_needed,
                    "required_run_rate": float("inf"),
                    "situation": "impossible",
                }

            required_run_rate = (runs_needed / balls_remaining) * 6

            # Calculate probability based on historical success rate
            win_prob = self._calculate_probability_from_historical_data(
                historical_data, runs_needed, balls_remaining, wickets_left
            )

            # Adjust for pressure situations
            win_prob = self._adjust_for_pressure(
                win_prob, required_run_rate, wickets_left
            )

            return {
                "win_probability": round(win_prob, 2),
                "runs_needed": runs_needed,
                "required_run_rate": round(required_run_rate, 2),
                "balls_remaining": int(balls_remaining),
                "wickets_left": wickets_left,
                "situation": self._categorize_situation(
                    required_run_rate, wickets_left
                ),
            }

        except Exception as e:
            self.logger.error(f"Error calculating win probability: {e}")
            return {"error": str(e)}

    def _get_historical_chase_data(
        self, target_range: int, overs_remaining: float, wickets_left: int
    ) -> List[Dict]:
        """Get historical data for similar chase situations"""
        # Define target range (±20 runs)
        target_min = target_range - 20
        target_max = target_range + 20

        # Define overs range (±2 overs)
        overs_min = max(0, overs_remaining - 2)
        overs_max = overs_remaining + 2

        query = """
            SELECT m.winner, m.target_runs,
                   COUNT(*) as similar_situations
            FROM matches m
            WHERE m.target_runs BETWEEN ? AND ?
            AND m.result = 'runs'
            GROUP BY m.winner, m.target_runs
            LIMIT 100
        """

        results = db_manager.execute_query(query, (target_min, target_max))
        return [dict(row) for row in results]

    def _calculate_probability_from_historical_data(
        self,
        historical_data: List[Dict],
        runs_needed: int,
        balls_remaining: int,
        wickets_left: int,
    ) -> float:
        """Calculate probability using historical success rates [11]"""
        if not historical_data:
            # Default probability based on general cricket statistics
            return self._default_probability(runs_needed, balls_remaining, wickets_left)

        total_situations = len(historical_data)
        successful_chases = sum(1 for match in historical_data if match.get("winner"))

        base_probability = (
            (successful_chases / total_situations) * 100
            if total_situations > 0
            else 50.0
        )

        # Adjust based on current situation
        required_rr = (runs_needed / balls_remaining) * 6

        # Penalty for high required run rate
        if required_rr > 12:
            base_probability *= 0.5
        elif required_rr > 9:
            base_probability *= 0.7
        elif required_rr > 6:
            base_probability *= 0.9

        # Bonus for more wickets in hand
        wicket_multiplier = min(1.2, 0.8 + (wickets_left * 0.05))
        base_probability *= wicket_multiplier

        return min(95.0, max(5.0, base_probability))

    def _default_probability(
        self, runs_needed: int, balls_remaining: int, wickets_left: int
    ) -> float:
        """Default probability calculation when no historical data available"""
        required_rr = (runs_needed / balls_remaining) * 6

        # Base probability based on required run rate
        if required_rr <= 6:
            base_prob = 85.0
        elif required_rr <= 8:
            base_prob = 70.0
        elif required_rr <= 10:
            base_prob = 55.0
        elif required_rr <= 12:
            base_prob = 35.0
        else:
            base_prob = 15.0

        # Adjust for wickets remaining
        wicket_factor = min(1.5, 0.5 + (wickets_left * 0.1))

        return min(95.0, max(5.0, base_prob * wicket_factor))

    def _adjust_for_pressure(
        self, base_probability: float, required_rr: float, wickets_left: int
    ) -> float:
        """Adjust probability for pressure situations [8][9]"""
        pressure_factor = 1.0

        # High pressure for very high RRR
        if required_rr > 15:
            pressure_factor = 0.6
        elif required_rr > 12:
            pressure_factor = 0.8

        # Low wickets pressure
        if wickets_left <= 2:
            pressure_factor *= 0.7
        elif wickets_left <= 4:
            pressure_factor *= 0.9

        return base_probability * pressure_factor

    def _categorize_situation(self, required_rr: float, wickets_left: int) -> str:
        """Categorize the current match situation"""
        if required_rr <= 6:
            return "comfortable"
        elif required_rr <= 9:
            return "achievable"
        elif required_rr <= 12:
            return "challenging"
        else:
            return "difficult"


win_probability_service = WinProbabilityService()
