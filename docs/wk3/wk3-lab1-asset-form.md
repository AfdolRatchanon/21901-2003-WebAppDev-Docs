# Lab: สร้างฟอร์มเบิกอุปกรณ์พร้อมแจ้ง Error <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ต้องการฟอร์มให้นักเรียนกรอกก่อนยืม — ถ้าไม่มีการ validate ข้อมูล อาจมีคนกรอกวัตถุประสงค์ว่างๆ หรือเลือกวันคืนเป็นวันในอดีต ทำให้ข้อมูลในระบบผิดพลาด ต้องมีการตรวจสอบก่อนส่ง!
:::

> 💡 **เปรียบเทียบ:** Form Validation เหมือน "เจ้าหน้าที่ที่เคาน์เตอร์" — ก่อนรับเรื่อง ต้องตรวจว่ากรอกครบไหม ลายเซ็นครบไหม ถ้าไม่ครบส่งกลับให้แก้ก่อน

---

## 📖 I: Information

ฟอร์มเบิกอุปกรณ์แสดงแบบ **inline** ในการ์ดอุปกรณ์ — เมื่อกดปุ่ม "ยืมอุปกรณ์" ฟอร์มจะปรากฏใต้การ์ดนั้นทันที

::: code-group
```tsx [BorrowForm ใน EquipmentPage.tsx]
import { useState, type FormEvent } from 'react'

interface BorrowFormProps {
  equipmentId: number
  onConfirm: (purpose: string, returnDate: string) => void
  onCancel: () => void
}

export function BorrowForm({ equipmentId, onConfirm, onCancel }: BorrowFormProps) {
  const [purpose, setPurpose] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {  // React.FormEvent TS Focus wk3
    e.preventDefault()   // ป้องกัน page reload
    setError(null)

    // Client-side Validation
    if (!purpose.trim()) {
      setError('กรุณาระบุวัตถุประสงค์การใช้งาน')
      return
    }

    const today = new Date().toISOString().split('T')[0]
    if (!returnDate || returnDate <= today) {
      setError('กรุณาเลือกวันคืนในอนาคต')
      return
    }

    onConfirm(purpose, returnDate)  // ส่งข้อมูลกลับไปที่ Parent
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 p-3 bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col gap-2"
    >
      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-xs font-medium">{error}</p>
      )}

      <input
        type="text"
        placeholder="วัตถุประสงค์การใช้งาน *"
        value={purpose}
        onChange={e => setPurpose(e.target.value)}
        className="border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="date"
        value={returnDate}
        onChange={e => setReturnDate(e.target.value)}
        className="border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
        >
          ยืนยันการยืม
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-semibold px-3 py-1.5 rounded-md"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
```
:::

::: tip 💡 TypeScript Tip — FormEvent
`type FormEvent = React.FormEvent` กำหนด type ให้ parameter `e` ใน `handleSubmit` ทำให้ TypeScript รู้ว่า `e.preventDefault()` มีอยู่จริง ไม่ต้อง guess
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React form component ด้วย TypeScript สำหรับยืมอุปกรณ์ มี 2 field: purpose (text input) และ returnDate (date input) ตรวจสอบว่า purpose ต้องไม่ว่าง และ returnDate ต้องเป็นวันในอนาคต แสดง error messages ด้วย useState และใช้ Tailwind CSS"
:::

### 📝 PjBL Lab

- [ ] สร้าง interface `BorrowFormProps` มี `equipmentId`, `onConfirm`, `onCancel`
- [ ] สร้าง state: `purpose`, `returnDate`, `error`
- [ ] เขียน `handleSubmit` ด้วย `e: FormEvent` — ต้องมี `e.preventDefault()`
- [ ] Validate: purpose ต้องไม่ว่าง, returnDate ต้องเป็นอนาคต
- [ ] แสดง error message ด้วย Tailwind (`text-red-600`)
- [ ] ปุ่ม "ยืนยัน" type="submit", ปุ่ม "ยกเลิก" type="button"
- [ ] ใช้ `BorrowForm` ใน `EquipmentCard` — แสดงเมื่อกดปุ่ม "ยืมอุปกรณ์"
- [ ] ทดสอบ: กด submit โดยไม่กรอกข้อมูล — ต้องมี error แสดง

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ `e.preventDefault()` ในฟอร์ม?
**แนวคำตอบ:** โดย default เมื่อกด submit ฟอร์ม HTML จะ reload หน้าทันที ทำให้ state หาย `e.preventDefault()` ป้องกันพฤติกรรมนี้ ให้เราจัดการ submit logic เองด้วย JavaScript แทน
:::

::: details ❓ ต่างกันอย่างไรระหว่าง `type="submit"` กับ `type="button"`?
**แนวคำตอบ:** `type="submit"` จะ trigger event `onSubmit` ของ `<form>` เมื่อถูกคลิก ส่วน `type="button"` ไม่ trigger form submit — ปุ่ม "ยกเลิก" ต้องเป็น `type="button"` ไม่งั้นจะ submit ฟอร์มแทน
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Validation ครบ | ตรวจ purpose + returnDate ถูกต้อง | ตรวจแค่บางส่วน | ไม่มี validation |
| Error แสดงถูก | error ชัดเจน หายเมื่อแก้แล้ว | error แสดงแต่ไม่หาย | ไม่มี error แสดง |
| FormEvent ถูก type | ใช้ `FormEvent` ถูกต้อง | ใช้ `any` | ไม่มี type |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `FormEvent` | TypeScript type สำหรับ event ที่เกิดจากการ submit ฟอร์ม |
| `e.preventDefault()` | ป้องกันพฤติกรรม default ของ browser (เช่น reload หน้า) |
| `Validation` | การตรวจสอบความถูกต้องของข้อมูลก่อนส่ง |
| `inline form` | ฟอร์มที่แสดงอยู่ภายในองค์ประกอบอื่น ไม่ใช่หน้าแยก |
| `Client-side` | การประมวลผลที่ฝั่ง Browser ก่อนส่งข้อมูลไป Server |
