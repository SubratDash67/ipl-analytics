from flask import Flask
from flask_cors import CORS
import logging
import os
from app.config.settings import config
from app.api.routes import api_bp
from app.api.advanced_routes import advanced_api_bp


def create_app(config_name=None):
    app = Flask(__name__)

    config_name = config_name or os.getenv("FLASK_ENV", "development")
    app.config.from_object(config[config_name])

    CORS(app, origins=config[config_name].CORS_ORIGINS)

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    # Register blueprints
    app.register_blueprint(api_bp)
    app.register_blueprint(advanced_api_bp)

    @app.route("/")
    def health():
        return {"status": "IPL Analytics API is running", "version": "2.0.0"}

    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Route not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500

    return app
