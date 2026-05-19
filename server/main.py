from fastapi import FastAPI, UploadFile, File
from app.services.ocr_service import run_ocr
from app.models.response import OCRResponse

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello from ThaiCard OCR!"}

@app.post("/ocr", response_model=OCRResponse)
async def ocr(file: UploadFile = File(...)):
    contents = await file.read()
    result = await run_ocr(contents)
    return result