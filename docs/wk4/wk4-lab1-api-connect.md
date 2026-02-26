# Lab: เชื่อมต่อ API จริง <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบที่สร้างใน wk1-3 ยังใช้ Mock Data — อุปกรณ์ที่แสดงอยู่ใน Browser ของนักเรียนแต่ละคนไม่เชื่อมกัน ต้องเปลี่ยนมาดึงข้อมูลจาก Backend จริงให้ทุกคนเห็นสถานะเดียวกัน!
:::

> 💡 **เป้าหมาย Lab นี้:** รวม wk4 ทั้งหมด — เปลี่ยนจาก `mockEquipments` → Backend API จริง พร้อม TypeScript types ครบ, Loading/Error state, และ Borrow/Return ผ่าน API

---

## 📖 I: Information

### ภาพรวม Data Flow

```
Browser (React)       Vite Dev Proxy        Backend (:3000)     MySQL
─────────────────     ──────────────────    ──────────────────  ──────
useEquipments()
 → getEquipments()
 → apiClient.get()
   "/api/equipments" ──▶ forward ──────────▶ GET handler ──────▶ SELECT
                                              ◀─ Equipment[] ◀── rows
 ◀── ApiResponse<Equipment[]> ◀─────────────
 res.data.data = Equipment[]
 setEquipments(data)
```

### สิ่งที่ต้องสร้างในสัปดาห์นี้

| ไฟล์ | ทำอะไร |
| :--- | :--- |
| `src/types/index.ts` | TypeScript interfaces ทั้งหมด |
| `src/api/config.ts` | Axios instance + interceptors |
| `src/api/equipmentApi.ts` | API functions (GET/POST/PATCH/DELETE) |
| `src/hooks/useEquipments.ts` | Hook ที่ใช้ API จริงแทน mock data |
| `src/pages/EquipmentPage.tsx` | แสดง Loading/Error/Empty state |

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript + Axios อยู่ ต้องการเชื่อมต่อ Frontend กับ Backend API ที่ port 3000 ให้ช่วยสร้าง: 1) `src/types/index.ts` — interfaces: Equipment, User, ApiResponse&lt;T&gt;, EquipmentFormData 2) `src/api/config.ts` — Axios instance พร้อม request interceptor (JWT token) + response interceptor (401 handler) 3) `src/api/equipmentApi.ts` — functions: getEquipments(), updateEquipmentStatus() 4) อัปเดต `useEquipments` hook ให้เรียก API จริง ด้วย try-catch-finally — Backend ส่ง `{ success: boolean, data: T }` เสมอ"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: เตรียม Backend (5 นาที)**

```bash
# Terminal 1 — รัน Backend
cd project/backend
npm install
npm run dev
# ✅ Server รันที่ http://localhost:3000
```

- [ ] เปิด browser ที่ `http://localhost:3000/api/equipments` → ต้องเห็น JSON `{ "success": true, "data": [...] }` ✅

**ขั้น 2: TypeScript Types + API Client (20 นาที)**

- [ ] สร้าง `src/types/index.ts` ตาม wk4-content3 (Entity types + ApiResponse&lt;T&gt; + Form types)
- [ ] สร้าง `src/api/config.ts` ตาม wk4-content1 (Axios instance + 2 interceptors)
- [ ] สร้าง `src/api/equipmentApi.ts` (getEquipments, updateEquipmentStatus อย่างน้อย)
- [ ] ตรวจสอบ `vite.config.ts` → ต้องมี proxy `/api` → `http://localhost:3000`

**ขั้น 3: อัปเดต useEquipments + EquipmentPage (15 นาที)**

- [ ] เปิด `useEquipments.ts` → ลบ mock data → import `getEquipments` จาก api
- [ ] ครอบด้วย `useCallback` + `try-catch-finally` ตาม wk4-content2
- [ ] เพิ่ม Loading/Error/Empty state ใน `EquipmentPage.tsx`
- [ ] ทดสอบ: รัน Frontend (`npm run dev`) → ต้องเห็นข้อมูลจาก Backend จริง ✅

**ขั้น 4: เชื่อม Borrow/Return กับ API (15 นาที)**

- [ ] เพิ่ม `handleBorrow` ใน `EquipmentPage.tsx` ที่เรียก `updateEquipmentStatus(id, 'borrowed', userName)`
- [ ] เพิ่ม `handleReturn` ที่เรียก `updateEquipmentStatus(id, 'available')`
- [ ] เรียก `refetch()` หลัง action สำเร็จ

**ขั้น 5: ทดสอบ Network tab (5 นาที)**

- [ ] เปิด DevTools → Network tab → filter "Fetch/XHR"
- [ ] โหลดหน้า → ต้องเห็น `GET /api/equipments` status 200 ✅
- [ ] กดยืมอุปกรณ์ → ต้องเห็น `PATCH /api/equipments/:id` ✅
- [ ] ปิด Backend → โหลดหน้า → ต้องเห็น error message ใน UI ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk4: connect real API, add TypeScript types, loading and error states"` → `git push`
- [ ] เขียนสรุปใน Google Doc: อธิบาย data flow จาก `useEquipments` ถึง MySQL, `res.data.data` ทำงานยังไง, ทำไม interceptor ต้องแนบ token ทุก request พร้อม screenshot Network tab + Loading state

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `res.data.data` ถึงมีสอง `.data`?
**แนวคำตอบ:** `res` คือ Axios response wrapper — `res.data` คือ HTTP response body ที่ Backend ส่งมา ซึ่งมีรูปแบบ `{ success: true, data: [...] }` (ApiResponse) ส่วน `res.data.data` คือ array ข้อมูลจริงใน field `data` ของ body จึงต้อง `.data` สองครั้ง — Axios ชั้นหนึ่ง, ApiResponse wrapper อีกชั้นหนึ่ง
:::

::: details ❓ Vite proxy ป้องกัน CORS ได้อย่างไร?
**แนวคำตอบ:** CORS error เกิดเมื่อ Browser ส่ง request จาก origin หนึ่ง (`localhost:5173`) ไปยังอีก origin (`localhost:3000`) โดยตรง Vite proxy ทำให้ request จาก Browser ไปที่ `localhost:5173/api/...` ก่อน แล้ว Vite Dev Server (ซึ่งไม่ใช่ Browser) ส่งต่อไป Backend — Server-to-Server request ไม่มี CORS ปัญหา
:::

::: details ❓ ทำไมต้อง `refetch()` หลัง borrow/return แทนที่จะ `setEquipments` โดยตรง?
**แนวคำตอบ:** `refetch()` ดึงข้อมูลใหม่จาก Backend เพื่อรับประกันว่า state ตรงกับ DB จริง ถ้าใช้ `setEquipments` อัปเดตโดยตรง (optimistic update) อาจไม่ sync — เช่น ถ้า Backend มี validation แล้ว reject แต่ Frontend อัปเดตไปแล้ว ข้อมูลจะผิด ใน wk7 จะใช้ Socket.io รับ event แบบ real-time แทน
:::

::: details ❓ เมื่อ Backend ไม่ตอบ axios throw error อะไร — ต่างจาก status 4xx/5xx อย่างไร?
**แนวคำตอบ:** Network error (backend ไม่รัน) — Axios throw `AxiosError` ที่ไม่มี `error.response` (undefined) ส่วน HTTP 4xx/5xx error — Axios throw `AxiosError` ที่มี `error.response.status` เป็นตัวเลข การ `catch` ทั่วไปจะดักจับทั้งสองกรณี แต่ถ้าต้องการแยกให้ตรวจ `error.response?.status`
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| API เชื่อมได้ | GET + PATCH ทำงาน เห็นใน Network tab | GET ได้แต่ PATCH ไม่ได้ | ยังใช้ mock data |
| Loading/Error UI | 3 states แสดงถูกต้องทุกกรณี | แสดงบางส่วน | ไม่มี state UI |
| TypeScript types | types/index.ts ครบ ไม่มี `any` | มีบางส่วน | ไม่มี types file |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `CRUD` | Create, Read, Update, Delete — 4 operations พื้นฐานของ API |
| `CORS` | Cross-Origin Resource Sharing — นโยบาย Browser จำกัด request ข้าม origin |
| `Network tab` | เครื่องมือใน DevTools แสดง HTTP requests และ response ทั้งหมด |
| `Status 200` | HTTP response code: สำเร็จ |
| `Status 401` | HTTP response code: Unauthorized — token ไม่ถูกต้อง/หมดอายุ |
| `Optimistic Update` | อัปเดต UI ก่อน รอ server confirm ทีหลัง — เร็วแต่เสี่ยง sync ผิด |
