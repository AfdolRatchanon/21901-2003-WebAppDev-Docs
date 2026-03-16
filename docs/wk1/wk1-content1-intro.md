# โครงสร้าง React + ตั้งค่า Vite + TypeScript <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
**ระบบเบิก-จ่ายอุปกรณ์ไอที** ของโรงเรียนยังใช้กระดาษบันทึก ทำให้ไม่รู้ว่าอุปกรณ์ชิ้นไหนถูกยืมไปแล้ว ใครยืม และคืนหรือยัง วิชานี้เราจะสร้างเว็บแอปพลิเคชันแก้ปัญหานี้ด้วย **React + TypeScript + Vite** — แต่ก่อนเริ่มสร้างต้องเข้าใจโครงสร้างพื้นฐานก่อน
:::

> 💡 **เปรียบเทียบ:** React Component เหมือน "แบบฟอร์มสำเร็จรูป" — ออกแบบหน้าตาครั้งเดียว ใช้ซ้ำได้หลายครั้ง แต่ละครั้งกรอกข้อมูลต่างกันได้ เช่น การ์ดอุปกรณ์แต่ละชิ้น

---

## 📖 I: Information

### ทำไมต้องใช้ React + TypeScript + Vite?

การพัฒนาเว็บแอปพลิเคชันในโลกยุคปัจจุบัน เมื่อโปรเจกต์มีขนาดใหญ่ขึ้น การเขียนเพียง HTML, CSS, และ JavaScript แบบดั้งเดิมจะทำให้การจัดการโค้ดทำได้ยากและซับซ้อน การนำเทคโนโลยีอย่าง React, TypeScript, และ Vite มาใช้ร่วมกัน จะเข้ามาช่วยแก้ปัญหาดังกล่าวได้อย่างทรงพลัง:

- **React:** เป็นไลบรารียอดนิยมของ JavaScript ที่โฟกัสไปที่การสร้าง User Interface (UI) ด้วยแนวคิด "Component" ที่เปรียบเหมือนการแยกหน้าเว็บเป็นชิ้นส่วนย่อย ๆ (เช่น Navbar, ปุ่มกด, การ์ดแสดงข้อมูล) ทำให้เรานำกลับมาใช้ใหม่ได้อย่างอิสระ มีโครงสร้างที่เป็นระเบียบ และลดโค้ดที่ซ้ำซ้อน
- **TypeScript:** เป็นภาษาที่ยกระดับขีดความสามารถของ JavaScript ด้วยการเพิ่ม "ประเภทข้อมูล (Static Type)" ช่วยให้ผู้พัฒนาตรวจเจอข้อผิดพลาดของโค้ด (Bug/Error) ได้ทันทีตั้งแต่ตอนเริ่มพิมพ์ใน Editor ไม่ต้องรอไปเจอตอนโปรแกรมรัน (Runtime) เปรียบเหมือนมีผู้ช่วยคอยตรวจสอบความถูกต้องตลอดเวลา
- **Vite:** เป็นเครื่องมือช่วยแพ็คเกจและสร้าง (Build tool) โปรเจกต์ยุคใหม่ที่มีความเร็วสูงมาก จุดเด่นคือระบบ "Hot Module Replacement (HMR)" ซึ่งช่วยสะท้อนผลลัพธ์การแก้ไขโค้ดที่บนเบราว์เซอร์ให้เห็นแบบทันที (Real-time) ภายในเสี้ยววินาทีเมื่อกดบันทึกไฟล์ โดยที่เราไม่จำเป็นต้องกดปุ่มรีเฟรชหน้าเว็บแต่อย่างใด

| เครื่องมือ | หน้าที่ | เปรียบเทียบ |
| :--- | :--- | :--- |
| **React** | สร้าง UI โดยแบ่งเป็น Component ย่อย ๆ | เหมือน LEGO — ต่อบล็อกชิ้นเล็ก ๆ เป็นหน้าเว็บ |
| **TypeScript** | เพิ่ม Type Safety ให้ JavaScript | เหมือน spell checker — แจ้งเตือนก่อน Error จริง |
| **Vite** | Build tool ที่เร็วมาก มี Hot Reload | เหมือนดู preview document แบบ real-time |

---

### ขั้นตอนที่ 1 — สร้างโปรเจกต์ใหม่

เปิด Terminal แล้วรันคำสั่ง:

```bash
npm create vite@latest my-equipment-system -- --template react-ts
```

> `--template react-ts` บอก Vite ให้สร้างโปรเจกต์ React + TypeScript ทันที ไม่ต้องเลือกเอง

Terminal จะแสดงผล:

```
✔ Project name: my-equipment-system
✔ Package name: my-equipment-system
✔ Select a framework: React
✔ Select a variant: TypeScript

Scaffolding project in ./my-equipment-system...
Done. Now run:
  cd my-equipment-system
  npm install
  npm run dev
```

รันตามที่แนะนำ:

```bash
cd my-equipment-system
npm install       # ติดตั้ง packages (~30 วินาที)
npm run dev       # รัน development server
```

ถ้าสำเร็จ Terminal จะแสดง:

```
  VITE v5.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

เปิด Browser ที่ `http://localhost:5173/` จะเห็นหน้า React ตัวอย่าง ✅

---

### ขั้นตอนที่ 2 — เข้าใจโครงสร้างโฟลเดอร์

หลังจากสร้างโปรเจกต์ จะได้โครงสร้างนี้:

```
my-equipment-system/
├── public/              ← ไฟล์ static (รูปภาพ, favicon)
├── src/                 ← โค้ดทั้งหมดของเราอยู่ที่นี่
│   ├── assets/          ← รูปภาพ, icons ที่ใช้ใน component
│   ├── App.tsx          ← Component หลัก — แก้ไขที่นี่บ่อยที่สุด
│   ├── App.css          ← CSS เฉพาะ App component
│   ├── index.css        ← CSS global (ใช้ทั้งแอป)
│   └── main.tsx         ← Entry point — จุดแรกที่แอปเริ่มทำงาน
├── index.html           ← HTML template (มี <div id="root"> ข้างใน)
├── package.json         ← รายชื่อ packages และ npm scripts
├── tsconfig.json        ← การตั้งค่า TypeScript
└── vite.config.ts       ← การตั้งค่า Vite
```

::: tip 💡 โฟลเดอร์ `src/` สำคัญที่สุด
เกือบทุกอย่างที่เราเขียนจะอยู่ใน `src/` เท่านั้น ไม่ต้องแตะไฟล์อื่นในช่วงแรก
:::

---

### ขั้นตอนที่ 3 — อ่าน `main.tsx` ทีละบรรทัด

`main.tsx` คือ **Entry Point** — ไฟล์นี้รันก่อนทุกอย่าง และเชื่อม React กับ HTML:

::: code-group
```tsx [src/main.tsx]
import { StrictMode } from 'react'            // [1] นำเข้า StrictMode จาก React library
import { createRoot } from 'react-dom/client' // [2] นำเข้าฟังก์ชันสร้าง React root
import App from './App.tsx'                   // [3] นำเข้า Component หลักของเรา
import './index.css'                          // [4] โหลด CSS ทั่วทั้งแอป

// [5] หา <div id="root"> ใน index.html
// ! คือ Non-null assertion — บอก TypeScript ว่า element นี้มีอยู่จริง ไม่ใช่ null
// .render() สั่งให้ React วาด App ลงใน div นั้น
createRoot(document.getElementById('root')!).render(
  <StrictMode>      {/* [6] StrictMode ช่วยตรวจจับ bug ระหว่าง development */}
    <App />         {/* [7] render Component หลักของเรา */}
  </StrictMode>,
)
```

```html [index.html — ส่วนสำคัญ]
<body>
  <!-- React จะวาง UI ทั้งหมดลงใน div นี้ -->
  <div id="root"></div>

  <!-- สั่งให้ Browser โหลด main.tsx เป็นไฟล์แรก -->
  <script type="module" src="/src/main.tsx"></script>
</body>
```
:::

**สรุปการทำงาน:**
1. Browser เปิด `index.html`
2. `index.html` โหลด `main.tsx`
3. `main.tsx` ใช้ `createRoot` วาง `<App />` ลงใน `<div id="root">`
4. React ดูแล UI ทั้งหมดตั้งแต่นั้น

---

### ขั้นตอนที่ 4 — TypeScript Basic Types

TypeScript บังคับให้ระบุ "ชนิดข้อมูล" ทำให้ Editor แจ้ง Error ก่อน runtime:

::: code-group
```ts [✅ ถูกต้อง]
// รูปแบบ: const ชื่อตัวแปร: Type = ค่า
const equipmentName: string  = 'MacBook Pro'  // ข้อความ
const totalCount:    number  = 6              // ตัวเลข (ทศนิยมได้ด้วย)
const isAvailable:   boolean = true           // จริง (true) หรือเท็จ (false)
```

```ts [❌ ผิด]
const totalCount: number  = 'หก'   // ❌ Type 'string' is not assignable to type 'number'
const isAvailable: boolean = 1     // ❌ Type 'number' is not assignable to type 'boolean'
const equipmentName: string = null  // ❌ Type 'null' is not assignable to type 'string'
```

```ts [💡 Type Inference]
// ถ้าให้ค่าตั้งต้น TypeScript รู้ Type โดยอัตโนมัติ
const equipmentName = 'MacBook Pro'  // รู้ว่าเป็น string
const totalCount    = 6              // รู้ว่าเป็น number
const isAvailable   = true           // รู้ว่าเป็น boolean

// แต่ถ้าประกาศโดยไม่ให้ค่า — ต้องระบุ Type เอง
let currentStatus: string  // บอกว่าจะเก็บ string ในอนาคต
```
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 กับ TypeScript โดยใช้ Vite อยู่ ช่วยอธิบายว่า `createRoot(document.getElementById('root')!)` ทำงานอย่างไร ทำไมต้องมีเครื่องหมาย `!` (non-null assertion) และจะเกิดอะไรขึ้นถ้าไม่ใส่ `!` อธิบายแบบเข้าใจง่ายสำหรับนักเรียนมือใหม่"
:::

### 📝 PjBL Lab

**ขั้น 1: สร้างโปรเจกต์ (5 นาที)**

- [ ] รัน `npm create vite@latest my-equipment-system -- --template react-ts`
- [ ] รัน `cd my-equipment-system && npm install`
- [ ] รัน `npm run dev`
- [ ] เปิด Browser ที่ `localhost:5173` → ต้องเห็นหน้า React ตัวอย่าง ✅

**ขั้น 2: อ่านโครงสร้างโปรเจกต์ (10 นาที)**

- [ ] เปิดโฟลเดอร์ `my-equipment-system` ใน VS Code
- [ ] เปิดไฟล์ `index.html` → หา `<div id="root">` ทำความเข้าใจว่า React วางอะไรตรงนี้
- [ ] เปิดไฟล์ `src/main.tsx` → อ่านทุกบรรทัดพร้อมคอมเมนต์ด้านบน

**ขั้น 3: แก้ไข App.tsx (10 นาที)**

- [ ] เปิดไฟล์ `src/App.tsx` ลบโค้ดเดิมออกทั้งหมด แล้วแทนด้วย:

```tsx
// src/App.tsx
export default function App() {
  return (
    <div>
      <h1>ระบบเบิก-จ่ายอุปกรณ์ไอที</h1>
      <p>สวัสดี TypeScript!</p>
    </div>
  )
}
```

- [ ] บันทึกไฟล์ → Browser อัปเดตทันทีโดยไม่ต้อง refresh (Hot Reload) ✅

**ขั้น 4: ทดสอบ TypeScript Basic Types (10 นาที)**

- [ ] เพิ่มตัวแปรและแสดงผลใน `App.tsx`:

```tsx
// src/App.tsx
export default function App() {
  const equipmentName: string  = 'MacBook Pro'
  const totalCount:    number  = 6
  const isAvailable:   boolean = true

  console.log('ข้อมูล:', equipmentName, totalCount, isAvailable)

  return (
    <div>
      <h1>ระบบเบิก-จ่ายอุปกรณ์ไอที</h1>
      <p>อุปกรณ์: {equipmentName}</p>
      <p>จำนวน: {totalCount} ชิ้น</p>
      <p>สถานะ: {isAvailable ? 'ว่าง' : 'ถูกยืม'}</p>
    </div>
  )
}
```

- [ ] กด F12 ใน Browser → Console tab → ต้องเห็น `ข้อมูล: MacBook Pro 6 true` ✅
- [ ] ลองเปลี่ยน `const totalCount: number = 'หก'` → ต้องเห็นขีดเส้นแดงใน Editor ✅
- [ ] แก้กลับเป็น `number` → Error หาย

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ `main.tsx` แยกจาก `index.html`? ทำไมไม่เขียนทุกอย่างใน HTML เลย?
**แนวคำตอบ:** HTML เขียนได้แค่ static content — ไม่มี logic, ไม่มี state, ไม่สามารถอัปเดตตัวเองได้ `main.tsx` เป็น JavaScript ที่ React ใช้สร้าง UI แบบ dynamic (เปลี่ยนได้ตามข้อมูล) React render UI ทั้งหมดลงใน `<div id="root">` หลังจาก Browser โหลด HTML เสร็จ ดังนั้น HTML จึงเป็นแค่ "กรอบว่าง" ก่อน
:::

::: details ❓ `<React.StrictMode>` กับ `<StrictMode>` ต่างกันไหม?
**แนวคำตอบ:** เหมือนกันทุกประการ — เพียงแต่วิธี import ต่างกัน `<React.StrictMode>` ต้อง `import React from 'react'` ส่วน `<StrictMode>` ใช้ `import { StrictMode } from 'react'` (Named Import) React 18 เป็นต้นมานิยม Named Import มากกว่า เพราะ bundle size เล็กกว่าเล็กน้อย (tree-shaking ทำงานได้ดีกว่า)
:::

::: details ❓ ทำไม TypeScript ถึงช่วยป้องกัน Bug ได้ดีกว่า JavaScript ปกติ?
**แนวคำตอบ:** JavaScript ปกติเกิด Error ตอน runtime (ขณะผู้ใช้กำลังใช้งาน) TypeScript ตรวจสอบตั้งแต่ compile time (ตอนเขียนโค้ด) เช่น ถ้าฟังก์ชัน `calculateTotal()` คาดหวัง `number` แต่เราส่ง string ไป — TypeScript แจ้งทันทีในไฟล์ ไม่ต้องรอให้ผู้ใช้เจอ Bug ตอนใช้งานจริง
:::

::: details ❓ Vite ต่างจาก Create React App (CRA) อย่างไร? ทำไมควรใช้ Vite?
**แนวคำตอบ:** CRA ใช้ Webpack ซึ่งช้ากว่า — โปรเจกต์ใหญ่อาจรอ 30-60 วินาทีตอน start Vite ใช้ ES Modules โดยตรงทำให้ start ได้ใน < 1 วินาที Hot Reload ก็เร็วกว่ามาก นอกจากนี้ CRA ถูก deprecated แล้ว (ไม่อัปเดตแล้ว) ปัจจุบัน Vite กลายเป็นมาตรฐานสำหรับ React project ใหม่
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| สร้างโปรเจกต์ Vite + TS | สร้างได้ รัน dev server ผ่าน | สร้างได้แต่มี Error | ยังไม่ได้สร้าง |
| แก้ไข App.tsx | แสดงข้อความ + 3 ตัวแปรครบ | แสดงได้แต่ขาดบางส่วน | ไม่ได้แก้ไข |
| ทดสอบ TypeScript Error | ลอง error ดู TS แจ้งถูกต้อง | ลองแต่ไม่เข้าใจผล | ไม่ได้ทดสอบ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Entry Point` | จุดเริ่มต้น — `main.tsx` คือไฟล์แรกที่รันเมื่อเปิดเว็บ |
| `Component` | ส่วนประกอบย่อยของ UI — เขียนครั้งเดียวใช้ซ้ำได้หลายที่ |
| `Render` | กระบวนการที่ React วาด UI ลงบน Browser |
| `Hot Reload` | เห็นผลการแก้โค้ดใน Browser ทันทีโดยไม่ต้อง refresh |
| `Type Safety` | ระบบตรวจสอบ Type — ป้องกันส่งข้อมูลผิดชนิด |
| `Non-null Assertion` | เครื่องหมาย `!` — บอก TypeScript ว่าค่านี้ไม่ใช่ `null` แน่นอน |
| `Type Inference` | TypeScript เดา Type ได้เองจากค่าที่กำหนด |
