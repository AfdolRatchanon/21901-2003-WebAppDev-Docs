# Project Defense: นำเสนอโปรเจกต์ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
โปรเจกต์ระบบเบิก-จ่ายอุปกรณ์เสร็จแล้ว — ถึงเวลา "นำเสนอ" ต่อกรรมการ นักเรียนต้องอธิบายได้ว่า "ทำอะไร ทำไม และทำอย่างไร" ไม่ใช่แค่ demo ว่าใช้งานได้
:::

> 💡 **Project Defense** คือการป้องกันผลงาน — พิสูจน์ว่าเราเข้าใจ code ที่เขียน ตอบคำถามได้ และแก้ปัญหาที่เจอได้

---

## 📖 I: Information

### โครงสร้างการนำเสนอ (15 นาที)

| ช่วง | เวลา | เนื้อหา |
| :--- | :--- | :--- |
| เปิดตัวโปรเจกต์ | 2 นาที | ปัญหาคืออะไร ทำไมต้องมีระบบนี้ |
| Demo ระบบ | 5 นาที | Live demo ครบทุก feature |
| Technical Stack | 3 นาที | เทคโนโลยีที่ใช้และทำไมเลือกตัวนั้น |
| ความท้าทาย | 3 นาที | ปัญหาที่พบและวิธีแก้ |
| Q&A | 2 นาที | ตอบคำถามกรรมการ |

### Demo Checklist ที่ต้องแสดง

- [ ] เปิดหน้าเว็บ — แสดงหน้า Login
- [ ] Login เป็น admin — แสดง Navbar + role badge
- [ ] เปิด 2 tab — demo Real-time update
- [ ] ยืมอุปกรณ์ใน tab 1 — tab 2 เห็นทันที
- [ ] Login เป็น student — แสดงว่าเข้า /admin ไม่ได้
- [ ] เพิ่มอุปกรณ์ใหม่ใน Admin page
- [ ] เปิด DevTools Network tab — แสดง API calls

### คำถามที่กรรมการมักถาม

::: details ❓ ทำไมเลือกใช้ React แทน Vue หรือ Angular?
**แนวคำตอบ:** React มี community ใหญ่ที่สุด, ecosystem ครบ (Router, State management, Testing), TypeScript support ดี ที่สำคัญ React เป็น Library ไม่ใช่ Framework ทำให้ยืดหยุ่นและเลือก tool ได้ตามต้องการ
:::

::: details ❓ JWT ปลอดภัยไหม? จะทำให้ปลอดภัยขึ้นได้อย่างไร?
**แนวคำตอบ:** JWT ที่เก็บใน localStorage มีความเสี่ยง XSS ระบบ production ควรเปลี่ยนเป็น HttpOnly Cookie, ตั้ง expiry สั้น (1 ชั่วโมง), ใช้ Refresh Token pattern และตั้ง HTTPS เสมอ
:::

::: details ❓ ถ้า Backend ล่ม ระบบจะเกิดอะไรขึ้น?
**แนวคำตอบ:** Frontend จะแสดง error message "ไม่สามารถโหลดข้อมูลได้" เพราะ error handling ใน `useEquipments` ทำงาน Axios interceptor จะ redirect ไป /login ถ้า 401 แต่ถ้า Network หาย จะค้างที่ loading state
:::

::: details ❓ อธิบาย real-time ทำงานอย่างไร?
**แนวคำตอบ:** ใช้ Socket.io ที่สร้างบน WebSocket — Frontend เชื่อมต่อผ่าน `io({ path: '/socket.io' })` และเข้า room "equipment-updates" ทุกครั้งที่มีการยืม/คืน Backend จะ `emit('equipmentStatusChanged', payload)` ไปยังทุก client ใน room Frontend รับ event แล้วอัปเดต state โดยตรงด้วย `setEquipments`
:::

::: details ❓ TypeScript ช่วยอะไรในโปรเจกต์นี้?
**แนวคำตอบ:** TypeScript ช่วย: 1) ตรวจสอบ type ใน `Equipment` interface ทำให้ไม่ส่งข้อมูลผิด field 2) Generics ใน `apiClient.get<ApiResponse<T>>()` ทำให้ `res.data.data` มี type ถูกต้อง 3) `UserRole = 'admin' | 'teacher' | 'student'` ป้องกัน typo 4) ลด runtime bug จาก type mismatch
:::

### สิ่งที่ต้องเตรียม

```markdown
## เอกสาร
- [ ] README.md: วิธีรัน Frontend + Backend
- [ ] รูปภาพ ERD
- [ ] ตาราง API endpoints

## Code
- [ ] clean code — ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี hardcode credentials ใน code
- [ ] TypeScript 0 errors

## Demo Environment
- [ ] Backend รันอยู่
- [ ] Database มีข้อมูล seed แล้ว
- [ ] Browser พร้อม (ปิด extension ที่รบกวน)
- [ ] เปิด 2 tab ไว้ล่วงหน้า
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"ต้องนำเสนอโปรเจกต์เว็บแอปพลิเคชัน React + TypeScript ช่วยสร้างโครงร่างการนำเสนอ 15 นาที ที่ครอบคลุม: แรงจูงใจของโปรเจกต์, live demo, เหตุผลที่เลือก technical stack, ปัญหาที่พบ และเตรียมตอบคำถามที่มักถามเกี่ยวกับ JWT security, real-time ด้วย Socket.io และประโยชน์ของ TypeScript"
:::

### 📝 PjBL Lab — Project Defense Preparation

**ขั้น 1: เตรียม Demo (30 นาที)**
- [ ] ซ้อม demo ตาม checklist 3 รอบ — ต้องทำได้ภายใน 5 นาที
- [ ] เตรียม "script" สั้นๆ สำหรับแต่ละขั้นตอน
- [ ] ทดสอบว่า real-time ทำงานได้ก่อน demo

**ขั้น 2: เตรียมคำถาม (30 นาที)**
- [ ] อ่านคำถามในส่วน "คำถามที่กรรมการมักถาม" ด้านบน
- [ ] ฝึกตอบ — พยายามตอบจากความเข้าใจ ไม่ใช่ท่อง
- [ ] ดู code จริงใน `src/` ให้เข้าใจทุกไฟล์สำคัญ

**ขั้น 3: Peer Review (15 นาที)**
- [ ] ให้เพื่อนถามคำถามแบบกรรมการ
- [ ] จดบันทึกคำถามที่ตอบไม่ได้เพื่อไปศึกษาเพิ่ม

---

## ✅ P: Progress

### 📋 Rubric Project Defense (20 คะแนน)

| เกณฑ์ | ดีมาก (5) | พอใช้ (3) | ปรับปรุง (0-1) |
| :--- | :--- | :--- | :--- |
| Demo ครบถ้วน | ทุก feature ทำงาน | บางส่วนขาด | Demo ไม่ได้ |
| อธิบาย Technical Stack | อธิบายพร้อมเหตุผล | อธิบายได้แต่ไม่มีเหตุผล | อธิบายไม่ได้ |
| ตอบคำถาม | ตอบได้ทุกคำถาม | ตอบได้บางส่วน | ตอบไม่ได้ |
| Code Quality | Clean code, 0 TS errors | บาง warning | มี error |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Project Defense` | การนำเสนอและพิสูจน์ผลงาน ตอบคำถามกรรมการ |
| `Demo` | การสาธิตการทำงานของระบบ live |
| `Technical Stack` | ชุดเทคโนโลยีที่ใช้ในโปรเจกต์ทั้งหมด |
| `Stakeholder` | ผู้มีส่วนเกี่ยวข้องกับโปรเจกต์ (ครู, ผู้ใช้, กรรมการ) |
| `README` | ไฟล์เอกสารหลักของโปรเจกต์ บอกวิธีติดตั้งและใช้งาน |
