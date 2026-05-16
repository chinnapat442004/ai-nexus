from pydantic import BaseModel
from typing import Optional, List

class OCRResponse(BaseModel):
    success: bool
    texts: Optional[List[str]] = None