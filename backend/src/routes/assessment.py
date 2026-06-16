from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.config.database import get_db
from src.controllers import assessment_controller
from src.middlewares.auth import get_current_user, require_admin
from src.models.assessment import Assessment, UserAssessment
from src.models.user import User
from src.schemas.assessment import AssessmentCreate, AssessmentRead, AssessmentSubmit, UserAssessmentRead

router = APIRouter()


@router.get("", response_model=list[AssessmentRead])
def list_assessments(category: str | None = None, db: Session = Depends(get_db)) -> list[Assessment]:
    return assessment_controller.list_assessments(db, category)


@router.post("", response_model=AssessmentRead)
def create_assessment(
    payload: AssessmentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
) -> Assessment:
    return assessment_controller.create_assessment(db, payload)


@router.get("/{assessment_id}", response_model=AssessmentRead)
def detail(assessment_id: int, db: Session = Depends(get_db)) -> Assessment:
    return assessment_controller.detail(db, assessment_id)


@router.post("/{assessment_id}/submit", response_model=UserAssessmentRead)
def submit(
    assessment_id: int,
    payload: AssessmentSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> UserAssessment:
    return assessment_controller.submit(db, current_user, assessment_id, payload)

