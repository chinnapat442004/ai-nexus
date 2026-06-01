from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import engine
from app.models.faq import Faq

model = SentenceTransformer("BAAI/bge-m3")


def search_faq(question: str, limit: int = 3):  #ค้นหา FAQ ที่มีความหมายใกล้เคียงกับคำถาม ใช้ Vector Search
    q_embedding = model.encode(question).tolist()

    with Session(engine) as session:
        results = (
            session.execute(
                select(Faq)
                .order_by(Faq.embedding.l2_distance(q_embedding))
                .limit(limit)
            )
            .scalars()
            .all()
        )

    return [
        {
            "question": faq.question,
            "answer": faq.answer,
        }
        for faq in results
    ]


