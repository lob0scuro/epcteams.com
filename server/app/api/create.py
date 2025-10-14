from flask import Blueprint, jsonify, request
from app.models import User, Volunteer, Team, Schedule
from app.extensions import db
from flask_login import login_required, current_user

create_bp = Blueprint("create", __name__)

@create_bp.route("/add_volunteer", methods=["POST"])
def add_volunteer():
    data = request.get_json()
    if not data:
        return jsonify(success=False, message="No data in payload."), 400
    first_name = data.get("first_name").capitalize()
    last_name = data.get("last_name").capitalize()
    
    if not current_user.team:
        return jsonify(success=False, message="You don't lead a team yet"), 400
    
    volunteer = Volunteer(first_name=first_name, last_name=last_name)
    volunteer.teams.append(current_user.team)
    
    try:
        db.session.add(volunteer)
        db.session.commit()
        return jsonify(success=True, message="Volunteer has been added to your list!", volunteer=volunteer.serialize()), 201
    except Exception as e:
        print(f"Error when submitting volunteer: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"Error when submitting volunteer: {e}"), 500