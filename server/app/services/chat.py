
from app.models.message import Message
from app.database import engine


from google.genai import types
from sqlalchemy import select


from app.config import settings
from app.services.rag import search_faq

from google import genai

from fastapi import Depends
from sqlalchemy.orm import Session



client = genai.Client(api_key=settings.gemini_api_key)

def chat(question: str) -> str:

    faqs = search_faq(question, limit=3)

    if not faqs:
        return "ขออภัยครับ คำถามนี้อยู่นอกขอบเขตข้อมูล FAQ ที่มีอยู่ในระบบ"

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
- หากไม่มีข้อมูลเพียงพอให้ตอบว่า "ขออภัยครับ คำถามนี้อยู่นอกขอบเขตข้อมูล FAQ ที่มีอยู่ในระบบ"
- ห้ามเดาข้อมูล
- มีการปรับใช้คำให้เหมาะสมกับคำถามที่ได้รับ คำตอบสุภาพ เป็นกันเอง


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

def get_chats_by_user(user_id: int):
    with Session(engine) as session:
       statement = (
            select(Message).where(Message.user_id == user_id)
            .order_by(Message.created_at.asc())
        )
       chats = session.scalars(statement).all()
    return  chats

