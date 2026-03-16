# Context API + useContext — แชร์ State ข้าม Component <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
สมมติต้องการแชร์ `theme` (dark/light) ไปยังทุก Component ในแอป ถ้าส่งเป็น props ต้องผ่าน `App → Layout → Sidebar → NavItem → Icon` — component กลางทุกตัวต้องรับและส่งต่อ props ที่ตัวเองไม่ได้ใช้ นี่คือ **Props Drilling** ที่รุนแรง Context API แก้ปัญหานี้ได้โดยไม่ต้องผ่านคนกลาง
:::

> 💡 **เปรียบเทียบ:** Context เหมือน "WiFi ส่วนกลาง" — ติดตั้งครั้งเดียว ทุก device ในอาคารเชื่อมต่อได้โดยตรง ไม่ต้องเดินสายผ่านห้องต่อห้อง

---

## 📖 I: Information

### ขั้นตอนที่ 1 — เจาะลึก Context API กับการแชร์ State อิสระ

เมื่อแอปพลิเคชันมีขนาดใหญ่และซับซ้อนขึ้น การใช้วิธีส่ง Props จากบนลงล่างอาจไม่ตอบโจทย์เสมอไป ตัวอย่างเช่น ข้อมูลอย่าง **Theme (Light/Dark Mode)**, **ภาษาของระบบ (i18n)**, หรือ **ผู้ใช้งานปัจจุบัน (User Session)** ซึ่ง Component หลายที่ในหน้าจอต้องการเข้าถึงพร้อม ๆ กัน หากเราใช้วิธี Props Drilling เราจะต้องส่ง prop เหล่านี้ผ่าน Component กลางที่ไม่ได้ใช้งานข้อมูลนั้นเลย สร้างความรกรุงรังให้แก่โค้ดอย่างมหาศาล

**Context API** จึงเป็นพระเอกที่เข้ามาช่วยแก้ปัญหาตรงนี้ โดยทำตัวเสมือน "ระบบเสาวิทยุกระจายเสียงส่วนกลาง" เมื่อเราติดตั้งสถานี (Provider) ไว้ที่จุดบนสุดแล้ว Component ย่อยใด ๆ ก็ตามที่ต้องการคลื่นความถี่ (State) นี้ สามารถใช้เสาอากาศ (useContext) ดึงข้อมูลมาใช้ได้ทันทีโดยไม่ต้องผ่านคนกลางใดทั้งสิ้น

ระบบ Context จะประกอบด้วย 3 เสาหลัก:

Context API ประกอบด้วย 3 ส่วน:

```
createContext<T>()  →  Provider  →  useContext()
    (สร้าง Context)      (ห่อ tree)    (ใช้ค่า)
```

::: code-group
```tsx [1️⃣ createContext — สร้าง Context]
import { createContext } from 'react'

// [1] กำหนด type ของข้อมูลที่จะแชร์
interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// [2] createContext<T> — ต้องใส่ default value (null as any หรือ default object)
//     ค่า default นี้ใช้เฉพาะเมื่อ component อยู่นอก Provider เท่านั้น
export const ThemeContext = createContext<ThemeContextType | null>(null)
```

```tsx [2️⃣ Provider — ห่อ component tree]
import { useState } from 'react'
import { ThemeContext } from './ThemeContext'

// [3] Provider คือ component ที่ห่อ tree และส่งค่าผ่าน value prop
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  // [4] value คือข้อมูลที่ทุก component ข้างใน Provider เข้าถึงได้
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

```tsx [3️⃣ useContext — ใช้ค่าใน component ไหนก็ได้]
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

// [5] ไม่ต้องรับ props — ดึงค่าจาก Context โดยตรง
function Navbar() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('Navbar ต้องอยู่ใน ThemeProvider')

  return (
    <nav style={{ background: ctx.theme === 'dark' ? '#1e293b' : 'white' }}>
      <button onClick={ctx.toggleTheme}>
        {ctx.theme === 'light' ? '🌙 Dark' : '☀️ Light'}
      </button>
    </nav>
  )
}
```
:::

---

### ขั้นตอนที่ 2 — ใช้ Context ในแอปจริง

**ที่ `main.tsx` หรือ `App.tsx` — ห่อ Provider ไว้รอบนอกสุด:**

```tsx [src/App.tsx — ห่อด้วย ThemeProvider]
import { ThemeProvider } from './context/ThemeProvider'
import { Navbar } from './components/Navbar'
import { EquipmentPage } from './pages/EquipmentPage'

export default function App() {
  return (
    // [1] ห่อ component ทั้งหมดด้วย Provider
    //     ทุก component ข้างใน สามารถเรียก useContext(ThemeContext) ได้เลย
    <ThemeProvider>
      <Navbar />          {/* ✅ ใช้ ThemeContext ได้ */}
      <EquipmentPage />   {/* ✅ ใช้ ThemeContext ได้ */}
    </ThemeProvider>
  )
}
```

**เปรียบเทียบ Props vs Context:**

| | Props (wk5-content1) | Context API |
| :--- | :--- | :--- |
| เหมาะกับ | Component tree ไม่ลึก (2-3 ชั้น) | Component tree ลึกมาก (4+ ชั้น) |
| ความชัดเจน | เห็นชัดว่าข้อมูลมาจากไหน | ซ่อนอยู่ใน Context |
| TypeScript | ง่าย — type จาก props interface | ต้องระวัง null check |
| ตัวอย่างใช้งาน | auth (2-3 component), form state | theme, language, user session ทั่วแอป |

---

### ขั้นตอนที่ 3 — สร้าง Custom Hook ครอบ useContext

แทนที่จะเรียก `useContext(ThemeContext)` ตรง ๆ ทุกที่ ควรสร้าง Custom Hook ครอบไว้:

::: code-group
```tsx [✅ Custom Hook — ปลอดภัย + ใช้ง่าย]
// context/ThemeContext.ts
import { createContext, useContext } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)

// [1] Custom Hook ครอบ useContext — จัดการ null check ที่เดียว
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme ต้องใช้ภายใน ThemeProvider เท่านั้น')
  }
  return ctx
}
```

```tsx [วิธีใช้ในทุก Component]
// [2] เรียกง่าย ไม่ต้อง null check ทุกครั้ง
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const { theme, toggleTheme } = useTheme()  // ✅ ง่าย ปลอดภัย
  return <button onClick={toggleTheme}>{theme}</button>
}

function Footer() {
  const { theme } = useTheme()  // ✅ ใช้ได้ทุกที่โดยไม่ต้องส่ง props
  return <footer style={{ background: theme === 'dark' ? '#111' : '#fff' }}>...</footer>
}
```

```tsx [❌ เรียก useContext ตรง ๆ ทุกที่ — เสี่ยง null]
// ❌ ต้อง null check ทุกครั้ง หรือเสี่ยง runtime error
function Navbar() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return null  // ต้องเขียนซ้ำทุก component

  return <button onClick={ctx.toggleTheme}>{ctx.theme}</button>
}
```
:::

---

### ขั้นตอนที่ 4 — AuthContext สำหรับโปรเจกต์ (แนวคิด)

ถ้าโปรเจกต์ใช้ Context แทน Props สำหรับ auth จะมีหน้าตาแบบนี้:

```tsx [src/context/AuthContext.tsx — แนวคิด (โปรเจกต์ใช้ Props แทน)]
import { createContext, useContext, useState } from 'react'
import type { User, AuthContextType } from '../types'

// [1] สร้าง Context ด้วย AuthContextType
const AuthContext = createContext<AuthContextType | null>(null)

// [2] Provider ครอบทั้งแอป
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]   = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  async function login(email: string, password: string): Promise<boolean> {
    // เรียก API จริง (wk6)
    return false
  }

  function logout() {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: token !== null }}>
      {children}
    </AuthContext.Provider>
  )
}

// [3] Custom Hook
export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext ต้องอยู่ใน AuthProvider')
  return ctx
}
```

::: info 💡 ทำไมโปรเจกต์นี้ใช้ Props แทน Context?
ใน `project/frontend/src/App.tsx` — `auth` ถูกส่งตรงจาก `App` ไปยัง `Navbar`, `LoginPage`, `EquipmentPage` แค่ 2-3 component ที่ไม่ลึก Context จึงไม่จำเป็นและเพิ่มความซับซ้อนโดยไม่คุ้ม แต่ถ้าแอปใหญ่ขึ้นมีหลาย nested components Context จะเหมาะกว่า
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้าง Context API สำหรับ theme switching มี: 1) `createContext<ThemeContextType | null>(null)` 2) ThemeProvider component ที่ใช้ useState เก็บ 'light' | 'dark' และมีฟังก์ชัน toggleTheme 3) Custom Hook `useTheme()` ที่ครอบ useContext พร้อม null check — อธิบายว่าทำไมต้อง throw error ถ้า context เป็น null"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม `<footer>` ชื่อ-รหัสของตนเองใน Component หลัก ✅

**ขั้น 1: สร้าง ThemeContext (15 นาที)**

- [ ] สร้างไฟล์ `src/context/ThemeContext.tsx`
- [ ] ประกาศ `interface ThemeContextType` มี `theme: 'light' | 'dark'` และ `toggleTheme: () => void`
- [ ] สร้าง `const ThemeContext = createContext<ThemeContextType | null>(null)`
- [ ] สร้าง `ThemeProvider` component ที่ใช้ `useState` เก็บ theme
- [ ] สร้าง `useTheme()` Custom Hook ครอบ `useContext`

**ขั้น 2: ใช้ ThemeProvider ใน App (10 นาที)**

- [ ] ห่อ `<ThemeProvider>` ใน `App.tsx` ครอบ component ทั้งหมด
- [ ] เรียก `useTheme()` ใน `App.tsx` หรือ component ใดก็ได้
- [ ] เพิ่มปุ่ม "Toggle Theme" เรียก `toggleTheme()`
- [ ] เปลี่ยน background color ตาม `theme` — กดปุ่มแล้วสีต้องเปลี่ยน ✅

**ขั้น 3: ทดสอบ Error Boundary (5 นาที)**

- [ ] ลองเรียก `useTheme()` ใน component ที่อยู่นอก `ThemeProvider`
- [ ] ต้องเห็น Error: "useTheme ต้องใช้ภายใน ThemeProvider เท่านั้น" ✅ (Error Boundary ทำงาน)
- [ ] ย้าย component กลับเข้าใน Provider

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk5: ThemeContext with createContext and useContext"` → `git push`
- [ ] เขียนสรุปใน Google Doc: Context vs Props ต่างกันเมื่อไหร่, createContext ทำอะไร, ทำไม throw error เมื่อ ctx เป็น null

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ Context API แก้ปัญหา Props Drilling อย่างไร?
**แนวคำตอบ:** Props Drilling คือการส่ง props ผ่าน Component กลางที่ไม่ได้ใช้ข้อมูล Context แก้ปัญหาโดย Provider ห่อ tree ไว้ ทุก component ที่อยู่ข้างใน Provider สามารถเรียก `useContext()` ดึงค่าได้โดยตรง ไม่ต้องผ่าน component กลาง
:::

::: details ❓ ทำไม createContext ต้องมี default value และควรตั้งเป็นอะไร?
**แนวคำตอบ:** Default value ใช้เมื่อ component เรียก `useContext` โดยไม่มี Provider ครอบอยู่ ถ้าตั้งเป็น `null` ต้องมี null check ทุกครั้ง ถ้าตั้งเป็น object เริ่มต้น bug จะเงียบ — แนวทางที่ดีคือตั้งเป็น `null` แล้วสร้าง Custom Hook ที่ throw error เมื่อ context เป็น null เพื่อให้รู้ทันทีว่าลืมใส่ Provider
:::

::: details ❓ ทำไมควรสร้าง Custom Hook ครอบ useContext แทนที่จะเรียก useContext ตรง ๆ?
**แนวคำตอบ:** 1) **Null Safety** — จัดการ null check ที่เดียว แทนที่ทุก component ต้องเขียนซ้ำ 2) **Encapsulation** — ซ่อน ThemeContext ไม่ให้ component อื่นนำเข้าตรง 3) **Better Errors** — error message ชัดกว่าว่าต้องอยู่ใน Provider 4) **Refactoring** — ถ้าย้าย Context ไปที่อื่น แก้แค่ Hook เดียว
:::

::: details ❓ เมื่อไหร่ควรใช้ Context แทน Props?
**แนวคำตอบ:** ใช้ Context เมื่อ: 1) Component tree ลึกเกิน 3-4 ชั้น 2) Component กลางต้องส่งต่อ props ที่ไม่ได้ใช้เอง 3) ข้อมูลใช้ใน "ทุกที่" เช่น theme, language, user session ส่วน Props เหมาะกับ: 1) Tree ไม่ลึก 2) ข้อมูลที่ไหลทิศทางเดียว 3) Component ที่ reuse ได้ง่ายกว่า (ไม่ผูกกับ Context)
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| createContext + Provider | type ถูก, Provider ห่อถูกที่ | มีแต่ type ไม่ครบ | ไม่มี Context |
| useContext + Custom Hook | Custom Hook มี null check + throw error | มี Hook แต่ไม่มี null check | เรียก useContext ตรง ๆ |
| ใช้งานได้จริง | toggle theme ได้ สีเปลี่ยนถูกต้อง | บางส่วนทำงาน | ไม่มี Provider/Consumer |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Context` | กลไกของ React สำหรับแชร์ state ข้าม component tree โดยไม่ผ่าน props |
| `createContext<T>` | ฟังก์ชันสร้าง Context object พร้อม TypeScript generic |
| `Provider` | Component ที่ห่อ tree และส่งค่าผ่าน `value` prop |
| `useContext` | Hook สำหรับอ่านค่าจาก Context ที่ใกล้ที่สุด |
| `Props Drilling` | การส่ง props ผ่าน component กลางที่ไม่ได้ใช้ข้อมูลนั้น |
| `Encapsulation` | การซ่อน implementation detail — ผู้ใช้ไม่ต้องรู้รายละเอียดข้างใน |
| `null check` | การตรวจสอบว่าค่าไม่เป็น null ก่อนใช้งาน เพื่อป้องกัน runtime error |
