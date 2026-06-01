
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.chat import chat

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

@router.post("/chat", response_model=ChatResponse, tags=["chat"])
def chat_endpoint(request: ChatRequest):
    answer = chat(request.question)
    return ChatResponse(answer=answer)