from flask import Blueprint, request, jsonify
import logging
from app.services.database_service import database_service
from app.services.data_loader import data_loader
from app.services.analytics_service import analytics_service

api_bp = Blueprint("api", __name__, url_prefix="/api")
logger = logging.getLogger(__name__)


@api_bp.route("/health", methods=["GET"])
def health_check():
    try:
        status = database_service.get_database_status()
        return jsonify({"status": "healthy", "database_status": status}), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({"status": "unhealthy", "error": str(e)}), 500


@api_bp.route("/data/summary", methods=["GET"])
def get_data_summary():
    try:
        summary = data_loader.get_data_summary()
        return jsonify(summary), 200
    except Exception as e:
        logger.error(f"Error fetching data summary: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/players/search", methods=["GET"])
def search_players():
    try:
        query = request.args.get("q", "").strip()
        player_type = request.args.get("type", "both")

        if not query:
            return jsonify({"error": "Query parameter required"}), 400

        if len(query) < 2:
            return jsonify({"error": "Query must be at least 2 characters"}), 400

        results = database_service.search_players(query, player_type)
        return jsonify(results), 200

    except Exception as e:
        logger.error(f"Error searching players: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/players/<player>/matchups", methods=["GET"])
def get_player_matchups(player):
    try:
        player_type = request.args.get("type", "batter")

        if player_type not in ["batter", "bowler"]:
            return jsonify({"error": "Invalid player type"}), 400

        matchups = database_service.get_player_matchups(player, player_type)
        return jsonify({"matchups": matchups}), 200

    except Exception as e:
        logger.error(f"Error fetching player matchups: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/head-to-head/<batter>/<bowler>", methods=["GET"])
def get_head_to_head(batter, bowler):
    try:
        filters = {}

        if request.args.get("season"):
            filters["season"] = request.args.get("season")
        if request.args.get("venue"):
            filters["venue"] = request.args.get("venue")
        if request.args.get("match_type"):
            filters["match_type"] = request.args.get("match_type")
        if request.args.get("phase"):
            filters["phase"] = request.args.get("phase")

        deliveries = database_service.get_head_to_head_deliveries(
            batter, bowler, filters
        )

        return (
            jsonify(
                {
                    "batter": batter,
                    "bowler": bowler,
                    "total_deliveries": len(deliveries),
                    "filters_applied": filters,
                    "deliveries": deliveries,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching head-to-head data: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/stats/head-to-head/<batter>/<bowler>", methods=["GET"])
def get_head_to_head_stats(batter, bowler):
    try:
        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
            "phase": request.args.get("phase"),
            "match_type": request.args.get("match_type"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        stats = analytics_service.get_head_to_head_stats(batter, bowler, filters)
        if "error" in stats:
            return jsonify(stats), 400
        return jsonify(stats), 200

    except Exception as e:
        logger.error(f"Error getting H2H stats: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/stats/player/<player>", methods=["GET"])
def get_player_stats(player):
    try:
        player_type = request.args.get("type", "batter")
        filters = {
            "season": request.args.get("season"),
            "venue": request.args.get("venue"),
            "phase": request.args.get("phase"),
            "match_type": request.args.get("match_type"),
        }
        filters = {k: v for k, v in filters.items() if v is not None}

        stats = analytics_service.get_player_stats(player, player_type, filters)
        if "error" in stats:
            return jsonify(stats), 400
        return jsonify(stats), 200

    except Exception as e:
        logger.error(f"Error getting player stats: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/filters", methods=["GET"])
def get_available_filters():
    try:
        filters = database_service.get_available_filters()
        return jsonify(filters), 200
    except Exception as e:
        logger.error(f"Error fetching filters: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/match/<int:match_id>", methods=["GET"])
def get_match_details(match_id):
    try:
        match = database_service.get_match_details(match_id)
        if match:
            return jsonify(match.to_dict()), 200
        else:
            return jsonify({"error": "Match not found"}), 404
    except Exception as e:
        logger.error(f"Error fetching match details: {e}")
        return jsonify({"error": str(e)}), 500


@api_bp.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404


@api_bp.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500
