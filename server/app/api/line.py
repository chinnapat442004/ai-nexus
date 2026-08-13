
from fastapi import APIRouter,Request
router = APIRouter(prefix="/line", tags=["line"])


from app.config import settings


from linebot import (
 WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)

from linebot.models import MessageEvent, TextMessage
from app.services.line import handle_message

handler = WebhookHandler(settings.channel_secret)

@router.post('/message')
async def hello_word(request: Request):
    signature = request.headers['X-Line-Signature']
    body = await request.body()
    
    try:
      handler.handle(body.decode('UTF-8'), signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
    return 'OK'


@handler.add(MessageEvent, message=TextMessage)
def handle_text_message(event):
    handle_message(event)
