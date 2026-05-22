# Data Model — Types & Interfaces <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** สร้าง types/index.ts เป็นไฟล์กลางที่ทุก Component ใช้ร่วมกันตั้งแต่ wk2 ถึง wk8

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายมีข้อมูลหลายประเภท — Equipment, User, BorrowRecord ถ้าแต่ละ Component ประกาศ `interface Equipment` เองคนละที่ อาจเกิดกรณีที่ Component A ส่ง `{ equipmentName }` แต่ Component B รอรับ `{ name }` — ชื่อ field ต่างกัน แอปพัง! วิธีแก้คือเก็บ Types ทั้งหมดไว้ในไฟล์กลางไฟล์เดียว
:::

> 💡 **เปรียบเทียบ:** Interface คือ "แบบฟอร์มราชการ" — กำหนดว่าต้องกรอกช่องอะไรบ้าง ถ้ากรอกไม่ครบหรือชื่อช่องผิด ระบบปฏิเสธทันที ป้องกัน Bug ก่อน run โปรแกรม

## 📖 I: Information

**Data Model** หรือแบบจำลองข้อมูล คือการออกแบบโครงสร้างของข้อมูลว่าระบบของเราจะเก็บข้อมูลอะไรบ้าง และแต่ละข้อมูลมีความสัมพันธ์กันอย่างไร ในโลกของ TypeScript เรามีเครื่องมือหลัก 2 ตัวที่ใช้สร้างและบังคับโครงสร้างข้อมูลให้เป็นไปตาม Data Model ที่เราออกแบบไว้ นั่นคือ **`type` (Type Alias)** และ **`interface`**

การประกาศรูปแบบข้อมูลที่ชัดเจนไว้ในไฟล์กลาง จะช่วยรับประกันความถูกต้องของข้อมูลที่ไหลไปมาระหว่าง Component ต่าง ๆ ทั่วทั้งแอปพลิเคชัน (Type Safety) ประหยัดเวลาในการค้นหาข้อผิดพลาดที่เกิดจากการพิมพ์ชื่อตัวแปรผิด และทำให้ระบบเติมคำอัตโนมัติ (Auto-complete) ของ VS Code ทำงานได้อย่างสมบูรณ์แบบที่สุด

### ขั้นตอนที่ 1 — `type` สำหรับ Union Types

ใช้ `type` เมื่อค่าของ field มีได้แค่บางค่าที่กำหนดไว้เท่านั้น:

::: code-group
```ts [✅ Union Type — TypeScript ตรวจสอบให้]
// กำหนดว่า EquipmentStatus มีได้แค่ 3 ค่า
type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'

// กำหนดว่า UserRole มีได้แค่ 3 ค่า
type UserRole = 'admin' | 'teacher' | 'student'

const status: EquipmentStatus = 'available'   // ✅
const role:   UserRole         = 'teacher'     // ✅
```

```ts [❌ string ธรรมดา — พิมพ์ผิดก็ไม่รู้]
// ถ้าใช้ string ธรรมดา TypeScript ไม่ช่วยตรวจ
const status: string = 'avalable'   // ❌ พิมพ์ผิด แต่ไม่ error!
const role:   string = 'Admin'      // ❌ พิมพ์ใหญ่ แต่ไม่ error!
// Bug จะเจอตอน runtime เท่านั้น 😱
```

```ts [💡 ทดสอบให้เห็น Error]
type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'

// ลองพิมพ์ค่าที่ไม่อยู่ใน Union:
const status: EquipmentStatus = 'ready'
// ❌ Type '"ready"' is not assignable to type 'EquipmentStatus'
// TypeScript บอกทันทีว่าผิด ก่อน run โปรแกรม ✅
```
:::

### ขั้นตอนที่ 2 — `interface` สำหรับ Object Shape

ใช้ `interface` เมื่อต้องกำหนดว่า Object ต้องมี field อะไรบ้าง:

```ts [src/types/index.ts — เวอร์ชัน 1 (พื้นฐาน)]
// [1] Union Types สำหรับค่าที่จำกัด
export type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'
export type UserRole        = 'admin' | 'teacher' | 'student'

// [2] Interface กำหนด shape ของ Equipment
export interface Equipment {
  id:         number           // [3] id ต้องเป็น number เสมอ
  name:       string           // [4] ชื่ออุปกรณ์
  category:   string           // [5] หมวดหมู่
  status:     EquipmentStatus  // [6] ใช้ Union Type ที่สร้างไว้ — ปลอดภัยกว่า string
}

// [7] Interface สำหรับ User
export interface User {
  id:    number
  email: string
  name:  string
  role:  UserRole  // [8] ใช้ Union Type
}
```

**สรุป:**
1. `type` → ใช้กับค่าที่มีตัวเลือกจำกัด (Union Types)
2. `interface` → ใช้กับ Object ที่มีหลาย field

### ขั้นตอนที่ 3 — Nullable Fields + Optional Fields

::: code-group
```ts [✅ string | null — field มีอยู่แต่อาจเป็น null]
export interface Equipment {
  id:         number
  name:       string
  category:   string
  serialNo:   string
  status:     EquipmentStatus
  borrowedBy: string | null   // null = ยังไม่มีคนยืม, string = ชื่อคนยืม
}

// ใช้งาน:
const eq: Equipment = {
  id: 1, name: 'MacBook Pro', category: 'Notebook',
  serialNo: 'MB-001', status: 'available',
  borrowedBy: null,         // ✅ ยังว่าง
}
const eq2: Equipment = {
  id: 2, name: 'iPad Air', category: 'Tablet',
  serialNo: 'IP-001', status: 'borrowed',
  borrowedBy: 'นายสมชาย',  // ✅ มีคนยืมอยู่
}
```

```ts [💡 string | null vs optional ?]
interface Equipment {
  borrowedBy: string | null   // ✅ field ต้องมีเสมอ แต่ค่าอาจ null
  note?:      string          // ✅ field อาจไม่มีก็ได้ (undefined)
}

// ต่างกัน:
const a: Equipment = { ..., borrowedBy: null  }  // ✅ OK
const b: Equipment = { ..., borrowedBy: 'สมชาย' } // ✅ OK
// const c: Equipment = { ... }  ← ❌ Error: borrowedBy ขาด!
const d: Equipment = { ..., borrowedBy: null  }  // note ไม่ต้องใส่ก็ได้ ✅
```
:::

### ขั้นตอนที่ 4 — Generic Type `ApiResponse<T>` (Preview สำหรับ wk4)

::: code-group
```ts [✅ Generic — ใช้ซ้ำกับ response ทุกประเภท]
// [1] <T> คือ "Type Parameter" — placeholder ที่ใส่ type จริงตอนใช้
export interface ApiResponse<T> {
  success: boolean    // [2] สำเร็จหรือไม่
  data:    T          // [3] ข้อมูลจริง — type ขึ้นอยู่กับที่ใส่แทน T
  message?: string    // [4] optional message
}

// ใช้งาน — ใส่ type จริงแทน T:
type EquipmentResponse = ApiResponse<Equipment>
// ได้ผล: { success: boolean, data: Equipment, message?: string }

type EquipmentListResponse = ApiResponse<Equipment[]>
// ได้ผล: { success: boolean, data: Equipment[], message?: string }
```

```ts [❌ ไม่ใช้ Generic — ต้องสร้าง interface ซ้ำ]
// ❌ ต้องสร้างใหม่สำหรับทุก response type
interface EquipmentResponse {
  success: boolean
  data: Equipment
}
interface UserResponse {
  success: boolean
  data: User
}
// ... ซ้ำไปเรื่อย ๆ ทุกครั้งที่มี API ใหม่
```
:::

::: tip 💡 Generic ใช้ใน wk4 จริง
เมื่อเรียก Axios ใน wk4: `apiClient.get<ApiResponse<Equipment[]>>('/equipments')` — TypeScript รู้ว่า response มี field `data` ที่เป็น `Equipment[]` ทำให้ auto-complete และตรวจสอบ type ได้ถูกต้อง
:::

#### 🔷 TypeScript ในบทนี้

บทนี้แนะนำ Union Type, interface สำหรับ Object shape และ Generic `<T>` สำหรับ reusable types

| ชนิด | ใช้เก็บ | ตัวอย่างในบทนี้ |
| :--- | :--- | :--- |
| `type` (Union) | ค่าที่มีตัวเลือกจำกัด | `type EquipmentStatus = 'available' \| 'borrowed' \| 'maintenance'` |
| `interface` | โครงสร้าง Object | `interface Equipment { id: number; name: string; ... }` |
| `Generic <T>` | Type Parameter ที่ใส่ทีหลัง | `interface ApiResponse<T> { data: T }` |

::: code-group
```ts [✅ ถูกต้อง]
type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'

interface Equipment {
  status: EquipmentStatus  // ✅ ใช้ Union Type แทน string
}

const eq: Equipment = { ..., status: 'available' }  // ✅
```

```ts [❌ ผิด]
interface Equipment {
  status: string  // ❌ TypeScript ไม่ตรวจค่า
}

const eq: Equipment = { ..., status: 'avalable' }  // ❌ พิมพ์ผิดแต่ไม่ error
```
:::

### TypeScript Operators ที่ใช้ในโปรเจกต์

::: code-group
```ts [✅ 4 operators ที่ต้องรู้]
// ! non-null assertion — บอก TS ว่า "ไม่ใช่ null แน่นอน"
const root = document.getElementById('root')!

// ?. optional chaining — เข้าถึง property โดยไม่ crash ถ้า null
const role = auth.user?.role   // ถ้า user เป็น null → undefined (ไม่ crash)

// ?? nullish coalescing — ใช้ค่า default ถ้าเป็น null หรือ undefined
const name = stored ?? 'ผู้ใช้ทั่วไป'

// as type assertion — บอก TS ว่า "เชื่อฉัน type นี้แน่"
const user = JSON.parse(stored) as User  // parse string → บอกว่าเป็น User
```
```ts [❌ อย่าใช้ as แบบนี้]
// as ไม่ตรวจสอบ runtime — ถ้า parse ผิด crash ตอนรัน
const user = JSON.parse('invalid') as User  // ❌ TS ไม่แจ้ง แต่ runtime พัง
// แก้: ใช้ try-catch + type guard แทน
```
```tsx [💡 ? กับ ! ต่างกัน]
auth.user?.role  // ถ้า null → undefined (ปลอดภัย)
auth.user!.role  // ถ้า null → runtime crash (ใช้เมื่อมั่นใจ 100%)
```
:::

### type vs interface — กฎง่าย ๆ

::: code-group
```ts [✅ กฎ: object → interface, union → type]
// Union Type → ใช้ type
type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'
type UserRole        = 'admin' | 'teacher' | 'student'

// Object shape → ใช้ interface
interface Equipment {
  id:     number
  status: EquipmentStatus  // ใช้ Union type ที่สร้างไว้
}
```
```ts [💡 Props ใช้ interface เสมอ]
// ComponentName + Props = ชื่อ Props interface
interface EquipmentCardProps {
  name:     string
  status:   EquipmentStatus
  onBorrow: (id: number) => void
}

export function EquipmentCard({ name, status, onBorrow }: EquipmentCardProps) {}
```
:::

### import type — ดีกว่า import ปกติสำหรับ Type

::: code-group
```ts [✅ import type — type-only import]
// TypeScript ลบ import นี้ทิ้งตอน build — ไม่มี runtime cost
import type { Equipment, User, EquipmentStatus } from '../types'

// ใช้: component + API + hook ที่ import interface/type
```
```ts [❌ import ปกติกับ type — ทำได้แต่ไม่ดี]
import { Equipment, useState } from 'react'  // ❌ Equipment ไม่ใช่ runtime value
// แก้: แยก import type ออกจาก import ปกติ
import { useState } from 'react'
import type { Equipment } from '../types'
```
:::

> กฎ: import Interface หรือ Type → ใช้ `import type` เสมอ

### null vs undefined

| | `null` | `undefined` |
| :--- | :--- | :--- |
| ความหมาย | ตั้งใจให้ว่าง | ยังไม่ได้กำหนดค่า |
| ใช้เมื่อ | logout → user = null, ยังไม่ได้เลือก item | function ไม่ return อะไร |
| โปรเจกต์นี้ | `user: User \| null`, `borrowingId: number \| null` | แทบไม่ใช้ใน state |

```ts
// ✅ ใช้ | null เมื่อตั้งใจให้ว่าง
const [user, setUser]           = useState<User | null>(null)       // ยังไม่ login
const [borrowingId, setBorrowingId] = useState<number | null>(null) // ยังไม่ได้เลือก
```

### Record<K, V> — object ที่ key จำกัดด้วย Union Type

::: code-group
```ts [✅ Record ใน EquipmentCard]
// map EquipmentStatus → string (label หรือ className)
const statusLabel: Record<EquipmentStatus, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}
// ถ้าลืมใส่ key ใดใด → TypeScript แจ้ง Error ทันที

const badgeClass: Record<EquipmentStatus, string> = {
  available:   'bg-green-100 text-green-700',
  borrowed:    'bg-red-100 text-red-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
}

// ใช้งาน: statusLabel[equipment.status] → 'ว่าง'
```
```ts [❌ plain object ไม่มี type]
const statusLabel = {
  available: 'ว่าง',
  // ลืม borrowed → ไม่มี error แต่ runtime undefined
}
```
:::

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้างไฟล์ `src/types/index.ts` สำหรับระบบเบิก-จ่ายอุปกรณ์ไอที ต้องการ: 1) `type EquipmentStatus` เป็น Union 3 ค่า 2) `type UserRole` เป็น Union 3 ค่า 3) `interface Equipment` มี id, name, category, serialNo, status (ใช้ EquipmentStatus), borrowedBy (string | null) 4) `interface User` 5) `interface ApiResponse<T>` แบบ Generic ช่วยอธิบายว่าทำไมต้องแยก `type` กับ `interface` ด้วย"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า `type` กับ `interface` ต่างกันอย่างไร และใช้แต่ละอันเมื่อไหร่
- [ ] บอกได้ว่า `borrowedBy: string | null` กับ `borrowedBy?: string` ต่างกันอย่างไรในทางปฏิบัติ
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/types/index.ts`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองยังอยู่ใน Component หลัก ✅

**ขั้น 1: สร้าง Union Types (5 นาที)**

- [ ] สร้างไฟล์ `src/types/index.ts`
- [ ] เขียน `export type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'`
- [ ] เขียน `export type UserRole = 'admin' | 'teacher' | 'student'`
- [ ] ทดสอบ: ใน `App.tsx` เขียน `const s: EquipmentStatus = 'ready'` → ต้องเห็น Error ✅

**ขั้น 2: สร้าง Interfaces (10 นาที)**

- [ ] เขียน `export interface Equipment` ครบทุก field (id, name, category, serialNo, status, borrowedBy)
- [ ] เขียน `export interface User` (id, email, name, role)
- [ ] เขียน `export interface ApiResponse<T>` (success, data, message?)
- [ ] ทดสอบ: สร้าง object `const eq: Equipment = { ... }` ให้ TypeScript ไม่ Error ✅

**ขั้น 3: นำไปใช้แทน Interface เดิม (10 นาที)**

- [ ] เปิด `src/hooks/useEquipments.ts` — ลบ `interface Equipment` ที่เขียนไว้ในไฟล์
- [ ] import แทนด้วย `import type { Equipment } from '../types'`
- [ ] ตรวจสอบว่า Hook ยังทำงานได้ปกติ — รายการยังแสดงในหน้าเว็บ ✅
- [ ] (Bonus) เพิ่ม field `serialNo` ใน `Equipment` และใส่ค่าใน mock data ของ Hook

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk2-types: add types/index.ts with Equipment, User, ApiResponse by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ต่างกันอย่างไรระหว่าง `interface` กับ `type` — ใช้อันไหนเมื่อไหร่?
**แนวคำตอบ:** ทั้งคู่กำหนด Type ได้ แต่ `interface` เหมาะกับ Object shape เพราะ extend ได้ง่าย (`interface B extends A {}`) และ error message ชัดกว่า ส่วน `type` เหมาะกับ Union Types (`'a' | 'b'`) หรือ Computed Types ที่ interface ทำไม่ได้ — Convention ของโปรเจกต์นี้: Object → `interface`, Union → `type`
:::

::: details ❓ `borrowedBy: string | null` กับ `borrowedBy?: string` ต่างกันอย่างไร?
**แนวคำตอบ:** `string | null` หมายถึง field นี้ **ต้องมีเสมอ** แต่ค่าอาจเป็น null เพื่อบอกว่า "ยังไม่มีคนยืม" — ใช้เมื่อต้องการแยกระหว่าง "ยังไม่มีคนยืม (null)" กับ "มีคนยืม (string)" ส่วน `?` (optional) แปลว่า field อาจไม่มีเลย (undefined) เหมาะกับ field ที่ไม่บังคับกรอก
:::

::: details ❓ ทำไมต้องเก็บ Types ไว้ในไฟล์กลาง `types/index.ts`?
**แนวคำตอบ:** 1) **Single Source of Truth** — แก้ที่เดียว ส่งผลทุกที่ ถ้า API เปลี่ยน field แก้แค่ `types/index.ts` 2) **ป้องกัน Inconsistency** — ทุก Component ใช้ interface เดียวกัน ไม่มีกรณี field ชื่อต่างกัน 3) **IDE ช่วยได้มากขึ้น** — Auto-complete และ Type checking ทำงานได้ทั่วทั้งโปรเจกต์
:::

::: details ❓ Generic `<T>` ใน `ApiResponse<T>` คืออะไร และแตกต่างจาก `any` อย่างไร?
**แนวคำตอบ:** `<T>` คือ Type Parameter — placeholder ที่ระบุ type จริงตอนใช้งาน เช่น `ApiResponse<Equipment>` จะทำให้ `data` มี type เป็น `Equipment` ต่างจาก `any` ตรงที่ `any` ปิด type checking ทั้งหมด แต่ Generic ยังคง type safety ไว้ — ถ้า `data` เป็น `Equipment` TypeScript รู้ว่า `data.name` มีอยู่ แต่ถ้าเป็น `any` ไม่รู้อะไรเลย
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `Type '"ready"' is not assignable to type 'EquipmentStatus'` | ใส่ค่าที่ไม่อยู่ใน Union Type | ตรวจสอบ spelling และใช้เฉพาะค่าที่กำหนดใน Union |
| Object ขาด field แล้ว TypeScript Error | `interface` ต้องการ field ครบทุกตัวที่ไม่ใช่ optional | เพิ่ม field ที่ขาด หรือทำเป็น optional ด้วย `?` ถ้าไม่บังคับ |
| `import { Equipment }` แต่ type ไม่มีใน output JS | ลืมใช้ `import type` สำหรับ type-only imports | เปลี่ยนเป็น `import type { Equipment } from '../types'` |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Union Types | EquipmentStatus + UserRole ถูกต้อง | มีแต่ใช้ string แทน | ไม่มี Union Types |
| Interfaces ครบ | Equipment + User + `ApiResponse<T>` | บางอันขาด field | ไม่มี interface |
| นำไปใช้ได้จริง | import ใช้ใน useEquipments ได้ | สร้างแต่ไม่ได้ import | ไม่ได้นำไปใช้ |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `interface` | อิน-เตอร์-เฟซ | TypeScript keyword กำหนด shape ของ Object |
| `type alias` | ไทพ เอ-ลิ-แอส | ชื่อแทนสำหรับ Type ที่ซับซ้อน เช่น Union Types |
| `Union Type` | ยู-เนียน ไทพ | Type ที่รับได้หลายค่า เช่น `'available' \| 'borrowed'` |
| `null` | นัล | ค่าว่างอย่างตั้งใจ — บอกว่า "ไม่มีข้อมูล" |
| `Generic <T>` | เจ-เนอ-ริค | Type Parameter — placeholder ใส่ Type จริงตอนใช้งาน |
| `Single Source of Truth` | ซิง-เกิล ซอร์ส ออฟ ทรูธ | เก็บข้อมูล/Type ไว้ที่เดียว แก้ที่เดียวได้ผลทุกที่ |
| `optional (?:)` | อ๊อพ-ชัน-นัล | field ที่ไม่บังคับ — อาจไม่มีก็ได้ (undefined) |
| `Object` | อ๊อบ-เจ็กท์ | โครงสร้างข้อมูลที่เก็บ key-value pairs |
