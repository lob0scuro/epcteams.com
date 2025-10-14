from flask import Flask
from app.extensions import db, migrate, bcrypt, cors, login_manager
from config import Config
from app.models import User

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    cors.init_app(app)
    login_manager.init_app(app)
    
    from .api import api_bp
    app.register_blueprint(api_bp)
    
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(id)
    
    return app