from pydantic import BaseModel
from typing import Optional

class CardData(BaseModel):
    id_number: Optional[str] = None
    prefix_th: Optional[str] = None
    name_th: Optional[str] = None
    prefix_en: Optional[str] = None
    name_en: Optional[str] = None
    date_of_birth: Optional[str] = None
    date_of_birth_th: Optional[str] = None
    date_of_birth_en: Optional[str] = None
    address: Optional[str] = None
    date_of_issue: Optional[str] = None
    date_of_expiry: Optional[str] = None
 

class OCRResponse(BaseModel):
    success: bool
    data: Optional[CardData] = None