# Lab: Login UI + Auth Flow ครบวงจร <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ต้องรู้ว่า "ใครเป็นคนยืม" — ต้องมีหน้า Login ที่รับ email/password แสดง error ที่เข้าใจง่าย ป้องกัน double submit และหลัง login สำเร็จต้อง redirect ไปหน้าที่ถูกต้อง โดยไม่ต้อง reload หน้าทั้งหมด
:::

> 💡 **เป้าหมาย Lab นี้:** สร้าง `LoginPage` ที่สมบูรณ์ด้วย Tailwind CSS — รวมความรู้จาก wk3 (Forms + Validation) + wk6 (localStorage + Interceptor) เข้าด้วยกัน

---

## 📖 I: Information

### ขั้นตอนที่ 1 — Auth Flow ทั้งหมด

```
ผู้ใช้เปิดเว็บ
      │
      ▼
App.tsx: const auth = useAuth()
   auth.isAuthenticated?
      │
  No──┤──Yes
      │           ▼
      │      [Navbar + Routes]
      ▼
LoginPage
  กรอก email + password
      │
      ▼
handleSubmit → auth.login(email, password)
      │
 false─┤─true
      │          ▼
      │    localStorage.setItem('token', ...)
      │    localStorage.setItem('user', ...)
      ▼          │
[error msg]      ▼
            App re-render: isAuthenticated = true
                 │
                 ▼
            <Navigate to="/" /> อัตโนมัติ
```

### ขั้นตอนที่ 2 — LoginPage Component

```tsx [src/pages/LoginPage.tsx]
import { useState, type FormEvent } from 'react'
import type { AuthContextType } from '../types'

// [1] Props type — รับ auth object จาก App.tsx
interface LoginPageProps {
  auth: AuthContextType
}

export function LoginPage({ auth }: LoginPageProps) {

  // [2] Form state — Controlled Form (wk3)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  // [3] UI state
  const [error, setError]       = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // [4] Submit handler — async เพราะ auth.login() return Promise<boolean>
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()    // [5] ป้องกัน Browser reload
    setError(null)
    setIsLoading(true)

    const success = await auth.login(email, password)  // [6] เรียก API

    if (!success) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')         // [7] แสดง error
    }
    // [8] ถ้า success → App.tsx จะ re-render + <Navigate to="/" /> อัตโนมัติ
    //     ไม่ต้องเรียก navigate() ที่นี่เอง!

    setIsLoading(false)  // [9] ปิด loading เสมอ (ทั้งสำเร็จและล้มเหลว)
  }

  return (
    // [10] Layout: full-screen center + gradient background
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-700">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl">

        {/* [11] Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🖥️</div>
          <h1 className="text-xl font-bold text-slate-800">ระบบเบิก-จ่ายอุปกรณ์ไอที</h1>
          <p className="text-sm text-slate-500 mt-1">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        {/* [12] Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* [13] Error Alert — แสดงเฉพาะเมื่อมี error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* [14] Email field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              อีเมล
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@school.ac.th"
              required
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* [15] Password field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
              รหัสผ่าน
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {/* [16] Submit Button — disabled ระหว่าง loading */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* [17] Demo hint สำหรับทดสอบ */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-1">ข้อมูลทดสอบ</p>
          <p className="text-xs text-slate-500">admin@school.ac.th / password123</p>
          <p className="text-xs text-slate-500">teacher@school.ac.th / password123</p>
          <p className="text-xs text-slate-500">student@school.ac.th / password123</p>
        </div>

      </div>
    </div>
  )
}
```

**สรุปการทำงาน:** Form `[12]` ใช้ Controlled Form pattern จาก wk3 → `handleSubmit` `[4]` เรียก `auth.login()` → ได้ `false` → แสดง error `[7]` → ได้ `true` → App re-render เอง `[8]` (ไม่ต้อง navigate ที่นี่)

---

### ขั้นตอนที่ 3 — App.tsx: จัดการ Route ที่ถูกต้อง

```tsx [src/App.tsx — route /login]
function App() {
  const auth = useAuth()  // [1] auth state ทั้งหมด

  return (
    <BrowserRouter>
      <Routes>

        {/* [2] /login — ถ้า login แล้วให้ redirect ไป / */}
        <Route path="/login" element={
          auth.isAuthenticated
            ? <Navigate to="/" replace />     // [3] login แล้ว → ออกจากหน้า login
            : <LoginPage auth={auth} />       // [4] ยังไม่ login → แสดงหน้า login
        } />

        {/* [5] / — ต้อง login ก่อน */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
            <EquipmentPage auth={auth} />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}
```

**ทำไม `<Navigate to="/" replace />` ทำงานอัตโนมัติ:**
เมื่อ `login()` สำเร็จ → `setToken(newToken)` ใน useAuth → React re-render App → `auth.isAuthenticated` เป็น `true` → `<Navigate to="/" replace />` ถูก render แทน `<LoginPage>` → router redirect ไป `/`

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React login page component ด้วย TypeScript + Tailwind CSS ที่มี: 1) Controlled Form สำหรับ email และ password 2) Error message กล่องสีแดงเมื่อ login ล้มเหลว 3) ปุ่ม Submit ที่มี `disabled` ระหว่าง loading พร้อมข้อความ 'กำลังเข้าสู่ระบบ...' 4) Layout การ์ดกลางหน้าพร้อม gradient background — อธิบายว่าทำไม component ไม่ต้อง navigate เองเมื่อ login สำเร็จ"
:::

### 📝 PjBL Lab

**เป้าหมาย:** สร้างหน้า Login ที่ทำงานได้จริงครบวงจร

---

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสของตนเองในส่วนล่างของ `LoginPage` หลัง card:

```tsx
<footer style={{ marginTop: 24, textAlign: 'center', color: '#aaa', fontSize: 12 }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
```

---

#### ขั้น 1 — ตรวจสอบ Backend พร้อม

1. ตรวจสอบ Backend รันอยู่:
```bash
cd project/backend && npm run dev  # รันที่ port 3000
```
2. ทดสอบ API ด้วย curl หรือเปิด browser:
```
GET http://localhost:3000/api/health → { "status": "ok" }
```
3. ถ้า database ยังไม่มีข้อมูล:
```bash
npx prisma db push && npm run db:seed
```

---

#### ขั้น 2 — สร้าง LoginPage

1. สร้างหรืออัปเดต `src/pages/LoginPage.tsx` ตาม code ในขั้นตอนที่ 2
2. `npm run dev` → เปิด `http://localhost:5173/login`
3. ตรวจสอบ UI: ต้องเห็นการ์ดสีขาวพร้อม form บน gradient พื้นหลัง ✅

---

#### ขั้น 3 — ทดสอบ Auth Flow ทุก Case

| กรณีทดสอบ | ขั้นตอน | ผลที่คาดหวัง |
| :--- | :--- | :--- |
| Login ถูกต้อง | กรอก `admin@school.ac.th / password123` → กด Submit | redirect ไปหน้าหลัก `/` ✅ |
| Login ผิด | กรอก password ผิด → กด Submit | เห็น error message กล่องแดง ✅ |
| Double submit | กด Submit ระหว่าง loading | ปุ่มถูก disable ✅ |
| Refresh | Login แล้ว refresh หน้า | ยังอยู่ในระบบ ไม่ต้อง login ใหม่ ✅ |
| Logout | กดปุ่ม logout | redirect ไป `/login` ✅ |
| Student → /admin | Login เป็น student → ไปที่ `/admin` | หน้า 403 ✅ |

---

#### ขั้น 4 — ตรวจสอบ Network Tab

1. Login สำเร็จ → เปิด DevTools → Network
2. เลือก request ไปที่ `/api/equipments`
3. ดู **Request Headers** → ต้องเห็น:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
4. เปิด **Application → Local Storage** → ต้องเห็น key `token` และ `user`

---

#### ขั้น Submit — ส่งงาน

- [ ] ทดสอบครบทุก case ในตาราง ขั้น 3
- [ ] ถ่าย screenshot: หน้า Login, หน้าหลัง login, หน้า 403, Network tab ที่เห็น Authorization header
- [ ] `git add src/pages/LoginPage.tsx src/api/`
- [ ] `git commit -m "wk6: complete login page with auth flow"`
- [ ] `git push origin main`
- [ ] เขียนสรุปใน Google Doc: Auth Flow ทำงานยังไง, ทำไม LoginPage ไม่ต้อง navigate เอง, Interceptor ช่วยยังไง + ลิงก์ GitHub + screenshots

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `LoginPage` ไม่ต้อง navigate หลัง login สำเร็จ — React ทำให้อัตโนมัติยังไง?
**แนวคำตอบ:** เมื่อ `auth.login()` สำเร็จ → `setToken(newToken)` ใน `useAuth` → React re-render `App` component → `auth.isAuthenticated` กลายเป็น `true` → ใน JSX ของ App: `auth.isAuthenticated ? <Navigate to="/" /> : <LoginPage />` → React เลือก render `<Navigate to="/" />` แทน → router redirect อัตโนมัติ นี่คือ "reactive routing" — UI เปลี่ยนตาม state โดยไม่ต้องเรียก navigate() เองใน LoginPage
:::

::: details ❓ `disabled={isLoading}` ป้องกัน Double Submit อย่างไร?
**แนวคำตอบ:** ขณะที่ `isLoading` เป็น `true` → `<button disabled>` ไม่ตอบสนองต่อการคลิก → `handleSubmit` จะไม่ถูกเรียกซ้ำ ถ้าไม่มี disabled ผู้ใช้กดปุ่มซ้ำก่อน response กลับมาจะเกิด request ซ้อนกัน อาจทำให้ state ผิดพลาดได้ CSS `disabled:opacity-60 disabled:cursor-not-allowed` ทำให้ผู้ใช้รู้ด้วยสายตาว่าปุ่มไม่ active
:::

::: details ❓ `e.preventDefault()` ใน handleSubmit จำเป็นอย่างไร?
**แนวคำตอบ:** `<form onSubmit>` — เมื่อกด Submit Browser จะ reload หน้าและส่ง form data ไปที่ `action` attribute (default behavior) ซึ่งทำให้ React state หายทั้งหมดและทำ HTTP request ไม่ถูกต้อง `e.preventDefault()` หยุด default behavior นี้ → ให้ JavaScript handle เองด้วย `auth.login()` แทน
:::

::: details ❓ `type FormEvent` จาก React มีประโยชน์อะไรเทียบกับ `any`?
**แนวคำตอบ:** `FormEvent` คือ type ที่ TypeScript รู้ว่า parameter `e` มี method `.preventDefault()` อยู่ → auto-complete ทำงาน → ถ้าพิมพ์ `.preventDefaults()` (ผิด) TypeScript แจ้ง Error ทันที ส่วน `any` ปิด type checking → พิมพ์ผิดก็ไม่รู้ จนกว่าจะ run แล้ว crash ที่ runtime
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| UI สมบูรณ์ | Tailwind ครบ, error msg, loading state | แสดงได้แต่ styling ไม่ครบ | ไม่มี form |
| Auth Flow | login → persist → logout + ทุก case ผ่าน | login ได้แต่ไม่ persist | ไม่ทำงาน |
| Network Tab | เห็น Authorization header ถูกต้อง | เห็น request แต่ไม่มี header | ไม่ได้ตรวจ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `FormEvent` | TypeScript type ของ event จาก `<form onSubmit>` — มี `.preventDefault()` |
| `e.preventDefault()` | หยุด default browser behavior เมื่อ submit form |
| `disabled` | HTML attribute ที่ทำให้ element ไม่ตอบสนองต่อ interaction |
| `Double Submit` | การ submit ซ้ำกันก่อนได้รับ response — ป้องกันด้วย disabled |
| `Auth Flow` | ขั้นตอนการตรวจสอบตัวตนครบวงจร: login → persist → logout |
| `Reactive Routing` | Router เปลี่ยน URL โดยอัตโนมัติตาม state โดยไม่ต้องเรียก navigate() |
| `gradient` | การไล่สีพื้นหลัง — `bg-gradient-to-br from-slate-800 to-slate-700` |
