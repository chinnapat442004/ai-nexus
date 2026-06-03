
from app.models.message import Message
from app.database import engine


from google.genai import types
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.services.rag import search_faq

from google import genai


client = genai.Client(api_key=settings.gemini_api_key)

def chat(question: str) -> str:

    faqs = search_faq(question, limit=3)

    if not faqs:
        return "ขออภัยครับ ไม่พบข้อมูลที่เกี่ยวข้อง"

    context = "\n".join([
        f"Q: {f['question']}\nA: {f['answer']}"
        for f in faqs
    ])

    response = client.models.generate_content_stream(
       model="gemini-2.5-flash",
       contents=question,
    config=types.GenerateContentConfig(
        system_instruction=f"""
คุณคือ AI ผู้ช่วยตอบคำถาม FAQ

กฎ:
- ตอบโดยอ้างอิงจากข้อมูลที่ให้เท่านั้น
- หากไม่มีข้อมูลเพียงพอให้ตอบว่า "ขออภัยครับ ไม่พบข้อมูลที่เกี่ยวข้อง"
- ห้ามเดาข้อมูล

ข้อมูลอ้างอิง:
{context}
"""
    ),
)

    result = ""

    for chunk in response:
        if chunk.text:
             result += chunk.text

    return result

def get_chats():
    with Session(engine) as session:
       statement = (
            select(Message)
            .order_by(Message.created_at.asc())
        )
       all_rows = session.scalars(statement).all()
    return  all_rows

