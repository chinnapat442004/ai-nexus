from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session

from app.database import engine
from app.models.faq import Faq

model = SentenceTransformer("BAAI/bge-m3")


def ingest():
    with Session(engine) as session:
        faqs = session.query(Faq).filter(Faq.embedding == None).all()

        if not faqs:
            print("No FAQs to ingest")
            return

        for faq in faqs:
            text = f"คำถาม: {faq.question} คำตอบ: {faq.answer}"
            faq.embedding = model.encode(text).tolist()

        session.commit()
        print(f"Ingested {len(faqs)} FAQs")


if __name__ == "__main__":
    ingest()