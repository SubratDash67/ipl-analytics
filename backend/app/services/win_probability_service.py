import logging
import math
from typing import Dict, Any
from app.models.database import db_manager


class WinProbabilityService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def calculate_win_probability(
        self, current_score: int, target: int, overs_remaining: float, wickets_left: int
    ) -> Dict[str, Any]:
        """Calculate win probability based on current match situation"""
        try:
            runs_needed = target - current_score
            balls_remaining = int(overs_remaining * 6)

            if runs_needed <= 0:
                return {
                    "win_probability": 100,
                    "runs_needed": 0,
                    "balls_remaining": balls_remaining,
                    "required_run_rate": 0,
                    "factors": ["Target already achieved"],
                }

            if balls_remaining <= 0 or wickets_left <= 0:
                return {
                    "win_probability": 0,
                    "runs_needed": runs_needed,
                    "balls_remaining": balls_remaining,
                    "required_run_rate": 0,
                    "factors": ["No balls or wickets remaining"],
                }

            required_run_rate = runs_needed / overs_remaining

            # Get historical data for similar situations
            historical_prob = self._get_historical_probability(
                runs_needed, balls_remaining, wickets_left
            )

            # Calculate probability using multiple factors
            base_probability = self._calculate_base_probability(required_run_rate)
            wicket_factor = self._calculate_wicket_factor(wickets_left)
            pressure_factor = self._calculate_pressure_factor(
                runs_needed, balls_remaining
            )

            # Combine factors
            final_probability = base_probability * wicket_factor * pressure_factor

            # Blend with historical data if available
            if historical_prob is not None:
                final_probability = (final_probability * 0.7) + (historical_prob * 0.3)

            final_probability = max(1, min(99, final_probability))

            factors = self._generate_factors(
                runs_needed, balls_remaining, wickets_left, required_run_rate
            )

            return {
                "win_probability": round(final_probability),
                "runs_needed": runs_needed,
                "balls_remaining": balls_remaining,
                "required_run_rate": round(required_run_rate, 2),
                "factors": factors,
            }

        except Exception as e:
            self.logger.error(f"Error calculating win probability: {e}")
            return {"error": str(e)}

    def _get_historical_probability(
        self, runs_needed: int, balls_remaining: int, wickets_left: int
    ) -> float:
        """Get historical win probability for similar situations"""
        try:
            # Query for similar match situations
            query = """
                WITH match_situations AS (
                    SELECT 
                        d.match_id,
                        d.inning,
                        m.winner,
                        d.batting_team,
                        COUNT(*) as balls_left,
                        (SELECT target_runs FROM matches WHERE id = d.match_id) - 
                        SUM(d.total_runs) OVER (PARTITION BY d.match_id, d.inning ORDER BY d.over, d.ball) as runs_left,
                        10 - COUNT(CASE WHEN d.is_wicket = 1 THEN 1 END) 
                        OVER (PARTITION BY d.match_id, d.inning ORDER BY d.over, d.ball) as wickets_remaining
                    FROM deliveries d
                    JOIN matches m ON d.match_id = m.id
                    WHERE d.inning = 2
                )
                SELECT 
                    COUNT(CASE WHEN winner = batting_team THEN 1 END) * 100.0 / COUNT(*) as win_percentage
                FROM match_situations
                WHERE runs_left BETWEEN ? AND ?
                    AND balls_left BETWEEN ? AND ?
                    AND wickets_remaining BETWEEN ? AND ?
            """

            # Create ranges for similar situations
            runs_range = max(5, runs_needed // 10)
            balls_range = max(6, balls_remaining // 6)
            wickets_range = max(1, wickets_left // 2)

            params = [
                runs_needed - runs_range,
                runs_needed + runs_range,
                balls_remaining - balls_range,
                balls_remaining + balls_range,
                wickets_left - wickets_range,
                wickets_left + wickets_range,
            ]

            results = db_manager.execute_query(query, params)

            if results and results[0]["win_percentage"] is not None:
                return float(results[0]["win_percentage"])

            return None

        except Exception as e:
            self.logger.error(f"Error getting historical probability: {e}")
            return None

    def _calculate_base_probability(self, required_run_rate: float) -> float:
        """Calculate base probability based on required run rate"""
        if required_run_rate <= 4:
            return 95
        elif required_run_rate <= 6:
            return 85
        elif required_run_rate <= 8:
            return 70
        elif required_run_rate <= 10:
            return 50
        elif required_run_rate <= 12:
            return 30
        elif required_run_rate <= 15:
            return 15
        else:
            return 5

    def _calculate_wicket_factor(self, wickets_left: int) -> float:
        """Calculate factor based on wickets remaining"""
        if wickets_left >= 8:
            return 1.2
        elif wickets_left >= 6:
            return 1.1
        elif wickets_left >= 4:
            return 1.0
        elif wickets_left >= 2:
            return 0.8
        elif wickets_left == 1:
            return 0.6
        else:
            return 0.3

    def _calculate_pressure_factor(
        self, runs_needed: int, balls_remaining: int
    ) -> float:
        """Calculate factor based on pressure situation"""
        if balls_remaining >= 60:  # 10+ overs
            return 1.1
        elif balls_remaining >= 36:  # 6+ overs
            return 1.0
        elif balls_remaining >= 24:  # 4+ overs
            return 0.9
        elif balls_remaining >= 12:  # 2+ overs
            return 0.8
        else:  # Less than 2 overs
            return 0.7

    def _generate_factors(
        self,
        runs_needed: int,
        balls_remaining: int,
        wickets_left: int,
        required_run_rate: float,
    ) -> list:
        """Generate factors affecting win probability"""
        factors = []

        factors.append(f"{runs_needed} runs needed from {balls_remaining} balls")
        factors.append(f"Required run rate: {required_run_rate:.2f}")
        factors.append(f"{wickets_left} wickets in hand")

        if required_run_rate <= 6:
            factors.append("Manageable run rate required")
        elif required_run_rate <= 10:
            factors.append("Challenging but achievable run rate")
        else:
            factors.append("Very high run rate required")

        if wickets_left >= 6:
            factors.append("Good batting depth available")
        elif wickets_left <= 3:
            factors.append("Limited batting resources")

        if balls_remaining <= 12:
            factors.append("Death overs pressure situation")

        return factors


win_probability_service = WinProbabilityService()
