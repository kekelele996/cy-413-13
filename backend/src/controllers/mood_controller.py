from datetime import date

from sqlalchemy.orm import Session

from src.models.mood import Mood
from src.models.user import User
from src.schemas.mood import MoodCreate, MoodTrendPoint, MoodUpdate
from src.services import mood_service
from src.utils.logger import app_logger


def list_moods(db: Session, current_user: User, start_date: date | None, end_date: date | None) -> list[Mood]:
    try:
        return mood_service.list_moods(db, current_user, start_date, end_date)
    except Exception as exc:
        app_logger.error("Mood[user_id=%s] controller list failed: %s", current_user.id, exc)
        raise


def create_mood(db: Session, current_user: User, payload: MoodCreate) -> Mood:
    try:
        return mood_service.create_mood(db, current_user, payload)
    except Exception as exc:
        app_logger.error("Mood[user_id=%s] controller create failed: %s", current_user.id, exc)
        raise


def update_mood(db: Session, current_user: User, mood_id: int, payload: MoodUpdate) -> Mood:
    try:
        return mood_service.update_mood(db, current_user, mood_id, payload)
    except Exception as exc:
        app_logger.error("Mood[id=%s] controller update failed: %s", mood_id, exc)
        raise


def delete_mood(db: Session, current_user: User, mood_id: int) -> dict[str, str]:
    try:
        mood_service.delete_mood(db, current_user, mood_id)
        return {"message": f"Mood[id={mood_id}] delete success"}
    except Exception as exc:
        app_logger.error("Mood[id=%s] controller delete failed: %s", mood_id, exc)
        raise


def trend(db: Session, current_user: User) -> list[MoodTrendPoint]:
    try:
        return mood_service.mood_trend(db, current_user)
    except Exception as exc:
        app_logger.error("Mood[user_id=%s] controller trend failed: %s", current_user.id, exc)
        raise

