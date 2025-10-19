from flask import Blueprint, jsonify, request
from app.models import User, Volunteer, Team, Schedule
from app.extensions import db
from flask_login import login_required, current_user
from datetime import datetime

delete_bp = Blueprint("delete", __name__)

@delete_bp.route("/unassign_volunteer/<int:id>", methods=["DELETE"])
def unassign_volunteer(id):
    volunteer = Volunteer.query.get(id)
    if not volunteer:
        return jsonify(success=False, message="Volunteer not found."), 400
    try:
        data = request.get_json()
        date_str = data.get("date")
        if not date_str:
            return jsonify(success=False, message="Missing schedulued date."), 400
        scheduled_date = Schedule.query.filter_by(volunteer_id=id, date=datetime.fromisoformat(date_str)).first()
        if not scheduled_date:
            return jsonify(success=False, message="Volunteer not scheduled for this date."), 400
        db.session.delete(scheduled_date)
        db.session.commit()
        return jsonify(success=True, message=f"{volunteer.first_name} has been removed from the schedule."), 200
    except Exception as e:
        print(f"There was an error when unassigning volunteer: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"There was an error when unassigning volunteer: {e}"), 500
    
@delete_bp.route("/delete_volunteer/<int:id>", methods=["DELETE"])
def delete_volunteer(id):
    try:
        volunteer = Volunteer.query.get(id)
        if not volunteer:
            return jsonify(success=False, message="Volunteer not found."), 400
        volunteer_schedules = Schedule.query.filter_by(volunteer_id=id).all()
        for s in volunteer_schedules:
            db.session.delete(s)
        db.session.delete(volunteer)
        db.session.commit()
        return jsonify(success=True, message="Volunteer has been removed."), 200
    except Exception as e:
        print(f"There was an error when deleting volunteer: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"There was an error when deleting volunteer: {e}"), 500