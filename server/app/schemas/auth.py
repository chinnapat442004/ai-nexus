from pydantic import ConfigDict
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GoogleLoginRequest(BaseModel):
    credential: str

class UserBase(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None

class UserOut(UserBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)




class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserOut



