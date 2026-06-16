from sqlalchemy import select
from sqlalchemy.orm import Session

from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.middlewares.error_handler import AppError
from src.models.assessment import Assessment, UserAssessment
from src.models.user import User
from src.schemas.assessment import AssessmentCreate, AssessmentSubmit
from src.utils.logger import app_logger


def list_assessments(db: Session, category: str | None = None) -> list[Assessment]:
    app_logger.info(LOG_TEMPLATES["ASSESSMENT_LIST"].format(category=category or "all"))
    query = select(Assessment).order_by(Assessment.id.asc())
    if category:
        query = query.where(Assessment.category == category)
    return list(db.scalars(query).all())


def create_assessment(db: Session, payload: AssessmentCreate) -> Assessment:
    app_logger.info(LOG_TEMPLATES["ASSESSMENT_CREATE"].format(title=payload.title, category=payload.category))
    assessment = Assessment(**payload.model_dump())
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


def get_assessment(db: Session, assessment_id: int) -> Assessment:
    assessment = db.get(Assessment, assessment_id)
    if not assessment:
        raise AppError(
            "ASSESSMENT_NOT_FOUND",
            f"Assessment[id={assessment_id}] detail failed: {ERROR_CODES['ASSESSMENT_NOT_FOUND']}",
            404,
        )
    app_logger.info(LOG_TEMPLATES["ASSESSMENT_DETAIL"].format(assessment_id=assessment_id))
    return assessment


def submit_assessment(db: Session, user: User, assessment_id: int, payload: AssessmentSubmit) -> UserAssessment:
    assessment = get_assessment(db, assessment_id)
    score = sum(int(value) for value in payload.answers.values())
    result_level, suggestion = _score_result(assessment.scoring_rule, score)
    app_logger.info(
        LOG_TEMPLATES["ASSESSMENT_SUBMIT"].format(assessment_id=assessment_id, user_id=user.id, score=score)
    )
    app_logger.info(
        LOG_TEMPLATES["ASSESSMENT_RESULT"].format(
            assessment_id=assessment_id, result_level=result_level, suggestion=suggestion
        )
    )
    result = UserAssessment(
        user_id=user.id,
        assessment_id=assessment_id,
        answers=payload.answers,
        score=score,
        result_level=result_level,
        suggestion=suggestion,
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def _score_result(scoring_rule: dict, score: int) -> tuple[str, str]:
    low = scoring_rule.get("low", {})
    medium = scoring_rule.get("medium", {})
    high = scoring_rule.get("high", {})
    if score <= int(low.get("max", 8)):
        return "low", str(low.get("text", "当前风险较低，继续观察。"))
    if score <= int(medium.get("max", 15)):
        return "medium", str(medium.get("text", "当前风险中等，建议放松训练。"))
    return "high", str(high.get("text", "当前风险较高，建议寻求专业支持。"))

