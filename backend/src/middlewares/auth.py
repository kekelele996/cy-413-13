from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.roles import ROLE_ADMIN
from src.models.user import User
from src.utils.jwt import decode_access_token
from src.utils.logger import app_logger


def get_current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        message = ERROR_CODES["AUTH_TOKEN_INVALID"]
        app_logger.warning(LOG_TEMPLATES["AUTH_REQUIRED"].format(path="unknown"))
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=message)
    token = authorization.replace("Bearer ", "", 1)
    try:
        payload = decode_access_token(token)
        user_id = int(payload["sub"])
    except Exception as exc:
        message = ERROR_CODES["AUTH_TOKEN_INVALID"]
        app_logger.warning(message)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=message) from exc
    user = db.get(User, user_id)
    if not user:
        message = ERROR_CODES["USER_NOT_FOUND"]
        app_logger.warning(message)
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=message)
    return user


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != ROLE_ADMIN:
        message = ERROR_CODES["AUTH_ROLE_FORBIDDEN"]
        app_logger.warning(LOG_TEMPLATES["AUTH_ADMIN_REQUIRED"].format(user_id=current_user.id))
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=message)
    return current_user

