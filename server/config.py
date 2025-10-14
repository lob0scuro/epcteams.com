from os import environ
from dotenv import load_dotenv
import redis
from datetime import timedelta

load_dotenv()

class Config:
    SECRET_KEY = environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_ENV = "development"
    
    SESSION_TYPE = "redis"
    SESSION_REDIS = redis.from_url(environ.get("REDIS_URL", "redis://localhost:6379"))
    SESSION_COOKIE_SAMESITE = "Lax"
    SESSION_PERMANENT = True
    SESSION_COOKIE_SECURE = FLASK_ENV == "production"   # only secure cookies in prod
    SESSION_COOKIE_HTTPONLY = True
    SESSION_USE_SIGNER = True
    SESSION_KEY_PREFIX = "blu:"
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    
    if FLASK_ENV == "production":
        CORS_ORIGINS = ["https://blutape.net"]
    else:
        CORS_ORIGINS = ["http://localhost:5173"]  # vite dev server
    CORS_SUPPORTS_CREDENTIALS = True
