from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass
import logging
from app.models.database import db_manager
from app.config.settings import Config

@dataclass
class PartnershipStats:
    partnership_id: str
    batsman1: str
    batsman2: str
    runs_scored: int = 0
    balls_faced: int = 0
    partnership_sr: float = 0.0
    boundaries: int = 0
    dot_balls: int = 0
    highest_partnership: int = 0
    dismissals: int = 0
    not_outs: int = 0
    partnerships_count: int = 0

class PartnershipService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.dismissal_types_credit = Config.DISMISSAL_TYPES_BOWLER_CREDIT

    def get_batting_partnerships(self, player: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict]:
        """Get all batting partnerships for a specific player following ICC partnership rules [4]"""
        try:
            base_query = '''
                SELECT d.*, m.season, m.venue, m.date, m.winner, m.match_type
                FROM deliveries d
                JOIN matches m ON d.match_id = m.id
                WHERE (d.batter = ? OR d.non_striker = ?)
            '''
            params = [player, player]
            
            if filters:
                if filters.get('season'):
                    base_query += ' AND m.season = ?'
                    params.append(filters['season'])
                if filters.get('venue'):
                    base_query += ' AND m.venue = ?'
                    params.append(filters['venue'])
            
            base_query += ' ORDER BY m.date, d.match_id, d.inning, d.over, d.ball'
            
            results = db_manager.execute_query(base_query, params)
            return [dict(row) for row in results]
            
        except Exception as e:
            self.logger.error(f"Error fetching partnerships: {e}")
            return []

    def calculate_partnership_stats(self, deliveries: List[Dict]) -> Dict[str, PartnershipStats]:
        """Calculate partnership statistics following ICC standards [3]"""
        partnerships = {}
        current_partnership = {}
        
        for delivery in deliveries:
            match_key = f"{delivery['match_id']}_{delivery['inning']}"
            batsmen_key = tuple(sorted([delivery['batter'], delivery['non_striker']]))
            partnership_key = f"{batsmen_key[0]}_{batsmen_key[1]}"
            
            if partnership_key not in partnerships:
                partnerships[partnership_key] = PartnershipStats(
                    partnership_id=partnership_key,
                    batsman1=batsmen_key[0],
                    batsman2=batsmen_key[1]
                )
            
            partnership = partnerships[partnership_key]
            
            # Track partnership runs and balls according to ICC rules [3]
            if delivery['extras_type'] != 'wides':
                partnership.balls_faced += 1
            
            partnership.runs_scored += delivery['batsman_runs'] or 0
            
            if delivery['batsman_runs'] in [4, 6]:
                partnership.boundaries += 1
            
            if delivery['total_runs'] == 0:
                partnership.dot_balls += 1
            
            # Track dismissals in partnership
            if (delivery['is_wicket'] and 
                delivery['player_dismissed'] in [delivery['batter'], delivery['non_striker']]):
                partnership.dismissals += 1
        
        # Calculate derived statistics
        for partnership in partnerships.values():
            if partnership.balls_faced > 0:
                partnership.partnership_sr = round((partnership.runs_scored / partnership.balls_faced) * 100, 2)
            partnership.partnerships_count = 1
        
        return partnerships

    def get_pressure_partnerships(self, deliveries: List[Dict]) -> List[Dict]:
        """Analyze partnerships under pressure situations [8][9]"""
        pressure_partnerships = []
        
        for delivery in deliveries:
            # Define pressure situations: death overs, low scoring rate, wickets falling
            is_death_over = delivery['over'] >= 15  # Death overs in T20 [5]
            
            # High required run rate scenarios (>10 RPO)
            is_pressure = is_death_over
            
            if is_pressure:
                partnership_data = {
                    'match_id': delivery['match_id'],
                    'batsman1': delivery['batter'],
                    'batsman2': delivery['non_striker'],
                    'over': delivery['over'],
                    'runs': delivery['batsman_runs'],
                    'situation': 'death_overs' if is_death_over else 'pressure'
                }
                pressure_partnerships.append(partnership_data)
        
        return pressure_partnerships

partnership_service = PartnershipService()
