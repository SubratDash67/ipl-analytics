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

    # Configure CORS properly for production
    if config_name == "production":
        CORS(
            app,
            origins=["https://bowlervbatsman.netlify.app", "https://*.netlify.app"],
            methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
            supports_credentials=True,
        )
    else:
        CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

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
