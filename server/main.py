
from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.ocr import router as ocr_router
from app.api.animal import router as animal_router
from app.api.chat import router as chat_router
from app.database import engine, Base

import app.models

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [settings.frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.auth import router as auth_router

for router in [ocr_router, animal_router, chat_router, auth_router]:
    app.include_router(router)
