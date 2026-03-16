# JSX + Conditional Rendering + การแสดงรายการ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายต้องแสดง **รายการอุปกรณ์ทั้งหมด** และ **badge สีต่างกันตามสถานะ** — แต่ถ้าไม่รู้วิธีวน loop และ condition ใน JSX จะต้องเขียนโค้ดซ้ำทีละชิ้น และสีก็จะเหมือนกันหมด
:::

> 💡 **เปรียบเทียบ:** JSX เหมือน "Word mail merge" — เขียนแม่แบบครั้งเดียว แล้วใส่ข้อมูลต่างกันในแต่ละบรรทัดอัตโนมัติ

---

## 📖 I: Information

### JSX คืออะไร?

JSX (ย่อมาจาก JavaScript XML) คือ syntax หรือรูปแบบการเขียนโค้ดที่ได้รับการพัฒนามาให้เราสามารถผสมผสานคำสั่ง JavaScript เข้ากับแท็กและโครงสร้างของ HTML ไว้ด้วยกันได้อย่างลงตัว 

ข้อดีหลักของการใช้ JSX คือเราสามารถจัดการตรรกะการทำงาน (Logic) ควบคู่ไปกับหน้าตาของแอป (UI) ได้ในไฟล์เดียวกัน ทำให้เห็นภาพรวมได้ชัดเจนว่าโค้ดส่วนไหนเกี่ยวข้องกับส่วนที่แสดงผลใด โดยเบื้องหลังแล้ว เมื่อเซฟไฟล์ โค้ด JSX ของเราจะถูกคอมไพล์กลับไปเป็นฟังก์ชัน JavaScript มาตรฐานเพื่อให้เบราว์เซอร์เข้าใจในที่สุด (ผ่านการเรียก `React.createElement(...)`)

สิ่งที่อยู่ในวงเล็บ `return (...)` ของ React Component ทั้งหมดนั่นแหละคือโครงสร้างของ JSX:

::: code-group
```tsx [✅ JSX — ผสม JS + HTML]
// ใส่ค่าตัวแปรใน JSX ด้วย { }
const name = 'MacBook Pro'
const count = 6

return (
  <div>
    <h1>{name}</h1>          {/* แสดงค่าตัวแปร */}
    <p>จำนวน: {count} ชิ้น</p>
    <p>รวม: {count * 1000} บาท</p>  {/* คำนวณได้ใน { } */}
  </div>
)
```

```tsx [❌ สิ่งที่ทำไม่ได้ใน JSX]
return (
  // ❌ ใส่ if/else ตรง ๆ ไม่ได้ใน JSX
  <div>
    if (status === 'available') {
      <p>ว่าง</p>
    }
  </div>
)
```
:::

---

### ขั้นตอนที่ 1 — Conditional Rendering (แสดง UI ตามเงื่อนไข)

ใน JSX ใช้ **Ternary Operator** `? :` แทน `if/else`:

::: code-group
```tsx [✅ Ternary — condition ? A : B]
// ถ้า isAvailable เป็น true → แสดง "ว่าง" · ถ้าไม่ใช่ → "ถูกยืม"
const isAvailable: boolean = true

return (
  <p>สถานะ: {isAvailable ? 'ว่าง' : 'ถูกยืม'}</p>
)
```

```tsx [✅ && — แสดงเฉพาะเมื่อเป็น true]
const borrowedBy: string = 'สมชาย'

return (
  <div>
    {/* แสดง paragraph นี้เฉพาะเมื่อ borrowedBy มีค่า */}
    {borrowedBy && <p>ยืมโดย: {borrowedBy}</p>}
  </div>
)
```

```tsx [✅ หลายเงื่อนไข — ใช้ Record mapping]
// เหมาะกับสถานะที่มีหลายค่า
const statusLabel: Record<string, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}

const status: string = 'borrowed'

return (
  <p>สถานะ: {statusLabel[status]}</p>  // → "ถูกยืม"
)
```
:::

---

### ขั้นตอนที่ 2 — แสดงรายการด้วย `.map()`

เมื่อต้องแสดงข้อมูลหลายรายการ ใช้ `.map()` วน loop — ไม่ต้องเขียนซ้ำทีละอัน:

::: code-group
```tsx [✅ .map() พื้นฐาน]
// ข้อมูลอุปกรณ์ 3 ชิ้น (ตอนนี้ยัง hardcode)
const equipmentNames: string[] = ['MacBook Pro', 'iPad Air', 'Projector']

return (
  <ul>
    {/* .map() วน loop — ทุกรายการใน array */}
    {equipmentNames.map((name) => (
      <li key={name}>{name}</li>  // key ต้องไม่ซ้ำกัน
    ))}
  </ul>
)
```

```tsx [✅ .map() กับ Object]
// ข้อมูลแบบ object array
const equipments = [
  { id: 1, name: 'MacBook Pro', status: 'available' },
  { id: 2, name: 'iPad Air',    status: 'borrowed'  },
]

return (
  <div>
    {equipments.map((eq) => (
      <div key={eq.id}>           {/* key ใช้ id ที่ unique */}
        <h3>{eq.name}</h3>
        <p>{eq.status}</p>
      </div>
    ))}
  </div>
)
```

```tsx [❌ ลืม key — React แจ้ง Warning]
// ❌ Warning: Each child in a list should have a unique "key" prop
{equipmentNames.map((name) => (
  <li>{name}</li>  // ลืม key={...}
))}
```
:::

::: tip 💡 ทำไม `key` ถึงสำคัญ?
React ใช้ `key` เพื่อรู้ว่า item ไหนเปลี่ยนแปลง เมื่อข้อมูลอัปเดต React จะ re-render เฉพาะ item ที่เปลี่ยน ไม่ใช่ทั้งรายการ — ทำให้แอปเร็วขึ้น ต้องใช้ค่าที่ **unique** เสมอ เช่น `id` จากฐานข้อมูล ไม่ใช่ `index`
:::

---

### ขั้นตอนที่ 3 — รวม Conditional + `.map()` ในโค้ดเดียว

ในโปรเจกต์จริง มักใช้ทั้งสองพร้อมกัน:

```tsx [src/App.tsx — รายการอุปกรณ์พร้อม badge สี]
const equipments = [
  { id: 1, name: 'MacBook Pro',    status: 'available'   },
  { id: 2, name: 'iPad Air',       status: 'borrowed'    },
  { id: 3, name: 'Projector Epson', status: 'maintenance' },
]

// กำหนดสีตามสถานะ
const badgeColor: Record<string, string> = {
  available:   '#16a34a',  // เขียว
  borrowed:    '#dc2626',  // แดง
  maintenance: '#d97706',  // เหลือง
}

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <h1>รายการอุปกรณ์</h1>
      {equipments.map((eq) => (
        <div key={eq.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
          <span>{eq.name}</span>
          {/* badge สีตาม status */}
          <span style={{ backgroundColor: badgeColor[eq.status], color: 'white', padding: '2px 8px', borderRadius: 12, marginLeft: 8, fontSize: 12 }}>
            {eq.status}
          </span>
        </div>
      ))}
    </div>
  )
}
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ มี array ของ object: `[{ id: 1, name: 'MacBook', status: 'available' }, ...]` ต้องการแสดงรายการทั้งหมดโดยใช้ `.map()` และแสดงสีต่างกันตาม status ด้วย inline style ช่วยเขียนโค้ดพร้อมอธิบายทีละบรรทัด"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `src/App.tsx` จาก Lab ก่อนหน้า → เพิ่ม footer ชื่อของตนเองถ้ายังไม่มี ✅

**ขั้น 1: ฝึก Conditional Rendering (10 นาที)**

- [ ] สร้างตัวแปร `const isAvailable: boolean = true`
- [ ] แสดงข้อความ "ว่าง" หรือ "ถูกยืม" โดยใช้ `? :` ใน JSX
- [ ] เปลี่ยน `isAvailable` เป็น `false` → ข้อความต้องเปลี่ยนใน Browser ✅
- [ ] เพิ่ม `const borrowedBy = 'สมชาย'` → แสดง paragraph "ยืมโดย..." โดยใช้ `&&`

**ขั้น 2: ฝึก `.map()` แสดงรายการ (15 นาที)**

- [ ] สร้าง array `equipments` 3 รายการ (id, name, status) ใน `App.tsx`
- [ ] ใช้ `.map()` วน render แต่ละชิ้น → ต้องเห็น 3 รายการใน Browser ✅
- [ ] ลองลบ `key={eq.id}` ออก → ดู Warning ใน Console (F12) ✅
- [ ] ใส่ `key` กลับ → Warning หาย

**ขั้น 3: รวม Conditional + `.map()` (10 นาที)**

- [ ] เพิ่ม `badgeColor` object และแสดง badge สีตาม status ของแต่ละรายการ
- [ ] ต้องเห็น badge เขียว/แดง/เหลืองถูกต้องทุกชิ้น ✅
- [ ] (Bonus) เพิ่มข้อความ "ยืมโดย: ..." ให้แสดงเฉพาะเมื่อ status เป็น `'borrowed'` โดยใช้ `&&`

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม JSX ถึงใช้ `{ }` ครอบค่าตัวแปร ไม่ใช้ `{{ }}` แบบ Vue?
**แนวคำตอบ:** JSX คือ JavaScript — `{ }` ตัวเดียวหมายถึง "ตรงนี้คือ JavaScript expression" เช่น `{name}` หรือ `{count * 2}` ส่วน Vue ใช้ `{{ }}` (Mustache syntax) เพราะเป็น Template ที่แยกออกจาก JavaScript — คนละแนวคิดกัน
:::

::: details ❓ ทำไมต้องใส่ `key` ใน `.map()`? จะใช้ index (0, 1, 2) เป็น key ได้ไหม?
**แนวคำตอบ:** `key` บอก React ว่า item ไหนเป็นตัวไหนเมื่อรายการเปลี่ยนแปลง ถ้าใช้ index เป็น key จะมีปัญหาเมื่อลบ/เรียงลำดับ item ใหม่ — React จะ re-render ผิด ควรใช้ `id` จากข้อมูลที่ unique จริง ๆ เสมอ
:::

::: details ❓ `condition && <Component />` กับ `condition ? <Component /> : null` ต่างกันไหม?
**แนวคำตอบ:** ผลลัพธ์เหมือนกัน แต่ `&&` สั้นกว่าและอ่านง่ายกว่าเมื่อไม่ต้องการ fallback ใช้ `? :` เมื่อต้องการแสดงอะไรบางอย่างในกรณีที่ condition เป็น false ด้วย
:::

::: details ❓ ต่างกันอย่างไรระหว่าง Ternary `? :` กับ `Record<string, string>`?
**แนวคำตอบ:** Ternary เหมาะกับ 2 ทางเลือก เช่น true/false ส่วน `Record<string, string>` เหมาะกับหลายค่า เช่น available/borrowed/maintenance — โค้ดอ่านง่ายกว่าการ if/else ซ้อนกันหลายชั้น
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Conditional Rendering | ใช้ `? :` และ `&&` ถูกต้องครบ | ใช้ได้บางส่วน | ยังไม่ได้ลอง |
| `.map()` + `key` | วน loop ถูก มี key unique | วนได้แต่ลืม key | ยังไม่ได้ลอง |
| รวม badge สี | badge สีถูกต้องทุกสถานะ | มีบางสถานะ | ไม่มี badge |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `JSX` | JavaScript XML — syntax ผสม JS กับ HTML สำหรับ React |
| `Conditional Rendering` | แสดง UI ตามเงื่อนไข — ใช้ `? :` หรือ `&&` ใน JSX |
| `Ternary Operator` | เครื่องหมาย `? :` — `condition ? ถ้าจริง : ถ้าเท็จ` |
| `.map()` | เมธอดของ Array — วน loop แปลงแต่ละ item เป็น JSX |
| `key` | Prop พิเศษที่ React ใช้ระบุ item ใน list — ต้อง unique |
| `Record<K, V>` | TypeScript type สำหรับ object ที่ key เป็น K และ value เป็น V |
