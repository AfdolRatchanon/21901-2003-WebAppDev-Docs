# Form Validation — ตรวจสอบก่อนส่ง <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ฟอร์มเพิ่มอุปกรณ์ใน AdminPage มี 3 field — name, category, serialNo ถ้าผู้ใช้กด Submit โดยไม่กรอกข้อมูล server จะตอบ error 400 ที่เข้าใจยาก และ UX แย่มาก — จะดีกว่าไหมถ้าตรวจสอบ **ก่อนส่ง** และแสดงข้อความบอกว่า field ไหนกรอกไม่ครบทันที?
:::

> 💡 **เปรียบเทียบ:** Validation เหมือน "ระบบ checklist" ก่อน deploy — ถ้าข้อมูลไม่ครบหรือไม่ถูกรูปแบบ "ระบบหยุด" และบอกทันที แทนที่จะรอให้ server ปฏิเสธ

---

## 📖 I: Information

### ขั้นตอนที่ 1 — Object Form State + ทรงพลังด้วย `keyof` 

ในสัปดาห์ก่อนเราใช้ `useState` กำหนด State แยกกันทีละตัว (เช่น State สำหรับอีเมล และ State สำหรับรหัสผ่านแยกกัน) ซึ่งวิธีนั้นเหมาะกับฟอร์มเล็ก ๆ แต่ในโลกความเป็นจริง แบบฟอร์มมักมีช่องกรอกข้อมูล (Field) เยอะมาก เช่น สมัครสมาชิกอาจมี 10 ช่อง หากต้องสร้าง 10 State แยกย่อยก็จะตามดูแลรักษาลำบากมาก

**Object Form State** จึงเป็นทางออก โดยเราจะยุบรวมทุกช่องกรอกข้อมูลให้กลายเป็นก้อนข้อมูลใหญ่ (Object) ก้อนเดียว เพื่อให้จัดการและอัปเดตได้จากศูนย์กลาง 

นอกจากนี้ เรายังสามารถใช้ความสามารถของ TypeScript ที่เรียกว่า **`keyof`** เพื่อระบุว่าตัวแปรที่จะมารับค่าต้องเป็น 'ชื่อช่อง (Key)' ที่มีอยู่ใน Object Form State เท่านั้น หากเราเผลอพิมพ์ชื่อช่องผิด (เช่น จาก `category` เป็น `catgory`) TypeScript ก็จะร้องเตือนทันที ช่วยสกัดจับข้อผิดพลาดก่อนโปรแกรมถูกเปิดขึ้นมาด้วยซ้ำ

::: code-group
```tsx [✅ Object State — ขยายง่ายเมื่อ field เพิ่ม]
import { useState, type FormEvent } from 'react'

// [1] กำหนด interface รวม field ทั้งหมดของ form
interface EquipmentFormData {
  name:     string
  category: string
  serialNo: string
}

export function AddEquipmentForm() {
  // [2] useState<EquipmentFormData> — เก็บ form ทั้งหมดใน object เดียว
  const [form, setForm] = useState<EquipmentFormData>({
    name:     '',
    category: '',
    serialNo: '',
  })

  // [3] keyof EquipmentFormData = 'name' | 'category' | 'serialNo'
  //     ทำให้ TypeScript ตรวจสอบว่า field ที่ส่งมาต้องมีอยู่ใน interface จริง
  function handleChange(field: keyof EquipmentFormData, value: string) {
    // [4] Computed property name — [field] คือชื่อ key แบบ dynamic
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form>
      <input
        value={form.name}
        onChange={e => handleChange('name', e.target.value)}
        placeholder="ชื่ออุปกรณ์"
      />
      <input
        value={form.category}
        onChange={e => handleChange('category', e.target.value)}
        placeholder="หมวดหมู่"
      />
      <input
        value={form.serialNo}
        onChange={e => handleChange('serialNo', e.target.value)}
        placeholder="หมายเลขซีเรียล"
      />
    </form>
  )
}
```

```tsx [❌ แยก useState ทีละ field — ยิ่ง field มาก ยิ่งยุ่ง]
// ถ้า field เพิ่มเป็น 10 field ต้องสร้าง useState ใหม่ 10 ตัว
const [name,     setName]     = useState('')
const [category, setCategory] = useState('')
const [serialNo, setSerialNo] = useState('')
// ฟังก์ชัน reset ต้องเรียก setXxx('') ทุกตัว
// ถ้าลืม field หนึ่ง ข้อมูลเก่าค้างอยู่ใน form
```

```tsx [💡 keyof — TypeScript ตรวจ field name ให้]
interface EquipmentFormData {
  name:     string
  category: string
  serialNo: string
}

// keyof EquipmentFormData = 'name' | 'category' | 'serialNo'
// ถ้าพิมพ์ field ผิด TypeScript Error ทันที:
handleChange('nam', value)
// ❌ Argument of type '"nam"' is not assignable to parameter
//    of type 'keyof EquipmentFormData'

handleChange('name', value)  // ✅ ถูกต้อง
```
:::

**สรุป:** Object state → ขยาย field ง่าย · `keyof` → TypeScript ตรวจ field name ✅

---

### ขั้นตอนที่ 2 — Validation Function (คืน `string | null`)

แยก logic ตรวจสอบออกเป็นฟังก์ชัน — คืน `null` เมื่อผ่าน, คืน `string` เมื่อมี error:

```tsx [src/pages/EquipmentPage.tsx — เพิ่ม validateForm]
// [1] ฟังก์ชัน validate — รับ FormData คืน error message หรือ null
//     ตรวจสอบทีละเงื่อนไข คืนทันทีเมื่อพบ error แรก (Early Return)
function validateEquipmentForm(form: EquipmentFormData): string | null {
  if (!form.name.trim())     return 'กรุณากรอกชื่ออุปกรณ์'
  if (!form.category.trim()) return 'กรุณากรอกหมวดหมู่'
  if (!form.serialNo.trim()) return 'กรุณากรอกหมายเลขซีเรียล'
  if (form.serialNo.length < 3) return 'หมายเลขซีเรียลต้องมีอย่างน้อย 3 ตัวอักษร'
  return null  // [2] ผ่านทุกเงื่อนไข
}

export function AddEquipmentForm() {
  const [form, setForm]           = useState<EquipmentFormData>({ name: '', category: '', serialNo: '' })
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSuccess, setFormSuccess]   = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFormError(null)   // [3] ล้าง error เก่าก่อน
    setFormSuccess(null)

    // [4] ตรวจสอบก่อนส่ง — ถ้ามี error หยุดทันที
    const errorMsg = validateEquipmentForm(form)
    if (errorMsg) {
      setFormError(errorMsg)
      return
    }

    setIsSubmitting(true)
    try {
      // [5] ผ่าน validation แล้ว — ส่งข้อมูล (wk4 จะเชื่อม API จริง)
      console.log('Submitting:', form)
      setFormSuccess(`เพิ่มอุปกรณ์ "${form.name}" เรียบร้อยแล้ว`)
      setForm({ name: '', category: '', serialNo: '' })  // [6] reset form
    } catch {
      setFormError('ไม่สามารถเพิ่มอุปกรณ์ได้ กรุณาลองใหม่')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleChange(field: keyof EquipmentFormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">

      {/* [7] Error Alert — แสดงเมื่อ formError ไม่ใช่ null */}
      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {formError}
        </div>
      )}

      {/* [8] Success Alert */}
      {formSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          {formSuccess}
        </div>
      )}

      <input
        value={form.name}
        onChange={e => handleChange('name', e.target.value)}
        placeholder="ชื่ออุปกรณ์ *"
        className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        value={form.category}
        onChange={e => handleChange('category', e.target.value)}
        placeholder="หมวดหมู่ (Notebook, Tablet, AV) *"
        className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        value={form.serialNo}
        onChange={e => handleChange('serialNo', e.target.value)}
        placeholder="หมายเลขซีเรียล *"
        className="border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
      >
        {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มอุปกรณ์'}
      </button>
    </form>
  )
}
```

---

### ขั้นตอนที่ 3 — Per-Field Error (แสดง error ใต้แต่ละ field)

ยกระดับ UX: แทนที่จะแสดง error message เดียวที่บนสุด ให้แสดงใต้ field ที่มีปัญหา:

```tsx [v3 — Per-Field Errors ด้วย Partial Record]
// [1] type สำหรับ errors object:
//     Partial = ทุก key เป็น optional (ไม่ต้องมีทุก key)
//     Record<keyof EquipmentFormData, string> = object ที่ key คือชื่อ field
type FormErrors = Partial<Record<keyof EquipmentFormData, string>>

// [2] ฟังก์ชัน validate คืน FormErrors (object ของ errors ทั้งหมด)
function validateAll(form: EquipmentFormData): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim())          errors.name     = 'กรุณากรอกชื่ออุปกรณ์'
  if (!form.category.trim())      errors.category = 'กรุณากรอกหมวดหมู่'
  if (!form.serialNo.trim())      errors.serialNo = 'กรุณากรอกหมายเลขซีเรียล'
  else if (form.serialNo.length < 3) errors.serialNo = 'ต้องมีอย่างน้อย 3 ตัวอักษร'
  return errors
}

// ใน Component:
const [fieldErrors, setFieldErrors] = useState<FormErrors>({})

async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  const errors = validateAll(form)
  // [3] Object.keys เช็คว่า errors มีกี่ field
  if (Object.keys(errors).length > 0) {
    setFieldErrors(errors)
    return
  }
  setFieldErrors({})
  // ... ส่งข้อมูล
}

// [4] ใน JSX — แสดง error ใต้แต่ละ input:
<input value={form.name} onChange={e => handleChange('name', e.target.value)} ... />
{fieldErrors.name && (
  <p className="text-xs text-red-500 mt-0.5">{fieldErrors.name}</p>
)}

<input value={form.category} onChange={e => handleChange('category', e.target.value)} ... />
{fieldErrors.category && (
  <p className="text-xs text-red-500 mt-0.5">{fieldErrors.category}</p>
)}
```

::: tip 💡 ตอนนี้แสดง error ทีละอัน (Early Return) ก็ใช้งานได้ดีแล้ว
Per-Field errors ใน Step 3 เป็น bonus สำหรับ UX ที่ดีขึ้น โปรเจกต์จริง (answer key) ใช้แบบ Step 2 — แสดง error message เดียวที่บนสุด ก็เพียงพอแล้วสำหรับ wk3
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้าง form เพิ่มอุปกรณ์ (name, category, serialNo) โดย: 1) ใช้ `useState<EquipmentFormData>({...})` แทนการสร้าง useState ทีละ field 2) มี handleChange ที่รับ `field: keyof EquipmentFormData` และ value string แล้วใช้ computed property `[field]` 3) มี validateForm ที่คืน `string | null` ตรวจสอบว่าทุก field ไม่ว่าง 4) แสดง `formError` state ด้วย alert สีแดง, `formSuccess` ด้วยสีเขียว 5) ปุ่ม disabled ขณะ isSubmitting — ใช้ Tailwind CSS"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` (หรือสร้าง `AddEquipmentForm.tsx` ใหม่) → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: Object Form State + handleChange (15 นาที)**

- [ ] สร้าง `interface EquipmentFormData` มี field: `name`, `category`, `serialNo` (export ไว้ที่ `src/types/index.ts`)
- [ ] ใช้ `useState<EquipmentFormData>({ name: '', category: '', serialNo: '' })`
- [ ] เขียน `handleChange(field: keyof EquipmentFormData, value: string)` ด้วย `[field]` computed property
- [ ] ทดสอบ: พิมพ์ `handleChange('nam', value)` → ต้องเห็น TypeScript Error ✅
- [ ] เชื่อม `onChange` ทุก input ใช้ handleChange

**ขั้น 2: Validation Function + Error/Success State (15 นาที)**

- [ ] เขียน `function validateEquipmentForm(form: EquipmentFormData): string | null`
  - ตรวจ `!form.name.trim()` → คืน error message ภาษาไทย
  - ตรวจ `!form.category.trim()` → คืน error message
  - ตรวจ `!form.serialNo.trim()` → คืน error message
- [ ] เพิ่ม state: `formError: string | null`, `formSuccess: string | null`, `isSubmitting: boolean`
- [ ] ใน `handleSubmit`: เรียก `validateEquipmentForm` ก่อน — ถ้ามี error `setFormError` แล้ว `return`
- [ ] ทดสอบ: กด Submit โดยไม่กรอก → ต้องเห็น error alert สีแดง ✅
- [ ] ทดสอบ: กรอกครบ → ต้องเห็น success alert สีเขียว + form reset ✅

**ขั้น 3: UX Improvements (10 นาที)**

- [ ] เพิ่ม `disabled={isSubmitting}` + `disabled:opacity-60 disabled:cursor-not-allowed` ที่ปุ่ม
- [ ] เปลี่ยน label ปุ่มเป็น `isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มอุปกรณ์'`
- [ ] เพิ่ม `focus:ring-2 focus:ring-blue-500` ที่ทุก input
- [ ] ทดสอบ UI ให้ครบทุก case: ว่าง / กรอกผิด / กรอกถูก / กำลัง submit ✅
- [ ] (Bonus) เพิ่ม Per-Field error (Step 3) — แสดงข้อผิดพลาดใต้ input แต่ละอัน

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk3: add form validation with object state and keyof TypeScript"` → `git push`
- [ ] เขียนสรุปใน Google Doc: Object form state ต่างจาก individual state อย่างไร, `keyof` คืออะไร, `validateForm` คืน `string | null` แปลว่าอะไร พร้อม screenshot แสดง error message และ success message

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ Object form state แทน useState แยกทีละ field?
**แนวคำตอบ:** เมื่อ form มีหลาย field Object state ช่วยให้: 1) Reset form ง่าย — แค่ `setForm({ name: '', category: '', serialNo: '' })` แทนเรียก `setXxx('')` ทุกตัว 2) ส่งข้อมูลเป็น object ได้เลยโดยไม่ต้องรวม 3) `handleChange` ใช้ร่วมกันได้ทุก field ด้วย `keyof` ไม่ต้องสร้างฟังก์ชันแยก
:::

::: details ❓ `keyof EquipmentFormData` คืออะไร — ต่างจาก `string` อย่างไร?
**แนวคำตอบ:** `keyof EquipmentFormData` คือ Union Type ของ key ทั้งหมดใน interface นั้น ได้ผลเท่ากับ `'name' | 'category' | 'serialNo'` — ถ้ากำหนด parameter เป็น `keyof EquipmentFormData` TypeScript จะตรวจสอบว่าค่าที่ส่งมาต้องเป็น key ที่มีอยู่จริง พิมพ์ผิด Error ทันที ต่างจาก `string` ที่รับอะไรก็ได้โดยไม่ตรวจ
:::

::: details ❓ `{ ...prev, [field]: value }` ทำงานอย่างไร?
**แนวคำตอบ:** `...prev` คือ spread ข้อมูลเดิมทั้งหมดออกมา ส่วน `[field]: value` คือ **Computed Property Name** — `[field]` หมายถึงใช้ค่าของตัวแปร `field` เป็นชื่อ key ในขณะ runtime เช่น ถ้า `field = 'name'` จะได้ `{ name: value }` — รวมกันเป็น object ใหม่ที่มีข้อมูลเดิมครบ เปลี่ยนเฉพาะ field ที่ต้องการ
:::

::: details ❓ ทำไม validateForm ถึงคืน `string | null` แทนที่จะคืน `boolean`?
**แนวคำตอบ:** ถ้าคืน `boolean` เรารู้แค่ว่า "ผ่าน" หรือ "ไม่ผ่าน" แต่ไม่รู้ว่าผิดอะไร ต้องสร้าง error message แยก ส่วน `string | null` รวม 2 อย่างไว้ใน return value เดียว — `null` หมายถึงผ่าน, `string` หมายถึงมี error พร้อมข้อความบอก ทำให้ใช้ได้ทันที: `const error = validate(form); if (error) setFormError(error)`
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Object Form State | `useState<FormData>` + `keyof` + `[field]` ครบ | มี object state แต่ไม่ใช้ `keyof` | ยังใช้ individual state |
| Validation Function | ตรวจครบทุก field คืน `string \| null` | ตรวจได้บางส่วน | ไม่มี validation |
| Error/Success UX | แสดง alert, disabled submit, form reset | มีบางส่วน | ไม่แสดง feedback |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `keyof T` | TypeScript operator คืน Union ของ key ทั้งหมดใน type T |
| `Computed Property Name` | `[variable]: value` — ใช้ตัวแปรเป็นชื่อ key ของ object ใน JavaScript |
| `Partial<T>` | TypeScript utility type ทำให้ทุก field ใน T เป็น optional |
| `Record<K, V>` | TypeScript type: object ที่ key เป็น K และ value เป็น V |
| `Early Return` | return ออกจากฟังก์ชันทันทีเมื่อพบเงื่อนไข เพื่อหลีกเลี่ยง nested if |
| `Form Reset` | การล้างค่าใน form กลับสู่ค่าเริ่มต้นหลัง submit สำเร็จ |
| `disabled:opacity-60` | Tailwind class ที่ใช้เมื่อ element มี attribute `disabled` |
