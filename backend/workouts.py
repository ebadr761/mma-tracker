from flask import Blueprint, request, jsonify, session
from models import Workout
from bson import ObjectId

workouts_bp = Blueprint('workouts', __name__, url_prefix='/api/workouts')

def require_auth(f):
    """Decorator to require authentication"""
    def decorated_function(*args, **kwargs):
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'Authentication required'}), 401
        return f(user_id, *args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

def serialize_workout(workout):
    """Convert workout object to JSON-serializable format"""
    if workout:
        return {
            'id': str(workout['_id']),
            'user_id': str(workout['user_id']),
            'discipline': workout['discipline'],
            'duration': workout['duration'],
            'intensity': workout['intensity'],
            'notes': workout['notes'],
            'date': workout['date'],
            'created_at': workout['created_at'].isoformat(),
            'updated_at': workout['updated_at'].isoformat()
        }
    return None

@workouts_bp.route('', methods=['GET'])
@require_auth
def get_workouts(user_id):
    """Get all workouts for the authenticated user"""
    try:
        limit = int(request.args.get('limit', 100))
        skip = int(request.args.get('skip', 0))

        workouts = Workout.find_by_user(user_id, limit=limit, skip=skip)
        return jsonify({
            'workouts': [serialize_workout(w) for w in workouts]
        }), 200

    except Exception as e:
        print(f"Get workouts error: {e}")
        return jsonify({'error': 'Failed to fetch workouts'}), 500


@workouts_bp.route('', methods=['POST'])
@require_auth
def create_workout(user_id):
    """Create a new workout"""
    try:
        data = request.get_json()

        # Validate input
        required_fields = ['discipline', 'duration', 'intensity']
        if not data or not all(k in data for k in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400

        discipline = data['discipline']
        duration = int(data['duration'])
        intensity = int(data['intensity'])
        notes = data.get('notes', '')
        date = data.get('date')

        # Validate values
        if duration <= 0 or duration > 1440:  # Max 24 hours
            return jsonify({'error': 'Duration must be between 1 and 1440 minutes'}), 400

        if intensity < 1 or intensity > 10:
            return jsonify({'error': 'Intensity must be between 1 and 10'}), 400

        # Create workout
        workout = Workout.create(user_id, discipline, duration, intensity, notes, date)

        return jsonify({
            'message': 'Workout created successfully',
            'workout': serialize_workout(workout)
        }), 201

    except ValueError as e:
        return jsonify({'error': 'Invalid input values'}), 400
    except Exception as e:
        print(f"Create workout error: {e}")
        return jsonify({'error': 'Failed to create workout'}), 500


@workouts_bp.route('/<workout_id>', methods=['GET'])
@require_auth
def get_workout(user_id, workout_id):
    """Get a specific workout"""
    try:
        workout = Workout.find_by_id(workout_id, user_id)

        if not workout:
            return jsonify({'error': 'Workout not found'}), 404

        return jsonify({'workout': serialize_workout(workout)}), 200

    except Exception as e:
        print(f"Get workout error: {e}")
        return jsonify({'error': 'Failed to fetch workout'}), 500


@workouts_bp.route('/<workout_id>', methods=['PUT'])
@require_auth
def update_workout(user_id, workout_id):
    """Update a workout"""
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Build update data
        update_data = {}
        if 'discipline' in data:
            update_data['discipline'] = data['discipline']
        if 'duration' in data:
            duration = int(data['duration'])
            if duration <= 0 or duration > 1440:
                return jsonify({'error': 'Duration must be between 1 and 1440 minutes'}), 400
            update_data['duration'] = duration
        if 'intensity' in data:
            intensity = int(data['intensity'])
            if intensity < 1 or intensity > 10:
                return jsonify({'error': 'Intensity must be between 1 and 10'}), 400
            update_data['intensity'] = intensity
        if 'notes' in data:
            update_data['notes'] = data['notes']
        if 'date' in data:
            update_data['date'] = data['date']

        if not update_data:
            return jsonify({'error': 'No valid fields to update'}), 400

        # Update workout
        success = Workout.update(workout_id, user_id, update_data)

        if not success:
            return jsonify({'error': 'Workout not found or update failed'}), 404

        # Fetch updated workout
        workout = Workout.find_by_id(workout_id, user_id)

        return jsonify({
            'message': 'Workout updated successfully',
            'workout': serialize_workout(workout)
        }), 200

    except ValueError as e:
        return jsonify({'error': 'Invalid input values'}), 400
    except Exception as e:
        print(f"Update workout error: {e}")
        return jsonify({'error': 'Failed to update workout'}), 500


@workouts_bp.route('/<workout_id>', methods=['DELETE'])
@require_auth
def delete_workout(user_id, workout_id):
    """Delete a workout"""
    try:
        success = Workout.delete(workout_id, user_id)

        if not success:
            return jsonify({'error': 'Workout not found'}), 404

        return jsonify({'message': 'Workout deleted successfully'}), 200

    except Exception as e:
        print(f"Delete workout error: {e}")
        return jsonify({'error': 'Failed to delete workout'}), 500


@workouts_bp.route('/stats', methods=['GET'])
@require_auth
def get_stats(user_id):
    """Get workout statistics for the authenticated user"""
    try:
        stats = Workout.get_stats(user_id)

        if not stats:
            return jsonify({
                'total_sessions': 0,
                'total_hours': 0,
                'avg_intensity': 0
            }), 200

        return jsonify({
            'total_sessions': stats['total_sessions'],
            'total_hours': round(stats['total_duration'] / 60, 1),
            'avg_intensity': round(stats['avg_intensity'], 1)
        }), 200

    except Exception as e:
        print(f"Get stats error: {e}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500
