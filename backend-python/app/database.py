from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings


class Database:
    client: AsyncIOMotorClient = None

    def connect(self):
        uri = settings.mongodb_uri
        # Append TLS params directly to URI for maximum compatibility
        sep = "&" if "?" in uri else "?"
        uri += f"{sep}tls=true&tlsInsecure=true"
        self.client = AsyncIOMotorClient(uri)
        print("Connected to MongoDB")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def get_db(self):
        return self.client.get_database("mma-tracker-dev")

db = Database()
