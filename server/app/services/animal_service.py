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
    "Dog": "สุนัข",
    "Cat": "แมว",
    "Horse": "ม้า",
    "Mouse": "หนู",
    "Elephant": "ช้าง",
    "Sheep": "แกะ",
    "Bear": "หมี",
    "Chicken": "ไก่",
    "Zebra": "ม้าลาย",
    "Giraffe": "ยีราฟ",
    "Pig": "หมู",
    "Tiger": "เสือ",
    "Deer": "กวาง",
    "Monkey": "ลิง",
    "Lion": "สิงโต",
    "Rabbit": "กระต่าย",
    "Jellyfish": "แมงกะพรุน",
    "Fox": "สุนัขจิ้งจอก",
    "Duck": "เป็ด",
    "Goat": "แพะ",
    "Raccoon": "แรคคูน",
    "Snake": "งู",
    "Panda": "แพนด้า",
    "Butterfly": "ผีเสื้อ",
    "Leopard": "เสือดาว",
    "Cattle": "วัวและควาย",
    "Kangaroo": "จิงโจ้",
    "Wolf": "หมาป่า",
    "Parrot": "นกแก้ว",
    "Camel": "อูฐ",
    "Cheetah": "เสือชีตาห์",
    "Spider": "แมงมุม",
    "Frog": "กบ",
    "Brown-bear": "หมีสีน้ำตาล",
    "Bull": "วัวตัวผู้",
    "Canary": "นกกานารี (นกขมิ้น)",
    "Caterpillar": "หนอนผีเสื้อ",
    "Centipede": "ตะขาบ",
    "Eagle": "นกอินทรี",
    "Goose": "ห่าน",
    "Hamster": "หนูแฮมสเตอร์",
    "Hedgehog": "เม่นแคระ",
    "Hippopotamus": "ฮิปโปโปเตมัส",
    "Koala": "โคอาลา",
    "Ladybug": "แมลงเต่าทอง",
    "Lizard": "กิ้งก่า",
    "Lynx": "แมวป่าลิงก์ส",
    "Magpie": "นกแม็กพาย (นกกาแวน)",
    "Moths-and-butterflies": "ผีเสื้อและผีเสื้อกลางคืน",
    "Mule": "ล่อ",
    "Ostrich": "นกกระจอกเทศ",
    "Otter": "นาก",
    "Owl": "นกเค้าแมว",
    "Peacock": "นกยูง",
    "Polar-bear": "หมีขั้วโลก",
    "Raven": "นกเรเวน (นกกาขนาดใหญ่)",
    "Red-panda": "แพนด้าแดง",
    "Rhinoceros": "แรด",
    "Scorpion": "แมงป่อง",
    "Sparrow": "นกกระจอก",
    "Swan": "หงส์",
    "Turkey": "ไก่งวง",
    "Wild Boar": "หมูป่า",
    "Woodpecker": "นกหัวขวาน"
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