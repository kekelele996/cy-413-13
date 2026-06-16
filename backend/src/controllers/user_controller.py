from sqlalchemy.orm import Session

from src.models.user import User
from src.schemas.user import ProfileReport, UserUpdate
from src.services.user_service import profile_report, update_user
from src.utils.logger import app_logger


def me(current_user: User) -> User:
    app_logger.info("User[id=%s] controller me", current_user.id)
    return current_user


def update_me(db: Session, current_user: User, payload: UserUpdate) -> User:
    try:
        return update_user(db, current_user, payload)
    except Exception as exc:
        app_logger.error("User[id=%s] controller update failed: %s", current_user.id, exc)
        raise


def report(db: Session, current_user: User) -> ProfileReport:
    try:
        return profile_report(db, current_user)
    except Exception as exc:
        app_logger.error("User[id=%s] controller report failed: %s", current_user.id, exc)
        raise

