from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.controllers import user_controller
from src.middlewares.auth import get_current_user
from src.models.user import User
from src.schemas.user import ProfileReport, UserRead, UserUpdate

router = APIRouter()


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)) -> User:
    return user_controller.me(current_user)


@router.put("/me", response_model=UserRead)
def update_me(
    payload: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> User:
    return user_controller.update_me(db, current_user, payload)


@router.get("/report", response_model=ProfileReport)
def report(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> ProfileReport:
    return user_controller.report(db, current_user)

