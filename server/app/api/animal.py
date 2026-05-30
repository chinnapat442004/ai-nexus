from app.services.animal_service import get_animals
from app.models.animal import AnimalResponse, AnimalNameResponse
from fastapi import APIRouter, UploadFile, File


from app.services.animal_service import detect_animal

router = APIRouter(prefix="/animal", tags=["animal"])

@router.get("",response_model=AnimalNameResponse )
async def animal():
    return await get_animals()


@router.post("",response_model=AnimalResponse)
async def animal(file: UploadFile = File(...)):
    return await detect_animal(file)