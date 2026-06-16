import re
from collections import Counter

from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.constants.mood import MOOD_TAG_LABELS, MoodTag
from src.middlewares.error_handler import AppError
from src.models.mood import Mood
from src.models.user import User
from src.models.user_mood_tag import UserMoodTag
from src.schemas.user_mood_tag import (
    AllMoodTagsResponse,
    UserMoodTagCreate,
    UserMoodTagUpdate,
    UserMoodTagWithStats,
)
from src.utils.logger import app_logger
from src.utils.mood_color import MOOD_TAG_COLORS

DEFAULT_COLOR_PALETTE = [
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899",
    "#f43f5e", "#ef4444", "#f97316", "#f59e0b", "#eab308",
    "#84cc16", "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
    "#0ea5e9", "#3b82f6", "#64748b",
]


def _get_or_create_user_tag(
    db: Session, user_id: int, tag_key: str, label: str | None = None
) -> UserMoodTag | None:
    stmt = select(UserMoodTag).where(
        UserMoodTag.user_id == user_id, UserMoodTag.tag_key == tag_key
    )
    existing = db.scalar(stmt)
    if existing:
        return existing

    existing_keys = {t.tag_key for t in db.scalars(select(UserMoodTag).where(UserMoodTag.user_id == user_id)).all()}
    color_index = len(existing_keys) % len(DEFAULT_COLOR_PALETTE)

    tag = UserMoodTag(
        user_id=user_id,
        tag_key=tag_key,
        label=label or tag_key.replace("_", " "),
        color=DEFAULT_COLOR_PALETTE[color_index],
    )
    db.add(tag)
    db.flush()
    return tag


def get_allowed_tag_keys(db: Session, user_id: int) -> set[str]:
    system_keys = {t.value for t in MoodTag}
    custom_stmt = select(UserMoodTag.tag_key).where(UserMoodTag.user_id == user_id)
    custom_keys = {row for row in db.scalars(custom_stmt).all()}
    return system_keys | custom_keys


def get_tag_labels_map(db: Session, user_id: int) -> dict[str, str]:
    labels: dict[str, str] = {t.value: MOOD_TAG_LABELS[t] for t in MoodTag}
    custom_stmt = select(UserMoodTag).where(UserMoodTag.user_id == user_id)
    for tag in db.scalars(custom_stmt).all():
        labels[tag.tag_key] = tag.label
    return labels


def get_tag_colors_map(db: Session, user_id: int) -> dict[str, str]:
    colors: dict[str, str] = dict(MOOD_TAG_COLORS)
    custom_stmt = select(UserMoodTag).where(UserMoodTag.user_id == user_id)
    for tag in db.scalars(custom_stmt).all():
        colors[tag.tag_key] = tag.color
    return colors


def _count_tag_usage(db: Session, user_id: int) -> Counter:
    stmt: Select = select(Mood).where(Mood.user_id == user_id)
    counter: Counter = Counter()
    for mood in db.scalars(stmt).all():
        counter.update(mood.mood_tags)
    return counter


def list_user_tags(db: Session, user: User) -> list[UserMoodTagWithStats]:
    app_logger.info(LOG_TEMPLATES["MOOD_TAG_LIST"].format(user_id=user.id))
    usage = _count_tag_usage(db, user.id)
    stmt = select(UserMoodTag).where(UserMoodTag.user_id == user.id).order_by(UserMoodTag.created_at.asc())
    result: list[UserMoodTagWithStats] = []
    for tag in db.scalars(stmt).all():
        data = UserMoodTagWithStats.model_validate(tag)
        data.usage_count = usage.get(tag.tag_key, 0)
        result.append(data)
    return result


def list_all_tags(db: Session, user: User) -> AllMoodTagsResponse:
    usage = _count_tag_usage(db, user.id)

    system_tags = []
    for t in MoodTag:
        system_tags.append({
            "tag_key": t.value,
            "label": MOOD_TAG_LABELS[t],
            "color": MOOD_TAG_COLORS.get(t.value, "#6b7280"),
            "usage_count": usage.get(t.value, 0),
            "is_system": True,
        })

    custom_tags: list[UserMoodTagWithStats] = []
    stmt = select(UserMoodTag).where(UserMoodTag.user_id == user.id).order_by(UserMoodTag.created_at.asc())
    for tag in db.scalars(stmt).all():
        data = UserMoodTagWithStats.model_validate(tag)
        data.usage_count = usage.get(tag.tag_key, 0)
        custom_tags.append(data)

    return AllMoodTagsResponse(system_tags=system_tags, custom_tags=custom_tags)


def create_user_tag(db: Session, user: User, payload: UserMoodTagCreate) -> UserMoodTag:
    app_logger.info(
        LOG_TEMPLATES["MOOD_TAG_CREATE"].format(
            user_id=user.id, tag_key=payload.tag_key, label=payload.label
        )
    )
    system_keys = {t.value for t in MoodTag}
    if payload.tag_key in system_keys:
        raise AppError(
            "MOOD_TAG_INVALID",
            f"MoodTag[tag_key={payload.tag_key}] create failed: tag_key conflicts with system tag",
            400,
        )

    existing = db.scalar(
        select(UserMoodTag).where(
            UserMoodTag.user_id == user.id, UserMoodTag.tag_key == payload.tag_key
        )
    )
    if existing:
        raise AppError(
            "MOOD_TAG_INVALID",
            f"MoodTag[tag_key={payload.tag_key}] create failed: tag_key already exists",
            400,
        )

    existing_count = len(
        list(db.scalars(select(UserMoodTag).where(UserMoodTag.user_id == user.id)).all())
    )
    color = payload.color or DEFAULT_COLOR_PALETTE[existing_count % len(DEFAULT_COLOR_PALETTE)]

    tag = UserMoodTag(
        user_id=user.id,
        tag_key=payload.tag_key,
        label=payload.label,
        color=color,
    )
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return tag


def ensure_user_tag(db: Session, user: User, tag_key: str, label: str | None = None) -> UserMoodTag | None:
    sanitized = re.sub(r"[^\u4e00-\u9fff\u3400-\u4dbfa-z0-9_]", "", tag_key.strip().lower().replace(" ", "_"))
    if not sanitized:
        return None
    system_keys = {t.value for t in MoodTag}
    if sanitized in system_keys:
        return None
    return _get_or_create_user_tag(db, user.id, sanitized, label or sanitized)


def update_user_tag(db: Session, user: User, tag_id: int, payload: UserMoodTagUpdate) -> UserMoodTag:
    tag = db.get(UserMoodTag, tag_id)
    if not tag or tag.user_id != user.id:
        raise AppError(
            "MOOD_TAG_INVALID",
            f"MoodTag[id={tag_id}] update failed: {ERROR_CODES['MOOD_NOT_FOUND']}",
            404,
        )
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(tag, field, value)
    app_logger.info(
        LOG_TEMPLATES["MOOD_TAG_UPDATE"].format(tag_id=tag_id, tag_key=tag.tag_key, label=tag.label)
    )
    db.commit()
    db.refresh(tag)
    return tag


def delete_user_tag(db: Session, user: User, tag_id: int) -> None:
    tag = db.get(UserMoodTag, tag_id)
    if not tag or tag.user_id != user.id:
        raise AppError(
            "MOOD_TAG_INVALID",
            f"MoodTag[id={tag_id}] delete failed: {ERROR_CODES['MOOD_NOT_FOUND']}",
            404,
        )
    app_logger.info(LOG_TEMPLATES["MOOD_TAG_DELETE"].format(tag_id=tag_id, user_id=user.id))
    db.delete(tag)
    db.commit()
