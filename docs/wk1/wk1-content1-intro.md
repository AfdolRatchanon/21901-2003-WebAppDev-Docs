# โครงสร้าง React + ตั้งค่า Vite + TypeScript <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** ติดตั้ง React + TypeScript + Vite และอ่านโครงสร้างโปรเจกต์ — ใช้จริงตลอดทั้ง course

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
**ระบบเบิก-จ่ายอุปกรณ์ไอที** ของโรงเรียนยังใช้กระดาษบันทึก ไม่รู้ว่าอุปกรณ์ถูกยืมไปแล้วหรือยัง วิชานี้จะสร้างเว็บแอปแก้ปัญหานี้ด้วย React + TypeScript + Vite
:::

> 💡 **เปรียบเทียบ:** React Component เหมือน "แบบฟอร์มสำเร็จรูป" — ออกแบบครั้งเดียว ใช้ซ้ำได้หลายครั้ง ข้อมูลต่างกันได้

## 📖 I: Information

| เครื่องมือ | หน้าที่ | เปรียบเทียบ |
| :--- | :--- | :--- |
| **React** | สร้าง UI แบ่งเป็น Component ย่อย | LEGO — ต่อบล็อกชิ้นเล็กๆ เป็นหน้าเว็บ |
| **TypeScript** | เพิ่ม Type Safety ให้ JavaScript | Spell checker — แจ้งเตือนก่อน Error จริง |
| **Vite** | Build tool เร็วมาก มี Hot Reload | ดู preview แบบ real-time ทันทีที่บันทึก |

### ขั้นตอนที่ 1 — สร้างโปรเจกต์ใหม่

```bash
npm create vite@latest my-equipment-system -- --template react-ts
cd my-equipment-system
npm install
npm run dev
```

Terminal จะแสดงผล:

```
  VITE v5.x  ready in 500ms
  ➜  Local:   http://localhost:5173/
```

เปิด Browser ที่ `http://localhost:5173/` → เห็นหน้า React ตัวอย่าง ✅

### ขั้นตอนที่ 2 — โครงสร้างโฟลเดอร์

```
my-equipment-system/
├── src/
│   ├── App.tsx       ← แก้ไขที่นี่บ่อยที่สุด
│   └── main.tsx      ← Entry point — รันก่อนทุกอย่าง
├── index.html        ← HTML template (มี <div id="root">)
└── package.json
```

::: tip 💡 โฟลเดอร์สำคัญ
เกือบทุกอย่างอยู่ใน `src/` — ไม่ต้องแตะไฟล์อื่นในช่วงแรก
:::

### ขั้นตอนที่ 3 — อ่าน main.tsx

::: code-group
```tsx [src/main.tsx]
import { StrictMode } from 'react'            // [1] ตรวจจับ bug ระหว่าง development
import { createRoot } from 'react-dom/client' // [2] สร้าง React root
import App from './App.tsx'                   // [3] นำเข้า Component หลัก

createRoot(document.getElementById('root')!).render( // ! = ไม่ใช่ null แน่นอน
  <StrictMode><App /></StrictMode>,
)
```
:::

**สรุปการทำงาน:** Browser เปิด `index.html` → โหลด `main.tsx` → React วาง `<App />` ลงใน `<div id="root">`

#### 🔷 TypeScript ในบทนี้

JavaScript ไม่รู้ว่าตัวแปรเก็บอะไร — TypeScript เพิ่ม "ป้ายบอกชนิด" เข้าไป ทำให้ Editor แจ้งทันทีถ้าใช้ข้อมูลผิดชนิด ไม่ต้องรอ runtime

**ชนิดข้อมูลพื้นฐานที่ใช้ในระบบนี้:**

| ชนิด | ใช้เก็บ | ตัวอย่างในระบบ |
| :--- | :--- | :--- |
| `string` | ข้อความ | ชื่ออุปกรณ์, สถานะ, หมวดหมู่ |
| `number` | ตัวเลข | จำนวน, รหัส ID |
| `boolean` | จริง/เท็จ | ว่างอยู่ไหม, ยืมอยู่ไหม |
| `string[]` | array ของข้อความ | รายชื่ออุปกรณ์หลายชิ้น |

**รูปแบบการเขียน (Type Annotation):**

```ts
// รูปแบบ: const ชื่อตัวแปร: ชนิด = ค่า
const equipmentName: string  = 'MacBook Pro'
const totalCount:    number  = 6
const isAvailable:   boolean = true
const categories:    string[] = ['Notebook', 'Tablet', 'Projector']  // array
```

::: code-group
```ts [✅ ถูกต้อง]
const equipmentName: string  = 'MacBook Pro'  // string = ข้อความ
const totalCount:    number  = 6              // number = ตัวเลข
const isAvailable:   boolean = true           // boolean = true หรือ false เท่านั้น
const categories:    string[] = ['Notebook', 'Tablet']  // [] = array ของ string
```

```ts [❌ ผิด — TypeScript แจ้งทันที]
const totalCount:  number  = 'หก'    // ❌ string ใส่ใน number ไม่ได้
const isAvailable: boolean = 1       // ❌ number ใส่ใน boolean ไม่ได้
const categories:  string[] = 'Notebook'  // ❌ string เดี่ยวใส่ใน array ไม่ได้
```

```ts [💡 Type Inference — ไม่ต้องเขียน Type ถ้าให้ค่าทันที]
// TypeScript เดาเองได้ถ้าให้ค่าตั้งต้น
const equipmentName = 'MacBook Pro'  // รู้ว่าเป็น string
const totalCount    = 6              // รู้ว่าเป็น number

// แต่ถ้าประกาศโดยไม่ให้ค่า — ต้องระบุชนิดเอง
let currentStatus: string  // จะกำหนดค่าทีหลัง
```
:::

::: warning ⚠️ JavaScript vs TypeScript
JavaScript รัน code ก่อนแล้วค่อยพัง — TypeScript แจ้งตั้งแต่ตอนพิมพ์ใน Editor
```ts
// JavaScript: ไม่แจ้ง Error — พังตอน runtime เท่านั้น
let count = 6
count = 'หก'  // รันได้ แต่พังในฟังก์ชันที่ใช้ count ต่อ

// TypeScript: ขีดเส้นแดงทันทีใน Editor
let count: number = 6
count = 'หก'  // ❌ แจ้งก่อนรันเลย
```
:::

## 🛠️ A: Application

::: tip ✅ เช็คก่อนเริ่ม Lab
- [ ] รัน `npm run dev` แล้วเห็นหน้า React ใน Browser แล้ว
- [ ] เปิดไฟล์ `src/App.tsx` ใน VS Code แล้ว
:::

### 🤖 AI Prompt
::: info 💬 ถาม AI
"ช่วยอธิบายว่า `createRoot(document.getElementById('root')!)` ทำงานอย่างไร และทำไมต้องมีเครื่องหมาย `!`"
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/App.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `src/App.tsx` ลบโค้ดเดิมออก แทนด้วย:

```tsx
// wk1 — App.tsx เวอร์ชัน 1
export default function App() {
  return (
    <div>
      <h1>ระบบเบิก-จ่ายอุปกรณ์ไอที</h1>
      <footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
        จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
      </footer>
    </div>
  )
}
```

- [ ] บันทึกไฟล์ → ต้องเห็นชื่อของตนเองปรากฏบนหน้าเว็บ ✅

**ขั้น 1: เพิ่มข้อมูลอุปกรณ์ (10 นาที)**

- [ ] เพิ่มตัวแปร TypeScript 3 ชนิดและแสดงใน JSX:

```tsx {3-5,10-12}
// wk1 — App.tsx เวอร์ชัน 2: เพิ่มข้อมูลอุปกรณ์
export default function App() {
  const equipmentName: string  = 'MacBook Pro'
  const totalCount:    number  = 6
  const isAvailable:   boolean = true

  return (
    <div>
      <h1>ระบบเบิก-จ่ายอุปกรณ์ไอที</h1>
      <p>อุปกรณ์: {equipmentName}</p>
      <p>จำนวน: {totalCount} ชิ้น</p>
      <p>สถานะ: {isAvailable ? 'ว่าง' : 'ถูกยืม'}</p>
      <footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
        จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
      </footer>
    </div>
  )
}
```

- [ ] บันทึกไฟล์ → ต้องเห็น "อุปกรณ์: MacBook Pro" และ "สถานะ: ว่าง" ✅

**ขั้น 2: ทดสอบ TypeScript Error (5 นาที)**

- [ ] เปลี่ยน `const totalCount: number = 'หก'` → ต้องเห็น Error ขีดเส้นแดงใน Editor ✅
- [ ] แก้กลับเป็น `= 6` → Error หาย ✅

**ขั้น 3: ส่งงาน**

- [ ] `git add . && git commit -m "wk1-content1: setup by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ `main.tsx` แยกจาก `index.html`?
**แนวคำตอบ:** HTML เขียนได้แค่ static content React ต้องการ JavaScript เพื่อสร้าง UI แบบ dynamic `main.tsx` เชื่อม React กับ HTML โดยวาง `<App />` ลงใน `<div id="root">`
:::

::: details ❓ ทำไม TypeScript ถึงช่วยป้องกัน Bug ได้ดีกว่า JavaScript?
**แนวคำตอบ:** JavaScript Error เกิดตอน runtime ขณะผู้ใช้ใช้งานจริง TypeScript ตรวจตั้งแต่ตอนเขียนโค้ด เช่น ส่ง string ให้ฟังก์ชันที่รอ number — แจ้งทันทีก่อนรัน
:::

::: details ❓ Vite ต่างจาก Create React App (CRA) อย่างไร?
**แนวคำตอบ:** CRA ใช้ Webpack ช้ากว่า start ใช้เวลา 30-60 วินาที Vite ใช้ ES Modules start ใน < 1 วินาที นอกจากนี้ CRA ถูก deprecated แล้ว — Vite คือมาตรฐานปัจจุบัน
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `npm: command not found` | ยังไม่ได้ติดตั้ง Node.js | ติดตั้ง Node.js 18+ จาก nodejs.org |
| หน้า Browser ว่างเปล่า | `<div id="root">` ไม่มีใน `index.html` | เช็ค `index.html` ว่ามี `id="root"` |
| `Cannot find module './App.tsx'` | ชื่อไฟล์ผิด case | ตรวจว่าชื่อไฟล์ตรงกับ import (case-sensitive) |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| สร้างโปรเจกต์ Vite + TS | สร้างได้ รัน dev server ผ่าน | สร้างได้แต่มี Error | ยังไม่ได้สร้าง |
| แก้ไข App.tsx + footer | แสดงชื่อ + ข้อมูล 3 ตัวแปรครบ | แสดงได้แต่ขาดบางส่วน | ไม่ได้แก้ไข |
| ทดสอบ TypeScript Error | TS แจ้ง Error ถูกต้อง | ลองแต่ไม่เข้าใจผล | ไม่ได้ทดสอบ |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Entry Point` | เอน-ทรี พอยท์ | จุดเริ่มต้น — `main.tsx` คือไฟล์แรกที่รันเมื่อเปิดเว็บ |
| `Component` | คอม-โพ-เนนท์ | ส่วนประกอบย่อยของ UI — เขียนครั้งเดียวใช้ซ้ำได้ |
| `Render` | เรน-เดอร์ | กระบวนการที่ React วาด UI ลงบน Browser |
| `Hot Reload` | ฮอท รี-โหลด | เห็นผลการแก้โค้ดใน Browser ทันทีโดยไม่ต้อง refresh |
| `Type Safety` | ไทพ เซฟ-ตี้ | ระบบตรวจสอบ Type ป้องกันส่งข้อมูลผิดชนิด |
| `Type Inference` | ไทพ อิน-เฟอ-เรนซ์ | TypeScript เดา Type ได้เองจากค่าที่กำหนด |
