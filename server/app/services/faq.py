
from app.models.faq import Faq
from app.services.ingest import ingest
from sqlalchemy import desc

from sqlalchemy.orm import Session


from sqlalchemy import or_


def get_faqs(
    db: Session,
    page: int = 1,
    page_size: int = 10,
    search: str | None = None,
):
    query = db.query(Faq).order_by(desc(Faq.updated_at))

    if search:
        query = query.filter(
            or_(
                Faq.question.ilike(f"%{search}%"),
                Faq.answer.ilike(f"%{search}%"),
            )
        )

    total = query.count()

    offset = (page - 1) * page_size

    items = (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )

    return {
        "data": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
    }

def create_faq(question:str,answer:str,db:Session):

    db_item =Faq(question=question,answer=answer)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    ingest()
    return db_item

def get_faq(db:Session,item_id:int):
   return db.query(Faq).filter(Faq.id==item_id).first()

def update_faq(id:int,question:str,answer:str,db:Session):
    db_item  = db.query(Faq).filter(Faq.id==id).first()
    if db_item.question  is not None:
        db_item .question =question

    if db_item.answer is not None:
        db_item .answer = answer
        
    db_item.embedding =None
    db.commit()
    db.refresh(db_item)
    ingest()
    return db_item

def delete_faq(id:int,db:Session):
    item = db.query(Faq).filter(Faq.id ==id).first()
    db.delete(item)
    db.commit()
    return item