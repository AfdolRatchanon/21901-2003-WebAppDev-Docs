# Lab: สร้าง Component และ Props <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายต้องแสดง **รายการอุปกรณ์หลายสิบชิ้น** เช่น MacBook Pro, iPad Air, Projector — ถ้าเขียน HTML ซ้ำทุกชิ้น โค้ดจะยาวมาก และแก้ทีเดียวต้องแก้หลายจุด **Component + Props** แก้ปัญหานี้ได้: ออกแบบการ์ดครั้งเดียว ส่งข้อมูลต่างกันในแต่ละครั้ง
:::

> 💡 **เปรียบเทียบ:** Component เหมือน "แม่แบบการ์ดสินค้า" — ออกแบบรูปแบบครั้งเดียว กรอกชื่อสินค้าต่างกันในแต่ละใบ ไม่ต้องวาดใหม่ทุกครั้ง

---

## 📖 I: Information

### Component และ Props คืออะไร?

**Component** คือฟังก์ชัน TypeScript ที่ `return` JSX (HTML-like code) — เขียนครั้งเดียวใช้ซ้ำได้หลายครั้ง

**Props** คือข้อมูลที่ส่งจาก "Component แม่" เข้า "Component ลูก" — เหมือน argument ของฟังก์ชัน

### สร้าง EquipmentCard — ทีละขั้นตอน

**ขั้น 1:** สร้างโฟลเดอร์ `src/components/` และไฟล์ `EquipmentCard.tsx`

::: code-group
```tsx [src/components/EquipmentCard.tsx]
// ขั้น 1: กำหนด Interface สำหรับ Props
// Interface บอก TypeScript ว่า Component นี้รับข้อมูลอะไรบ้าง
interface EquipmentCardProps {
  name:     string  // ชื่ออุปกรณ์ เช่น 'MacBook Pro'
  category: string  // หมวดหมู่ เช่น 'Notebook'
  status:   string  // สถานะ เช่น 'available'
}

// ขั้น 2: สร้าง Component ฟังก์ชัน
// { name, category, status } คือ Destructuring — แกะค่าออกจาก Props object
export function EquipmentCard({ name, category, status }: EquipmentCardProps) {

  // ขั้น 3: แปลงสถานะ เป็นข้อความภาษาไทย
  const statusLabel: Record<string, string> = {
    available:   'ว่าง',
    borrowed:    'ถูกยืม',
    maintenance: 'ซ่อมบำรุง',
  }

  // ขั้น 4: return JSX — HTML ของ Card นี้
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
// import Component ที่สร้างไว้
import { EquipmentCard } from './components/EquipmentCard'

export default function App() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>รายการอุปกรณ์ไอที</h1>

      {/* ใช้ EquipmentCard ซ้ำ 3 ครั้ง ส่ง Props ต่างกัน */}
      <EquipmentCard
        name="MacBook Pro"
        category="Notebook"
        status="available"
      />
      <EquipmentCard
        name="iPad Air"
        category="Tablet"
        status="borrowed"
      />
      <EquipmentCard
        name="Projector Epson"
        category="Projector"
        status="maintenance"
      />
    </div>
  )
}
```
:::

บันทึกไฟล์ → Browser จะแสดงการ์ด 3 อัน ✅

::: tip 💡 TypeScript ตรวจสอบ Props ให้อัตโนมัติ
ลองลบ prop `category` ออกจาก `<EquipmentCard>` → TypeScript ขีดเส้นแดงทันที:

```
Property 'category' is missing in type '{ name: string; status: string; }'
but required in type 'EquipmentCardProps'
```

นี่คือพลังของ TypeScript: รู้ก่อน runtime ว่าส่งข้อมูลไม่ครบ!
:::

---

### เพิ่ม Status Badge ด้วยสีต่างกัน

ใช้ **Conditional Rendering** แสดงสีตามสถานะ:

::: code-group
```tsx [src/components/EquipmentCard.tsx — เวอร์ชัน 2]
interface EquipmentCardProps {
  name:     string
  category: string
  status:   string
}

export function EquipmentCard({ name, category, status }: EquipmentCardProps) {
  // แปลงสถานะเป็นภาษาไทย
  const statusLabel: Record<string, string> = {
    available:   'ว่าง',
    borrowed:    'ถูกยืม',
    maintenance: 'ซ่อมบำรุง',
  }

  // สีพื้นหลัง badge ตามสถานะ
  const badgeColor: Record<string, string> = {
    available:   '#16a34a',  // เขียว
    borrowed:    '#dc2626',  // แดง
    maintenance: '#d97706',  // เหลืองอำพัน
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

      {/* ซ้าย: ชื่อ + หมวดหมู่ */}
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: 16 }}>{name}</h3>
        <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>{category}</p>
      </div>

      {/* ขวา: Status Badge */}
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

ผลลัพธ์ที่ได้: การ์ดแต่ละอันมี badge สีต่างกันตามสถานะ ✅

::: info 📌 หมายเหตุ Tailwind CSS
Lab นี้ใช้ **Inline Styles** เพื่อให้เห็น concept ก่อน — ใน **Week 3** จะติดตั้ง Tailwind CSS และเขียน Style ด้วย class names เช่น `className="rounded-xl border p-4"` ซึ่งสั้นกว่าและดูแลรักษาง่ายกว่ามาก
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 กับ TypeScript อยู่ มี Component ชื่อ EquipmentCard รับ props: name (string), category (string), status (string) ช่วยเพิ่ม Badge แสดงสถานะโดยใช้ inline style สีเขียวสำหรับ 'available' สีแดงสำหรับ 'borrowed' สีเหลืองสำหรับ 'maintenance' ขอโค้ดแบบง่าย ไม่ใช้ library ภายนอก"
:::

### 📝 PjBL Lab

**ขั้น 1: สร้าง Component พื้นฐาน (15 นาที)**

- [ ] สร้างโฟลเดอร์ `src/components/` ใน VS Code
- [ ] สร้างไฟล์ `src/components/EquipmentCard.tsx` — ใส่โค้ดเวอร์ชัน 1 ด้านบน
- [ ] แก้ไข `src/App.tsx` ให้ import และใช้ `<EquipmentCard>` 3 รายการ
- [ ] รัน `npm run dev` → ดู Browser ต้องเห็นการ์ด 3 อัน ✅

**ขั้น 2: ทดสอบ TypeScript Error (5 นาที)**

- [ ] ลบ prop `category` ออกจาก `<EquipmentCard>` หนึ่งอัน → สังเกต Error ขีดเส้นแดง ✅
- [ ] เพิ่ม prop ที่ไม่มีใน Interface เช่น `color="red"` → สังเกต Error อีกแบบ ✅
- [ ] แก้กลับให้ครบ → Error ทั้งหมดหาย

**ขั้น 3: เพิ่ม Status Badge (15 นาที)**

- [ ] อัปเดต `EquipmentCard.tsx` เป็นเวอร์ชัน 2 (เพิ่ม Badge ด้วยสี)
- [ ] ดู Browser — Badge แต่ละสถานะต้องแสดงสีถูกต้อง:
  - `available` → สีเขียว ✅
  - `borrowed` → สีแดง ✅
  - `maintenance` → สีเหลือง ✅

**ขั้น 4: เพิ่มข้อมูลจริง (10 นาที)**

- [ ] เพิ่ม `<EquipmentCard>` อีก 2 อัน ใส่ข้อมูลอุปกรณ์จริงในโรงเรียน
- [ ] ลองส่ง `status="missing"` (ค่าที่ไม่ได้กำหนดไว้) → สังเกตว่า badge แสดงอะไร
- [ ] (ถ้าเวลาเหลือ) เพิ่ม prop `serialNo: string` สำหรับแสดง Serial Number

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Interface Props ถึงสำคัญ? จะใช้ `any` แทนได้ไหม?
**แนวคำตอบ:** ใช้ `any` ได้แต่ไม่ควร — TypeScript จะหยุดตรวจสอบทุกอย่างสำหรับ props ตัวนั้น เช่น ส่ง `name={42}` (ตัวเลขแทน string) ก็ไม่แจ้ง Error Interface ทำให้ Editor รู้ว่า props มีอะไรบ้าง — พิมพ์ `<EquipmentCard ` แล้ว IntelliSense จะ suggest props ให้อัตโนมัติ ประหยัดเวลาและลด typo
:::

::: details ❓ Destructuring `{ name, category, status }` ต่างจาก `props.name` อย่างไร?
**แนวคำตอบ:** ทั้งสองแบบให้ผลเหมือนกัน แต่ Destructuring อ่านง่ายกว่า — เขียน `{name}` ในโค้ดแทน `props.name` ทุกครั้ง ทำให้ Component code สั้นและสะอาดตากว่า ในโปรเจกต์จริงนิยม Destructuring แทบทุกที่
:::

::: details ❓ `export function` กับ `export default function` ต่างกันอย่างไร?
**แนวคำตอบ:** `export function` (Named Export) ต้อง import ด้วยชื่อเดิม: `import { EquipmentCard } from '...'` ส่วน `export default function` import ได้โดยตั้งชื่อเองได้: `import App from '...'` หรือ `import MyApp from '...'` ก็ได้ Convention ใน React: Pages ใช้ default export, Components ย่อย ใช้ named export
:::

::: details ❓ ถ้าต้องแสดง 50 อุปกรณ์ ต้องเขียน `<EquipmentCard>` 50 ครั้งไหม?
**แนวคำตอบ:** ไม่ต้อง — ใน Week 4 จะดึงข้อมูลจาก API แล้วใช้ `.map()` วน render Component ให้อัตโนมัติ:
```tsx
{equipments.map(eq => (
  <EquipmentCard key={eq.id} name={eq.name} category={eq.category} status={eq.status} />
))}
```
ตอนนี้ hardcode ข้อมูลไปก่อนเพื่อเรียนรู้ Props
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| สร้าง Component | มี Interface + Destructuring + 3 การ์ด | มี Component แต่ขาด TypeScript | ยังไม่ได้สร้าง |
| ทดสอบ TypeScript Error | ลอง error → TS แจ้งถูกต้อง | ลองแต่ไม่เข้าใจผล | ไม่ได้ทดสอบ |
| Status Badge | 3 สีตรงกับสถานะถูกต้อง | มีบางส่วน | ไม่มี Badge |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Props` | Properties — ข้อมูลที่ส่งเข้า Component เหมือน function arguments |
| `Interface` | กำหนดโครงสร้าง Object ใน TypeScript — บอกว่าต้องมี field อะไรบ้าง |
| `Destructuring` | แกะข้อมูลออกจาก Object โดยตรง เช่น `{ name, category }` |
| `Named Export` | `export function Foo()` — import ด้วยชื่อเดิมคือ `{ Foo }` |
| `Conditional Rendering` | แสดง UI ตามเงื่อนไข — ใช้ `? :` หรือ `&&` ใน JSX |
| `Inline Style` | กำหนด CSS ตรงใน JSX ด้วย `style={{ ... }}` |
