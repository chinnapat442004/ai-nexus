
from linebot import (
    LineBotApi
)

from linebot.models import (
    TextSendMessage,
)

from app.config import settings


line_bot_api = LineBotApi(settings.channel_access_token)



def handle_message(event):
        if event.message.text == 'สวัสดี' : 
            sendMessage(event,"สวัสดีชาวโลก")
        else:
            echo(event)
    
def echo(event):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=event.message.text))
        
def sendMessage(event,message):
        line_bot_api.reply_message(
            event.reply_token,
            TextSendMessage(text=message))