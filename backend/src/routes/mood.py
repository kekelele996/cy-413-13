from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.controllers import mood_controller
from src.middlewares.auth import get_current_user
from src.models.mood import Mood
from src.models.user import User
from src.schemas.mood import MoodCreate, MoodRead, MoodTrendPoint, MoodUpdate

router = APIRouter()


@router.get("", response_model=list[MoodRead])
def list_moods(
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Mood]:
    return mood_controller.list_moods(db, current_user, start_date, end_date)


@router.post("", response_model=MoodRead)
def create_mood(
    payload: MoodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Mood:
    return mood_controller.create_mood(db, current_user, payload)


@router.put("/{mood_id}", response_model=MoodRead)
def update_mood(
    mood_id: int,
    payload: MoodUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Mood:
    return mood_controller.update_mood(db, current_user, mood_id, payload)


@router.delete("/{mood_id}")
def delete_mood(
    mood_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    return mood_controller.delete_mood(db, current_user, mood_id)


@router.get("/stats/trend", response_model=list[MoodTrendPoint])
def trend(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[MoodTrendPoint]:
    return mood_controller.trend(db, current_user)

