from flask import Blueprint, request, jsonify
from datetime import datetime
import logging
from app.services.database_service import database_service
from app.services.venue_analysis_service import venue_analysis_service

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


@api_bp.route("/venues", methods=["GET"])
def get_venues():
    """Get all venues"""
    try:
        venues = database_service.get_venues()
        return jsonify({"venues": venues}), 200

    except Exception as e:
        logger.error(f"Error getting venues: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/venue-breakdown/<batter>/<bowler>", methods=["GET"])
def get_venue_breakdown_route(batter, bowler):
    """Get venue breakdown for batter vs bowler"""
    try:
        filters = {"season": request.args.get("season")}
        filters = {k: v for k, v in filters.items() if v is not None}

        breakdown = venue_analysis_service.get_venue_breakdown(batter, bowler, filters)
        return jsonify(breakdown), 200

    except Exception as e:
        logger.error(f"Error getting venue breakdown: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/season-trends/<batter>/<bowler>", methods=["GET"])
def get_season_trends_route(batter, bowler):
    """Get season trends for batter vs bowler"""
    try:
        filters = {"venue": request.args.get("venue")}
        filters = {k: v for k, v in filters.items() if v is not None}

        trends = venue_analysis_service.get_season_trends(batter, bowler, filters)
        return jsonify(trends), 200

    except Exception as e:
        logger.error(f"Error getting season trends: {e}")
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
