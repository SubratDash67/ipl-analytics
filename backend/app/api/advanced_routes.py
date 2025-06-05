from flask import Blueprint, request, jsonify
import logging
from app.services.partnership_service import partnership_service
from app.services.phase_analysis_service import phase_analysis_service
from app.services.form_analysis_service import form_analysis_service
from app.services.win_probability_service import win_probability_service

advanced_api_bp = Blueprint("advanced_api", __name__, url_prefix="/api/advanced")
logger = logging.getLogger(__name__)


@advanced_api_bp.route("/partnerships/<player>", methods=["GET"])
def get_player_partnerships(player):
    """Get batting partnerships for a player"""
    try:
        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        deliveries = partnership_service.get_batting_partnerships(player, filters)
        partnerships = partnership_service.calculate_partnership_stats(deliveries)

        # Convert to serializable format
        partnerships_list = []
        for partnership in partnerships.values():
            partnerships_list.append(
                {
                    "batsman1": partnership.batsman1,
                    "batsman2": partnership.batsman2,
                    "runs_scored": partnership.runs_scored,
                    "balls_faced": partnership.balls_faced,
                    "strike_rate": partnership.partnership_sr,
                    "boundaries": partnership.boundaries,
                    "dot_balls": partnership.dot_balls,
                }
            )

        return (
            jsonify(
                {
                    "player": player,
                    "total_partnerships": len(partnerships_list),
                    "partnerships": partnerships_list,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching partnerships: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.route("/phase-analysis/<batter>/<bowler>", methods=["GET"])
def get_phase_analysis(batter, bowler):
    """Get phase-wise analysis (powerplay, middle, death)"""
    try:
        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        powerplay = phase_analysis_service.get_powerplay_analysis(
            batter, bowler, filters
        )
        middle_overs = phase_analysis_service.get_middle_overs_analysis(
            batter, bowler, filters
        )
        death_overs = phase_analysis_service.get_death_overs_analysis(
            batter, bowler, filters
        )

        return (
            jsonify(
                {
                    "batter": batter,
                    "bowler": bowler,
                    "phase_analysis": {
                        "powerplay": powerplay,
                        "middle_overs": middle_overs,
                        "death_overs": death_overs,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error in phase analysis: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.route("/form-analysis/<player>", methods=["GET"])
def get_form_analysis(player):
    """Get recent form analysis for a player"""
    try:
        player_type = request.args.get("type", "batter")
        last_n_matches = int(request.args.get("matches", 10))

        form_data = form_analysis_service.get_recent_form(
            player, player_type, last_n_matches
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


@advanced_api_bp.route("/pressure-analysis/<batter>/<bowler>", methods=["GET"])
def get_pressure_analysis(batter, bowler):
    """Get performance analysis in pressure situations"""
    try:
        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        # Get all deliveries for the matchup
        from app.services.database_service import database_service

        deliveries = database_service.get_head_to_head_deliveries(
            batter, bowler, filters
        )

        # Analyze pressure partnerships
        pressure_partnerships = partnership_service.get_pressure_partnerships(
            deliveries
        )

        # Get death overs performance specifically
        death_overs_analysis = phase_analysis_service.get_death_overs_analysis(
            batter, bowler, filters
        )

        return (
            jsonify(
                {
                    "batter": batter,
                    "bowler": bowler,
                    "pressure_analysis": {
                        "pressure_partnerships": len(pressure_partnerships),
                        "death_overs_performance": death_overs_analysis,
                        "pressure_situations": pressure_partnerships[
                            :10
                        ],  # Top 10 pressure moments
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error in pressure analysis: {e}")
        return jsonify({"error": str(e)}), 500


@advanced_api_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Advanced API endpoint not found"}), 404


@advanced_api_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error in advanced API"}), 500
