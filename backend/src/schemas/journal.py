from datetime import datetime

from pydantic import BaseModel, Field


class JournalBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    mood_level: int = Field(ge=1, le=10)
    weather: str | None = None
    is_private: bool = True


class JournalCreate(JournalBase):
    pass


class JournalUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, min_length=1)
    mood_level: int | None = Field(default=None, ge=1, le=10)
    weather: str | None = None
    is_private: bool | None = None


class JournalRead(JournalBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = {"from_attributes": True}

