# Data Model — Types & Interfaces <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายมีข้อมูลหลายประเภท — Equipment, User, BorrowRecord ถ้าแต่ละ Component ประกาศ `interface Equipment` เองคนละที่ อาจเกิดกรณีที่ Component A ส่ง `{ equipmentName }` แต่ Component B รอรับ `{ name }` — ชื่อ field ต่างกัน แอปพัง! วิธีแก้คือเก็บ Types ทั้งหมดไว้ในไฟล์กลางไฟล์เดียว
:::

> 💡 **เปรียบเทียบ:** Interface คือ "แบบฟอร์มราชการ" — กำหนดว่าต้องกรอกช่องอะไรบ้าง ถ้ากรอกไม่ครบหรือชื่อช่องผิด ระบบปฏิเสธทันที ป้องกัน Bug ก่อน run โปรแกรม

---

## 📖 I: Information

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

---

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

---

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

---

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

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้างไฟล์ `src/types/index.ts` สำหรับระบบเบิก-จ่ายอุปกรณ์ไอที ต้องการ: 1) `type EquipmentStatus` เป็น Union 3 ค่า 2) `type UserRole` เป็น Union 3 ค่า 3) `interface Equipment` มี id, name, category, serialNo, status (ใช้ EquipmentStatus), borrowedBy (string | null) 4) `interface User` 5) `interface ApiResponse<T>` แบบ Generic ช่วยอธิบายว่าทำไมต้องแยก `type` กับ `interface` ด้วย"
:::

### 📝 PjBL Lab

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

- [ ] `git add . && git commit -m "wk2: add types/index.ts with Equipment, User, ApiResponse"` → `git push`
- [ ] เขียนสรุปใน Google Doc: ต่างกันอย่างไร type กับ interface, ทำไม borrowedBy เป็น `| null` ไม่ใช่ `?`

---

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

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Union Types | EquipmentStatus + UserRole ถูกต้อง | มีแต่ใช้ string แทน | ไม่มี Union Types |
| Interfaces ครบ | Equipment + User + `ApiResponse<T>` | บางอันขาด field | ไม่มี interface |
| นำไปใช้ได้จริง | import ใช้ใน useEquipments ได้ | สร้างแต่ไม่ได้ import | ไม่ได้นำไปใช้ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `interface` | TypeScript keyword กำหนด shape ของ Object |
| `type alias` | ชื่อแทนสำหรับ Type ที่ซับซ้อน เช่น Union Types |
| `Union Type` | Type ที่รับได้หลายค่า เช่น `'available' \| 'borrowed'` |
| `null` | ค่าว่างอย่างตั้งใจ — บอกว่า "ไม่มีข้อมูล" |
| `Generic <T>` | Type Parameter — placeholder ใส่ Type จริงตอนใช้งาน |
| `Single Source of Truth` | เก็บข้อมูล/Type ไว้ที่เดียว แก้ที่เดียวได้ผลทุกที่ |
| `optional (?:)` | field ที่ไม่บังคับ — อาจไม่มีก็ได้ (undefined) |
