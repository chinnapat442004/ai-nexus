from pydantic import BaseModel, Field
from typing import Optional


class FaqBase(BaseModel):
    question: str
    answer: str 

class FaqCreate(FaqBase):
    pass  

class FaqUpdate(BaseModel):
    question: Optional[str] 
    answer: Optional[str] 

class FaqResponse(FaqBase):
    id: int  
    
    model_config = {
        "from_attributes": True
    }

class FaqPaginationResponse(BaseModel):
    data: list[FaqResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

    model_config = {
        "from_attributes": True
    }