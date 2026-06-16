from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config.app import settings
from src.config.database import Base, engine
from src.middlewares.audit_logger import AuditLoggerMiddleware
from src.middlewares.error_handler import register_error_handlers
from src.routes import assessment, auth, journal, mood, user
from src.utils.logger import app_logger


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    app_logger.info("DATABASE_SCHEMA_SYNCED")
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(AuditLoggerMiddleware)
register_error_handlers(app)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(user.router, prefix="/users", tags=["users"])
app.include_router(mood.router, prefix="/moods", tags=["moods"])
app.include_router(assessment.router, prefix="/assessments", tags=["assessments"])
app.include_router(journal.router, prefix="/journals", tags=["journals"])


@app.get("/health")
def health() -> dict[str, str]:
    app_logger.info("HEALTH_CHECK_OK")
    return {"status": "healthy", "service": settings.app_name}


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "MindGarden API", "docs": "/docs"}
