
from fastapi import APIRouter,Request
router = APIRouter(prefix="/line", tags=["line"])


line_bot_api = LineBotApi('CHANNEL_ACCESS_TOKEN')
handler = WebhookHandler('CHANNEL_SECRET')

from linebot import (
    LineBotApi, WebhookHandler
)
from linebot.exceptions import (
    InvalidSignatureError
)

handler = WebhookHandler('CHANNEL_SECRET')

@router.post('/message')
async def hello_word(request: Request):
    signature = request.headers['X-Line-Signature']
    body = await request.body()
    
    try:
      handler.handle(body.decode('UTF-8'), signature)
    except InvalidSignatureError:
        print("Invalid signature. Please check your channel access token/channel secret.")
    return 'OK'

