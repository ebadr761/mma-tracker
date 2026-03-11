from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

import ssl

class Database:
    client: AsyncIOMotorClient = None

    def connect(self):
        # Force TLS 1.2 — OpenSSL 3.5 TLS 1.3 defaults break Atlas free-tier
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        ctx.maximum_version = ssl.TLSVersion.TLSv1_2

        self.client = AsyncIOMotorClient(settings.mongodb_uri, ssl=ctx)
        print("Connected to MongoDB")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def get_db(self):
        return self.client.get_database("mma-tracker-dev")

db = Database()
