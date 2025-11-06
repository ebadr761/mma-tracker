from datetime import datetime
from bson import ObjectId
import bcrypt
from database import Database

class User:
    """User model for authentication and authorization"""

    collection_name = 'users'

    @staticmethod
    def create(username, email, password):
        """Create a new user with hashed password"""
        db = Database.get_db()

        # Check if user already exists
        if db[User.collection_name].find_one({'$or': [{'email': email}, {'username': username}]}):
            return None

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user_data = {
            'username': username,
            'email': email,
            'password_hash': password_hash,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        result = db[User.collection_name].insert_one(user_data)
        user_data['_id'] = result.inserted_id
        return user_data

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = Database.get_db()
        return db[User.collection_name].find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        db = Database.get_db()
        return db[User.collection_name].find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def verify_password(password, password_hash):
        """Verify password against hash"""
        return bcrypt.checkpw(password.encode('utf-8'), password_hash)


class Workout:
    """Workout model for storing training sessions"""

    collection_name = 'workouts'

    @staticmethod
    def create(user_id, discipline, duration, intensity, notes, date=None):
        """Create a new workout"""
        db = Database.get_db()

        workout_data = {
            'user_id': ObjectId(user_id),
            'discipline': discipline,
            'duration': int(duration),
            'intensity': int(intensity),
            'notes': notes,
            'date': date or datetime.utcnow().strftime('%Y-%m-%d'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }

        result = db[Workout.collection_name].insert_one(workout_data)
        workout_data['_id'] = result.inserted_id
        return workout_data

    @staticmethod
    def find_by_user(user_id, limit=100, skip=0):
        """Find all workouts for a user"""
        db = Database.get_db()
        workouts = db[Workout.collection_name].find(
            {'user_id': ObjectId(user_id)}
        ).sort('date', -1).skip(skip).limit(limit)
        return list(workouts)

    @staticmethod
    def find_by_id(workout_id, user_id):
        """Find a specific workout by ID for a user"""
        db = Database.get_db()
        return db[Workout.collection_name].find_one({
            '_id': ObjectId(workout_id),
            'user_id': ObjectId(user_id)
        })

    @staticmethod
    def update(workout_id, user_id, update_data):
        """Update a workout"""
        db = Database.get_db()
        update_data['updated_at'] = datetime.utcnow()

        result = db[Workout.collection_name].update_one(
            {'_id': ObjectId(workout_id), 'user_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0

    @staticmethod
    def delete(workout_id, user_id):
        """Delete a workout"""
        db = Database.get_db()
        result = db[Workout.collection_name].delete_one({
            '_id': ObjectId(workout_id),
            'user_id': ObjectId(user_id)
        })
        return result.deleted_count > 0

    @staticmethod
    def get_stats(user_id):
        """Get workout statistics for a user"""
        db = Database.get_db()

        pipeline = [
            {'$match': {'user_id': ObjectId(user_id)}},
            {'$group': {
                '_id': None,
                'total_sessions': {'$sum': 1},
                'total_duration': {'$sum': '$duration'},
                'avg_intensity': {'$avg': '$intensity'}
            }}
        ]

        result = list(db[Workout.collection_name].aggregate(pipeline))
        return result[0] if result else None
