# จัดหน้าจอด้วย Tailwind CSS <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
**สถานการณ์:** ทีมพัฒนาระบบเบิก-จ่ายอุปกรณ์ไอที ต้องการแสดงการ์ดอุปกรณ์แต่ละชิ้นให้มีสีขอบต่างกันตามสถานะ (พร้อมใช้ = เขียว, ถูกยืม = แดง, ซ่อมบำรุง = เหลือง) แต่เขียน CSS แยกไฟล์แล้วชื่อ class ชนกัน แก้ที่หนึ่งพัง อีกที่หนึ่ง — จะแก้ปัญหาได้อย่างไร?
:::

> 💡 **เปรียบเทียบ:** Tailwind CSS เหมือนชุดเครื่องมือช่าง ที่มีอุปกรณ์พร้อมใช้ครบทุกชิ้น แทนที่จะต้องสร้างเครื่องมือเองทุกครั้ง แค่หยิบมาใช้ได้เลย เช่น `bg-green-500` แทนที่จะเขียน `background-color: #22c55e` ทุกครั้ง

---

## 📖 I: Information

### Tailwind CSS คืออะไร?

Tailwind CSS เป็น **Utility-First CSS Framework** — แทนที่จะสร้าง class เอง เราใช้ class สำเร็จรูปขนาดเล็กๆ ต่อกันใน HTML/JSX โดยตรง ทำให้ไม่มีปัญหา CSS ชนกันและง่ายต่อการดูแล

### การติดตั้งกับ Vite

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

แก้ไข `tailwind.config.js` ให้ scan ไฟล์ของเรา:

```js
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

เพิ่มใน `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Grid Layout สำหรับแสดงการ์ดอุปกรณ์

::: code-group

```tsx [EquipmentCard.tsx]
// EquipmentCard ด้วย Tailwind CSS
interface EquipmentCardProps {
  name: string
  category: string
  serialNo: string
  status: 'available' | 'borrowed' | 'maintenance'
}

export function EquipmentCard({ name, category, serialNo, status }: EquipmentCardProps) {
  // Map สี border ตามสถานะ — TypeScript จะตรวจสอบให้ว่า key ถูกต้อง
  const borderColor: Record<EquipmentCardProps['status'], string> = {
    available: 'border-l-green-500',
    borrowed: 'border-l-red-500',
    maintenance: 'border-l-amber-500',
  }

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 border-l-4 ${borderColor[status]} p-4 shadow-sm hover:shadow-md transition-all`}
    >
      <h3 className="font-bold text-slate-800">{name}</h3>
      <p className="text-xs text-slate-500">{category} · {serialNo}</p>
    </div>
  )
}
```

```tsx [EquipmentGrid.tsx]
// วาง EquipmentCard ลงใน Grid — Responsive ด้วย Tailwind
import { EquipmentCard } from './EquipmentCard'

const mockEquipments = [
  { id: 1, name: 'MacBook Pro 14"', category: 'Laptop', serialNo: 'MBP-001', status: 'available' as const },
  { id: 2, name: 'iPad Pro 11"',    category: 'Tablet',  serialNo: 'IPD-002', status: 'borrowed' as const },
  { id: 3, name: 'HDMI Switcher',   category: 'Adapter', serialNo: 'ADP-003', status: 'maintenance' as const },
]

export function EquipmentGrid() {
  return (
    // sm: = 640px+  lg: = 1024px+  ทำ Responsive ด้วย prefix
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {mockEquipments.map(eq => (
        <EquipmentCard key={eq.id} {...eq} />
      ))}
    </div>
  )
}
```

:::

::: tip 💡 TypeScript Tip — Form Data Types
`EquipmentCardProps['status']` คือการดึง type ของ field `status` ออกมาใช้ซ้ำ เรียกว่า **Indexed Access Type** ทำให้ `Record<..., string>` รู้ว่า key ที่ถูกต้องคือ `'available' | 'borrowed' | 'maintenance'` เท่านั้น — ถ้าพิมพ์ผิด TypeScript จะขีดเส้นแดงทันที
:::

### Responsive Classes ที่ใช้บ่อย

| Class | ความหมาย |
|---|---|
| `grid-cols-1` | 1 คอลัมน์ (มือถือ) |
| `sm:grid-cols-2` | 2 คอลัมน์ เมื่อหน้าจอ ≥ 640px |
| `lg:grid-cols-3` | 3 คอลัมน์ เมื่อหน้าจอ ≥ 1024px |
| `hover:shadow-md` | เพิ่มเงาเมื่อ hover |
| `transition-all` | animation smooth ทุก property |

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"มี React component ชื่อ EquipmentCard อยู่ ช่วยจัด style ด้วย Tailwind CSS ให้สีขอบซ้ายเปลี่ยนตาม prop `status` โดยใช้: available (เขียว), borrowed (แดง), maintenance (amber) และใช้ TypeScript ด้วย"
:::

### 📝 PjBL Lab

- [ ] ติดตั้ง Tailwind CSS ในโปรเจกต์ `equipment-system`
- [ ] สร้าง `src/components/EquipmentCard.tsx` และใส่ props ตาม interface ที่กำหนด
- [ ] ทดสอบสีขอบ 3 สถานะโดยเปลี่ยน `status` prop ใน mockup
- [ ] สร้าง `EquipmentGrid` ที่ใช้ Grid Layout แบบ Responsive (1/2/3 คอลัมน์)
- [ ] เปิด DevTools ลาก browser window ดูว่า Responsive ทำงานถูกต้อง

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Tailwind ถึงดีกว่าเขียน CSS เอง?
**แนวคำตอบ:** Tailwind ป้องกัน CSS naming conflict เพราะไม่มี global class name — style อยู่ที่ element นั้นโดยตรง นอกจากนี้ยังลบ CSS ที่ไม่ใช้ออกอัตโนมัติ (PurgeCSS) ทำให้ไฟล์เล็กลงมาก
:::

::: details ❓ `border-l-green-500` แตกต่างจาก `border-green-500` อย่างไร?
**แนวคำตอบ:** `border-l-` ใช้สีกับขอบด้านซ้าย (left) เท่านั้น ในขณะที่ `border-` ใช้กับทุกด้าน การใช้ `border-l-4` ร่วมกับ `border-l-green-500` จึงสร้าง accent bar ด้านซ้ายของการ์ด
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
|---|---|---|---|
| Tailwind ติดตั้งและทำงานได้ | ครบทุกขั้นตอน, config ถูก | ติดตั้งแล้วแต่ style ไม่แสดง | ยังไม่ติดตั้ง |
| EquipmentCard interface | กำหนด type status ถูกต้อง | มี interface แต่ type หลวม | ไม่มี interface |
| Responsive Grid | ทำงานทั้ง 3 breakpoint | ทำได้บางส่วน | ไม่มี responsive |

---

### 📚 CLIL Vocabulary

| Term | Meaning |
|---|---|
| Utility-First | แนวคิดใช้ class เล็กๆ ต่อกันแทนการตั้งชื่อ component |
| Breakpoint | จุดที่ layout เปลี่ยนตามขนาดหน้าจอ (sm, md, lg) |
| Responsive Design | การออกแบบที่ปรับตัวได้ตามขนาดหน้าจอ |
| PurgeCSS | กระบวนการลบ CSS ที่ไม่ถูกใช้ออกจาก bundle |
| Transition | animation ที่เกิดเมื่อ CSS property เปลี่ยนค่า |
