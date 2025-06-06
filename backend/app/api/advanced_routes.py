from flask import Blueprint, request, jsonify
import logging
from app.services.partnership_service import partnership_service
from app.services.phase_analysis_service import phase_analysis_service
from app.services.form_analysis_service import form_analysis_service
from app.services.win_probability_service import win_probability_service
from app.services.venue_analysis_service import venue_analysis_service

advanced_api_bp = Blueprint("advanced_api", __name__, url_prefix="/api/advanced")
logger = logging.getLogger(__name__)


@advanced_api_bp.route("/partnerships/<player>", methods=["GET"])
def get_player_partnerships(player):
    """Get batting partnerships for a player following ICC rules"""
    try:
        logger.info(f"Partnership request for player: {player}")

        # Decode URL-encoded player name
        import urllib.parse

        decoded_player = urllib.parse.unquote(player)

        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        logger.info(f"Filters applied: {filters}")

        partnerships = partnership_service.get_player_partnerships(
            decoded_player, filters
        )

        logger.info(
            f"Partnership response: {len(partnerships.get('partnerships', []))} partnerships found"
        )

        return jsonify(partnerships), 200

    except Exception as e:
        logger.error(f"Error fetching partnerships for {player}: {e}")
        return (
            jsonify(
                {
                    "player": player,
                    "total_partnerships": 0,
                    "partnerships": [],
                    "error": str(e),
                }
            ),
            500,
        )


@advanced_api_bp.route("/partnerships/<player>/debug", methods=["GET"])
def debug_player_partnerships(player):
    """Debug endpoint to check partnership data"""
    try:
        import urllib.parse

        decoded_player = urllib.parse.unquote(player)

        # Check if player exists in deliveries
        from app.models.database import db_manager

        check_query = """
            SELECT 
                COUNT(*) as total_deliveries,
                COUNT(DISTINCT CASE WHEN batter = ? THEN non_striker END) as unique_partners_as_striker,
                COUNT(DISTINCT CASE WHEN non_striker = ? THEN batter END) as unique_partners_as_non_striker,
                COUNT(DISTINCT match_id) as matches_played
            FROM deliveries 
            WHERE (batter = ? OR non_striker = ?)
                AND batter IS NOT NULL 
                AND non_striker IS NOT NULL
                AND batter != non_striker
        """

        debug_result = db_manager.execute_query(
            check_query,
            [decoded_player, decoded_player, decoded_player, decoded_player],
        )

        sample_query = """
            SELECT 
                match_id,
                batter,
                non_striker,
                batsman_runs,
                total_runs,
                over,
                ball
            FROM deliveries 
            WHERE (batter = ? OR non_striker = ?)
                AND batter IS NOT NULL 
                AND non_striker IS NOT NULL
                AND batter != non_striker
            ORDER BY match_id, over, ball
            LIMIT 10
        """

        sample_data = db_manager.execute_query(
            sample_query, [decoded_player, decoded_player]
        )

        return (
            jsonify(
                {
                    "player": decoded_player,
                    "debug_info": dict(debug_result[0]) if debug_result else {},
                    "sample_deliveries": [dict(row) for row in sample_data],
                    "query_executed": True,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Debug error for {player}: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.route("/phase-analysis/<batter>/<bowler>", methods=["GET"])
def get_phase_analysis(batter, bowler):
    """Get phase-wise analysis (powerplay, middle, death)"""
    try:
        import urllib.parse

        decoded_batter = urllib.parse.unquote(batter)
        decoded_bowler = urllib.parse.unquote(bowler)

        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        analysis = phase_analysis_service.get_phase_analysis(
            decoded_batter, decoded_bowler, filters
        )

        return jsonify(analysis), 200

    except Exception as e:
        logger.error(f"Error in phase analysis: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.route("/form-analysis/<player>", methods=["GET"])
def get_form_analysis(player):
    """Get recent form analysis for a player"""
    try:
        import urllib.parse

        decoded_player = urllib.parse.unquote(player)

        player_type = request.args.get("type", "batter")
        last_n_matches = int(request.args.get("matches", 10))

        form_data = form_analysis_service.get_recent_form(
            decoded_player, player_type, last_n_matches
        )

        return jsonify(form_data), 200

    except Exception as e:
        logger.error(f"Error in form analysis: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.route("/win-probability", methods=["POST"])
def calculate_win_probability():
    """Calculate win probability for current match situation"""
    try:
        data = request.get_json()

        current_score = data.get("current_score", 0)
        target = data.get("target", 0)
        overs_remaining = data.get("overs_remaining", 0)
        wickets_left = data.get("wickets_left", 10)

        if not all([target, overs_remaining >= 0, wickets_left >= 0]):
            return jsonify({"error": "Invalid input parameters"}), 400

        probability_data = win_probability_service.calculate_win_probability(
            current_score, target, overs_remaining, wickets_left
        )

        return jsonify(probability_data), 200

    except Exception as e:
        logger.error(f"Error calculating win probability: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Advanced API endpoint not found"}), 404


@advanced_api_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error in advanced API"}), 500
