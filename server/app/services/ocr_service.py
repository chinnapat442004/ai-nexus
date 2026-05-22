from fastapi import HTTPException
from PIL import Image
from PIL import Image
from PIL import ImageFilter, ImageOps, Image
import base64
import httpx
from app.config import settings
import re
import io

TYPHOON_API_KEY = settings.typhoon_api_key
TYPHOON_URL = "https://api.opentyphoon.ai/v1/chat/completions"


async def run_ocr(file_bytes: bytes):
    image = Image.open(io.BytesIO(file_bytes))
    image = image.resize((2000, 1200))      # ขยายภาพให้ OCR อ่านง่ายขึ้น
    image = image.convert("L")             # แปลงเป็น grayscale
    image = ImageOps.autocontrast(image)   # ปรับ contrast อัตโนมัติ
    image = image.filter(ImageFilter.MedianFilter(size=3))                    # ลด noise
    image = image.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))  # เพิ่มความคมชัด
    image = image.convert("RGB")           # แปลงกลับเป็น RGB เพื่อ save เป็น JPEG

    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=95)  # บันทึกคุณภาพสูงเพื่อส่ง API

    b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")  # แปลงเป็น base64

    payload = {
        "model": "typhoon-ocr",
        "max_tokens": 1024,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{b64}"
                        }
                    },
                    {
                        "type": "text",
                       "text": """
Perform strict OCR on this Thai national ID card.

Rules:
1. First verify whether the image is a real Thai national ID card
2. If the image is NOT a Thai national ID card, return exactly:
   NOT_THAI_ID_CARD
3. DO NOT include any markdown formatting, asterisks (*), hashes (#), or headers. Return plain raw text only.
4. Read text exactly as shown in the image
5. Do not guess or hallucinate
6. Do not modify or translate text
7. Keep original structure and spacing as much as possible
8. Try to read and organize text block-by-block from top to bottom
9. Preserve line order based on the visual layout of the card
10. If a title and name are attached together (e.g. Mrs.Bunyang, Mr.Smith),
   separate them with a space (e.g. Mrs. Bunyang, Mr. Smith)
11. Return ONLY the OCR result without any explanations or extra text.
Do NOT include symbols, markdown formatting, asterisks (*),
OCR analysis, detected-word summaries, or image descriptions.
12. For date fields, ALWAYS output in this fixed order on the same line:
    วันออกบัตร <TH date> Date of Issue <EN date>
    วันบัตรหมดอายุ <TH date> Date of Expiry <EN date>
    Even if the card shows the date before the label, reorder so the label comes first.
13. Never split a single word across lines (e.g. "วันบัตรหมดอายุ" must stay as one word).
"""
                    }
                ]
            }
        ]
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            TYPHOON_URL,
            headers={"Authorization": f"Bearer {TYPHOON_API_KEY}"},
            json=payload,
            timeout=30.0
        )

        response.raise_for_status()

    content = response.json()["choices"][0]["message"]["content"]
    if content.strip() == "NOT_THAI_ID_CARD":
        print('เป็นที่ A')
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is not a Thai national ID card"
    )

    content = content.replace(":", "").replace("-", "")
    content = content.replace("\\n", " ")
    content = re.sub(r'\s+', ' ', content).strip()
    print(content)

    def s(pattern, text, group=1):
        m = re.search(pattern, text)
        return m.group(group).strip() if m and m.group(group) else None

    data = {}

    id_number_match = re.search(r'(\d[\d\s]{10,}\d)', content)
    data["id_number"] = (
        re.sub(r'\s+', '', id_number_match.group(1))
        if id_number_match else None
    )

    data["title_th"] = s(r'ชื่อตัวและชื่อสกุล\s*([^\s]+)', content)

    thai_name_match = re.search(
        r'ชื่อตัวและชื่อสกุล\s*(.+?)\s*Name',
        content
    )

    full_name_th = thai_name_match.group(1).strip() if thai_name_match else None

    if full_name_th and data.get("title_th"):
        full_name_th = full_name_th.replace(data["title_th"], "", 1).strip()

    data["thai_name_th"] = full_name_th

    data["title_en"] = s(r'Name\s*([^\s]+)', content)

    english_name_match = re.search(
        r'Name\s*(.+?)\s*เกิดวันที่',
        content
    )

    full_name_en = english_name_match.group(1).strip() if english_name_match else None

    if full_name_en and data.get("title_en"):
        full_name_en = full_name_en.replace(data["title_en"], "", 1).strip()

    if full_name_en:
        full_name_en = re.sub(
        r"last\s*name",
        "",
        full_name_en,
        flags=re.IGNORECASE
        ).strip()

    data["english_name"] = full_name_en

    data["birthdat_th"] = s(
        r'เกิดวันที่\s*(.+?)\s*Date of Birth',
        content
    )

    data["birthdat_eng"] = s(
        r'Date of Birth\s*(.+?)\s*ที่อยู่',
        content
    )

    address_match = re.search(
        r'ที่อยู่\s*(.+?)\s*วันออกบัตร',
        content
    )

    data["address"] = address_match.group(1).strip() if address_match else None

    data["issue_date"] = s(
    r'วันออกบัตร\s*(\d{1,2}\s*[\u0E00-\u0E7F\.]+\s*\d{4})',
    content
)

    data["expiry_date"] = s(
    r'วันบัตรหมดอายุ\s*(\d{1,2}\s*[\u0E00-\u0E7F\.]+\s*\d{4})',
    content
)



  
    card_data = {
        "id_number": data.get("id_number"),
        "prefix_th": data.get("title_th"),
        "prefix_en": data.get("title_en"),
        "name_th": data.get("thai_name_th"),
        "name_en": data.get("english_name"),
        "date_of_birth": data.get("birthdat_eng"),
        "date_of_birth_th": data.get("birthdat_th"),
        "date_of_birth_en": data.get("birthdat_eng"),
        "address": data.get("address"),
        "date_of_issue": data.get("issue_date"),
        "date_of_expiry": data.get("expiry_date"),
        
    }
    if (
    not data.get("id_number")
    or not data.get("thai_name_th")
): 
        print('เป็นที่ B')

        raise HTTPException(
            status_code=400,
            detail="Unable to extract valid Thai ID card information"
    )

    return {
        "success": True,
        "data": card_data
    }