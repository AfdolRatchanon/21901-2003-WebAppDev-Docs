# Lab: สร้างหน้า Login + Auth Flow <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ต้องรู้ว่า "ใครเป็นคนยืม" — ต้องมีระบบ Login ที่แสดงชื่อผู้ใช้และ role ให้ถูกต้อง พร้อม redirect หลัง login สำเร็จ และป้องกันไม่ให้คนที่ไม่ได้ login เข้าถึงข้อมูล
:::

> 💡 **เป้าหมาย Lab นี้:** สร้าง LoginPage ที่สมบูรณ์ด้วย Tailwind CSS + error handling + loading state พร้อม auth flow ครบวงจร

---

## 📖 I: Information

### Auth Flow ทั้งหมด

```
[ผู้ใช้เปิดเว็บ]
      │
      ▼
[App.tsx: useAuth()]
   isAuthenticated?
      │
  No ─┤─ Yes
      │         ▼
      │    [แสดง Navbar + เนื้อหา]
      ▼
[LoginPage]
  กรอก email + password
      │
      ▼
[handleSubmit → auth.login()]
      │
  fail─┤─ success
      │          ▼
      │     [เก็บ token + user ใน localStorage]
      ▼          │
[แสดง error]     ▼
             [App.tsx: isAuthenticated = true]
                  │
                  ▼
             [Navigate to "/"]
```

### LoginPage Component

::: code-group
```tsx [pages/LoginPage.tsx]
import { useState, type FormEvent } from 'react'
import type { AuthContextType } from '../types'

interface LoginPageProps {
  auth: AuthContextType
}

export function LoginPage({ auth }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()          // ป้องกัน page reload
    setError(null)
    setIsLoading(true)

    const success = await auth.login(email, password)
    if (!success) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
    // ถ้า success → App.tsx จะ render <Navigate to="/" /> อัตโนมัติ

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-800 to-slate-700">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🖥️</div>
          <h1 className="text-xl font-bold text-slate-800">ระบบเบิก-จ่ายอุปกรณ์ไอที</h1>
          <p className="text-sm text-slate-500 mt-1">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Input */}
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

          {/* Password Input */}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-1"
          >
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
          <p className="text-xs text-slate-400 font-semibold mb-1">ข้อมูลทดสอบ</p>
          <p className="text-xs text-slate-500">admin@school.ac.th / admin123</p>
          <p className="text-xs text-slate-500">teacher@school.ac.th / teacher123</p>
          <p className="text-xs text-slate-500">student@school.ac.th / student123</p>
        </div>

      </div>
    </div>
  )
}
```
:::

::: tip 💡 TypeScript Tip — `FormEvent`
`type FormEvent` จาก `'react'` คือ type ของ event ที่เกิดจาก `<form onSubmit>` — TypeScript จะบังคับให้เราเรียก `e.preventDefault()` อย่างถูกต้อง หากไม่ระบุ type จะได้เป็น `any` ซึ่งไม่ดี
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React login page component ด้วย TypeScript และ Tailwind CSS โดยต้องมี: input สำหรับ email และ password พร้อม label, แสดง error message (กล่องสีแดง), ปุ่มที่แสดงข้อความ 'กำลังเข้าสู่ระบบ...' ขณะ loading และ layout แบบการ์ดกลางหน้าพร้อม gradient background ใช้ type `FormEvent` สำหรับ submit handler"
:::

### 📝 PjBL Lab

**ขั้น 1: สร้าง LoginPage**
- [ ] สร้าง `src/pages/LoginPage.tsx` ตาม code ด้านบน
- [ ] รันโปรเจกต์ — หน้า Login ควรแสดงที่ `/login`
- [ ] ทดสอบ: กรอกข้อมูลผิด — ควรเห็น error message

**ขั้น 2: ตรวจสอบ Auth Flow**
- [ ] Login ด้วย `admin@school.ac.th` / `admin123`
- [ ] DevTools → Application → Local Storage: ตรวจว่ามี `token` และ `user`
- [ ] กด Refresh — ควรยังอยู่ใน เว็บโดยไม่ต้อง login ใหม่
- [ ] กด Logout — Local Storage ควรถูกล้าง redirect ไป /login

**ขั้น 3: ทดสอบ Role-based Access**
- [ ] Login เป็น student → ลอง navigate ไป `/admin` → ควรเห็นหน้า 403
- [ ] Login เป็น admin → ลอง navigate ไป `/admin` → ควรเข้าได้

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม button ต้องมี `disabled={isLoading}`?
**แนวคำตอบ:** ป้องกัน Double Submit — ถ้าผู้ใช้กดปุ่ม login ขณะที่ request กำลังทำงานอยู่ อาจเกิด request ซ้ำกันได้ `disabled` ป้องกันการกดซ้ำ ส่วน `opacity-60 cursor-not-allowed` ทำให้ผู้ใช้รู้ว่าปุ่มถูก disable อยู่
:::

::: details ❓ Login สำเร็จแต่ทำไม Component ไม่ต้อง redirect เอง?
**แนวคำตอบ:** เพราะ `App.tsx` เช็ค `auth.isAuthenticated` — เมื่อ `login()` สำเร็จ `setToken(newToken)` ทำให้ React re-render `App` ใหม่ `App` จะเห็น `isAuthenticated = true` แล้ว render `<Navigate to="/" />` แทน `<LoginPage>` โดยอัตโนมัติ
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| UI สมบูรณ์ | Tailwind ครบ, responsive | แสดงได้แต่ styling ไม่ครบ | ไม่มี form |
| Error handling | แสดง error message ถูกต้อง | มีแต่ไม่แสดงใน UI | ไม่มี |
| Auth flow | login → persist → logout ครบ | login ได้แต่ไม่ persist | ไม่ทำงาน |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `FormEvent` | TypeScript type ของ event ที่เกิดจาก form submit |
| `e.preventDefault()` | ป้องกัน browser reload หน้าเมื่อ submit form |
| `disabled` | HTML attribute ที่ทำให้ element ไม่สามารถกดได้ |
| `Auth Flow` | ขั้นตอนการตรวจสอบตัวตนทั้งหมด ตั้งแต่ login ถึง logout |
| `Double Submit` | การ submit form ซ้ำกันก่อนได้รับ response — ป้องกันด้วย disabled |
