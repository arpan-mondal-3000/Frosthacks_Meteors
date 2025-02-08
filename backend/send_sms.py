from twilio.rest import Client
import os
from dotenv import load_dotenv
load_dotenv()
# Load environment variables
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_number = os.getenv("TWILIO_PHONE_NUMBER")
my_number = os.getenv("MY_PHONE_NUMBER")
# Fetch credentials securely

def sendMsg(msg,to_num):
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        to=to_num,
        from_= twilio_number,
        body=msg)

    print(message.sid)