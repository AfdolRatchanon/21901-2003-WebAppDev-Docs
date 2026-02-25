# ออกแบบฐานข้อมูลด้วย Prisma Schema <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ต้องเก็บข้อมูล 3 อย่าง: **ผู้ใช้** (User), **อุปกรณ์** (Equipment), และ **ประวัติการยืม** (BorrowRecord) — ถ้าออกแบบ DB ผิด เช่น ไม่มี relation หรือ field ไม่พอ จะแก้ทีหลังยากมาก ต้องออกแบบ Schema ให้ถูกตั้งแต่แรก!
:::

> 💡 **เปรียบเทียบ:** Prisma Schema เหมือน "แบบแปลนบ้าน" — กำหนดห้อง (Table) ขนาดประตู (Field types) และทางเดิน (Relation) ก่อนสร้างจริง ถ้าแบบแปลนผิดตั้งแต่ต้น สร้างบ้านไปแล้วจะแก้ยากมาก

---

## 📖 I: Information

### ERD (Entity Relationship Diagram)

```
User (ผู้ใช้)
├── id: Int @id
├── email: String @unique
├── password: String (hashed)
├── name: String
├── role: String (admin|teacher|student)
└── borrows: BorrowRecord[] ←─────────────┐
                                           │
Equipment (อุปกรณ์)                        │
├── id: Int @id                            │
├── name: String                           │
├── category: String                       │
├── serialNo: String @unique               │
├── status: String (available|borrowed|maintenance)
├── borrowedBy: String?                    │
└── borrows: BorrowRecord[] ←────────┐    │
                                     │    │
BorrowRecord (ประวัติการยืม)          │    │
├── id: Int @id                      │    │
├── equipmentId: Int ────────────────┘    │
├── userId: Int ──────────────────────────┘
├── purpose: String
├── borrowedAt: DateTime
├── expectedReturn: DateTime
└── returnedAt: DateTime? (null = ยังไม่คืน)
```

### Prisma Schema

```prisma [prisma/schema.prisma]
// Prisma Schema — ระบบเบิก-จ่ายอุปกรณ์ไอที

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      String   @default("student") // admin | teacher | student
  createdAt DateTime @default(now())

  borrows BorrowRecord[]
}

model Equipment {
  id         Int      @id @default(autoincrement())
  name       String
  category   String
  serialNo   String   @unique
  status     String   @default("available") // available | borrowed | maintenance
  borrowedBy String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  borrows BorrowRecord[]
}

model BorrowRecord {
  id             Int       @id @default(autoincrement())
  equipmentId    Int
  userId         Int
  purpose        String
  borrowedAt     DateTime  @default(now())
  expectedReturn DateTime
  returnedAt     DateTime?

  equipment Equipment @relation(fields: [equipmentId], references: [id])
  user      User      @relation(fields: [userId], references: [id])
}
```

::: tip 💡 TypeScript Tip — `DateTime?` vs `DateTime`
เครื่องหมาย `?` หลัง type ใน Prisma หมายถึง **optional (nullable)** — `returnedAt DateTime?` คือ field นี้เป็น `null` ได้ ใช้แทนความหมาย "ยังไม่คืน" ส่วนถ้าไม่มี `?` หมายความว่า field นั้นต้องมีค่าเสมอ
:::

### Frontend Type ที่ตรงกับ Schema

```ts [src/types/index.ts]
// Type ที่ Frontend ใช้ — ต้องตรงกับ Prisma Schema
export interface Equipment {
  id: number
  name: string
  category: string
  serialNo: string
  status: 'available' | 'borrowed' | 'maintenance'
  borrowedBy: string | null  // null = ว่าง, string = ชื่อผู้ยืม
}

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'teacher' | 'student'
}

export interface BorrowRecord {
  id: number
  equipmentId: number
  userId: number
  purpose: string
  borrowedAt: string        // ISO 8601 string (JSON ไม่มี Date native)
  expectedReturn: string
  returnedAt: string | null // null = ยังไม่คืน
}
```

### Prisma CLI Commands

```bash
# สร้าง/อัปเดตตาราง DB ตาม Schema (ไม่มี migration file)
npx prisma db push

# สร้าง Prisma Client ใหม่ (หลังแก้ Schema)
npx prisma generate

# เปิด Prisma Studio — GUI ดูข้อมูลใน DB
npx prisma studio

# รัน seed script (ใส่ข้อมูลเริ่มต้น)
npm run db:seed
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"ออกแบบ Prisma schema สำหรับระบบเบิก-จ่ายอุปกรณ์ไอที โดยมี 3 model: User (id, email, password, name, role), Equipment (id, name, category, serialNo, status, borrowedBy) และ BorrowRecord (id, equipmentId, userId, purpose, borrowedAt, expectedReturn, returnedAt) ใส่ relation และ default values ที่เหมาะสม ใช้ MySQL"
:::

### 📝 PjBL Lab

- [ ] เปิดไฟล์ `project/backend/prisma/schema.prisma` และอ่านทำความเข้าใจ
- [ ] วาด ERD ด้วยมือหรือเครื่องมือ (draw.io / Figma) แสดง relation ทั้งหมด
- [ ] ระบุว่า field ไหนใช้ `?` (optional) และทำไม
- [ ] รัน `npx prisma studio` ดูข้อมูลใน DB ที่ seed ไว้
- [ ] เปรียบเทียบ Prisma Schema กับ TypeScript Interface ใน `src/types/` ว่าตรงกันไหม
- [ ] ถาม: ถ้าต้องเพิ่ม "หมวดหมู่อุปกรณ์" เป็น Table แยก จะแก้ Schema อย่างไร?

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `BorrowRecord` ต้องเก็บ `equipmentId` และ `userId` แทนที่จะเก็บชื่อโดยตรง?
**แนวคำตอบ:** การเก็บ `id` (Foreign Key) แทนชื่อคือหลัก **Database Normalization** — ถ้าเปลี่ยนชื่ออุปกรณ์ภายหลัง ข้อมูลใน BorrowRecord จะยังถูกต้องเพราะ join ผ่าน id ส่วนถ้าเก็บชื่อโดยตรงจะเกิดข้อมูลไม่ตรงกัน
:::

::: details ❓ ทำไม `serialNo` ต้องเป็น `@unique`?
**แนวคำตอบ:** Serial Number ของอุปกรณ์แต่ละชิ้นต้องไม่ซ้ำกันในโลกจริง — `@unique` ให้ DB ป้องกันการ insert ซ้ำแทน ทำให้ไม่ต้องเช็คใน application code ทุกครั้ง
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| ERD ถูกต้อง | Relation ครบ แสดง FK | มี relation บางส่วน | ไม่มี ERD |
| Schema ครบ | fields + types + relation ถูก | บาง field ขาด | Schema ผิด |
| Frontend Types | Type ตรงกับ Schema | ใช้ `any` บางส่วน | ไม่มี types |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Prisma Schema` | ไฟล์ที่กำหนดโครงสร้าง Database (models + relations + types) |
| `ERD` | Entity Relationship Diagram — ผังแสดงความสัมพันธ์ระหว่าง Table |
| `Foreign Key` | Field ที่อ้างอิง Primary Key ของ Table อื่น เชื่อม relation |
| `Normalization` | หลักการออกแบบ DB ให้ไม่มีข้อมูลซ้ำซ้อน |
| `@unique` | Constraint ที่บอกว่า field นั้นต้องไม่ซ้ำกันในทั้ง Table |
| `nullable` | Field ที่ยอมให้มีค่า null ได้ (Prisma ใช้ `?` suffix) |
