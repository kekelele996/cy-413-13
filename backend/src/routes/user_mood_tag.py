from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.controllers import user_mood_tag_controller
from src.middlewares.auth import get_current_user
from src.models.user import User
from src.models.user_mood_tag import UserMoodTag
from src.schemas.user_mood_tag import (
    AllMoodTagsResponse,
    UserMoodTagCreate,
    UserMoodTagRead,
    UserMoodTagUpdate,
    UserMoodTagWithStats,
)

router = APIRouter()


@router.get("", response_model=list[UserMoodTagWithStats])
def list_user_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[UserMoodTagWithStats]:
    return user_mood_tag_controller.list_user_tags(db, current_user)


@router.get("/all", response_model=AllMoodTagsResponse)
def list_all_tags(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AllMoodTagsResponse:
    return user_mood_tag_controller.list_all_tags(db, current_user)


@router.post("", response_model=UserMoodTagRead)
def create_user_tag(
    payload: UserMoodTagCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserMoodTag:
    return user_mood_tag_controller.create_user_tag(db, current_user, payload)


@router.put("/{tag_id}", response_model=UserMoodTagRead)
def update_user_tag(
    tag_id: int,
    payload: UserMoodTagUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserMoodTag:
    return user_mood_tag_controller.update_user_tag(db, current_user, tag_id, payload)


@router.delete("/{tag_id}")
def delete_user_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    return user_mood_tag_controller.delete_user_tag(db, current_user, tag_id)
