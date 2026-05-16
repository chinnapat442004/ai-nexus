import easyocr
import numpy as np
from PIL import Image
import io

reader = easyocr.Reader(['th', 'en'])

async def run_ocr(file_bytes: bytes):
    image = Image.open(io.BytesIO(file_bytes))
    result = reader.readtext(np.array(image))
    texts = [item[1] for item in result]
    return {"success": True, "texts": texts}