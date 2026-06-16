from sqlalchemy import select
from sqlalchemy.orm import Session

from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.middlewares.error_handler import AppError
from src.models.journal import Journal
from src.models.user import User
from src.schemas.journal import JournalCreate, JournalUpdate
from src.utils.logger import app_logger


def list_journals(db: Session, user: User, mood_level: int | None = None) -> list[Journal]:
    app_logger.info(LOG_TEMPLATES["JOURNAL_LIST"].format(user_id=user.id, mood_level=mood_level or "all"))
    query = select(Journal).where(Journal.user_id == user.id).order_by(Journal.created_at.desc())
    if mood_level:
        query = query.where(Journal.mood_level == mood_level)
    return list(db.scalars(query).all())


def create_journal(db: Session, user: User, payload: JournalCreate) -> Journal:
    app_logger.info(
        LOG_TEMPLATES["JOURNAL_CREATE"].format(
            user_id=user.id, title=payload.title, mood_level=payload.mood_level
        )
    )
    journal = Journal(user_id=user.id, **payload.model_dump())
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return journal


def update_journal(db: Session, user: User, journal_id: int, payload: JournalUpdate) -> Journal:
    journal = db.get(Journal, journal_id)
    if not journal or journal.user_id != user.id:
        raise AppError("JOURNAL_NOT_FOUND", f"Journal[id={journal_id}] update failed: {ERROR_CODES['JOURNAL_NOT_FOUND']}", 404)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(journal, field, value)
    app_logger.info(
        LOG_TEMPLATES["JOURNAL_UPDATE"].format(
            journal_id=journal_id, title=journal.title, is_private=journal.is_private
        )
    )
    db.commit()
    db.refresh(journal)
    return journal


def delete_journal(db: Session, user: User, journal_id: int) -> None:
    journal = db.get(Journal, journal_id)
    if not journal or journal.user_id != user.id:
        raise AppError("JOURNAL_NOT_FOUND", f"Journal[id={journal_id}] delete failed: {ERROR_CODES['JOURNAL_NOT_FOUND']}", 404)
    app_logger.info(LOG_TEMPLATES["JOURNAL_DELETE"].format(journal_id=journal_id, user_id=user.id))
    db.delete(journal)
    db.commit()

