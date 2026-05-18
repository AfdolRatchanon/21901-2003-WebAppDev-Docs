# JSX + Conditional Rendering + การแสดงรายการ <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เขียน JSX แบบ dynamic — Conditional Rendering + `.map()` — ใช้จริงตั้งแต่ wk2 (State) ถึง wk4 (API Data)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายต้องแสดง **รายการอุปกรณ์ทั้งหมด** และ **badge สีต่างกันตามสถานะ** — แต่ถ้าไม่รู้วิธีวน loop และ condition ใน JSX จะต้องเขียนโค้ดซ้ำทีละชิ้น และสีก็จะเหมือนกันหมด
:::

> 💡 **เปรียบเทียบ:** JSX เหมือน "Word mail merge" — เขียนแม่แบบครั้งเดียว แล้วใส่ข้อมูลต่างกันในแต่ละบรรทัดอัตโนมัติ

## 📖 I: Information

### JSX คืออะไร?

JSX คือ syntax ที่ผสม JavaScript กับ HTML ให้เขียนในไฟล์เดียวกัน เบื้องหลัง Vite แปลง JSX เป็น `React.createElement(...)` อัตโนมัติ ไม่ต้อง import React แยก:

::: code-group
```tsx [✅ JSX — ผสม JS + HTML]
const name  = 'MacBook Pro'
const count = 6

return (
  <div>
    <h1>{name}</h1>                    {/* ใส่ค่าตัวแปรด้วย { } */}
    <p>จำนวน: {count} ชิ้น</p>
    <p>รวม: {count * 1000} บาท</p>    {/* คำนวณได้ใน { } */}
  </div>
)
```

```tsx [❌ สิ่งที่ทำไม่ได้ใน JSX]
return (
  <div>
    {/* ❌ ใส่ if/else ตรง ๆ ใน JSX ไม่ได้ */}
    if (status === 'available') {
      <p>ว่าง</p>
    }
  </div>
)
```
:::

### ขั้นตอนที่ 1 — Conditional Rendering (แสดง UI ตามเงื่อนไข)

ใน JSX ใช้ **Ternary Operator** `? :` แทน `if/else`:

::: code-group
```tsx [✅ Ternary — condition ? A : B]
const isAvailable: boolean = true

return (
  <p>สถานะ: {isAvailable ? 'ว่าง' : 'ถูกยืม'}</p>
)
```

```tsx [✅ && — แสดงเฉพาะเมื่อเป็น true]
const borrowedBy: string = 'สมชาย'

return (
  <div>
    {borrowedBy && <p>ยืมโดย: {borrowedBy}</p>}
  </div>
)
```

```tsx [✅ หลายเงื่อนไข — ใช้ Record mapping]
const statusLabel: Record<string, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}
const status: string = 'borrowed'

return (
  <p>สถานะ: {statusLabel[status]}</p>
)
```
:::

### ขั้นตอนที่ 2 — แสดงรายการด้วย `.map()`

เมื่อต้องแสดงหลายรายการ ใช้ `.map()` วน loop ไม่ต้องเขียนซ้ำทีละอัน:

::: code-group
```tsx [✅ .map() กับ Object array]
const equipments = [
  { id: 1, name: 'MacBook Pro', status: 'available' },
  { id: 2, name: 'iPad Air',    status: 'borrowed'  },
]

return (
  <div>
    {equipments.map((eq) => (
      <div key={eq.id}>       {/* [1] key ต้อง unique — ใช้ id */}
        <h3>{eq.name}</h3>
        <p>{eq.status}</p>
      </div>
    ))}
  </div>
)
```

```tsx [❌ ลืม key — React แจ้ง Warning]
{equipmentNames.map((name) => (
  <li>{name}</li>  {/* ❌ Warning: missing "key" prop */}
))}
```
:::

**สรุปการทำงาน:** `equipments.map()` วน loop แต่ละ item → return JSX หนึ่งชิ้น → React นำมารวมเป็นรายการ

::: tip 💡 ทำไม `key` ถึงสำคัญ?
React ใช้ `key` รู้ว่า item ไหนเปลี่ยนแปลง — re-render เฉพาะ item ที่เปลี่ยน ไม่ใช่ทั้งรายการ ใช้ `id` จากข้อมูลจริง ไม่ใช้ index (0, 1, 2)
:::

### ขั้นตอนที่ 3 — รวม Conditional + `.map()` พร้อม Badge

บรรทัดสีเขียวคือส่วนที่เพิ่มเข้ามาจากเวอร์ชันพื้นฐาน:

```tsx {7-12,21-24} [src/App.tsx]
const equipments = [
  { id: 1, name: 'MacBook Pro',     status: 'available'   },
  { id: 2, name: 'iPad Air',        status: 'borrowed'    },
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

#### 🔷 TypeScript ในบทนี้

TypeScript 2 ชนิดใหม่ที่ใช้ในบทนี้:

| ชนิด | ใช้เก็บ | ตัวอย่างในบทนี้ |
| :--- | :--- | :--- |
| `string[]` | array ของข้อความ | `['MacBook', 'iPad', 'Projector']` |
| `Record<string, string>` | object ที่ key และ value เป็น string | `badgeColor`, `statusLabel` |

::: code-group
```ts [✅ ถูกต้อง]
const names: string[] = ['MacBook Pro', 'iPad Air']
const colors: Record<string, string> = {
  available: '#16a34a',
  borrowed:  '#dc2626',
}
```

```ts [❌ ผิด — TypeScript แจ้งทันที]
const names: string[] = ['MacBook', 5]  // ❌ number ในตำแหน่งที่ต้องเป็น string
const colors: Record<string, string> = {
  available: true,                       // ❌ boolean ใส่ใน string ไม่ได้
}
```

```ts [💡 ใช้ Record แทน if/else ยาว]
const statusLabel: Record<string, string> = {
  available:   'ว่าง',
  borrowed:    'ถูกยืม',
  maintenance: 'ซ่อมบำรุง',
}
// ใช้: statusLabel['available']  → 'ว่าง'
```
:::

## 🛠️ A: Application

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] เข้าใจว่า `{isAvailable ? 'ว่าง' : 'ถูกยืม'}` ทำงานอย่างไรแล้ว
- [ ] เข้าใจว่า `key={eq.id}` ใน `.map()` จำเป็นเพราะอะไรแล้ว
:::

### 🤖 AI Prompt
::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ มี array ของ object: `[{ id: 1, name: 'MacBook', status: 'available' }, ...]` ต้องการแสดงรายการทั้งหมดโดยใช้ `.map()` และแสดงสีต่างกันตาม status ด้วย inline style ช่วยเขียนโค้ดพร้อมอธิบายทีละบรรทัด"
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/App.tsx` รายการอุปกรณ์พร้อม badge

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `src/App.tsx` จาก Lab ที่แล้ว → footer ชื่อของตนเองต้องยังอยู่ ✅

**ขั้น 1: ฝึก Conditional Rendering (10 นาที)**

- [ ] สร้างตัวแปร `const isAvailable: boolean = true` ใน `App.tsx`
- [ ] แสดงข้อความ "ว่าง" หรือ "ถูกยืม" ด้วย `? :` ใน JSX
- [ ] เปลี่ยน `isAvailable` เป็น `false` → ข้อความต้องเปลี่ยนใน Browser ✅
- [ ] เพิ่ม `const borrowedBy: string = 'สมชาย'` → แสดง paragraph ด้วย `&&`

**ขั้น 2: ฝึก `.map()` แสดงรายการ (15 นาที)**

- [ ] สร้าง array `equipments` 3 รายการ (id, name, status) ใน `App.tsx`
- [ ] ใช้ `.map()` วน render แต่ละชิ้น → ต้องเห็น 3 รายการใน Browser ✅
- [ ] ลบ `key={eq.id}` ออก → ดู Warning ใน Console (F12) แล้วใส่กลับ ✅

**ขั้น 3: เพิ่ม badge สีตาม status (10 นาที)**

- [ ] เพิ่ม `badgeColor` object และ badge `<span>` ตามโค้ดขั้นตอนที่ 3
- [ ] ต้องเห็น badge เขียว/แดง/เหลืองถูกต้องทุกชิ้น ✅
- [ ] (Bonus) เพิ่ม `&&` แสดงข้อความ "ยืมโดย: ..." เฉพาะ status `'borrowed'`

**ขั้น 4: ส่งงาน**

- [ ] `git add . && git commit -m "wk1-content2: jsx + map by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

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
**แนวคำตอบ:** Ternary เหมาะกับ 2 ทางเลือก เช่น true/false ส่วน `Record<string, string>` เหมาะกับหลายค่า เช่น available/borrowed/maintenance — โค้ดอ่านง่ายกว่า if/else ซ้อนกันหลายชั้น
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| Warning: Each child in a list should have a unique "key" prop | `.map()` ไม่มี `key` | เพิ่ม `key={eq.id}` ใน element แรกใน `.map()` |
| `undefined` แสดงใน badge | `status` มีค่าที่ไม่ได้กำหนดใน `badgeColor` | เพิ่ม fallback: `badgeColor[eq.status] ?? '#94a3b8'` |
| JSX แสดงผล `false` หรือ `0` ออกมา | `0 && <p>...</p>` — number 0 แสดงได้ใน JSX | เปลี่ยนเป็น Boolean: `count > 0 && <p>...</p>` |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Conditional Rendering | ใช้ `? :` และ `&&` ถูกต้องครบ | ใช้ได้บางส่วน | ยังไม่ได้ลอง |
| `.map()` + `key` | วน loop ถูก มี key unique | วนได้แต่ลืม key | ยังไม่ได้ลอง |
| รวม badge สี | badge สีถูกต้องทุกสถานะ | มีบางสถานะ | ไม่มี badge |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `JSX` | เจ-เอส-เอ็กซ์ | JavaScript XML — syntax ผสม JS กับ HTML สำหรับ React |
| `Conditional Rendering` | คอน-ดิ-ชัน-นัล เรน-เดอ-ริ่ง | แสดง UI ตามเงื่อนไข — ใช้ `? :` หรือ `&&` ใน JSX |
| `Ternary Operator` | เทอ-นา-รี ออป-เปอ-เรเตอร์ | เครื่องหมาย `? :` — `condition ? ถ้าจริง : ถ้าเท็จ` |
| `.map()` | ดอท-แมพ | เมธอดของ Array — วน loop แปลงแต่ละ item เป็น JSX |
| `key` | คีย์ | Prop พิเศษที่ React ใช้ระบุ item ใน list — ต้อง unique |
| `Record<K, V>` | เรค-คอร์ด | TypeScript type สำหรับ object ที่ key เป็น K และ value เป็น V |
