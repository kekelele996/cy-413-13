from src.constants.mood import MoodTag


MOOD_TAG_COLORS = {
    MoodTag.HAPPY.value: "#f2a541",
    MoodTag.ANXIOUS.value: "#d96c75",
    MoodTag.TIRED.value: "#7e8aa2",
    MoodTag.ANGRY.value: "#bf4a3c",
    MoodTag.CALM.value: "#4b9b8f",
}


def mood_level_color(level: int) -> str:
    if level <= 3:
        return "#bf4a3c"
    if level <= 6:
        return "#d69c41"
    return "#4b9b8f"

