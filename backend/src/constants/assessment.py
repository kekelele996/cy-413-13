from enum import StrEnum


class AssessmentCategory(StrEnum):
    ANXIETY = "anxiety"
    DEPRESSION = "depression"
    STRESS = "stress"
    SLEEP = "sleep"


ASSESSMENT_CATEGORY_LABELS = {
    AssessmentCategory.ANXIETY: "焦虑",
    AssessmentCategory.DEPRESSION: "抑郁",
    AssessmentCategory.STRESS: "压力",
    AssessmentCategory.SLEEP: "睡眠",
}

