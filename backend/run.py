import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app import create_app

app = create_app("development")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting IPL Analytics API on http://localhost:{port}")
    print(f"Environment: {os.environ.get('FLASK_ENV', 'development')}")
    print(f"Database: {os.environ.get('DATABASE_PATH', 'data/ipl_data.db')}")

    app.run(host="127.0.0.1", port=port, debug=True)
