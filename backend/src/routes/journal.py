from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.controllers import journal_controller
from src.middlewares.auth import get_current_user
from src.models.journal import Journal
from src.models.user import User
from src.schemas.journal import JournalCreate, JournalRead, JournalUpdate

router = APIRouter()


@router.get("", response_model=list[JournalRead])
def list_journals(
    mood_level: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[Journal]:
    return journal_controller.list_journals(db, current_user, mood_level)


@router.post("", response_model=JournalRead)
def create_journal(
    payload: JournalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Journal:
    return journal_controller.create_journal(db, current_user, payload)


@router.put("/{journal_id}", response_model=JournalRead)
def update_journal(
    journal_id: int,
    payload: JournalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Journal:
    return journal_controller.update_journal(db, current_user, journal_id, payload)


@router.delete("/{journal_id}")
def delete_journal(
    journal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, str]:
    return journal_controller.delete_journal(db, current_user, journal_id)

