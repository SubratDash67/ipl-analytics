from flask import Blueprint, request, jsonify
from datetime import datetime
import logging
from app.services.database_service import database_service

api_bp = Blueprint("api", __name__, url_prefix="/api")
logger = logging.getLogger(__name__)


@api_bp.route("/health", methods=["GET"])
def health_check():
    return (
        jsonify(
            {
                "status": "IPL Analytics API is running",
                "timestamp": datetime.now().isoformat(),
                "version": "2.0.0",
                "local": True,
            }
        ),
        200,
    )


@api_bp.route("/data/summary", methods=["GET"])
def get_data_summary():
    """Get summary statistics of the dataset"""
    try:
        summary = database_service.get_data_summary()
        return jsonify(summary), 200
    except Exception as e:
        logger.error(f"Error getting data summary: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/players/search", methods=["GET"])
def search_players():
    """Search for players"""
    try:
        query = request.args.get("q", "")
        player_type = request.args.get("type", "both")

        if len(query) < 2:
            return jsonify({"batters": [], "bowlers": []}), 200

        results = database_service.search_players(query, player_type)
        return jsonify(results), 200

    except Exception as e:
        logger.error(f"Error searching players: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/stats/head-to-head/<batter>/<bowler>", methods=["GET"])
def get_head_to_head_stats(batter, bowler):
    """Get head-to-head statistics between batter and bowler"""
    try:
        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
            "match_type": request.args.get("match_type"),
        }
        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}

        stats = database_service.get_head_to_head_stats(batter, bowler, filters)
        return jsonify(stats), 200

    except Exception as e:
        logger.error(f"Error getting head-to-head stats: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/stats/player/<player>", methods=["GET"])
def get_player_stats(player):
    """Get individual player statistics"""
    try:
        player_type = request.args.get("type", "batter")
        stats = database_service.get_player_stats(player, player_type)
        return jsonify(stats), 200

    except Exception as e:
        logger.error(f"Error getting player stats: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/filters", methods=["GET"])
def get_filters():
    """Get available filter options"""
    try:
        filters = database_service.get_available_filters()
        return jsonify(filters), 200

    except Exception as e:
        logger.error(f"Error getting filters: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/players/<player>/matchups", methods=["GET"])
def get_player_matchups(player):
    """Get player matchups"""
    try:
        player_type = request.args.get("type", "batter")
        matchups = database_service.get_player_matchups(player, player_type)
        return jsonify(matchups), 200

    except Exception as e:
        logger.error(f"Error getting player matchups: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/match/<int:match_id>", methods=["GET"])
def get_match_details(match_id):
    """Get match details"""
    try:
        match_details = database_service.get_match_details(match_id)
        return jsonify(match_details), 200

    except Exception as e:
        logger.error(f"Error getting match details: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "API endpoint not found"}), 404


@api_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500
