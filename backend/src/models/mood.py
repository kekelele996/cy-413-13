from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.config.database import Base
from src.constants.mood import MoodTag


class Mood(Base):
    __tablename__ = "moods"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    mood_level: Mapped[int] = mapped_column(Integer, nullable=False)
    mood_tags: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False, default=list)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    record_date: Mapped[date] = mapped_column(Date, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("User", back_populates="moods")

    def validate_tags_for_log_coupling(self) -> list[str]:
        allowed = {item.value for item in MoodTag}
        return [tag for tag in self.mood_tags if tag in allowed]

