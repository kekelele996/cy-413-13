import re
from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator

from src.constants.error_codes import ERROR_CODES


TAG_KEY_PATTERN = re.compile(r"^[\u4e00-\u9fff\u3400-\u4dbfa-z0-9_]{1,64}$")


def _sanitize_tag(tag: str) -> str:
    return re.sub(r"[^\u4e00-\u9fff\u3400-\u4dbfa-z0-9_]", "", tag.strip().lower().replace(" ", "_"))


class MoodBase(BaseModel):
    mood_level: int = Field(ge=1, le=10)
    mood_tags: list[str]
    note: str | None = None
    record_date: date

    @field_validator("mood_tags")
    @classmethod
    def validate_mood_tags(cls, value: list[str]) -> list[str]:
        sanitized: list[str] = []
        for tag in value:
            cleaned = _sanitize_tag(tag)
            if not cleaned:
                raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: empty tag found in '{tag}'")
            if len(cleaned) > 64:
                raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: tag too long '{tag}'")
            if cleaned not in sanitized:
                sanitized.append(cleaned)
        return sanitized


class MoodCreate(MoodBase):
    pass


class MoodUpdate(BaseModel):
    mood_level: int | None = Field(default=None, ge=1, le=10)
    mood_tags: list[str] | None = None
    note: str | None = None
    record_date: date | None = None

    @field_validator("mood_tags")
    @classmethod
    def validate_mood_tags_update(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        sanitized: list[str] = []
        for tag in value:
            cleaned = _sanitize_tag(tag)
            if not cleaned:
                raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: empty tag found in '{tag}'")
            if len(cleaned) > 64:
                raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: tag too long '{tag}'")
            if cleaned not in sanitized:
                sanitized.append(cleaned)
        return sanitized


class MoodRead(MoodBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MoodTrendPoint(BaseModel):
    date: str
    mood_level: float
    dominant_tag: str
