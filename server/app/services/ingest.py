
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

from app.database import engine
from app.models.faq import Faq

model = SentenceTransformer("BAAI/bge-m3")

def ingest():  #ใช้ในการสร้าง Embedding
    with Session(engine) as session:
        faqs = session.query(Faq).filter(Faq.embedding == None).all()

        if not faqs:            
            return

        for faq in faqs:
            text = f"คำถาม: {faq.question} คำตอบ: {faq.answer}"
            faq.embedding = model.encode(text).tolist()

        session.commit()

