# Auth Session & Axios Interceptor — แนบ Token อัตโนมัติ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ทุก API call ต้องแนบ JWT token ใน header `Authorization: Bearer <token>` — ถ้าต้องเขียนซ้ำทุกครั้ง:
```ts
// ❌ ต้องเขียนซ้ำทุก API call
const res = await axios.get('/api/equipments', {
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})
```
เมื่อมี 10 API calls ต้องเขียน headers 10 ครั้ง และถ้า token หมดอายุ (401) ทุก call ต้องจัดการ redirect แยกกัน **Axios Interceptor** แก้ปัญหานี้ด้วยการทำงานอัตโนมัติ 1 ที่สำหรับทุก request
:::

> 💡 **เปรียบเทียบ:** Interceptor เหมือน "ด่านตรวจหนังสือเดินทาง" ที่ประตูสนามบิน — ทุกผู้โดยสาร (request) ที่ออกต้องผ่านด่านเพื่อตรวจหนังสือเดินทาง (แนบ token) และทุกคนที่กลับเข้ามา (response) ก็ต้องผ่านด่านเพื่อเช็คสถานะ (จับ 401)

---

## 📖 I: Information

### ขั้นตอนที่ 1 — ศูนย์กลางการเชื่อมต่อ (Axios Instance: สร้าง apiClient)

ในการสร้างฟีเจอร์ระดับระบบเซสชั่น (Session) โทเค็น (JWT) จะต้องแนบไปกับทุกคำขอ (Request) ที่ยิงออกไปยังเซิร์ฟเวอร์ หากเราใช้วิธีเรียก `axios` ตรง ๆ เราจะต้องคอยพิมพ์เซ็ต Header ใส่โค้ดโทเค็นซ้ำแล้วซ้ำเล่าในทุก ๆ ไฟล์ที่ต้องใช้ข้อมูลจาก API

วิธีที่สะอาดและเป็นมืออาชีพกว่าคือการสร้าง **Axios Instance** หรือการปั๊มตรายางแม่แบบขึ้นมา 1 ตัวสำหรับโปรเจกต์ (เราจะตั้งชื่อมันว่า `apiClient`) แล้วกำหนดกฎเกณฑ์พื้นฐานเอาไว้ที่นี่ที่เดียว ไม่ว่าจะเป็นที่อยู่เว็บเซิร์ฟเวอร์ (baseURL), ประเภทข้อมูลเป็น JSON (Content-Type) ไปจนถึงการแปะ Interceptor เพื่อดักจับข้อมูลเข้าหรือออกทุกครั้ง:

แทนที่จะใช้ `axios` โดยตรง — สร้าง instance พร้อม default config:

```ts [src/api/config.ts]
import axios from 'axios'

// [1] สร้าง Axios instance พร้อม default configuration
//     instance นี้เป็น "สำเนา" ของ axios ที่กำหนดค่าล่วงหน้า
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',  // [2] '' = ใช้ Vite proxy (dev)
  headers: {
    'Content-Type': 'application/json',          // [3] ทุก request ส่ง JSON
  },
})
```

**สรุป:** `axios.create()` สร้าง instance แยก — ตั้งค่าครั้งเดียว ทุก call ใช้ config เดียวกัน

::: code-group
```ts [✅ Axios instance — config ที่เดียว]
// apiClient มี baseURL + Content-Type ทุก request อัตโนมัติ
export const apiClient = axios.create({ baseURL: '...' })

// ทุก call ใช้ apiClient แทน axios โดยตรง
const res = await apiClient.get('/api/equipments')  // baseURL ถูกนำหน้าให้
const res2 = await apiClient.post('/api/auth/login', body)
```
```ts [❌ ใช้ axios ตรง — ต้องใส่ URL ทุกครั้ง]
// ต้องเขียน URL เต็มทุกที่ — ถ้า domain เปลี่ยนต้องแก้ทุกบรรทัด
const res = await axios.get('http://localhost:3000/api/equipments')
const res2 = await axios.post('http://localhost:3000/api/auth/login', body)
```
```ts [💡 Vite Proxy — ทำไม baseURL เป็น '']
// vite.config.ts — proxy /api → localhost:3000
// ทำให้ frontend ส่งไปที่ http://localhost:5173/api/...
// Vite forward ต่อไปที่ http://localhost:3000/api/...
// CORS ไม่เกิดเพราะเป็น origin เดียวกัน ✅
```
:::

---

### ขั้นตอนที่ 2 — Request Interceptor: แนบ Token อัตโนมัติ

```ts [src/api/config.ts — Request Interceptor]
// [1] interceptors.request.use — รันก่อนส่ง request ออกไป
apiClient.interceptors.request.use((config) => {

  // [2] อ่าน token จาก localStorage ทุกครั้ง (เผื่อ refresh token)
  const token = localStorage.getItem('token')

  // [3] ถ้ามี token → เพิ่ม Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    // [4] format: "Bearer " + token (มีช่องว่าง) — standard HTTP
  }

  // [5] ต้อง return config เสมอ — ไม่งั้น request จะไม่ออกไป
  return config
})
```

**สรุปการทำงาน:** ทุกครั้งที่ call `apiClient.get/post/patch/delete` → interceptor รัน `[1]` → อ่าน token `[2]` → เพิ่ม header `[3]` → ส่ง request ออกไปพร้อม token `[5]`

---

### ขั้นตอนที่ 3 — Response Interceptor: จัดการ 401 Unauthorized

```ts [src/api/config.ts — Response Interceptor]
// [1] interceptors.response.use(onSuccess, onError)
apiClient.interceptors.response.use(
  // [2] onSuccess: response ปกติ → ส่งต่อเลย
  (response) => response,

  // [3] onError: เกิด error (4xx, 5xx, Network error)
  (error) => {
    // [4] optional chaining ?.  เพราะ Network Error ไม่มี .response เลย
    if (error.response?.status === 401) {

      // [5] Token หมดอายุหรือไม่ถูกต้อง → ล้าง localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // [6] Hard redirect ไป /login (ออกจาก React Router — reload ทั้งหมด)
      window.location.href = '/login'
    }

    // [7] ต้อง return Promise.reject เสมอ
    //     ถ้าไม่ reject → caller คิดว่า request สำเร็จ → bug แปลก ๆ
    return Promise.reject(error)
  }
)
```

**สรุปการทำงาน:** Response 2xx → `[2]` ผ่านต่อ → Response 401 → `[5]` ล้าง token + `[6]` redirect → Response error อื่น → `[7]` reject ให้ catch จัดการ

::: code-group
```ts [✅ Request Flow ทั้งหมด]
// Component → apiClient.get('/api/equipments')
//          → [Request Interceptor รัน: แนบ token]
//          → HTTP Request ออกไป Backend (port 3000)
//          → Backend ตรวจสอบ JWT
//          → HTTP Response กลับมา
//          → [Response Interceptor รัน: เช็ค 401]
//          → data ถึง Component

// ถ้า token หมดอายุ:
//          → Response 401 กลับมา
//          → Response Interceptor: ล้าง token → redirect /login
//          → Component ไม่รับ data เลย (หน้าเปลี่ยนไปแล้ว)
```
```ts [❌ ไม่มี Interceptor — ซ้ำซ้อน]
// EquipmentPage.tsx
const token = localStorage.getItem('token')
const res = await axios.get('/api/equipments', {
  headers: { Authorization: `Bearer ${token}` }
})
if (res.status === 401) { window.location.href = '/login' }

// AdminPage.tsx — เขียนซ้ำ
const token2 = localStorage.getItem('token')
const res2 = await axios.get('/api/stats', {
  headers: { Authorization: `Bearer ${token2}` }
})
if (res2.status === 401) { window.location.href = '/login' }
// ... ซ้ำกันทุก API call 😰
```
:::

---

### Auth API: loginApi และ logoutApi

```ts [src/api/authApi.ts]
import { apiClient } from './config'
import type { ApiResponse, User } from '../types'

// [1] Type ของ login response
interface LoginResponse {
  token: string
  user:  User
}

// [2] POST /api/auth/login → รับ token + user กลับมา
export async function loginApi(
  email:    string,
  password: string
): Promise<LoginResponse> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    { email, password }                        // [3] request body
  )
  return res.data.data                         // [4] unwrap: ApiResponse<> ชั้นนอก + .data Axios ชั้นใน
}

// [5] POST /api/auth/logout (backend invalidate session ถ้ามี)
export async function logoutApi(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}
```

**Response จาก Backend:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "email": "admin@school.ac.th", "name": "ผู้ดูแลระบบ", "role": "admin" }
  }
}
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง TypeScript ไฟล์ `src/api/config.ts` ด้วย Axios ที่มี: 1) `axios.create()` instance ชื่อ apiClient พร้อม baseURL 2) Request interceptor ที่อ่าน JWT จาก localStorage แล้วเพิ่ม `Authorization: Bearer <token>` header 3) Response interceptor ที่ดัก error 401 แล้ว redirect ไป /login ด้วย window.location.href — อธิบายว่าทำไมต้อง return `Promise.reject(error)` ท้าย response interceptor"
:::

### 📝 PjBL Lab

**เป้าหมาย:** ตรวจสอบว่า Interceptors ทำงานถูกต้อง + สร้าง authApi ให้สมบูรณ์

---

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสของตนเองใน Component หลักที่แก้ไข

---

#### ขั้น 1 — ตรวจสอบ Axios config.ts

1. เปิด `src/api/config.ts` ใน project/frontend
2. อ่านและทำความเข้าใจ code ทุกบรรทัดพร้อม comment `[1]-[7]`
3. ทดสอบ Request Interceptor: Login → เปิด DevTools → Network → เลือก request ไป `/api/equipments` → ดู Request Headers → ต้องเห็น `Authorization: Bearer eyJ...`

---

#### ขั้น 2 — สร้าง authApi.ts

1. ตรวจสอบหรือสร้าง `src/api/authApi.ts` ตาม code ด้านบน
2. ทดสอบ: Login ด้วย account ที่มีอยู่ → ต้องเข้าหน้าหลักได้
3. ทดสอบ error case: ใส่ password ผิด → ต้องเห็น error message (ไม่ crash)

---

#### ขั้น 3 — ทดสอบ 401 Interceptor

1. Login สำเร็จ
2. ใน DevTools → Application → Local Storage → แก้ค่า `token` เป็น `"fake-token"`
3. กด Refresh → Interceptor ควรจับ 401 → redirect ไป `/login` อัตโนมัติ ✅

---

#### ขั้น Submit — ส่งงาน

- [ ] ตอบในรายงาน: "Interceptor ทำให้โค้ดดีขึ้นอย่างไร ถ้าไม่มีจะเกิดอะไรขึ้น"
- [ ] `git add src/api/config.ts src/api/authApi.ts`
- [ ] `git commit -m "wk6: axios interceptors for auth token + 401 handling"`
- [ ] `git push origin main`
- [ ] เขียนสรุป 3-5 บรรทัดใน Google Doc พร้อม screenshot Network tab ที่เห็น Authorization header

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม logout ต้องลบทั้ง `localStorage` และ `apiClient.defaults.headers.common['Authorization']`?
**แนวคำตอบ:** Axios instance เก็บ default headers ไว้ใน memory ตลอด session — ถ้าลบแค่ localStorage แต่ไม่ล้าง Axios header request ที่เกิดขึ้นหลัง logout ในเซสชั่นนั้นจะยังแนบ token เก่าไปด้วย
ต้องล้างทั้งสองที่:
1. `localStorage.removeItem('token')` — ป้องกันการ restore ตอน refresh
2. `delete apiClient.defaults.headers.common['Authorization']` — ป้องกัน request ที่ยังค้างอยู่
:::

::: details ❓ `return Promise.reject(error)` ท้าย response interceptor มีไว้ทำไม?
**แนวคำตอบ:** ถ้าไม่ `return Promise.reject(error)` → interceptor return `undefined` → Axios แปลว่า request สำเร็จ (resolved) → `try` block ของ caller ทำงาน แทนที่จะเป็น `catch` → bug ที่เงียบและหาสาเหตุยาก
การ `return Promise.reject(error)` ทำให้ error ยังเป็น error → `catch` ของ caller รับไปจัดการต่อได้ถูกต้อง
:::

::: details ❓ `error.response?.status === 401` ทำไมต้องใช้ `?.` ไม่ใช่ `.`?
**แนวคำตอบ:** Error ใน Axios มีหลายประเภท:
- HTTP Error (4xx/5xx) → มี `error.response` ที่เป็น object พร้อม `.status`
- Network Error (ไม่มีอินเทอร์เน็ต, timeout) → `error.response` เป็น `undefined` (ไม่มี property `.status`)
ถ้าใช้ `error.response.status` กับ Network Error → `TypeError: Cannot read properties of undefined` → แอป crash
`error.response?.status` คืน `undefined` ถ้า `response` ไม่มี → `undefined === 401` เป็น `false` → ปลอดภัย
:::

::: details ❓ `res.data.data` ทำไมต้องเข้าถึง `.data` สองครั้ง?
**แนวคำตอบ:** มี 2 layer:
1. **Axios layer**: `res.data` คือ body ของ HTTP response ที่ Axios parse จาก JSON → `{ success, data, message? }`
2. **ApiResponse layer**: `res.data.data` คือ field `data` ใน `ApiResponse<T>` → ข้อมูลจริงที่ต้องการ
เหมือน "เปิดกล่องใหญ่ (`res.data`) แล้วเอากล่องเล็กข้างใน (`res.data.data`) ออกมา"
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Request Interceptor | แนบ token ถูกต้อง เห็นใน Network tab | มีแต่ format header ผิด | ไม่มี interceptor |
| Response Interceptor | จับ 401 + redirect + reject | จับได้แต่ไม่ reject | ไม่มี |
| authApi.ts | loginApi + logoutApi ถูกต้อง | loginApi อย่างเดียว | ไม่มี authApi |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Interceptor` | ฟังก์ชันที่รันระหว่าง request/response — ดักจับก่อนถึงปลายทาง |
| `Bearer Token` | Format ของ Authorization header: `Bearer <jwt>` (มีช่องว่างระหว่าง) |
| `401 Unauthorized` | HTTP status: "ไม่ได้รับอนุญาต" — token ผิดหรือหมดอายุ |
| `Hard redirect` | เปลี่ยน URL ด้วย `window.location.href` — reload ทั้งหมด ออกจาก React |
| `Axios instance` | สำเนา Axios พร้อม default config — สร้างด้วย `axios.create()` |
| `Promise.reject` | บอก async chain ว่า operation ล้มเหลว → catch block รับไปจัดการ |
| `Optional chaining ?.` | เข้าถึง property โดยไม่ crash ถ้าค่าเป็น null/undefined |
