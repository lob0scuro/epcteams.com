from flask import Blueprint, jsonify, request
from app.models import User, Volunteer, Team, Schedule
from app.extensions import db
from flask_login import login_required, current_user
from datetime import datetime

edit_bp = Blueprint("edit", __name__)

@edit_bp.route("/edit_volunteer/<int:id>", methods=["PATCH"])
def edit_volunteer(id):
    volunteer = Volunteer.query.get(id)
    if not volunteer:
        return jsonify(success=False, message="Volunteer not found."), 400
    try:
        data = request.get_json()
        volunteer.first_name = data.get("first_name", volunteer.first_name)
        volunteer.last_name = data.get("last_name", volunteer.last_name)
        db.session.commit()
        return jsonify(success=True, message="Volunteer information updated. You may need to refresh screen to apply changes."), 200
    except Exception as e:
        print(f"There was an error when editing volunteer: {e}")
        db.session.rollback()
        return jsonify(success=False, message=f"There was an error when editing volunteer: {e}"), 500