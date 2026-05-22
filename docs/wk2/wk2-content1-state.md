# useState — จัดการ State ใน Component <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** ฝึก useState + Setter ก่อนใช้งานจริงใน wk3 (Forms) และ wk4 (API)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ในระบบเบิก-จ่าย เมื่อผู้ใช้กดปุ่ม "ยืมอุปกรณ์" สถานะควรเปลี่ยนจาก "ว่าง" เป็น "ถูกยืม" ทันที — แต่ถ้าเก็บข้อมูลใน `const` ธรรมดา หน้าเว็บจะไม่ refresh เพราะ React ไม่รู้ว่ามีอะไรเปลี่ยน
:::

> 💡 **เปรียบเทียบ:** State เหมือน "กระดานไวท์บอร์ด" ที่ React จับตามอง — ทุกครั้งที่กระดานเปลี่ยน React จะวาด UI ใหม่ให้อัตโนมัติ แต่ถ้าเขียนบนกระดาษ (ตัวแปรธรรมดา) React ไม่เห็น

## 📖 I: Information

### ทำไม `const` ธรรมดาใช้ไม่ได้?

การประกาศตัวแปรด้วย `const` หรือ `let` ในฟังก์ชันดั้งเดิมของ JavaScript เป็นเพียงการเก็บข้อมูลไว้ในหน่วยความจำและอนุญาตให้เปลี่ยนค่าได้ (สำหรับ `let`) แต่ปัญหาคือ React ไม่สามารถรับรู้ถึงการเปลี่ยนแปลงของตัวแปรเหล่านี้ได้เลย เพื่อประสิทธิภาพสูงสุด React จะไม่อัปเดตหน้าจอ (Re-render) จนกว่าจะมีการแจ้งมันว่า "ข้อมูลมีการเปลี่ยนแปลงนะ!" 

ในการจัดการสถานะข้อมูล (State) ภายใน React Function Component เราจึงต้องใช้เครื่องมือพิเศษที่เรียกว่า **`useState` Hook** ซึ่งนอกจากจะทำหน้าที่บันทึกและจำค่าระหว่างการเรนเดอร์แต่ละรอบแล้ว ยังทำหน้าที่เป็น "สวิตช์" ส่งสัญญาณไปบอกให้เบราว์เซอร์ลบหน้าจอเก่าทิ้ง แล้ววาดชิ้นส่วน Component นี้ขึ้นมาใหม่อีกครั้งให้สอดคล้องกับค่าล่าสุดโดยอัตโนมัติ ส่งผลให้ข้อมูลลื่นไหลและแอปพลิเคชันตอบสนองตรงตามการใช้งานจริง (Reactive)

::: code-group
```tsx [❌ ตัวแปรธรรมดา — UI ไม่อัปเดต]
// ปัญหา: เปลี่ยนค่าได้ แต่ React ไม่รู้ว่าเปลี่ยน
let status = 'available'

function handleBorrow() {
  status = 'borrowed'  // เปลี่ยนค่าแล้ว...
  // แต่ Browser ไม่ refresh! React ไม่ re-render
}
```

```tsx [✅ useState — React รู้ทุกการเปลี่ยนแปลง]
import { useState } from 'react'

// useState บอกให้ React "จับตามอง" ค่านี้
const [status, setStatus] = useState('available')

function handleBorrow() {
  setStatus('borrowed')  // React รู้ → re-render ทันที!
}
```
:::

### วงจร Render ของ useState

```
① ผู้ใช้กดปุ่ม
       ↓
② setStatus('borrowed')  ← เรียก setter
       ↓
③ React รับรู้ว่า state เปลี่ยน
       ↓
④ React re-render component ใหม่
       ↓
⑤ UI แสดงค่าล่าสุด: "ถูกยืม"
       ↓
   (กลับไป ① รอ event ต่อไป)
```

### ขั้นตอนที่ 1 — รูปแบบของ useState

```tsx [src/App.tsx]
import { useState } from 'react'  // [1] นำเข้า useState

export default function App() {
  // [2] ประกาศ state — ได้ค่า 2 ตัวจาก array
  //     status    = ค่าปัจจุบัน (อ่านได้)
  //     setStatus = ฟังก์ชันสำหรับเปลี่ยนค่า (เขียนได้)
  //     'available' = ค่าเริ่มต้น
  const [status, setStatus] = useState('available')

  return (
    <div>
      <p>สถานะ: {status}</p>  {/* [3] แสดงค่า */}

      {/* [4] กดปุ่มแล้วเรียก setter */}
      <button onClick={() => setStatus('borrowed')}>
        ยืมอุปกรณ์
      </button>
      <button onClick={() => setStatus('available')}>
        คืนอุปกรณ์
      </button>
    </div>
  )
}
```

**สรุป:** กดปุ่ม → `setStatus('borrowed')` → React re-render → `{status}` แสดง `'borrowed'` ✅

### ขั้นตอนที่ 2 — useState กับ TypeScript

TypeScript ช่วยให้ `useState` ปลอดภัยขึ้น — กำหนด Type ให้ชัดเจน:

::: code-group
```tsx [✅ กำหนด Type ให้ useState]
// string state
const [status, setStatus] = useState<string>('available')

// number state
const [count, setCount] = useState<number>(0)

// boolean state
const [isLoading, setIsLoading] = useState<boolean>(false)

// null-able state — ยังไม่มีข้อมูล
const [selectedId, setSelectedId] = useState<number | null>(null)
```

```tsx [💡 Type Inference — TS เดาเองได้]
// ถ้าให้ค่าเริ่มต้น TS จะรู้ Type เองโดยอัตโนมัติ
const [status, setStatus] = useState('available')   // รู้ว่า string
const [count, setCount]   = useState(0)             // รู้ว่า number

// แต่ถ้าค่าเริ่มต้นเป็น null ต้องระบุ Type เอง
const [selectedId, setSelectedId] = useState<number | null>(null)
```

```tsx [❌ ผิด — setStatus ไม่รับ number]
const [status, setStatus] = useState<string>('available')

setStatus(42)  // ❌ Type 'number' is not assignable to type 'string'
```
:::

### ขั้นตอนที่ 3 — หลาย State ใน Component เดียว

```tsx [src/components/EquipmentCard.tsx]
import { useState } from 'react'

interface EquipmentCardProps {
  name:     string
  category: string
  status:   string
}

export function EquipmentCard({ name, category, status: initialStatus }: EquipmentCardProps) {
  // แต่ละ State เป็นอิสระจากกัน — เปลี่ยนอันเดียวไม่กระทบอีกอัน
  const [status, setStatus]       = useState(initialStatus)
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 12, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{name}</h3>
        <span>{status}</span>
      </div>

      {/* แสดงรายละเอียดเมื่อ expanded */}
      {isExpanded && <p style={{ color: '#666' }}>{category}</p>}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'ซ่อน' : 'แสดงรายละเอียด'}
        </button>
        {status === 'available' && (
          <button onClick={() => setStatus('borrowed')}>
            ยืม
          </button>
        )}
        {status === 'borrowed' && (
          <button onClick={() => setStatus('available')}>
            คืน
          </button>
        )}
      </div>
    </div>
  )
}
```

#### 🔷 TypeScript ในบทนี้

บทนี้แนะนำการกำหนด Type Parameter ให้ `useState` และการใช้ Union Type กับ state

| ชนิด | ใช้เก็บ | ตัวอย่างในบทนี้ |
| :--- | :--- | :--- |
| `useState<string>` | ข้อความ เช่น สถานะอุปกรณ์ | `useState<string>('available')` |
| `useState<boolean>` | ค่า true/false เช่น toggle | `useState<boolean>(false)` |
| <code>useState&lt;number \| null&gt;</code> | ตัวเลขที่อาจยังไม่มีค่า | <code>useState&lt;number \| null&gt;(null)</code> |

::: code-group
```ts [✅ ถูกต้อง]
const [status, setStatus] = useState<string>('available')
const [id, setId]         = useState<number | null>(null)

setStatus('borrowed')  // ✅ string ถูกต้อง
setId(5)               // ✅ number ถูกต้อง
setId(null)            // ✅ null ถูกต้อง
```

```ts [❌ ผิด]
const [status, setStatus] = useState<string>('available')

setStatus(42)     // ❌ number ไม่ใช่ string
setStatus(true)   // ❌ boolean ไม่ใช่ string
```
:::

### useState&lt;T&gt; กับ Array State

เมื่อ state เป็น array ต้องระบุ Generic เสมอ เพราะ TypeScript ไม่รู้ type จากค่าเริ่มต้น `[]`:

::: code-group
```tsx [✅ ระบุ Generic ให้ array state]
const [equipments, setEquipments] = useState<Equipment[]>([])
const [names, setNames]           = useState<string[]>([])
// TypeScript รู้ว่า equipments เป็น Equipment[] — ไม่ใช่ never[]
```
```tsx [❌ ไม่ระบุ Generic — TS เดาเป็น never[]]
const [equipments, setEquipments] = useState([])
// equipments: never[] — ใส่อะไรเข้าไปก็ Error
```
:::

> `Generic<T>` แบบสร้างเองจะสอนเต็มใน wk3 — wk2 แค่ใช้ `useState<T>`

### Array & Object Immutability

React เปรียบเทียบ state ด้วย reference (ที่อยู่ใน memory) ไม่ใช่ค่าภายใน ถ้า mutate โดยตรง reference ไม่เปลี่ยน React จะไม่ re-render:

::: code-group
```tsx [✅ spread — สร้าง array/object ใหม่]
// array: เพิ่ม item ใหม่
setEquipments(prev => [...prev, newItem])

// array: แก้ไข item
setEquipments(prev => prev.map(eq =>
  eq.id === id ? { ...eq, status: 'borrowed' } : eq
))

// object: แก้ค่า property
setForm(prev => ({ ...prev, name: 'MacBook Pro' }))
```
```tsx [❌ mutate ตรง — UI ไม่ re-render]
// array push: reference เดิม React ไม่รู้ว่าเปลี่ยน
equipments.push(newItem)
setEquipments(equipments)  // ❌ reference เดิม!

// object assign
form.name = 'MacBook Pro'  // ❌ mutate โดยตรง
setForm(form)
```
:::

### Functional setState — `prev =>`

ใช้เมื่อ state ใหม่ขึ้นอยู่กับค่าเก่า (เพื่อหลีกเลี่ยง stale state):

::: code-group
```tsx [✅ functional setState — ได้ค่าล่าสุดเสมอ]
// เพิ่ม count ทีละ 1 — ปลอดภัยแม้ React batch updates
setCount(prev => prev + 1)

// ลบ item จาก array
setEquipments(prev => prev.filter(eq => eq.id !== id))
```
```tsx [❌ อ้างอิง state เก่าโดยตรง — อาจ stale]
// ถ้า React batch หลาย setState พร้อมกัน
// count อาจยังเป็นค่าเก่าอยู่
setCount(count + 1)  // ❌ อาจได้ค่าผิดใน edge case
```
```tsx [💡 กฎง่าย ๆ]
// state ใหม่ต้องอ้าง state เก่า → ใช้ prev =>
// state ใหม่ไม่ต้องอ้าง state เก่า → ส่งค่าตรง ๆ ได้
setStatus('borrowed')         // ✅ ส่งตรง
setCount(prev => prev + 1)   // ✅ ต้อง prev =>
```
:::

### Destructuring Syntax

React ใช้ destructuring ทุกที่ — ต้องอ่านและเขียนได้คล่อง:

::: code-group
```tsx [✅ destructuring รูปแบบต่าง ๆ]
// array destructuring — useState
const [count, setCount] = useState(0)

// object destructuring — Props
function EquipmentCard({ name, status }: EquipmentCardProps) {
  // ใช้ name และ status ได้เลยโดยไม่ต้อง props.name
}

// default value — ถ้าไม่ส่ง status มา ใช้ 'available'
function Card({ status = 'available' }: CardProps) {}
```
```tsx [💡 nested destructuring]
// ดึงค่าลึก 2 ระดับ
const { user: { name } } = auth
// เทียบเท่า: const name = auth.user.name
```
:::

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ อยากเข้าใจว่า `useState` ทำงานอย่างไร ทำไมต้องใช้ `setStatus` แทนการ assign ตรง ๆ เช่น `status = 'borrowed'` และเมื่อเรียก `setStatus` React รู้ได้อย่างไรว่าต้อง re-render — ช่วยอธิบายแบบเข้าใจง่ายพร้อมตัวอย่างเล็ก ๆ"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่าทำไม `const` ธรรมดาไม่ทำให้ React re-render แต่ `useState` ทำได้
- [ ] บอกได้ว่าเมื่อไหร่ต้องระบุ Generic `<T>` ใน `useState<T>` เองแทนที่จะปล่อยให้ TypeScript เดา
:::

### 📝 PjBL Lab — ชิ้นงาน: `App.tsx`, `EquipmentCard.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม footer ชื่อ-รหัสของตนเองใน `App.tsx` ✅

**ขั้น 1: ทดสอบ State พื้นฐาน (10 นาที)**

- [ ] สร้างโปรเจกต์ใหม่หรือเปิดของเดิมจาก wk1
- [ ] เพิ่ม `useState` ใน `App.tsx` เก็บ `status` ค่าเริ่มต้น `'available'`
- [ ] แสดง `{status}` ในหน้าเว็บ
- [ ] เพิ่มปุ่ม "ยืม" และ "คืน" เรียก `setStatus` → กดปุ่มแล้วข้อความต้องเปลี่ยน ✅

**ขั้น 2: State กับ TypeScript (10 นาที)**

- [ ] ลอง `setStatus(42)` (ตัวเลข) → TypeScript ต้องแจ้ง Error ✅
- [ ] เพิ่ม state `isExpanded: boolean` เริ่มต้น `false`
- [ ] ใช้ `&&` แสดงรายละเอียดเมื่อ `isExpanded` เป็น `true`
- [ ] เพิ่มปุ่ม toggle ที่เรียก `setIsExpanded(!isExpanded)` ✅

**ขั้น 3: หลาย State (10 นาที)**

- [ ] เพิ่ม `count: number` state เริ่มต้น `0`
- [ ] แสดงค่า count และเพิ่มปุ่ม `+1` เรียก `setCount(count + 1)`
- [ ] ดูว่า state ทั้งหมดทำงานอิสระจากกัน ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add . && git commit -m "wk2-state: useState พื้นฐาน + TypeScript types by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ `setStatus` แทนที่จะ assign `status = 'borrowed'` ตรง ๆ?
**แนวคำตอบ:** `const [status, setStatus] = useState(...)` ทำให้ `status` เป็น `const` — assign ตรงไม่ได้อยู่แล้ว แต่สำคัญกว่านั้น: React ไม่รู้ว่ามีอะไรเปลี่ยนถ้าไม่ผ่าน setter — `setStatus` คือสัญญาณบอก React ว่า "re-render ที!" ถ้า assign ตรงๆ ค่าเปลี่ยน แต่ UI ไม่อัปเดต
:::

::: details ❓ `useState<string>('available')` กับ `useState('available')` ต่างกันไหม?
**แนวคำตอบ:** เหมือนกันในกรณีนี้ — TypeScript อนุมานได้จากค่าเริ่มต้นว่าเป็น `string` ต้องระบุ Generic `<T>` เองเมื่อค่าเริ่มต้นไม่ชัดเจน เช่น `useState<number | null>(null)` เพราะ `null` อย่างเดียว TypeScript ไม่รู้ว่าจะเก็บ `number` ในอนาคต
:::

::: details ❓ State ของ Component A กับ Component B เชื่อมกันได้ไหม?
**แนวคำตอบ:** State ของแต่ละ Component เป็นอิสระจากกันโดยค่าเริ่มต้น ถ้าต้องการ share state ระหว่าง component ต้องทำผ่าน props (ส่งจากแม่ลงลูก) หรือ Context API (wk5) — เรื่องนี้จะเรียนในบทถัดไป
:::

::: details ❓ ถ้า `setStatus` ถูกเรียกซ้ำ ๆ อย่างรวดเร็ว React จัดการอย่างไร?
**แนวคำตอบ:** React batches การ re-render ไว้ด้วยกัน — ถ้าเรียก setter หลายครั้งใน event handler เดียว React จะ re-render แค่ครั้งเดียวหลังจากทุก setter ทำงานเสร็จ ไม่ใช่ re-render ทีละครั้ง ทำให้แอปทำงานได้เร็ว
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| UI ไม่เปลี่ยนเมื่อกดปุ่ม | assign ตรงเช่น `status = 'borrowed'` แทนที่จะเรียก setter | เปลี่ยนเป็น `setStatus('borrowed')` เสมอ |
| `Type 'number' is not assignable to type 'string'` | เรียก setter ด้วยค่า type ผิด เช่น `setStatus(42)` | ตรวจ type ที่กำหนดใน `useState<T>` ให้ตรงกับค่าที่ส่ง |
| State เปลี่ยนแล้วแต่ค่าเก่ายังอยู่ใน event handler | JavaScript closures — ค่าใน handler ยังเป็น snapshot เก่า | ใช้ functional update เช่น `setCount(prev => prev + 1)` |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| useState พื้นฐาน | ปุ่มเปลี่ยน state ได้ถูกต้อง | มี useState แต่ปุ่มไม่ทำงาน | ยังไม่ได้ใช้ useState |
| TypeScript + useState | กำหนด Type ถูก TS Error ถูกต้อง | มี Type แต่ไม่ครบ | ไม่ได้ระบุ Type |
| หลาย State | State หลายตัวทำงานอิสระ | มีบางตัว | ตัวเดียว |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `State` | สเตต | ข้อมูลใน Component ที่ React จับตามอง — เปลี่ยนแล้ว UI อัปเดต |
| `useState` | อิว-สเตต | Hook สำหรับสร้าง state ใน Function Component |
| `Setter` | เซ็ท-เตอร์ | ฟังก์ชันที่ได้จาก useState สำหรับเปลี่ยนค่า state |
| `Re-render` | รี-เรน-เดอร์ | React วาด UI ใหม่เมื่อ state หรือ props เปลี่ยน |
| `Destructuring` | ดี-สตรัก-เจอ-ริง | `const [a, b] = useState(...)` — แกะค่าออกจาก array |
| `Batch Update` | แบ็ทช์ อัพ-เดท | React รวมการ re-render หลาย ๆ ครั้งไว้เป็นครั้งเดียว |
