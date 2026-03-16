# ติดต่อ API ด้วย Axios <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ใน wk2-3 ใช้ Mock Data ที่อยู่ใน Browser ของแต่ละคน — ถ้านักเรียนคนหนึ่งยืมอุปกรณ์ นักเรียนคนอื่นจะยังเห็นสถานะว่าง เพราะข้อมูลไม่ได้แชร์กัน ต้องดึงข้อมูลจาก **Backend API** ที่ใช้ร่วมกันแทน — และต้องส่ง JWT Token ทุก request ด้วยเพื่อแสดงตัวตน
:::

> 💡 **เปรียบเทียบ:** Axios เหมือน "บริการส่งสาร" — เราส่งจดหมาย (Request) พร้อมบัตรประชาชน (Token) ให้บริการส่ง (Axios) นำไปมอบให้ Server แล้วนำคำตอบ (Response) กลับมา โดยไม่ต้องกังวลเรื่องทาง

---

## 📖 I: Information

### ขั้นตอนที่ 1 — เปลี่ยนจาก Mock Data สู่ API จริงด้วย Axios

จากสัปดาห์ก่อน ๆ ที่เราใช้ `Mock Data` จำลองข้อมูลขึ้นมาให้พอเห็นภาพการทำงานของ UI เท่านั้น แต่ในระบบจริงข้อมูลเหล่านี้จะต้องดึงมาจากฐานข้อมูล (Database) ผ่าน **API (Application Programming Interface)** ซึ่งเป็นเหมือนคนกลางที่คอยรับส่งข้อมูลระหว่างหน้าเว็บของเรา (Frontend) กับเซิร์ฟเวอร์ (Backend) 

ในการดึงข้อมูลจาก API เราจะใช้ไลบรารียอดนิยมที่ชื่อว่า **Axios** แทนฟังก์ชัน `fetch` แบบดั้งเดิมของเบราว์เซอร์ เนื่องจาก Axios ใช้งานง่ายกว่า จัดการข้อผิดพลาด (Error Handling) ได้ดีกว่า และมีฟีเจอร์อย่าง Interceptors ที่ช่วยสกัดกั้นก่อนข้ามไปมาระหว่างส่ง-รับข้อมูลได้ (เช่น การแนบ Token ยืนยันตัวตนอัตโนมัติ)

ก่อนอื่นเราต้องติดตั้ง Axios ลงในโปรเจกต์ของเรา:

::: code-group
```bash [ติดตั้ง]
# [1] ติดตั้ง Axios
npm install axios
```

```ts [src/api/config.ts ✅]
import axios from 'axios'

// [1] API_BASE_URL — ว่างในช่วง development เพราะ Vite proxy จัดการให้
//     Production: ใส่ VITE_API_URL=https://api.example.com ใน .env
export const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? ''

// [2] apiClient — Axios instance ที่ตั้งค่าไว้ล่วงหน้า
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// [3] Request interceptor — แนบ JWT token ทุก request อัตโนมัติ
//     ทำงานก่อน request ออกจาก Browser ทุกครั้ง
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// [4] Response interceptor — จัดการ 401 Unauthorized อัตโนมัติ
//     ถ้า server ตอบ 401 → ลบ token เก่า → redirect ไป /login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

```ts [vite.config.ts — Vite Proxy 💡]
// [5] Vite proxy — forward request ที่ขึ้นต้นด้วย /api ไปหา Backend
//     ทำงานเฉพาะใน development (npm run dev)
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Backend address
        changeOrigin: true,
      },
    },
  },
})
// ผลคือ: GET /api/equipments → ส่งต่อไป http://localhost:3000/api/equipments
// โดย Frontend code ไม่รู้เรื่อง port ของ Backend เลย
```
:::

**สรุป:** `apiClient` ตั้งค่าครั้งเดียว — ทุก request หลังจากนี้มี token และ error handling อัตโนมัติ ✅

---

### ขั้นตอนที่ 2 — สร้าง equipmentApi.ts

แยกฟังก์ชัน API ออกมาเป็นไฟล์เดียว ไม่เขียน axios ปนใน Component:

::: code-group
```ts [src/api/equipmentApi.ts ✅]
import { apiClient } from './config'
import type { Equipment, ApiResponse, EquipmentFormData } from '../types'

const ENDPOINT = '/api/equipments'

// [1] GET /api/equipments — ดึงรายการอุปกรณ์ทั้งหมด
//     Generic type: <ApiResponse<Equipment[]>> บอก TypeScript ว่า res.data มีรูปแบบนี้
export async function getEquipments(): Promise<Equipment[]> {
  const res = await apiClient.get<ApiResponse<Equipment[]>>(ENDPOINT)
  return res.data.data  // [2] unwrap: { success, data: [...] } → [...]
}

// [3] POST /api/equipments — เพิ่มอุปกรณ์ใหม่
export async function createEquipment(
  payload: EquipmentFormData  // [4] TypeScript ตรวจสอบ payload ที่ส่งไป
): Promise<Equipment> {
  const res = await apiClient.post<ApiResponse<Equipment>>(ENDPOINT, payload)
  return res.data.data
}

// [5] PATCH /api/equipments/:id — อัปเดตสถานะ
export async function updateEquipmentStatus(
  id: number,
  status: Equipment['status'],  // [6] Indexed Access Type
  borrowedBy?: string
): Promise<Equipment> {
  const res = await apiClient.patch<ApiResponse<Equipment>>(
    `${ENDPOINT}/${id}`,
    { status, borrowedBy: borrowedBy ?? null }
  )
  return res.data.data
}

// [7] DELETE /api/equipments/:id — ลบอุปกรณ์
export async function deleteEquipment(id: number): Promise<void> {
  await apiClient.delete(`${ENDPOINT}/${id}`)
}
```

```ts [❌ เขียน axios ตรงใน Component — ไม่แนะนำ]
const res = await axios.get('http://localhost:3000/api/equipments', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
// ❌ URL hardcode + token handling ซ้ำทุกที่
// ❌ TypeScript ไม่รู้ type ของ response
```

```ts [💡 ทำไมต้อง unwrap res.data.data 2 ชั้น]
// Backend ตอบ: { "success": true, "data": [ {...}, ... ] }
// res.data        = { success: true, data: [...] }  ← ApiResponse<Equipment[]>
// res.data.data   = [ { id: 1, ... }, ... ]          ← Equipment[]
//
// Generic type ช่วย: apiClient.get<ApiResponse<Equipment[]>>
// → TypeScript รู้ว่า res.data.data เป็น Equipment[] ไม่ใช่ any
```
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ช่วยสร้าง Axios API client configuration ที่: 1) สร้าง instance ด้วย `axios.create()` 2) มี request interceptor แนบ JWT token จาก localStorage ทุก request 3) มี response interceptor จัดการ 401 → ลบ token + redirect `/login` 4) แยก API functions ออกเป็นไฟล์ `equipmentApi.ts` ที่มี `getEquipments()` คืน `Promise<Equipment[]>` และใช้ Generic type `ApiResponse<T>`"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: ติดตั้ง Axios + สร้าง config (10 นาที)**

- [ ] รัน `npm install axios` ในโปรเจกต์
- [ ] สร้างโฟลเดอร์ `src/api/`
- [ ] สร้าง `src/api/config.ts` ด้วย `axios.create()` + `baseURL: import.meta.env.VITE_API_URL ?? ''`
- [ ] เพิ่ม request interceptor แนบ `Authorization: Bearer <token>` จาก localStorage
- [ ] เพิ่ม response interceptor จัดการ 401 → `localStorage.removeItem('token')` + redirect

**ขั้น 2: สร้าง equipmentApi.ts (10 นาที)**

- [ ] สร้าง `src/api/equipmentApi.ts`
- [ ] เขียน `getEquipments(): Promise<Equipment[]>` ใช้ `apiClient.get<ApiResponse<Equipment[]>>(ENDPOINT)`
- [ ] return `res.data.data` (unwrap 2 ชั้น)
- [ ] เขียน `updateEquipmentStatus(id, status, borrowedBy?)` ใช้ `apiClient.patch`
- [ ] ทดสอบ: call `getEquipments()` ใน console → ต้องเห็น Equipment array ✅

**ขั้น 3: ตรวจสอบ Network (5 นาที)**

- [ ] เปิด `vite.config.ts` → ตรวจสอบ proxy `/api` → `http://localhost:3000`
- [ ] รัน Backend (`cd project/backend && npm run dev`)
- [ ] เปิด Network tab ใน DevTools → ต้องเห็น GET `/api/equipments` ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk4: add Axios API client and equipmentApi functions"` → `git push`
- [ ] เขียนสรุปใน Google Doc: Interceptor ทำงานยังไง, `res.data.data` คืออะไร, Vite proxy ทำงานยังไง พร้อม screenshot Network tab

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องสร้าง Axios instance แทนที่จะใช้ `axios.get()` ตรงๆ?
**แนวคำตอบ:** `axios.create()` สร้าง instance ที่ตั้งค่าพร้อม — baseURL, headers, interceptors — ทุก request ที่ใช้ instance นี้จะได้รับ config เหล่านั้นอัตโนมัติ ไม่ต้องระบุซ้ำทุกครั้ง ยังสร้างหลาย instance ได้ เช่น internal API กับ external service ที่ใช้ config ต่างกัน
:::

::: details ❓ Interceptor ทำงานอย่างไร — ต่างจาก middleware ยังไง?
**แนวคำตอบ:** Interceptor ของ Axios อยู่ฝั่ง Client — ทำงานก่อน request ออกจาก Browser (request interceptor) หรือหลัง response เข้ามา (response interceptor) เหมาะกับ cross-cutting concerns เช่น token หรือ handle 401 ส่วน middleware อยู่ฝั่ง Server — ทำงานก่อน request ถึง handler ทั้งคู่เป็น "ตัวกั้นกลาง" แต่คนละฝั่ง
:::

::: details ❓ ทำไม `baseURL` เป็น `''` (string ว่าง) ในช่วง development?
**แนวคำตอบ:** Vite มี proxy ที่ config ไว้ใน `vite.config.ts` — เมื่อ request ไปที่ `/api/...` Vite จะ forward ไปที่ `http://localhost:3000` อัตโนมัติ Frontend code ไม่ต้อง hardcode port ของ Backend เลย เมื่อ deploy จริง เปลี่ยนแค่ environment variable `VITE_API_URL`
:::

::: details ❓ `apiClient.get<ApiResponse<Equipment[]>>(url)` Generic Type ช่วยอะไร?
**แนวคำตอบ:** Generic Type บอก TypeScript ว่า `res.data` มีรูปแบบ `ApiResponse<Equipment[]>` ทำให้ `res.data.data` เป็น `Equipment[]` โดยอัตโนมัติ ถ้าไม่ใส่ Generic Axios คืน `any` ซึ่ง auto-complete ไม่ทำงานและพิมพ์ field ผิดก็ไม่ Error ตอน compile
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Axios config | interceptors ทั้ง 2 ทำงาน, Generic types ถูก | มี config แต่ขาด interceptor | ไม่มี config |
| equipmentApi.ts | ฟังก์ชันครบ, unwrap res.data.data ถูก | มีบางฟังก์ชัน | ใช้ mock data ต่อ |
| ดึง API จริงได้ | เห็นข้อมูลจาก backend ใน Network tab | ดึงได้แต่ TypeScript error | ยังใช้ mock data |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Axios` | HTTP Client Library สำหรับ JavaScript/TypeScript — ดีกว่า fetch ในเรื่อง error handling |
| `Interceptor` | ฟังก์ชันที่รัน "ระหว่างทาง" ก่อน request ออกหรือหลัง response เข้า |
| `Bearer Token` | รูปแบบ Authorization header: `Authorization: Bearer <jwt_token>` |
| `Proxy` | ตัวกลาง forward request จาก Vite dev server ไป Backend อัตโนมัติ |
| `Unwrap` | การดึงข้อมูลจริงออกจาก wrapper (`res.data.data` ออกจาก `ApiResponse`) |
| `Indexed Access Type` | `Equipment['status']` — ดึง type ของ field `status` ออกมาใช้ |
