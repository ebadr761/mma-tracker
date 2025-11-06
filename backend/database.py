from pymongo import MongoClient
from config import Config

class Database:
    """MongoDB database connection manager"""

    _client = None
    _db = None

    @classmethod
    def initialize(cls):
        """Initialize MongoDB connection"""
        if cls._client is None:
            cls._client = MongoClient(Config.MONGODB_URI)
            cls._db = cls._client.get_database()
            print("✓ Connected to MongoDB Atlas")

    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls._db is None:
            cls.initialize()
        return cls._db

    @classmethod
    def close(cls):
        """Close database connection"""
        if cls._client:
            cls._client.close()
            print("✓ MongoDB connection closed")
