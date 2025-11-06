import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""

    # MongoDB Configuration
    MONGODB_URI = os.getenv('MONGODB_URI')

    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-this')

    # Session Configuration
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'False') == 'True'
    SESSION_COOKIE_HTTPONLY = os.getenv('SESSION_COOKIE_HTTPONLY', 'True') == 'True'
    SESSION_COOKIE_SAMESITE = os.getenv('SESSION_COOKIE_SAMESITE', 'Lax')
    PERMANENT_SESSION_LIFETIME = 86400  # 24 hours in seconds

    # CORS Configuration
    CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:3000']
