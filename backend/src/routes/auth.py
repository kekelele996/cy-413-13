from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.controllers import auth_controller
from src.schemas.user import AuthToken, UserCreate, UserLogin

router = APIRouter()


@router.post("/register", response_model=AuthToken)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> AuthToken:
    return auth_controller.register(db, payload)


@router.post("/login", response_model=AuthToken)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> AuthToken:
    return auth_controller.login(db, payload)

