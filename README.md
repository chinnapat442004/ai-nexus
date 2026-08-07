# AI Nexus

AI Nexus เป็นโปรเจกต์ full-stack ที่มี frontend ด้วย React + Vite และ backend ด้วย FastAPI
แอปนี้รวมฟีเจอร์ AI หลายอย่าง เช่น ตรวจจับสัตว์จากภาพ, OCR, ระบบถามตอบ FAQ และล็อกอินด้วย Google OAuth

## คู่มือการใช้งานแอป

### OCR บัตรประชาชน

- -สามารถใช้รูปภาพตัวอย่างเพื่อทดสอบระบบได้โดยระบบจะไม่จัดเก็บข้อมูล เพื่อความปลอดภัยและความเป็นส่วนตัวของผู้ใช้งาน
- อัปโหลดรูปภาพเพื่อให้ระบบอ่านข้อความ
- ใช้สำหรับข้อมูลบัตรหรือเอกสารที่คล้ายกัน

### ตรวจจับสัตว์

- อัปโหลดภาพสัตว์
- ระบบจะตรวจจับชนิดสัตว์และแสดงความมั่นใจ
- ถ้า AI ไม่แน่ใจมาก ระบบจะแจ้งให้ทราบ

### FAQ

- ดูรายการคำถามและคำตอบ
- ค้นหาคำถามได้ด้วยคำค้น
- เพิ่มคำถามใหม่, แก้ไข หรือ ลบคำถาม

### แชท

- ผู้ใช้สามารถล็อกอินด้วยบัญชี Google
- ส่งคำถามไปยังระบบแชท
- ระบบจะตอบโดยอ้างอิงข้อมูลจาก FAQ ที่มี
- หากคำถามอยู่นอกขอบเขตข้อมูล จะได้รับข้อความแจ้งว่าไม่สามารถตอบได้

## การติดตั้ง

### 1. เตรียมโฟลเดอร์

```bash
cd c:/Users/Pat/Desktop/code/projects
```

### 2. Backend

```bash
cd ai-nexus/server
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Frontend

```bash
cd ..\client
npm install
```

## ตั้งค่า environment

สร้างไฟล์ `.env` ในโฟลเดอร์ `server/` และใส่ค่า:

```env
typhoon_api_key=
frontend_url=http://localhost:5173
roboflow_key=
database_url=
gemini_api_key=
google_client_id=
jwt_secret=
jwt_algorithm=HS256
access_token_expire_minutes=60
cookie_secure=False
```

> หากนำไปใช้งานจริง ให้ตั้ง `cookie_secure=True` และใช้ HTTPS

## รันแอป

### รัน backend

```bash
cd server
.\.venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### รัน frontend

```bash
cd client
npm run dev
```

จากนั้นเปิดเบราว์เซอร์ไปที่ `http://localhost:5173`
