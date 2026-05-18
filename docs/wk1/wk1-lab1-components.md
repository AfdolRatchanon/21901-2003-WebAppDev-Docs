# Lab: สร้าง Component และ Props <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** สร้าง `EquipmentCard` Component แรก — ใช้เป็นฐานสำหรับ wk2 (State) และ wk4 (API Data)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายต้องแสดง **รายการอุปกรณ์หลายสิบชิ้น** เช่น MacBook Pro, iPad Air, Projector — ถ้าเขียน HTML ซ้ำทุกชิ้น โค้ดจะยาวมาก และแก้ทีเดียวต้องแก้หลายจุด **Component + Props** แก้ปัญหานี้ได้: ออกแบบการ์ดครั้งเดียว ส่งข้อมูลต่างกันในแต่ละครั้ง
:::

> 💡 **เปรียบเทียบ:** Component เหมือน "แม่แบบการ์ดสินค้า" — ออกแบบรูปแบบครั้งเดียว กรอกชื่อสินค้าต่างกันในแต่ละใบ ไม่ต้องวาดใหม่ทุกครั้ง

## 📖 I: Information

### Component และ Props คืออะไร?

**Component** คือฟังก์ชัน TypeScript ที่ `return` JSX — ออกแบบครั้งเดียว ใช้ซ้ำได้หลายครั้งโดยส่งข้อมูลต่างกันผ่าน Props ทุกหน้าที่ใช้ Component นั้น จะอัปเดตพร้อมกันเมื่อแก้ไขที่ไฟล์เดียว

**Props** คือข้อมูลที่ส่งจาก Component แม่เข้าสู่ Component ลูก — เหมือน function arguments ที่กำหนดว่า Component จะแสดงข้อมูลอะไร ใน TypeScript ต้องกำหนด Interface บอกชนิดของแต่ละ prop

### ขั้นตอนที่ 1 — สร้าง EquipmentCard เวอร์ชัน 1

::: code-group
```tsx [src/components/EquipmentCard.tsx]
interface EquipmentCardProps {      // [1] กำหนดชนิดของ props
  name:     string
  category: string
  status:   string
}

export function EquipmentCard({ name, category, status }: EquipmentCardProps) {
  const statusLabel: Record<string, string> = {  // [2] แปลงสถานะเป็นภาษาไทย
    available:   'ว่าง',
    borrowed:    'ถูกยืม',
    maintenance: 'ซ่อมบำรุง',
  }

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 8 }}>
      <h3 style={{ margin: '0 0 4px 0' }}>{name}</h3>
      <p style={{ color: '#666', margin: '0 0 4px 0' }}>{category}</p>
      <p style={{ margin: 0 }}>สถานะ: {statusLabel[status] ?? status}</p>
    </div>
  )
}
```

```tsx [src/App.tsx — ใช้งาน EquipmentCard]
import { EquipmentCard } from './components/EquipmentCard'  // [1] import Component

export default function App() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>รายการอุปกรณ์ไอที</h1>
      <EquipmentCard name="MacBook Pro"    category="Notebook"  status="available"   />
      <EquipmentCard name="iPad Air"       category="Tablet"    status="borrowed"    />
      <EquipmentCard name="Projector Epson" category="Projector" status="maintenance" />
    </div>
  )
}
```
:::

**สรุปการทำงาน:** `App.tsx` ส่ง Props → `EquipmentCard` รับ → แสดงผลตามค่าที่ได้รับ

::: tip 💡 TypeScript ตรวจสอบ Props ให้อัตโนมัติ
ลองลบ prop `category` ออกจาก `<EquipmentCard>` → TypeScript ขีดเส้นแดงทันที:
```
Property 'category' is missing in type '{ name: string; status: string; }'
but required in type 'EquipmentCardProps'
```
นี่คือพลังของ TypeScript: รู้ก่อน runtime ว่าส่งข้อมูลไม่ครบ
:::

### ขั้นตอนที่ 2 — เพิ่ม Status Badge (เวอร์ชัน 2)

บรรทัดสีเขียวคือส่วนที่เพิ่มเข้ามาจากเวอร์ชัน 1:

::: code-group
```tsx {15-20,39-49} [src/components/EquipmentCard.tsx — เวอร์ชัน 2]
interface EquipmentCardProps {
  name:     string
  category: string
  status:   string
}

export function EquipmentCard({ name, category, status }: EquipmentCardProps) {
  const statusLabel: Record<string, string> = {
    available:   'ว่าง',
    borrowed:    'ถูกยืม',
    maintenance: 'ซ่อมบำรุง',
  }

  // สีพื้นหลัง badge ตามสถานะ
  const badgeColor: Record<string, string> = {
    available:   '#16a34a',
    borrowed:    '#dc2626',
    maintenance: '#d97706',
  }

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: 8,
      padding: 16,
      marginBottom: 8,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}>

      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{name}</h3>
        <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>{category}</p>
      </div>

      <span style={{
        backgroundColor: badgeColor[status] ?? '#94a3b8',
        color: 'white',
        borderRadius: 12,
        padding: '2px 10px',
        fontSize: 12,
        fontWeight: 'bold',
      }}>
        {statusLabel[status] ?? status}
      </span>

    </div>
  )
}
```
:::

::: info 📌 หมายเหตุ
Lab นี้ใช้ **Inline Styles** เพื่อให้เห็น concept ก่อน — wk3 จะติดตั้ง Tailwind CSS และเขียน style ด้วย class names เช่น `className="rounded-xl border p-4"` ซึ่งสั้นกว่ามาก
:::

#### 🔷 TypeScript ในบทนี้

| ชนิด | ใช้เก็บ | ตัวอย่างในบทนี้ |
| :--- | :--- | :--- |
| `interface` | กำหนดโครงสร้าง Props | `EquipmentCardProps` |
| Destructuring `{ }` | แกะค่าออกจาก object ตรง ๆ | `{ name, category, status }` |

::: code-group
```ts [✅ ถูกต้อง]
interface EquipmentCardProps {
  name: string
}
// ส่ง props ครบ
<EquipmentCard name="MacBook Pro" category="Notebook" status="available" />
```

```ts [❌ ผิด — TypeScript แจ้งทันที]
// ❌ ขาด category และ status
<EquipmentCard name="MacBook Pro" />

// ❌ ส่งชนิดผิด
<EquipmentCard name={42} category="Notebook" status="available" />
```

```ts [💡 Destructuring vs props.name]
// ทั้งสองให้ผลเหมือนกัน แต่ Destructuring อ่านง่ายกว่า
function Card({ name }: Props) { return <h3>{name}</h3> }    // ✅ นิยมใช้
function Card(props: Props) { return <h3>{props.name}</h3> } // ใช้ได้แต่ยาวกว่า
```
:::

## 🛠️ A: Application

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] เข้าใจว่า `interface` ทำงานอย่างไรใน TypeScript แล้ว
- [ ] สร้างโฟลเดอร์ `src/components/` ได้แล้ว
:::

### 🤖 AI Prompt
::: info 💬 ถาม AI
"กำลังเรียน React 18 กับ TypeScript อยู่ มี Component ชื่อ EquipmentCard รับ props: name (string), category (string), status (string) ช่วยเพิ่ม Badge แสดงสถานะโดยใช้ inline style สีเขียวสำหรับ 'available' สีแดงสำหรับ 'borrowed' สีเหลืองสำหรับ 'maintenance' ขอโค้ดแบบง่าย ไม่ใช้ library ภายนอก"
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/components/EquipmentCard.tsx`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `src/App.tsx` → footer ชื่อของตนเองต้องยังอยู่ ✅

**ขั้น 1: สร้าง Component พื้นฐาน (15 นาที)**

- [ ] สร้างโฟลเดอร์ `src/components/` ใน VS Code
- [ ] สร้างไฟล์ `src/components/EquipmentCard.tsx` — ใส่โค้ดเวอร์ชัน 1
- [ ] แก้ไข `src/App.tsx` ให้ import และใช้ `<EquipmentCard>` 3 รายการ
- [ ] รัน `npm run dev` → ต้องเห็นการ์ด 3 อัน ✅

**ขั้น 2: ทดสอบ TypeScript Error (5 นาที)**

- [ ] ลบ prop `category` ออกจาก `<EquipmentCard>` หนึ่งอัน → สังเกต Error ขีดเส้นแดง ✅
- [ ] เพิ่ม prop ที่ไม่มีใน Interface เช่น `color="red"` → สังเกต Error อีกแบบ ✅
- [ ] แก้กลับให้ครบ → Error ทั้งหมดหาย

**ขั้น 3: เพิ่ม Status Badge (15 นาที)**

- [ ] อัปเดต `EquipmentCard.tsx` เป็นเวอร์ชัน 2 (เพิ่ม `badgeColor` + badge span)
- [ ] ดู Browser — Badge แต่ละสถานะต้องแสดงสีถูกต้อง:
  - `available` → สีเขียว ✅
  - `borrowed` → สีแดง ✅
  - `maintenance` → สีเหลือง ✅

**ขั้น 4: เพิ่มข้อมูลจริง (10 นาที)**

- [ ] เพิ่ม `<EquipmentCard>` อีก 2 อัน ใส่ข้อมูลอุปกรณ์จริงในโรงเรียน
- [ ] ลองส่ง `status="missing"` → สังเกตว่า badge แสดงอะไร (ต้องใช้ fallback `?? '#94a3b8'`)

**ขั้น 5: ส่งงาน**

- [ ] `git add . && git commit -m "wk1-lab: EquipmentCard by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot ✅

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Interface Props ถึงสำคัญ? จะใช้ `any` แทนได้ไหม?
**แนวคำตอบ:** ใช้ `any` ได้แต่ไม่ควร — TypeScript จะหยุดตรวจสอบทุกอย่างสำหรับ props ตัวนั้น เช่น ส่ง `name={42}` (ตัวเลขแทน string) ก็ไม่แจ้ง Error Interface ทำให้ Editor รู้ว่า props มีอะไรบ้าง — พิมพ์ `<EquipmentCard ` แล้ว IntelliSense จะ suggest props ให้อัตโนมัติ
:::

::: details ❓ Destructuring `{ name, category, status }` ต่างจาก `props.name` อย่างไร?
**แนวคำตอบ:** ทั้งสองแบบให้ผลเหมือนกัน แต่ Destructuring อ่านง่ายกว่า — เขียน `{name}` ในโค้ดแทน `props.name` ทุกครั้ง ทำให้ Component code สั้นและสะอาดกว่า ในโปรเจกต์จริงนิยม Destructuring แทบทุกที่
:::

::: details ❓ `export function` กับ `export default function` ต่างกันอย่างไร?
**แนวคำตอบ:** `export function` (Named Export) ต้อง import ด้วยชื่อเดิม: `import { EquipmentCard } from '...'` ส่วน `export default function` import ได้โดยตั้งชื่อเองได้ Convention ใน React: Pages ใช้ default export, Component ย่อยๆ ใช้ named export
:::

::: details ❓ ถ้าต้องแสดง 50 อุปกรณ์ ต้องเขียน `<EquipmentCard>` 50 ครั้งไหม?
**แนวคำตอบ:** ไม่ต้อง — wk4 จะดึงข้อมูลจาก API แล้วใช้ `.map()` วน render อัตโนมัติ:
```tsx
{equipments.map(eq => (
  <EquipmentCard key={eq.id} name={eq.name} category={eq.category} status={eq.status} />
))}
```
ตอนนี้ hardcode ข้อมูลไปก่อนเพื่อเรียนรู้ Props
:::

### 🐛 Common Errors

| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `Cannot find module './components/EquipmentCard'` | ชื่อไฟล์หรือโฟลเดอร์ผิด | ตรวจ path และ case ให้ตรงกับ import |
| Props ไม่แสดงผลในการ์ด | ลืม Destructuring หรือชื่อ prop สะกดผิด | เช็ค interface ว่าชื่อ field ตรงกับที่ส่งมา |
| badge สีไม่แสดง (พื้นหลังว่าง) | `status` ไม่มีใน `badgeColor` | เพิ่ม fallback `?? '#94a3b8'` หรือเพิ่ม key ใน badgeColor |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| สร้าง Component | มี Interface + Destructuring + 3 การ์ด | มี Component แต่ขาด TypeScript | ยังไม่ได้สร้าง |
| ทดสอบ TypeScript Error | ลอง error → TS แจ้งถูกต้อง | ลองแต่ไม่เข้าใจผล | ไม่ได้ทดสอบ |
| Status Badge | 3 สีตรงกับสถานะถูกต้อง | มีบางส่วน | ไม่มี Badge |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Props` | พรอปส์ | Properties — ข้อมูลที่ส่งเข้า Component เหมือน function arguments |
| `Interface` | อิน-เตอร์-เฟซ | กำหนดโครงสร้าง Object ใน TypeScript — บอกว่าต้องมี field อะไรบ้าง |
| `Destructuring` | ดี-สตรัค-เชอ-ริ่ง | แกะข้อมูลออกจาก Object โดยตรง เช่น `{ name, category }` |
| `Named Export` | เนมด์ เอ็กซ์-พอร์ท | `export function Foo()` — import ด้วยชื่อเดิมคือ `{ Foo }` |
| `Conditional Rendering` | คอน-ดิ-ชัน-นัล เรน-เดอ-ริ่ง | แสดง UI ตามเงื่อนไข — ใช้ `? :` หรือ `&&` ใน JSX |
| `Inline Style` | อิน-ไลน์ สไตล์ | กำหนด CSS ตรงใน JSX ด้วย `style={{ ... }}` |
