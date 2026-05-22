# React Router v6 + Protected Routes <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เข้าใจการกำหนด Routes ด้วย React Router v6, สร้าง ProtectedRoute ที่ตรวจสอบทั้ง authentication และ role, และใช้ Navigate component สำหรับ redirect แบบ SPA

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์มีหลายหน้า: `/login`, `/` (รายการอุปกรณ์), `/admin` (จัดการ) — นักเรียนที่ไม่ได้ login ต้องไม่เข้า `/` ได้ และ student ต้องไม่เข้า `/admin` ถ้าไม่มี guard ใครก็พิมพ์ URL เข้าได้ตรง ๆ
:::

> 💡 **เปรียบเทียบ:** React Router เหมือน "ป้ายบอกทางในอาคาร" — บอกว่า URL ไหนนำไปยัง Component ไหน ส่วน ProtectedRoute เหมือน "รปภ." ที่เฝ้าประตูห้องสำคัญ — ตรวจบัตรก่อนให้เข้า

## 📖 I: Information

### ขั้นตอนที่ 1 — React Router: โครงสร้างพื้นฐาน

```tsx [วิธีทำงานของ React Router v6]
// [1] BrowserRouter ครอบทั้งแอป — จัดการ History API
// [2] Routes คือ container ที่เลือก Route ที่ตรงกับ URL ปัจจุบัน
// [3] Route แต่ละตัวกำหนด path → element ที่จะ render

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>  {/* [1] ครอบทั้งหมด */}
      <Routes>       {/* [2] เลือก Route ที่ตรง */}

        <Route path="/login"   element={<LoginPage />} />   {/* [3] exact match */}
        <Route path="/"        element={<HomePage />} />
        <Route path="/admin"   element={<AdminPage />} />
        <Route path="*"        element={<Navigate to="/" replace />} />  {/* [4] catch-all */}

      </Routes>
    </BrowserRouter>
  )
}
```

**Routes ทั้งหมดในโปรเจกต์:**

| Path | Component | Guard |
| :--- | :--- | :--- |
| `/login` | `LoginPage` | ถ้า login แล้ว → redirect `/` |
| `/` | `EquipmentPage` | ต้อง login |
| `/admin` | `AdminPage` | ต้อง login + role = admin |
| `/forbidden` | 403 page | ไม่มี |
| `/*` | redirect `/` | catch-all |

### ขั้นตอนที่ 2 — App.tsx: กำหนด Routes พร้อม Auth Guards

```tsx [src/App.tsx]
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  const auth = useAuth()  // [1] auth state เดียวสำหรับทั้งแอป

  return (
    <BrowserRouter>

      {/* [2] Navbar — ซ่อนถ้ายังไม่ login */}
      {auth.isAuthenticated && <Navbar auth={auth} />}

      <Routes>

        {/* [3] /login — redirect ไป / ถ้า login แล้ว (ไม่ให้เข้าหน้า login ซ้ำ) */}
        <Route path="/login" element={
          auth.isAuthenticated
            ? <Navigate to="/" replace />    // [4] login แล้ว → ไปหน้าหลัก
            : <LoginPage auth={auth} />      // [5] ยังไม่ login → แสดงหน้า login
        } />

        {/* [6] / — ต้อง login ก่อน */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
            <EquipmentPage auth={auth} />
          </ProtectedRoute>
        } />

        {/* [7] /admin — ต้อง login + role = admin */}
        <Route path="/admin" element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.user?.role}   // [8] optional chaining ป้องกัน null
            requiredRole="admin"
          >
            <AdminPage />
          </ProtectedRoute>
        } />

        {/* [9] /forbidden — 403 */}
        <Route path="/forbidden" element={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <p className="text-6xl font-black text-slate-300">403</p>
          </div>
        } />

        {/* [10] catch-all — path ที่ไม่รู้จัก → ไปหน้าหลัก */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
```

**สรุปการทำงาน:** `useAuth()` `[1]` เป็น Single Source of Truth → กำหนด Routes + Guards `[3]-[9]` → `path="*"` `[10]` จัดการ URL ที่ไม่รู้จัก

### ขั้นตอนที่ 3 — ProtectedRoute: ยามสองชั้น + Navigate replace

```tsx [src/components/ProtectedRoute.tsx]
import { Navigate } from 'react-router-dom'
import type { UserRole } from '../types'

// [1] Props interface — ครบทุก parameter
interface ProtectedRouteProps {
  children:        React.ReactNode  // [2] JSX ที่จะ render ถ้าผ่าน
  isAuthenticated: boolean
  userRole?:       UserRole | null  // [3] optional — ไม่ส่ง = ไม่เช็ค role
  requiredRole?:   UserRole         // [4] optional — ไม่ส่ง = ทุก role เข้าได้
}

export function ProtectedRoute({
  children, isAuthenticated, userRole, requiredRole
}: ProtectedRouteProps) {

  // [5] ชั้น 1: ยังไม่ได้ login → ไป /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // [6] ชั้น 2: role ไม่ตรง → ไป /forbidden (403)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/forbidden" replace />
  }

  // [7] ผ่านทั้งสอง → render children
  return <>{children}</>
}
```

::: code-group
```tsx [✅ ใช้ replace ใน Navigate]
// replace: true — แทนที่ history entry
// กด Back หลัง redirect จะข้ามหน้าที่ redirect แล้วกลับไปก่อนหน้านั้น
<Navigate to="/login" replace />

// ถ้าไม่ใช้ replace — กด Back จะกลับมาหน้าเดิม → redirect อีกครั้ง → วนซ้ำ
```
```tsx [✅ Link vs window.location.href]
// React Router Link — เปลี่ยน URL ไม่ reload หน้า (SPA)
<Link to="/admin">จัดการ</Link>

// window.location.href — reload หน้าทั้งหมด (state หาย)
// ใช้เฉพาะตอน hard redirect จำเป็น เช่น หลัง 401 interceptor
```
```tsx [💡 useNavigate Hook — navigate ใน event handler]
import { useNavigate } from 'react-router-dom'

function SomeComponent() {
  const navigate = useNavigate()

  function handleClick() {
    navigate('/')           // ไปหน้าหลัก
    navigate(-1)            // Back (เหมือนกด Back button)
    navigate('/login', { replace: true })  // replace mode
  }
}
```
:::

#### 🔷 TypeScript ในบทนี้

- `interface ProtectedRouteProps` — กำหนด props ครบทุก parameter พร้อม optional `?`
- `React.ReactNode` — type ของ children ที่รับ JSX, string, null ได้ทั้งหมด
- `UserRole | null` — Union type รองรับทั้ง undefined (optional) และ null (จาก optional chaining)

### useNavigate vs window.location

::: code-group
```tsx [✅ useNavigate — SPA navigation]
import { useNavigate } from 'react-router-dom'

export function LoginPage() {
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const success = await auth.login(email, password)
    if (success) {
      navigate('/')  // SPA navigation — ไม่ reload, state ยังอยู่
    }
  }
}
```
```tsx [❌ window.location — full page reload]
// ❌ ล้าง React state ทั้งหมด รวมถึง Context
window.location.href = '/'   // reload ทุกครั้ง

// ❌ hard refresh + clear history
window.location.replace('/')
```
```tsx [💡 เมื่อไหรที่ window.location โอเค]
// logout แบบ hard-reset จงใจ — ล้าง state ทั้งหมดตั้งใจ
function logout() {
  localStorage.clear()
  window.location.href = '/login'  // ✅ ในกรณีนี้โอเค
}
```
:::

### navigate() patterns ที่ใช้ในโปรเจกต์

```tsx
const navigate = useNavigate()

navigate('/')                          // ไปหน้า home
navigate('/login', { replace: true }) // replace history — กด back ไม่ได้
navigate(-1)                           // กลับหน้าก่อนหน้า
```

::: warning `replace: true` หลัง logout
```tsx
// ✅ หลัง logout — replace: true ป้องกัน back กลับมา protected route
navigate('/login', { replace: true })

// ❌ ไม่มี replace → กด back ได้ → อาจเห็นหน้าที่ต้อง login
navigate('/login')
```
:::

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง ProtectedRoute component ด้วย TypeScript และ React Router v6 ที่: 1) redirect ไป /login ถ้า `isAuthenticated` เป็น false 2) redirect ไป /forbidden ถ้า `requiredRole` กำหนดมาแต่ `userRole` ไม่ตรง 3) render children ถ้าผ่านทั้งสองเงื่อนไข — อธิบายว่า `replace` ใน Navigate ต่างจากไม่ใช้ replace อย่างไร"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] เข้าใจ flow ของ ProtectedRoute ทั้งสองชั้น (auth check + role check)
- [ ] รู้ว่า `replace` ใน Navigate ป้องกัน Back-button loop ยังไง
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/components/ProtectedRoute.tsx`

**เป้าหมาย:** ทดสอบทุก Route + Guard behavior

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสของตนเองใน Component หลักที่แก้ไข

#### ขั้น 1 — ทดสอบทุก Path

| Path | วิธีทดสอบ | ผลที่คาดหวัง |
| :--- | :--- | :--- |
| `/login` | เปิด URL ตรง (ขณะไม่ได้ login) | เห็นหน้า Login ✅ |
| `/login` | เปิด URL ตรง (ขณะ login อยู่แล้ว) | redirect ไป `/` ✅ |
| `/` | เปิด URL ตรง (ขณะไม่ได้ login) | redirect ไป `/login` ✅ |
| `/admin` | login เป็น student → พิมพ์ URL ตรง | หน้า 403 ✅ |
| `/admin` | login เป็น admin | เข้าได้ ✅ |
| `/something-random` | พิมพ์ URL ที่ไม่มี | redirect ไป `/` ✅ |

#### ขั้น 2 — เพิ่ม Route ใหม่

เพิ่ม `/about` route ที่ทุกคนเข้าได้ (ไม่ต้องผ่าน ProtectedRoute):

```tsx [App.tsx — เพิ่ม route]
<Route path="/about" element={
  <div className="p-8">
    <h1>เกี่ยวกับระบบ</h1>
    <p>ระบบเบิก-จ่ายอุปกรณ์ไอที</p>
  </div>
} />
```

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย screenshot ทดสอบทุก case ในตาราง
- [ ] `git commit -m "wk7: react router v6 routes and protected route testing"`
- [ ] `git push origin main`
- [ ] เขียนสรุป Google Doc: ProtectedRoute ทำงานยังไง, replace ใน Navigate คืออะไร + ลิงก์ GitHub + screenshots

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `<Navigate replace />` ดีกว่า `window.location.href = '/'`?
**แนวคำตอบ:** `<Navigate>` ทำงานภายใน React Router — ไม่ reload หน้า, React state ยังคงอยู่, history จัดการถูกต้อง ส่วน `window.location.href` reload หน้าทั้งหมด → React state หายหมด → ใช้เฉพาะเมื่อต้องการ hard redirect จริง ๆ (เช่นหลัง 401 interceptor ที่ต้องออกจาก React state เก่า)
:::

::: details ❓ `path="*"` ทำงานอย่างไร — ทำไมถึงไม่ conflict กับ route อื่น?
**แนวคำตอบ:** `*` คือ wildcard match ทุก path ที่ไม่ตรงกับ Route อื่น React Router v6 จัดเรียง specificity อัตโนมัติ: exact path (`/login`, `/admin`) มี priority สูงกว่า wildcard (`*`) ดังนั้น `/login` ยังทำงานปกติ wildcard จะจับเฉพาะ path ที่ไม่มีใครจัดการ
:::

::: details ❓ `React.ReactNode` ต่างจาก `JSX.Element` อย่างไร?
**แนวคำตอบ:** `JSX.Element` คือ type ของ JSX expression เดียว เช่น `<Component />` ส่วน `React.ReactNode` กว้างกว่า — ครอบคลุมทุกสิ่งที่ React render ได้: JSX, string, number, null, undefined, boolean, array ใช้ `React.ReactNode` สำหรับ wrapper component ที่รับ `children` เสมอ เพราะ children อาจเป็น null (component ไม่มีลูก) ก็ได้
:::

::: details ❓ ทำไม `userRole?: UserRole | null` ต้องมีทั้ง `?` (optional) และ `| null`?
**แนวคำตอบ:** สองอย่างนี้ต่างกัน:
- `?` (optional prop) → ไม่ส่ง prop = `undefined` — ใช้เมื่อ Route ไม่ต้องการเช็ค role
- `| null` → ส่งมาแต่ค่าเป็น null — เกิดจาก `auth.user?.role` เมื่อ `auth.user` เป็น null
`auth.user?.role` return `UserRole | undefined` แต่ถ้า prop ไม่รับ null TypeScript จะ error ดังนั้นต้องระบุ `| null` เพื่อรับทั้งสองกรณี
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `useNavigate() may be used only in the context of a Router component` | ใช้ Hook นอก `<BrowserRouter>` | ตรวจว่า component อยู่ใต้ BrowserRouter ใน tree |
| Back button วนซ้ำไม่หยุดหลัง redirect | ไม่ใช้ `replace` ใน Navigate | เพิ่ม `replace` prop ทุก Navigate ที่เป็น guard redirect |
| `/admin` เข้าได้ทั้งที่เป็น student | ลืมส่ง `requiredRole` ใน ProtectedRoute | ตรวจ `<ProtectedRoute requiredRole="admin">` ให้ครบ |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Routes ครบ | ทุก path ทำงานถูกต้อง | บาง route ผิด | ไม่มี routing |
| ProtectedRoute | auth + role guard ถูกทั้งสองชั้น | guard อย่างเดียว | ไม่มี guard |
| Navigate replace | ใช้ replace ถูกที่ ทุก redirect | ใช้ Navigate แต่ไม่มี replace | ไม่มี redirect |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `React Router` | รี-แอ็คท์ เราท์-เตอร์ | Library สำหรับจัดการ URL routing ใน React SPA |
| `Protected Route` | โพร-เทค-ทิด เราท์ | Route ที่ต้องผ่านการตรวจสอบ auth/role ก่อนเข้าถึง |
| `Navigate` | แน็ฟ-วิ-เกท | React Router component ที่ทำ redirect โดยไม่ reload หน้า |
| `replace` | รี-เพลส | ใน Navigate: แทนที่ history entry (กด Back ไม่วนกลับ) |
| `Wildcard` | ไวลด์-คาร์ด | `*` ใน path — match ทุก URL ที่ไม่ตรงกับ route อื่น |
| `SPA` | เอส-พี-เอ | Single Page Application — เว็บที่ไม่ reload หน้าเมื่อ navigate |
| `useNavigate` | ยูส แน็ฟ-วิ-เกท | React Router Hook สำหรับ navigate ใน event handler |
