import bcrypt

from src.utils.logger import app_logger


def hash_password(password: str) -> str:
    app_logger.info("User[password_hash] generated")
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    app_logger.info("User[password_hash] verify requested")
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
