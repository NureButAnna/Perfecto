import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

from app.api.service import router as service_router
from app.api.client import router as client_router
from app.api.chat import router as chat_router

app = FastAPI(
    title="Perfecto ✨",
    description="Програмна система для управління "
                "замовленнями та обслуговування клієнтів",
    version="1.0.0",
    docs_url="/api/docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static"
)

app.include_router(service_router)
app.include_router(chat_router)
app.include_router(client_router)


@app.get("/")
def root():
    return {
        "service": "Perfecto API",
        "status": "running",
        "docs": "/api/docs"
    }


@app.get("/health")
def health_check():
    return {
        "service": "healthy"
    }

logger = logging.getLogger(__name__)

logger.warning("Service endpoint slow response")
logger.error("Database connection failed")