from fastapi import APIRouter, UploadFile, File

from app.models.ocr import OCRResponse
from app.services.ocr_service import run_ocr

router = APIRouter(prefix="/ocr", tags=["ocr"])

@router.post("", response_model=OCRResponse)
async def ocr(file: UploadFile = File(...)):
    contents = await file.read()
    result = await run_ocr(contents)
    return result