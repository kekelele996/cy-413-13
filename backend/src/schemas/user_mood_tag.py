from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from src.constants.error_codes import ERROR_CODES


class UserMoodTagBase(BaseModel):
    tag_key: str = Field(max_length=64)
    label: str = Field(max_length=64)
    color: str | None = Field(default=None, max_length=16)

    @field_validator("tag_key")
    @classmethod
    def validate_tag_key(cls, value: str) -> str:
        value = value.strip().lower().replace(" ", "_")
        if not value:
            raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: tag_key cannot be empty")
        if len(value) > 64:
            raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: tag_key too long")
        return value

    @field_validator("label")
    @classmethod
    def validate_label(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: label cannot be empty")
        if len(value) > 64:
            raise ValueError(f"{ERROR_CODES['MOOD_TAG_INVALID']}: label too long")
        return value


class UserMoodTagCreate(UserMoodTagBase):
    pass


class UserMoodTagUpdate(BaseModel):
    label: str | None = Field(default=None, max_length=64)
    color: str | None = Field(default=None, max_length=16)


class UserMoodTagRead(UserMoodTagBase):
    id: int
    user_id: int
    created_at: datetime
    color: str

    model_config = {"from_attributes": True}


class UserMoodTagWithStats(UserMoodTagRead):
    usage_count: int = 0


class AllMoodTagsResponse(BaseModel):
    system_tags: list[dict]
    custom_tags: list[UserMoodTagWithStats]
