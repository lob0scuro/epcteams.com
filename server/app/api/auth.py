from flask import jsonify, request, Blueprint, url_for, redirect
from app.extensions import db, bcrypt
from flask_login import login_user, logout_user, current_user, login_required
from app.models import User, Team

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify(success=False, message="No payload in request."), 400
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    pw1 = data.get("pw1")
    pw2 = data.get("pw2")
    
    team_name = data.get("team_name")
    
    if pw1.lower() != pw2.lower():
        return jsonify(success=False, message="Passwords do not match, please check inputs and try again."), 400
    
    exists = User.query.filter_by(email=email).first()
    if exists:
        return jsonify(success=False, message="User with this email already exists."), 400
    
    new_user = User(first_name=first_name.capitalize(), last_name=last_name.capitalize(), email=email, password_hash=bcrypt.generate_password_hash(pw1).decode("utf-8"))
    
    db.session.add(new_user)
    db.session.flush()
    
    team_name = team_name.lower()
    existing_team = Team.query.filter_by(name=team_name).first()
    if existing_team:
        if existing_team.team_lead:
            db.session.rollback()
            return jsonify(success=False, message=f"{team_name} already has a team lead."), 400
        existing_team.team_lead = new_user.id
    else:
        new_team = Team(name=team_name, team_lead=new_user.id)
        db.session.add(new_team)
        
    
    try:
        db.session.commit()
        return jsonify(success=True, message="New user has been registered!"), 201
    except Exception as e:
        print(f"Error when registering new user: {e}")
        return jsonify(success=False, message=f"Error when registering new user: {e}"), 500
    
    
@auth_bp.route("/login/<int:id>", methods=["POST"])
def login(id):
    try:
        data = request.get_json()
        if not data:
            return jsonify(success=False, message="No data in payload"), 400
        pw = data.get("password")
        user = User.query.get(id)
        if not user:
            return jsonify(success=False, message="User not found."), 400
        if not bcrypt.check_password_hash(user.password_hash, pw):
            return jsonify(success=False, message="Invalid credential, please check inputs and try again."), 401
        login_user(user)
        return jsonify(success=True, message=f"Logged in as {user.first_name}", user=user.serialize()), 200
    except Exception as e:
        print(f"Error when loggin in: {e}")
        return jsonify(success=False, message=f"Error when loggin in: {e}"), 500
    
@auth_bp.route("/logout", methods=["GET"])  
@login_required
def logout():
    try:
        logout_user()
        return jsonify(success=True, message="User logged out."), 200
    except Exception as e:
        print(f"Error when logging out: {e}")
        return jsonify(success=False, message=f"Error when logging out: {e}"), 500
    

@auth_bp.route("/hydrate_user", methods=["GET"])
@login_required
def hydrate_user():
    return jsonify(success=True, user=current_user.serialize())

