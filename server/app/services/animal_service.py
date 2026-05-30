from pathlib import Path
from PIL import Image
from PIL import Image

from fastapi import HTTPException
from inference_sdk import InferenceHTTPClient
from app.config import settings
import io
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key=settings.roboflow_key
)


import io
from pathlib import Path
from fastapi import HTTPException, UploadFile
from PIL import Image

#แปลเป็นภาษาไทยจาก class ทั้งหมดที่มี
ANIMAL_TRANSLATIONS = {
    "Frog": "กบ",
    "Rabbit": "กระต่าย",
    "Deer": "กวาง",
    "Lizard": "กิ้งก่า",
    "Sheep": "แกะ",
    "Chicken": "ไก่",
    "Turkey": "ไก่งวง",
    "Snake": "งู",
    "Kangaroo": "จิงโจ้",
    "Elephant": "ช้าง",
    "Koala": "โคอาลา",
    "Centipede": "ตะขาบ",
    "Sparrow": "นกกระจอก",
    "Ostrich": "นกกระจอกเทศ",
    "Canary": "นกคีรีบูน", 
    "Peacock": "นกยูง",
    "Raven": "นกกา",
    "Woodpecker": "นกหัวขวาน",
    "Owl": "นกฮูก",
    "Magpie": "นกกางเขน", 
    "Parrot": "นกแก้ว",
    "Eagle": "นกอินทรี",
    "Otter": "นาก",
    "Duck": "เป็ด",
    "Butterfly": "ผีเสื้อ",
    "Moths-and-butterflies": "ผีเสื้อและผีเสื้อกลางคืน",
    "Goat": "แพะ",
    "Panda": "แพนด้า",
    "Red-panda": "แพนด้าแดง",
    "Horse": "ม้า",
    "Zebra": "ม้าลาย",
    "Jellyfish": "แมงกะพรุน",
    "Scorpion": "แมงป่อง",
    "Spider": "แมงมุม",
    "Ladybug": "แมลงเต่าทอง",
    "Cat": "แมว",
    "Lynx": "แมวป่า",
    "Giraffe": "ยีราฟ",
    "Raccoon": "แรคคูน",
    "Rhinoceros": "แรด",
    "Mule": "ล่อ",
    "Monkey": "ลิง",
    "Bull": "วัวตัวผู้",
    "Cattle": "วัวหรือควาย", 
    "Lion": "สิงโต",
    "Dog": "สุนัข",
    "Fox": "สุนัขจิ้งจอก",
    "Swan": "หงส์",
    "Caterpillar": "หนอนผีเสื้อ",
    "Mouse": "หนู",
    "Hamster": "หนูแฮมสเตอร์",
    "Bear": "หมี",
    "Polar-bear": "หมีขั้วโลก",
    "Brown-bear": "หมีสีน้ำตาล",
    "Goose": "ห่าน",
    "Wolf": "หมาป่า",
    "Pig": "หมู",
    "Wild Boar": "หมูป่า",
    "Hedgehog": "เม่นแคระ",
    "Tiger": "เสือ",
    "Cheetah": "เสือชีตาห์",
    "Leopard": "เสือดาว",
    "Camel": "อูฐ",
    "Hippopotamus": "ฮิปโปโปเตมัส",
}
async def detect_animal(file: UploadFile):
  
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="กรุณาอัปโหลดรูปภาพ"
        )
    try:
        file_bytes = await file.read()
        image = Image.open(io.BytesIO(file_bytes))
        result = CLIENT.infer(
            image, 
            model_id="animal-detection-ofnht/1"
        )
        predictions = result.get("predictions", [])
        if not predictions:
            return {
                "success": False,
                "message": "ไม่พบสัตว์ในภาพ",
                "data": None
            }
        best_prediction = max(predictions, key=lambda x: x["confidence"])
        confidence = round(best_prediction["confidence"] * 100, 2)
        english_name = best_prediction["class"]
        thai_name = ANIMAL_TRANSLATIONS.get(english_name, english_name)
        if confidence < 70:
            return {
                "success": False,
                "message": f"AI ไม่แน่ใจว่าสัตว์คืออะไร (มั่นใจเพียง {confidence}%)",
                "data": {
                    "animal": thai_name,
                    "confidence": confidence,
                    "position": {
                        "x": int(best_prediction["x"]), "y": int(best_prediction["y"]),
                        "width": int(best_prediction["width"]), "height": int(best_prediction["height"])
                    }
                }
            }
        return {
            "success": True,
            "message": "ตรวจจับสัตว์สำเร็จ",
            "data": {
                "animal": thai_name,
                "confidence": confidence,
                "position": {
                    "x": int(best_prediction["x"]), "y": int(best_prediction["y"]),
                    "width": int(best_prediction["width"]), "height": int(best_prediction["height"])
                }
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"เกิดข้อผิดพลาดในการประมวลผล: {str(e)}"
        )

async def get_animals():
    return {
        "animal_name": (ANIMAL_TRANSLATIONS.values())
    }
