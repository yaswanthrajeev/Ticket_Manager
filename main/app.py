from flask import Flask, jsonify, session, request
from flask_cors import CORS
from main.models import db, User
from main.tickets import ticket
from main.admin import admin
from main.auth import auth, bcrypt
from flask_migrate import Migrate


import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI', 'sqlite:///site.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', 'False') == 'True'
app.secret_key = os.environ.get('SECRET_KEY', 'your_secret_key')
# Secure session cookies for production
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('SESSION_COOKIE_SECURE', 'False') == 'True'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Enable CORS
CORS(app, 
     supports_credentials=True, 
     origins=[
         'http://localhost:5173',  # Development
         'http://localhost:3000',  # Alternative dev port
         'https://ticket-manager-gle7.vercel.app',  # Current Vercel deployment
         'https://ticket-manager-3.onrender.com',   # Backend URL (if needed)
         os.environ.get('FRONTEND_URL', 'https://ticket-manager-gle7.vercel.app')  # Environment variable fallback
     ],
     allow_headers=['Content-Type', 'Authorization'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
)

db.init_app(app)
migrate = Migrate(app,db)
bcrypt.init_app(app)

app.register_blueprint(auth)
app.register_blueprint(ticket)
app.register_blueprint(admin)

@app.route('/')
def home():
    return "Hello system live"

@app.route('/migrate-db')
def migrate_db():
    try:
        with app.app_context():
            from flask_migrate import upgrade
            upgrade()
        return "Database migrated successfully!"
    except Exception as e:
        return f"Error migrating database: {str(e)}"

@app.route('/make-admin/<username>')
def make_admin(username):
    try:
        with app.app_context():
            user = User.query.filter_by(username=username).first()
            if user:
                user.is_admin = True
                db.session.commit()
                return f"User '{username}' is now admin!"
            else:
                return f"User '{username}' not found!"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/users')
def list_users():
    try:
        with app.app_context():
            users = User.query.all()
            user_list = [{
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_admin': user.is_admin
            } for user in users]
            return jsonify(user_list)
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/session-info')
def session_info():
    return jsonify({
        'session_data': dict(session),
        'user_id_in_session': session.get('user_id'),
        'session_id': session.get('_id'),
        'cookies': dict(request.cookies)
    })

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # For development only. For production, use a WSGI server like Gunicorn or uWSGI.
    debug_mode = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
