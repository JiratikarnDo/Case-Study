# 🏥 ระบบนัดหมายแพทย์ (Doctor Appointment System)

โปรเจคนี้พัฒนาด้วย **Next.js (Frontend)** และ **NestJS + Prisma (Backend)**  
เพื่อสร้างระบบจัดการนัดหมายระหว่าง **หมอ** และ **ผู้ป่วย** อย่างครบวงจร  

---

## ✨ ฟีเจอร์หลัก

### 👩‍⚕️ สำหรับหมอ (Doctor)
- เข้าสู่ระบบด้วยบัญชีแพทย์
- จัดการตารางเวลาว่าง (Availability Slots)
- ดูรายการนัดหมายของผู้ป่วย
- เห็นข้อมูลผู้ป่วยที่ทำการจอง (ชื่อ อีเมล)

### 🧑‍🦱 สำหรับผู้ป่วย (Patient)
- สมัคร / เข้าสู่ระบบ
- ดูตารางเวลาหมอที่ว่าง
- จองนัดหมายกับหมอ
- ดูประวัติการจองของตัวเอง

---

## 🛠 เทคโนโลยีที่ใช้

### Frontend (Next.js)
- React + Next.js
- ใช้ `toast.success()` / `toast.error()` สำหรับแจ้งเตือน
- JWT Decode เพื่อจัดการ role และ userId
- UI: หน้า Login, หน้าการจอง, หน้าการนัดหมาย

### Backend (NestJS + Prisma + MySQL)
- NestJS เป็น REST API
- Prisma ORM เชื่อมต่อฐานข้อมูล
- Authentication ด้วย JWT (Access/Refresh Token)
- Logic:
  - จองนัดหมายได้เฉพาะผู้ป่วย
  - ตรวจสอบ slot ต้องว่าง (`available`) ก่อนจอง
  - จัดการ appointments (หมอ/ผู้ป่วยเห็นข้อมูลของตัวเองเท่านั้น)

---

## 📌 API หลัก
- `POST /auth/login` → เข้าสู่ระบบ user
- `POST /auth/register/doctor` → เข้าสู่ระบบ doctor
- `POST /appointments` → จองนัดหมาย
- `POST /register` → สมัครสมาชิก User
- `POST /register/doctor` → สมัครสมาชิก Doctor
- `POST /doctors/slots` → เพิ่มเวลาว่างของหมอ
- `GET /appointments/mine` → ดูนัดหมายของผู้ป่วย
- `GET /appointments/doctor` → ดูนัดหมายของหมอ
- `GET /doctors/:id/slots` → ดูเวลาว่างของหมอ

## 📌📌API ทั้งหมดในโปรเจค
- `POST /auth/register` → สมัครสมาชิก User
- `POST /auth/register/doctor` → สมัครสมาชิก Doctor
- `POST /auth/login` → เข้าสู่ระบบ User
- `POST /auth/login/doctor` → เข้าสู่ระบบ Doctor
- `POST /slots` → หมอเพิ่มเวลาว่างใหม่
- `GET /slots` → ดูเวลาว่างของหมอทั้งหมด
- `GET /slots/:doctorId` → ดูเวลาว่างของหมอแต่ละคน
- `POST /appointments` → จองนัดหมาย
- `GET /appointments/mine` → ดูนัดหมายของผู้ป่วย
- `GET /appointments/doctor` → ดูนัดหมายของหมอ
- `GET /appointments/date` → ดูสรุปการนัดหมายตามวัน
- `GET /doctor/profile/:id` → ดูโปรไฟล์หมอ
- `GET /user/me` → ดูข้อมูลของเรา
- `PUT /user/me` → แก้ไขข้อมูลของเรา
- `GET /specialties` → ดูรายการความเชี่ยวชาญทั้งหมด



---

## 🔧 วิธีใช้งาน (เบื้องต้น)

### 1. Clone Repo
bash / powershell
git clone https://github.com/<username>/Case-Study.git
cd Case-Study 

### 2. ติดตั้ง Dependencies
npm install

### 3. ตั้งค่า Environment
.env (blackend)
DATABASE_URL="mysql://user:password@localhost:3306/appointment_db"
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret

.env.local (frontend)
NEXT_PUBLIC_API_BASE_URL=/api

### 4. Run Project
(Blackend) 
npm run start:dev

(Frontend)
npm run dev


