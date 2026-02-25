# React Router v6 + Protected Routes <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบมีหลายหน้า: `/login`, `/` (รายการอุปกรณ์), `/admin` (จัดการ) — นักเรียนที่ไม่ได้ login ต้องไม่เข้า `/` ได้ และ student ต้องไม่เข้า `/admin` ต้องจัดการ routing และ authorization ด้วย React Router v6!
:::

> 💡 **เปรียบเทียบ:** React Router เหมือน "ป้ายบอกทาง" ในอาคาร — บอกว่า path ไหนนำไปห้องไหน ส่วน Protected Route เหมือน "รปภ." ที่เฝ้าห้องประชุม — ตรวจบัตรก่อนให้เข้า

---

## 📖 I: Information

### Routes ทั้งหมดในโปรเจกต์

```
Path          Component         Guard
─────────────────────────────────────────────────────
/login        LoginPage         ถ้า login แล้ว → redirect /
/             EquipmentPage     ต้อง login (ProtectedRoute)
/admin        AdminPage         ต้อง login + role=admin
/forbidden    403 page          -
/*            redirect /        catch-all
```

### App.tsx — จุดกำหนด Routes

::: code-group
```tsx [App.tsx]
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'

function App() {
  const auth = useAuth()  // auth state เดียวสำหรับทั้งแอป

  return (
    <BrowserRouter>
      {/* Navbar แสดงเฉพาะเมื่อ login แล้ว */}
      {auth.isAuthenticated && <Navbar auth={auth} />}

      <Routes>

        {/* /login — redirect ไป / ถ้า login แล้ว */}
        <Route
          path="/login"
          element={
            auth.isAuthenticated
              ? <Navigate to="/" replace />
              : <LoginPage auth={auth} />
          }
        />

        {/* / — ต้อง login */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
              <EquipmentPage auth={auth} />
            </ProtectedRoute>
          }
        />

        {/* /admin — ต้อง login + role=admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAuthenticated={auth.isAuthenticated}
              userRole={auth.user?.role}
              requiredRole="admin"
            >
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* /forbidden — 403 page */}
        <Route
          path="/forbidden"
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <p className="text-6xl font-black text-slate-300 mb-4">403</p>
                <p className="text-slate-600 font-semibold">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
              </div>
            </div>
          }
        />

        {/* catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}
```

```tsx [components/ProtectedRoute.tsx]
import { Navigate } from 'react-router-dom'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: React.ReactNode
  isAuthenticated: boolean
  userRole?: UserRole | null
  requiredRole?: UserRole
}

export function ProtectedRoute({
  children,
  isAuthenticated,
  userRole,
  requiredRole,
}: ProtectedRouteProps) {
  // ยังไม่ได้ login → ไป /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // role ไม่ตรง → ไป /forbidden (403)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/forbidden" replace />
  }

  // ผ่านทั้งหมด → render children
  return <>{children}</>
}
```
:::

::: tip 💡 TypeScript Tip — `React.ReactNode`
`children: React.ReactNode` คือ type ที่รับได้ทุกอย่างที่ React render ได้ — string, number, JSX element, array, null ฯลฯ ใช้เมื่อต้องการ wrapper component ที่รับ children ของ type ใดก็ได้
:::

### `replace` prop ใน `<Navigate>`

```tsx
// replace = true: แทนที่ history entry (กด Back จะข้ามหน้านี้)
<Navigate to="/login" replace />

// ถ้าไม่ใช้ replace: กด Back จะกลับมาหน้าที่ redirect แล้ว redirect อีกครั้ง
// (เกิด redirect loop ถ้าไม่ได้ login)
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้างการตั้งค่า React Router v6 ด้วย TypeScript รวมถึง: component ชื่อ ProtectedRoute ที่ redirect ไป /login ถ้ายังไม่ได้ login และ redirect ไป /forbidden ถ้า role ของผู้ใช้ไม่ตรงกับ requiredRole และแสดงวิธีใช้งานใน App.tsx พร้อม BrowserRouter, Routes และ Route"
:::

### 📝 PjBL Lab

- [ ] ดู `App.tsx` — นับว่ามีกี่ Route และแต่ละ Route ใช้ guard อะไร
- [ ] ดู `ProtectedRoute.tsx` — เข้าใจ logic 2 เงื่อนไข (auth + role)
- [ ] ทดสอบทุก path: `/login`, `/`, `/admin`, `/forbidden`, `/something-random`
- [ ] ทดสอบ: ลอง navigate ไป `/admin` โดยตรง (พิมพ์ใน URL bar) ขณะเป็น student
- [ ] ทดสอบ: `replace` ใน Navigate — ลอง กด Back หลัง login แล้วดูว่าเกิดอะไร
- [ ] เพิ่ม route `/about` ที่ทุกคนเข้าได้ (ไม่ต้องใช้ ProtectedRoute)

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `<Navigate replace />` ดีกว่า `window.location.href = '/'`?
**แนวคำตอบ:** `<Navigate>` ทำงานภายใน React Router — ไม่ reload หน้า, ไม่เสีย state, และ React re-render ถูกต้อง ส่วน `window.location.href` reload หน้าทั้งหมด ทำให้ React state หาย (เหมาะใช้เฉพาะเมื่อต้องการ hard reload เช่นหลัง 401)
:::

::: details ❓ `path="*"` ทำงานอย่างไร?
**แนวคำตอบ:** `*` คือ wildcard — match ทุก path ที่ไม่ตรงกับ Route อื่น React Router v6 จัดเรียง routes ให้เอง โดย specific path มี priority สูงกว่า wildcard ดังนั้น `/login` ยังทำงานปกติ wildcard จะจับแค่ path ที่ไม่มีใครจัดการ
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Routes ครบ | ทุก path ทำงานถูกต้อง | บาง route ผิด | ไม่มี routing |
| ProtectedRoute | auth + role guard ถูก | guard อย่างเดียว | ไม่มี guard |
| Navigate replace | ใช้ replace ถูกที่ | ใช้ Navigate แต่ไม่มี replace | ไม่มี redirect |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `React Router` | Library สำหรับจัดการ URL routing ใน React SPA |
| `Route Guard` | ตัวตรวจสอบก่อนให้ผู้ใช้เข้าถึง route |
| `Navigate` | React Router component ที่ทำ redirect |
| `replace` | ใน Navigate: แทนที่ history แทนที่จะเพิ่ม entry ใหม่ |
| `Wildcard` | `*` ใน path — match ทุกอย่างที่ไม่ตรงกับ route อื่น |
| `SPA` | Single Page Application — เว็บที่ไม่ reload หน้าเมื่อ navigate |
