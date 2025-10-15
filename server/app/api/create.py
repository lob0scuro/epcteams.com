from flask import Blueprint, jsonify, request
from app.models import User, Volunteer, Team, Schedule
from app.extensions import db
from flask_login import login_required, current_user
from datetime import datetime

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
    
    
@create_bp.route("/schedule_volunteer/<int:id>", methods=["POST"])
def schedule_volunteer(id):
    try:
        data = request.get_json()
        sunday = data.get("sunday")
        note = data.get("note")
        sunday_date_obj = datetime.strptime(sunday, "%m/%d/%Y")
        existing = Schedule.query.filter_by(volunteer_id=id, date=sunday_date_obj).first()
        if existing:
            return jsonify(success=False, message="Volunteer is already scheduled for this date."), 400
        assigned = Schedule(volunteer_id=id, team_id=current_user.team.id, date=sunday_date_obj, notes=note if note else None)
        db.session.add(assigned)
        db.session.commit()
        return jsonify(success=True, message=f"Volunteer has been assigned to {sunday}", schedule=assigned.serialize()), 201
    except Exception as e:
        print(f"There was an error when scheduling volunteer: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"There was an error when scheduling volunteer: {e}"), 500