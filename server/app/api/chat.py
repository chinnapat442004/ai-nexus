
from app.core.deps import get_current_user
from fastapi import Depends
from app.models import Message
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat import chat ,get_chats_by_user

from sqlalchemy.orm import Session
from app.enums.user_role import UserRole
from app.database import get_db
from fastapi import Depends
from sqlalchemy.orm import Session



class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str


router = APIRouter(prefix="/chat", tags=["chat"])

@router.get("",)
def get_chats(current_user=Depends(get_current_user)):
    user_id = current_user.id
    chats = get_chats_by_user(user_id)
    return chats



@router.post("", response_model=ChatResponse)
def chat_endpoint(
    request: ChatRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_message = Message(
        role=UserRole.USER,
        content=request.question,
        user_id=current_user.id,
    )

    db.add(user_message)

    answer = chat(request.question)

    assistant_message = Message(
        role=UserRole.ASSISTANT,
        content=answer,
        user_id=current_user.id,
    )

    db.add(assistant_message)

    db.commit()

    return ChatResponse(answer=answer)