from datetime import date, datetime

from src.constants.assessment import ASSESSMENT_CATEGORY_LABELS, AssessmentCategory
from src.constants.mood import MOOD_LEVEL_LABELS, MOOD_TAG_LABELS, MoodTag

THEME_HEX_TO_NAME = {
    "#4b9b8f": "sage",
    "#323b2f": "forest",
    "#f2a541": "sunrise",
}


def format_date(value: date | datetime) -> str:
    return value.strftime("%Y-%m-%d")


def mood_tag_text(tag: str) -> str:
    return MOOD_TAG_LABELS.get(MoodTag(tag), tag) if tag in [item.value for item in MoodTag] else tag


def mood_level_text(level: int) -> str:
    return MOOD_LEVEL_LABELS.get(level, "未知")


def assessment_category_text(category: str) -> str:
    if category in [item.value for item in AssessmentCategory]:
        return ASSESSMENT_CATEGORY_LABELS.get(AssessmentCategory(category), category)
    return category


def theme_color_to_name(color: str) -> str:
    return THEME_HEX_TO_NAME.get(color, "custom")

