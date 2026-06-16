from sqlalchemy.orm import Session

from src.models.assessment import Assessment, UserAssessment
from src.models.user import User
from src.schemas.assessment import AssessmentCreate, AssessmentSubmit
from src.services import assessment_service
from src.utils.logger import app_logger


def list_assessments(db: Session, category: str | None) -> list[Assessment]:
    try:
        return assessment_service.list_assessments(db, category)
    except Exception as exc:
        app_logger.error("Assessment[category=%s] controller list failed: %s", category, exc)
        raise


def create_assessment(db: Session, payload: AssessmentCreate) -> Assessment:
    try:
        return assessment_service.create_assessment(db, payload)
    except Exception as exc:
        app_logger.error("Assessment[title=%s] controller create failed: %s", payload.title, exc)
        raise


def detail(db: Session, assessment_id: int) -> Assessment:
    try:
        return assessment_service.get_assessment(db, assessment_id)
    except Exception as exc:
        app_logger.error("Assessment[id=%s] controller detail failed: %s", assessment_id, exc)
        raise


def submit(db: Session, current_user: User, assessment_id: int, payload: AssessmentSubmit) -> UserAssessment:
    try:
        return assessment_service.submit_assessment(db, current_user, assessment_id, payload)
    except Exception as exc:
        app_logger.error("Assessment[id=%s] controller submit failed: %s", assessment_id, exc)
        raise

