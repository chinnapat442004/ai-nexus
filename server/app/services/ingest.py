# from sentence_transformers import SentenceTransformer
from google import genai
from app.config import settings
from sqlalchemy.orm import Session

from app.database import engine
from app.models.faq import Faq

# เกิน RAM เกิน 512MB (ประมาณ 2-3GB) ทำให้ Deploy ไม่ผ่าน
# model = SentenceTransformer("BAAI/bge-m3")

client = genai.Client(api_key=settings.gemini_api_key)


def ingest():
    with Session(engine) as session:
        faqs = session.query(Faq).filter(Faq.embedding == None).all()

        

        for faq in faqs:
            text = f"คำถาม: {faq.question} คำตอบ: {faq.answer}"
            # faq.embedding = model.encode(text).tolist()
            
            #  Gemini API ทำ Embedding แทน
            response = client.models.embed_content(
                model='gemini-embedding-001',
                contents=text
            )
            faq.embedding = response.embeddings[0].values

        session.commit()
      


if __name__ == "__main__":
    ingest()