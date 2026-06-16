from datetime import date, datetime

from pydantic import BaseModel, Field, field_validator

from src.constants.error_codes import ERROR_CODES
from src.constants.mood import MoodTag


class MoodBase(BaseModel):
    mood_level: int = Field(ge=1, le=10)
    mood_tags: list[str]
    note: str | None = None
    record_date: date

    @field_validator("mood_tags")
    @classmethod
    def validate_mood_tags(cls, value: list[str]) -> list[str]:
        allowed = {tag.value for tag in MoodTag}
        invalid = [item for item in value if item not in allowed]
        if invalid:
            raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: {invalid}")
        return value


class MoodCreate(MoodBase):
    pass


class MoodUpdate(BaseModel):
    mood_level: int | None = Field(default=None, ge=1, le=10)
    mood_tags: list[str] | None = None
    note: str | None = None
    record_date: date | None = None


class MoodRead(MoodBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MoodTrendPoint(BaseModel):
    date: str
    mood_level: float
    dominant_tag: str

