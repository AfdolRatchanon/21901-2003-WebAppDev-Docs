# Database Schema & API Response Types <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
API ส่งข้อมูลมาเป็น JSON — ถ้าไม่มี TypeScript type รองรับ เราต้อง `res.data` แบบ `any` ทุกที่ พิมพ์ field ผิดก็ไม่รู้จนกว่าจะ runtime crash นอกจากนี้ `BorrowRecord` ส่งมาพร้อม nested `equipment` และ `user` object — TypeScript จะช่วยอะไรได้ถ้าเราไม่กำหนด type ให้ครบ?
:::

> 💡 **เปรียบเทียบ:** TypeScript Interface เหมือน "สัญญาระหว่าง Backend กับ Frontend" — Backend สัญญาว่าจะส่ง field อะไรมา, Frontend สัญญาว่าจะรับแค่ field นั้น TypeScript ตรวจสอบสัญญานี้ให้ตลอดเวลา

---

## 📖 I: Information

### ขั้นตอนที่ 1 — ERD → TypeScript Interface (Frontend View)

Backend เก็บข้อมูลใน MySQL 3 ตาราง — Frontend มองข้อมูลเหล่านี้ผ่าน JSON ที่ API ส่งมา:

```
Database Tables          JSON that API returns        TypeScript Interface
─────────────────        ───────────────────────      ───────────────────────
User (MySQL)         →   { id, email, name, role }  → interface User
Equipment (MySQL)    →   { id, name, status, ... }  → interface Equipment
BorrowRecord (MySQL) →   { id, purpose, equipment:  → interface BorrowRecord
                           { id, name }, user: {          (ซ้อน nested objects)
                           id, name } }
```

::: code-group
```ts [src/types/index.ts — v1 (Entity Types) ✅]
// [1] Union Type — กำหนดค่าที่เป็นไปได้ (เหมือน Enum ใน Prisma)
export type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'
export type UserRole        = 'admin' | 'teacher' | 'student'

// [2] Equipment Interface — ตรงกับ Equipment table ใน MySQL
//     Field ที่ nullable ใน DB → string | null ใน TypeScript
export interface Equipment {
  id:         number
  name:       string
  category:   string
  serialNo:   string
  status:     EquipmentStatus    // [3] ใช้ Union Type แทน string
  borrowedBy: string | null      // [4] null = ว่าง, string = ชื่อผู้ยืม
  createdAt:  string             // [5] DateTime ใน DB → ISO string ใน JSON
  updatedAt:  string
}

// [6] User Interface — เฉพาะ field ที่ Frontend ต้องใช้
//     (ไม่รวม password — Backend ไม่ส่ง password กลับมาใน response)
export interface User {
  id:    number
  email: string
  name:  string
  role:  UserRole
}
```

```ts [src/types/index.ts — v2 (Nested + Generic Types) ✅]
// [1] BorrowRecord — API ส่งมาพร้อม nested equipment และ user
//     Pick<Equipment, 'id' | 'name' | 'serialNo'> = เลือกเฉพาะ 3 field จาก Equipment
export interface BorrowRecord {
  id:             number
  equipmentId:    number
  userId:         number
  purpose:        string
  borrowedAt:     string
  expectedReturn: string
  returnedAt:     string | null   // [2] null = ยังไม่คืน
  equipment:      Pick<Equipment, 'id' | 'name' | 'serialNo'>  // [3] nested object
  user:           Pick<User, 'id' | 'name' | 'email'>
}

// [4] ApiResponse<T> — Generic wrapper ที่ Backend ส่งทุก endpoint
//     T สามารถเป็น Equipment[], Equipment, BorrowRecord, ฯลฯ
export interface ApiResponse<T> {
  success: boolean
  data:    T
  message?: string
}

// [5] Form Data Types — ส่งไป POST/PATCH endpoint
export interface EquipmentFormData {
  name:     string
  category: string
  serialNo: string
}

export interface BorrowFormData {
  equipmentId:    number
  purpose:        string
  expectedReturn: string
}
```
:::

---

### ขั้นตอนที่ 2 — `Pick<T, K>` และ `Partial<T>` Utility Types

::: code-group
```ts [✅ Pick — เลือกเฉพาะบาง field จาก Interface]
// [1] Pick<T, K> = สร้าง type ใหม่จากเฉพาะ key K ของ T
//     ใช้เมื่อ API ส่งมาบางส่วน ไม่ใช่ทั้ง object
type EquipmentSummary = Pick<Equipment, 'id' | 'name' | 'serialNo'>
// ผล: { id: number, name: string, serialNo: string }

// ใน BorrowRecord.equipment เราใช้ Pick เพราะ API ส่งแค่ 3 field
// ไม่ใช่ Equipment เต็มๆ ทุก field
const record: BorrowRecord = {
  ...
  equipment: { id: 1, name: 'MacBook Pro', serialNo: 'MB-001' }  // ✅ ครบแค่ 3 field
}
```

```ts [💡 ตาราง Utility Types ที่ใช้บ่อย]
// TypeScript Utility Types ที่ใช้บ่อยในโปรเจกต์:
//
// Pick<T, K>      เลือกเฉพาะ key K จาก T
// Partial<T>      ทำให้ทุก field ของ T เป็น optional (ใช้กับ form errors)
// Required<T>     ทำให้ทุก field ของ T เป็น required
// Record<K, V>    object ที่ key เป็น K, value เป็น V
// Omit<T, K>      สร้าง type ใหม่โดยตัด key K ออกจาก T
//
// ตัวอย่าง:
type UpdateForm = Partial<EquipmentFormData>
// ผล: { name?: string, category?: string, serialNo?: string }
// (ทุก field เป็น optional — ส่งได้แค่ field ที่ต้องการอัปเดต)
```

```ts [❌ ใช้ any — TypeScript ช่วยอะไรไม่ได้]
// ถ้าไม่ type response:
const res = await axios.get('/api/equipments')
const eq = res.data.data[0]  // ← eq เป็น any
eq.naem        // ❌ พิมพ์ผิด แต่ TypeScript ไม่บอก
eq.status.toUpperCase()  // ❌ อาจ crash ถ้า status เป็น null

// ถ้ามี type:
const res = await apiClient.get<ApiResponse<Equipment[]>>('/api/equipments')
const eq = res.data.data[0]  // ← eq เป็น Equipment
eq.naem        // ✅ TypeScript Error: Property 'naem' does not exist
eq.status      // ✅ TypeScript รู้ว่าเป็น 'available' | 'borrowed' | 'maintenance'
```
:::

---

### ขั้นตอนที่ 3 — `AuthContextType` สำหรับ Login Flow

```ts [src/types/index.ts — Auth Types]
// [1] AuthContextType — รูปแบบข้อมูล auth ที่ทุก Component ต้องการ
//     ใช้เป็น prop type ใน LoginPage, EquipmentPage, AdminPage
export interface AuthContextType {
  user:            User | null    // [2] null = ยังไม่ login
  token:           string | null
  login:           (email: string, password: string) => Promise<boolean>
  logout:          () => void
  isAuthenticated: boolean        // [3] shortcut: token !== null
}
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้างไฟล์ `src/types/index.ts` สำหรับระบบเบิก-จ่ายอุปกรณ์ไอที ที่มี: 1) Union types `EquipmentStatus` และ `UserRole` 2) interfaces `Equipment`, `User`, `BorrowRecord` (BorrowRecord มี nested `equipment: Pick<Equipment, ...>` และ `user: Pick<User, ...>`) 3) Generic `ApiResponse<T>` wrapper 4) Form data types: `EquipmentFormData`, `BorrowFormData` 5) `AuthContextType` ที่มี `login: (email, password) => Promise<boolean>` — อธิบาย `Pick<T, K>` ด้วย"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: สร้าง src/types/index.ts (15 นาที)**

- [ ] สร้างโฟลเดอร์ `src/types/` และไฟล์ `index.ts`
- [ ] ประกาศ `type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'`
- [ ] ประกาศ `type UserRole = 'admin' | 'teacher' | 'student'`
- [ ] เขียน `interface Equipment` ครบทุก field (id, name, category, serialNo, status, borrowedBy, createdAt, updatedAt)
- [ ] เขียน `interface User` (id, email, name, role)
- [ ] เขียน `interface ApiResponse<T>` (success, data, message?)

**ขั้น 2: เพิ่ม BorrowRecord + Form Types (10 นาที)**

- [ ] เขียน `interface BorrowRecord` พร้อม nested `equipment: Pick<Equipment, 'id' | 'name' | 'serialNo'>` และ `user: Pick<User, 'id' | 'name' | 'email'>`
- [ ] เขียน `interface EquipmentFormData` (name, category, serialNo)
- [ ] เขียน `interface BorrowFormData` (equipmentId, purpose, expectedReturn)
- [ ] เขียน `interface AuthContextType`

**ขั้น 3: Import ใช้แทน inline interface (5 นาที)**

- [ ] เปิด `useEquipments.ts` → แทน `interface Equipment { ... }` inline ด้วย `import type { Equipment } from '../types'`
- [ ] เปิด `EquipmentPage.tsx` → แทน type ที่นิยามซ้ำด้วย import จาก types
- [ ] ทดสอบ TypeScript: ลองพิมพ์ `equipment.naem` → ต้องเห็น Error ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk4: centralize all TypeScript types in src/types/index.ts"` → `git push`
- [ ] เขียนสรุปใน Google Doc: `Pick<T, K>` คืออะไร, `ApiResponse<T>` ทำงานยังไง, ทำไม `borrowedBy` ต้องเป็น `string | null` ไม่ใช่ `string` พร้อม screenshot TypeScript Error เมื่อพิมพ์ field ผิด

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `Equipment.status` ต้องเป็น `EquipmentStatus` (Union Type) แทน `string`?
**แนวคำตอบ:** `string` รับค่าอะไรก็ได้ เช่น `'avaliable'` (พิมพ์ผิด) ก็ผ่าน TypeScript ส่วน `EquipmentStatus = 'available' | 'borrowed' | 'maintenance'` ทำให้ TypeScript ตรวจสอบว่าค่าต้องเป็นหนึ่งใน 3 ตัวนี้เท่านั้น นอกจากนี้ `statusConfig[eq.status]` ที่ใช้ใน wk3 จะได้ TypeScript รับประกันว่า key มีอยู่จริง
:::

::: details ❓ `Pick<Equipment, 'id' | 'name' | 'serialNo'>` คืออะไร — ทำไมต้องใช้ใน BorrowRecord?
**แนวคำตอบ:** `Pick<T, K>` เป็น TypeScript Utility Type ที่สร้าง type ใหม่จากเฉพาะ key K ของ T API endpoint สำหรับ BorrowRecord ส่ง nested equipment มาแค่ 3 field (ไม่ใช่ทั้ง Equipment) การใช้ `Pick` ระบุชัดว่า field ไหนอยู่บ้าง ถ้าใช้ `Equipment` เต็มๆ TypeScript จะ Error ว่าขาด field เช่น `category`, `createdAt` ที่ Backend ไม่ส่งมา
:::

::: details ❓ `DateTime` ใน MySQL กลายเป็น `string` ใน TypeScript ได้อย่างไร?
**แนวคำตอบ:** JSON ไม่มี `Date` type เป็น native — เมื่อ MySQL ส่ง DateTime มา, Backend แปลงเป็น ISO 8601 string เช่น `"2026-02-26T10:30:00.000Z"` ก่อนส่งใน JSON ดังนั้น Frontend TypeScript ประกาศเป็น `string` แต่ถ้าต้องการ Date object ใช้ `new Date(borrowedAt)` แปลงก่อน
:::

::: details ❓ ทำไม `AuthContextType.login` ถึง return `Promise<boolean>` แทน `Promise<void>`?
**แนวคำตอบ:** Login page ต้องรู้ว่า login สำเร็จหรือไม่ เพื่อตัดสินใจว่าจะ redirect หรือแสดง error — ถ้าคืน `void` หน้า Login ไม่รู้ว่าต้องทำอะไรต่อ การคืน `boolean` (true=สำเร็จ, false=ล้มเหลว) ทำให้ Logic ใน Component ชัดเจน: `const ok = await auth.login(...); if (!ok) setError('...')`
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Types ครบ | ทุก interface ถูกต้อง, Union types ใช้แทน string | มีบางส่วน, บางที่ใช้ `any` | ไม่มี types file |
| Pick + Generic | `Pick<T,K>` และ `ApiResponse<T>` ถูกต้อง | มีแต่ไม่ครบ | ไม่ใช้ Generic |
| Import แทน inline | ทุกไฟล์ import จาก types/index.ts | บางไฟล์ import | ยังนิยาม inline ทุกที่ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Pick<T, K>` | TypeScript Utility Type — สร้าง type ใหม่จากเฉพาะ key K ของ T |
| `Partial<T>` | TypeScript Utility Type — ทำให้ทุก field ของ T เป็น optional |
| `Omit<T, K>` | TypeScript Utility Type — สร้าง type ใหม่โดยตัด key K ออก |
| `ISO 8601` | รูปแบบ DateTime string มาตรฐาน: `"2026-02-26T10:30:00.000Z"` |
| `Union Type` | `'a' \| 'b' \| 'c'` — type ที่รับค่าใดค่าหนึ่งใน set เท่านั้น |
| `Nested Object` | object ที่มี object อื่นอยู่ภายใน — เช่น `BorrowRecord.equipment` |
