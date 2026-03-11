from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

import ssl

# Patch ssl.create_default_context so PyMongo's internal context uses TLS 1.2
# OpenSSL 3.5 TLS 1.3 defaults break MongoDB Atlas free-tier handshake
_orig_create_ctx = ssl.create_default_context
def _patched_create_ctx(*args, **kwargs):
    ctx = _orig_create_ctx(*args, **kwargs)
    ctx.maximum_version = ssl.TLSVersion.TLSv1_2
    return ctx
ssl.create_default_context = _patched_create_ctx

class Database:
    client: AsyncIOMotorClient = None

    def connect(self):
        self.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            tls=True,
            tlsAllowInvalidCertificates=True,
        )
        print("Connected to MongoDB")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("Disconnected from MongoDB")
    
    def get_db(self):
        return self.client.get_database("mma-tracker-dev")

db = Database()
