from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.config.database import Base
from src.constants.assessment import AssessmentCategory


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    questions: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, nullable=False)
    scoring_rule: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user_results = relationship("UserAssessment", back_populates="assessment", cascade="all, delete-orphan")

    def category_for_report(self) -> AssessmentCategory | None:
        try:
            return AssessmentCategory(self.category)
        except ValueError:
            return None


class UserAssessment(Base):
    __tablename__ = "user_assessments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id", ondelete="CASCADE"), nullable=False, index=True)
    answers: Mapped[dict[str, int]] = mapped_column(JSONB, nullable=False)
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    result_level: Mapped[str] = mapped_column(String(64), nullable=False)
    suggestion: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="assessment_results")
    assessment = relationship("Assessment", back_populates="user_results")

