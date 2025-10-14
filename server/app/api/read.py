from flask import Blueprint, jsonify, request
from app.models import User, Team, Volunteer, Schedule
from app.extensions import db
from flask_login import current_user, login_required

read_bp = Blueprint("read", __name__)

@read_bp.route("/get_user/<int:id>", methods=["GET"])
def get_user(id):
    try:
        user = User.query.get(id)
        return jsonify(success=True, user=user.serialize()), 200
    except Exception as e:
        print(f"Error when fetching user: {e}")
        return jsonify(success=False, message=f"Error when fetching user: {e}"), 500
    
@read_bp.route("/get_users", methods=["GET"])
def get_users():
    try:
        users = User.query.all()
        return jsonify(success=True, users=[u.serialize() for u in users]), 200
    except Exception as e:
        print(f"Error when fetching users: {e}")
        return jsonify(success=False, message=f"Error when fetching users: {e}"), 500
    
