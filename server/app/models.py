from app.extensions import db
from datetime import datetime
from flask_login import UserMixin
from sqlalchemy import String, Integer, DateTime, Boolean, Column, ForeignKey, Enum, Table

serve_teams_enum = Enum("first_impressions", "baptism_team", "cafe_team", "gift_shop", "info_center","host_and_hospitality", name="serve_teams_enum")

volunteer_team = Table(
    "volunteer_team",
    db.Model.metadata,
    Column("volunteer_id", Integer, ForeignKey("volunteer.id"), primary_key=True),
    Column("team_id", Integer, ForeignKey("team.id"), primary_key=True)
)

class User(db.Model, UserMixin):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)
    team = db.relationship("Team", backref="lead", uselist=False)

    def __repr__(self):
        return f'<User {self.first_name}>'
    
    def get_volunteers(self):
        return self.team.volunteers if self.team else []
    
    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email, 
            'team': self.team.name if self.team else None,
            'volunteers': [v.serialize() for v in self.get_volunteers()]
        }
        

class Team(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(serve_teams_enum, nullable=False, unique=True)
    team_lead = Column(Integer, ForeignKey('user.id'), nullable=False, unique=True)
    
    volunteers = db.relationship(
        "Volunteer",
        secondary=volunteer_team,
        back_populates="teams",
    )
    
    def __repr__(self):
        return f"<Team {self.name}>"
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "team_lead": self.team_lead,
            "volunteers": [v.serialize() for v in self.volunteers],
        }
    


class Volunteer(db.Model):
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    
    teams = db.relationship(
        "Team",
        secondary=volunteer_team,
        back_populates="volunteers",
    )
    
    def __repr__(self):
        return f"<Volunteer {self.first_name} {self.last_name}>"
    
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "teams": [team.name for team in self.teams],
        }
    
    

class Schedule(db.Model):
    id = Column(Integer, primary_key=True)
    volunteer_id = Column(Integer, ForeignKey("volunteer.id"), nullable=False)
    team_id = Column(Integer, ForeignKey("team.id"), nullable=False)
    date = Column(DateTime, nullable=False)
    notes = Column(String(255))
    
    volunteer = db.relationship("Volunteer", backref="schedules")
    team = db.relationship("Team", backref="schedules")
    
    def __repr__(self):
        return f"<Schedule {self.date.date()} - {self.volunteer.first_name}>"
    
    def serialize(self):
        return {
            "id": self.id,
            "date": self.date,
            "volunteer": self.volunteer.serialize(),
            "team": self.team.name,
            "notes": self.notes,
        }