from fastapi import FastAPI, UploadFile, File
from app.services.ocr_service import run_ocr
from app.models.ocr import OCRResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.ocr import router as ocr_router
from app.api.animal import router as animal_router

app = FastAPI()

origins = [settings.frontend_url]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in [ocr_router, animal_router]:
    app.include_router(router)
