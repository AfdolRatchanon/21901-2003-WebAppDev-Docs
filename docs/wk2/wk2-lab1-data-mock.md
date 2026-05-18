# Lab: State + Mock Data Array <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** สร้าง EquipmentPage พร้อม Mock Data และ Filter ที่จะเป็นพื้นฐานของ wk3 (Tailwind) และ wk4 (API จริง)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ก่อนจะเชื่อมต่อ API จริงใน wk4 ต้องมั่นใจก่อนว่า UI แสดงผลถูกต้อง — ถ้ารอ API พร้อมก่อนค่อยทำ UI จะเสียเวลาและ Bug ปนกัน ทีม Frontend แก้ปัญหาด้วยการใช้ **Mock Data** แทน API ชั่วคราว เมื่อ API พร้อมแค่เปลี่ยนแหล่งข้อมูล UI ไม่ต้องแตะเลย
:::

> 💡 **เปรียบเทียบ:** Mock Data เหมือน "ตัวอย่างอาหารจำลอง" ที่ร้าน — ใช้ตกแต่งร้าน จัดวางโต๊ะ ถ่ายภาพเมนูได้เลย โดยไม่ต้องรอทำอาหารจริง

## 📖 I: Information

**Mock Data (ข้อมูลจำลอง)** คือชุดข้อมูลที่เราสร้างขึ้นมาเองชั่วคราวเพื่อให้มีหน้าตาและโครงสร้างเหมือนกับข้อมูลจริงที่จะได้รับจากฐานข้อมูลหรือ API ในอนาคตทุกประการ 

ในการทำงานจริง การทำ Mock Data เป็นสิ่งสำคัญมากในการทำงานแบบขนาน (Parallel Development) ระหว่างทีม Backend และ Frontend โดยเมื่อตกลงโครงสร้างข้อมูล (Data Model) กันเรียบร้อยแล้ว ทีม Frontend ก็สามารถสร้าง Mock Data เพื่อนำไปออกแบบและทดสอบระบบแสดงผลบนหน้าจอ (UI) รวมถึงทดสอบการทำงานของ Logic ต่าง ๆ เช่น การค้นหาหรือคัดกรองข้อมูล ได้จนเสร็จสมบูรณ์โดยไม่ต้องหยุดรอให้ฝั่ง Backend สร้างเส้นทาง API (Endpoint) เสร็จ เมื่อ API ตัวจริงพร้อมใช้งาน เราก็สามารถเปลี่ยนจากการดึง Mock Data ไปดึงข้อมูลผ่าน API แทนได้ทันทีโดยแทบไม่ต้องแก้ไขโค้ดที่แสดงผลบนหน้าจอเลย

### ขั้นตอนที่ 1 — สร้าง Mock Data + useState&lt;Equipment[]&gt;

Mock Data คือ array ของ Object ที่สร้างขึ้นแทน API จริง:

```tsx [src/pages/EquipmentPage.tsx — v1]
import { useState } from 'react'
import type { Equipment } from '../types'  // นำเข้า interface จาก wk2-content4

// [1] Mock Data — อุปกรณ์จำลอง 4 รายการ
//     wk4: เปลี่ยนส่วนนี้เป็น useEquipments() Hook แทน
const mockEquipments: Equipment[] = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Notebook', serialNo: 'MB-001', status: 'available',    borrowedBy: null          },
  { id: 2, name: 'iPad Air',        category: 'Tablet',   serialNo: 'IP-001', status: 'borrowed',     borrowedBy: 'สมชาย ใจดี'  },
  { id: 3, name: 'Projector Epson', category: 'AV',       serialNo: 'PJ-001', status: 'maintenance',  borrowedBy: null          },
  { id: 4, name: 'MacBook Pro 13"', category: 'Notebook', serialNo: 'MB-002', status: 'available',    borrowedBy: null          },
]

export function EquipmentPage() {
  // [2] useState<Equipment[]> — กำหนด Type ให้ array
  //     ถ้าใส่ข้อมูลที่ไม่ใช่ Equipment TypeScript แจ้ง Error ทันที
  const [equipments] = useState<Equipment[]>(mockEquipments)

  return (
    <main style={{ padding: 24 }}>
      <h1>รายการอุปกรณ์ ({equipments.length} รายการ)</h1>

      {/* [3] .map() วนแสดงทุกรายการ */}
      <div>
        {equipments.map(eq => (
          <div key={eq.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <strong>{eq.name}</strong>
            <span style={{ marginLeft: 8, color: '#64748b', fontSize: 12 }}>{eq.category} · {eq.serialNo}</span>
            <div style={{ marginTop: 4, fontSize: 12 }}>{eq.status}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

**สรุป:** Mock Data 4 รายการ → `useState<Equipment[]>` เก็บ → `.map()` แสดง ✅

### ขั้นตอนที่ 2 — เพิ่ม Filter ด้วย useState + Array.filter()

```tsx [src/pages/EquipmentPage.tsx — v2 (เพิ่ม filter)]
import { useState } from 'react'
import type { Equipment } from '../types'

const mockEquipments: Equipment[] = [/* เหมือนเดิม */]

// [1] แปลง status เป็นภาษาไทย
const statusLabel: Record<string, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}

export function EquipmentPage() {
  const [equipments]    = useState<Equipment[]>(mockEquipments)
  // [2] filterStatus เก็บว่ากดปุ่มไหน — เริ่มต้นแสดงทั้งหมด
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // [3] กรองรายการตาม filterStatus
  //     ถ้า 'all' → แสดงทั้งหมด
  //     ถ้าเป็นค่าอื่น → กรองเฉพาะที่ status ตรงกัน
  const displayed = filterStatus === 'all'
    ? equipments
    : equipments.filter(eq => eq.status === filterStatus)

  return (
    <main style={{ padding: 24 }}>
      <h1>รายการอุปกรณ์</h1>

      {/* [4] ปุ่ม Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['all', 'available', 'borrowed', 'maintenance'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
              border: 'none',
              cursor: 'pointer',
              fontWeight: filterStatus === s ? 'bold' : 'normal',
              backgroundColor: filterStatus === s ? '#3b82f6' : '#e2e8f0',
              color: filterStatus === s ? 'white' : '#374151',
            }}
          >
            {s === 'all' ? 'ทั้งหมด' : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* [5] แสดงรายการที่กรองแล้ว */}
      <div>
        {displayed.map(eq => (
          <div key={eq.id} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <strong>{eq.name}</strong>
            <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{eq.category} · {eq.serialNo}</span>
            <div style={{ marginTop: 4, fontSize: 12 }}>{statusLabel[eq.status]}</div>
          </div>
        ))}
      </div>
    </main>
  )
}
```

::: tip 💡 Tailwind CSS จะสวยกว่า inline style
Lab นี้ใช้ **inline style** เพราะยังไม่ได้เรียน Tailwind — ใน **wk3** จะเปลี่ยน `style=&#123;&#123; ... &#125;&#125;` ทั้งหมดเป็น Tailwind class `className="..."` ให้ UI สวยขึ้นมาก
:::

### ขั้นตอนที่ 3 — เพิ่ม Badge สีตาม Status

```tsx [เพิ่มสี badge ใน .map()]
// กำหนดสีพื้นหลัง badge ตาม status
const badgeColor: Record<string, string> = {
  available:   '#dcfce7',  // เขียวอ่อน
  borrowed:    '#fee2e2',  // แดงอ่อน
  maintenance: '#fef9c3',  // เหลืองอ่อน
}
const badgeTextColor: Record<string, string> = {
  available:   '#166534',  // เขียวเข้ม
  borrowed:    '#991b1b',  // แดงเข้ม
  maintenance: '#854d0e',  // เหลืองเข้ม
}

// ใช้ใน .map():
<span style={{
  backgroundColor: badgeColor[eq.status],
  color: badgeTextColor[eq.status],
  padding: '2px 8px',
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 'bold',
  marginLeft: 8,
}}>
  {statusLabel[eq.status]}
</span>
```

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้าง component ชื่อ `EquipmentPage` ที่: 1) มี Mock Data array ของ Equipment (id, name, category, serialNo, status, borrowedBy) 2) ใช้ `useState<Equipment[]>` เก็บ array 3) มีปุ่ม filter ตาม status ใช้ `useState<string>` + `Array.filter()` 4) แสดง badge สีต่างกันตาม status ด้วย inline style — ใช้ TypeScript types พร้อม import จาก types/index.ts"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า Mock Data แตกต่างจาก API จริงอย่างไร และทำไมต้องใช้ก่อน wk4
- [ ] บอกได้ว่า `Array.filter()` ต่างจาก `Array.map()` อย่างไร และแต่ละอันคืน array ขนาดอย่างไร
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/pages/EquipmentPage.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: Mock Data + แสดงรายการ (15 นาที)**

- [ ] สร้าง array `mockEquipments: Equipment[]` มีข้อมูลอย่างน้อย 4 รายการ (ครบ 3 status)
- [ ] ใช้ `useState<Equipment[]>(mockEquipments)` เก็บรายการ
- [ ] ใช้ `.map()` แสดงรายการ — ต้องเห็น 4 รายการใน Browser ✅
- [ ] แต่ละรายการแสดง: ชื่อ, category, serialNo, status

**ขั้น 2: Filter ตาม Status (15 นาที)**

- [ ] เพิ่ม `filterStatus` state เริ่มต้น `'all'`
- [ ] สร้างปุ่ม Filter 4 ปุ่ม: ทั้งหมด / ว่าง / ถูกยืม / ซ่อมบำรุง
- [ ] เพิ่ม `displayed` ที่ใช้ `Array.filter()` กรองตาม `filterStatus`
- [ ] กดปุ่ม "ถูกยืม" → แสดงเฉพาะ `status: 'borrowed'` ✅
- [ ] กดปุ่ม "ทั้งหมด" → กลับมาแสดงครบ ✅

**ขั้น 3: Badge สีตาม Status (10 นาที)**

- [ ] สร้าง `badgeColor` และ `badgeTextColor` แบบ `Record<string, string>`
- [ ] เพิ่ม badge แสดง statusLabel พร้อมสีที่ถูกต้องทุกรายการ
- [ ] ต้องเห็น: เขียว=ว่าง · แดง=ถูกยืม · เหลือง=ซ่อม ✅
- [ ] (Bonus) เพิ่มข้อความ "ยืมโดย: ..." แสดงเฉพาะเมื่อ `borrowedBy` ไม่ใช่ null

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk2-lab: equipment list with mock data and filter by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ `useState<Equipment[]>` ไม่ใช่ `useState<any[]>`?
**แนวคำตอบ:** `any[]` ปิด type checking ทั้งหมด เช่น `eq.naem` (พิมพ์ผิด) จะไม่ Error ส่วน `Equipment[]` TypeScript ตรวจสอบทุก property ให้ ถ้า field ไม่มีหรือพิมพ์ผิด Error ทันที ลด Bug ที่ควรเจอตอน runtime มาเจอตอน compile time แทน
:::

::: details ❓ `Array.filter()` ทำงานอย่างไร — ต่างจาก `.map()` ยังไง?
**แนวคำตอบ:** `.map()` แปลงทุก item ให้ได้ array ใหม่ขนาดเท่าเดิม ส่วน `.filter()` เลือกเฉพาะ item ที่ผ่านเงื่อนไข (return true) array ใหม่อาจมีขนาดเล็กกว่า ตัวอย่าง: `equipments.filter(eq => eq.status === 'borrowed')` คืน array เฉพาะ item ที่ status เป็น borrowed
:::

::: details ❓ ทำไม Mock Data ถึงสำคัญในงาน Frontend?
**แนวคำตอบ:** Parallel Development — Frontend และ Backend ทำงานพร้อมกันได้โดยไม่รอกัน Frontend ใช้ Mock Data พัฒนา UI ให้เสร็จก่อน เมื่อ API พร้อมแค่เปลี่ยนแหล่งข้อมูล (wk4) UI ไม่ต้องแก้ นอกจากนี้ยังง่ายต่อการทดสอบเพราะควบคุมข้อมูลได้ 100%
:::

::: details ❓ `as const` หลัง array ใน .map() คืออะไร?
**แนวคำตอบ:** `(['all', 'available', ...] as const)` บอก TypeScript ว่า array นี้เป็น readonly tuple ไม่ใช่ `string[]` ธรรมดา ทำให้ TypeScript รู้ค่าที่แน่นอนของแต่ละ element เหมาะใช้กับ literal values เช่น status ที่มีค่าแน่นอน
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| Mock Data Object ขาด field แล้ว TypeScript Error | `Equipment` interface ต้องการ field ครบ ได้แก่ `borrowedBy` | เพิ่ม `borrowedBy: null` ในทุก object ที่ยังว่างอยู่ |
| กดปุ่ม filter แล้วรายการไม่เปลี่ยน | ใช้ `equipments` แทน `displayed` ใน `.map()` | เปลี่ยน `{equipments.map(...)}` เป็น `{displayed.map(...)}` |
| Badge สีไม่แสดง / แสดงเป็น undefined | key ใน `badgeColor` ไม่ตรงกับค่า `status` จริง | ตรวจสอบว่า key ใน Record ตรงกับค่า `EquipmentStatus` ทุกตัว |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Mock Data ครบ | ข้อมูลครบทุก field, ครบ 3 status | บาง field ขาด | ไม่มี Mock Data |
| Filter ทำงาน | กดปุ่มแล้วกรองถูกต้องทุก status | กรองได้บางส่วน | ไม่มี filter |
| Badge สีถูกต้อง | เขียว/แดง/เหลืองถูกทุกรายการ | มีบางสถานะ | ไม่มี badge |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Mock Data` | มอค เด-ต้า | ข้อมูลจำลองใช้แทน API จริงในระหว่างพัฒนา |
| `Array.filter()` | แอ-เรย์ ฟิล-เตอร์ | กรอง array คืน array ใหม่เฉพาะ item ที่ผ่านเงื่อนไข |
| `Record<K, V>` | เร-เคิร์ด | TypeScript type สำหรับ object ที่ key เป็น K และ value เป็น V |
| `Parallel Development` | แพ-เรล-เลล ดี-เวล-อ็อป-เมนท์ | Frontend และ Backend พัฒนาพร้อมกันโดยไม่รอกัน |
| `as const` | แอส คอนสต์ | บอก TypeScript ว่าค่านี้เป็น literal ที่แน่นอน ไม่เปลี่ยนแปลง |
| `Array` | แอ-เรย์ | โครงสร้างข้อมูลที่เก็บหลายค่าเรียงลำดับ เข้าถึงด้วย index |
| `inline style` | อิน-ไลน์ สไตล์ | กำหนด CSS ผ่าน `style=&#123;&#123; &#125;&#125;` ใน JSX โดยตรง (ก่อนใช้ Tailwind) |
