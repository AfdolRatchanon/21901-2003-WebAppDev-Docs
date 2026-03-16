# สอบกลางภาค + นำเสนอโครงร่างโปรเจกต์ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ทีมพัฒนาระบบเบิก-จ่ายอุปกรณ์ไอทีทำงานมา 4 สัปดาห์แล้ว — ถึงเวลาพิสูจน์ว่าระบบที่สร้างใช้งานได้จริง คุณสามารถอธิบาย code ของตัวเองได้ไหม? กรรมการจะถามว่า "บรรทัดนี้ทำอะไร? ทำไมใช้ Interface ตรงนี้?" ถ้าตอบไม่ได้ = คะแนนหาย
:::

> 💡 **เปรียบเทียบ:** การสอบกลางภาคเหมือน "Sprint Review" ใน Agile — ทีมต้อง demo ว่าสร้างอะไรได้จริง ไม่ใช่แค่บอกว่าทำอยู่

---

## 📖 I: Information — ทบทวน wk1–4

เพื่อเป็นการเตรียมความพร้อมก่อนการสอบ เรามาทบทวนสิ่งที่เราได้เรียนรู้ร่วมกันตลอดทั้ง 4 สัปดาห์ที่ผ่านมา เพื่อให้มั่นใจว่าพื้นฐานความรู้ทุกจุดของเราจะถูกประกอบรวมกันเป็นโปรเจกต์ที่สอดคล้อง สมบูรณ์ และมีประสิทธิภาพที่สุด

หัวใจสำคัญของการพัฒนาด้วย React และ TypeScript คือการรวม "การจัดการสถานะที่ยืดหยุ่น (State Management)" เข้ากับ "การวางโครงสร้างชนิดข้อมูลที่เข้มงวด (Type Safety)" เพื่อให้ได้ทั้ง UI ที่ลื่นไหลและระบบที่ไม่พังง่าย

### ขั้นตอนที่ 1 — ทบทวน 4 สัปดาห์แรก (Overview)

| Week | หัวข้อ | สิ่งที่ต้องทำได้ |
| :--- | :--- | :--- |
| wk1 | React + Vite + TypeScript | Basic Types, JSX, .map(), key |
| wk2 | Custom Hooks + Interfaces + State | `useState<T>`, `useEffect`, Custom Hook |
| wk3 | Tailwind CSS + Controlled Forms | utility classes, `FormEvent`, `onChange`, Zod |
| wk4 | Axios + Async/Await + DB Design | `axios.get<ApiResponse<T>>()`, `async/await`, `try/catch/finally` |

---

### ขั้นตอนที่ 2 — Types ที่ต้องจำและใช้ได้

```ts [src/types/index.ts — Types ทั้งหมดในโปรเจกต์]
// [1] Union Type — status มีแค่ 3 ค่าเท่านั้น TypeScript บังคับ
export type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'

// [2] Union Type — role มีแค่ 3 ค่า
export type UserRole = 'admin' | 'teacher' | 'student'

// [3] Interface — กำหนด shape ของ Equipment object ทุกตัวในระบบ
export interface Equipment {
  id:         number           // [4] id เป็น number เสมอ
  name:       string
  category:   string
  serialNo:   string
  status:     EquipmentStatus  // [5] ใช้ Union Type — ไม่ใช่ string ธรรมดา
  borrowedBy: string | null    // [6] null = ยังว่าง, string = ชื่อผู้ยืม
}

// [7] Interface สำหรับ User
export interface User {
  id:    number
  email: string
  name:  string
  role:  UserRole  // [8] ใช้ Union Type
}

// [9] Generic Interface — ใช้ซ้ำกับ response ทุกประเภท
export interface ApiResponse<T> {
  success: boolean
  data:    T         // [10] T คือ type จริง เช่น Equipment[] หรือ User
  message?: string
}
```

---

### ขั้นตอนที่ 3 — Components ที่ต้องแสดงใน Midterm

::: code-group
```tsx [src/components/EquipmentCard.tsx]
import type { Equipment } from '../types'  // [1] import type เท่านั้น

// [2] Props type inline — กำหนด prop ที่ component รับ
export function EquipmentCard({ equipment, onBorrow }: {
  equipment: Equipment
  onBorrow?: (id: number) => void  // [3] optional callback
}) {
  // [4] Record<K, V> — map จาก status → Tailwind class (ต้องมีครบทุก key)
  const statusColor: Record<EquipmentStatus, string> = {
    available:   'bg-green-100 text-green-700',   // [5] สีเขียว = ว่าง
    borrowed:    'bg-red-100 text-red-700',        // [6] สีแดง = ถูกยืม
    maintenance: 'bg-yellow-100 text-yellow-700', // [7] สีเหลือง = ซ่อม
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <h3 className="font-semibold text-slate-800">{equipment.name}</h3>
      <span className={`text-xs px-2 py-1 rounded-full w-fit ${statusColor[equipment.status]}`}>
        {equipment.status}  {/* [8] ใช้ statusColor map แสดงสี */}
      </span>
      <p className="text-xs text-slate-400">{equipment.serialNo}</p>
      {/* [9] conditional render: แสดงปุ่มเฉพาะเมื่อ available AND onBorrow ส่งมา */}
      {equipment.status === 'available' && onBorrow && (
        <button
          onClick={() => onBorrow(equipment.id)}  // [10] ส่ง id ขึ้นไป parent
          className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-lg"
        >
          ยืมอุปกรณ์
        </button>
      )}
    </div>
  )
}
```

```tsx [src/pages/EquipmentPage.tsx]
import { useEquipments } from '../hooks/useEquipments'
import { EquipmentCard } from '../components/EquipmentCard'

// [1] ใช้ Custom Hook แทนการเขียน useState/useEffect ใน component โดยตรง
export function EquipmentPage() {
  const { equipments, isLoading, error } = useEquipments()  // [2]

  // [3] Early return สำหรับ loading state — ก่อน render รายการ
  if (isLoading) return <p className="text-center py-10 text-slate-500">กำลังโหลดข้อมูล...</p>

  // [4] Early return สำหรับ error state
  if (error)     return <p className="text-center py-10 text-red-500">{error}</p>

  // [5] Empty state — ถ้าไม่มีอุปกรณ์เลย
  if (equipments.length === 0) return <p className="text-center py-10 text-slate-400">ยังไม่มีอุปกรณ์</p>

  return (
    // [6] responsive grid: 1 col → 2 col (sm) → 3 col (lg)
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {equipments.map(eq =>
        <EquipmentCard key={eq.id} equipment={eq} />  // [7] key ป้องกัน re-render ผิด
      )}
    </div>
  )
}
```

```tsx [src/hooks/useEquipments.ts]
import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/config'
import type { Equipment, ApiResponse } from '../types'

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])  // [1] Generic type
  const [isLoading, setIsLoading]   = useState(true)
  const [error, setError]           = useState<string | null>(null)  // [2] nullable

  const fetchEquipments = useCallback(async () => {  // [3] useCallback ป้องกัน loop
    setIsLoading(true)
    setError(null)
    try {
      const res = await apiClient.get<ApiResponse<Equipment[]>>('/api/equipments')  // [4]
      setEquipments(res.data.data)  // [5] res.data = ApiResponse, .data = Equipment[]
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setIsLoading(false)  // [6] รันเสมอ ทั้ง success และ error
    }
  }, [])

  useEffect(() => {
    fetchEquipments()  // [7] เรียกตอน mount ครั้งแรก
  }, [fetchEquipments])

  return { equipments, setEquipments, isLoading, error, refetch: fetchEquipments }
}
```
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"ช่วยตรวจสอบ TypeScript React component สำหรับโปรเจกต์กลางภาค ตรวจว่า: ไม่มี type 'any', ใช้ interface ถูกต้อง ครบทุก field, Tailwind classes ใช้งานได้, Custom Hook แยก logic ออกจาก UI, และ API call ด้วย useCallback + useEffect ทำงานได้ถูกต้อง สรุปเป็น checklist ว่าขาดอะไรบ้าง"
:::

### 📝 PjBL Lab — Midterm Checklist

**เป้าหมาย:** ตรวจสอบโปรเจกต์ครบก่อนวันสอบ + เตรียมนำเสนอ

---

#### ขั้น 0 — Student Identity

ตรวจสอบว่า `<footer>` ชื่อ-รหัสยังอยู่ใน EquipmentPage ✅

---

#### ขั้น 1 — ตรวจสอบ TypeScript (10 นาที)

```bash
cd project/frontend
npx tsc --noEmit   # ต้องได้ 0 errors — แก้ให้ครบก่อนวันสอบ
```

- [ ] `npx tsc --noEmit` — 0 errors ✅
- [ ] ไม่มี `any` ในโค้ดทั้งหมด ✅
- [ ] `interface Equipment` มีครบทุก field: id, name, category, serialNo, status, borrowedBy ✅
- [ ] `ApiResponse<T>` ใช้ Generic ไม่ใช่ `any` ✅

---

#### ขั้น 2 — ตรวจสอบ Components (15 นาที)

- [ ] `EquipmentCard.tsx` แสดง: ชื่อ, status badge (สีถูกต้อง), serialNo, ปุ่มยืม (เฉพาะ available) ✅
- [ ] `EquipmentPage.tsx` แสดง: loading → error → empty → รายการ ครบทั้ง 4 state ✅
- [ ] `useEquipments.ts` แยก logic ออกจาก component ได้ ✅
- [ ] Responsive grid: 1 col mobile → 2 col tablet → 3 col desktop ✅

---

#### ขั้น 3 — ตรวจสอบ API Connection (10 นาที)

```bash
cd project/backend && npm run dev   # Backend รันที่ port 3000
```

- [ ] เปิดหน้าเว็บ → เห็นรายการอุปกรณ์จาก Backend ✅
- [ ] DevTools → Network: ดู request ไปที่ `/api/equipments` + Authorization header ✅
- [ ] ปิด Backend → เห็น error message (ไม่ crash) ✅

---

#### ขั้น 4 — เตรียมคำถามสอบ (15 นาที)

ฝึกตอบคำถามเหล่านี้ด้วยตัวเอง (ซ้อมพูด 2 รอบ):

- [ ] "ทำไม `borrowedBy` เป็น `string | null` ไม่ใช่ `string?`"
- [ ] "`useCallback` ใน `useEquipments` มีไว้ทำอะไร? ถ้าลบออกจะเกิดอะไร?"
- [ ] "`Record<EquipmentStatus, string>` ต่างจาก `{ [key: string]: string }` อย่างไร?"

---

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย screenshot: EquipmentPage แสดงรายการจาก Backend จริง
- [ ] `git add . && git commit -m "wk5: midterm checkpoint - equipment system complete"`
- [ ] `git push origin main`
- [ ] เขียนสรุปใน Google Doc: สิ่งที่ทำได้แล้ว, สิ่งที่ต้องพัฒนาต่อ, ลิงก์ GitHub

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ Interface แทนการเขียน type ตรง ๆ ใน props?
**แนวคำตอบ:** Interface ทำให้ re-use ได้ในหลาย component และแก้ไขที่เดียวกระทบทุกที่ ถ้า backend เปลี่ยน field `name` เป็น `title` แค่แก้ใน `types/index.ts` เดียว ทุก component ที่ import ใช้จะอัปเดตอัตโนมัติ — Single Source of Truth ทำให้ maintain ง่าย
:::

::: details ❓ ถ้า API ยังไม่ return ข้อมูล ผู้ใช้จะเห็นอะไร? code ตรงไหนรับผิดชอบ?
**แนวคำตอบ:** ผู้ใช้จะเห็น "กำลังโหลดข้อมูล..." เพราะ `isLoading` state เริ่มต้นเป็น `true` → EquipmentPage return `<p>กำลังโหลด...</p>` early return → เมื่อ `finally` รัน → `setIsLoading(false)` → component re-render → แสดงรายการหรือ error ถ้า `finally` ไม่มี → `isLoading` ไม่เปลี่ยน → ค้างที่ loading ตลอดกาล
:::

::: details ❓ `Record<EquipmentStatus, string>` ทำงานอย่างไร? ต่างจาก `{ [key: string]: string }` อย่างไร?
**แนวคำตอบ:** `Record<EquipmentStatus, string>` → key ต้องเป็น `'available' | 'borrowed' | 'maintenance'` เท่านั้น TypeScript **บังคับ** ว่าต้องมีครบทุก key — ถ้าลืม `maintenance` จะ error ทันที ส่วน `{ [key: string]: string }` ยอมรับ string ทุกค่าเป็น key → ใส่ key ผิดก็ไม่ error → ไม่ตรวจ coverage
:::

::: details ❓ `res.data.data` ใน `apiClient.get<ApiResponse<Equipment[]>>()` — ทำไมต้อง `.data` สองครั้ง?
**แนวคำตอบ:** `.data` แรกคือ Axios property — `axios.get()` wrap response ไว้ใน object ที่มี `.data`, `.status`, `.headers` → `res.data` = response body = `ApiResponse<Equipment[]>` object → `.data` ที่สองคือ field ใน `ApiResponse` interface → ได้ `Equipment[]` จริง สรุป: `res.data` = Axios layer, `.data` = ApiResponse layer
:::

### 📋 Rubric — Midterm (50 คะแนน)

| เกณฑ์ | ดีมาก (8-10) | พอใช้ (4-7) | ปรับปรุง (0-3) |
| :--- | :--- | :--- | :--- |
| Components (10) | EquipmentCard + EquipmentPage + Navbar ครบ ทำงานได้ | มีบางส่วน หรือ error เล็กน้อย | ขาด component หลัก |
| TypeScript (10) | Interface/Type ถูกต้อง ไม่มี `any` เลย | มี `any` 1-2 จุด หรือ type ไม่ครบ | ไม่ใช้ TypeScript / error มาก |
| Tailwind CSS (10) | UI สวยงาม + responsive ทุกขนาด | UI พอใช้ ไม่ responsive | ไม่ใช้ Tailwind / UI ใช้ไม่ได้ |
| API Connect (10) | ดึงข้อมูลจริงได้ + loading + error state | ดึงได้บางส่วน / ไม่มี loading | ไม่เชื่อมต่อ API |
| Presentation (10) | อธิบาย code ได้ชัดเจน ตอบคำถามได้ | อธิบายได้บางส่วน | อ่าน code ไม่ออก |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Sprint Review` | การนำเสนอผลงานรายสัปดาห์ใน Agile — demo ว่าทำอะไรได้จริง |
| `Type Safety` | การป้องกัน error โดยกำหนด type ให้ข้อมูลทุกตัว |
| `Interface` | โครงสร้างที่บอกว่า object ต้องมี field อะไรบ้าง |
| `Custom Hook` | function ที่ขึ้นต้นด้วย `use` — แยก logic ออกจาก UI component |
| `Early Return` | return ก่อนถึง main render — จัดการ loading/error state ก่อน |
| `Responsive` | UI ที่ปรับขนาดได้ตามหน้าจอ (mobile/tablet/desktop) |
| `Loading State` | สถานะขณะรอข้อมูล — บอกผู้ใช้ว่ายังโหลดอยู่ |
| `Dependency Array` | `[]` ใน useEffect — กำหนดว่า effect รันเมื่อไหร่ |
