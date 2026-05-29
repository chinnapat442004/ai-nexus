from app.models.animal import AnimalResponse
from fastapi import APIRouter, UploadFile, File


from app.services.animal_service import detect_animal

router = APIRouter(prefix="/animal", tags=["animal"])


@router.post(
    "",
    response_model=AnimalResponse
)
async def animal(file: UploadFile = File(...)):
    return await detect_animal(file)