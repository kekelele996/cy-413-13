from enum import StrEnum


class MoodTag(StrEnum):
    HAPPY = "happy"
    ANXIOUS = "anxious"
    TIRED = "tired"
    ANGRY = "angry"
    CALM = "calm"


MOOD_TAG_LABELS = {
    MoodTag.HAPPY: "开心",
    MoodTag.ANXIOUS: "焦虑",
    MoodTag.TIRED: "疲惫",
    MoodTag.ANGRY: "愤怒",
    MoodTag.CALM: "平静",
}

MOOD_LEVEL_LABELS = {
    1: "低落",
    2: "沉重",
    3: "紧张",
    4: "波动",
    5: "普通",
    6: "稳定",
    7: "舒展",
    8: "轻盈",
    9: "明亮",
    10: "丰盛",
}

