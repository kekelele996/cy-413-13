from typing import Literal, TypedDict

MoodTagValue = Literal["happy", "anxious", "tired", "angry", "calm"]
AssessmentCategoryValue = Literal["anxiety", "depression", "stress", "sleep"]


class MoodTrendPoint(TypedDict):
    date: str
    mood_level: float
    dominant_tag: MoodTagValue | str


class ReportSummary(TypedDict):
    avg_mood: float
    assessment_count: int
    journal_count: int

