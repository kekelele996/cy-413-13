from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.utils.logger import app_logger


class AppError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400) -> None:
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppError)
    async def app_error_handler(_: Request, exc: AppError) -> JSONResponse:
        app_logger.error(
            LOG_TEMPLATES["ERROR_WRAPPED"].format(code=exc.code, entity="AppError", message=exc.message)
        )
        return JSONResponse(status_code=exc.status_code, content={"code": exc.code, "message": exc.message})

    @app.exception_handler(Exception)
    async def unexpected_error_handler(_: Request, exc: Exception) -> JSONResponse:
        message = f"{ERROR_CODES['GLOBAL_UNEXPECTED']}: {exc}"
        app_logger.exception(LOG_TEMPLATES["ERROR_WRAPPED"].format(code="GLOBAL_UNEXPECTED", entity="Global", message=message))
        return JSONResponse(status_code=500, content={"code": "GLOBAL_UNEXPECTED", "message": message})

