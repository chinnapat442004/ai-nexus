
from linebot import (
    LineBotApi, WebhookHandler
)

from linebot.models import (
    MessageEvent, TextMessage, TextSendMessage,
)


line_bot_api = LineBotApi('channel_access_token')



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