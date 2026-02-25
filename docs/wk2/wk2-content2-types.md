# สร้าง Data Model (Interfaces & Types) <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ในระบบเบิก-จ่ายอุปกรณ์ไอที มีข้อมูลหลายประเภท — อุปกรณ์ (Equipment), ผู้ใช้ (User), ประวัติการยืม (BorrowRecord) ถ้าไม่มีการกำหนด Type ไว้กลาง component หนึ่งอาจส่ง `{ name: "Laptop" }` แต่อีก component รอรับ `{ equipmentName: "Laptop" }` — ชื่อ field ต่างกัน แอปพัง!
:::

> 💡 **เปรียบเทียบ:** Interface คือ "แบบฟอร์มราชการ" — กำหนดว่าต้องกรอกช่องอะไรบ้าง ถ้ากรอกไม่ครบหรือผิดช่อง ระบบปฏิเสธทันที ช่วยป้องกันความผิดพลาดตั้งแต่ต้น

---

## 📖 I: Information

TypeScript มี 2 วิธีสร้าง Type กลาง: **`interface`** และ **`type`**

::: code-group
```ts [types/index.ts]
// ไฟล์กลางเก็บ Type ทั้งระบบ — นำเข้าที่เดียว ใช้ได้ทุกที่

// type alias: สำหรับ Union Types (ค่าที่มีได้หลายแบบ)
export type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'
export type UserRole = 'admin' | 'teacher' | 'student'

// interface: สำหรับ Object shape
export interface Equipment {
  id: number
  name: string
  category: string
  serialNo: string
  status: EquipmentStatus   // ใช้ type ที่สร้างไว้
  borrowedBy: string | null // null = ยังไม่มีใครยืม
}

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
}

// ApiResponse: Generic Type ครอบ response ทุกตัว
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
```

```ts [วิธีใช้งาน]
// นำเข้า Type แล้วใช้ annotate ตัวแปร
import type { Equipment, User, EquipmentStatus } from '../types'

const eq: Equipment = {
  id: 1,
  name: 'MacBook Pro',
  category: 'Notebook',
  serialNo: 'MB-001',
  status: 'available',  // ✅ TypeScript ตรวจสอบให้ว่าต้องเป็น 3 ค่านี้เท่านั้น
  borrowedBy: null,
}

// TS จะ error ทันทีถ้าพิมพ์ผิด:
// status: 'ready'  ❌ Type '"ready"' is not assignable to type 'EquipmentStatus'
```
:::

::: tip 💡 TypeScript Tip — interface vs type
ใช้ **`interface`** เมื่อต้องการกำหนด shape ของ Object (สามารถ extends ได้)
ใช้ **`type`** เมื่อต้องการ Union Types (`'a' | 'b'`) หรือ Computed Types
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง TypeScript interfaces สำหรับระบบเบิก-จ่ายอุปกรณ์ไอที ต้องการ: Equipment (id, name, category, serialNo, status เป็น union type, borrowedBy เป็น nullable string), User (id, email, name, role เป็น union type) และ interface แบบ generic ชื่อ `ApiResponse<T>`"
:::

### 📝 PjBL Lab

สร้างไฟล์ `src/types/index.ts`:

- [ ] สร้าง `type EquipmentStatus = 'available' | 'borrowed' | 'maintenance'`
- [ ] สร้าง `type UserRole = 'admin' | 'teacher' | 'student'`
- [ ] สร้าง `interface Equipment` มีทุก field ตามตัวอย่าง
- [ ] สร้าง `interface User` สำหรับข้อมูลผู้ใช้
- [ ] สร้าง `interface ApiResponse<T>` (Generic — wk4 จะใช้จริง)
- [ ] ลองใช้ `Equipment` ใน `useEquipments.ts` แทน `interface` ที่เขียนไว้เดิม
- [ ] ทดสอบ: ลองตั้ง `status: 'ready'` ดูว่า TypeScript แจ้ง error ไหม

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ต่างกันอย่างไรระหว่าง `interface Equipment` กับ `type Equipment`?
**แนวคำตอบ:** ทั้งคู่ใช้กำหนด shape ของ Object ได้เหมือนกัน แต่ `interface` รองรับ `extends` ได้ง่ายกว่าและ error message ชัดกว่า ส่วน `type` ยืดหยุ่นกว่าตรง Union Types — สำหรับโปรเจกต์นี้ใช้ `interface` สำหรับ Object และ `type` สำหรับ Union
:::

::: details ❓ `borrowedBy: string | null` ต่างกับ `borrowedBy?: string` อย่างไร?
**แนวคำตอบ:** `string | null` หมายความว่า field นี้ต้องมีอยู่เสมอ แต่ค่าอาจเป็น null ส่วน `?` (optional) หมายความว่า field นี้อาจไม่มีก็ได้ สำหรับ `borrowedBy` เราใช้ `| null` เพราะต้องการรู้ชัดว่า "ยังไม่มีคนยืม" ไม่ใช่แค่ "ไม่รู้ค่า"
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Types ครบถ้วน | Union Types + Interfaces ครบ | บางอันขาด field | ไม่มีไฟล์ types |
| นำไปใช้ได้จริง | import ใช้ใน useEquipments ได้ | สร้างแต่ไม่ได้ import | ไม่ได้นำไปใช้ |
| TS ตรวจสอบได้ | ลอง error แล้ว TS แจ้งถูก | บางอันไม่ถูก | ใช้ `any` ทั้งหมด |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `interface` | คีย์เวิร์ด TypeScript กำหนด shape ของ Object |
| `type alias` | ชื่อแทนสำหรับ Type ที่ซับซ้อน เช่น Union Types |
| `Union Type` | Type ที่รับได้หลายค่า เช่น `'a' \| 'b'` |
| `null` | ค่าว่าง ใช้บอกว่า "ไม่มีข้อมูล" อย่างตั้งใจ |
| `Generic <T>` | Type ที่ยืดหยุ่น ใส่ Type อื่นแทน T ได้ตอนใช้งาน |
