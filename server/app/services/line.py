
from linebot import (
    LineBotApi
)
from app.services.chat import chat
from linebot.models import (
    TextSendMessage,
)

from app.config import settings


line_bot_api = LineBotApi(settings.channel_access_token)



def handle_message(event):
        answer = chat(event.message.text)
        sendMessage(event,answer )
      
    
def echo(event):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=event.message.text))
        
def sendMessage(event,message):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=message))