from fastapi import APIRouter, HTTPException, status, Depends ,Response, Cookie
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests

from app.database import get_db
from app.models.user import User 
from app.schemas.auth import GoogleLoginRequest, TokenResponse, UserOut 
from app.config import settings
from app.core.security import create_access_token
from app.core.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/google", response_model=TokenResponse)
def google_login(payload: GoogleLoginRequest,response: Response, db: Session = Depends(get_db)):
    try:
        user_info = id_token.verify_oauth2_token(
            payload.credential,
            requests.Request(),
            settings.google_client_id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google Auth Error: {str(e)}",
        )

    google_id = user_info.get("sub")
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account does not provide an email.",
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            google_id=google_id,
            email=email,
            name=name ,
            picture=picture 
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.name = name 
        user.picture = picture 
        db.commit()
        db.refresh(user)

    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(data=token_data)

    response.set_cookie(
        key="access_token",
        value=access_token,

        # ป้องกัน JavaScript เข้าถึง Cookie เพื่อลดความเสี่ยงจาก XSS
        httponly=True,

        # ใช้ https เท่านั้นใน Production
        # Development (localhost) สามารถตั้งเป็น False ได้
        secure=settings.cookie_secure,
        # ป้องกัน CSRF ในระดับหนึ่ง
        # อนุญาตให้ส่ง Cookie เมื่อผู้ใช้เข้ามาจากการกดลิงก์ภายนอก
        # Production (cross-origin): ต้องใช้ "none" + secure=True
        # Localhost (same-origin):   ใช้ "lax" ได้ปกติ
        samesite="none" if settings.cookie_secure else "lax",
)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout(response: Response):
   
    response.delete_cookie(
        key="access_token",

        #FastAPI (และ Browser) ถ้าไม่ได้ set ไว้ตอน set_cookie จะใช้ค่าเริ่มต้นเป็น path="/"
        # ใช้ path "/" ซึ่งเป็นค่าเริ่มต้นเดียวกับ set_cookie
        # เพื่อให้ Browser ลบ Cookie ได้ถูกต้อง
        path="/",
    )
    return {"message": "Successfully logged out"}