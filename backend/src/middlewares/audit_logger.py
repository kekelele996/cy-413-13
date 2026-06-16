from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

from src.constants.log_templates import LOG_TEMPLATES
from src.utils.logger import app_logger


class AuditLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        actor = request.headers.get("x-user-id", "anonymous")
        if request.method in {"POST", "PUT", "PATCH", "DELETE"}:
            app_logger.info(LOG_TEMPLATES["AUDIT_WRITE"].format(method=request.method, path=request.url.path, actor=actor))
        return await call_next(request)

