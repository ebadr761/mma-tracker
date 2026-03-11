from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

import certifi

class Database:
    client: AsyncIOMotorClient = None

    def connect(self):
        self.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            tlsCAFile=certifi.where()
        )
        print("Connected to MongoDB")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def get_db(self):
        return self.client.get_database("mma-tracker-dev")

db = Database()
