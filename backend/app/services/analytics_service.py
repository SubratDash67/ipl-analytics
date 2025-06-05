from typing import Dict, Any, Optional
import logging
from app.services.database_service import database_service
from app.services.stats_calculator import stats_calculator, BattingStats, BowlingStats

from typing import List


class AnalyticsService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_head_to_head_stats(
        self, batter: str, bowler: str, filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        try:
            deliveries = database_service.get_head_to_head_deliveries(
                batter, bowler, filters
            )

            if not deliveries:
                return {"error": "No deliveries found for this matchup"}

            batting_stats = stats_calculator.calculate_batting_stats(deliveries)
            bowling_stats = stats_calculator.calculate_bowling_stats(deliveries)

            phase_stats = {
                "powerplay": stats_calculator.calculate_phase_stats(
                    deliveries, "powerplay"
                ),
                "middle": stats_calculator.calculate_phase_stats(deliveries, "middle"),
                "death": stats_calculator.calculate_phase_stats(deliveries, "death"),
            }

            return {
                "batter": batter,
                "bowler": bowler,
                "total_deliveries": len(deliveries),
                "batting_stats": self._serialize_batting_stats(batting_stats),
                "bowling_stats": self._serialize_bowling_stats(bowling_stats),
                "phase_stats": {
                    phase: {
                        "batting": self._serialize_batting_stats(data["batting"]),
                        "bowling": self._serialize_bowling_stats(data["bowling"]),
                    }
                    for phase, data in phase_stats.items()
                },
                "yearly_breakdown": self._get_yearly_breakdown(deliveries),
            }

        except Exception as e:
            self.logger.error(f"Error calculating H2H stats: {e}")
            return {"error": str(e)}

    def get_player_stats(
        self, player: str, player_type: str, filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        try:
            if player_type == "batter":
                deliveries = database_service.get_batter_deliveries(player, filters)
            elif player_type == "bowler":
                deliveries = database_service.get_bowler_deliveries(player, filters)
            else:
                return {"error": "Invalid player type"}

            if not deliveries:
                return {"error": "No deliveries found"}

            if player_type == "batter":
                stats = stats_calculator.calculate_batting_stats(deliveries)
                return {
                    "player": player,
                    "type": player_type,
                    "stats": self._serialize_batting_stats(stats),
                    "total_deliveries": len(deliveries),
                }
            else:
                stats = stats_calculator.calculate_bowling_stats(deliveries)
                return {
                    "player": player,
                    "type": player_type,
                    "stats": self._serialize_bowling_stats(stats),
                    "total_deliveries": len(deliveries),
                }

        except Exception as e:
            self.logger.error(f"Error calculating player stats: {e}")
            return {"error": str(e)}

    def _get_yearly_breakdown(self, deliveries: List[Dict]) -> List[Dict]:
        yearly_data = {}

        for delivery in deliveries:
            season = delivery["season"]
            if season not in yearly_data:
                yearly_data[season] = []
            yearly_data[season].append(delivery)

        breakdown = []
        for season, season_deliveries in sorted(yearly_data.items()):
            batting_stats = stats_calculator.calculate_batting_stats(season_deliveries)
            breakdown.append(
                {
                    "season": season,
                    "runs": batting_stats.total_runs,
                    "balls": batting_stats.balls_faced,
                    "dismissals": batting_stats.dismissals,
                    "dots": batting_stats.dot_balls,
                    "fours": batting_stats.fours,
                    "sixes": batting_stats.sixes,
                    "strike_rate": batting_stats.strike_rate,
                    "average": (
                        batting_stats.average if batting_stats.dismissals > 0 else None
                    ),
                }
            )

        return breakdown

    def _serialize_batting_stats(self, stats: BattingStats) -> Dict:
        return {
            "runs": stats.total_runs,
            "balls_faced": stats.balls_faced,
            "dismissals": stats.dismissals,
            "not_outs": stats.not_outs,
            "innings": stats.innings,
            "average": stats.average,
            "strike_rate": stats.strike_rate,
            "boundaries": stats.boundaries,
            "fours": stats.fours,
            "sixes": stats.sixes,
            "boundary_percent": stats.boundary_percent,
            "dot_balls": stats.dot_balls,
            "dot_ball_percent": stats.dot_ball_percent,
        }

    def _serialize_bowling_stats(self, stats: BowlingStats) -> Dict:
        return {
            "runs_conceded": stats.runs_conceded,
            "balls_bowled": stats.balls_bowled,
            "wickets": stats.wickets,
            "maidens": stats.maidens,
            "economy": stats.economy,
            "average": stats.average,
            "strike_rate": stats.strike_rate,
            "dot_balls": stats.dot_balls,
            "boundaries_conceded": stats.boundary_conceded,
            "extras": stats.extras,
        }


analytics_service = AnalyticsService()
