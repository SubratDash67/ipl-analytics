from dataclasses import dataclass
from typing import Optional
from app.models.database import db_manager


@dataclass
class Match:
    id: int
    season: str
    city: Optional[str]
    date: str
    match_type: str
    player_of_match: Optional[str]
    venue: str
    team1: str
    team2: str
    toss_winner: str
    toss_decision: str
    winner: Optional[str]
    result: str
    result_margin: Optional[int]
    target_runs: Optional[int]
    target_overs: Optional[int]
    super_over: str
    method: Optional[str]
    umpire1: Optional[str]
    umpire2: Optional[str]

    @classmethod
    def get_by_id(cls, match_id: int):
        query = "SELECT * FROM matches WHERE id = ?"
        result = db_manager.execute_query(query, (match_id,))
        if result:
            row = result[0]
            return cls(**dict(row))
        return None

    @classmethod
    def get_matches_by_season(cls, season: str):
        query = "SELECT * FROM matches WHERE season = ? ORDER BY date"
        results = db_manager.execute_query(query, (season,))
        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_matches_by_venue(cls, venue: str):
        query = "SELECT * FROM matches WHERE venue = ? ORDER BY date"
        results = db_manager.execute_query(query, (venue,))
        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_matches_by_teams(cls, team1: str, team2: str = None):
        if team2:
            query = """
                SELECT * FROM matches 
                WHERE (team1 = ? AND team2 = ?) OR (team1 = ? AND team2 = ?)
                ORDER BY date
            """
            results = db_manager.execute_query(query, (team1, team2, team2, team1))
        else:
            query = """
                SELECT * FROM matches 
                WHERE team1 = ? OR team2 = ?
                ORDER BY date
            """
            results = db_manager.execute_query(query, (team1, team1))

        return [cls(**dict(row)) for row in results]

    @classmethod
    def get_all_seasons(cls):
        query = "SELECT DISTINCT season FROM matches ORDER BY season"
        results = db_manager.execute_query(query)
        return [row[0] for row in results]

    @classmethod
    def get_all_venues(cls):
        query = "SELECT DISTINCT venue FROM matches ORDER BY venue"
        results = db_manager.execute_query(query)
        return [row[0] for row in results]

    @classmethod
    def get_all_teams(cls):
        query = """
            SELECT DISTINCT team FROM (
                SELECT team1 as team FROM matches
                UNION
                SELECT team2 as team FROM matches
            ) ORDER BY team
        """
        results = db_manager.execute_query(query)
        return [row[0] for row in results]

    def to_dict(self):
        return {
            "id": self.id,
            "season": self.season,
            "city": self.city,
            "date": self.date,
            "match_type": self.match_type,
            "player_of_match": self.player_of_match,
            "venue": self.venue,
            "team1": self.team1,
            "team2": self.team2,
            "toss_winner": self.toss_winner,
            "toss_decision": self.toss_decision,
            "winner": self.winner,
            "result": self.result,
            "result_margin": self.result_margin,
            "target_runs": self.target_runs,
            "target_overs": self.target_overs,
            "super_over": self.super_over,
            "method": self.method,
            "umpire1": self.umpire1,
            "umpire2": self.umpire2,
        }
