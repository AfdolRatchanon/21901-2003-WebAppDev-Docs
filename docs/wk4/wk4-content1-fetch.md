# ติดต่อ API ด้วย Axios <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ใช้ Mock Data มาตั้งแต่ wk2 — ถ้านักเรียนคนหนึ่งยืมอุปกรณ์ นักเรียนคนอื่นจะยังเห็นสถานะเดิม เพราะข้อมูลอยู่ใน Browser ของแต่ละคน ต้องดึงข้อมูลจาก **Backend API** ที่ใช้ร่วมกันแทน!
:::

> 💡 **เปรียบเทียบ:** API เหมือน "เมนูร้านอาหาร" — เราเลือกสั่ง (Request) แล้วครัว (Server) ปรุงมาให้ (Response) เราไม่ต้องรู้ว่าครัวทำยังไง รู้แค่จะสั่งอะไร

---

## 📖 I: Information

ใช้ **Axios** เป็น HTTP Client ดีกว่า `fetch` ตรงที่ handle JSON อัตโนมัติ, มี interceptors และ error handling ที่ดีกว่า

::: code-group
```ts [api/config.ts]
import axios from 'axios'

// สร้าง Axios instance พร้อมตั้งค่าพื้นฐาน
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',  // '' = ใช้ Vite proxy
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor: แนบ JWT token ทุก request อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: จัดการ 401 Unauthorized → redirect ไป login
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

```ts [api/equipmentApi.ts]
import { apiClient } from './config'
import type { Equipment, ApiResponse, EquipmentFormData } from '../types'

const ENDPOINT = '/api/equipments'

// GET /api/equipments — ดึงรายการอุปกรณ์ทั้งหมด
export async function getEquipments(): Promise<Equipment[]> {
  const res = await apiClient.get<ApiResponse<Equipment[]>>(ENDPOINT)
  return res.data.data  // unwrap: { success, data: [...] } → [...]
}

// PATCH /api/equipments/:id — อัปเดตสถานะ
export async function updateEquipmentStatus(
  id: number,
  status: Equipment['status'],
  borrowedBy?: string
): Promise<Equipment> {
  const res = await apiClient.patch<ApiResponse<Equipment>>(
    `${ENDPOINT}/${id}`,
    { status, borrowedBy: borrowedBy ?? null }
  )
  return res.data.data
}
```
:::

::: tip 💡 TypeScript Tip — Generics กับ Axios
`apiClient.get<ApiResponse<Equipment[]>>(url)` บอก TypeScript ว่า response body มีรูปแบบ `ApiResponse<Equipment[]>` ทำให้ `res.data.data` มี type เป็น `Equipment[]` โดยอัตโนมัติ
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง Axios API client ด้วย TypeScript พร้อม base configuration, request interceptor สำหรับแนบ JWT token จาก localStorage และ response interceptor สำหรับจัดการ error 401 จากนั้นสร้างฟังก์ชัน `getEquipments()` ที่ return `Promise<Equipment[]>` โดยใช้ generic ApiResponse wrapper"
:::

### 📝 PjBL Lab

- [ ] ติดตั้ง axios: `npm install axios`
- [ ] สร้าง `src/api/config.ts` พร้อม Axios instance + interceptors ทั้ง 2 ตัว
- [ ] สร้าง `src/api/equipmentApi.ts` มีฟังก์ชัน `getEquipments()`
- [ ] อัปเดต `useEquipments.ts` ให้เรียก `getEquipments()` แทน Mock Data
- [ ] เปิด Backend (port 3000) แล้วทดสอบว่าดึงข้อมูลจริงได้
- [ ] จัดการ error: ถ้า backend ไม่ตอบให้แสดง error message ใน UI
- [ ] ทดสอบ: เปิด Network tab ใน DevTools — ต้องเห็น GET /api/equipments

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ Axios interceptor ต่างกับ middleware ยังไง?
**แนวคำตอบ:** Middleware อยู่ฝั่ง Server ทำงานก่อน request ถึง handler ส่วน Axios interceptor อยู่ฝั่ง Client ทำงานก่อน request ออกจาก Browser หรือหลัง response เข้ามา ทั้งคู่เป็น "ตัวกั้นกลาง" แต่คนละฝั่ง
:::

::: details ❓ ทำไม baseURL เป็น `''` (string ว่าง) ในการพัฒนา?
**แนวคำตอบ:** Vite มี proxy ที่ config ไว้ใน `vite.config.ts` — เมื่อ request ไปที่ `/api/...` Vite จะ forward ไปที่ `http://localhost:3000` อัตโนมัติ ทำให้ไม่ต้อง hardcode port ใน code
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Axios config ถูก | interceptors ทั้งสองทำงาน | มี interceptor แต่ไม่สมบูรณ์ | ไม่มี config |
| API ดึงข้อมูลได้ | ดึงจาก backend จริงได้ | ดึงได้แต่ไม่มี error handling | ยังใช้ mock data |
| Generic Types | `get<ApiResponse<T>>` ถูกต้อง | ใช้ `any` บางส่วน | ไม่มี type |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Axios` | HTTP Client Library สำหรับ JavaScript/TypeScript |
| `Interceptor` | ฟังก์ชันที่รัน "ระหว่างทาง" ก่อน request ออกหรือหลัง response เข้า |
| `Bearer Token` | รูปแบบ Authorization header: `Authorization: Bearer <jwt>` |
| `Endpoint` | URL ของ API แต่ละฟังก์ชัน เช่น `/api/equipments` |
| `Proxy` | ตัวกลาง forward request จาก Vite dev server ไป Backend |
