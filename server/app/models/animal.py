from typing import Optional
from pydantic import BaseModel


class Position(BaseModel):
    x: int
    y: int
    width: int
    height: int


class Animal(BaseModel):
    animal: str
    confidence: float
    position: Position


class AnimalResponse(BaseModel):
    success: bool
    message:str
    data: Optional[Animal] = None