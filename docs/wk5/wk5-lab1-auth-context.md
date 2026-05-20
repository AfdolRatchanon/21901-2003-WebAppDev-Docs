# Lab: AuthContext — เชื่อม useAuth กับ Context API <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** รวม `useAuth` (wk5-content1) และ Context API (wk5-content2) เข้าด้วยกัน สร้าง `AuthProvider` ที่จะใช้ใน wk6 (Login UI) และ wk7 (Protected Routes)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ตอนนี้ `useAuth()` ทำงานได้แล้ว แต่ถ้าต้องการให้ `Navbar`, `EquipmentPage`, และ `ProtectedRoute` ใช้ข้อมูล auth ร่วมกัน ต้องส่ง `auth` เป็น props ผ่านทุก component — ยิ่งแอปใหญ่ยิ่ง drill ลึก

วิธีแก้: ห่อ `useAuth()` ด้วย Context Provider ครั้งเดียว ทุก component เรียกใช้ `useAuthContext()` ได้เลยโดยไม่ต้องรับ props
:::

> 💡 **เปรียบเทียบ:** `useAuth` เหมือนสร้างแหล่งน้ำ, Context เหมือนท่อประปา — ติดตั้ง Provider ครั้งเดียว ทุกห้องเปิดก๊อกใช้ได้เลย ไม่ต้องแบกถังน้ำส่งทีละห้อง

## 📖 I: Information

### ภาพรวม Auth Flow ของโปรเจกต์

```
src/main.tsx
└── <App />
    └── <AuthProvider>           ← wk5-lab: สร้างที่นี่
        │   useAuth() อยู่ใน Provider
        │   ส่งค่าผ่าน AuthContext
        │
        ├── <Navbar />           ← useAuthContext() → แสดงชื่อ user
        ├── <EquipmentPage />    ← useAuthContext() → เช็ค role ก่อน borrow (wk7)
        └── <LoginPage />        ← useAuthContext() → เรียก auth.login() (wk6)
```

### useAuth vs Context API — ทำหน้าที่ต่างกัน

```
useAuth()       →  เก็บ state + logic  (user, token, login, logout)
Context API     →  กระจาย state ไปทั่ว  (ไม่ต้อง props drilling)

รวมกัน:
  AuthProvider ใช้ useAuth() ข้างใน
  ส่งผลลัพธ์ผ่าน AuthContext.Provider
  ทุก component เรียก useAuthContext() ดึงค่าได้เลย
```

## 🛠️ A: Application

### ขั้น 0 — Student Identity

ตรวจสอบว่ามี footer แสดงชื่อ-รหัสนักเรียนใน `src/pages/EquipmentPage.tsx` อยู่แล้ว ไม่ต้องเพิ่มใหม่

### ขั้น 1 — สร้าง AuthContext

::: code-group
```ts [src/context/AuthContext.ts]
import { createContext, useContext } from 'react'
import type { AuthContextType } from '../types'

// [1] สร้าง Context — ค่าเริ่มต้น null (ป้องกันเรียกนอก Provider)
export const AuthContext = createContext<AuthContextType | null>(null)

// [2] custom hook ที่ตรวจสอบ null ให้อัตโนมัติ
export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext)               // [3] อ่านค่าจาก Context
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx                                        // [4] return ค่าที่ตรวจแล้ว
}
```

```ts [src/types/index.ts — AuthContextType ที่ใช้]
// (มีอยู่แล้วจาก wk5-content1 — ไม่ต้องเพิ่มใหม่)
export interface AuthContextType {
  user:            User | null
  token:           string | null
  login:           (email: string, password: string) => Promise<boolean>
  logout:          () => void
  isAuthenticated: boolean
}
```
:::

> **สรุปการทำงาน:** [1] `createContext<T | null>(null)` ใช้ null เป็น default เพื่อ detect เมื่อเรียกนอก Provider [2-4] `useAuthContext` ห่อ `useContext` + throw error ชัดเจน แทนที่จะได้ null แล้ว crash ไม่รู้สาเหตุ

### ขั้น 2 — สร้าง AuthProvider

::: code-group
```tsx [src/context/AuthProvider.tsx]
import { useAuth } from '../hooks/useAuth'   // [1] logic อยู่ใน hook เดิม
import { AuthContext } from './AuthContext'  // [2] import Context ที่สร้างไว้

interface AuthProviderProps {
  children: React.ReactNode    // [3] รับ JSX ใด ๆ ก็ได้
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()       // [4] เรียก hook — state + login + logout อยู่ที่นี่

  return (
    <AuthContext.Provider value={auth}>  {/* [5] ส่งค่า auth ลงไปทั้ง tree */}
      {children}                          {/* [6] render component ลูกทั้งหมด */}
    </AuthContext.Provider>
  )
}
```
:::

> **สรุปการทำงาน:** Provider ทำหน้าที่เป็น "ตัวกลาง" — [4] เรียก `useAuth()` เพื่อเอา state + methods [5] ส่งให้ทุก component ลูกผ่าน Context [6] render children ข้างใน

### ขั้น 3 — ห่อ App ด้วย AuthProvider

::: code-group
```tsx [src/main.tsx]
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthProvider'  // [1] import Provider
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>    {/* [2] ห่อ App ทั้งหมด — ทุก component ข้างใน ใช้ auth ได้ */}
      <App />
    </AuthProvider>
  </StrictMode>
)
```
:::

### ขั้น 4 — สร้าง Navbar แสดงข้อมูล User

::: code-group
```tsx [src/components/Navbar.tsx]
import { useAuthContext } from '../context/AuthContext'  // [1] ดึง auth จาก Context

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuthContext()  // [2] ไม่ต้องรับ props

  return (
    <nav style={{ background: '#1e40af', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: 'bold' }}>ระบบเบิก-จ่ายอุปกรณ์ไอที</span>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {isAuthenticated ? (           // [3] แสดงต่างกันตาม login state
          <>
            <span style={{ fontSize: 14 }}>
              {user?.name}
              <span style={{ background: '#3b82f6', padding: '2px 8px', borderRadius: 4, marginLeft: 8, fontSize: 12 }}>
                {user?.role}
              </span>
            </span>
            <button
              onClick={logout}         // [4] เรียก logout จาก Context โดยตรง
              style={{ background: 'white', color: '#1e40af', border: 'none', padding: '4px 12px', borderRadius: 4, cursor: 'pointer' }}
            >
              ออกจากระบบ
            </button>
          </>
        ) : (
          <span style={{ fontSize: 14 }}>ยังไม่ได้เข้าสู่ระบบ</span>
        )}
      </div>
    </nav>
  )
}
```

```tsx [src/App.tsx — เพิ่ม Navbar]
import { Navbar } from './components/Navbar'
import { EquipmentPage } from './pages/EquipmentPage'

export default function App() {
  return (
    <div>
      <Navbar />             {/* [1] วางบนสุด — ดึง auth จาก Context เอง */}
      <EquipmentPage />
    </div>
  )
}
```
:::

> **สรุปการทำงาน:** [1-2] `useAuthContext()` ดึง auth โดยตรง ไม่มี props [3] `isAuthenticated` เป็น boolean คำนวณจาก token [4] `logout` เรียกได้เลยจาก Context

### ขั้น 5 — ทดสอบ

เปิด browser ที่ `localhost:5173`:

- [ ] Navbar แสดงข้อความ "ยังไม่ได้เข้าสู่ระบบ" เพราะยังไม่มีหน้า Login (wk6)
- [ ] เปิด DevTools → Application → Local Storage → เพิ่ม key `token` value ใด ๆ ด้วยมือ → refresh → Navbar ยังแสดง "ยังไม่ได้เข้าสู่ระบบ" (เพราะ token ไม่ใช่ JWT จริง — wk6 จะแก้)
- [ ] ใน DevTools → Console → พิมพ์ `localStorage.setItem('user', JSON.stringify({id:1, name:'ทดสอบ', email:'test@test.com', role:'student'}))` แล้ว refresh → Navbar แสดงชื่อและ badge role ✅
- [ ] กดปุ่ม "ออกจากระบบ" → ชื่อหาย + localStorage ถูกล้าง

## 📊 P: Progress

::: tip ✅ Mini-Checkpoint
- [ ] บอกได้ว่า `useAuth()` ต่างจาก `useAuthContext()` อย่างไร
- [ ] อธิบายได้ว่า `AuthProvider` ทำหน้าที่อะไรใน `main.tsx`
- [ ] บอกได้ว่าทำไม Navbar ถึงไม่ต้องรับ `auth` เป็น props
:::

::: details ❓ ทำไม AuthContext ถึงต้องอยู่คนละไฟล์กับ AuthProvider?
เพื่อป้องกัน **circular import** — `useAuth.ts` import จาก `types/` และ `api/`, `AuthProvider` import `useAuth` และ `AuthContext`, component ต่าง ๆ import แค่ `AuthContext` โดยไม่ต้อง import `AuthProvider` ด้วย แยกไฟล์ทำให้ dependency ชัดเจน
:::

::: details ❓ ทำไม `useAuthContext` ต้อง throw error แทนที่จะ return null?
เพราะถ้า return null และ caller ไม่เช็ค null จะเกิด `Cannot read properties of null` ที่ไม่บอกสาเหตุ — throw error พร้อม message `"must be used within AuthProvider"` ทำให้ debug ง่ายกว่ามาก
:::

::: details ❓ Context re-render ทุก component ที่ใช้ useAuthContext ไหมเมื่อ auth เปลี่ยน?
ใช่ — เมื่อ `user` หรือ `token` เปลี่ยน (login/logout) component ทุกตัวที่เรียก `useAuthContext()` จะ re-render สำหรับโปรเจกต์นี้ไม่ใช่ปัญหา เพราะ auth state เปลี่ยนแค่ตอน login/logout เท่านั้น
:::

### 🐛 Common Errors

| อาการ | สาเหตุ | วิธีแก้ |
|---|---|---|
| `Error: useAuthContext must be used within AuthProvider` | เรียก `useAuthContext()` ใน component ที่อยู่นอก `<AuthProvider>` | ตรวจ `main.tsx` ว่าห่อ App ด้วย `<AuthProvider>` แล้วหรือยัง |
| Navbar ไม่แสดงชื่อหลัง set localStorage | `useAuth` ใช้ Lazy Initializer อ่านค่าตอน mount เท่านั้น | ต้อง refresh เพื่อให้ `useState` อ่าน localStorage ใหม่ |
| `Cannot find module '../context/AuthContext'` | ยังไม่ได้สร้างโฟลเดอร์ `src/context/` | สร้างโฟลเดอร์ + ไฟล์ตาม path ที่กำหนด |
| TypeScript: `Property 'user' does not exist on type 'null'` | ไม่ได้ใช้ `useAuthContext()` แต่ใช้ `useContext(AuthContext)` ตรง ๆ | ใช้ `useAuthContext()` แทนเสมอ เพราะมีการตรวจ null ให้แล้ว |

### 📤 Submit

- [ ] `git add src/context/ src/components/Navbar.tsx src/main.tsx`
- [ ] `git commit -m "wk5: add AuthContext + AuthProvider + Navbar"`
- [ ] `git push`
- [ ] เขียนสรุปใน Google Doc (3-5 บรรทัด): `useAuth` ต่างจาก `useAuthContext` อย่างไร, `AuthProvider` ทำหน้าที่อะไร, Context API แก้ปัญหา Props Drilling ยังไง + screenshot Navbar + ลิงก์ repo

### 📋 Rubric

| เกณฑ์ | ดีมาก | พอใช้ | ปรับปรุง |
|---|---|---|---|
| AuthContext | มี `createContext` + `useAuthContext` พร้อม null check | มี createContext แต่ไม่มี null check | ไม่มี Context |
| AuthProvider | ห่อ `useAuth()` + ส่งผ่าน `value` ถูกต้อง | มี Provider แต่ value ไม่ครบ | ไม่มี Provider |
| Navbar | แสดง user + role + ปุ่ม logout ทำงาน | แสดงข้อมูลแต่ logout ไม่ทำงาน | ไม่มี Navbar |

### 📚 CLIL Vocabulary

| คำศัพท์ | คำอ่าน | ความหมาย |
|---|---|---|
| `createContext` | ครี-เอท คอน-เท็กซ์ท์ | React function สร้าง Context object ใหม่ |
| Provider | โพร-ไว-เดอร์ | Component ที่ห่อ tree และส่งค่าผ่าน `value` prop |
| `useContext` | ยูส คอน-เท็กซ์ท์ | React Hook ที่ดึงค่าจาก Context |
| Circular Import | เซอร์-คิว-ลาร์ อิม-พอร์ท | การ import วนเป็นวงกลม — A import B, B import A |
| `React.ReactNode` | รี-แอคท์ รี-แอคท์-โหนด | Type ที่รับ JSX, string, number, null, Fragment ได้ทั้งหมด |
