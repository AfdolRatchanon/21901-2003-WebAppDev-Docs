# ตรวจสอบฟอร์ม (Form Validation) <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
**สถานการณ์:** นักศึกษากรอกฟอร์มเข้าสู่ระบบเบิก-จ่ายอุปกรณ์ไอที โดยพิมพ์อีเมลว่า `"john.doe"` (ไม่มี @) หรือทิ้งรหัสผ่านว่างไว้ แล้วกดปุ่ม Submit — server ตอบกลับมาด้วย error 400 ที่เข้าใจยาก จะดีกว่าไหมถ้า **ตรวจสอบก่อนส่ง** และแจ้งเตือนภาษาไทยทันที?
:::

> 💡 **เปรียบเทียบ:** Form Validation เหมือนพนักงาน Check-in สนามบินที่ตรวจสอบ passport ก่อนออกบัตรขึ้นเครื่อง — ดีกว่าปล่อยให้ผ่านไปแล้วค่อยถูกกักที่ Immigration

---

## 📖 I: Information

### Controlled Form คืออะไร?

ใน React เราควบคุมค่าใน input ด้วย state — เรียกว่า **Controlled Component** ทุกครั้งที่ผู้ใช้พิมพ์ `onChange` จะอัปเดต state และ React จะ re-render input พร้อมค่าใหม่

### React.FormEvent คืออะไร?

`FormEvent` คือ type ของ event ที่เกิดขึ้นเมื่อ `<form>` ถูก submit ต้องเรียก `e.preventDefault()` เพื่อป้องกันไม่ให้ browser โหลดหน้าใหม่

::: code-group

```tsx [LoginForm.tsx]
// LoginPage.tsx — Controlled Form พร้อม validation
import { useState, type FormEvent } from 'react'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [form, setForm] = useState<LoginFormData>({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()  // ป้องกัน page reload
    setError(null)       // ล้าง error เก่าก่อนตรวจสอบใหม่

    // Client-side validation — ตรวจก่อนส่ง server
    if (!form.email.includes('@')) {
      setError('รูปแบบอีเมลไม่ถูกต้อง')
      return  // หยุดทำงาน ไม่ส่ง request
    }
    if (form.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }
    // ผ่าน validation แล้ว — ส่งไป server
    console.log('Submitting:', form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto">
      <input
        type="email"
        placeholder="อีเมล"
        value={form.email}
        // อัปเดตเฉพาะ field email โดยคง field อื่นไว้ด้วย spread operator
        onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="รหัสผ่าน"
        value={form.password}
        onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
        className="border rounded px-3 py-2"
      />
      {/* แสดง error เฉพาะเมื่อมีข้อความ */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">
        เข้าสู่ระบบ
      </button>
    </form>
  )
}
```

```tsx [ValidationRules.tsx]
// ตัวอย่างการแยก validation logic ออกเป็นฟังก์ชัน
interface LoginFormData {
  email: string
  password: string
}

// ฟังก์ชัน validate คืน string (ข้อความ error) หรือ null (ผ่าน)
function validate(form: LoginFormData): string | null {
  if (!form.email.includes('@')) return 'รูปแบบอีเมลไม่ถูกต้อง'
  if (form.password.length < 6)  return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
  return null  // ผ่านทุกเงื่อนไข
}

// ใช้งานใน handleSubmit
// const errorMsg = validate(form)
// if (errorMsg) { setError(errorMsg); return }
```

:::

::: tip 💡 TypeScript Tip — Form Data Types
การกำหนด `interface LoginFormData` ช่วยให้ TypeScript ตรวจสอบว่า `form.email` และ `form.password` มีอยู่จริง — ถ้าพิมพ์ `form.passwrod` (ผิด) จะเกิด error ทันที ไม่ต้องรอ runtime

`type FormEvent` ใน React บอก TypeScript ว่า `e` มี method `preventDefault()` และ `e.target` เป็น `HTMLFormElement`
:::

### ประเภทของ Validation

| ประเภท | ตัวอย่าง | ทำงานที่ |
|---|---|---|
| Required | ห้ามว่าง | Client & Server |
| Format | email ต้องมี @ | Client |
| Length | password ≥ 6 | Client & Server |
| Unique | email ซ้ำ | Server เท่านั้น |

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"เขียน React TypeScript controlled form ที่มี 2 field: email และ password เพิ่ม client-side validation โดยตรวจว่า email ต้องมี '@' และ password ต้องมีอย่างน้อย 6 ตัวอักษร แสดง error message ภาษาไทยใต้ฟอร์มเมื่อ validation ไม่ผ่าน ใช้ useState และ FormEvent"
:::

### 📝 PjBL Lab

- [ ] สร้าง `src/components/LoginForm.tsx` ด้วย Controlled Form pattern
- [ ] กำหนด `interface LoginFormData` ด้วย field `email` และ `password`
- [ ] เพิ่ม validation: ตรวจ `@` ในอีเมล และความยาว password
- [ ] แสดง error message ภาษาไทยใต้ฟอร์มเมื่อ validation ไม่ผ่าน
- [ ] ทดสอบโดยกรอกข้อมูลผิดรูปแบบและดูข้อความ error

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องเรียก e.preventDefault() ใน handleSubmit?
**แนวคำตอบ:** พฤติกรรมเริ่มต้นของ `<form>` คือส่ง HTTP request และโหลดหน้าใหม่ ซึ่งจะทำให้ React state หายหมด `preventDefault()` ป้องกันพฤติกรรมนี้เพื่อให้เราควบคุม logic เองได้
:::

::: details ❓ ทำไม setForm ใช้ prev => ({ ...prev, email: ... }) แทน setForm({ email: ... })?
**แนวคำตอบ:** `form` มีหลาย field — ถ้า `setForm({ email: newValue })` โดยตรง React จะ replace ทั้ง object ทำให้ `password` หาย การใช้ spread operator `...prev` จะคง field อื่นไว้และอัปเดตเฉพาะที่ต้องการ
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
|---|---|---|---|
| Controlled Form pattern | useState + onChange ครบ | มีบางส่วน | ใช้ uncontrolled |
| Validation logic | ตรวจ format ได้ถูกต้อง | ตรวจได้บางเงื่อนไข | ไม่มี validation |
| Error message | แสดงภาษาไทยชัดเจน | แสดง error แต่ภาษาอังกฤษ | ไม่แสดง error |

---

### 📚 CLIL Vocabulary

| Term | Meaning |
|---|---|
| Validation | การตรวจสอบความถูกต้องของข้อมูลก่อนประมวลผล |
| Required | บังคับกรอก ห้ามปล่อยว่าง |
| Controlled Component | input ที่ค่าถูกควบคุมด้วย React state |
| Error Message | ข้อความแจ้งเตือนเมื่อข้อมูลไม่ถูกต้อง |
| FormEvent | ประเภทของ event ที่เกิดเมื่อ form ถูก submit |
