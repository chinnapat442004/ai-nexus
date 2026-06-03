from pgvector.sqlalchemy import Vector
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Faq(Base):
    __tablename__ = "faqs"

    id: Mapped[int] = mapped_column(primary_key=True)
    question: Mapped[str] = mapped_column(String(500))
    answer: Mapped[str] = mapped_column(Text)
    # ปรับ dimension จาก 1024 เป็น 3072 เพื่อรองรับ Gemini Embedding โมเดลเดิม (BAAI/bge-m3) ใช้ RAM เกิน 512MB มีปัญหาตอน deploy

    # embedding = mapped_column(Vector(1024), nullable=True)
    embedding = mapped_column(Vector(3072), nullable=True)