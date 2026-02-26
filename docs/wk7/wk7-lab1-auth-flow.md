# Lab: Navbar + Auth Flow ครบวงจร <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบต้องการ Navbar ที่: แสดงชื่อผู้ใช้ + role badge (สีต่างกันแต่ละ role) + ปุ่ม Logout + highlight เมนูที่ active อยู่ — และต้องซ่อนเมนู "จัดการ" สำหรับ student Lab นี้รวม wk6-7 ทั้งหมดมาสร้าง auth flow ที่สมบูรณ์
:::

> 💡 **เป้าหมาย Lab นี้:** Navbar ที่ดูเป็นมืออาชีพ + ทดสอบ auth flow ครบวงจรตั้งแต่ login → role check → real-time → logout

---

## 📖 I: Information

### ขั้นตอนที่ 1 — Navbar Component

```tsx [src/components/Navbar.tsx]
import { Link, useLocation } from 'react-router-dom'
import type { AuthContextType } from '../types'

// [1] Map role → ชื่อภาษาไทย
const roleLabel: Record<string, string> = {
  admin:   'ผู้ดูแล',
  teacher: 'อาจารย์',
  student: 'นักเรียน',
}

// [2] Map role → Tailwind badge classes (สีต่างกันแต่ละ role)
const roleBadgeClass: Record<string, string> = {
  admin:   'bg-violet-600 text-white',   // [3] ม่วง = admin
  teacher: 'bg-cyan-600 text-white',     // [4] ฟ้า = teacher
  student: 'bg-teal-600 text-white',     // [5] เขียว = student
}

export function Navbar({ auth }: { auth: AuthContextType }) {
  const location = useLocation()           // [6] Hook อ่าน URL ปัจจุบัน
  const role = auth.user?.role ?? 'student'  // [7] default student ถ้า null

  // [8] เช็คว่า path ปัจจุบัน active ไหม
  function isActive(path: string) {
    return location.pathname === path
  }

  return (
    // [9] sticky top — ติดอยู่บนสุดเมื่อ scroll
    <nav className="sticky top-0 z-10 bg-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-4">

        {/* [10] Logo — Link ไปหน้าหลัก */}
        <Link to="/" className="text-white font-bold text-sm shrink-0">
          🖥️ ระบบเบิก-จ่ายอุปกรณ์ไอที
        </Link>

        {/* [11] Nav Links */}
        <div className="flex gap-1 flex-1">

          {/* ลิงก์อุปกรณ์ — highlight ถ้า pathname = "/" */}
          <Link to="/" className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            isActive('/')
              ? 'text-white bg-white/15'                          // [12] active
              : 'text-slate-400 hover:text-white hover:bg-white/10' // [13] inactive
          }`}>
            อุปกรณ์
          </Link>

          {/* [14] เมนูจัดการ — แสดงเฉพาะ admin และ teacher */}
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

        {/* [15] User Info + Logout */}
        <div className="flex items-center gap-3 shrink-0">

          {/* ชื่อ + role badge */}
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="text-slate-100 text-sm font-semibold">
              {auth.user?.name}  {/* [16] optional chaining */}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${roleBadgeClass[role]}`}>
              {roleLabel[role]}  {/* [17] ชื่อ role ภาษาไทย */}
            </span>
          </div>

          {/* [18] ปุ่ม Logout */}
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

**สรุปการทำงาน:** `useLocation()` `[6]` อ่าน URL → `isActive()` `[8]` เปรียบเทียบ → highlight ลิงก์ที่ active `[12]` → `roleBadgeClass[role]` `[2]` กำหนดสี badge → ซ่อนเมนูจัดการสำหรับ student `[14]`

---

### ขั้นตอนที่ 2 — Auth Flow ทั้งหมด (สรุป)

```
useAuth() [App.tsx]
├── useState(user, token)  ← Lazy Initializer อ่านจาก localStorage
├── login() → loginApi() → เก็บ localStorage + setUser/Token + Axios header
├── logout() → ล้าง localStorage + clearUser/Token + delete Axios header
└── isAuthenticated = token !== null

App.tsx renders:
├── Navbar (ถ้า isAuthenticated)
└── Routes:
    ├── /login  → LoginPage (ส่ง auth.login)
    ├── /       → ProtectedRoute → EquipmentPage (useEquipments + useEquipmentRealtime)
    └── /admin  → ProtectedRoute(role=admin) → AdminPage
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง Navbar component ด้วย TypeScript + Tailwind CSS + React Router v6 โดย: 1) ใช้ `useLocation` highlight nav link ที่ active 2) แสดง role badge สีต่างกันด้วย `Record<string, string>` mapping 3) ซ่อนเมนู 'จัดการ' เฉพาะ role admin/teacher 4) sticky top-0 — อธิบายว่า `useLocation` ต่างจาก `window.location` อย่างไร"
:::

### 📝 PjBL Lab

**เป้าหมาย:** ทดสอบ Complete Auth System ครบวงจร

---

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสใน `EquipmentPage` หรือ `Navbar`:

```tsx
<footer style={{ padding: '8px 24px', textAlign: 'center', color: '#aaa', fontSize: 11, borderTop: '1px solid #e2e8f0' }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
```

---

#### ขั้น 1 — Setup Backend

```bash
cd project/backend
npm run dev       # Backend รันที่ port 3000
# ถ้าฐานข้อมูลว่าง:
# npx prisma db push && npm run db:seed
```

---

#### ขั้น 2 — ทดสอบทุก Role

| สิ่งที่ทดสอบ | account | ผลที่คาดหวัง |
| :--- | :--- | :--- |
| Login admin | admin@school.ac.th / password123 | badge "ผู้ดูแล" สีม่วง + เมนู "จัดการ" ✅ |
| Login teacher | teacher@school.ac.th / password123 | badge "อาจารย์" สีฟ้า + เมนู "จัดการ" ✅ |
| Login student | student@school.ac.th / password123 | badge "นักเรียน" สีเขียว + ไม่เห็นเมนู "จัดการ" ✅ |
| Student → /admin | พิมพ์ URL ตรง | หน้า 403 ✅ |
| Refresh ขณะ login | F5 | ยังอยู่ในระบบ ✅ |
| Logout | กดปุ่ม | localStorage ว่าง + redirect /login ✅ |

---

#### ขั้น 3 — ทดสอบ Real-time (ต้องมี Backend + Socket.io)

1. เปิด 2 tab ใน Browser URL เดียวกัน
2. Login ทั้งสอง tab
3. Tab 1: กดยืมอุปกรณ์
4. Tab 2: ต้องเห็นสีการ์ดเปลี่ยนทันทีโดยไม่ refresh ✅
5. ตรวจ Connection indicator: "● เชื่อมต่อแล้ว (Real-time)"

---

#### ขั้น 4 — ตรวจสอบ Network + Storage

1. DevTools → Application → Local Storage: ตรวจ `token` + `user`
2. DevTools → Network: ตรวจ `Authorization: Bearer ...` header ในทุก request
3. DevTools → Network → WS tab: ดู Socket.io WebSocket connection

---

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย screenshot: Navbar ของแต่ละ role (3 ภาพ), หน้า 403, Real-time update (2 window)
- [ ] `git add src/components/Navbar.tsx`
- [ ] `git commit -m "wk7: complete navbar with role badge and auth flow testing"`
- [ ] `git push origin main`
- [ ] เขียนสรุป Google Doc: ทำไม `useLocation` ต้องอยู่ใน BrowserRouter, roleBadgeClass ทำงานยังไง, ทดสอบอะไรบ้าง + ลิงก์ GitHub + screenshots ครบ

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ `useLocation` ต่างจาก `window.location` อย่างไร — ทำไมต้องใช้ตัวไหน?
**แนวคำตอบ:** `window.location` คือ browser API ดั้งเดิม อ่านค่าได้ครั้งเดียว ไม่มี re-render เมื่อ URL เปลี่ยน ถ้า Navbar ใช้ `window.location.pathname` ตอน navigate ไป `/admin` → Navbar ไม่ re-render → active link ไม่เปลี่ยน
`useLocation()` เป็น React Hook ที่ integrate กับ React Router — เมื่อ URL เปลี่ยน Hook trigger re-render → `isActive()` คำนวณใหม่ → active link เปลี่ยนทันที
:::

::: details ❓ `Record<string, string>` ต่างจาก `{ [key: string]: string }` อย่างไร?
**แนวคำตอบ:** ทั้งสองให้ผลเหมือนกัน — `Record<K, V>` เป็น TypeScript built-in utility type ที่ syntax อ่านง่ายกว่า Index Signature ชัดเจนกว่าว่าเป็น "mapping จาก K ไป V" ใช้กับ role mapping เช่น `Record<'admin'|'teacher'|'student', string>` สามารถระบุ key เฉพาะที่รองรับได้ TypeScript จะแจ้ง error ถ้าลืม case
:::

::: details ❓ `?? 'student'` ใน `auth.user?.role ?? 'student'` คืออะไร?
**แนวคำตอบ:** `??` คือ **Nullish Coalescing Operator** — คืนค่าขวาถ้าค่าซ้ายเป็น `null` หรือ `undefined` เท่านั้น (ต่างจาก `||` ที่คืนค่าขวาถ้าค่าซ้าย falsy ด้วย เช่น `0`, `''`)
`auth.user?.role` อาจเป็น `undefined` (ถ้า `auth.user` เป็น null) → `?? 'student'` ใช้ค่า default 'student' แทน → `roleBadgeClass['student']` ทำงานได้ปกติ
:::

::: details ❓ `(role === 'admin' || role === 'teacher')` — ทำไมไม่ใช้ `role !== 'student'` แทน?
**แนวคำตอบ:** เป็นเรื่องความตั้งใจ (Intent) ชัดเจน — `role !== 'student'` หมายถึง "ทุก role ที่ไม่ใช่ student ซึ่งรวม role อื่น ๆ ที่อาจเพิ่มในอนาคต เช่น 'superadmin', 'guest' ด้วย ส่วน `role === 'admin' || role === 'teacher'` หมายถึง "เฉพาะ admin และ teacher เท่านั้น" — explicit กว่า ปลอดภัยกว่าเมื่อระบบขยาย role ในอนาคต
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Navbar สมบูรณ์ | Active link + role badge + logout ทำงานครบ | บางส่วนขาด | ไม่มี Navbar |
| Role-based menu | admin/teacher เห็นจัดการ, student ไม่เห็น | ทำงานบางกรณี | ไม่มี |
| Complete auth flow | login → persist → role → real-time → logout | บางขั้นตอนขาด | ไม่ทำงาน |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `useLocation` | React Router Hook ที่ return ข้อมูล URL ปัจจุบัน + trigger re-render เมื่อเปลี่ยน |
| `Active Link` | Nav link ที่ highlight เมื่อ pathname ตรงกับหน้าปัจจุบัน |
| `Role Badge` | UI element แสดง role ผู้ใช้ด้วยสีต่างกัน |
| `Sticky Nav` | Navbar ที่ติดบนสุดของหน้าจอแม้ scroll ลง (`sticky top-0`) |
| `Record<K,V>` | TypeScript utility type สำหรับ mapping object — `Record<'admin', string>` |
| `Nullish Coalescing` | `??` — คืนค่า default ถ้าค่าซ้ายเป็น null/undefined |
| `Optional Chaining` | `?.` — เข้าถึง property โดยไม่ crash ถ้า null/undefined |
