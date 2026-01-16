"""
Migration script to update old discipline names in MongoDB.
Converts 'Squats' and 'Bench Press' workouts to 'Strength & Conditioning'.

Usage: python migrate_disciplines.py
"""

from pymongo import MongoClient
import os
from dotenv import load_dotenv
import certifi

# Load .env file
load_dotenv()

# Get MongoDB URI from environment
mongodb_uri = os.getenv("MONGODB_URI")

if not mongodb_uri:
    print("ERROR: MONGODB_URI not found in .env file")
    exit(1)

def migrate():
    # Connect to MongoDB Atlas with SSL cert
    client = MongoClient(mongodb_uri, tlsCAFile=certifi.where())
    
    # Use the correct database name: mma-tracker-dev
    db = client["mma-tracker-dev"]
    
    print(f"Connected to MongoDB Atlas")
    print(f"Database: mma-tracker-dev")
    
    # Show current count of problematic records
    squats_count = db.workouts.count_documents({"discipline": "Squats"})
    bench_count = db.workouts.count_documents({"discipline": "Bench Press"})
    print(f"Found {squats_count} 'Squats' workouts")
    print(f"Found {bench_count} 'Bench Press' workouts")
    
    # Update Squats -> Strength & Conditioning
    result1 = db.workouts.update_many(
        {"discipline": "Squats"},
        {"$set": {"discipline": "Strength & Conditioning"}}
    )
    print(f"Updated {result1.modified_count} 'Squats' workouts")
    
    # Update Bench Press -> Strength & Conditioning
    result2 = db.workouts.update_many(
        {"discipline": "Bench Press"},
        {"$set": {"discipline": "Strength & Conditioning"}}
    )
    print(f"Updated {result2.modified_count} 'Bench Press' workouts")
    
    # Close connection
    client.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
