# 📘 Vocational Web Dev: Content Pattern & Standard

คู่มือและมาตรฐานการเขียนเนื้อหารายวิชา 21901-2003 การพัฒนาเว็บแอปพลิเคชัน
ออกแบบมาเพื่อการจัดการเรียนการสอนอาชีวศึกษา (Active Learning + PjBL + MIAP + CLIL)

> 🤖 **AI-Generated Textbook:** เอกสารนี้เป็น "แม่แบบ (Blueprint)" สำหรับให้ AI สร้างเนื้อหาบทเรียนลงใน VitePress

---

## ⚙️ คำชี้แจงสำหรับ AI

1. **Project Reference:** เปิด `project/frontend/src/` ดูไฟล์จริงก่อนเขียนทุกครั้ง — ห้ามแต่งชื่อ component / variable / interface ขึ้นมาใหม่
2. **TypeScript Just-in-Time:** สอน TypeScript ตามระดับที่ระบุใน Course Outline เท่านั้น
3. **บริบท:** สอดแทรก "ระบบเบิก-จ่ายอุปกรณ์ไอที" ในทุกตัวอย่างและใบงาน
4. **Incremental:** แต่ละ wk เพิ่มโค้ด **2-5 บรรทัด** จาก wk ก่อน — ห้ามโยนโค้ดใหม่ทั้งก้อน

---

## 📁 Naming Convention

| Pattern | ใช้สำหรับ | ตัวอย่าง |
| :--- | :--- | :--- |
| `wkX-contentY-topic.md` | บทเรียนทฤษฎี | `wk3-content1-tailwind.md` |
| `wkX-labY-topic.md` | ใบงานปฏิบัติ | `wk3-lab1-asset-form.md` |
| `wkX-project.md` | จุดเช็คพอยต์ | `wk5-project-midterm.md` |

---

## 🏅 Layout Blueprint (MIAP)

ทุกหน้าต้องมีโครงสร้างนี้ครบ:

```markdown
# ชื่อหัวข้อ <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** [concept ที่สอน] — จะใช้จริงใน wkY เรื่อง [ชื่อหัวข้อ]

## 🎯 M: Motivation
::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
[ปัญหาจากระบบเบิก-จ่ายฯ ที่เกิดขึ้นจริง ถ้าไม่มี concept นี้]
:::
> 💡 **เปรียบเทียบ:** [อุปมาเชื่อมกับชีวิตประจำวัน]

## 📖 I: Information
[เนื้อหา Code-First เรียงง่ายไปยาก — ดู Information Patterns]

#### 🔷 TypeScript ในบทนี้
[type / interface ที่ใช้จริงใน concept บทนี้ — ใช้ Code Tabs ✅/❌/💡]

## 🛠️ A: Application

::: tip ✅ เช็คก่อนเริ่ม Lab
- [ ] [สิ่งที่ต้องเข้าใจก่อนทำ Lab]
:::

### 🤖 AI Prompt
::: info 💬 ถาม AI
"[Prompt สั้น ๆ เกี่ยวกับ concept บทนี้]"
:::

### 📝 PjBL Lab — ชิ้นงาน: [ชื่อไฟล์/component ที่สร้าง]
[ใบงาน — ดู Lab Pattern]

## ✅ P: Progress

### 🗣️ Code Review
::: details ❓ [คำถาม] (3-4 ข้อ เน้น "ทำไม" ไม่ใช่ "อะไร")
**แนวคำตอบ:** [ไม่เกิน 3 ประโยค]
:::

### 🐛 Common Errors
| Error / อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |

### 📋 Rubric (10 คะแนน)
| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |

### 📚 CLIL Vocabulary
| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
```

**กฎเพิ่มเติม:**
- `บทนี้เตรียมอะไร` ต้องระบุ wk + ชื่อหัวข้อจริงจาก Course Outline — ถ้าเป็นบทแรกสุดใส่ว่า "ใช้ตลอดทั้ง course"
- `ชิ้นงาน` ต้องระบุชื่อไฟล์จริงที่นักเรียนจะได้ในตอนท้าย Lab เสมอ
- Common Errors: ใส่เฉพาะ Error ที่เกิดจาก concept ในบทนั้น
- Code Review: สลับคำถามแบบ เปรียบเทียบ / อธิบาย / ทำไม — ห้ามถามสิ่งที่ I ไม่ได้สอน

---

## 🎨 Information Patterns

### รูปแบบ 1: Step-by-step

```markdown
### ขั้นตอนที่ 1 — ชื่อขั้นตอน

อธิบาย 1-2 บรรทัด

\`\`\`bash
npm create vite@latest my-project -- --template react-ts
\`\`\`

Terminal จะแสดงผล:

\`\`\`
✔ Project name: my-project
Done. Now run: cd my-project && npm install
\`\`\`
```

**กฎ:** ทุกคำสั่งต้องมี expected output — ถ้ามีการสร้างไฟล์/โฟลเดอร์ใหม่ให้แสดง folder tree ก่อนเสมอ:

```
src/
├── components/
│   └── EquipmentCard.tsx   ← สร้างในขั้นตอนนี้
└── App.tsx
```

---

### รูปแบบ 2: โค้ดอธิบายทีละบรรทัด

```markdown
::: code-group
\`\`\`tsx [src/main.tsx]
import { StrictMode } from 'react'            // [1] นำเข้า StrictMode
import { createRoot } from 'react-dom/client' // [2] นำเข้าฟังก์ชัน createRoot
import App from './App.tsx'                   // [3] นำเข้า Component หลัก

createRoot(document.getElementById('root')!).render(
  <StrictMode>   {/* [4] ตรวจจับ bug ระหว่าง development */}
    <App />
  </StrictMode>,
)
\`\`\`
:::

**สรุปการทำงาน:**
1. Browser เปิด `index.html`
2. React วาง `<App />` ลงใน `<div id="root">`
```

**กฎ:** ใช้ `// [1] [2]...` เฉพาะบรรทัดที่ไม่ชัดเจน — ห้ามใช้ "อธิบายทีละบรรทัด:" block หลังโค้ด ตามด้วย "สรุปการทำงาน:" เท่านั้น — 1 block ไม่เกิน 10 บรรทัด

---

### รูปแบบ 3: Code Tabs ✅/❌/💡

```markdown
::: code-group
\`\`\`ts [✅ ถูกต้อง]
const equipmentName: string = 'MacBook Pro'
const totalCount: number = 6
\`\`\`

\`\`\`ts [❌ ผิด]
const totalCount: number = 'หก'  // ❌ Type 'string' is not assignable to type 'number'
\`\`\`

\`\`\`ts [💡 Type Inference]
const equipmentName = 'MacBook Pro'  // TypeScript เดา type ได้เองจากค่าที่กำหนด
\`\`\`
:::
```

**กฎ:** ต้องมีครบ 3 tab — แต่ละ tab ไม่เกิน 5 บรรทัด

---

### รูปแบบ 4: Progressive Versions + Diff Syntax

แต่ละเวอร์ชันเพิ่มโค้ด **2-5 บรรทัด** จากเวอร์ชันก่อน ใช้ `[!code ++]` / `[!code --]` แสดงทุกครั้ง

> **JSX rule:** ใช้ `// [!code ++]` ท้ายบรรทัดได้ทั้ง TypeScript lines และ JSX element lines — ห้ามใช้ `{/* [!code ++] */}` เพราะ VitePress ไม่รู้จัก JSX comment syntax และจะแสดงปีกกา `{}` ออกมา

```markdown
### EquipmentCard เวอร์ชัน 1 — พื้นฐาน

\`\`\`tsx
// wk2 — เวอร์ชัน 1: แสดงข้อมูลพื้นฐาน
export function EquipmentCard({ name, status }: Props) {
  return <div><h3>{name}</h3><p>{status}</p></div>
}
\`\`\`

บันทึกไฟล์ → ต้องเห็นข้อมูลแสดงใน Browser ✅

### EquipmentCard เวอร์ชัน 2 — เพิ่ม Status Badge

\`\`\`tsx
// wk2 — เวอร์ชัน 2: เพิ่มสีตามสถานะ
export function EquipmentCard({ name, status }: Props) {
  const color = { available: 'green', borrowed: 'red' }  // [!code ++]
  return (
    <div>
      <h3>{name}</h3>
      <p>{status}</p>                                     // [!code --]
      <span style={{ color: color[status] }}>{status}</span>  // [!code ++]
    </div>
  )
}
\`\`\`

บันทึกไฟล์ → ต้องเห็นสีเขียว/แดงตาม status ✅
```

**กฎ:** ทุกเวอร์ชันต้องรันได้จริงและมี expected output — นักเรียนไม่ต้องรอเวอร์ชันสุดท้ายแล้วค่อยเห็นผล

---

### รูปแบบ 5: Mermaid Diagram

ใช้เพื่ออธิบาย flow หรือ architecture ที่ ASCII art ทำได้ไม่ชัดเจน

```markdown
\`\`\`mermaid
flowchart LR
  App --> EquipmentPage --> EquipmentCard
\`\`\`
ภาษาไทยอธิบายวางนอก diagram: EquipmentPage รับ props จาก App และส่งต่อให้ EquipmentCard
```

**ประเภทที่ใช้ได้:**

| Type | ใช้สำหรับ | ตัวอย่าง |
| :--- | :--- | :--- |
| `flowchart LR` | Props flow, Data flow | wk1, wk3 |
| `graph TD` | Component tree, File structure | wk1, wk3 |
| `sequenceDiagram` | API request/response cycle | wk4, wk6 |

**กฎ Mermaid:**
- ✅ node label เป็นอังกฤษ: `App`, `EquipmentPage`, `API`
- ✅ คำอธิบายภาษาไทยวางเป็น paragraph ข้างนอก diagram
- ❌ ห้าม: `node["ส่ง props ลงไป"]` — Thai text ใน node ทำให้ build พัง

---

### รูปแบบ 7: Theory Foundation Section

ใช้เมื่อหน้านั้นต้องอธิบาย concept เชิงทฤษฎีก่อนเข้าโค้ด วางก่อน I: Information

```markdown
## 📖 I: Information

### แนวคิดหลัก: [ชื่อ concept]

[อธิบาย 2-3 ประโยค: ทำไมต้องมี + แก้ปัญหาอะไร]

\`\`\`
ASCII art หรือ Mermaid แสดง concept
\`\`\`

[เปรียบเทียบกับชีวิตจริง 1 ประโยค]

> ➡️ ตอนนี้ดูโค้ดที่รันได้จริง:
```

**กฎ:** Theory Foundation ต้องสั้น — ไม่เกิน 1 หน้า A4 / ต้องมี diagram / จบด้วยเชื่อมเข้าโค้ดเสมอ

---

### Naming Convention Standard (บังคับทุกหน้าที่สอน TypeScript)

เพิ่มตารางนี้ใน Section เกี่ยวกับ naming ครั้งแรกที่ปรากฏในบทนั้น:

| รูปแบบ | ใช้สำหรับ | ตัวอย่าง |
| :--- | :--- | :--- |
| `PascalCase` | Component, Interface, Type, Props type | `EquipmentCard`, `Equipment`, `EquipmentStatus`, `EquipmentCardProps` |
| `camelCase` | variable, function, hook, event handler | `equipments`, `fetchData`, `useAuth`, `handleBorrow` |
| `use` prefix | Custom hook เท่านั้น | `useAuth`, `useEquipments` |
| `handle` prefix | Event handler | `handleSubmit`, `handleBorrow` |
| `is/has/can` prefix | Boolean state/prop | `isLoading`, `isAuthenticated`, `hasError` |
| `UPPER_SNAKE` | Constant ที่ไม่เปลี่ยนค่า | `API_URL`, `MAX_RETRY` (ไม่ค่อยใช้ใน React) |

**กฎไฟล์:**
- Component/Page → `PascalCase.tsx`: `EquipmentCard.tsx`, `LoginPage.tsx`
- Hook → `camelCase.ts`: `useAuth.ts`, `useEquipments.ts`
- Utility/Type → `camelCase.ts`: `index.ts`, `api.ts`
- Style → ตาม component: `EquipmentCard.module.css` (ถ้าใช้ CSS Modules)

---

### Critical Bugs Section (เพิ่มใน P: Progress ของ Lab ที่เกี่ยวข้อง)

```markdown
### 🐛 Critical Bugs ที่พบบ่อย

| Bug | ❌ ผิด | ✅ ถูก | ผลที่ตามมา |
| :--- | :--- | :--- | :--- |
| Array mutation | `arr.push(item)` | `[...arr, item]` | UI ไม่ re-render |
| Object mutation | `obj.key = value` | `{ ...obj, key: value }` | UI ไม่ re-render |
| 0 && render | `{count && <Item />}` | `{count > 0 && <Item />}` | แสดง "0" บนหน้าจอ |
| ลืม preventDefault | `handleSubmit(e) {}` | `e.preventDefault()` บรรทัดแรก | หน้า refresh ตอน submit |
| Stale state | `setX(x + 1)` ใน loop | `setX(prev => prev + 1)` | state ไม่อัปเดตครบ |
```

---

### รูปแบบ 6: TypeScript Sub-section (บังคับทุกหน้า)

วางท้าย I: Information เสมอ:

```markdown
#### 🔷 TypeScript ในบทนี้

::: code-group
\`\`\`ts [✅ ถูกต้อง]
interface Equipment {
  id: number
  name: string
  status: 'available' | 'borrowed'
}
\`\`\`

\`\`\`ts [❌ ผิด]
const equipment = {}  // ❌ ไม่รู้ว่ามี field อะไร — Editor ช่วยไม่ได้
\`\`\`
:::
```

**กฎ:** สอนเฉพาะ type ที่ใช้จริงในบทนั้น — ดูระดับที่อนุญาตจาก Course Outline ก่อนเสมอ

---

## 📝 Lab Pattern

### ขั้น 0: Student Identity (บังคับทุก Lab)

```markdown
**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม footer แสดงชื่อที่ด้านล่างสุดของ Component หลัก:

\`\`\`tsx
<footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
\`\`\`

- [ ] บันทึกไฟล์ → ต้องเห็นชื่อปรากฏบนหน้าเว็บ ✅
```

### ขั้นที่เหลือ

```markdown
**ขั้น 1: ชื่อขั้น (X นาที)**
- [ ] task → npm run dev → ต้องเห็น [ผลลัพธ์ที่ระบุ] ✅

**ขั้น 2: ทดสอบ TypeScript Error (5 นาที)**
- [ ] ลอง [สิ่งที่ผิด] → ต้องเห็น Error ขีดแดงใน Editor ✅
- [ ] แก้กลับ → Error หาย ✅

**🎯 Bonus (ถ้าเวลาเหลือ)**
- [ ] [ต่อยอดสำหรับนักเรียนที่เร็ว]

**ขั้น X: ส่งงาน**
- [ ] `git add . && git commit -m "wkX-lab: [ชื่อ] by ชื่อ-นามสกุล" && git push`
- [ ] Google Doc: สรุป 3-5 บรรทัด + ลิงก์ GitHub + screenshot
```

**กฎ:** ขั้น 0 (Identity) → เนื้อหา → Submit เสมอ — ทุก task ต้องมี expected output และต้องรันโค้ดจริงเพื่อยืนยัน ห้ามข้ามการทดสอบ

---

## 🔔 Callout Standards

| Callout | ใช้เมื่อ |
| :--- | :--- |
| `:::tip` | ข้อแนะนำที่มีประโยชน์ แต่ไม่บังคับ |
| `:::warning` | ข้อผิดพลาดที่พบบ่อย ต้องระวัง |
| `:::danger` | ถ้าทำผิดจะพังหนักหรือกระทบ security |
| `:::info` | ข้อมูลเสริม เช่น AI Prompt |
| `>` blockquote | note สั้น ๆ ทั่วไป เช่น เปรียบเทียบ |

---

## 🌐 CLIL Tooltip Pattern

```html
<!-- ใส่ที่คำศัพท์ที่ปรากฏครั้งแรกในหน้านั้น -->
<abbr title="คอม-โพ-เนนท์">Component</abbr>
<abbr title="อิน-เทอร์-เฟส">Interface</abbr>
<abbr title="โพรพ-เพอร์-ตี้">Props</abbr>
```

เพิ่มคอลัมน์ "คำอ่าน" ในตาราง CLIL Vocabulary ทุกหน้า:

```markdown
| Technical Term | คำอ่าน | Meaning in Context |
| `Component` | คอม-โพ-เนนท์ | ส่วนประกอบย่อยของ UI |
```

---

## 🔄 Cross-Week Continuity

| สิ่งที่ต้องทำ | รายละเอียด |
| :--- | :--- |
| M อ้างถึง wk ก่อน | Motivation ต้องเชื่อมกับสิ่งที่ทำค้างอยู่จาก wk ที่แล้ว |
| Lab ต่อยอด codebase เดิม | ห้ามให้นักเรียนเริ่มโปรเจกต์ใหม่ทุก wk |
| "บทนี้เตรียมอะไร" ถูกต้อง | ระบุ wk จริงจาก Course Outline ต้องสอดคล้องทั้ง course |

---

## 🚫 Anti-Patterns

| ❌ ห้ามทำ | ✅ ควรทำแทน |
| :--- | :--- |
| ทฤษฎียาวก่อนโค้ด | โค้ดก่อน อธิบายแทรกเป็น inline comment |
| ใช้ "อธิบายทีละบรรทัด:" block หลังโค้ด | ใช้ `// [1]` inline + "สรุปการทำงาน:" สั้นๆ |
| ตัวอย่างเดียวต่อ concept | อย่างน้อย 2 ตัวอย่าง: ✅ ถูก และ ❌ ผิด |
| โยนโค้ดใหม่ทั้งก้อน | เพิ่ม 2-5 บรรทัดต่อเวอร์ชัน + ใช้ `[!code ++]` / `[!code --]` |
| เวอร์ชันสุดท้ายเห็นผลครั้งเดียว | ทุกเวอร์ชันต้องรันได้และมี expected output |
| ไม่มี Student Identity ใน Lab | task แรกเสมอ: footer แสดงชื่อบน UI |
| TypeScript ซับซ้อนเกินระดับสัปดาห์ | ดู Course Outline — สอนแค่ที่กำหนด |
| Code Review น้อยกว่า 3 คำถาม | อย่างน้อย 3 คำถาม เน้น "ทำไม" |
| ตัวแปรภาษาไทย | CLIL: ตัวแปรต้องเป็นอังกฤษเสมอ |
| Terminal command ไม่มี expected output | แสดง output ทุกครั้ง |
| โค้ด 1 block ยาวเกิน 10 บรรทัด | ตัดเหลือแค่ส่วนที่แสดง concept — รันได้จริง |
| bullet อธิบาย + ตารางซ้ำกัน | เลือกอย่างใดอย่างหนึ่ง |
| อธิบาย concept เกิน 2 บรรทัด | ถ้ายาวกว่านั้นย้ายเข้า `:::details` |
| Mermaid node label ภาษาไทย | node label ต้องอังกฤษ — Thai ไปวางนอก diagram เป็น paragraph |
| เขียน "บทถัดไปเราจะเรียน..." | VitePress มี prev/next navigation อยู่แล้ว |
| ใช้ `---` คั่น section ในไฟล์เนื้อหา | ใช้ `##` / `###` แทน |
| ชื่อ component / variable แต่งขึ้นใหม่ | ดูจาก `project/frontend/src/` แล้วใช้ชื่อเดิม |
| M, I, A, P ไม่เชื่อมกัน | ทุกขั้นต้องอ้างถึงปัญหาและ concept เดียวกัน |
| Lab เริ่มโปรเจกต์ใหม่ทุก wk | ต่อยอด codebase เดิมจาก wk ก่อนเสมอ |
| ไม่ระบุ "ชิ้นงาน" ใน Lab | ระบุชื่อไฟล์/component จริงที่นักเรียนได้ในตอนท้าย |
| ทดสอบโดยไม่รันโค้ดจริง | รัน `npm run dev` → เห็นผลใน Browser ทุกครั้ง |
