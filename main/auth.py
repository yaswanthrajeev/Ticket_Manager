from flask import Blueprint, request, session, jsonify
from main.models import db, User
from flask_bcrypt import Bcrypt

auth = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    is_admin = data.get('is_admin', False)
    user = User(username=data['username'], email=data['email'],
            password=hashed_password, is_admin=is_admin)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        return jsonify({
            "message": "Login successful",
            "is_admin": user.is_admin
        }), 200
    return jsonify(message="Invalid credentials"), 401

@auth.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify(message="Logged out"), 200
