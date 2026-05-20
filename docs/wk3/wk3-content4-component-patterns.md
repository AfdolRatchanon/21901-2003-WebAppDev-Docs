# Component Patterns — ส่งข้อมูลและ Event ข้าม Component <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เพิ่ม `onBorrow` callback และ `borrowingId` state ให้ EquipmentCard — เป็นรากฐานของ wk3-lab และ wk4 (API จริง)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
`EquipmentCard` จาก wk1 แสดงข้อมูลได้แล้ว แต่ยังกดปุ่ม "ยืม" ไม่ได้ และถ้าจะเพิ่มปุ่มลงไปก็เจอปัญหาทันที:

**ถ้า state `isLoading` อยู่ใน EquipmentCard** → card แต่ละใบไม่รู้ว่าใบอื่นกำลัง borrow อยู่ → ผู้ใช้กดได้หลายใบพร้อมกัน!

วิธีแก้คือ state ต้องอยู่ใน **EquipmentPage (parent)** ซึ่งมองเห็นทุก card พร้อมกัน
:::

> 💡 **เปรียบเทียบ:** เหมือนระบบจองห้องโรงเรียน — ห้องแต่ละห้องไม่รู้ว่าห้องอื่นถูกจองหรือยัง แต่ถ้าให้ "เจ้าหน้าที่ส่วนกลาง (EquipmentPage)" ถือข้อมูล ก็รู้ทุกห้องพร้อมกัน

## 📖 I: Information

### ภาพรวม Component Tree ของโปรเจกต์

```
src/App.tsx
├── src/pages/LoginPage.tsx          ← Container (จัดการ login logic)
├── src/pages/EquipmentPage.tsx      ← Container (จัดการ borrow logic)
│   └── src/components/EquipmentCard.tsx  ← Presentational (แสดงข้อมูล)
└── src/pages/AdminPage.tsx          ← Container (จัดการ CRUD)
```

### ขั้นตอนที่ 1 — Component 2 ประเภท

| ประเภท | หน้าที่ | ตัวอย่างในโปรเจกต์ |
|---|---|---|
| **Presentational** | แสดงข้อมูล รับ props เท่านั้น ไม่มี fetch หรือ business logic | `EquipmentCard` |
| **Container** | จัดการ state, logic, fetch ข้อมูล ส่งผ่าน props ลงไป | `EquipmentPage`, `AdminPage` |

::: tip 💡 กฎง่าย ๆ
ถามตัวเองว่า — "component นี้ **ทำอะไร** หรือแค่ **แสดงอะไร**?"
- ทำอะไร (fetch, setState, logic) → Container
- แสดงอะไร (รับ props แล้ว render) → Presentational
:::

### ขั้นตอนที่ 2 — Data Props ไหลลง (Parent → Child)

```
EquipmentPage.tsx  (parent)
│
│   equipment={item}          ← ส่ง object ลงไป
│   borrowingId={borrowingId} ← ส่ง state ลงไป
│
▼
EquipmentCard.tsx  (child)
    รับ props → render UI ตามข้อมูลที่ได้รับ
```

::: code-group
```tsx [src/components/EquipmentCard.tsx — รับ Data Props]
interface EquipmentCardProps {
  equipment:   Equipment         // [1] object จาก parent
  borrowingId: number | null     // [2] state จาก parent — ใบไหน "กำลังโหลด"
}

export function EquipmentCard({ equipment, borrowingId }: EquipmentCardProps) {
  const isThisLoading = borrowingId === equipment.id  // [3] เช็คเฉพาะใบนี้

  return (
    <div>
      <h3>{equipment.name}</h3>
      {isThisLoading && <p>กำลังดำเนินการ...</p>}
    </div>
  )
}
```

```tsx [src/pages/EquipmentPage.tsx — ส่ง Data Props]
export function EquipmentPage() {
  const [borrowingId, setBorrowingId] = useState<number | null>(null)

  return (
    <div>
      {equipments.map(item => (
        <EquipmentCard
          key={item.id}
          equipment={item}           // [1] ส่ง object
          borrowingId={borrowingId}  // [2] ส่ง state ร่วมกันทุก card
        />
      ))}
    </div>
  )
}
```
:::

### ขั้นตอนที่ 3 — Function Props ไหลขึ้น (Child → Parent)

Data props ส่งข้อมูล **ลงไป** แต่ถ้า child ต้องการแจ้ง parent ว่า "ผู้ใช้กดปุ่ม" ต้องใช้ **Function Props** (callback)

```
EquipmentPage.tsx  (parent)
│
│   กำหนด handleBorrow ที่นี่    ← logic อยู่ใน parent
│   onBorrow={handleBorrow}      ← ส่ง function ลงไป
│
▼
EquipmentCard.tsx  (child)
    onClick={() => onBorrow(equipment.id)
                                 ← เรียก function เมื่อกดปุ่ม
▲
│   event ส่ง id ขึ้นไป parent
│
EquipmentPage.tsx  รับ id → setBorrowingId(id) → fetch API
```

::: code-group
```tsx [src/components/EquipmentCard.tsx — รับ Function Props]
interface EquipmentCardProps {
  equipment:   Equipment
  borrowingId: number | null
  onBorrow:    (id: number) => void  // [1] function prop — รับ id แล้วไม่ return
}

export function EquipmentCard({ equipment, borrowingId, onBorrow }: EquipmentCardProps) {
  const isThisLoading = borrowingId === equipment.id

  return (
    <div>
      <h3>{equipment.name}</h3>

      {equipment.status === 'available' && (  // [2] แสดงปุ่มเมื่อ available
        <button
          onClick={() => onBorrow(equipment.id)}  // [3] ส่ง id ขึ้นไป parent
          disabled={borrowingId !== null}          // [4] ล็อคทุกปุ่มระหว่าง borrow
        >
          {isThisLoading ? 'กำลังยืม...' : 'ยืมอุปกรณ์'}
        </button>
      )}
    </div>
  )
}
```

```tsx [src/pages/EquipmentPage.tsx — กำหนด Function]
export function EquipmentPage() {
  const [borrowingId, setBorrowingId] = useState<number | null>(null)

  // [1] handleBorrow — logic อยู่ใน parent เสมอ
  function handleBorrow(id: number) {
    setBorrowingId(id)      // [2] แสดง loading ที่ card นั้น
    // wk4: จะเพิ่ม fetch API ที่นี่
    setTimeout(() => setBorrowingId(null), 1500)  // [3] mock สำหรับ wk3
  }

  return (
    <div>
      {equipments.map(item => (
        <EquipmentCard
          key={item.id}
          equipment={item}
          borrowingId={borrowingId}
          onBorrow={handleBorrow}   // [4] ส่ง function ลงไป
        />
      ))}
    </div>
  )
}
```
:::

### ขั้นตอนที่ 4 — Lifting State Up: state ต้องอยู่ที่ไหน?

```
❌  ผิด — state อยู่ใน child (EquipmentCard)

  EquipmentPage
  ┌─────────────────────────────────────────┐
  │  ┌───────────────┐  ┌───────────────┐   │
  │  │ EquipmentCard │  │ EquipmentCard │   │
  │  │ state:        │  │ state:        │   │
  │  │ isLoading=true│  │ isLoading=???│   │
  │  └───────────────┘  └───────────────┘   │
  │  card แต่ละใบไม่รู้ว่า card อื่นกำลัง borrow  │
  └─────────────────────────────────────────┘


✅  ถูก — state อยู่ใน parent (EquipmentPage)

  EquipmentPage
  ┌─────────────────────────────────────────┐
  │  state: borrowingId = 2                 │
  │         ↓ ส่งลง props ทุก card          │
  │  ┌───────────────┐  ┌───────────────┐   │
  │  │ EquipmentCard │  │ EquipmentCard │   │
  │  │  id=2         │  │  id=5         │   │
  │  │  กำลังยืม... │  │  [ยืมอุปกรณ์]│   │
  │  │  (disabled)   │  │  (disabled)   │   │
  │  └───────────────┘  └───────────────┘   │
  └─────────────────────────────────────────┘
  parent รู้สถานะทุก card → ล็อคปุ่มทั้งหน้าได้
```

**กฎ Lifting State Up:** ถ้า state ต้องใช้ร่วมกันมากกว่า 1 component → ยก state ขึ้นไปอยู่ใน parent ที่ใกล้ที่สุดที่เห็นทั้งคู่

## 🛠️ A: Application

### ภาพรวมสิ่งที่จะสร้างในบทนี้

```
wk1  EquipmentCard  แสดงข้อมูล (name, category, status)
      ↓ refactor
wk3  EquipmentCard  + onBorrow callback + disabled state
     EquipmentPage  + borrowingId state + handleBorrow function
```

### ขั้น 0 — Student Identity

เปิดไฟล์ `src/App.tsx` ตรวจสอบว่ามี footer แสดงชื่อ-รหัสนักเรียนอยู่แล้วจาก wk1 และ wk2 ถ้าย้ายมาที่ `EquipmentPage.tsx` ให้วางไว้ท้ายสุดของ return:

```tsx [src/pages/EquipmentPage.tsx — footer]
<footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
```

### ขั้น 1 — Refactor EquipmentCard เพิ่ม Function Props

เปิดไฟล์ `src/components/EquipmentCard.tsx` ที่สร้างไว้ตั้งแต่ wk1 แล้ว **refactor** โดยเพิ่ม `onBorrow` และ `borrowingId`:

::: code-group
```tsx [src/components/EquipmentCard.tsx]
import type { Equipment } from '../types'  // [1] import type จากไฟล์กลาง

interface EquipmentCardProps {
  equipment:   Equipment                 // [2] รับ object Equipment เต็ม ๆ
  borrowingId: number | null             // [3] ใบไหนกำลัง borrow (null = ไม่มี)
  onBorrow:    (id: number) => void      // [4] callback ส่ง id ขึ้นไป parent
}

export function EquipmentCard({ equipment, borrowingId, onBorrow }: EquipmentCardProps) {
  const isThisLoading = borrowingId === equipment.id  // [5] เช็คเฉพาะใบนี้

  const statusLabel: Record<string, string> = {
    available:   'ว่าง',
    borrowed:    'ถูกยืม',
    maintenance: 'ซ่อมบำรุง',
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 8 }}>
      <h3 style={{ margin: '0 0 4px 0' }}>{equipment.name}</h3>
      <p style={{ color: '#666', margin: '0 0 4px 0' }}>{equipment.category}</p>
      <p style={{ margin: '0 0 8px 0' }}>
        สถานะ: {statusLabel[equipment.status] ?? equipment.status}
      </p>

      {equipment.status === 'available' && (   // [6] แสดงปุ่มเฉพาะตอน available
        <button
          onClick={() => onBorrow(equipment.id)}  // [7] ส่ง id ขึ้นไป parent
          disabled={borrowingId !== null}          // [8] ล็อคระหว่างกำลัง borrow
          style={{ padding: '4px 12px', cursor: borrowingId !== null ? 'not-allowed' : 'pointer' }}
        >
          {isThisLoading ? 'กำลังยืม...' : 'ยืมอุปกรณ์'}
        </button>
      )}
    </div>
  )
}
```

```tsx [ก่อน refactor — wk1 version]
// wk1: EquipmentCard รับแค่ string props แสดงได้อย่างเดียว
interface EquipmentCardProps {
  name:     string
  category: string
  status:   string
}

export function EquipmentCard({ name, category, status }: EquipmentCardProps) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
      <h3>{name}</h3>
      <p>{category}</p>
      <p>สถานะ: {status}</p>
      {/* ❌ ไม่มีปุ่ม ไม่มี callback — interactive ไม่ได้ */}
    </div>
  )
}
```
:::

> **สรุปการทำงาน:** [1] import type — เพื่อใช้ Equipment interface จากไฟล์กลาง [2-4] เพิ่ม props ใหม่ 2 ตัว [5] `borrowingId === equipment.id` บอกว่า card ใบ **นี้** กำลังโหลด [7] `onClick` เรียก callback ส่ง id ขึ้นไป [8] `disabled` ล็อคทุกปุ่มระหว่างกำลัง borrow

### ขั้น 2 — EquipmentPage เพิ่ม borrowingId state + handleBorrow

::: code-group
```tsx [src/pages/EquipmentPage.tsx]
import { useState } from 'react'
import type { Equipment } from '../types'
import { EquipmentCard } from '../components/EquipmentCard'

const mockEquipments: Equipment[] = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Notebook', serialNo: 'MB-001', status: 'available',   borrowedBy: null         },
  { id: 2, name: 'iPad Air',        category: 'Tablet',   serialNo: 'IP-001', status: 'borrowed',    borrowedBy: 'สมชาย ใจดี' },
  { id: 3, name: 'Projector Epson', category: 'AV',       serialNo: 'PJ-001', status: 'maintenance', borrowedBy: null         },
]

export function EquipmentPage() {
  const [equipments]  = useState<Equipment[]>(mockEquipments)
  const [borrowingId, setBorrowingId] = useState<number | null>(null)  // [1] state กลาง

  function handleBorrow(id: number) {    // [2] logic อยู่ใน parent เสมอ
    setBorrowingId(id)                   // [3] บอกว่า id นี้กำลัง borrow
    setTimeout(() => {                   // [4] mock delay — wk4 จะเปลี่ยนเป็น API จริง
      setBorrowingId(null)
    }, 1500)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <h1>รายการอุปกรณ์ไอที</h1>

      {equipments.map(item => (
        <EquipmentCard
          key={item.id}
          equipment={item}                    // [5] Data Props
          borrowingId={borrowingId}           // [6] ส่ง state ร่วม
          onBorrow={handleBorrow}             // [7] Function Props
        />
      ))}

      <footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
        จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
      </footer>
    </div>
  )
}
```
:::

> **สรุปการทำงาน:** [1] `borrowingId` อยู่ใน parent — เห็นทุก card [2] `handleBorrow` อยู่ที่นี่ เพราะต้องเข้าถึง `setBorrowingId` [5-7] ส่ง props ครบทั้ง data + state + function ลงไปทุก card

### ขั้น 3 — ทดสอบ

เปิด browser ที่ `localhost:5173` แล้วตรวจสอบ:

- [ ] กดปุ่ม "ยืมอุปกรณ์" ที่ card ใดก็ได้ → ปุ่ม **ทุกใบ** ถูก disabled พร้อมกัน
- [ ] card ที่กด แสดงข้อความ "กำลังยืม..." ชั่วคราว
- [ ] หลัง ~1.5 วินาที ทุกปุ่มกลับมาใช้ได้ปกติ
- [ ] card ที่ status เป็น `borrowed` หรือ `maintenance` ไม่มีปุ่ม

## 📊 P: Progress

::: tip ✅ Mini-Checkpoint
ก่อนไป wk3-lab ตรวจสอบว่าเข้าใจสิ่งเหล่านี้:
- [ ] บอกได้ว่า `EquipmentCard` เป็น Presentational เพราะอะไร
- [ ] บอกได้ว่า `borrowingId` ทำไมต้องอยู่ใน `EquipmentPage` ไม่ใช่ใน `EquipmentCard`
- [ ] อธิบายได้ว่า `onBorrow={handleBorrow}` ส่งอะไรลงไป และ `onClick={() => onBorrow(id)}` เรียกอะไรขึ้นมา
:::

::: details ❓ ทำไม `handleBorrow` ต้องอยู่ใน EquipmentPage ไม่ใช่ใน EquipmentCard?
เพราะ `handleBorrow` เรียก `setBorrowingId` ซึ่งเป็น state ของ EquipmentPage — ถ้าย้าย function ไปอยู่ใน card จะเข้าถึง `setBorrowingId` ไม่ได้ นี่คือเหตุผลที่ **logic ต้องอยู่ที่เดียวกับ state**
:::

::: details ❓ ถ้าลบ `disabled={borrowingId !== null}` ออกจะเกิดอะไร?
ผู้ใช้กดปุ่มได้หลายใบพร้อมกัน ทำให้ `handleBorrow` ถูกเรียกซ้อนกัน — `borrowingId` จะถูก overwrite และ card ที่กดก่อนหน้าจะไม่แสดง loading state ถูกต้อง
:::

::: details ❓ `(id: number) => void` ใน interface หมายความว่าอะไร?
คือ type ของ function ที่รับ `number` 1 ตัว และไม่ return ค่า (`void`) — `void` ≠ `undefined`, void บอกว่า "ไม่ต้อง return อะไรก็ได้" ใช้กับ callback ที่แค่ทำงานแล้วจบ
:::

::: details ❓ ทำไม `onBorrow` ถึงเป็น `(id: number) => void` ไม่ใช่ `() => void`?
เพราะ child (EquipmentCard) ต้องบอก parent ว่า **ใบไหน** ถูกกด — ถ้า `() => void` parent ไม่รู้ว่าต้อง setBorrowingId ด้วย id อะไร
:::

### 🐛 Common Errors

| อาการ | สาเหตุ | วิธีแก้ |
|---|---|---|
| `Property 'onBorrow' does not exist` | เพิ่ม `onBorrow` ใน JSX แต่ยังไม่ได้เพิ่มใน `interface EquipmentCardProps` | เพิ่ม `onBorrow: (id: number) => void` ใน interface |
| ปุ่มทุกใบถูก disabled ค้างไว้ไม่หาย | `setBorrowingId(null)` ไม่ถูกเรียก (setTimeout หาย หรือ error ก่อนถึง) | ตรวจ console และ network tab ว่า error ที่ไหน |
| กด card หนึ่งแต่ loading แสดงผิด card | `borrowingId` เปรียบเทียบกับ `id` ผิดตัว | ตรวจ `borrowingId === equipment.id` ว่า field ตรงกัน |
| TypeScript error: `Argument of type 'number' is not assignable` | `onBorrow` ถูกกำหนดเป็น `() => void` ไม่รับ argument | เปลี่ยนเป็น `(id: number) => void` |

### 📋 Rubric

| เกณฑ์ | ดีมาก | พอใช้ | ปรับปรุง |
|---|---|---|---|
| Function Props | `onBorrow` รับ id และ type ถูกต้อง | มี `onBorrow` แต่ type ไม่ครบ | ไม่มี function prop |
| Lifting State Up | `borrowingId` อยู่ใน parent + ล็อคทุกปุ่มได้ | state อยู่ใน parent แต่ไม่ได้ล็อคปุ่ม | state อยู่ใน child |
| Component Type | อธิบาย Presentational vs Container ได้ | พอเข้าใจแต่อธิบายไม่ครบ | สับสนสองแบบ |

### 📚 CLIL Vocabulary

| คำศัพท์ | คำอ่าน | ความหมาย |
|---|---|---|
| Presentational Component | พรี-เซน-เท-ชัน-นัล | Component ที่ทำหน้าที่แสดงผลเท่านั้น รับข้อมูลผ่าน props |
| Container Component | คอน-เท-เนอร์ | Component ที่จัดการ state และ logic ส่ง props ให้ presentational |
| Function Props | ฟังก์-ชัน พรอพส์ | Props ที่เป็น function — ใช้ส่ง callback จาก parent ลงไป child |
| Lifting State Up | ลิฟ-ทิง สเทท อัพ | การย้าย state ขึ้นไปอยู่ใน parent ที่ใกล้ที่สุดที่ component ต่าง ๆ ใช้ร่วมกัน |
| Callback | คอล-แบค | Function ที่ถูกส่งเป็น argument และเรียกใช้ภายหลัง |
| `void` | วอยด์ | Type ที่บอกว่า function นั้นไม่ return ค่า |
