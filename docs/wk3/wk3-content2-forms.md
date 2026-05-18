# Controlled Forms — onChange, value, FormEvent <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** บทนี้สอนสร้าง Controlled Form ด้วย React state ให้ทุก keystroke ผ่าน onChange เสมอ พร้อม pattern `isLoading` สำหรับป้องกัน submit ซ้ำ ความรู้นี้ใช้ใน wk6 (Login form กับ auth API) และ wk7 (BorrowForm กับ realtime update)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายต้องมีฟอร์ม Login และฟอร์มเบิกอุปกรณ์ — ถ้าอ่านค่า input ด้วย `document.getElementById` แบบเก่า React จะไม่รู้ว่าข้อมูลเปลี่ยน ทำให้ validate ไม่ได้ และปุ่ม Submit ไม่รู้ว่าควรเปิดหรือปิด วิธีที่ React ใช้คือ **Controlled Form** — ทุก keystroke ผ่าน state เสมอ
:::

> 💡 **เปรียบเทียบ:** Controlled Form เหมือน "พนักงานรับออเดอร์ที่จดทุกอย่าง" — ทุกอักษรที่พิมพ์ถูกบันทึกใน state ทันที React รู้ค่าล่าสุดเสมอ ต่างจาก Uncontrolled Form ที่เหมือน "กล่องรับคำร้อง" — ต้องเปิดกล่องถึงจะรู้ว่ามีอะไรอยู่ข้างใน

## 📖 I: Information

### ขั้นตอนที่ 1 — ทำความเข้าใจ Controlled vs Uncontrolled

ในการสร้างแบบฟอร์ม (Form) บนเว็บไซต์ สิ่งสำคัญคือเราจะ ดึงข้อมูล ที่ผู้ใช้พิมพ์ออกมาใช้งานได้อย่างไร ในโลกของ React มีวิธียอดนิยมอยู่ 2 แบบ:

1. **Uncontrolled Form (ปล่อยฟรี):** เหมือนการตั้งกล่องรับความคิดเห็นไว้หน้าห้อง React จะไม่สนใจเลยว่าผู้ใช้พิมพ์อะไรลงไป จนกว่าผู้ใช้จะกดปุ่ม Submit เราถึงจะใช้คำสั่ง (เช่น `document.getElementById`) ไปงัดกล่องเพื่อดึงข้อมูลนั้นออกมาอ่าน วิธีนี้เขียนง่ายแต่เราจะไม่สามารถตรวจสอบข้อมูลแบบเรียลไทม์ได้เลย (เช่น เตือนว่ารหัสผ่านสั้นไปตั้งแต่ตอนกำลังพิมพ์ไม่ได้)
2. **Controlled Form (ควบคุมเบ็ดเสร็จ):** เป็นวิธีมาตรฐานของ React เปรียบเหมือนพนักงานที่ยืนคอยจดทุกตัวอักษรที่ผู้ใช้กำลังพิมพ์ (ผ่าน `onChange`) แล้วนำไปบันทึกไว้ในความจำส่วนกลางที่เรียกว่า **State** เสมอ ทำให้ Input ทุกช่องจะแสดงผลตามค่าใน State ปัจจุบันแบบ 100% ข้อดีคือ React รู้ข้อมูลตลอดเวลา ทำให้เราตรวจสอบความถูกต้อง เปิด/ปิดปุ่ม หรือล้างข้อมูลได้ง่ายและทันที

::: code-group
```tsx [❌ Uncontrolled — React ไม่รู้ค่า]
// ❌ วิธีเก่า — อ่านค่าจาก DOM ตอน submit เท่านั้น
function LoginForm() {
  function handleSubmit() {
    // ต้อง query DOM เพื่ออ่านค่า
    const email = (document.getElementById('email') as HTMLInputElement).value
    console.log(email)  // React ไม่เคยรู้ค่านี้เลย
  }

  return (
    <form onSubmit={handleSubmit}>
      <input id="email" type="email" />  {/* ❌ ไม่มี value, ไม่มี onChange */}
      <button type="submit">เข้าสู่ระบบ</button>
    </form>
  )
}
```

```tsx [✅ Controlled — React รู้ค่าทุก keystroke]
import { useState } from 'react'

function LoginForm() {
  // [1] state เก็บค่า input — เปลี่ยนทุกครั้งที่พิมพ์
  const [email, setEmail] = useState('')

  return (
    <form>
      <input
        type="email"
        value={email}              // [2] value ผูกกับ state — input แสดงค่าจาก state
        onChange={e => setEmail(e.target.value)}  // [3] ทุก keystroke อัปเดต state
      />
      <p>ค่าปัจจุบัน: {email}</p>  {/* เห็นค่าเปลี่ยนแบบ real-time ✅ */}
    </form>
  )
}
```
:::

**สรุปกฎ Controlled Form:**
- `value={state}` — ผูก input กับ state (ควบคุมค่า)
- `onChange={e => setState(e.target.value)}` — อัปเดต state ทุก keystroke

### ขั้นตอนที่ 2 — TypeScript กับ onChange

`e.target.value` มาจาก `e` ที่เป็น `React.ChangeEvent<HTMLInputElement>`:

::: code-group
```tsx [✅ กำหนด Type ให้ onChange handler]
import { useState } from 'react'

function LoginForm() {
  const [email, setEmail] = useState<string>('')

  // วิธีที่ 1: inline — TypeScript อนุมาน type เองจาก input
  <input onChange={e => setEmail(e.target.value)} />

  // วิธีที่ 2: แยก function — ต้องระบุ type ชัดเจน
  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    // e.target.value ได้ string เสมอ (ค่าที่พิมพ์ใน input)
  }

  return <input value={email} onChange={handleEmailChange} />
}
```

```tsx [💡 input ประเภทต่าง ๆ]
// text, email, password — ใช้ ChangeEvent<HTMLInputElement>
<input type="text"     onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)} />
<input type="email"    onChange={e => setEmail(e.target.value)} />
<input type="password" onChange={e => setPassword(e.target.value)} />

// textarea — ใช้ ChangeEvent<HTMLTextAreaElement>
<textarea onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)} />

// select — ใช้ ChangeEvent<HTMLSelectElement>
<select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)} />
```
:::

### ขั้นตอนที่ 3 — หลาย Input + handleSubmit

ฟอร์ม Login จริงของโปรเจกต์ — รวม email + password + submit:

```tsx [src/pages/LoginForm.tsx — v1 (inline style)]
import { useState } from 'react'
import type { FormEvent } from 'react'

export function LoginForm() {
  // [1] แต่ละ input มี state ของตัวเอง
  const [email, setEmail]       = useState<string>('')
  const [password, setPassword] = useState<string>('')

  // [2] handleSubmit รับ FormEvent — ต้อง e.preventDefault() เสมอ
  function handleSubmit(e: FormEvent) {
    e.preventDefault()  // [3] หยุดไม่ให้ browser reload หน้า (พฤติกรรมเริ่มต้นของ form)

    // [4] ณ จุดนี้ email และ password มีค่าที่ผู้ใช้พิมพ์แน่นอน
    console.log('Email:', email)
    console.log('Password:', password)
    // wk6: เรียก API auth.login(email, password) ตรงนี้
  }

  return (
    <form
      onSubmit={handleSubmit}  // [5] ผูก handleSubmit กับ form
      style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '40px auto' }}
    >
      <h2>เข้าสู่ระบบ</h2>

      {/* [6] Email input — Controlled */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="email">อีเมล</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@school.ac.th"
          required
          style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: '8px 12px' }}
        />
      </div>

      {/* [7] Password input — Controlled */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label htmlFor="password">รหัสผ่าน</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••"
          required
          style={{ border: '1px solid #cbd5e1', borderRadius: 6, padding: '8px 12px' }}
        />
      </div>

      {/* [8] Submit button */}
      <button
        type="submit"
        style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, padding: '10px', cursor: 'pointer' }}
      >
        เข้าสู่ระบบ
      </button>
    </form>
  )
}
```

**สรุปการทำงาน:**
1. ผู้ใช้พิมพ์ → `onChange` → `setState` → React re-render → input แสดงค่าใหม่
2. ผู้ใช้กด Submit → `handleSubmit` → `e.preventDefault()` → ใช้ค่าจาก state ✅

### ขั้นตอนที่ 4 — เพิ่ม isLoading + Disable Button

```tsx [v2 — เพิ่ม loading state]
import { useState } from 'react'
import type { FormEvent } from 'react'

export function LoginForm() {
  const [email, setEmail]       = useState<string>('')
  const [password, setPassword] = useState<string>('')
  // [1] isLoading บอกว่ากำลัง submit อยู่ไหม
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)  // [2] เปิด loading ก่อน submit

    // จำลอง API call ด้วย delay (wk6 จะเปลี่ยนเป็น auth.login จริง)
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsLoading(false) // [3] ปิด loading หลัง submit เสร็จ
  }

  return (
    <form onSubmit={handleSubmit} style={{ /* เหมือนเดิม */ }}>
      {/* inputs เหมือนเดิม */}
      <input value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
      <input value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />

      {/* [4] ปุ่ม disabled ตาม isLoading */}
      <button
        type="submit"
        disabled={isLoading}  // [5] ป้องกัน submit ซ้ำ
        style={{
          backgroundColor: isLoading ? '#93c5fd' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '10px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </button>
    </form>
  )
}
```

::: tip 💡 Tailwind CSS version
ใน **wk3-content1** เรียน Tailwind แล้ว สามารถแทนที่ `style=&#123;&#123; &#125;&#125;` ทั้งหมดด้วย className เช่น `className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm"` — ดูตัวอย่าง Tailwind form ใน `project/frontend/src/pages/LoginPage.tsx`
:::

#### 🔷 TypeScript ในบทนี้

```tsx [TypeScript ที่ใช้ในบทนี้]
// [1] useState<string> — กำหนด type ของ state ชัดเจน
const [email, setEmail] = useState<string>('')

// [2] useState<boolean> — type สำหรับ flag state
const [isLoading, setIsLoading] = useState<boolean>(false)

// [3] FormEvent — type สำหรับ event จาก <form onSubmit={...}>
import type { FormEvent } from 'react'
function handleSubmit(e: FormEvent) { ... }

// [4] React.ChangeEvent<HTMLInputElement> — type ของ onChange event
//     TypeScript ช่วย autocomplete e.target.value ได้ถูกต้อง
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setEmail(e.target.value)  // .value เป็น string เสมอ
}
```

**สรุป:** `FormEvent` ใช้กับ `onSubmit`, `ChangeEvent<HTMLInputElement>` ใช้กับ `onChange` ✅

## 🛠️ A: Application

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า Controlled Form ต่างจาก Uncontrolled Form อย่างไร และทำไมต้องมี `value={state}` + `onChange`
- [ ] บอกได้ว่า `e.preventDefault()` ใน `handleSubmit` ป้องกันอะไร และ `isLoading` ใช้ทำอะไร
:::

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้าง Controlled Form สำหรับ Login ที่มี: email input (type=email), password input (type=password), และ submit button ขอให้: 1) ใช้ useState สำหรับแต่ละ input field 2) handleSubmit ที่มี e.preventDefault() และ type เป็น FormEvent 3) isLoading state สำหรับ disable ปุ่มระหว่าง submit 4) ทั้งหมดเป็น TypeScript พร้อม type annotation ให้ครบ"
:::

### 📝 PjBL Lab — ชิ้นงาน: `LoginForm.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม `<footer>` ชื่อ-รหัสของตนเองใน Component ✅

**ขั้น 1: Controlled Form พื้นฐาน (15 นาที)**

- [ ] สร้าง `useState<string>('')` สำหรับ email และ password
- [ ] ผูก `value={email}` และ `onChange={e => setEmail(e.target.value)}`
- [ ] เพิ่ม paragraph `<p>Email: {email}</p>` ดูค่าเปลี่ยน real-time
- [ ] พิมพ์ใน input → ต้องเห็นค่าเปลี่ยนในหน้าเว็บทันที ✅
- [ ] ทดสอบ: ลบ `value={email}` ออก → input ยังพิมพ์ได้แต่ paragraph ไม่เปลี่ยน ✅ (เข้าใจ Controlled vs Uncontrolled)
- [ ] ใส่ `value={email}` กลับ

**ขั้น 2: handleSubmit + e.preventDefault() (10 นาที)**

- [ ] เพิ่ม `<form onSubmit={handleSubmit}>` ครอบ inputs
- [ ] เขียน `function handleSubmit(e: FormEvent) { e.preventDefault(); console.log(email, password) }`
- [ ] ทดสอบ: กด Submit → ต้องเห็น log ใน Console และหน้าเว็บ **ไม่ reload** ✅
- [ ] ลอง: ลบ `e.preventDefault()` ออก → กด Submit → สังเกตว่าหน้า reload ✅ (เข้าใจว่าทำไมต้องมี)
- [ ] ใส่ `e.preventDefault()` กลับ

**ขั้น 3: isLoading + Disable Button (10 นาที)**

- [ ] เพิ่ม `useState<boolean>(false)` สำหรับ isLoading
- [ ] ใน handleSubmit: `setIsLoading(true)` → `await new Promise(r => setTimeout(r, 1500))` → `setIsLoading(false)`
- [ ] ผูก `disabled={isLoading}` กับปุ่ม Submit
- [ ] เปลี่ยน text ปุ่มเป็น `{isLoading ? 'กำลังส่ง...' : 'เข้าสู่ระบบ'}`
- [ ] กด Submit → ปุ่มต้อง disable 1.5 วิ แล้วกลับมาปกติ ✅
- [ ] (Bonus) เปลี่ยน style ปุ่มตาม isLoading (สีจางลงเมื่อ disabled)

**ขั้นสุดท้าย: Submit**

- [ ] `git add src/pages/LoginForm.tsx && git commit -m "wk3: controlled login form with loading state"` → `git push`
- [ ] เขียนสรุปใน Google Doc: Controlled vs Uncontrolled ต่างกันยังไง, ทำไมต้อง `e.preventDefault()`, isLoading ใช้ทำอะไร + screenshot form พร้อมลิงก์ repo

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Controlled Form ถึงดีกว่า Uncontrolled?
**แนวคำตอบ:** Controlled Form ทำให้ React รู้ค่าของ input ตลอดเวลา — สามารถ validate แบบ real-time ได้, disable ปุ่ม submit เมื่อ field ว่าง, แสดง error message ทันทีที่พิมพ์ผิด และ reset form ได้ง่ายด้วย `setEmail('')` ส่วน Uncontrolled ทำสิ่งเหล่านี้ยากมาก
:::

::: details ❓ ทำไมต้องมี `e.preventDefault()` ใน handleSubmit?
**แนวคำตอบ:** พฤติกรรมเริ่มต้นของ `<form>` เมื่อ submit คือ reload หน้าหรือส่งข้อมูลไปยัง URL ใน `action` attribute ซึ่งทำให้ SPA (React) ถูก refresh และ state ทั้งหมดหายไป `e.preventDefault()` หยุดพฤติกรรมนี้ไว้ ทำให้เราจัดการ submit เองด้วย JavaScript ได้
:::

::: details ❓ `React.ChangeEvent<HTMLInputElement>` กับ `React.FormEvent` ต่างกันอย่างไร?
**แนวคำตอบ:** `ChangeEvent<HTMLInputElement>` เกิดทุกครั้งที่ input เปลี่ยนค่า (onChange) — มี `e.target.value` เป็น string ส่วน `FormEvent` เกิดเมื่อ form ถูก submit (onSubmit) — ไม่มี `.value` ตรง ๆ แต่มี `e.preventDefault()` เพื่อหยุด browser reload
:::

::: details ❓ ถ้า form มี input หลายสิบช่อง จะสร้าง useState ทีละ field ไหม?
**แนวคำตอบ:** ถ้า field มาก ควรเก็บเป็น object ใน state เดียว เช่น `const [form, setForm] = useState({ email: '', password: '', name: '' })` แล้วอัปเดตด้วย `setForm(prev => ({ ...prev, email: e.target.value }))` แต่สำหรับ Login Form 2-3 field ก็แยก state แต่ละ field ได้อย่างชัดเจนกว่า
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| Input พิมพ์ไม่ได้ / ค่าไม่เปลี่ยน | ใส่ `value={email}` แต่ลืม `onChange` — React lock ค่าไว้ | เพิ่ม `onChange={e => setEmail(e.target.value)}` ให้ครบทุก controlled input |
| หน้า reload เมื่อกด Submit | ลืม `e.preventDefault()` ใน handleSubmit | เพิ่ม `e.preventDefault()` บรรทัดแรกของ handleSubmit เสมอ |
| TypeScript error: "Property 'value' does not exist" | ใส่ type event ผิด เช่นใช้ `Event` แทน `React.ChangeEvent<HTMLInputElement>` | เปลี่ยน type เป็น `React.ChangeEvent<HTMLInputElement>` หรือปล่อย TypeScript อนุมานเมื่อ inline |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Controlled Form | value + onChange ครบทุก input | มีบางส่วน | ยังเป็น uncontrolled |
| handleSubmit | e.preventDefault() + FormEvent type | มีแต่ลืม type หรือ preventDefault | ไม่มี handleSubmit |
| isLoading state | disable ปุ่ม + เปลี่ยนข้อความถูกต้อง | มีบางส่วน | ไม่มี loading state |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Controlled Form` | คอน-โทรลด์ ฟอร์ม | ฟอร์มที่ React ควบคุมค่าผ่าน state — ทุก keystroke ผ่าน onChange |
| `Uncontrolled Form` | อัน-คอน-โทรลด์ ฟอร์ม | ฟอร์มที่อ่านค่าจาก DOM โดยตรง — React ไม่รู้ค่า real-time |
| `onChange` | ออน-เชนจ์ | event ที่เกิดทุกครั้งที่ค่าใน input เปลี่ยน |
| `onSubmit` | ออน-ซับ-มิท | event ที่เกิดเมื่อผู้ใช้กด submit button หรือ Enter |
| `e.preventDefault()` | อี-พรี-วิ-เวนต์-ดี-ฟอลต์ | หยุดพฤติกรรมเริ่มต้นของ browser (เช่น form reload) |
| `FormEvent` | ฟอร์ม-อี-เวนต์ | TypeScript type สำหรับ event ที่เกิดจากการ submit form |
| `ChangeEvent<T>` | เชนจ์-อี-เวนต์ | TypeScript type สำหรับ event ที่เกิดจากการเปลี่ยนค่า input |
| `disabled` | ดิส-เอ-เบิลด์ | prop ที่ทำให้ input/button ไม่สามารถโต้ตอบได้ชั่วคราว |
