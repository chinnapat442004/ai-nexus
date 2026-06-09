from app.schemas.faq import FaqPaginationResponse
from app.schemas.faq import FaqUpdate
from app.schemas.faq import FaqCreate
from fastapi import status
from typing import List
from fastapi import APIRouter, HTTPException
from app.schemas.faq import FaqResponse
from sqlalchemy.orm import Session
from app.database import get_db
from fastapi import Depends
from app.services.faq import get_faqs ,create_faq ,get_faq ,update_faq ,delete_faq

from fastapi import APIRouter
router = APIRouter(prefix="/faq", tags=["faq"])

from fastapi import Query

@router.get("",response_model=FaqPaginationResponse)
def get_faqs_endpoint(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1),
    search: str | None = None,
    db: Session = Depends(get_db),
):
    return get_faqs(
        db=db,
        page=page,
        page_size=page_size,
        search=search,
    )
    
@router.get("/{item_id}", response_model=FaqResponse)
def get_faq_endpoint(item_id: int, db: Session = Depends(get_db)):
    item = get_faq(db, item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="FAQ not found"
        )
    return item

@router.post("", response_model=FaqResponse)
def create_faq_endpoint(faq_in: FaqCreate, db: Session = Depends(get_db)):
    return create_faq(faq_in.question, faq_in.answer, db)


@router.patch("/{item_id}", response_model=FaqResponse)
def update_faq_endpoint(item_id: int, faq_in: FaqUpdate, db: Session = Depends(get_db)):
    item = update_faq(item_id, faq_in.question, faq_in.answer, db)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="FAQ not found"
        )
    return item

@router.delete("/{item_id}")
def delete_faq_endpoint(item_id: int, db: Session = Depends(get_db)):
    item = delete_faq(item_id, db)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="FAQ not found"
        )
    return {"detail": "Item deleted successfully"}


