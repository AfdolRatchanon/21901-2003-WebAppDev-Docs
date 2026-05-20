# Props Drilling & useAuth — จัดการ Auth State ข้าม Component <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เรียนรู้การส่งข้อมูล Auth ข้าม Component ผ่าน Props + สร้าง `useAuth()` Hook ที่ restore state จาก localStorage — เป็นรากฐานของระบบ Login ที่ wk6 จะนำไปใช้งานจริงครบวงจร

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
หลังจาก wk4 แอปเชื่อม API ได้แล้ว ปัญหาต่อมาคือ **ข้อมูลผู้ใช้ที่ล็อกอิน** ต้องใช้ในหลาย Component:
- `Navbar` — แสดงชื่อ + ปุ่ม Logout
- `LoginPage` — เรียก login API
- `EquipmentPage` — เช็ค role ก่อน borrow
- `ProtectedRoute` — ตรวจสอบสิทธิ์ก่อนเข้าหน้า

และอีกปัญหา: **refresh หน้าแล้ว state หาย** ทั้งที่ยังไม่ได้ logout

วิธีแก้ทั้งสองปัญหาคือ `useAuth()` Hook ที่ restore state จาก `localStorage` + ส่ง `auth` เป็น props จาก `App.tsx`
:::

> 💡 **เปรียบเทียบ:** useAuth Hook เหมือน "บัตรประจำตัว" ที่พกติดตัว — refresh แล้วก็ยังรู้ว่าตัวเองเป็นใคร, ProtectedRoute เหมือนยาม รปภ. ที่ตรวจบัตรก่อนเข้าห้อง

## 📖 I: Information

### ขั้นตอนที่ 1 — เข้าใจวงจร Props Drilling และ `useAuth()` Hook

ใน React การส่งผ่านข้อมูลจาก Component แถวบนสุดไปยัง Component ลูกหลานด้านล่างจำเป็นต้องใช้วิธีที่เรียกว่า **Props** (เหมือนการส่งของต่อกันเป็นทอด ๆ) ซึ่งถ้าข้อมูลนั้นต้องส่งผ่านหลายชั้น อาจทำให้เกิดปัญหาที่เรียกว่า **Props Drilling** (การเจาะทะลุ Props ลงไปลึกเกินไปจนดูจัดการยาก) 

อย่างไรก็ตาม สำหรับข้อมูล Authentication ที่ใช้ไม่กี่จุดและโครงสร้างไม่ลึกมากนัก การส่ง Props แบบปกติก็ยังเป็นวิธีที่เรียบง่ายและตรวจสอบง่ายที่สุด โดยหัวใจหลักที่เราจะใช้ตรวจจับสถานะการล็อกอินคือ **`useAuth()` Hook** ซึ่งรับหน้าที่จัดการตั้งแต่การไปดึงค่าโทเค็นจาก localStorage ตอนเปิดแอป ไปจนถึงการเคลียร์ค่าตอนล็อกเอาต์:

`useAuth()` ทำ 3 อย่าง: **restore** state จาก localStorage เมื่อ refresh, **login** (เรียก API + save), **logout** (ล้าง)

```ts [src/hooks/useAuth.ts]
import { useState, useEffect } from 'react'
import { loginApi } from '../api/authApi'
import { apiClient } from '../api/config'
import type { User, AuthContextType } from '../types'

export function useAuth(): AuthContextType {

  // [1] Lazy Initializer — ฟังก์ชันใน useState รันครั้งเดียวตอน mount
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')   // [2] อ่าน JSON string
    try {
      return stored ? (JSON.parse(stored) as User) : null  // [3] parse → object
    } catch {
      return null  // [4] ป้องกัน JSON เสียหาย (malformed)
    }
  })

  // [5] Lazy Initializer สำหรับ token — อ่าน string โดยตรง
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')
  )

  // [6] เมื่อ token เปลี่ยน ให้ตั้ง header ให้ apiClient ทันที
  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
  }, [token])  // [7] dependency array — รันเมื่อ token เปลี่ยนเท่านั้น

  async function login(email: string, password: string): Promise<boolean> {
    try {
      const { token: newToken, user: loggedInUser } = await loginApi(email, password) // [8]
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(loggedInUser))
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(loggedInUser)
      return true   // [9] LoginPage จะ navigate ไป / เมื่อได้ true
    } catch {
      return false  // LoginPage จะแสดง error message เมื่อได้ false
    }
  }

  function logout() {
    localStorage.removeItem('token')                               // [10] ลบ token
    localStorage.removeItem('user')                                // [11] ลบ user
    delete apiClient.defaults.headers.common['Authorization']      // [12] ลบ header
    setToken(null)
    setUser(null)
  }

  return {
    user,
    token,
    login,
    logout,
    isAuthenticated: token !== null,  // [13] computed — ถ้ามี token = login แล้ว
  }
}
```

**สรุปการทำงาน:** Lazy Initializer `[1]` อ่าน localStorage ครั้งเดียวตอนเปิดแอป → `login()` save ลง localStorage + state + header พร้อมกัน → `logout()` ล้างทุกอย่าง → `isAuthenticated` คำนวณจาก token อัตโนมัติ

::: code-group
```ts [✅ Lazy Initializer ถูก]
// ฟังก์ชัน () => {...} รันครั้งเดียวตอน mount
const [user, setUser] = useState<User | null>(() => {
  const stored = localStorage.getItem('user')
  try { return stored ? JSON.parse(stored) : null }
  catch { return null }
})
```
```ts [❌ ไม่ใช้ Lazy — อ่าน localStorage ทุก re-render]
// ค่าตรง ๆ จะ evaluate ทุกครั้งที่ component render
const [user, setUser] = useState<User | null>(
  JSON.parse(localStorage.getItem('user') || 'null')  // อาจ throw ถ้า JSON เสียหาย
)
```
```ts [💡 ทำไม try-catch ใน Lazy Initializer]
// ผู้ใช้อาจแก้ไข localStorage ด้วยมือ DevTools
// JSON.parse จะ throw SyntaxError ถ้า JSON ไม่ถูกต้อง
// try-catch ทำให้ login state reset เป็น null แทน crash
```
:::

### ขั้นตอนที่ 2 — Props Drilling: App.tsx ส่ง auth ลงไป

```
App.tsx  ← useAuth() อยู่ที่นี่
│
│  auth={auth}          ← ส่งลงทุกคนที่ต้องการ
├── Navbar              (ใช้: auth.user, auth.logout)
├── LoginPage           (ใช้: auth.login)
├── EquipmentPage       (ใช้: auth.user.role)
└── ProtectedRoute      (ใช้: auth.isAuthenticated)
```

> สำหรับโปรเจกต์นี้ Props Drilling แค่ **1 ชั้น** (App → Page) — จัดการได้ไม่ซับซ้อน  
> wk5-content2 จะสอน Context API สำหรับกรณีที่ tree ลึกกว่านี้

`App.tsx` เป็น Single Source of Truth — สร้าง `auth` ที่นี่ที่เดียว แล้วส่งลงไปทุก Component ที่ต้องการ

```tsx [src/App.tsx]
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { LoginPage } from './pages/LoginPage'
import { EquipmentPage } from './pages/EquipmentPage'
import { AdminPage } from './pages/AdminPage'

function App() {
  const auth = useAuth()  // [1] สร้าง auth state ที่เดียว

  return (
    <BrowserRouter>

      {/* [2] Navbar ซ่อนเมื่อยังไม่ได้ login */}
      {auth.isAuthenticated && <Navbar auth={auth} />}

      <Routes>

        {/* [3] /login — ถ้า login แล้วให้ redirect ไป / */}
        <Route path="/login" element={
          auth.isAuthenticated
            ? <Navigate to="/" replace />
            : <LoginPage auth={auth} />    // ← ส่ง auth.login ให้ LoginPage เรียก
        } />

        {/* [4] / — ต้อง login ก่อน (ไม่กำหนด role) */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
            <EquipmentPage auth={auth} />  // ← ส่ง auth.user เพื่อแสดงชื่อ
          </ProtectedRoute>
        } />

        {/* [5] /admin — ต้อง login + role = "admin" */}
        <Route path="/admin" element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.user?.role}     // [6] optional chaining ป้องกัน null
            requiredRole="admin"
          >
            <AdminPage />
          </ProtectedRoute>
        } />

        {/* [7] /forbidden — หน้า 403 */}
        <Route path="/forbidden" element={
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-6xl font-black text-slate-300">403</p>
          </div>
        } />

        {/* [8] Catch-all — redirect ไป / */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**สรุปการทำงาน:** `useAuth()` สร้าง auth object `[1]` → ส่งลง Navbar `[2]`, LoginPage `[3]`, EquipmentPage `[4]` และ ProtectedRoute `[4][5]` → `auth.user?.role` `[6]` ใช้ optional chaining ป้องกัน null เมื่อยังไม่ได้ login

| auth ไหลไปถึงใคร | ใช้ทำอะไร |
| :--- | :--- |
| `Navbar` | แสดงชื่อ `auth.user.name` + เรียก `auth.logout()` |
| `LoginPage` | เรียก `auth.login(email, pass)` แล้วรอ boolean |
| `EquipmentPage` | ดู `auth.user.role` เพื่อแสดง/ซ่อนปุ่ม admin |
| `ProtectedRoute` | รับ `auth.isAuthenticated` + `auth.user?.role` |

::: code-group
```tsx [✅ Props Drilling เหมาะกับโปรเจกต์นี้]
// Component tree ไม่ลึก: App → Page (1 ชั้น)
// auth ใช้แค่ใน Page-level components — ส่งตรงได้เลย
const auth = useAuth()
<LoginPage auth={auth} />    // explicit ชัดเจน
<EquipmentPage auth={auth} />
```
```tsx [❌ Props Drilling ปัญหา (ถ้า tree ลึกกว่านี้)]
// ถ้าต้องส่งผ่าน Component กลางที่ไม่ได้ใช้ auth
<Layout auth={auth}>           // Layout ไม่ใช้ auth เลย
  <Content auth={auth}>        // Content ก็ไม่ใช้
    <Widget auth={auth}>       // Widget ถึงจะใช้ auth.user.name
      <UserLabel auth={auth} />
    </Widget>
  </Content>
</Layout>
// → เวลานี้ควรเปลี่ยนเป็น Context
```
```tsx [💡 เมื่อไรควรใช้ Context แทน Props]
// ใช้ Props เมื่อ: tree ไม่ลึก, component ที่ใช้มีน้อย
// ใช้ Context เมื่อ: ต้องส่งผ่าน 3+ ชั้น หรือ component กระจัดกระจาย
// โปรเจกต์นี้: App → Page (1 ชั้น) → ใช้ Props เหมาะสม ✅
```
:::

### ขั้นตอนที่ 3 — `ProtectedRoute`: ยามสองชั้น

```tsx [src/components/ProtectedRoute.tsx]
import { Navigate } from 'react-router-dom'
import type { UserRole } from '../types'

// [1] Interface กำหนด props ที่ ProtectedRoute รับ
interface ProtectedRouteProps {
  children: React.ReactNode   // [2] รับ JSX element ใด ๆ ก็ได้
  isAuthenticated: boolean
  userRole?: UserRole | null  // [3] optional (ไม่ใส่ = ไม่เช็ค role)
  requiredRole?: UserRole     // [4] optional (ไม่ใส่ = เปิดให้ทุก role)
}

export function ProtectedRoute({
  children,
  isAuthenticated,
  userRole,
  requiredRole,
}: ProtectedRouteProps) {

  // [5] ชั้นที่ 1: ตรวจ login — ถ้าไม่ได้ login → redirect /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // [6] ชั้นที่ 2: ตรวจ role — ถ้า requiredRole กำหนดมา แต่ role ไม่ตรง → 403
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/forbidden" replace />
  }

  // [7] ผ่านทั้ง 2 ชั้น → render children (React Fragment ไม่สร้าง DOM เพิ่ม)
  return <>{children}</>
}
```

**สรุปการทำงาน:** ตรวจ 2 ชั้น: ชั้น `[5]` login → ชั้น `[6]` role → ถ้าผ่านทั้งคู่ render `children` `[7]`

::: code-group
```tsx [✅ ใช้ ProtectedRoute ครอบ Route]
// /admin — ต้อง login + role = admin
<Route path="/admin" element={
  <ProtectedRoute
    isAuthenticated={auth.isAuthenticated}
    userRole={auth.user?.role}
    requiredRole="admin"
  >
    <AdminPage />
  </ProtectedRoute>
} />
// student ลอง navigate ไป /admin → ตกที่ชั้น 2 → 403
// user ที่ยังไม่ login → ตกที่ชั้น 1 → /login
```
```tsx [❌ ไม่มี guard ป้องกัน]
// ทุกคน access /admin ได้โดยไม่ต้อง login
<Route path="/admin" element={<AdminPage />} />
```
```tsx [💡 `replace` ใน Navigate คืออะไร]
// replace: true → แทน history entry แทนที่จะ push ใหม่
// ผลคือผู้ใช้กด Back แล้วจะไม่วนกลับมาหน้าที่ถูก redirect
<Navigate to="/login" replace />  // ✅ Back ไม่วน
<Navigate to="/login" />          // ❌ กด Back แล้ววนกลับมาหน้าเดิม
```
:::

#### 🔷 TypeScript ในบทนี้

- `useState<User | null>(() => {...})` — Lazy Initializer พร้อม Generic type
- `Promise<boolean>` — return type ของ `login()` ที่บอกผลแบบ explicit
- `UserRole | null` ใน ProtectedRoute — ครอบคลุม optional prop ที่อาจเป็น null
- `?.` (optional chaining) — `auth.user?.role` ป้องกัน null reference

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React custom hook ชื่อ `useAuth` ที่ใช้ TypeScript — ต้อง restore user จาก localStorage ด้วย Lazy Initializer ใน useState, มี login function ที่ return `Promise<boolean>`, มี logout function ที่ล้าง localStorage และ axios header จากนั้นแสดงวิธีส่ง auth เป็น props จาก App.tsx ไปยัง ProtectedRoute"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] เข้าใจว่า Lazy Initializer `() => {...}` ต่างจากการใส่ค่าตรง ๆ ใน useState อย่างไร
- [ ] อธิบายได้ว่า `isAuthenticated: token !== null` ทำงานอย่างไร
- [ ] รู้ว่า ProtectedRoute ตรวจสอบ 2 ชั้น (login + role) ก่อน render children
:::

### 📝 PjBL Lab — ชิ้นงาน: `useAuth.ts`

**เป้าหมาย:** เพิ่มระบบ Login + Route Protection ให้แอปเบิก-จ่ายอุปกรณ์

#### ขั้น 0 — Student Identity

เปิดไฟล์ใด ๆ ที่จะแก้ไขในสัปดาห์นี้ และเพิ่ม `<footer>` นี้ใน component หลักที่ render:

```tsx
<footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
```

#### ขั้น 1 — สร้าง `useAuth()` Hook

1. สร้างไฟล์ `src/hooks/useAuth.ts`
2. คัดลอกโค้ดจาก **ขั้นตอนที่ 1** พร้อม comment
3. สร้างไฟล์ `src/api/authApi.ts` (ถ้ายังไม่มี):

```ts [src/api/authApi.ts]
import { apiClient } from './config'
import type { User } from '../types'

interface LoginResponse {
  token: string
  user: User
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post<{ data: LoginResponse }>('/api/auth/login', { email, password })
  return res.data.data
}
```

4. ทดสอบใน browser console:
```
localStorage.setItem('token', 'test-token')
// refresh หน้า → useAuth ควร restore token ได้
```

#### ขั้น 2 — อัปเดต `App.tsx` ให้มี Routes + auth props

1. แก้ `src/App.tsx` ตาม **ขั้นตอนที่ 2**
2. install react-router-dom ถ้ายังไม่มี:
```bash
npm install react-router-dom
```
3. ตรวจสอบ: `npm run dev` แล้ว navigate ไป `/login` ได้

#### ขั้น 3 — สร้าง `ProtectedRoute.tsx`

1. สร้างไฟล์ `src/components/ProtectedRoute.tsx`
2. คัดลอกโค้ดจาก **ขั้นตอนที่ 3**
3. ทดสอบพฤติกรรม:

| สถานการณ์ | ผลที่คาดหวัง |
| :--- | :--- |
| เปิดแอปโดยไม่ login แล้วไปที่ `/` | redirect ไป `/login` |
| login เป็น student แล้วไปที่ `/admin` | redirect ไป `/forbidden` (403) |
| login เป็น admin แล้วไปที่ `/admin` | เข้าได้ |
| login แล้วไปที่ `/login` | redirect ไป `/` |

#### ขั้น 4 — เชื่อม `LoginPage` กับ `auth.login()`

แก้ `src/pages/LoginPage.tsx` ให้รับ props `auth` และเรียก login:

```tsx [LoginPage.tsx (ตัดเฉพาะ submit handler)]
interface LoginPageProps {
  auth: AuthContextType
}

export function LoginPage({ auth }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const success = await auth.login(email, password)
    if (success) {
      navigate('/')        // login สำเร็จ → ไปหน้าหลัก
    } else {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
  }
  // ... JSX
}
```

#### ขั้น Submit — ส่งงาน

- [ ] ทดสอบ login ด้วย account ทุก role (admin / teacher / student)
- [ ] ทดสอบ refresh หน้า → auth state ยังคงอยู่
- [ ] ทดสอบ logout → redirect ไป /login
- [ ] `git add src/hooks/useAuth.ts src/components/ProtectedRoute.tsx src/App.tsx`
- [ ] `git commit -m "feat: add useAuth hook + ProtectedRoute + routing"`
- [ ] `git push origin main`
- [ ] เขียนสรุป 3-5 บรรทัดใน Google Doc + ลิงก์ GitHub + screenshot หน้า 403

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ Lazy Initializer ใน useState — `() => {...}` แตกต่างจากการใส่ค่าตรง ๆ อย่างไร?
**แนวคำตอบ:** เมื่อส่ง **ค่าตรง ๆ** เช่น `useState(JSON.parse(...))` — expression นั้นจะถูก evaluate **ทุกครั้งที่ component re-render** ทำให้อ่าน localStorage ซ้ำ ๆ โดยไม่จำเป็น
เมื่อส่ง **ฟังก์ชัน** `useState(() => JSON.parse(...))` — React จะเรียกฟังก์ชันนั้น **ครั้งเดียวตอน mount** เท่านั้น เหมาะสำหรับ initial value ที่คำนวณแพง (expensive initialization) เช่น JSON.parse + localStorage
:::

::: details ❓ ทำไม `login()` return `Promise<boolean>` แทนที่จะ throw Error หรือ return void?
**แนวคำตอบ:** การ return `boolean` แทน throw ทำให้ **caller (LoginPage) ควบคุม UX ได้เอง** — ถ้า `true`: navigate ออก, ถ้า `false`: แสดง error message ที่เหมาะสม
ถ้า throw Error แทน caller ต้องใช้ try-catch ทุกที่ที่เรียก login()
ถ้า return void caller ไม่รู้ว่าสำเร็จหรือไม่
Pattern `Promise<boolean>` = "บอกผลลัพธ์แบบ explicit โดยไม่บังคับ caller จัดการ exception"
:::

::: details ❓ `isAuthenticated: token !== null` — ทำไมไม่ใช้ `user !== null` แทน?
**แนวคำตอบ:** ทั้งสองค่าควรสอดคล้องกัน แต่ `token` เหมาะกว่าเพราะ:
1. **axios interceptor** ใช้ token ในการส่ง request — ถ้ามี token = API calls จะทำงาน
2. ถ้าใช้ `user !== null` อาจเกิด edge case ที่ user ถูก set แล้วแต่ token ยังไม่ถึง (race condition)
3. เมื่อ logout: ล้าง token พร้อม user — ทั้งคู่เป็น null พร้อมกัน ไม่มีความต่างในทางปฏิบัติ
แต่ token เป็น "สิ่งที่ใช้ authenticate จริง" จึงเป็น source of truth ที่ดีกว่า
:::

::: details ❓ `userRole?: UserRole | null` ทำไมต้องใส่ทั้ง `?` (optional) และ `| null`?
**แนวคำตอบ:** `?` และ `null` หมายถึงคนละอย่าง:
- `userRole?` → props นี้ **ไม่ต้องส่งก็ได้** (ถ้าไม่ส่ง = `undefined`)
- `| null` → ถ้าส่งมา ค่าอาจเป็น `null` ได้ (เพราะ `auth.user?.role` — ถ้า `user` เป็น null จะได้ `undefined`, แต่ถ้า prop type ไม่รับ null TypeScript จะ error)
ในทางปฏิบัติ: `auth.user` เป็น `User | null` ดังนั้น `auth.user?.role` มีค่าเป็น `UserRole | undefined` — TypeScript ต้องการให้ type ของ prop ครอบคลุม ทั้ง undefined (optional) และ null (เมื่อ user เป็น null)
:::

### 🐛 Common Errors

| Error | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `JSON.parse` throw `SyntaxError` ตอน restore | localStorage มีค่าที่ไม่ใช่ JSON ที่ถูกต้อง (เช่น แก้ด้วยมือ) | ใช้ `try-catch` ใน Lazy Initializer และ `removeItem` เมื่อ catch |
| `auth.user.role` → `Cannot read properties of null` | `auth.user` เป็น null แต่ไม่ได้ใช้ optional chaining | เปลี่ยนเป็น `auth.user?.role` ทุกที่ที่ใช้ |
| redirect วนซ้ำ (infinite loop) ระหว่าง `/` และ `/login` | `ProtectedRoute` redirect ไป `/login` แต่ `/login` redirect กลับไป `/` | ตรวจว่า `/login` route มีเงื่อนไข `isAuthenticated ? <Navigate to="/" /> : <LoginPage />` |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| `useAuth()` Lazy Initializer | restore จาก localStorage ได้หลัง refresh | restore ได้บางครั้ง | ไม่ restore |
| Login Flow | login สำเร็จ → navigate, ล้มเหลว → error message | ทำงานได้แต่ไม่มี error feedback | login ไม่ทำงาน |
| ProtectedRoute | redirect ถูกทั้ง 2 กรณี (unauth + wrong role) | redirect ได้กรณีเดียว | ไม่มี guard |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Lazy Initializer` | เล-ซี อิ-นิ-เชีย-ไล-เซอร์ | ฟังก์ชันที่ส่งเข้า useState — รันครั้งเดียวตอน mount เพื่อประหยัดการคำนวณ |
| `Props Drilling` | พรอปส์ ดริล-ลิ่ง | การส่ง props ผ่าน Component กลางที่ไม่ได้ใช้ข้อมูลนั้น |
| `Single Source of Truth` | ซิง-เกิล ซอร์ส ออฟ ทรูธ | มีที่เดียวที่เป็น "เจ้าของ" state — ที่อื่นอ่านจากที่นี่ |
| `Optional Chaining` | ออพ-ชัน-นัล เชน-นิ่ง | `?.` syntax — ป้องกัน error จาก null/undefined โดยคืน undefined แทน throw |
| `Authentication` | ออ-เทน-ติ-เค-ชัน | กระบวนการพิสูจน์ตัวตนว่าผู้ใช้คือใคร |
| `Authorization` | ออ-เทอ-ไร-เซ-ชัน | กระบวนการตรวจสอบว่าผู้ใช้มีสิทธิ์ทำอะไรได้บ้าง |
| `RBAC` | อาร์-บี-เอ-ซี | Role-Based Access Control — ควบคุมสิทธิ์ตาม role ของผู้ใช้ |
| `Protected Route` | โพร-เทค-เทด เราท์ | Route ที่ต้องผ่านการตรวจสอบ (login + role) ก่อนเข้าถึง |
| `Token` | โท-เคน | ข้อมูลที่ใช้พิสูจน์ตัวตน — ส่งไปกับทุก API request |
