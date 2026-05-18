# Tailwind CSS — จาก inline style สู่ Utility Classes <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** บทนี้สอนติดตั้ง Tailwind CSS v3 และแปลง inline style เป็น utility classes พร้อม pattern `statusConfig` สำหรับจัดการสีตาม status ความรู้นี้ใช้ทุก wk ตั้งแต่ wk3 เป็นต้นไปในทุก component ของโปรเจกต์

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ใน wk2 เขียน `style=&#123;&#123; backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 12 &#125;&#125;` ทุกครั้งที่ต้องการ badge สีเขียว — ถ้าต้องการเปลี่ยนสีทีหลัง ต้องค้นหาและแก้ทุกที่ในไฟล์ นอกจากนี้ code ยาว อ่านยาก และถ้ามีหลาย Component แก้แล้วไม่ตรงกัน UI พัง — จะจัดการ Style อย่างไรให้ clean ขึ้น?
:::

> 💡 **เปรียบเทียบ:** Tailwind CSS เหมือน "ชุดสีสำเร็จรูป" ของนักออกแบบ — แทนที่จะผสมสีใหม่ทุกครั้ง แค่บอกว่า `green-100` หรือ `red-500` Tailwind รู้ว่าสีนั้นคืออะไรเลย ประหยัดเวลา และทุก component ใช้ "ภาษาสี" เดียวกัน

## 📖 I: Information

### ขั้นตอนที่ 1 — ทำความรู้จักและติดตั้ง Tailwind CSS

ในการพัฒนาเว็บไซต์แบบดั้งเดิม เรามักจะเขียน HTML เพื่อกำหนดโครงสร้าง และสลับไปเขียนไฟล์ CSS แยกต่างหากเพื่อตกแต่งความสวยงาม ซึ่งเมื่อโปรเจกต์ใหญ่ขึ้น ไฟล์ CSS มักจะยาวเหยียด ค้นหายาก และชื่อ Class มักจะซ้ำซ้อนกัน

**Tailwind CSS** พลิกโฉมแนวคิดนี้ด้วยการนำเสนอ **Utility-First CSS** ซึ่งเปรียบเสมือนกล่องเครื่องมือที่เตรียม "คำสั่งตกแต่งขนาดเล็ก (Utility Classes)" ไว้ให้เราเรียกใช้ได้ทันทีในโค้ด HTML (หรือ JSX) เช่น `text-center` (จัดกลาง), `text-red-500` (ตัวอักษรสีแดง), `p-4` (เพิ่มช่องว่างด้านใน) ทำให้เราไม่ต้องตั้งชื่อ Class ใหม่ หรือสลับหลบไปมาให้ปวดหัว ข้อดีที่สำคัญที่สุดคือโค้ดจะเล็กลงมาก เพราะ Tailwind จะสกัดเอาเฉพาะ Class ที่เราเรียกใช้จริง ๆ ไปรวมสั้น ๆ ไว้ในเว็บที่จะนำไปใช้งานจริง (Production) เท่านั้น

ก่อนเริ่มใช้งาน เราต้องติดตั้ง Tailwind CSS เข้าไปในโปรเจกต์ Vite ของเราก่อน:

::: code-group
```bash [ติดตั้ง]
# [1] ติดตั้ง Tailwind CSS v3 + PostCSS + Autoprefixer
npm install -D tailwindcss@3 postcss autoprefixer

# [2] สร้างไฟล์ config ทั้ง 2 ไฟล์อัตโนมัติ (tailwind.config.js + postcss.config.js)
npx tailwindcss init -p
```

```js [tailwind.config.js]
// [3] บอก Tailwind ให้ scan ไฟล์ไหนบ้าง — เพื่อลบ class ที่ไม่ได้ใช้ออกจาก build
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',   // [4] ครอบคลุมทุก component ใน src/
  ],
  theme: {
    extend: {
      fontFamily: {
        // [5] เพิ่ม font ภาษาไทย — ต้องโหลด Sarabun ใน index.html ด้วย
        sans: ['Sarabun', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

```css [src/index.css]
/* [6] นำเข้า Tailwind 3 ชั้น — ต้องมีครบทั้ง 3 บรรทัด */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* [7] ตั้งค่า Font ภาษาไทย ผ่าน @layer base */
@layer base {
  body {
    font-family: 'Sarabun', 'Segoe UI', system-ui, sans-serif;
  }
}
```
:::

**สรุปการทำงาน:** 3 คำสั่ง → 3 ไฟล์ → Tailwind พร้อมใช้ใน JSX ✅

### ขั้นตอนที่ 2 — แปลง inline style → Tailwind class

เปรียบเทียบ code จาก wk2 (inline style) กับ wk3 (Tailwind):

::: code-group
```tsx [✅ wk3 — Tailwind class (อ่านง่าย)]
// Equipment card ด้วย Tailwind
<div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
  <strong className="font-bold text-slate-800">{eq.name}</strong>
  <span className="text-xs text-slate-500 ml-2">{eq.category} · {eq.serialNo}</span>
  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
    ว่าง
  </span>
</div>
```

```tsx [❌ wk2 — inline style (ยาว อ่านยาก)]
// Equipment card ด้วย inline style — แบบเดิมจาก wk2
<div style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', padding: 12, marginBottom: 8 }}>
  <strong>{eq.name}</strong>
  <span style={{ marginLeft: 8, color: '#64748b', fontSize: 12 }}>{eq.category} · {eq.serialNo}</span>
  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 'bold', marginLeft: 8 }}>
    ว่าง
  </span>
</div>
```

```tsx [💡 ตารางเทียบ inline → Tailwind]
// ตัวอย่างการแปลงทีละ property:
//
// inline style                          Tailwind class
// ─────────────────────────────────     ────────────────────────
// background: 'white'                → bg-white
// borderRadius: 8                    → rounded-lg   (8px)
// borderRadius: 12                   → rounded-xl   (12px)
// border: '1px solid #e2e8f0'       → border border-slate-200
// padding: 12                        → p-3           (12px = 0.75rem)
// padding: '4px 12px'               → py-1 px-3
// marginLeft: 8                      → ml-2
// fontSize: 12                       → text-xs
// fontWeight: 'bold'                 → font-bold
// color: '#64748b'                   → text-slate-500
// color: '#166534'                   → text-green-700
// backgroundColor: '#dcfce7'         → bg-green-100
// display: 'flex', gap: 8           → flex gap-2
// boxShadow: ...                     → shadow-sm / shadow-md
```
:::

::: tip 💡 จำง่าย — ระบบขนาดของ Tailwind
`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px
ทุกหน่วยคูณ 4px — ใช้ 1-4 สำหรับ spacing ทั่วไป, 6-8 สำหรับ padding ใหญ่
:::

### ขั้นตอนที่ 3 — statusConfig Pattern + Responsive Grid

Pattern สำคัญในโปรเจกต์: แทนที่จะใช้ `if/else` เลือกสี ให้สร้าง object `statusConfig` รวม class ทั้งหมดของแต่ละ status ไว้ด้วยกัน:

```tsx [src/pages/EquipmentPage.tsx — v3 (Tailwind + statusConfig)]
import { useState } from 'react'
import type { Equipment } from '../types'

const mockEquipments: Equipment[] = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Notebook', serialNo: 'MB-001', status: 'available',   borrowedBy: null         },
  { id: 2, name: 'iPad Air',        category: 'Tablet',   serialNo: 'IP-001', status: 'borrowed',    borrowedBy: 'สมชาย ใจดี' },
  { id: 3, name: 'Projector Epson', category: 'AV',       serialNo: 'PJ-001', status: 'maintenance', borrowedBy: null         },
  { id: 4, name: 'MacBook Pro 13"', category: 'Notebook', serialNo: 'MB-002', status: 'available',   borrowedBy: null         },
]

const statusLabel: Record<string, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}

// [1] statusConfig — รวม Tailwind classes ตามสถานะไว้ที่เดียว
//     เปลี่ยนสีทีเดียวมีผลทุกการ์ดในหน้า
const statusConfig: Record<string, { border: string; badge: string }> = {
  available:   { border: 'border-l-green-500', badge: 'bg-green-100 text-green-700'   },
  borrowed:    { border: 'border-l-red-500',   badge: 'bg-red-100 text-red-700'       },
  maintenance: { border: 'border-l-amber-500', badge: 'bg-amber-100 text-amber-700'  },
}

export function EquipmentPage() {
  const [equipments] = useState<Equipment[]>(mockEquipments)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const displayed = filterStatus === 'all'
    ? equipments
    : equipments.filter(eq => eq.status === filterStatus)

  return (
    // [2] max-w-6xl mx-auto — จำกัดความกว้าง, px-6 py-8 — padding
    <main className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">รายการอุปกรณ์</h1>

      {/* [3] Filter Buttons */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'available', 'borrowed', 'maintenance'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterStatus === s
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s === 'all' ? 'ทั้งหมด' : statusLabel[s]}
          </button>
        ))}
      </div>

      {/* [4] Responsive Grid — 1 คอลัมน์บนมือถือ, 2 บน sm, 3 บน lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map(eq => {
          // [5] ดึง config ของ status นี้ออกมาใช้
          const config = statusConfig[eq.status]

          return (
            // [6] Template literal รวม static class + dynamic class จาก config
            <div
              key={eq.id}
              className={`bg-white rounded-xl border border-slate-200 border-l-4 ${config.border} p-4 shadow-sm hover:shadow-md transition-all`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="font-bold text-slate-800 text-sm">{eq.name}</span>
                {/* [7] badge ใช้ class จาก config.badge — เปลี่ยนสีตาม status */}
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${config.badge}`}>
                  {statusLabel[eq.status]}
                </span>
              </div>

              {/* รายละเอียด */}
              <p className="text-xs text-slate-500">{eq.category} · {eq.serialNo}</p>

              {/* [8] แสดงชื่อผู้ยืมเฉพาะเมื่อ borrowedBy ไม่ใช่ null */}
              {eq.borrowedBy && (
                <p className="text-xs text-red-500 font-semibold mt-1">ยืมโดย: {eq.borrowedBy}</p>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}
```

**สรุปการทำงาน:**
- `statusConfig` → เก็บ Tailwind class ตาม status ไว้ที่เดียว แก้ที่เดียวมีผลทุกการ์ด ✅
- Template literal `` `static-class ${dynamic}` `` → รวม class คงที่กับ class แบบ dynamic ✅
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` → Responsive โดยไม่เขียน Media Query ✅

::: warning ⚠️ Dynamic class ต้องเขียนให้ครบในไฟล์ ts/tsx
Tailwind ต้องเห็น class name เต็มในซอร์สโค้ด จึงจะ include ไว้ใน build
`border-l-${color}-500` ❌ (Tailwind หา class ไม่เจอ)
`border-l-green-500` ✅ (เขียนครบ — Tailwind เจอ)
ดังนั้นใน `statusConfig` ต้องเขียนชื่อ class เต็มทุกตัว
:::

#### 🔷 TypeScript ในบทนี้

บทนี้ใช้ TypeScript features ต่อไปนี้:

```tsx [TypeScript ที่ใช้ในบทนี้]
// [1] Record<K, V> — object ที่ key เป็น K, value เป็น V
//     ใช้กำหนด type ของ statusConfig และ statusLabel
const statusConfig: Record<string, { border: string; badge: string }> = { ... }

// [2] as const — ทำให้ TypeScript อ่าน array เป็น tuple ที่ค่าคงที่
(['all', 'available', 'borrowed', 'maintenance'] as const).map(...)

// [3] Template literal type — รวม string คงที่กับ dynamic string
//     TypeScript อนุมาน type ให้อัตโนมัติใน JSX className
const cls = `bg-white ${config.border}` // string

// [4] useState<Equipment[]> — Generic type กำหนดว่า state เป็น array ของ Equipment
const [equipments] = useState<Equipment[]>(mockEquipments)
```

**สรุป:** `Record<string, T>` ใช้บ่อยมากใน Tailwind pattern เพื่อ map status → class names ✅

## 🛠️ A: Application

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า `statusConfig` pattern แก้ปัญหา if/else อย่างไร และทำไมต้องเขียน class name เต็มในซอร์สโค้ด
- [ ] บอกได้ว่า `sm:grid-cols-2` หมายถึงอะไร และ Tailwind Mobile-First ทำงานอย่างไร
:::

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript + Tailwind CSS v3 อยู่ มี component EquipmentPage ที่ใช้ inline style ทั้งหมด ช่วยแปลงเป็น Tailwind class โดย: 1) แสดงการ์ดด้วย `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` 2) สร้าง statusConfig object ที่รวม class ของ border และ badge แต่ละ status ไว้ด้วยกัน 3) ใช้ template literal รวม static กับ dynamic class — ห้ามใช้ dynamic interpolation เช่น `border-l-${color}-500` เพราะ Tailwind หา class ไม่เจอ"
:::

### 📝 PjBL Lab — ชิ้นงาน: `EquipmentPage.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `EquipmentPage.tsx` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ท้าย Component ✅

**ขั้น 1: ติดตั้ง Tailwind CSS (10 นาที)**

- [ ] รัน `npm install -D tailwindcss@3 postcss autoprefixer` ในโปรเจกต์
- [ ] รัน `npx tailwindcss init -p` สร้าง config
- [ ] แก้ `tailwind.config.js` ใส่ `content: ['./index.html', './src/**/*.{ts,tsx}']`
- [ ] เปิด `src/index.css` เพิ่ม 3 บรรทัด `@tailwind base/components/utilities`
- [ ] ทดสอบ: เพิ่ม `className="text-blue-500"` ที่ h1 ใด ๆ → ต้องเห็นสีน้ำเงิน ✅

**ขั้น 2: แปลง inline style → Tailwind class (20 นาที)**

- [ ] เปิด `EquipmentPage.tsx` (จาก wk2)
- [ ] แปลง `style=&#123;&#123; padding: 24 &#125;&#125;` ที่ `<main>` → `className="px-6 py-8 max-w-6xl mx-auto"`
- [ ] แปลง `style=&#123;&#123; ... &#125;&#125;` ของ filter buttons → Tailwind class ให้ครบ
- [ ] แปลง `style=&#123;&#123; border: '1px solid #e2e8f0', ... &#125;&#125;` ของ card → Tailwind class
- [ ] ลบ `badgeColor` และ `badgeTextColor` objects เดิมออก
- [ ] ตรวจสอบ: ไม่มี `style=&#123;&#123; ... &#125;&#125;` เหลืออยู่ใน file ✅

**ขั้น 3: statusConfig + Responsive Grid (15 นาที)**

- [ ] สร้าง `statusConfig` object แบบ `Record<string, { border: string; badge: string }>` ใส่ class ของทั้ง 3 status
- [ ] แก้ JSX ให้ใช้ `const config = statusConfig[eq.status]` แล้วใช้ `config.border` + `config.badge`
- [ ] เปลี่ยน wrapper ของรายการจาก `<div>` ธรรมดาเป็น `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">`
- [ ] ทดสอบ Responsive: ลากขนาด browser → ต้องเห็น layout เปลี่ยนที่ 640px และ 1024px ✅
- [ ] (Bonus) เพิ่ม `hover:shadow-md hover:-translate-y-0.5 transition-all` ที่การ์ด

**ขั้นสุดท้าย: Submit**

- [ ] `git add src/pages/EquipmentPage.tsx tailwind.config.js src/index.css && git commit -m "wk3: convert inline styles to Tailwind, add statusConfig and responsive grid"` → `git push`
- [ ] เขียนสรุปใน Google Doc: Tailwind คืออะไร, ทำไม statusConfig ถึงดีกว่า if/else, dynamic class ใน template literal ทำงานยังไง พร้อม screenshot UI ที่ตรวจสอบ Responsive แล้ว + ลิงก์ repo

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ Tailwind CSS ต่างจาก CSS ปกติ (เช่น `.card { ... }`) อย่างไร?
**แนวคำตอบ:** CSS ปกติสร้าง class name ที่เป็น global — ถ้าชื่อซ้ำกัน style ทับกัน (CSS Specificity conflict) ส่วน Tailwind ใช้ utility classes เล็กๆ ที่ scope ไว้กับ element โดยตรง ไม่มี global name ดังนั้นไม่มี naming conflict นอกจากนี้ Tailwind ลบ class ที่ไม่ได้ใช้ออกจาก production build อัตโนมัติ (PurgeCSS) ทำให้ CSS ขนาดเล็กมาก
:::

::: details ❓ ทำไมต้องสร้าง statusConfig เป็น object แทนที่จะใช้ if/else?
**แนวคำตอบ:** `statusConfig` รวม "กลุ่มของ class" ต่อ status ไว้ที่เดียว — ถ้าต้องการเปลี่ยนสีแก้แค่จุดเดียว ทุกการ์ดในหน้าเปลี่ยนตาม ต่างจาก `if/else` ที่ต้องแก้หลายที่และอาจลืม นอกจากนี้ยัง readable กว่า เพราะ `config.border` บอกความหมายชัดกว่า string ยาวๆ ใน template literal
:::

::: details ❓ `sm:grid-cols-2` หมายความว่าอะไร และ `sm:` คืออะไร?
**แนวคำตอบ:** `sm:` คือ **responsive prefix** ของ Tailwind — หมายถึง "ใช้ class นี้เมื่อหน้าจอกว้าง ≥ 640px" `sm:grid-cols-2` จึงหมายถึง "2 คอลัมน์เมื่อหน้าจอ ≥ 640px" ส่วน `grid-cols-1` (ไม่มี prefix) ใช้กับทุกขนาดหน้าจอรวมถึงมือถือ Tailwind ใช้ Mobile-First: class ที่ไม่มี prefix ใช้กับขนาดเล็กสุด, prefix ใช้เฉพาะขนาดนั้นขึ้นไป
:::

::: details ❓ ทำไม `border-l-${color}-500` ถึงไม่ทำงาน ต้องเขียนอย่างไร?
**แนวคำตอบ:** Tailwind สแกน source code ในขั้นตอน build เพื่อหา class ที่ใช้จริง ถ้าเขียน dynamic interpolation เช่น `` `border-l-${color}-500` `` Tailwind มองไม่เห็น class เต็ม จึงไม่ include ไว้ใน CSS ผลคือ style ไม่แสดง วิธีแก้คือเขียน class เต็มในซอร์สโค้ดเสมอ เช่น `'border-l-green-500'` หรือ `'border-l-red-500'` แล้วค่อย map ด้วย object ตาม key
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| Tailwind class ใส่แล้วสีไม่เปลี่ยน | ไม่ได้เพิ่ม `@tailwind` directives ใน `index.css` หรือ `content` ใน config ไม่ครอบคลุมไฟล์ | ตรวจสอบ `src/index.css` มีครบ 3 บรรทัด และ `tailwind.config.js` มี `'./src/**/*.{ts,tsx}'` |
| Dynamic class ไม่ทำงาน เช่น `border-l-${color}-500` | Tailwind ต้องเห็น class name เต็มใน build step | เปลี่ยนเป็น object map: `statusConfig` ที่มี class name เต็มทุกตัว |
| `grid-cols-2` ไม่ responsive | ใส่ `grid-cols-2` เพียวๆ โดยไม่มี prefix | ใช้ `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` ตาม Mobile-First pattern |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Tailwind ติดตั้ง | config ถูกต้อง, style แสดงใน browser | ติดตั้งแต่ style ไม่แสดง | ยังไม่ได้ติดตั้ง |
| แปลง inline → Tailwind | ไม่มี style=&#123;&#123; &#125;&#125; เหลือเลย | แปลงบางส่วน | ยังใช้ inline style ทั้งหมด |
| statusConfig + Grid | object ครบ 3 status, responsive ทำงาน | มีแต่ไม่ครบ | ใช้ if/else หรือไม่มี responsive |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Utility-First CSS` | ยู-ทิล-ลิ-ตี้ เฟิร์สต์ ซีเอสเอส | แนวคิดใช้ class เล็กๆ สำเร็จรูปต่อกันใน HTML แทนเขียน CSS เอง |
| `Tailwind` | เทล-วินด์ | CSS framework แบบ Utility-First ที่ใช้ class ตรงใน JSX |
| `className` | คลาส-เนม | prop ของ JSX element สำหรับใส่ CSS class (แทน `class` ใน HTML) |
| `Responsive Prefix` | รี-สพอน-ซีฟ พรี-ฟิกซ์ | `sm:` `md:` `lg:` — บอก Tailwind ว่าใช้ class นี้เมื่อหน้าจอกว้างแค่ไหน |
| `Mobile-First` | โมบาย-เฟิร์สต์ | ออกแบบสำหรับมือถือก่อน แล้วขยายสำหรับหน้าจอใหญ่ด้วย prefix |
| `PurgeCSS` | เพิร์จ-ซีเอสเอส | กระบวนการลบ Tailwind class ที่ไม่ได้ใช้ออกจาก production bundle |
| `Template Literal` | เทม-เพลท ลิท-เทอ-รัล | `` `static ${dynamic}` `` รวม string คงที่กับตัวแปรใน JavaScript |
| `Indexed Access Type` | อิน-เด็กซ์ด แอก-เซส ไทพ์ | `Type['field']` — ดึง type ของ field ออกมาใช้ซ้ำใน TypeScript |
| `border-l-4` | บอร์-เดอร์-แอล-โฟร์ | Tailwind: ขอบซ้ายหนา 4px — ใช้สร้าง accent bar สีบนการ์ด |
