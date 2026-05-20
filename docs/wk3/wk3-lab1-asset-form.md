# Lab: EquipmentPage ด้วย Tailwind + BorrowForm + Validation <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** Lab นี้รวมความรู้ wk3 ทั้งหมด (Tailwind, Controlled Form, Validation) มาสร้างชิ้นงานที่สมบูรณ์ BorrowForm ที่สร้างในบทนี้จะถูก integrate กับ API จริงใน wk4 และ realtime update ใน wk7

::: info 🔗 ต่อยอดจาก wk1 + wk3-content4
Lab นี้ **ต่อยอดจากโค้ดที่มีอยู่แล้ว** ไม่ได้สร้างใหม่ทั้งหมด:
- `src/components/EquipmentCard.tsx` — สร้างไว้ตั้งแต่ wk1 และ refactor เพิ่ม `onBorrow` ใน wk3-content4 แล้ว
- `src/pages/EquipmentPage.tsx` — มี `borrowingId` state และ `handleBorrow` จาก wk3-content4 แล้ว
- Lab นี้จะ **แปลง inline style → Tailwind** และ **เพิ่ม BorrowForm** เข้าไป
:::

```
wk1  EquipmentCard  (string props, แสดงข้อมูล)
wk2  EquipmentPage  (useState + mock data array)
wk3-content4  EquipmentCard + onBorrow, EquipmentPage + borrowingId
     ↓  Lab นี้
wk3-lab  EquipmentCard + Tailwind, EquipmentPage + BorrowForm + Validation
```

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ใน wk2 หน้า EquipmentPage ใช้ inline style ทั้งหมดและยังไม่มีฟอร์มยืมอุปกรณ์ — ใน wk3 นี้จะยกระดับให้ครบทั้ง 3 ด้าน: เปลี่ยน inline style เป็น Tailwind classes ให้ UI สวยขึ้น, เพิ่มฟอร์มยืมที่แสดง inline ในการ์ด, และตรวจสอบข้อมูลก่อน submit เพื่อป้องกัน request ที่ไม่สมบูรณ์
:::

> 💡 **เปรียบเทียบ:** Lab นี้เหมือน "งานปรับปรุงร้านค้า" — เปลี่ยนป้ายเก่าเป็นป้ายสวย (Tailwind), เพิ่มเคาน์เตอร์บริการ (BorrowForm), และวางระบบตรวจสอบก่อนรับเรื่อง (Validation) — ทั้งหมดนี้คือ wk3 ในไฟล์เดียว

## 📖 I: Information

ใน Lab นี้ เราจะนำความรู้ทั้งหมดจากเนื้อหาสัปดาห์ที่ 3 (wk3) มาประกอบกันเป็นชิ้นงานที่สมบูรณ์และใกล้เคียงกับการใช้งานจริงมากขึ้น โดยแบ่งออกเป็น 3 ส่วนหลัก:

1. **ปรับโฉมด้วย Tailwind CSS:** เปลี่ยนระบบดีไซน์จากของเดิม (Inline Style) ที่เขียนลอย ๆ ตาม HTML ให้เป็น 'Utility Classes' ของ Tailwind CSS แทน เพื่อให้โค้ดดูเป็นระเบียบ อ่านง่ายและสะดวกต่อการจัดโครงสร้าง (Responsive)
2. **สร้างระบบยืมด้วย Controlled Form:** สร้างคอมโพเนนต์ `<BorrowForm />` ย่อยขึ้นมา ซึ่งผู้ใช้จะสามารถโต้ตอบได้ทุกองค์ประกอบ (Controlled Form) โดยเราจะจับค่าการพิมพ์ของผู้ใช้ลงใน State ตลอดเวลา
3. **ป้องกันข้อผิดพลาดด้วย Validation:** ก่อนที่แบบฟอร์มจะถูกส่งไป เราจะใช้แนวคิดการดักจับข้อผิดพลาด (Early Return) ตรวจเช็กความถูกต้องของข้อมูล เช่น ผู้ใช้กรอกจุดประสงค์หรือยัง หรือเลือกวันที่เป็นอดีตหรือไม่ เพื่อสกัดกั้นข้อมูลที่ไม่ถูกต้องตั้งแต่ด่านแรก

### ขั้นตอนที่ 1 — EquipmentPage พร้อม Tailwind + statusConfig

นำ `EquipmentPage.tsx` จาก wk2 มาแปลง inline style → Tailwind โดยเพิ่ม `statusConfig`:

```tsx [src/pages/EquipmentPage.tsx — v3 ก่อนเพิ่ม BorrowForm]
import { useState } from 'react'
import type { Equipment } from '../types'

const mockEquipments: Equipment[] = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Notebook', serialNo: 'MB-001', status: 'available',   borrowedBy: null         },
  { id: 2, name: 'iPad Air',        category: 'Tablet',   serialNo: 'IP-001', status: 'borrowed',    borrowedBy: 'สมชาย ใจดี' },
  { id: 3, name: 'Projector Epson', category: 'AV',       serialNo: 'PJ-001', status: 'maintenance', borrowedBy: null         },
]

const statusLabel: Record<string, string> = {
  available: 'ว่าง', borrowed: 'ถูกยืม', maintenance: 'ซ่อมบำรุง',
}

// [1] statusConfig — รวม Tailwind classes ตาม status ไว้ที่เดียว
const statusConfig: Record<string, { border: string; badge: string }> = {
  available:   { border: 'border-l-green-500', badge: 'bg-green-100 text-green-700'  },
  borrowed:    { border: 'border-l-red-500',   badge: 'bg-red-100 text-red-700'      },
  maintenance: { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700' },
}

export function EquipmentPage() {
  const [equipments]    = useState<Equipment[]>(mockEquipments)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const displayed = filterStatus === 'all'
    ? equipments
    : equipments.filter(eq => eq.status === filterStatus)

  return (
    // [2] max-w-6xl mx-auto — จำกัดความกว้าง, px-6 py-8 — padding
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">รายการอุปกรณ์</h1>

      {/* [3] Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'available', 'borrowed', 'maintenance'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === s
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === 'all' ? 'ทั้งหมด' : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* [4] Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map(eq => {
          const config = statusConfig[eq.status]
          return (
            // [5] card ด้วย Tailwind — border-l-4 สีตาม config.border
            <div
              key={eq.id}
              className={`bg-white rounded-xl border border-slate-200 border-l-4 ${config.border} p-4 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="font-bold text-slate-800 text-sm">{eq.name}</span>
                {/* [6] badge ด้วย config.badge */}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${config.badge}`}>
                  {statusLabel[eq.status]}
                </span>
              </div>
              <p className="text-xs text-slate-500">{eq.category} · {eq.serialNo}</p>
              {eq.borrowedBy && (
                <p className="text-xs text-red-500 font-semibold mt-1">ยืมโดย: {eq.borrowedBy}</p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
```

### ขั้นตอนที่ 2 — BorrowForm Component

ฟอร์มยืมอุปกรณ์แสดงแบบ **inline** ใต้การ์ด — กดปุ่ม "ยืมอุปกรณ์" แล้วฟอร์มปรากฏ:

```tsx [src/components/BorrowForm.tsx — v1 (Controlled Form + Validation)]
import { useState, type FormEvent } from 'react'

// [1] Props ที่ BorrowForm ต้องรับจาก Parent
interface BorrowFormProps {
  onConfirm: (purpose: string, returnDate: string) => void
  onCancel:  () => void
}

export function BorrowForm({ onConfirm, onCancel }: BorrowFormProps) {
  // [2] state ของ form — 2 fields + error
  const [purpose,    setPurpose]    = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [error,      setError]      = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()  // [3] ป้องกัน page reload
    setError(null)       // ล้าง error เก่าก่อนตรวจใหม่

    // [4] Validation — ตรวจ purpose
    if (!purpose.trim()) {
      setError('กรุณาระบุวัตถุประสงค์การใช้งาน')
      return
    }

    // [5] Validation — ตรวจ returnDate ต้องเป็นอนาคต
    const today = new Date().toISOString().split('T')[0]  // เช่น '2026-02-26'
    if (!returnDate) {
      setError('กรุณาเลือกวันที่คาดว่าจะคืน')
      return
    }
    if (returnDate <= today) {
      setError('กรุณาเลือกวันคืนในอนาคต (พรุ่งนี้เป็นต้นไป)')
      return
    }

    // [6] ผ่าน validation แล้ว — ส่งข้อมูลให้ Parent
    onConfirm(purpose, returnDate)
  }

  return (
    // [7] inline form ด้วย Tailwind — bg-slate-50 + border-dashed
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
      {/* [8] input type="date" — browser แสดง date picker อัตโนมัติ */}
      <input
        type="date"
        value={returnDate}
        onChange={e => setReturnDate(e.target.value)}
        className="border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex gap-2">
        {/* [9] type="submit" — trigger onSubmit ของ <form> */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md"
        >
          ยืนยันการยืม
        </button>
        {/* [10] type="button" — ไม่ trigger form submit */}
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

### ขั้นตอนที่ 3 — ใส่ BorrowForm ใน EquipmentPage (inline borrow flow)

เพิ่ม state `borrowingId` เพื่อรู้ว่ากำลังยืมการ์ดไหนอยู่:

```tsx [src/pages/EquipmentPage.tsx — v4 (เพิ่ม BorrowForm inline)]
import { BorrowForm } from '../components/BorrowForm'

export function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments)
  const [filterStatus, setFilterStatus]   = useState<string>('all')
  // [1] borrowingId — null=ไม่มีฟอร์มเปิด, number=ID ของการ์ดที่กำลังยืม
  const [borrowingId, setBorrowingId]     = useState<number | null>(null)

  const displayed = filterStatus === 'all'
    ? equipments
    : equipments.filter(eq => eq.status === filterStatus)

  // [2] เมื่อยืนยัน — เปลี่ยน status เป็น 'borrowed' ใน state
  function handleConfirmBorrow(equipmentId: number, purpose: string, returnDate: string) {
    setEquipments(prev =>
      prev.map(eq =>
        eq.id === equipmentId
          ? { ...eq, status: 'borrowed', borrowedBy: `Mock User (${purpose})` }
          : eq
      )
    )
    setBorrowingId(null)  // ปิดฟอร์ม
    console.log('Borrow confirmed:', { equipmentId, purpose, returnDate })
    // wk4: เปลี่ยนเป็น API call จริง
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      {/* ... header + filters เหมือนเดิม ... */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map(eq => {
          const config = statusConfig[eq.status]
          return (
            <div
              key={eq.id}
              className={`bg-white rounded-xl border border-slate-200 border-l-4 ${config.border} p-4 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="font-bold text-slate-800 text-sm">{eq.name}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${config.badge}`}>
                  {statusLabel[eq.status]}
                </span>
              </div>
              <p className="text-xs text-slate-500">{eq.category} · {eq.serialNo}</p>
              {eq.borrowedBy && (
                <p className="text-xs text-red-500 font-semibold mt-1">ยืมโดย: {eq.borrowedBy}</p>
              )}

              {/* [3] แสดงปุ่ม "ยืมอุปกรณ์" เฉพาะเมื่อ available */}
              {eq.status === 'available' && borrowingId !== eq.id && (
                <button
                  onClick={() => setBorrowingId(eq.id)}
                  className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold py-1.5 rounded-lg transition-colors"
                >
                  ยืมอุปกรณ์
                </button>
              )}

              {/* [4] แสดง BorrowForm เมื่อ borrowingId ตรงกับการ์ดนี้ */}
              {borrowingId === eq.id && (
                <BorrowForm
                  onConfirm={(purpose, returnDate) =>
                    handleConfirmBorrow(eq.id, purpose, returnDate)
                  }
                  onCancel={() => setBorrowingId(null)}
                />
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
```

**สรุปการทำงาน:**
- `borrowingId === null` → ทุกการ์ดแสดงปุ่ม "ยืมอุปกรณ์" (ถ้า available) ✅
- กดปุ่ม → `setBorrowingId(eq.id)` → การ์ดนั้นแสดง BorrowForm แทนปุ่ม ✅
- กรอกครบ + กด "ยืนยัน" → `handleConfirmBorrow` → status เปลี่ยน → form ปิด ✅
- กด "ยกเลิก" → `setBorrowingId(null)` → form ปิด กลับแสดงปุ่ม ✅

## 🛠️ A: Application

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า `borrowingId: number | null` ทำงานอย่างไร และทำไมไม่ใช้ `boolean` แทน
- [ ] บอกได้ว่า `type="button"` กับ `type="submit"` ต่างกันอย่างไร และเมื่อไหรต้องระบุ type ให้ชัด
:::

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript + Tailwind CSS v3 อยู่ มี EquipmentPage ที่แสดงรายการอุปกรณ์ด้วย mock data ต้องการเพิ่ม: 1) `statusConfig` object รวม Tailwind class ของ border และ badge ตาม status 2) `BorrowForm` component ที่แสดง inline ในการ์ด มี input text (วัตถุประสงค์) + input date (วันคืน) + validation ก่อน submit 3) state `borrowingId: number | null` ที่ควบคุมว่าการ์ดไหนกำลังแสดง form อยู่ — ใช้ Tailwind CSS + FormEvent TypeScript"
:::

### 📝 PjBL Lab — ชิ้นงาน: `EquipmentPage.tsx`, `BorrowForm.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: ติดตั้ง Tailwind + แปลง inline style (15 นาที)**

- [ ] ติดตั้ง Tailwind CSS v3 ด้วย `npm install -D tailwindcss@3 postcss autoprefixer`
- [ ] รัน `npx tailwindcss init -p` และตั้งค่า `content` ใน config
- [ ] เพิ่ม `@tailwind` directives ใน `src/index.css`
- [ ] แปลง `<main style=&#123;&#123; padding: 24 &#125;&#125;>` → `<main className="max-w-6xl mx-auto px-6 py-8">`
- [ ] แปลง filter buttons, card wrapper, badge ทั้งหมดเป็น Tailwind class
- [ ] ไม่มี `style=&#123;&#123; &#125;&#125;` เหลืออยู่ในไฟล์ ✅

**ขั้น 2: เพิ่ม statusConfig + Responsive Grid (10 นาที)**

- [ ] สร้าง `statusConfig` object ชนิด `Record<string, { border: string; badge: string }>`
- [ ] ใส่ Tailwind class สำหรับ available (green), borrowed (red), maintenance (amber)
- [ ] เปลี่ยน card wrapper เป็น template literal `` `bg-white ... ${config.border}` ``
- [ ] เปลี่ยน badge เป็น `` className={`text-xs ... ${config.badge}`} ``
- [ ] เปลี่ยน grid wrapper เป็น `className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"`
- [ ] ทดสอบ Responsive: ลากขนาด browser → เห็น layout เปลี่ยน ✅

**ขั้น 3: BorrowForm + Inline Validation (20 นาที)**

- [ ] สร้างไฟล์ `src/components/BorrowForm.tsx`
- [ ] กำหนด `interface BorrowFormProps` มี `onConfirm: (purpose, returnDate) => void`, `onCancel: () => void`
- [ ] สร้าง state: `purpose: string`, `returnDate: string`, `error: string | null`
- [ ] เขียน `handleSubmit(e: FormEvent)` ด้วย `e.preventDefault()` + validation 2 เงื่อนไข
  - purpose ต้องไม่ว่าง
  - returnDate ต้องมากกว่า today (ใช้ `new Date().toISOString().split('T')[0]`)
- [ ] แสดง `error` ด้วย `<p className="text-red-600 text-xs">` เมื่อมีค่า
- [ ] ปุ่ม "ยืนยัน" ใช้ `type="submit"`, ปุ่ม "ยกเลิก" ใช้ `type="button" onClick={onCancel}`
- [ ] ทดสอบ: submit โดยไม่กรอก purpose → ต้องเห็น error ✅

**ขั้น 4: รวม BorrowForm ใน EquipmentPage (10 นาที)**

- [ ] เพิ่ม state `borrowingId: number | null` เริ่มต้น `null` ใน EquipmentPage
- [ ] เพิ่มปุ่ม "ยืมอุปกรณ์" ในการ์ดที่ `status === 'available'` เท่านั้น
- [ ] ใช้เงื่อนไข `{borrowingId === eq.id && <BorrowForm ... />}` แสดงฟอร์ม
- [ ] เขียน `handleConfirmBorrow` ที่อัปเดต status เป็น `'borrowed'` ใน state
- [ ] ทดสอบ flow ครบ: กดยืม → กรอกข้อมูล → ยืนยัน → การ์ดเปลี่ยนสี ✅
- [ ] ทดสอบ: กดยืมแล้วกด ยกเลิก → ฟอร์มหายไป ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add src/pages/EquipmentPage.tsx src/components/BorrowForm.tsx tailwind.config.js && git commit -m "wk3: Tailwind CSS, statusConfig, BorrowForm with validation"` → `git push`
- [ ] เขียนสรุปใน Google Doc: Tailwind ดีกว่า inline style อย่างไร, `borrowingId` state ทำงานยังไง, `returnDate <= today` ตรวจสอบอะไร พร้อม screenshot form validation + form หลังยืมสำเร็จ + ลิงก์ repo

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `borrowingId` เป็น `number | null` แทนที่จะเป็น `boolean`?
**แนวคำตอบ:** `boolean` รู้แค่ว่า "เปิดหรือปิด" แต่ไม่รู้ว่า "การ์ดไหน" เมื่อใช้ `number | null` เราเก็บ ID ของการ์ดที่กำลังยืมได้เลย — ตรวจด้วย `borrowingId === eq.id` เพื่อแสดง form เฉพาะการ์ดนั้น ถ้าใช้ boolean ต้องสร้าง state แยก 2 ตัว (isOpen + openCardId) ซึ่งยุ่งกว่า
:::

::: details ❓ ทำไม `returnDate <= today` ถึงเปรียบ string ได้?
**แนวคำตอบ:** วันที่ format ISO `'YYYY-MM-DD'` เรียงลำดับตัวอักษรได้ตรงกับลำดับเวลาพอดี เช่น `'2026-02-26' <= '2026-02-25'` ผล false (วันนี้ไม่น้อยกว่าเมื่อวาน) JavaScript เปรียบ string ทีละ character ซึ่งใช้ได้กับ ISO date format โดยไม่ต้องแปลงเป็น Date object
:::

::: details ❓ `type="button"` กับ `type="submit"` ต่างกันอย่างไร?
**แนวคำตอบ:** ปุ่มภายใน `<form>` มีค่า default เป็น `type="submit"` — ถ้าไม่ระบุ type กดแล้วจะ trigger `onSubmit` ของ form เสมอ ปุ่ม "ยกเลิก" ต้องระบุ `type="button"` ชัดเจน ไม่งั้นกดยกเลิกแล้วจะ submit form แทน ทำให้ validation ทำงานและ BorrowForm พยายามยืนยัน
:::

::: details ❓ ทำไม BorrowForm ไม่มี state ของ `equipmentId` ภายใน?
**แนวคำตอบ:** `BorrowForm` รับแค่ `onConfirm` และ `onCancel` — เป็น Component ที่ "ไม่รู้" ว่าตัวเองอยู่ในการ์ดไหน ความรับผิดชอบของมันคือ "รวบรวมข้อมูลจากผู้ใช้และ validate" แล้วส่งกลับ Parent ผ่าน `onConfirm` ส่วน Parent (EquipmentPage) รู้ว่ากำลัง borrow card id อะไรอยู่ นี่คือ **Separation of Concerns** — แยกความรับผิดชอบ
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| กด "ยกเลิก" แล้ว form submit แทน | ปุ่ม "ยกเลิก" ไม่มี `type="button"` — default ใน `<form>` คือ `type="submit"` | เพิ่ม `type="button"` ให้ปุ่มยกเลิกทุกตัวใน form |
| Tailwind class ใส่แล้วไม่ทำงานใน BorrowForm ใหม่ | ไฟล์ BorrowForm.tsx อยู่นอก `content` glob ของ Tailwind | ตรวจสอบ `tailwind.config.js` ว่า content ครอบคลุม `'./src/**/*.tsx'` |
| `returnDate <= today` ไม่ตรวจจับวันที่ผิด | วันที่ไม่ใช่ ISO format `YYYY-MM-DD` หรือ today คำนวณผิด | ตรวจสอบ `new Date().toISOString().split('T')[0]` ได้ `'2026-05-18'` รูปแบบถูก |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Tailwind + statusConfig | ไม่มี inline style เหลือ, grid responsive ทำงาน | แปลงบางส่วน | ยังใช้ inline style |
| BorrowForm Validation | ตรวจ purpose + date ถูกต้อง, error แสดงชัดเจน | ตรวจแค่บางส่วน | ไม่มี validation |
| Inline BorrowForm flow | กด-กรอก-ยืนยัน-การ์ดเปลี่ยน flow ครบ | flow ทำงานบางส่วน | BorrowForm ไม่ integrate |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `borrowingId: number \| null` | บอร์-โรว-อิง-ไอดี | state ที่เก็บ ID ของการ์ดที่กำลัง borrow — null เมื่อไม่มีฟอร์มเปิด |
| `Inline Form` | อิน-ไลน์ ฟอร์ม | ฟอร์มที่แสดงอยู่ภายในองค์ประกอบอื่น ไม่ใช่หน้าแยก (Modal, Page) |
| `Separation of Concerns` | เซ-พา-เร-ชัน ออฟ คอน-เซิร์นส์ | แยกความรับผิดชอบ — BorrowForm รับผิดชอบ UI, EquipmentPage รับผิดชอบ logic |
| `onConfirm` / `onCancel` | ออน-คอน-เฟิร์ม / ออน-แคน-เซิล | Callback Props — ฟังก์ชันที่ Parent ส่งให้ Child เรียกเมื่อมี event |
| `ISO 8601` | ไอ-เอส-โอ แปด-หก-ศูนย์-หนึ่ง | รูปแบบวันที่ `YYYY-MM-DD` ที่เปรียบเทียบด้วย string ได้ถูกต้อง |
| `type="button"` | ไทพ์ บัท-เทิน | กำหนดให้ปุ่มไม่ trigger form submit เมื่ออยู่ภายใน `<form>` |
