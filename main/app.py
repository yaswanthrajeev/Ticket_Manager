from flask import Flask
from flask_cors import CORS
from models import db
from tickets import ticket
from admin import admin
from auth import auth, bcrypt

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = 'your_secret_key'

# Enable CORS
CORS(app, supports_credentials=True, origins=['http://localhost:5173'])

db.init_app(app)
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
    app.run(debug=True)
