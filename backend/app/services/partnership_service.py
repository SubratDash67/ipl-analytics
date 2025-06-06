import logging
from typing import Dict, List, Any
from app.models.database import db_manager


class PartnershipService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def get_player_partnerships(
        self, player: str, filters: Dict = None
    ) -> Dict[str, Any]:
        """
        Get batting partnerships for a specific player following ICC partnership rules:
        - Partnership = collaboration between two batters and runs they accumulate together
        - Includes extras in partnership runs
        - Partnership ends when one batter is dismissed, retires, or innings concludes
        """
        try:
            # Step 1: Find all partnership segments where player was involved
            partnership_query = """
                WITH partnership_segments AS (
                    SELECT 
                        d.match_id,
                        d.inning,
                        d.batter as striker,
                        d.non_striker,
                        d.batsman_runs,
                        d.extras_type,
                        d.extra_runs,
                        d.total_runs,
                        d.is_wicket,
                        d.player_dismissed,
                        d.over,
                        d.ball,
                        m.season,
                        m.venue,
                        ROW_NUMBER() OVER (
                            PARTITION BY d.match_id, d.inning 
                            ORDER BY d.over, d.ball
                        ) as ball_sequence
                    FROM deliveries d
                    JOIN matches m ON d.match_id = m.id
                    WHERE (d.batter = ? OR d.non_striker = ?)
                        AND d.batter IS NOT NULL 
                        AND d.non_striker IS NOT NULL
                        AND d.batter != d.non_striker
            """

            params = [player, player]

            if filters:
                if filters.get("season"):
                    partnership_query += " AND m.season = ?"
                    params.append(filters["season"])
                if filters.get("venue"):
                    partnership_query += " AND m.venue = ?"
                    params.append(filters["venue"])

            partnership_query += """
                ),
                partnership_breaks AS (
                    SELECT 
                        match_id,
                        inning,
                        ball_sequence,
                        striker,
                        non_striker,
                        CASE 
                            WHEN is_wicket = 1 AND (player_dismissed = striker OR player_dismissed = non_striker)
                            THEN 1 
                            ELSE 0 
                        END as partnership_ends,
                        LAG(CASE 
                            WHEN is_wicket = 1 AND (player_dismissed = striker OR player_dismissed = non_striker)
                            THEN 1 
                            ELSE 0 
                        END, 1, 0) OVER (
                            PARTITION BY match_id, inning 
                            ORDER BY ball_sequence
                        ) as prev_partnership_ended
                    FROM partnership_segments
                ),
                partnership_groups AS (
                    SELECT 
                        *,
                        SUM(partnership_ends) OVER (
                            PARTITION BY match_id, inning 
                            ORDER BY ball_sequence 
                            ROWS UNBOUNDED PRECEDING
                        ) as partnership_group
                    FROM partnership_breaks
                ),
                partnership_stats AS (
                    SELECT 
                        ps.match_id,
                        ps.inning,
                        pg.partnership_group,
                        CASE 
                            WHEN ps.striker = ? THEN ps.non_striker
                            WHEN ps.non_striker = ? THEN ps.striker
                            ELSE NULL
                        END as partner,
                        -- Total partnership runs including extras (ICC rule)
                        SUM(ps.total_runs) as partnership_runs,
                        -- Individual player runs in this partnership
                        SUM(CASE WHEN ps.striker = ? THEN ps.batsman_runs ELSE 0 END) as player_runs,
                        -- Partner runs in this partnership  
                        SUM(CASE WHEN ps.striker != ? THEN ps.batsman_runs ELSE 0 END) as partner_runs,
                        -- Balls faced together
                        COUNT(CASE WHEN ps.extras_type IS NULL OR ps.extras_type != 'wides' THEN 1 END) as balls_faced,
                        -- Boundaries hit by player
                        COUNT(CASE WHEN ps.striker = ? AND ps.batsman_runs IN (4, 6) THEN 1 END) as player_boundaries,
                        -- Dot balls in partnership
                        COUNT(CASE WHEN ps.total_runs = 0 THEN 1 END) as dot_balls,
                        -- Partnership duration
                        COUNT(*) as total_balls
                    FROM partnership_segments ps
                    JOIN partnership_groups pg ON ps.match_id = pg.match_id 
                        AND ps.inning = pg.inning 
                        AND ps.ball_sequence = pg.ball_sequence
                    WHERE (ps.striker = ? OR ps.non_striker = ?)
                    GROUP BY ps.match_id, ps.inning, pg.partnership_group, partner
                    HAVING partner IS NOT NULL 
                        AND partner != ''
                        AND balls_faced >= 6  -- Minimum 6 balls for meaningful partnership
                        AND partnership_runs > 0
                )
                SELECT 
                    ? as batsman1,
                    partner as batsman2,
                    SUM(partnership_runs) as runs_scored,
                    SUM(balls_faced) as balls_faced,
                    ROUND((SUM(partnership_runs) * 100.0 / NULLIF(SUM(balls_faced), 0)), 2) as partnership_sr,
                    SUM(player_boundaries) as boundaries,
                    SUM(dot_balls) as dot_balls,
                    COUNT(*) as partnership_instances
                FROM partnership_stats
                GROUP BY partner
                ORDER BY runs_scored DESC
                LIMIT 20
            """

            # Add all player parameters
            params.extend(
                [player, player, player, player, player, player, player, player]
            )

            results = db_manager.execute_query(partnership_query, params)

            partnerships = []
            for row in results:
                if (
                    row["batsman2"]
                    and row["batsman2"].strip()
                    and row["runs_scored"] > 0
                ):
                    partnerships.append(
                        {
                            "batsman1": row["batsman1"],
                            "batsman2": row["batsman2"],
                            "runs_scored": int(row["runs_scored"] or 0),
                            "balls_faced": int(row["balls_faced"] or 0),
                            "partnership_sr": float(row["partnership_sr"] or 0.0),
                            "boundaries": int(row["boundaries"] or 0),
                            "dot_balls": int(row["dot_balls"] or 0),
                            "partnership_instances": int(
                                row["partnership_instances"] or 0
                            ),
                        }
                    )

            self.logger.info(f"Found {len(partnerships)} partnerships for {player}")

            return {
                "player": player,
                "total_partnerships": len(partnerships),
                "partnerships": partnerships,
            }

        except Exception as e:
            self.logger.error(f"Error getting partnerships for {player}: {e}")
            return {
                "player": player,
                "total_partnerships": 0,
                "partnerships": [],
                "error": str(e),
            }


partnership_service = PartnershipService()
