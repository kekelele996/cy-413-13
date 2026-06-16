from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, field_validator

from src.constants.assessment import AssessmentCategory
from src.constants.error_codes import ERROR_CODES


class AssessmentBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str
    category: str
    questions: list[dict[str, Any]]
    scoring_rule: dict[str, Any]

    @field_validator("category")
    @classmethod
    def validate_category(cls, value: str) -> str:
        if value not in {item.value for item in AssessmentCategory}:
            raise ValueError(f"{ERROR_CODES['ASSESSMENT_CATEGORY_INVALID']}: {value}")
        return value


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentRead(AssessmentBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class AssessmentSubmit(BaseModel):
    answers: dict[str, int]


class UserAssessmentRead(BaseModel):
    id: int
    user_id: int
    assessment_id: int
    answers: dict[str, int]
    score: int
    result_level: str
    suggestion: str
    created_at: datetime

    model_config = {"from_attributes": True}

