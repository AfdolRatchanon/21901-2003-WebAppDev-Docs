# จัดการ Auth Session กับ Axios Interceptor <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ทุก API call ต้องแนบ JWT token ใน header `Authorization: Bearer <token>` — ถ้าต้องเขียนทุกครั้งจะซ้ำซ้อน และถ้า token หมดอายุ (401) ต้องจัดการ redirect ออก ปัญหานี้แก้ได้ด้วย **Axios Interceptor** ที่ทำงานอัตโนมัติทุก request
:::

> 💡 **เปรียบเทียบ:** Interceptor เหมือน "ด่านตรวจ" — ทุกรถ (request) ที่ออกจากเมืองต้องผ่านด่าน (request interceptor) เพื่อติดป้ายทะเบียน (token) ส่วนรถที่กลับเข้าเมืองก็ผ่านด่าน (response interceptor) เพื่อตรวจว่าถูกปฏิเสธ (401) หรือไม่

---

## 📖 I: Information

### Axios Interceptor ทำงานอย่างไร

```
Request Flow:
Component → apiClient.get('/api/...')
         → [Request Interceptor: แนบ token]
         → HTTP Request ออกไป Backend
         → Backend ตรวจสอบ token
         → HTTP Response กลับมา
         → [Response Interceptor: เช็ค 401]
         → Component รับ data
```

::: code-group
```ts [api/config.ts]
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',  // '' = ใช้ Vite proxy
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor 1: แนบ JWT token ทุก request อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor 2: จัดการ 401 Unauthorized → redirect ไป login
apiClient.interceptors.response.use(
  (response) => response,  // success: ส่งต่อ response ตามปกติ
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'  // hard redirect
    }
    return Promise.reject(error)  // ส่ง error ต่อให้ catch จัดการ
  }
)
```

```ts [api/authApi.ts]
import { apiClient } from './config'
import type { ApiResponse, User } from '../types'

interface LoginResponse {
  token: string
  user: User
}

// POST /api/auth/login
export async function loginApi(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/auth/login',
    { email, password }
  )
  return res.data.data  // { token, user }
}

// POST /api/auth/logout
export async function logoutApi(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}
```
:::

### Backend Login Response

```json
// POST /api/auth/login → 200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@school.ac.th",
      "name": "ผู้ดูแลระบบ",
      "role": "admin"
    }
  }
}

// POST /api/auth/login → 401 Unauthorized
{
  "success": false,
  "message": "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
}
```

::: tip 💡 TypeScript Tip — `error.response?.status`
ใน error interceptor ต้องใช้ `?.` เพราะ error อาจไม่มี `.response` เช่น กรณี Network Error (ไม่มีอินเทอร์เน็ต) จะไม่มี `.response` เลย การใช้ `?.` ป้องกัน `TypeError: Cannot read properties of undefined`
:::

### useAuth Hook — เชื่อม login กับ state

```ts [hooks/useAuth.ts]
export function useAuth(): AuthContextType {
  // restore จาก localStorage เมื่อ refresh
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    try { return stored ? (JSON.parse(stored) as User) : null }
    catch { return null }
  })
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const { token: newToken, user: loggedInUser } = await loginApi(email, password)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(loggedInUser)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete apiClient.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  return { user, token, login, logout, isAuthenticated: token !== null }
}
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง Axios instance ด้วย TypeScript พร้อม 2 interceptors: (1) request interceptor ที่อ่าน JWT จาก localStorage แล้วเพิ่ม header 'Authorization: Bearer <token>' และ (2) response interceptor ที่ดัก error 401 แล้ว redirect ไป /login โดยตั้งค่า window.location.href"
:::

### 📝 PjBL Lab

- [ ] สร้าง `src/api/config.ts` พร้อม Axios instance
- [ ] เพิ่ม request interceptor แนบ token อัตโนมัติ
- [ ] เพิ่ม response interceptor จัดการ 401
- [ ] สร้าง `src/api/authApi.ts` มี `loginApi()` และ `logoutApi()`
- [ ] ทดสอบ: เปิด Network tab → login → ดู request headers ว่ามี `Authorization: Bearer ...`
- [ ] ทดสอบ: ลบ token ออกจาก localStorage แล้วกด refresh — ควร redirect ไป /login

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม logout ต้องลบ `apiClient.defaults.headers.common['Authorization']` ด้วย?
**แนวคำตอบ:** Axios instance (`apiClient`) เก็บ default headers ไว้ในหน่วยความจำ — ถ้าลบแค่ localStorage แต่ไม่ล้าง header request ต่อ ๆ ไปในเซสชั่นนั้นจะยังแนบ token เก่าไปด้วย ต้องลบทั้งสองที่เพื่อให้ logout สมบูรณ์
:::

::: details ❓ `return Promise.reject(error)` ในตอนท้าย interceptor มีไว้ทำไม?
**แนวคำตอบ:** ถ้าไม่ reject — function ที่เรียก apiClient จะคิดว่า request สำเร็จ เพราะ interceptor return undefined แทน rejected promise การ `return Promise.reject(error)` ทำให้ error ยังคงเป็น error และ `catch` ของผู้เรียกยังทำงานได้ถูกต้อง
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Request interceptor | แนบ token ถูกต้อง ใน header | มีแต่ format ผิด | ไม่มี interceptor |
| Response interceptor | จับ 401 + redirect | จับได้แต่ไม่ redirect | ไม่มี |
| authApi | login + logout function ถูก | login อย่างเดียว | ไม่มี authApi |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Interceptor` | ฟังก์ชันที่รันระหว่าง request/response ก่อนถึงปลายทาง |
| `Bearer Token` | Format ของ Authorization header: `Bearer <jwt>` |
| `401 Unauthorized` | HTTP status code: "ไม่ได้รับอนุญาต" (token ผิด/หมดอายุ) |
| `Session` | ช่วงเวลาที่ผู้ใช้ "อยู่ใน" ระบบ ตั้งแต่ login ถึง logout |
| `Hard redirect` | เปลี่ยน URL ด้วย `window.location.href` (reload หน้าใหม่ทั้งหมด) |
