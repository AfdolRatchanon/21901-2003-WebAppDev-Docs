# สอบกลางภาค + นำเสนอโครงร่างโปรเจกต์ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
**สถานการณ์:** ทีมพัฒนาระบบเบิก-จ่ายอุปกรณ์ไอทีทำงานมา 4 สัปดาห์แล้ว
ถึงเวลาพิสูจน์ว่าระบบที่สร้างใช้งานได้จริง — คุณสามารถอธิบาย code ของตัวเองได้ไหม?
อาจารย์จะถามว่า "บรรทัดนี้ทำอะไร? ทำไมใช้ Interface ตรงนี้?" ถ้าตอบไม่ได้ = คะแนนหาย
:::

> 💡 **เปรียบเทียบ:** การสอบกลางภาคเหมือน "Sprint Review" ใน Agile — ทีมต้อง demo ว่าสร้างอะไรได้จริง ไม่ใช่แค่บอกว่าทำอยู่

---

## 📖 I: Information — ทบทวน Week 1–4

สิ่งที่เรียนมาทั้งหมดสำหรับโปรเจกต์ระบบเบิก-จ่ายอุปกรณ์ไอที:

| Week | หัวข้อ | สิ่งที่ต้องจำ |
|------|--------|--------------|
| 1 | TypeScript Basics | `string`, `number`, `boolean`, `Type Alias` |
| 2 | Interface & Props | `interface Equipment {}`, `ComponentProps` |
| 3 | Tailwind CSS | utility classes, responsive, `flex`, `grid` |
| 4 | API (Axios + useEffect) | `useState`, `useEffect`, `axios.get()`, `async/await` |

::: code-group
```ts [types/index.ts]
// รวม Types ที่ใช้ตลอดโปรเจกต์ — ต้องจำทั้งหมดนี้
export interface Equipment {
  id: number
  name: string          // ชื่ออุปกรณ์
  category: string      // ประเภท เช่น "Laptop", "Monitor"
  status: 'available' | 'borrowed' | 'maintenance'
  quantity: number
}

// Type สำหรับ API response
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// Props ของ EquipmentCard component
export interface EquipmentCardProps {
  equipment: Equipment
  onBorrow?: (id: number) => void
}
```

```tsx [components/EquipmentCard.tsx]
// ต้องแสดง component นี้ใน midterm
import type { EquipmentCardProps } from '../types'

export function EquipmentCard({ equipment, onBorrow }: EquipmentCardProps) {
  // Map status → สีปุ่ม Tailwind
  const statusColor: Record<Equipment['status'], string> = {
    available:   'bg-green-100 text-green-700',
    borrowed:    'bg-yellow-100 text-yellow-700',
    maintenance: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <h3 className="font-semibold text-slate-800">{equipment.name}</h3>
      <span className={`text-xs px-2 py-1 rounded-full w-fit ${statusColor[equipment.status]}`}>
        {equipment.status}
      </span>
      <p className="text-sm text-slate-500">จำนวน: {equipment.quantity}</p>
      {equipment.status === 'available' && onBorrow && (
        <button onClick={() => onBorrow(equipment.id)}
          className="mt-auto bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 rounded-lg">
          เบิกอุปกรณ์
        </button>
      )}
    </div>
  )
}
```

```tsx [pages/EquipmentPage.tsx]
// ต้องแสดง API call + render list ใน midterm
import { useState, useEffect } from 'react'
import { apiClient } from '../api/config'
import { EquipmentCard } from '../components/EquipmentCard'
import type { Equipment, ApiResponse } from '../types'

export function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get<ApiResponse<Equipment[]>>('/equipment')
      .then(res => setItems(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-center py-10">กำลังโหลด...</p>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {items.map(eq => <EquipmentCard key={eq.id} equipment={eq} />)}
    </div>
  )
}
```
:::

::: tip 💡 TypeScript Tip — ทบทวนก่อนสอบ
หลีกเลี่ยง `any` เสมอ — ถ้าไม่รู้ type ให้ใช้ `unknown` แล้วค่อย narrow ด้วย `typeof` หรือ type guard
แทนที่จะเขียน `const data: any = ...` ให้เขียน `const data: Equipment[] = ...`
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"ช่วยตรวจสอบ TypeScript React component ที่เขียนสำหรับโปรเจกต์กลางภาค ตรวจว่า: ไม่มี type 'any', ใช้ interface ถูกต้อง, Tailwind classes เหมาะสม และ API call ด้วย useEffect ทำงานได้จริง แล้วสรุปเป็น checklist ว่าขาดอะไรบ้าง"
:::

### 📝 PjBL Lab — Midterm Checklist

ตรวจสอบโปรเจกต์ของตัวเองก่อนเข้าสอบ:

**Components (ต้องมีครบ)**
- [ ] `EquipmentCard.tsx` — แสดงข้อมูลอุปกรณ์ 1 ชิ้น
- [ ] `EquipmentPage.tsx` — แสดง list ทั้งหมด
- [ ] `Navbar.tsx` — navigation bar

**TypeScript (ต้องไม่มี error)**
- [ ] ใช้ `interface Equipment` ครบทุก field
- [ ] ไม่มี `any` ในโค้ดทั้งหมด
- [ ] Props ทุก component มี Type กำกับ

**Tailwind CSS (ต้องดูสวย)**
- [ ] Card มี shadow, rounded, padding
- [ ] มี responsive grid (`sm:grid-cols-2 lg:grid-cols-3`)
- [ ] Status badge มีสีตามสถานะ

**API Connection (ต้องดึงข้อมูลได้)**
- [ ] `useEffect` ดึงข้อมูลจาก `/equipment` ได้จริง
- [ ] แสดง loading state ขณะรอ API
- [ ] render ข้อมูลจริงใน browser

**การนำเสนอ (ต้องอธิบายได้)**
- [ ] เตรียมอธิบาย: "ทำไมใช้ interface แทน type?"
- [ ] เตรียมอธิบาย: "useEffect dependency array `[]` หมายความว่าอะไร?"
- [ ] เปิด browser + VS Code พร้อมกัน

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ Interface แทนการเขียน type ตรงๆ ใน props?
**แนวคำตอบ:** Interface ทำให้ re-use ได้ในหลาย component และแก้ไขที่เดียวกระทบทุกที่
ถ้า backend เปลี่ยน field `name` เป็น `title` แค่แก้ใน interface เดียว ทุก component อัปเดตอัตโนมัติ
:::

::: details ❓ ถ้า API ยังไม่ return ข้อมูล ผู้ใช้จะเห็นอะไร และ code ตรงไหนรับผิดชอบ?
**แนวคำตอบ:** ผู้ใช้จะเห็น "กำลังโหลด..." เพราะ `loading` state เริ่มต้นเป็น `true`
เมื่อ `.finally(() => setLoading(false))` ทำงาน จึงเปลี่ยนไปแสดง component จริง
:::

::: details ❓ `Record<Equipment['status'], string>` ทำงานอย่างไร?
**แนวคำตอบ:** `Record<K, V>` สร้าง object type ที่ key เป็น K และ value เป็น V
`Equipment['status']` ดึง union type `'available' | 'borrowed' | 'maintenance'` มาเป็น key
ทำให้ TypeScript บังคับว่าต้องมี key ครบทุก status — ไม่มีทางลืม case
:::

### 📋 Rubric — Midterm (50 คะแนน)

| เกณฑ์ | ดีมาก (8–10) | พอใช้ (4–7) | ปรับปรุง (0–3) |
|-------|-------------|------------|----------------|
| Components (10) | มี EquipmentCard, EquipmentPage, Navbar ครบ และทำงานได้ | มีบางส่วน หรือ error เล็กน้อย | ขาด component หลัก หรือ render ไม่ได้ |
| TypeScript (10) | ใช้ Interface/Type ถูกต้อง ไม่มี `any` เลย | มี `any` 1–2 จุด หรือ type ไม่ครบ | ไม่ใช้ TypeScript หรือ error จำนวนมาก |
| Tailwind CSS (10) | UI สวยงาม responsive ใช้ได้ทุกขนาดหน้าจอ | UI พอใช้ แต่ไม่ responsive หรือไม่สม่ำเสมอ | ไม่ใช้ Tailwind หรือ UI ไม่สามารถใช้งานได้ |
| API Connect (10) | ดึงข้อมูลจริงจาก backend ได้ แสดง loading | ดึงข้อมูลได้บางส่วน หรือไม่มี loading | ไม่ได้เชื่อมต่อ API เลย |
| Presentation (10) | อธิบาย code ได้ชัดเจน ตอบคำถามได้ | อธิบายได้บางส่วน ต้องการความช่วยเหลือ | อ่าน code ไม่ออก หรือไม่สามารถอธิบายได้ |

---

### 📚 CLIL Vocabulary — Project Defense

| Term | Meaning |
|------|---------|
| Sprint Review | การนำเสนอผลงานรายสัปดาห์ใน Agile |
| Type Safety | การป้องกัน error โดยกำหนด type ให้ข้อมูลทุกตัว |
| Interface | โครงสร้างที่บอกว่า object ต้องมี field อะไรบ้าง |
| Component | ส่วนย่อยของ UI ที่ re-use ได้ |
| API Endpoint | URL ที่ใช้เรียกข้อมูลจาก backend |
| Responsive | UI ที่ปรับขนาดได้ตามหน้าจอ (mobile/tablet/desktop) |
| Loading State | สถานะขณะรอข้อมูล — บอกผู้ใช้ว่ายังโหลดอยู่ |
| Dependency Array | `[]` ใน useEffect — กำหนดว่า effect รันเมื่อไหร่ |
