from dataclasses import dataclass
from typing import Optional, List
from app.models.database import db_manager


@dataclass
class Delivery:
    id: Optional[int]
    match_id: int
    inning: int
    batting_team: str
    bowling_team: str
    over: int
    ball: int
    batter: str
    bowler: str
    non_striker: str
    batsman_runs: int
    extra_runs: int
    total_runs: int
    extras_type: Optional[str]
    is_wicket: int
    player_dismissed: Optional[str]
    dismissal_kind: Optional[str]
    fielder: Optional[str]

    @classmethod
    def get_deliveries_by_match(cls, match_id: int):
        query = """
            SELECT * FROM deliveries 
            WHERE match_id = ? 
            ORDER BY inning, over, ball
        """
        results = db_manager.execute_query(query, (match_id,))
        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_head_to_head_deliveries(cls, batter: str, bowler: str):
        query = """
            SELECT * FROM deliveries 
            WHERE batter = ? AND bowler = ?
            ORDER BY match_id, inning, over, ball
        """
        results = db_manager.execute_query(query, (batter, bowler))
        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_batter_deliveries(cls, batter: str, match_id: int = None):
        if match_id:
            query = """
                SELECT * FROM deliveries 
                WHERE batter = ? AND match_id = ?
                ORDER BY inning, over, ball
            """
            results = db_manager.execute_query(query, (batter, match_id))
        else:
            query = """
                SELECT * FROM deliveries 
                WHERE batter = ?
                ORDER BY match_id, inning, over, ball
            """
            results = db_manager.execute_query(query, (batter,))

        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_bowler_deliveries(cls, bowler: str, match_id: int = None):
        if match_id:
            query = """
                SELECT * FROM deliveries 
                WHERE bowler = ? AND match_id = ?
                ORDER BY inning, over, ball
            """
            results = db_manager.execute_query(query, (bowler, match_id))
        else:
            query = """
                SELECT * FROM deliveries 
                WHERE bowler = ?
                ORDER BY match_id, inning, over, ball
            """
            results = db_manager.execute_query(query, (bowler,))

        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_all_batters(cls):
        query = "SELECT DISTINCT batter FROM deliveries ORDER BY batter"
        results = db_manager.execute_query(query)
        return [row[0] for row in results]

    @classmethod
    def get_all_bowlers(cls):
        query = "SELECT DISTINCT bowler FROM deliveries ORDER BY bowler"
        results = db_manager.execute_query(query)
        return [row[0] for row in results]

    @classmethod
    def get_deliveries_by_phase(cls, batter: str, bowler: str, phase: str):
        phase_conditions = {
            "powerplay": "over < 6",
            "middle": "over >= 6 AND over < 15",
            "death": "over >= 15",
        }

        if phase not in phase_conditions:
            raise ValueError(f"Invalid phase: {phase}")

        query = f"""
            SELECT * FROM deliveries 
            WHERE batter = ? AND bowler = ? AND {phase_conditions[phase]}
            ORDER BY match_id, inning, over, ball
        """
        results = db_manager.execute_query(query, (batter, bowler))
        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_deliveries_by_venue(cls, batter: str, bowler: str, venue: str):
        query = """
            SELECT d.* FROM deliveries d
            JOIN matches m ON d.match_id = m.id
            WHERE d.batter = ? AND d.bowler = ? AND m.venue = ?
            ORDER BY d.match_id, d.inning, d.over, d.ball
        """
        results = db_manager.execute_query(query, (batter, bowler, venue))
        return [cls(**dict(row)) for row in results]

    def is_legal_delivery(self) -> bool:
        return (
            self.extras_type not in ["wides", "noballs"] if self.extras_type else True
        )

    def is_boundary(self) -> bool:
        return self.batsman_runs in [4, 6]

    def is_dot_ball(self) -> bool:
        return self.total_runs == 0

    def bowler_gets_wicket_credit(self) -> bool:
        if not self.is_wicket or not self.dismissal_kind:
            return False

        credit_dismissals = ["bowled", "lbw", "caught", "stumped", "hit wicket"]
        return self.dismissal_kind.lower() in credit_dismissals

    def to_dict(self):
        return {
            "id": self.id,
            "match_id": self.match_id,
            "inning": self.inning,
            "batting_team": self.batting_team,
            "bowling_team": self.bowling_team,
            "over": self.over,
            "ball": self.ball,
            "batter": self.batter,
            "bowler": self.bowler,
            "non_striker": self.non_striker,
            "batsman_runs": self.batsman_runs,
            "extra_runs": self.extra_runs,
            "total_runs": self.total_runs,
            "extras_type": self.extras_type,
            "is_wicket": self.is_wicket,
            "player_dismissed": self.player_dismissed,
            "dismissal_kind": self.dismissal_kind,
            "fielder": self.fielder,
        }
