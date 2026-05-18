# Custom Hooks — แยก Logic ออกจาก UI <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** สร้าง useEquipments Hook ที่จะใช้ใน EquipmentPage และ AdminPage ตั้งแต่ wk4 เป็นต้นไป

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายมีหลายหน้าที่ต้องแสดงรายการอุปกรณ์ — ทั้ง `EquipmentPage` และ `AdminPage` ถ้าเขียนโค้ด useState + useEffect ซ้ำทุกหน้า เมื่อ API เปลี่ยน ต้องไปแก้ทุกที่ และถ้า Loading/Error logic ต่างกัน UI จะแสดงผลไม่สม่ำเสมอ
:::

> 💡 **เปรียบเทียบ:** Custom Hook เหมือน "สูตรทำอาหารกลาง" — เขียนสูตรครั้งเดียว ทุกหน้าเรียกใช้ได้ ถ้าสูตรเปลี่ยนก็แก้แค่ที่เดียว

## 📖 I: Information

### Custom Hook คืออะไร?

เมื่อในโปรเจกต์ของเราเริ่มมี Component มากขึ้น และแต่ละ Component มีการทำงาน (Logic) ที่คล้ายคลึงหรือซ้ำซ้อนกันมาก ๆ เช่น การจัดการ State (`useState`) และการดึงข้อมูล (`useEffect`) การขียนโค้ดคำสั่งเหล่านั้นซ้ำ ๆ ในทุกไฟล์จะทำให้บำรุงรักษายาก แก้ทีต้องคอยเปลี่ยนทุกที่ และทำให้ไฟล์มีแต่โค้ดของตรรกะจนลบภาพความสวยงามของโครงสร้าง UI ใน JSX ไป

**Custom Hook** เป็นวิธีแก้ปัญหานี้ โดยมันคือการนำตรรกะ (Logic) ที่เกี่ยวกับการเปลี่ยนแปลง State หรือ Side Effects ออกมาห่อหุ้มไว้ให้กลายเป็น "ฟังก์ชันของตัวเราเอง" เพื่อสกัดแยกการจัดการข้อมูลออกจากหน้าตา (Separation of Concerns) ทำให้โค้ดของเราสะอาด (Clean Code) ลดความซ้ำซ้อน นำกลับมาใช้ซ้ำกับ Component ตัวไหนก็ได้ (Reusability) และช่วยให้แก้ไขระบบทั้งหมดได้จากศูนย์กลาง (Single Source of Truth)

**Custom Hook** คือฟังก์ชัน TypeScript ธรรมดา ที่:
1. ชื่อขึ้นต้นด้วย **`use`** — React ใช้นี้แยกแยะ Hook ออกจากฟังก์ชันทั่วไป
2. เรียกใช้ React Hooks (`useState`, `useEffect`) ข้างใน
3. **return** ค่าออกมาให้ Component ใช้

::: code-group
```tsx [❌ เขียนซ้ำทุก Component — แก้ยาก]
// EquipmentPage.tsx
function EquipmentPage() {
  const [equipments, setEquipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { /* fetch data */ }, [])
  // ...
}

// AdminPage.tsx — โค้ดเหมือนกันทุกตัวอักษร!
function AdminPage() {
  const [equipments, setEquipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { /* fetch data */ }, [])
  // ...
}
```

```tsx [✅ Custom Hook — เขียนครั้งเดียว ใช้ได้ทุกที่]
// hooks/useEquipments.ts — Logic อยู่ที่เดียว
export function useEquipments() {
  const [equipments, setEquipments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => { /* fetch data */ }, [])
  return { equipments, isLoading }
}

// EquipmentPage.tsx
const { equipments, isLoading } = useEquipments()  // 1 บรรทัด!

// AdminPage.tsx
const { equipments, isLoading } = useEquipments()  // เหมือนกันเลย ✅
```
:::

### ขั้นตอนที่ 1 — สร้าง Interface Equipment

ก่อนสร้าง Hook ต้องกำหนด **Type ของข้อมูล** ที่ Hook จะจัดการ:

```ts [src/hooks/useEquipments.ts]
import { useState, useEffect } from 'react'

// [1] Interface กำหนดว่าอุปกรณ์ 1 ชิ้นมี field อะไร
interface Equipment {
  id:       number   // [2] id เป็น number — ใช้เป็น key ใน .map()
  name:     string   // [3] ชื่ออุปกรณ์
  category: string   // [4] หมวดหมู่ เช่น Notebook, Tablet
  status:   string   // [5] สถานะ: available | borrowed | maintenance
}
```

**สรุป:** Interface บอก TypeScript ว่าทุก `Equipment` object ต้องมี 4 field นี้ ถ้าขาดหรือ type ผิด จะ Error ทันที ✅

### ขั้นตอนที่ 2 — Hook เวอร์ชัน 1: ข้อมูล + Loading

```ts [src/hooks/useEquipments.ts — v1]
import { useState, useEffect } from 'react'

interface Equipment {
  id: number; name: string; category: string; status: string
}

export function useEquipments() {
  // [1] State เก็บรายการอุปกรณ์ — เริ่มเป็น array ว่าง
  const [equipments, setEquipments] = useState<Equipment[]>([])

  // [2] State บอกว่ากำลังโหลดอยู่ไหม — เริ่มเป็น true เพราะยังไม่มีข้อมูล
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // [3] จำลองการโหลดข้อมูล (wk4 จะเปลี่ยนเป็น API จริง)
    setTimeout(() => {
      setEquipments([
        { id: 1, name: 'MacBook Pro',    category: 'Notebook', status: 'available' },
        { id: 2, name: 'iPad Air',       category: 'Tablet',   status: 'borrowed'  },
        { id: 3, name: 'Projector Epson', category: 'AV',      status: 'available' },
      ])
      setIsLoading(false)  // [4] โหลดเสร็จแล้ว
    }, 1000)
  }, [])  // [5] [] = โหลดแค่ครั้งเดียวตอน mount

  // [6] return ออกไปให้ Component ใช้
  return { equipments, isLoading }
}
```

**วิธีใช้ใน Component:**

```tsx [src/pages/EquipmentPage.tsx]
import { useEquipments } from '../hooks/useEquipments'

export function EquipmentPage() {
  const { equipments, isLoading } = useEquipments()

  if (isLoading) return <p>กำลังโหลด...</p>

  return (
    <ul>
      {equipments.map(eq => (
        <li key={eq.id}>{eq.name} — {eq.status}</li>
      ))}
    </ul>
  )
}
```

### ขั้นตอนที่ 3 — Hook เวอร์ชัน 2: เพิ่ม Error State + refetch

::: code-group
```ts [✅ v2 — เพิ่ม error + refetch]
import { useState, useEffect, useCallback } from 'react'

interface Equipment {
  id: number; name: string; category: string; status: string
}

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading]   = useState<boolean>(true)
  // [1] เพิ่ม error state — null = ไม่มี error
  const [error, setError]           = useState<string | null>(null)

  // [2] useCallback — จดจำ function ให้ reference เดิม ไม่สร้างใหม่ทุก render
  //     สำคัญ: ถ้าไม่ใช้ useCallback จะทำให้ useEffect รันซ้ำไม่หยุด
  const fetchEquipments = useCallback(async () => {
    setIsLoading(true)
    setError(null)  // [3] reset error ก่อนโหลดใหม่
    try {
      // wk4: เปลี่ยน mock เป็น axios.get('/api/equipments')
      const mockData: Equipment[] = [
        { id: 1, name: 'MacBook Pro',    category: 'Notebook', status: 'available' },
        { id: 2, name: 'iPad Air',       category: 'Tablet',   status: 'borrowed'  },
        { id: 3, name: 'Projector Epson', category: 'AV',      status: 'available' },
      ]
      setEquipments(mockData)
    } catch {
      setError('โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่')  // [4] เก็บ error message
    } finally {
      setIsLoading(false)  // [5] ปิด loading เสมอ ไม่ว่าจะสำเร็จหรือไม่
    }
  }, [])  // [6] [] = fetchEquipments ไม่มี dependency จากภายนอก

  useEffect(() => {
    fetchEquipments()  // [7] เรียกตอน mount
  }, [fetchEquipments])  // [8] dependency คือ fetchEquipments (safe เพราะใช้ useCallback)

  // [9] return refetch ออกไปด้วย ให้ Component สามารถโหลดใหม่ได้
  return { equipments, isLoading, error, refetch: fetchEquipments }
}
```

```tsx [❌ ไม่มี error handling — นักเรียนไม่รู้ว่าผิดพลาด]
export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])

  useEffect(() => {
    fetch('/api/equipments')
      .then(res => res.json())
      .then(data => setEquipments(data))
    // ❌ ถ้า fetch ล้มเหลว หน้าเว็บจะแสดงรายการว่างเฉย ๆ ไม่มี error message
  }, [])

  return { equipments }
}
```
:::

**วิธีใช้ v2 ใน Component:**

```tsx [src/pages/EquipmentPage.tsx]
import { useEquipments } from '../hooks/useEquipments'

export function EquipmentPage() {
  const { equipments, isLoading, error, refetch } = useEquipments()

  if (isLoading) return <p>กำลังโหลด...</p>
  if (error)     return (
    <div>
      <p>❌ {error}</p>
      <button onClick={refetch}>ลองใหม่</button>
    </div>
  )

  return (
    <div>
      <button onClick={refetch}>🔄 รีเฟรช</button>
      <ul>
        {equipments.map(eq => (
          <li key={eq.id}>{eq.name} — {eq.status}</li>
        ))}
      </ul>
    </div>
  )
}
```

::: tip 💡 useCallback คืออะไร?
ทุกครั้งที่ Component re-render ฟังก์ชันใน Component จะถูกสร้างใหม่ (reference ใหม่) `useCallback` จดจำฟังก์ชันไว้ให้ reference เดิม — ถ้าใส่ `fetchEquipments` ใน `useEffect`'s dependency array โดยไม่มี `useCallback` จะเกิด infinite loop: render → function ใหม่ → effect รัน → render → ...
:::

#### 🔷 TypeScript ในบทนี้

Custom Hook ใช้ Generic Type สำหรับ state หลายตัวพร้อมกัน และ return object ที่มีหลาย field พร้อม type ที่แน่นอน

| ชนิด | ใช้เก็บ | ตัวอย่างในบทนี้ |
| :--- | :--- | :--- |
| `useState<Equipment[]>` | รายการอุปกรณ์ | `useState<Equipment[]>([])` |
| `useState<string \| null>` | error message หรือ null | `useState<string \| null>(null)` |

::: code-group
```ts [✅ ถูกต้อง]
// Hook return object ที่มี type ครบ
export function useEquipments() {
  const [error, setError] = useState<string | null>(null)
  // TypeScript รู้ว่า error เป็น string | null
  // Component ใช้ได้: if (error) return <p>{error}</p>
  return { equipments, isLoading, error, refetch: fetchEquipments }
}
```

```ts [❌ ผิด]
// ไม่ระบุ type ทำให้ useState ได้ never[]
const [equipments, setEquipments] = useState([])
// ❌ TypeScript จะ error เมื่อพยายาม setEquipments([{ id: 1, ... }])
```
:::

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้าง Custom Hook ชื่อ `useEquipments` ที่จัดการ: `equipment[]` array state, `isLoading: boolean`, `error: string | null` และมีฟังก์ชัน `refetch` สำหรับโหลดข้อมูลใหม่ ขอให้ใช้ `useCallback` และ `useEffect` อย่างถูกต้อง พร้อม TypeScript interface สำหรับ Equipment — อธิบายว่าทำไมต้องใช้ `useCallback` ด้วย"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า Custom Hook ต้องชื่อขึ้นต้นด้วย `use` เพราะอะไร และ React ใช้กฎนี้ยังไง
- [ ] บอกได้ว่าถ้าไม่ใช้ `useCallback` กับ `fetchEquipments` แล้ว useEffect จะเกิดปัญหาอะไร
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/hooks/useEquipments.ts`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม footer ชื่อ-รหัสของตนเองใน Component หลักที่ใช้ Hook ✅

**ขั้น 1: สร้าง useEquipments v1 (15 นาที)**

- [ ] สร้างไฟล์ `src/hooks/useEquipments.ts`
- [ ] เขียน `interface Equipment` ให้มี `id`, `name`, `category`, `status`
- [ ] เพิ่ม `useState<Equipment[]>([])` และ `useState<boolean>(true)`
- [ ] เพิ่ม `useEffect` ด้วย `setTimeout` 1 วิ แล้ว `setEquipments(mockData)`
- [ ] import และใช้ Hook ใน `App.tsx` — ต้องเห็นรายการหลังโหลด 1 วิ ✅

**ขั้น 2: เพิ่ม Error State (10 นาที)**

- [ ] เพิ่ม `useState<string | null>(null)` สำหรับ error
- [ ] ใส่ `try/catch/finally` ใน `fetchEquipments`
- [ ] ทดสอบ: เปลี่ยน mock เป็น `throw new Error('test')` → ต้องเห็น error message ✅
- [ ] คืนค่า mock กลับมาหลังทดสอบ

**ขั้น 3: เพิ่ม useCallback + refetch (10 นาที)**

- [ ] ห่อ `fetchEquipments` ด้วย `useCallback`
- [ ] return `refetch: fetchEquipments` ออกจาก Hook
- [ ] เพิ่มปุ่ม "🔄 รีเฟรช" ใน Component ที่เรียก `refetch` เมื่อกด
- [ ] กดปุ่มแล้วต้องเห็น loading ชั่วคราวก่อนแสดงรายการใหม่ ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk2-hooks: add useEquipments custom hook by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Custom Hook ถึงต้องชื่อขึ้นต้นด้วย `use`?
**แนวคำตอบ:** เป็น Convention ของ React ที่ทำให้ React (และ ESLint) รู้ว่าฟังก์ชันนี้ใช้ Rules of Hooks — เรียกได้เฉพาะใน Function Component หรือ Custom Hook เท่านั้น ไม่ใช่ใน class หรือ event handler ปกติ ถ้าไม่ขึ้นต้นด้วย `use` React จะไม่ตรวจสอบ และอาจเกิด Bug แปลก ๆ ตอน runtime
:::

::: details ❓ ทำไมต้องใช้ `useCallback` กับ `fetchEquipments`?
**แนวคำตอบ:** ทุกครั้งที่ Component re-render JavaScript สร้างฟังก์ชันใหม่ ถ้าใส่ `fetchEquipments` ใน `useEffect` dependency array (ซึ่งต้องทำ) และไม่ใช้ `useCallback` → reference เปลี่ยน → effect รันใหม่ → state เปลี่ยน → re-render → .... วนซ้ำไม่หยุด `useCallback` แก้ปัญหานี้โดยเก็บ function reference เดิมไว้ตลอด
:::

::: details ❓ ต่างกันอย่างไรระหว่างการ return object `{ }` กับ array `[ ]` จาก Hook?
**แนวคำตอบ:** `useState` return `[value, setter]` เป็น array เพราะมีแค่ 2 ค่า ตั้งชื่อตอน destructure ได้เอง เช่น `const [name, setName] = useState('')` แต่ Custom Hook ที่ return หลายค่า ควร return object `{ }` เพราะตั้งชื่อตอนสร้างได้ชัดเจนกว่า และ caller รับได้เฉพาะที่ต้องการ เช่น `const { equipments } = useEquipments()`
:::

::: details ❓ ข้อดีของการแยก Logic ออกมาเป็น Hook คืออะไร?
**แนวคำตอบ:** 1) **DRY** — ไม่เขียนซ้ำ หลาย Component ใช้ Hook เดียวกัน 2) **Separation of Concerns** — Component ดูแลแค่ UI ส่วน Logic อยู่ใน Hook อ่านและแก้ไขง่ายขึ้น 3) **Testability** — ทดสอบ Hook แยกจาก UI ได้ง่าย 4) **Reusability** — นำ Hook ไปใช้ซ้ำในโปรเจกต์อื่นได้
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| Hook เรียกใน if/loop แล้ว React error | Hook ต้องเรียก top-level เท่านั้น ไม่ใช่ใน if หรือ loop | ย้าย `useEquipments()` ออกมาไว้บนสุดของ Component |
| `refetch` กดแล้ว loading ไม่แสดง | ลืม `setIsLoading(true)` ต้นฟังก์ชัน `fetchEquipments` | เพิ่ม `setIsLoading(true)` เป็นบรรทัดแรกใน fetchEquipments |
| Error message ไม่แสดงแม้ throw จะทำงาน | ลืม return `error` จาก Hook หรือไม่ได้ check ใน Component | ตรวจสอบว่า `return { ..., error }` และ Component มี `if (error) return ...` |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Interface Equipment | ครบ 4 field ถูก type | บางส่วนเป็น `any` | ไม่มี interface |
| Hook ทำงานได้ | loading/error/data/refetch ครบ | บางส่วนขาด | Hook ไม่ทำงาน |
| Component ใช้ Hook | แสดงผลถูก มีปุ่ม refetch | แสดงได้แต่ไม่ครบ | ไม่ได้ใช้ Hook |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Custom Hook` | คัส-ตอม ฮุค | ฟังก์ชัน TypeScript ที่ชื่อขึ้นต้นด้วย `use` รวม Logic ของ React Hooks |
| `useCallback` | อิว-คอล-แบค | Hook สำหรับจดจำ function reference ให้ไม่เปลี่ยนทุก render |
| `DRY` | ดี-อาร์-วาย | Don't Repeat Yourself — หลักการเขียนโค้ดไม่ซ้ำกัน |
| `refetch` | รี-เฟ็ทช์ | ฟังก์ชันที่ return จาก Hook เพื่อให้ Component โหลดข้อมูลใหม่ |
| `Separation of Concerns` | เซพ-เพอ-เร-ชัน ออฟ คอน-เซิร์นส์ | แยก Logic (Hook) ออกจาก UI (Component) เพื่อให้ดูแลง่าย |
| `Callback` | คอล-แบค | ฟังก์ชันที่ส่งไปเป็น argument ให้ฟังก์ชันอื่นเรียกใช้ |
| `finally` | ไฟ-นัล-ลี | block ที่รันเสมอ ทั้งกรณี try สำเร็จและ catch เกิด error |
