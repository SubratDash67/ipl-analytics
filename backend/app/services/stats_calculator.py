from dataclasses import dataclass
from typing import List, Dict, Optional
import logging
from app.config.settings import Config


@dataclass
class BattingStats:
    total_runs: int = 0
    balls_faced: int = 0
    dismissals: int = 0
    boundaries: int = 0
    sixes: int = 0
    fours: int = 0
    dot_balls: int = 0
    not_outs: int = 0
    innings: int = 0
    strike_rate: float = 0.0
    average: float = 0.0
    boundary_percent: float = 0.0
    dot_ball_percent: float = 0.0


@dataclass
class BowlingStats:
    runs_conceded: int = 0
    balls_bowled: int = 0
    wickets: int = 0
    maidens: int = 0
    economy: float = 0.0
    average: float = 0.0
    strike_rate: float = 0.0
    dot_balls: int = 0
    boundary_conceded: int = 0
    extras: int = 0


class StatsCalculator:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.dismissal_types_credit = [
            "bowled",
            "lbw",
            "caught",
            "stumped",
            "hit wicket",
        ]
        self.dismissal_types_no_credit = [
            "run out",
            "handled ball",
            "hit ball twice",
            "obstructing field",
            "timed out",
        ]

    def calculate_batting_stats(self, deliveries: List[Dict]) -> BattingStats:
        stats = BattingStats()
        innings_data = {}

        for delivery in deliveries:
            match_id = delivery["match_id"]
            inning = delivery["inning"]
            innings_key = f"{match_id}_{inning}"

            if innings_key not in innings_data:
                innings_data[innings_key] = {
                    "runs": 0,
                    "balls": 0,
                    "dismissed": False,
                    "boundaries": 0,
                    "sixes": 0,
                    "fours": 0,
                    "dots": 0,
                }

            innings = innings_data[innings_key]

            # Count balls faced (exclude wides)
            if delivery["extras_type"] != "wides":
                stats.balls_faced += 1
                innings["balls"] += 1

                # Count dot balls
                if delivery["total_runs"] == 0:
                    stats.dot_balls += 1
                    innings["dots"] += 1

            # Count runs scored by batsman
            batsman_runs = delivery["batsman_runs"] or 0
            stats.total_runs += batsman_runs
            innings["runs"] += batsman_runs

            # Count boundaries
            if batsman_runs == 4:
                stats.fours += 1
                stats.boundaries += 1
                innings["fours"] += 1
                innings["boundaries"] += 1
            elif batsman_runs == 6:
                stats.sixes += 1
                stats.boundaries += 1
                innings["sixes"] += 1
                innings["boundaries"] += 1

            # Handle dismissals
            if (
                delivery["is_wicket"]
                and delivery["player_dismissed"] == delivery["batter"]
            ):

                dismissal_kind = delivery["dismissal_kind"]
                if (
                    dismissal_kind
                    and dismissal_kind.lower() in self.dismissal_types_credit
                ):
                    innings["dismissed"] = True

        # Calculate innings-level stats
        stats.innings = len(innings_data)

        for innings in innings_data.values():
            if innings["dismissed"]:
                stats.dismissals += 1
            else:
                stats.not_outs += 1

        # Calculate derived stats
        if stats.balls_faced > 0:
            stats.strike_rate = round((stats.total_runs / stats.balls_faced) * 100, 2)
            stats.boundary_percent = round(
                (stats.boundaries / stats.balls_faced) * 100, 2
            )
            stats.dot_ball_percent = round(
                (stats.dot_balls / stats.balls_faced) * 100, 2
            )

        if stats.dismissals > 0:
            stats.average = round(stats.total_runs / stats.dismissals, 2)

        return stats

    def calculate_bowling_stats(self, deliveries: List[Dict]) -> BowlingStats:
        stats = BowlingStats()
        over_data = {}

        for delivery in deliveries:
            match_id = delivery["match_id"]
            inning = delivery["inning"]
            over = delivery["over"]
            over_key = f"{match_id}_{inning}_{over}"

            if over_key not in over_data:
                over_data[over_key] = {"runs": 0, "legal_balls": 0}

            over_info = over_data[over_key]

            # Count legal deliveries (exclude wides and no-balls)
            extras_type = delivery["extras_type"]
            is_legal = extras_type not in ["wides", "noballs"]

            if is_legal:
                stats.balls_bowled += 1
                over_info["legal_balls"] += 1

            # Count all runs conceded
            total_runs = delivery["total_runs"] or 0
            stats.runs_conceded += total_runs
            over_info["runs"] += total_runs

            # Count wickets where bowler gets credit
            if (
                delivery["is_wicket"]
                and delivery["dismissal_kind"]
                and delivery["dismissal_kind"].lower() in self.dismissal_types_credit
            ):
                stats.wickets += 1

            # Count extras
            extra_runs = delivery["extra_runs"] or 0
            if extra_runs > 0:
                stats.extras += extra_runs

            # Count boundaries conceded
            batsman_runs = delivery["batsman_runs"] or 0
            if batsman_runs in [4, 6]:
                stats.boundary_conceded += 1

            # Count dot balls (legal deliveries with no runs)
            if total_runs == 0 and is_legal:
                stats.dot_balls += 1

        # Count maiden overs
        for over_info in over_data.values():
            if over_info["legal_balls"] >= 6 and over_info["runs"] == 0:
                stats.maidens += 1

        # Calculate derived stats
        if stats.balls_bowled > 0:
            overs = stats.balls_bowled / 6.0
            stats.economy = round(stats.runs_conceded / overs, 2)

            if stats.wickets > 0:
                stats.average = round(stats.runs_conceded / stats.wickets, 2)
                stats.strike_rate = round(stats.balls_bowled / stats.wickets, 2)

        return stats

    def calculate_phase_stats(self, deliveries: List[Dict], phase: str) -> Dict:
        phase_map = {
            "powerplay": lambda d: d["over"] < 6,
            "middle": lambda d: 6 <= d["over"] < 15,
            "death": lambda d: d["over"] >= 15,
        }

        if phase not in phase_map:
            return {"batting": BattingStats(), "bowling": BowlingStats()}

        filtered = [d for d in deliveries if phase_map[phase](d)]
        return {
            "batting": self.calculate_batting_stats(filtered),
            "bowling": self.calculate_bowling_stats(filtered),
        }


stats_calculator = StatsCalculator()
