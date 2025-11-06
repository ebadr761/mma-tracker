from flask import Blueprint, request, jsonify, session
from models import User
from bson import ObjectId

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

def serialize_user(user):
    """Convert user object to JSON-serializable format"""
    if user:
        return {
            'id': str(user['_id']),
            'username': user['username'],
            'email': user['email']
        }
    return None

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate input
        if not data or not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({'error': 'Missing required fields'}), 400

        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']

        # Validate input lengths
        if len(username) < 3 or len(username) > 50:
            return jsonify({'error': 'Username must be between 3 and 50 characters'}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        # Create user
        user = User.create(username, email, password)

        if not user:
            return jsonify({'error': 'User with this email or username already exists'}), 409

        # Set session
        session['user_id'] = str(user['_id'])
        session.permanent = True

        return jsonify({
            'message': 'User registered successfully',
            'user': serialize_user(user)
        }), 201

    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()

        # Validate input
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Missing email or password'}), 400

        email = data['email'].strip().lower()
        password = data['password']

        # Find user
        user = User.find_by_email(email)

        if not user or not User.verify_password(password, user['password_hash']):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Set session
        session['user_id'] = str(user['_id'])
        session.permanent = True

        return jsonify({
            'message': 'Login successful',
            'user': serialize_user(user)
        }), 200

    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Get current authenticated user"""
    try:
        user_id = session.get('user_id')

        if not user_id:
            return jsonify({'error': 'Not authenticated'}), 401

        user = User.find_by_id(user_id)

        if not user:
            session.pop('user_id', None)
            return jsonify({'error': 'User not found'}), 404

        return jsonify({'user': serialize_user(user)}), 200

    except Exception as e:
        print(f"Get current user error: {e}")
        return jsonify({'error': 'Failed to get user'}), 500


@auth_bp.route('/check', methods=['GET'])
def check_auth():
    """Check if user is authenticated"""
    user_id = session.get('user_id')
    return jsonify({'authenticated': user_id is not None}), 200
