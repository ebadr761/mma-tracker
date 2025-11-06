from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import Database
from auth import auth_bp
from workouts import workouts_bp

def create_app():
    """Create and configure Flask application"""

    app = Flask(__name__)
    app.config.from_object(Config)

    # Configure CORS with credentials support
    CORS(app,
         origins=Config.CORS_ORIGINS,
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

    # Initialize database
    Database.initialize()

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(workouts_bp)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'MMA Tracker API is running'
        }), 200

    # Root endpoint
    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'message': 'MMA Tracker API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'workouts': '/api/workouts',
                'health': '/api/health'
            }
        }), 200

    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print("=" * 60)
    print("🥊 MMA Tracker API Server")
    print("=" * 60)
    print("Server running on: http://localhost:5000")
    print("API Documentation:")
    print("  - Auth: http://localhost:5000/api/auth")
    print("  - Workouts: http://localhost:5000/api/workouts")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)
