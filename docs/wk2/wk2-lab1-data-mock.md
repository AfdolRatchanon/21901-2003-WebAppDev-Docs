# Lab: จัดการ State ข้อมูลรายการอุปกรณ์ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ก่อนจะเชื่อมต่อ API จริง (wk4) ต้องทดสอบ UI ก่อนว่าแสดงผลถูกต้อง — ถ้ารอ API พร้อมก่อนค่อยทดสอบ UI จะเสียเวลามาก ทีม Frontend จึงใช้ **Mock Data** แทน API เพื่อพัฒนา UI ไปพร้อมกับทีม Backend ได้เลย
:::

> 💡 **เปรียบเทียบ:** Mock Data เหมือน "ตัวอย่างอาหาร" ที่ร้านค้า — ใช้ทดสอบว่าจัดวางสวยไหม รสชาติดีไหม ก่อนทำของจริงขาย

---

## 📖 I: Information

ใช้ **`useState<Equipment[]>`** เก็บรายการอุปกรณ์ และสร้าง **Mock Data** แทน API ชั่วคราว

::: code-group
```tsx [EquipmentPage.tsx (wk2 version)]
import { useState } from 'react'
import type { Equipment } from '../types'

// Mock Data — อุปกรณ์จำลอง 4 รายการ (wk4 จะเปลี่ยนเป็น API จริง)
const mockEquipments: Equipment[] = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Notebook',   serialNo: 'MB-001', status: 'available',    borrowedBy: null },
  { id: 2, name: 'MacBook Pro 14"', category: 'Notebook',   serialNo: 'MB-002', status: 'borrowed',     borrowedBy: 'นักเรียนสมหญิง' },
  { id: 3, name: 'iPad Air',        category: 'Tablet',     serialNo: 'IP-001', status: 'available',    borrowedBy: null },
  { id: 4, name: 'Dell Monitor 27"',category: 'Monitor',    serialNo: 'DL-001', status: 'maintenance',  borrowedBy: null },
]

// Map สถานะเป็นภาษาไทย
const statusLabel: Record<string, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}

export function EquipmentPage() {
  // useState<Equipment[]> — กำหนด Type ให้ array
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // กรองรายการตามสถานะที่เลือก
  const displayed = filterStatus === 'all'
    ? equipments
    : equipments.filter(eq => eq.status === filterStatus)

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">รายการอุปกรณ์</h1>
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {['all', 'available', 'borrowed', 'maintenance'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'all' ? 'ทั้งหมด' : statusLabel[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map(eq => (
          <div key={eq.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <p className="font-bold text-slate-800">{eq.name}</p>
            <p className="text-xs text-slate-500">{eq.category} · {eq.serialNo}</p>
            <p className="text-xs mt-1">{statusLabel[eq.status]}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
```
:::

::: tip 💡 TypeScript Tip — Array Type
`useState<Equipment[]>([])` บอก TypeScript ว่า state นี้เป็น array ของ Equipment ถ้าพยายามใส่ข้อมูลที่ไม่ใช่ Equipment เข้าไป TypeScript จะแจ้ง error ทันที
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React component ที่แสดงรายการอุปกรณ์แบบ filter ด้วย useState โดยให้ array ใช้ TypeScript type เป็น `Equipment[]` เพิ่มปุ่ม filter ตามสถานะ: all, available, borrowed, maintenance และใช้ Tailwind CSS"
:::

### 📝 PjBL Lab

- [ ] คัดลอก Mock Data 4-6 รายการลงใน `EquipmentPage.tsx`
- [ ] ใช้ `useState<Equipment[]>` เก็บรายการ
- [ ] แสดงรายการอุปกรณ์เป็น Grid 3 คอลัมน์ด้วย Tailwind
- [ ] สร้างปุ่ม Filter แยกตาม status (all / available / borrowed / maintenance)
- [ ] ใช้ `Array.filter()` กรองรายการตามปุ่มที่เลือก
- [ ] แสดงสี border ต่างกัน: เขียว=ว่าง, แดง=ถูกยืม, เหลือง=ซ่อม
- [ ] ทดสอบ: กดปุ่ม filter แล้วรายการเปลี่ยนตาม

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `useState<Equipment[]>` ดีกว่า `useState<any[]>`?
**แนวคำตอบ:** การใช้ `any` ทำให้ TypeScript ไม่ตรวจสอบ type ให้ เช่น `eq.naem` (พิมพ์ผิด) จะไม่แจ้ง error ส่วน `Equipment[]` TypeScript จะตรวจสอบทุก property ให้ ลด Bug ได้มาก
:::

::: details ❓ ทำไมต้องใช้ Mock Data แทนการรอ API จริง?
**แนวคำตอบ:** ทีม Frontend และ Backend ทำงานพร้อมกันได้ (Parallel Development) โดย Frontend ใช้ Mock Data ทดสอบ UI ก่อน เมื่อ API พร้อมค่อยเปลี่ยนแค่ส่วน data fetching โดย UI ไม่ต้องแก้
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Mock Data ครบ | มีข้อมูลครบทุก field และ status | บางส่วนขาด field | ไม่มี Mock Data |
| Filter ทำงาน | กรองได้ถูกต้องทุก status | กรองได้บางส่วน | ไม่มี Filter |
| UI แสดงผล | Grid + Tailwind สวยงาม responsive | แสดงได้แต่ไม่ responsive | UI ไม่แสดง |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Mock Data` | ข้อมูลจำลองสำหรับทดสอบ ก่อนใช้ข้อมูลจริง |
| `Array.filter()` | ฟังก์ชัน JavaScript กรองอาร์เรย์ตามเงื่อนไข |
| `useState<T>` | React Hook เก็บ State พร้อม TypeScript Generic |
| `Parallel Development` | การทำงานพร้อมกันหลาย ๆ ส่วนโดยไม่รอกัน |
| `Record<K, V>` | TypeScript built-in type สำหรับ Object ที่ key เป็น K และ value เป็น V |
