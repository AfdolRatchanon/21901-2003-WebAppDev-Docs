# Lab: Go-Live Simulation <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** จำลอง go-live process จริง — build production, ทดสอบ Full System checklist ครบทุก feature, และ demo ระบบต่อผู้ใช้จริง ถือเป็นบทสรุปของ wk1-8 ทั้งหมด

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ถึงเวลา "เปิดตัวระบบ" — Lab นี้จำลอง go-live process จริง: build production, ทดสอบ checklist สุดท้ายครบทุก feature และ demo ให้ผู้ใช้จริง (ครูและเพื่อน) ลองใช้งาน นี่คือขั้นตอนสุดท้ายของ wk1-8 ทั้งหมด
:::

> 💡 **เป้าหมาย Lab นี้:** ผ่าน pre-launch checklist ครบทุกข้อ และ demo ระบบสด ๆ ต่อหน้าผู้ใช้จริง

## 📖 I: Information

### ขั้นตอนที่ 1 — เตรียมความพร้อมขั้นสุดท้าย (Pre-Launch: TypeScript + Build)

นี่คือวินาทีสำคัญก่อนที่ผลงานตลอดหลายสัปดาห์จะถูกเปิดตัว! การทำ "Go-Live" ไม่มีความหมายแค่อัปโหลดไฟล์ขึ้นเซิร์ฟเวอร์ ทว่ามันคือการจำลองเหตุการณ์จริงว่าถ้าคนนับร้อยเข้ามาใช้งานพร้อมกัน ระบบของเราจะรับมือไหวหรือไม่ มีข้อบกพร่องหลุดรอดไปไหม และโค้ดที่เราเขียนมาลืมจุดไหนไปบ้าง

ด่านแรกสุดก่อนจะไปถึงกระบวนการนั้นคือการกำจัดข้อผิดพลาดของ TypeScript (Type Check) ให้เป็นพรีเมียมโค้ด จากนั้นแพ็คแปลงร่างมัน (Build) เพื่อให้พร้อมสำหรับการติดตั้งขึ้นเซิร์ฟเวอร์จริง:

```bash
# [1] เข้าไปใน project/frontend
cd project/frontend

# [2] ตรวจ TypeScript — ต้องได้ 0 errors ก่อน build เสมอ
npx tsc --noEmit

# [3] Build production — TypeScript + JSX → minified JavaScript
npm run build
# terminal จะแสดง bundle size:
# dist/index.html          1.xx kB
# dist/assets/index-[hash].css   xx kB │ gzip: xx kB
# dist/assets/index-[hash].js   xxx kB │ gzip: xxx kB

# [4] Preview production build ที่ port ต่างจาก dev
npm run preview
# เปิด http://localhost:4173 — ทดสอบ production mode โดยไม่ต้อง deploy จริง
```

**สรุป:** `tsc --noEmit` `[2]` → `npm run build` `[3]` → `npm run preview` `[4]` — ทำตามลำดับนี้เสมอก่อน deploy จริง

::: code-group
```bash [✅ ตรวจสอบ Backend ก่อน demo]
cd project/backend
npm run dev   # Backend รันที่ port 3000

# ทดสอบ API ด้วย curl:
curl http://localhost:3000/api/equipments
# ต้องได้: { "success": true, "data": [...] }

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.ac.th","password":"password123"}'
# ต้องได้: { "success": true, "data": { "token": "...", "user": {...} } }
```

```bash [💡 ถ้า build มี TypeScript error]
# รัน tsc --noEmit ก่อนเพื่อดู error รายละเอียด
npx tsc --noEmit

# Error ที่พบบ่อย:
# error TS2322: Type 'string | null' is not assignable to type 'string'
# → แก้: เพิ่ม null check หรือใช้ '!' assertion
# error TS2339: Property 'xxx' does not exist on type 'Equipment'
# → แก้: เพิ่ม field ใน types/index.ts

# ต้องแก้ให้ครบก่อน — อย่า ignore TypeScript errors
```
:::

### ขั้นตอนที่ 2 — Full System Test Checklist

ทดสอบทุกข้อก่อน demo — ทำเครื่องหมาย ✅ เมื่อผ่าน:

| Test | สิ่งที่ตรวจสอบ | ผล |
| :--- | :--- | :--- |
| Login ทุก role | admin/teacher/student เข้าได้ทุกบัญชี | ⬜ |
| Navbar แสดงถูกต้อง | ชื่อ + role badge สีถูกต้อง + เมนูตาม role | ⬜ |
| รายการอุปกรณ์ | โหลดจาก Backend จริง — แสดงครบ | ⬜ |
| ยืม/คืนอุปกรณ์ | flow ทำงานถูกต้อง — สถานะเปลี่ยน | ⬜ |
| Real-time | 2 tab เห็นการเปลี่ยนแปลงพร้อมกันทันที | ⬜ |
| Admin CRUD | เพิ่ม/ลบอุปกรณ์ได้ — แสดงใน stats cards | ⬜ |
| 403 Page | student เข้า /admin → เห็น 403 Forbidden | ⬜ |
| Error handling | ปิด Backend → เห็น error message (ไม่ crash) | ⬜ |
| Responsive | ทำงานได้ทั้งมือถือและ desktop | ⬜ |
| Persist login | F5 Refresh → ยังอยู่ใน session | ⬜ |

**เกณฑ์ผ่าน:** ✅ ≥ 8/10 ข้อ ก่อนเริ่ม demo

### ขั้นตอนที่ 3 — Demo Script

```markdown
## Demo Script: ระบบเบิก-จ่ายอุปกรณ์ไอที — 7 นาที

### [0:00-1:00] แนะนำระบบ
"ระบบนี้แทนการบันทึกกระดาษแบบเดิม ทุกคนเห็นสถานะอุปกรณ์ real-time พร้อมกัน"
- ชี้หน้า Login → อธิบายว่ามี 3 role: admin, teacher, student
- บอก tech stack ที่ใช้: React + TypeScript + Node.js + MySQL + Socket.io

### [1:00-2:00] Demo Login
- Login เป็น student → Navbar แสดงชื่อ + badge "นักเรียน" สีเขียว
- ชี้ connection indicator "● เชื่อมต่อแล้ว (Real-time)"
- ชี้ว่าเมนู "จัดการ" ไม่แสดงสำหรับ student

### [2:00-4:00] Demo ยืมอุปกรณ์ (Real-time)
- เปิด Browser tab ที่ 2 — Login เป็น student คนละคน
- Tab 1: กดยืม MacBook Pro → กรอก purpose + วันคืน → ยืนยัน
- Tab 2: การ์ดต้องเปลี่ยนสีเป็นแดงทันที — ไม่ต้อง refresh!
- อธิบาย: "นี่คือ WebSocket — Server push ข้อมูลหาทุก Client พร้อมกัน"

### [4:00-6:00] Demo Admin
- Login ใหม่เป็น admin → เห็นเมนู "จัดการ" เพิ่มขึ้น
- เข้าหน้า /admin → แสดง Stats cards (ทั้งหมด/ว่าง/ถูกยืม/ซ่อม)
- เพิ่มอุปกรณ์ใหม่ → ปรากฏในตารางทันที

### [6:00-7:00] Q&A + Feedback
- ถามผู้ใช้: "มีอะไรที่อยากให้ปรับปรุง?"
- บันทึก feedback ในโน้ต
```

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง pre-launch checklist สำหรับเว็บแอปพลิเคชัน React + Node.js ก่อน go-live รวมถึง: TypeScript type checking, production build verification, API endpoint testing, security checklist (JWT secret, CORS, env vars) และ demo script สำหรับนำเสนอ 7 นาทีต่อผู้ใช้จริง — อธิบายทำไม 0 TypeScript errors ถึงสำคัญก่อน deploy"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] `npx tsc --noEmit` ผ่าน 0 errors และ `npm run build` สำเร็จ
- [ ] Full System Test ผ่านอย่างน้อย 8/10 ข้อก่อนเริ่ม demo
:::

### 📝 PjBL Lab — ชิ้นงาน: `dist/` + Full System Test Report

**เป้าหมาย:** ผ่าน pre-launch checklist ครบ และ demo ระบบสด

#### ขั้น 0 — Student Identity

ตรวจสอบว่า `<footer>` ชื่อ-รหัสยังอยู่ใน EquipmentPage หรือ AdminPage ✅

#### ขั้น 1 — Build & Verify (30 นาที)

```bash
cd project/frontend

# ขั้นตอนต้องทำตามลำดับ:
npx tsc --noEmit   # ✅ 0 errors
npm run build      # ✅ build สำเร็จ
npm run preview    # ✅ localhost:4173 ทำงาน
```

- [ ] `npx tsc --noEmit` — 0 errors (ถ้ามี error: แก้ให้ครบก่อน) ✅
- [ ] `npm run build` — สำเร็จ บันทึก bundle size: _____ kB ✅
- [ ] `npm run preview` — เปิดใน browser ทำงานปกติ ✅

#### ขั้น 2 — Full System Test (20 นาที)

ทดสอบทุกข้อจากตารางด้านบน:
- [ ] Login ทุก role (admin/teacher/student) — badge + menu ถูกต้อง ✅
- [ ] Real-time: เปิด 2 tab → ยืมจาก tab 1 → tab 2 เห็นทันที ✅
- [ ] 403: student พิมพ์ URL /admin ตรง → เห็น 403 ✅
- [ ] Error: ปิด Backend → เห็น error message ✅
- [ ] F5 Refresh ขณะ login → ยังอยู่ใน session ✅

สำหรับข้อที่ ❌: บันทึก bug + reproduce steps

#### ขั้น 3 — Demo Presentation (15 นาที)

- [ ] เตรียม browser: Login ด้วย student account + เปิด 2 tab
- [ ] นำเสนอตาม Demo Script (7 นาที)
- [ ] Demo real-time บน 2 browser tab พร้อมกัน
- [ ] รับ feedback จากผู้ชม + บันทึก

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย screenshot: Navbar 3 role, หน้า 403, Real-time 2 tab
- [ ] ถ่าย screenshot: terminal แสดง bundle size หลัง build
- [ ] `git commit -m "wk8: go-live simulation - all tests pass, demo complete"`
- [ ] `git push origin main`
- [ ] เขียนสรุปใน Google Doc:
  - ผล Full System Test (ผ่านกี่ข้อ)
  - Bug ที่พบและวิธีแก้
  - บทเรียน 3 ข้อที่ได้จากโปรเจกต์ทั้งหมด wk1-8
  - ลิงก์ GitHub + screenshots ครบ

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม TypeScript 0 errors ถึงสำคัญก่อน deploy?
**แนวคำตอบ:** TypeScript errors หมายถึง bug ที่ compiler ตรวจเจอแล้ว — ถ้า deploy ทั้งที่มี error อาจเกิด runtime error ในหน้า Production ที่ผู้ใช้จริงใช้งาน เช่น `cannot read properties of null` ที่อาจเกิดกับผู้ใช้บางคนเท่านั้น debug ยากมาก การแก้ TypeScript errors ก่อน deploy เป็น "safety net" ชั้นแรก
:::

::: details ❓ ทำไม Demo Script ถึงสำคัญเท่า ๆ กับ Code?
**แนวคำตอบ:** ระบบที่ดีแต่นำเสนอไม่ดีจะไม่ได้รับการยอมรับ Demo Script ช่วยให้เห็น Value ของระบบอย่างชัดเจนภายในเวลาจำกัด — ลำดับสำคัญ: เริ่มด้วย "ปัญหาที่แก้" → แสดง feature ที่ wow → จบด้วย Q&A ในโลกจริง Demo ต่อ stakeholder บางครั้งสำคัญกว่า code quality เสียด้วยซ้ำ
:::

::: details ❓ Full System Test ควรทำก่อนหรือหลัง `npm run build`?
**แนวคำตอบ:** ควรทำ **สองครั้ง**: 1) ก่อน build — ใช้ `npm run dev` ทดสอบ feature ทุกอย่างทำงานถูกต้อง 2) หลัง build — ใช้ `npm run preview` ทดสอบอีกครั้งใน production mode เพราะบางครั้ง feature ทำงานได้ใน dev แต่พังใน production (เช่น env var ไม่ถูกตั้ง, proxy ไม่ทำงาน)
:::

::: details ❓ ถ้า Full System Test พบ bug ก่อน demo — ควรทำอย่างไร?
**แนวคำตอบ:** ประเมินก่อน: 1) **Critical bug** (login ไม่ได้, crash) → แก้ก่อน demo เสมอ 2) **Minor bug** (UI ผิดเล็กน้อย, บาง edge case) → demo ได้ แต่แจ้ง reviewer ตรง ๆ และบันทึกใน report — การซ่อน bug ไม่ใช่วิธีที่ดี บอกตรง ๆ + มีแผนแก้ไขแสดงให้เห็น maturity ของ developer
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `npm run preview` แล้ว API ไม่ทำงาน | proxy ไม่ทำงานใน production mode | ตั้ง `VITE_API_URL=http://localhost:3000` ก่อน preview |
| Real-time ไม่ sync ใน 2 tab | Backend Socket.io ไม่ emit หรือ Frontend ไม่ join room | ตรวจ Network tab → WS → ดู messages ที่รับ |
| TypeScript errors ตอน build | มี type mismatch ที่ dev mode ไม่แจ้ง | รัน `npx tsc --noEmit` ก่อน build เสมอ |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Build ผ่าน | 0 TypeScript errors + build สำเร็จ | มี warning แต่ build ผ่าน | build ไม่ผ่าน |
| Full System Test | ผ่าน ≥ 8/10 + บันทึก bug ครบ | ผ่าน 5-7/10 | < 5/10 |
| Demo | นำเสนอได้ครบตาม script + demo real-time | นำเสนอได้บางส่วน | ไม่ได้ demo |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Go-Live` | โก-ไลฟ์ | วันที่ระบบ "เปิดตัว" และผู้ใช้จริงเริ่มใช้งาน |
| `GitHub Actions` | กิ๊ต-ฮับ แอค-ชันส์ | เครื่องมือ CI/CD ของ GitHub สำหรับ deploy อัตโนมัติ |
| `Pre-Launch Checklist` | พรี-ลอนช์ เชค-ลิสท์ | รายการตรวจสอบก่อน go-live — ทำทีละข้อตามลำดับ |
| `Demo Script` | ดี-โม สคริปท์ | แผนการนำเสนอระบบ — กำหนดลำดับและจุดสำคัญที่จะแสดง |
| `Stakeholder` | สเตค-โฮล-เดอร์ | ผู้มีส่วนเกี่ยวข้อง เช่น ครู, ผู้ใช้งาน, ผู้บริหาร |
| `Post-Launch` | โพสท์-ลอนช์ | ช่วงหลัง go-live — monitor, fix bugs, รับ feedback |
| `npx tsc --noEmit` | รัน TypeScript compiler ตรวจ type โดยไม่สร้างไฟล์ output |
| `npm run preview` | รัน production build locally — จำลอง production environment |
| `Bundle Size` | บัน-เดิล ไซส์ | ขนาดไฟล์ JavaScript/CSS หลัง build — ยิ่งเล็กยิ่งโหลดเร็ว |
