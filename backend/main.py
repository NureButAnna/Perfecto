import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.services import router as service_router
from app.api.v1.endpoints.users import router as user_router
from app.api.v1.endpoints.chats import router as chat_router
from app.api.v1.endpoints.orders import router as order_router
from app.api.v1.endpoints.deliveries import router as delivery_router
from app.api.v1.endpoints.dry_cleaners import router as dry_cleaner_router
from app.api.v1.endpoints.categories import router as category_router
from app.api.v1.endpoints.items import router as item_router

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

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(dry_cleaner_router)
app.include_router(service_router)
app.include_router(order_router)
app.include_router(item_router)
app.include_router(delivery_router)
app.include_router(category_router)
app.include_router(chat_router)


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