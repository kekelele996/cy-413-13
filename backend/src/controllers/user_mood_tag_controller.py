from sqlalchemy.orm import Session

from src.models.user import User
from src.models.user_mood_tag import UserMoodTag
from src.schemas.user_mood_tag import (
    AllMoodTagsResponse,
    UserMoodTagCreate,
    UserMoodTagUpdate,
    UserMoodTagWithStats,
)
from src.services import user_mood_tag_service
from src.utils.logger import app_logger


def list_user_tags(db: Session, current_user: User) -> list[UserMoodTagWithStats]:
    try:
        return user_mood_tag_service.list_user_tags(db, current_user)
    except Exception as exc:
        app_logger.error("UserMoodTag[user_id=%s] controller list failed: %s", current_user.id, exc)
        raise


def list_all_tags(db: Session, current_user: User) -> AllMoodTagsResponse:
    try:
        return user_mood_tag_service.list_all_tags(db, current_user)
    except Exception as exc:
        app_logger.error("UserMoodTag[user_id=%s] controller list_all failed: %s", current_user.id, exc)
        raise


def create_user_tag(db: Session, current_user: User, payload: UserMoodTagCreate) -> UserMoodTag:
    try:
        return user_mood_tag_service.create_user_tag(db, current_user, payload)
    except Exception as exc:
        app_logger.error("UserMoodTag[user_id=%s] controller create failed: %s", current_user.id, exc)
        raise


def update_user_tag(
    db: Session, current_user: User, tag_id: int, payload: UserMoodTagUpdate
) -> UserMoodTag:
    try:
        return user_mood_tag_service.update_user_tag(db, current_user, tag_id, payload)
    except Exception as exc:
        app_logger.error("UserMoodTag[id=%s] controller update failed: %s", tag_id, exc)
        raise


def delete_user_tag(db: Session, current_user: User, tag_id: int) -> dict[str, str]:
    try:
        user_mood_tag_service.delete_user_tag(db, current_user, tag_id)
        return {"message": f"UserMoodTag[id={tag_id}] delete success"}
    except Exception as exc:
        app_logger.error("UserMoodTag[id=%s] controller delete failed: %s", tag_id, exc)
        raise
