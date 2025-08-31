from flask import Flask
from flask_cors import CORS
from main.models import db
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
CORS(app, supports_credentials=True, origins=['http://localhost:5173','https://ticket-manager-gle7.vercel.app/'])

db.init_app(app)
migrate = Migrate(app,db)
bcrypt.init_app(app)

app.register_blueprint(auth)
app.register_blueprint(ticket)
app.register_blueprint(admin)

@app.route('/')
def home():
    return "Hello system live"

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    # For development only. For production, use a WSGI server like Gunicorn or uWSGI.
    debug_mode = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    app.run(debug=debug_mode, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
