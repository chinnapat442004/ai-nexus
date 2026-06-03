# from sentence_transformers import SentenceTransformer
from google import genai
from app.config import settings
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import engine
from app.models.faq import Faq

# อันเก่ากิน RAM เกิน 512MB ทำให้ Deploy ไม่ผ่าน

# model = SentenceTransformer("BAAI/bge-m3")

client = genai.Client(api_key=settings.gemini_api_key)


def search_faq(question: str, limit: int = 3):  #ค้นหา FAQ ที่มีความหมายใกล้เคียงกับคำถาม ใช้ Vector Search
    # q_embedding = model.encode(question).tolist()
    
    # ใช้ Gemini Embedding ประหยัด RAM กว่า
    response = client.models.embed_content(
        model='gemini-embedding-001',
        contents=question
    )
    q_embedding = response.embeddings[0].values

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


