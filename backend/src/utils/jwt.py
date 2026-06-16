from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from src.config.app import settings
from src.constants.error_codes import ERROR_CODES
from src.utils.logger import app_logger


def create_access_token(subject: str, role: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(UTC) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    payload: dict[str, Any] = {"sub": subject, "role": role, "exp": expire}
    app_logger.info("User[id=%s] token create role=%s", subject, role)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        app_logger.warning(ERROR_CODES["AUTH_TOKEN_INVALID"])
        raise ValueError(ERROR_CODES["AUTH_TOKEN_INVALID"]) from exc

