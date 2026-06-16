from sqlalchemy.orm import Session

from src.schemas.user import AuthToken, UserCreate, UserLogin
from src.services.user_service import authenticate_user, create_user
from src.utils.jwt import create_access_token
from src.utils.logger import app_logger


def register(db: Session, payload: UserCreate) -> AuthToken:
    try:
        user = create_user(db, payload)
        token = create_access_token(str(user.id), user.role)
        return AuthToken(access_token=token, user=user)
    except Exception as exc:
        app_logger.error("User[email=%s] controller register failed: %s", payload.email, exc)
        raise


def login(db: Session, payload: UserLogin) -> AuthToken:
    try:
        user = authenticate_user(db, str(payload.email), payload.password)
        token = create_access_token(str(user.id), user.role)
        return AuthToken(access_token=token, user=user)
    except Exception as exc:
        app_logger.error("User[email=%s] controller login failed: %s", payload.email, exc)
        raise

