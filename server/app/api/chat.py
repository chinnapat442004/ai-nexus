
from app.models import Message
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat import chat ,get_chats
from app.database import engine
from sqlalchemy.orm import Session
from app.enums.user_role import UserRole




class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str


router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("",tags=["chat"])
def get_chat():
    chats =get_chats()
    return chats


@router.post("", response_model=ChatResponse, tags=["chat"])
def chat_endpoint(request: ChatRequest):
    with Session(engine) as session:
        user_message = Message(
            role=UserRole.USER,
            content=request.question,
        )

        session.add(user_message)

        answer = chat(request.question)

        assistant_message = Message(
            role=UserRole.ASSISTANT,
            content=answer,
        )

        session.add(assistant_message)

        session.commit()
    return ChatResponse(answer=answer)