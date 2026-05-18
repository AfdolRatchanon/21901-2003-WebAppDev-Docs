# Project Defense: นำเสนอโปรเจกต์ <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เตรียมนำเสนอโปรเจกต์ต่อกรรมการ — ซ้อม demo 15 นาที, เตรียมตอบคำถามเชิง technical จาก code จริง, และสรุปสิ่งที่เรียนรู้ตลอด 9 สัปดาห์

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
โปรเจกต์ระบบเบิก-จ่ายอุปกรณ์เสร็จแล้ว — ถึงเวลา "นำเสนอ" ต่อกรรมการ นักเรียนต้องอธิบายได้ว่า "ทำอะไร ทำไม และทำอย่างไร" ไม่ใช่แค่ demo ว่าใช้งานได้ กรรมการจะถามคำถาม — ต้องตอบจากความเข้าใจ ไม่ใช่ท่องจำ
:::

> 💡 **Project Defense** คือการพิสูจน์ว่าเราเข้าใจ code ที่เขียน — ตอบคำถามได้ ชี้ bug ได้ และอธิบาย design decision ได้

## 📖 I: Information

### ขั้นตอนที่ 1 — ปูโครงสร้างและจังหวะการนำเสนอ 15 นาที

การทำ Project Defense (สอบป้องกันโปรเจกต์) คือการลุกขึ้นยืนยันว่าผลงานที่เราสร้างขึ้นมานั้น "เป็นฝีมือเราจริง" และ "เราเข้าใจโครงสร้างทุกฟันเฟืองที่มันขับเคลื่อนอยู่" ต่อหน้าคณะกรรมการ

ความท้าทายของการนำเสนอประเภทนี้คือ "เวลาที่มีจำกัด" เราจึงต้องจัดสรรสัดส่วนให้สมดุลเพื่อดึงดูดความสนใจและตัดทอนสิ่งที่ไม่สำคัญออกไปให้หมด ในเวลาเพียง 15 นาทีนี้ ทุกคำพูดและทุกการกระทำจะต้องสะท้อนความสามารถของเราออกมาให้เต็มที่ที่สุด:

| ช่วง | เวลา | เนื้อหา |
| :--- | :--- | :--- |
| เปิดตัวโปรเจกต์ | 2 นาที | ปัญหาคืออะไร ทำไมต้องมีระบบนี้ |
| Demo ระบบ | 5 นาที | Live demo ครบทุก feature ตาม script |
| Technical Stack | 3 นาที | เทคโนโลยีที่ใช้และทำไมเลือกตัวนั้น |
| ความท้าทาย | 3 นาที | ปัญหาที่พบและวิธีแก้ — บทเรียนที่ได้ |
| Q&A | 2 นาที | ตอบคำถามกรรมการ |

**Opening Statement ตัวอย่าง:**
```markdown
"ระบบเบิก-จ่ายอุปกรณ์ไอทีนี้แก้ปัญหาการบันทึกกระดาษที่ใช้เวลานาน
และไม่รู้สถานะ real-time — พัฒนาด้วย React + TypeScript + Node.js + Socket.io
ระยะเวลา 9 สัปดาห์ ตั้งแต่ wk1 ถึง wk8"
```

### ขั้นตอนที่ 2 — Demo Checklist

ทำตามลำดับนี้ระหว่าง Demo:

- [ ] เปิดหน้าเว็บ — แสดงหน้า Login (อธิบาย: "ระบบมี authentication ด้วย JWT")
- [ ] Login เป็น admin — แสดง Navbar + role badge สีม่วง + เมนู "จัดการ"
- [ ] Login เป็น student — badge สีเขียว + ไม่เห็นเมนู "จัดการ"
- [ ] เปิด 2 browser tab พร้อมกัน
- [ ] ยืมอุปกรณ์ใน tab 1 → tab 2 เห็นสีเปลี่ยนทันที (อธิบาย Socket.io)
- [ ] Login เป็น student → พิมพ์ `/admin` ตรง → เห็น 403 Forbidden
- [ ] Login เป็น admin → Admin Page: stats cards + เพิ่มอุปกรณ์ใหม่
- [ ] เปิด DevTools Network tab — แสดง API calls + Authorization header

### ขั้นตอนที่ 3 — คำถามที่กรรมการมักถาม

::: details ❓ ทำไมเลือกใช้ React แทน Vue หรือ Angular?
**แนวคำตอบ:** React มี community ใหญ่ที่สุด, ecosystem ครบ (Router, State management, Testing), TypeScript support ดี ที่สำคัญ React เป็น Library ไม่ใช่ Framework ทำให้ยืดหยุ่นและเลือก tool ได้ตามต้องการ นอกจากนี้ React เป็นที่ต้องการสูงมากในตลาดแรงงาน Frontend Developer
:::

::: details ❓ JWT ปลอดภัยไหม? จะทำให้ปลอดภัยขึ้นได้อย่างไร?
**แนวคำตอบ:** JWT ที่เก็บใน localStorage มีความเสี่ยง XSS (Cross-Site Scripting) — ถ้า attacker inject script ได้ก็อ่าน token ได้ ระบบ production ควรเปลี่ยนเป็น HttpOnly Cookie (JS อ่านไม่ได้), ตั้ง expiry สั้น (15 นาที-1 ชั่วโมง), ใช้ Refresh Token pattern และตั้ง HTTPS เสมอ สำหรับโปรเจกต์เรียน localStorage ยอมรับได้
:::

::: details ❓ ถ้า Backend ล่ม ระบบ Frontend จะเกิดอะไรขึ้น?
**แนวคำตอบ:** 1) `useEquipments` catch error → แสดง "ไม่สามารถโหลดข้อมูลได้" (ไม่ crash) 2) Axios interceptor รับ 401 → redirect ไป /login 3) Socket.io `disconnect` event → `isConnected` = false → indicator แสดง "ออฟไลน์" 4) Network หาย → axios request timeout → catch error → error message ระบบไม่พัง เพราะมี error handling ทุก layer
:::

::: details ❓ อธิบาย real-time ทำงานอย่างไร?
**แนวคำตอบ:** ใช้ Socket.io บน WebSocket — Frontend เชื่อมต่อผ่าน `io({ path: '/socket.io' })` และเข้า room "equipment-updates" ทุกครั้งที่มีการยืม/คืน Backend update DB แล้ว `socket.emit('equipmentStatusChanged', payload)` ไปยังทุก client ใน room Frontend รับ event → `handleRealtimeChange` → `setEquipments(prev => prev.map(...))` อัปเดตเฉพาะ item ที่เปลี่ยน — ไม่ต้อง fetch ใหม่ทั้งหมด
:::

::: details ❓ TypeScript ช่วยอะไรในโปรเจกต์นี้บ้าง?
**แนวคำตอบ:** 1) `Equipment` interface ป้องกันส่งข้อมูลผิด field 2) `EquipmentStatus = 'available' | 'borrowed' | 'maintenance'` ป้องกัน typo ใน status 3) `ApiResponse<T>` Generic ทำให้ `res.data.data` มี type ถูกต้อง — `data.name` auto-complete 4) `UserRole` ป้องกัน role ผิด 5) สรุป: bug จาก type mismatch เจอตอน compile ไม่ใช่ตอน runtime ต่อหน้าผู้ใช้
:::

### สิ่งที่ต้องเตรียมก่อน Defense

```markdown
## เอกสาร
- [ ] README.md: วิธีรัน Frontend + Backend ครบถ้วน
- [ ] ลิงก์ GitHub repository
- [ ] screenshots ครบ wk1-8

## Code
- [ ] clean code — ไม่มี console.log ที่ไม่จำเป็น
- [ ] ไม่มี hardcode credentials ใน code
- [ ] npx tsc --noEmit → 0 errors
- [ ] footer ชื่อ-รหัสยังอยู่ครบทุกหน้า

## Demo Environment
- [ ] Backend รันอยู่ที่ port 3000
- [ ] Database มีข้อมูล seed แล้ว (admin/teacher/student accounts)
- [ ] Browser พร้อม — ปิด extension ที่รบกวน
- [ ] เปิด 2 tab ไว้ล่วงหน้า (tab 1: admin, tab 2: student)
- [ ] DevTools เปิดไว้ที่ Network tab
```

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"ต้องนำเสนอโปรเจกต์เว็บแอปพลิเคชัน React + TypeScript + Node.js + Socket.io ต่อกรรมการ 15 นาที ช่วยสร้างโครงร่างการนำเสนอที่ครอบคลุม: แรงจูงใจ, live demo, technical stack, ปัญหาที่พบ และเตรียมตอบคำถามเกี่ยวกับ JWT security, real-time, TypeScript benefits และการเลือก React — ให้คำแนะนำการซ้อม demo ด้วย"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] ซ้อม demo ครบ 3 รอบ ทำได้ภายใน 5 นาทีโดยไม่ดูโน้ต
- [ ] ตอบคำถาม 5 ข้อในขั้นตอนที่ 3 ได้โดยไม่ดูเฉลย
:::

### 📝 PjBL Lab — ชิ้นงาน: `README.md` + Demo Video/Screenshot

**เป้าหมาย:** ซ้อมให้พร้อม — demo ใน 5 นาที และตอบคำถามได้ทุกข้อ

#### ขั้น 0 — Student Identity

ตรวจสอบว่า `<footer>` ชื่อ-รหัสยังอยู่ใน EquipmentPage ✅
ตรวจสอบ GitHub repository — ชื่อ, description, README ✅

#### ขั้น 1 — เตรียม Demo (30 นาที)

- [ ] ซ้อม demo ตาม checklist ขั้นตอนที่ 2 → ทำให้ได้ภายใน 5 นาที (ซ้อม 3 รอบ)
- [ ] ซ้อม "Opening Statement" ภาษาธรรมชาติ — อย่าอ่านจากโน้ต
- [ ] ทดสอบ real-time 2 tab ทำงานได้จริงก่อน demo

#### ขั้น 2 — เตรียมคำถาม (30 นาที)

- [ ] อ่านคำถาม 5 ข้อในขั้นตอนที่ 3 — ตอบออกมาดัง ๆ โดยไม่ดูคำตอบ
- [ ] ดู source code จริง: `useAuth.ts`, `ProtectedRoute.tsx`, `useEquipmentRealtime.ts` — เข้าใจทุกบรรทัด
- [ ] เตรียม "ปัญหาที่พบ 3 ข้อ" และวิธีแก้สั้น ๆ

#### ขั้น 3 — Peer Review (15 นาที)

- [ ] ให้เพื่อนถามคำถามแบบกรรมการ (ใช้คำถามจากขั้นตอนที่ 3)
- [ ] จดบันทึกคำถามที่ตอบไม่ได้ → ไปศึกษาเพิ่มก่อน Defense

#### ขั้น Submit — ส่งงาน

- [ ] Push code ล่าสุด + README ครบถ้วน: `git push origin main`
- [ ] ตรวจ `npx tsc --noEmit` → 0 errors
- [ ] ส่งลิงก์ GitHub + Google Doc สรุปโปรเจกต์ทั้ง wk1-8 ให้ครู

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องซ้อม demo ก่อน — ไม่ใช่แค่ทำตาม checklist วันจริง?
**แนวคำตอบ:** การซ้อม 3 รอบทำให้: 1) จับ bug ที่ไม่คาดว่าจะเจอระหว่าง demo 2) จับจังหวะเวลาได้แม่นยำ — 5 นาทีเร็วมาก 3) ลดความประหม่า — กล้าพูดโดยไม่ต้องคิดขั้นตอนถัดไป 4) พบว่าต้องเตรียม environment อะไรเพิ่ม เช่น tab, login state, seed data
:::

::: details ❓ ถ้ากรรมการถามคำถามที่ไม่รู้คำตอบ — ควรทำอย่างไร?
**แนวคำตอบ:** พูดตรง ๆ ว่า "ผมไม่แน่ใจในรายละเอียด แต่ผมเข้าใจว่า..." แล้วอธิบายสิ่งที่รู้ที่เกี่ยวข้อง — ดีกว่าเดา การยอมรับว่าไม่รู้และบอกว่าจะไปศึกษาเพิ่มแสดง maturity มากกว่าการพูดผิด ๆ กรรมการเข้าใจว่านักเรียนยังเรียนรู้อยู่
:::

::: details ❓ "Technical Stack" ต่างจาก "Feature" อย่างไร — ต้องอธิบายอะไรในส่วน Technical Stack?
**แนวคำตอบ:** Feature คือ "ระบบทำอะไรได้" (ยืม/คืน/real-time) — Technical Stack คือ "สร้างด้วยอะไรและทำไม" ตัวอย่าง: "ใช้ Socket.io แทน polling เพราะ Server push ข้อมูลได้ทันที ลด bandwidth", "ใช้ JWT เพราะ stateless — Backend ไม่ต้องเก็บ session", "ใช้ Axios interceptor เพื่อแนบ token ทุก request อัตโนมัติ" — ต้องบอกว่า "ทำไม" ไม่ใช่แค่ "อะไร"
:::

::: details ❓ "ความท้าทาย" ส่วนใดในโปรเจกต์ที่ควรพูดถึง?
**แนวคำตอบ:** เลือก 2-3 ปัญหาจริงที่เจอและแก้ได้ เช่น: 1) "useCallback กับ Socket.io — ไม่รู้ว่าทำไม reconnect ซ้ำ → เรียนรู้ว่า function reference เปลี่ยนทุก render → ใช้ useCallback แก้" 2) "Tailwind conflict ระหว่าง `flex` กับ `hidden` → เรียนรู้ CSS specificity" 3) "Lazy Initializer ใน useState → เรียนรู้ว่า localStorage ควรอ่านครั้งเดียว" — ปัญหาจริงแสดงว่าเข้าใจจริง
:::

### 📋 Rubric Project Defense (20 คะแนน)

| เกณฑ์ | ดีมาก (5) | พอใช้ (3) | ปรับปรุง (0-1) |
| :--- | :--- | :--- | :--- |
| Demo ครบถ้วน | ทุก feature ทำงาน ภายใน 5 นาที | บางส่วนขาด / เกินเวลา | Demo ไม่ได้ |
| อธิบาย Technical Stack | อธิบายพร้อมเหตุผล "ทำไม" | อธิบายได้แค่ "อะไร" | อธิบายไม่ได้ |
| ตอบคำถาม | ตอบได้ทุกคำถาม จากความเข้าใจ | ตอบได้บางส่วน | ตอบไม่ได้ |
| Code Quality | 0 TS errors + clean code | บาง warning | มี error |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Project Defense` | โพร-เจ็คท์ ดี-เฟนส์ | การนำเสนอและพิสูจน์ผลงาน ตอบคำถามกรรมการ |
| `Demo` | ดี-โม | การสาธิตการทำงานของระบบ live ต่อหน้าผู้ชม |
| `Technical Stack` | เทค-นิ-คัล สแต็ค | ชุดเทคโนโลยีที่ใช้ในโปรเจกต์ทั้งหมด |
| `Opening Statement` | โอ-เพน-นิง สเตท-เมนท์ | ประโยคเปิดนำเสนอ — บอก context และ purpose |
| `Stakeholder` | สเตค-โฮล-เดอร์ | ผู้มีส่วนเกี่ยวข้องกับโปรเจกต์ (ครู, ผู้ใช้, กรรมการ) |
| `README` | รีด-มี | ไฟล์เอกสารหลักของโปรเจกต์ บอกวิธีติดตั้งและใช้งาน |
| `Design Decision` | ดี-ไซน์ ดี-ซิ-ชัน | การตัดสินใจออกแบบ — อธิบายว่าทำไมถึงเลือกวิธีนั้น |
| `XSS` | เอ็กซ์-เอส-เอส | Cross-Site Scripting — การโจมตีโดย inject script เพื่อขโมยข้อมูล |
