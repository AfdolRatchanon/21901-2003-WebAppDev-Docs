# Lab: Go-Live Simulation <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ถึงเวลา "เปิดตัวระบบ" — Lab นี้จำลอง go-live process จริง: build, ทดสอบ production mode, ตรวจสอบ checklist สุดท้าย และ demo ให้ผู้ใช้จริง (ครูและนักเรียนคนอื่น) ลองใช้งาน
:::

> 💡 **เป้าหมาย Lab นี้:** ผ่าน pre-launch checklist ทั้งหมด และ demo ระบบให้ทำงานได้จริงต่อหน้า "ผู้ใช้งาน"

---

## 📖 I: Information

### Pre-Launch Checklist

#### ✅ Frontend Build

```bash
cd project/frontend

# 1. TypeScript check — ไม่มี error เลย
npx tsc --noEmit

# 2. Build production
npm run build

# 3. Preview production build
npm run preview
# เปิด http://localhost:4173

# 4. ตรวจ Bundle Size
# ควรได้ประมาณ:
# dist/index.html          x.xx kB
# dist/assets/index-[hash].css    xx kB │ gzip: xx kB
# dist/assets/index-[hash].js    xxx kB │ gzip: xxx kB
```

#### ✅ Backend Check

```bash
cd project/backend

# ตรวจสอบ API endpoints ทำงาน
curl http://localhost:3000/api/equipments
# ต้องได้: { "success": true, "data": [...] }

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.ac.th","password":"admin123"}'
# ต้องได้: { "success": true, "data": { "token": "...", "user": {...} } }
```

#### ✅ Full System Test

| Test | สิ่งที่ตรวจสอบ | ผล |
| :--- | :--- | :--- |
| Login ทุก role | admin/teacher/student เข้าได้ทุกบัญชี | ⬜ |
| Navbar แสดงถูกต้อง | ชื่อ + role badge + เมนูตาม role | ⬜ |
| รายการอุปกรณ์ | โหลดจาก Backend จริง | ⬜ |
| ยืม/คืนอุปกรณ์ | flow ทำงานถูกต้อง | ⬜ |
| Real-time | 2 tab เห็นการเปลี่ยนแปลงพร้อมกัน | ⬜ |
| Admin CRUD | เพิ่ม/ลบอุปกรณ์ได้ | ⬜ |
| 403 Page | student เข้า /admin ไม่ได้ | ⬜ |
| Error handling | ปิด Backend → เห็น error message | ⬜ |
| Responsive | ทำงานได้ทั้งมือถือและ desktop | ⬜ |
| Persist login | Refresh → ยังอยู่ใน session | ⬜ |

### Demo Script — นำเสนอต่อผู้ใช้

```markdown
## Demo Script: ระบบเบิก-จ่ายอุปกรณ์ไอที

### 1. แนะนำระบบ (1 นาที)
"ระบบนี้ใช้แทนการบันทึกกระดาษ — ดูสถานะอุปกรณ์ real-time ได้"

### 2. Demo Login (1 นาที)
- เปิดหน้าเว็บ → แสดงหน้า Login
- Login เป็น student → แสดง Navbar + รายการอุปกรณ์
- ชี้ connection indicator "เชื่อมต่อแล้ว (Real-time)"

### 3. Demo ยืมอุปกรณ์ (2 นาที)
- เปิด 2 browser tab พร้อมกัน
- Tab 1: กดยืม MacBook Pro → กรอก purpose + วันคืน → ยืนยัน
- Tab 2: แสดงการ์ดเปลี่ยนสีเป็นแดงทันที (real-time!)

### 4. Demo Admin (2 นาที)
- Login ใหม่เป็น admin
- แสดง Stats cards (ทั้งหมด/ว่าง/ถูกยืม/ซ่อม)
- เพิ่มอุปกรณ์ใหม่ → ปรากฏในตาราง

### 5. Q&A + ขอ Feedback
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง pre-launch checklist สำหรับเว็บแอปพลิเคชันที่สร้างด้วย React และ Node.js รวมถึง: การตรวจสอบ TypeScript build, การทดสอบ API endpoints, security checklist และ demo script สำหรับนำเสนอต่อผู้ใช้งานจริง"
:::

### 📝 PjBL Lab — Go-Live Simulation

**Phase 1: Build & Verify (30 นาที)**
- [ ] รัน `npx tsc --noEmit` — 0 errors
- [ ] รัน `npm run build` — สำเร็จ ไม่มี error
- [ ] รัน `npm run preview` — ทดสอบ production build
- [ ] ทำ Full System Test checklist ด้านบน — ผ่านทุกข้อ

**Phase 2: Demo Presentation (15 นาที)**
- [ ] เตรียม demo script ตามแนวด้านบน
- [ ] นำเสนอต่อเพื่อน/ครู ตาม script
- [ ] Demo real-time บน 2 browser พร้อมกัน

**Phase 3: Post-Launch (15 นาที)**
- [ ] รับ feedback จากผู้ใช้
- [ ] บันทึก bugs/ข้อเสนอแนะที่พบระหว่าง demo
- [ ] เขียน "บทเรียน" 3 ข้อที่ได้จากโปรเจกต์นี้

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม TypeScript 0 errors ถึงสำคัญก่อน deploy?
**แนวคำตอบ:** TypeScript errors หมายถึง bug ที่ compiler ตรวจเจอแล้ว — ถ้า deploy ทั้งที่มี error อาจเกิด runtime error ในหน้า Production ที่ผู้ใช้จริงใช้งาน การแก้ TypeScript errors ก่อน deploy เป็น "safety net" ชั้นแรก
:::

::: details ❓ ทำไม Demo Script ถึงสำคัญเท่า ๆ กับ Code?
**แนวคำตอบ:** ระบบที่ดีแต่นำเสนอไม่ดีจะไม่ได้รับการยอมรับ Demo Script ช่วยให้เห็น Value ของระบบอย่างชัดเจนภายในเวลาจำกัด ในโลกจริง Demo ต่อ stakeholder สำคัญมากกว่าที่นักเรียนคิด
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Build ผ่าน | 0 TypeScript errors, build สำเร็จ | มี warning แต่ build ผ่าน | build ไม่ผ่าน |
| Full System Test | ผ่านทุก test case | ผ่าน > 70% | < 70% |
| Demo | นำเสนอได้ครบตาม script | นำเสนอได้บางส่วน | ไม่ได้ demo |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Go-Live` | วันที่ระบบ "เปิดตัว" และผู้ใช้จริงเริ่มใช้งาน |
| `Pre-Launch Checklist` | รายการตรวจสอบก่อน go-live |
| `Demo Script` | แผนการนำเสนอระบบ — กำหนดลำดับและจุดสำคัญที่จะแสดง |
| `Stakeholder` | ผู้มีส่วนเกี่ยวข้อง เช่น ครู, ผู้ใช้งาน, ผู้บริหาร |
| `Post-Launch` | ช่วงหลัง go-live — monitor, fix bugs, รับ feedback |
