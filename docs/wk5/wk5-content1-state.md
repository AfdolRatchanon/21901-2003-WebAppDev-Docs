# จัดการ State ด้วย Props + Context <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
`auth` (ข้อมูลผู้ใช้ที่ล็อกอิน) ต้องใช้ในหลาย Component: `Navbar` (แสดงชื่อ), `EquipmentPage` (เช็ค role), `ProtectedRoute` (ตรวจสอบสิทธิ์) — ถ้าส่ง props ทุกชั้นจะเป็น "Props Drilling" ที่จัดการยาก วิธีแก้คือใช้ **Context** หรือออกแบบ state ให้ถูกต้องตั้งแต่ต้น
:::

> 💡 **เปรียบเทียบ:** Props Drilling เหมือนส่งกุญแจบ้านผ่านคนกลาง 5 คน ก่อนถึงมือคนที่ต้องการ — Context เหมือนแขวนกุญแจไว้ที่ป้ายส่วนกลาง ใครต้องการก็หยิบได้เลย

---

## 📖 I: Information

### AuthContextType — กำหนด Type ให้ Context

```ts [src/types/index.ts]
export type UserRole = 'admin' | 'teacher' | 'student'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
}

// Type ของ auth context ที่ส่งผ่านทั้งแอป
export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}
```

### วิธีที่โปรเจกต์ใช้: Props-based State (ไม่ใช้ Context)

โปรเจกต์นี้เลือก **ส่ง `auth` เป็น props** จาก `App.tsx` โดยตรง — เพราะ Component ที่ต้องการ `auth` มีไม่มากและ hierarchy ไม่ลึก:

::: code-group
```tsx [App.tsx — ส่ง auth ลงไป]
function App() {
  const auth = useAuth()  // สร้าง auth state ที่นี่ที่เดียว

  return (
    <BrowserRouter>
      {/* Navbar รับ auth เพื่อแสดงชื่อ+ปุ่ม logout */}
      {auth.isAuthenticated && <Navbar auth={auth} />}

      <Routes>
        <Route path="/login" element={
          auth.isAuthenticated
            ? <Navigate to="/" replace />
            : <LoginPage auth={auth} />   // ← ส่ง auth.login
        } />

        <Route path="/" element={
          <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
            <EquipmentPage auth={auth} />  // ← ส่ง auth.user
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute
            isAuthenticated={auth.isAuthenticated}
            userRole={auth.user?.role}    // ← ส่ง role เพื่อเช็คสิทธิ์
            requiredRole="admin"
          >
            <AdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
```

```tsx [ProtectedRoute.tsx — รับ props ตรวจสอบสิทธิ์]
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
  // ถ้าไม่ได้ login → redirect ไป /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ถ้า role ไม่ตรง → redirect ไป /forbidden (403)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
```
:::

::: tip 💡 TypeScript Tip — Optional Chaining `?.`
`auth.user?.role` อ่านว่า "ถ้า `auth.user` ไม่ใช่ null/undefined ให้เข้าถึง `.role`" — ถ้า `user` เป็น null จะได้ `undefined` แทนการ throw error ทำให้โค้ดปลอดภัยโดยไม่ต้อง `if (auth.user) { auth.user.role }`
:::

### เปรียบเทียบ: Props vs Context

| | Props (วิธีที่โปรเจกต์ใช้) | React Context |
| :--- | :--- | :--- |
| ความเหมาะสม | Component tree ไม่ลึก | Component tree ลึกมาก |
| ความซับซ้อน | ต่ำ — explicit | สูงกว่า — ต้องสร้าง Provider |
| TypeScript | ง่าย | ต้องระวัง default value |
| Performance | ดี | อาจ re-render ถ้าไม่ optimize |

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง TypeScript interface ชื่อ `AuthContextType` ที่มี: `user: User | null`, `token: string | null`, `login: (email, password) => Promise<boolean>`, `logout: () => void`, `isAuthenticated: boolean` จากนั้นแสดงวิธีส่งมันเป็น props จาก parent component App ไปยัง child components"
:::

### 📝 PjBL Lab

- [ ] ดู `src/types/index.ts` — หา `AuthContextType` และเข้าใจทุก field
- [ ] ดู `App.tsx` — trace ว่า `auth` ถูกส่งไปยัง Component ไหนบ้าง
- [ ] ดู `ProtectedRoute.tsx` — เข้าใจ logic redirect 2 กรณี
- [ ] ทดสอบ: login เป็น student แล้วลอง navigate ไป `/admin` — ควรเห็น 403
- [ ] ทดสอบ: login เป็น admin ควรเข้า `/admin` ได้
- [ ] วาด Component tree แสดงว่า `auth` ไหลจาก `App` ไปยัง Component ไหนบ้าง

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ Props Drilling คืออะไร และเมื่อไรควรใช้ Context แทน?
**แนวคำตอบ:** Props Drilling คือการส่ง props ผ่าน Component กลางที่ไม่ได้ใช้ข้อมูลนั้น ถ้าต้องส่งผ่าน 3+ ชั้น หรือข้อมูลใช้ใน Component ที่ไม่เกี่ยวกัน ควรใช้ Context แต่โปรเจกต์นี้ `auth` ใช้แค่ใน Navbar และ Pages ซึ่ง App ส่งตรงได้เลย
:::

::: details ❓ `<>{children}</>` คืออะไร?
**แนวคำตอบ:** `<>...</>` คือ React Fragment — wrapper ที่ไม่สร้าง DOM element เพิ่ม ใช้เมื่อต้องการ return หลาย element หรือในกรณีนี้ใช้ wrap `children` เพื่อให้ TypeScript พอใจว่า JSX มี root element
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| AuthContextType | กำหนด type ครบถูกต้อง | บาง field ขาด/type ผิด | ไม่มี type |
| ProtectedRoute | redirect ทั้ง 2 กรณีถูก | redirect ได้กรณีเดียว | ไม่มี guard |
| Role-based Access | student ไม่เข้า /admin | ทำงานได้บางส่วน | ไม่มี RBAC |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Props Drilling` | การส่ง props ผ่าน Component กลางที่ไม่ได้ใช้ข้อมูล |
| `Context` | React mechanism สำหรับแชร์ state ข้าม component tree |
| `Optional Chaining` | `?.` syntax ป้องกัน error จาก null/undefined |
| `RBAC` | Role-Based Access Control — ควบคุมสิทธิ์ตาม role ของผู้ใช้ |
| `Protected Route` | Route ที่ต้องผ่านการตรวจสอบก่อนเข้าถึง |
