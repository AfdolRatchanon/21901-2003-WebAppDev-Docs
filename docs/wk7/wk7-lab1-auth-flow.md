# Lab: Auth Flow ครบวงจร <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบต้องการ Navbar ที่แสดงชื่อผู้ใช้ + role badge + ปุ่ม logout และต้องซ่อน/แสดงเมนูตาม role — Lab นี้รวมทุกอย่างที่เรียนมาตั้งแต่ wk6-7 มาสร้าง auth flow ที่สมบูรณ์
:::

> 💡 **เป้าหมาย Lab นี้:** Navbar ที่แสดง active link + role badge + ปุ่ม logout ทำงานร่วมกับ auth system ที่ persist ข้าม refresh

---

## 📖 I: Information

### Navbar Component

::: code-group
```tsx [components/Navbar.tsx]
import { Link, useLocation } from 'react-router-dom'
import type { AuthContextType } from '../types'

// Map role → ชื่อภาษาไทย
const roleLabel: Record<string, string> = {
  admin: 'ผู้ดูแล',
  teacher: 'อาจารย์',
  student: 'นักเรียน',
}

// Map role → Tailwind color classes
const roleBadgeClass: Record<string, string> = {
  admin: 'bg-violet-600 text-white',
  teacher: 'bg-cyan-600 text-white',
  student: 'bg-teal-600 text-white',
}

export function Navbar({ auth }: { auth: AuthContextType }) {
  const location = useLocation()
  const role = auth.user?.role ?? 'student'

  function isActive(path: string) {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-10 bg-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="text-white font-bold text-sm shrink-0">
          🖥️ ระบบเบิก-จ่ายอุปกรณ์ไอที
        </Link>

        {/* Nav Links */}
        <div className="flex gap-1 flex-1">
          <Link to="/" className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isActive('/')
              ? 'text-white bg-white/15'
              : 'text-slate-400 hover:text-white hover:bg-white/10'
          }`}>
            อุปกรณ์
          </Link>

          {/* แสดงเฉพาะ admin และ teacher */}
          {(role === 'admin' || role === 'teacher') && (
            <Link to="/admin" className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              isActive('/admin')
                ? 'text-white bg-white/15'
                : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}>
              จัดการ
            </Link>
          )}
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col items-end gap-0.5 hidden sm:flex">
            <span className="text-slate-100 text-sm font-semibold">{auth.user?.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${roleBadgeClass[role]}`}>
              {roleLabel[role]}
            </span>
          </div>

          <button
            onClick={auth.logout}
            className="text-slate-400 hover:text-white border border-white/20 hover:border-white/50 px-3 py-1.5 rounded text-sm transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>

      </div>
    </nav>
  )
}
```
:::

::: tip 💡 TypeScript Tip — `useLocation`
`useLocation()` จาก `react-router-dom` return object ที่มี `.pathname` (เช่น `"/"`, `"/admin"`) ใช้เปรียบเทียบเพื่อ highlight active nav link ต้องเรียกใน Component ที่อยู่ภายใน `<BrowserRouter>` เท่านั้น
:::

### สรุป Auth Flow ทั้งหมด

```
useAuth() [App.tsx]
├── useState (user, token) ← restore จาก localStorage
├── login() → loginApi() → เก็บ localStorage + setUser/Token
├── logout() → ล้าง localStorage + clearUser/Token
└── isAuthenticated = token !== null

App.tsx renders:
├── Navbar (ถ้า isAuthenticated)
└── Routes:
    ├── /login → LoginPage (auth.login)
    ├── / → ProtectedRoute → EquipmentPage (useEquipments + useEquipmentRealtime)
    └── /admin → ProtectedRoute(role=admin) → AdminPage
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React Navbar component ด้วย TypeScript และ Tailwind CSS โดย: แสดงชื่อแอปเป็น link, แสดง navigation links ที่ highlight เมื่อ active โดยใช้ `useLocation`, แสดง link 'จัดการ' เฉพาะ role admin/teacher เท่านั้น, แสดงชื่อผู้ใช้และ role badge ที่มีสีต่างกันตาม role และมีปุ่ม logout"
:::

### 📝 PjBL Lab — ทดสอบ Complete Auth System

**ขั้น 1: Setup**
- [ ] Backend รันอยู่ที่ port 3000
- [ ] Frontend รันอยู่ที่ port 5173+
- [ ] ทั้งสองเชื่อมต่อกันผ่าน Vite proxy

**ขั้น 2: ทดสอบทุก role**

| Test Case | สิ่งที่คาดหวัง |
| :--- | :--- |
| Login ด้วย `admin@school.ac.th` / `admin123` | เห็น badge "ผู้ดูแล" (violet) + เมนู "จัดการ" |
| Login ด้วย `teacher@school.ac.th` / `teacher123` | เห็น badge "อาจารย์" (cyan) + เมนู "จัดการ" |
| Login ด้วย `student@school.ac.th` / `student123` | เห็น badge "นักเรียน" (teal) + ไม่เห็นเมนู "จัดการ" |
| Student พิมพ์ `/admin` ใน URL bar | เห็นหน้า 403 |
| Refresh หน้า (ขณะ login อยู่) | ยังอยู่ในระบบ ไม่ต้อง login ใหม่ |
| กด Logout | กลับไปหน้า login, localStorage ถูกล้าง |

**ขั้น 3: ทดสอบ Real-time**
- [ ] เปิด 2 tab/window
- [ ] ยืมอุปกรณ์ใน tab หนึ่ง
- [ ] อีก tab ต้องเห็นสีการ์ดเปลี่ยนทันที (ไม่ต้อง refresh)

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ `useLocation` ต่างจาก `window.location` อย่างไร?
**แนวคำตอบ:** `window.location` เป็น browser API ดั้งเดิม ส่วน `useLocation` จาก react-router-dom เป็น React Hook ที่ integrate กับ router state — เมื่อ navigate เปลี่ยน Component จะ re-render อัตโนมัติ ทำให้ active link อัปเดตได้ ถ้าใช้ `window.location` ไม่มี re-render
:::

::: details ❓ `Record<string, string>` ต่างจาก `{ [key: string]: string }` อย่างไร?
**แนวคำตอบ:** ทั้งสองให้ผลเหมือนกัน `Record<K, V>` เป็น TypeScript built-in utility type ที่อ่านง่ายกว่า เหมาะสำหรับ "mapping object" ที่ key เป็น `K` และ value เป็น `V` อ่านโค้ดแล้วเข้าใจ intent ชัดกว่า index signature
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Navbar สมบูรณ์ | Active link + role badge + logout ทำงานครบ | บางส่วนขาด | ไม่มี navbar |
| Role-based menu | admin/teacher เห็นเมนูจัดการ, student ไม่เห็น | ทำงานบางกรณี | ไม่มี |
| Complete auth flow | login → persist → role access → logout ครบ | บางขั้นตอนขาด | ไม่ทำงาน |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `useLocation` | React Router hook ที่ return ข้อมูล URL ปัจจุบัน |
| `Active Link` | Nav link ที่ highlight เมื่อ path ตรงกับหน้าปัจจุบัน |
| `Role Badge` | UI element แสดง role ของผู้ใช้ด้วยสีต่างกัน |
| `Sticky Nav` | Navbar ที่ติดอยู่บนสุดของหน้าจอแม้ scroll ลง |
| `Record<K,V>` | TypeScript utility type สำหรับ mapping object |
