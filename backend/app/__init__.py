from flask import Flask, request, make_response
from flask_cors import CORS
import logging
import os
from app.config.settings import config
from app.api.routes import api_bp
from app.api.advanced_routes import advanced_api_bp


def create_app(config_name=None):
    app = Flask(__name__)

    config_name = config_name or os.getenv("FLASK_ENV", "production")
    app.config.from_object(config[config_name])

    # Configure CORS with explicit settings
    CORS(
        app,
        origins=[
            "https://bowlervbatsman.netlify.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Authorization",
            "X-Requested-With",
            "Accept",
            "Origin",
        ],
        supports_credentials=False,
        expose_headers=["Content-Length", "X-Requested-With"],
    )

    # Add CORS headers manually as backup
    @app.after_request
    def after_request(response):
        origin = request.headers.get("Origin")
        allowed_origins = [
            "https://bowlervbatsman.netlify.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

        if origin in allowed_origins:
            response.headers.add("Access-Control-Allow-Origin", origin)
        else:
            response.headers.add(
                "Access-Control-Allow-Origin", "https://bowlervbatsman.netlify.app"
            )

        response.headers.add(
            "Access-Control-Allow-Headers",
            "Content-Type,Authorization,X-Requested-With,Accept,Origin",
        )
        response.headers.add(
            "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
        )
        response.headers.add("Access-Control-Allow-Credentials", "false")
        return response

    # Handle preflight requests
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = make_response()
            response.headers.add(
                "Access-Control-Allow-Origin", "https://bowlervbatsman.netlify.app"
            )
            response.headers.add(
                "Access-Control-Allow-Headers",
                "Content-Type,Authorization,X-Requested-With,Accept,Origin",
            )
            response.headers.add(
                "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
            )
            return response

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )

    # Register blueprints
    app.register_blueprint(api_bp)
    app.register_blueprint(advanced_api_bp)

    @app.route("/")
    def health():
        return {
            "status": "IPL Analytics API is running",
            "version": "2.0.0",
            "environment": config_name,
            "cors_enabled": True,
            "allowed_origins": [
                "https://bowlervbatsman.netlify.app",
                "http://localhost:3000",
            ],
        }

    @app.route("/health")
    def health_check():
        return {
            "status": "healthy",
            "service": "ipl-analytics-backend",
            "environment": config_name,
            "cors_enabled": True,
        }

    # Test CORS endpoint
    @app.route("/test-cors")
    def test_cors():
        return {
            "message": "CORS is working",
            "origin": request.headers.get("Origin", "No origin header"),
            "method": request.method,
        }

    @app.errorhandler(404)
    def not_found(error):
        return {"error": "Route not found"}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {"error": "Internal server error"}, 500

    return app
