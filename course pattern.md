# 📘 Vocational Web Dev: Content Pattern & Standard

คู่มือและมาตรฐานการเขียนเนื้อหารายวิชา 21901-2003 การพัฒนาเว็บแอปพลิเคชัน
ออกแบบมาเพื่อการจัดการเรียนการสอนอาชีวศึกษา (Active Learning + PjBL + MIAP + CLIL)

> 🤖 **AI-Generated Textbook:** เอกสารนี้เป็น "แม่แบบ (Blueprint)" สำหรับให้ AI สร้างเนื้อหาบทเรียนลงใน VitePress เพื่อใช้แทนหนังสือเรียนแบบดั้งเดิม

---

## 📖 โปรเจกต์นี้คืออะไร?

เอกสารรายวิชาเว็บแอปพลิเคชันที่สร้างด้วย VitePress บูรณาการกระบวนการสอน MIAP + PjBL + CLIL + AI เพื่อตอบสนองมาตรฐาน TPQI รหัส 10302 (นักพัฒนาระบบ ระดับ 3)

---

## ✨ จุดเด่น (Key Features)

- **AI-Powered Interactive Textbook** — ใช้ AI สร้างเนื้อหาทั้งหมดในรูปแบบเว็บ VitePress
- **MIAP Flow** — ทุกหน้าเดินตาม Motivation → Information → Application → Progress
- **CLIL Integration** — โค้ดทุกชิ้นใช้ภาษาอังกฤษ มีคลังคำศัพท์ท้ายบท
- **Progressive TypeScript** — สอน TypeScript แบบ Just-in-Time ตามระดับสัปดาห์ ไม่ Overload
- **Code Review Prep** — คำถาม 3-4 ข้อท้ายบท ป้องกัน Copy-Paste โดยไม่เข้าใจ

---

## ⚙️ คำชี้แจงสำหรับ AI (AI Generator Instructions)

เมื่อ AI ได้รับคำสั่งให้สร้างเนื้อหา AI ต้อง:

1. ใช้โครงสร้าง Markdown + VitePress features (`::: info`, `::: code-group`, `::: details`) ตาม Layout ด้านล่างอย่างเคร่งครัด
2. ห้ามแต่งเนื้อหาแบบตำราเรียนที่ยืดเยื้อ — เน้นโค้ดที่รันได้จริงและคำอธิบายกระชับ
3. สอดแทรกบริบท "ระบบเบิก-จ่ายอุปกรณ์ไอที" ในทุกใบงาน Lab
4. สอน TypeScript ตามระดับที่ระบุใน Course Outline เท่านั้น (เช่น wk1 = Basic Types ห้ามพูดถึง Generics)

---

## 📁 Naming Convention

| Pattern | ใช้สำหรับ | ตัวอย่าง |
| :--- | :--- | :--- |
| `wkX-contentY-topic.md` | บทเรียนทฤษฎี | `wk3-content1-tailwind.md` |
| `wkX-labY-topic.md` | ใบงานปฏิบัติ | `wk3-lab1-asset-form.md` |
| `wkX-project.md` | จุดเช็คพอยต์ | `wk5-project-midterm.md` |

(X = โมดูลที่ 1-9, Y = ลำดับเนื้อหาในโมดูลนั้น)

---

## 🏅 Vocational Gold Standard — Layout Blueprint

ทุกหน้าต้องมีโครงสร้าง MIAP ครบ 4 ขั้น:

```markdown
# ชื่อหัวข้อ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation
::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
[ปัญหาจาก "ระบบเบิก-จ่ายอุปกรณ์ไอที" ที่ทำให้นักเรียนอยากเรียนหัวข้อนี้]
:::
> 💡 **เปรียบเทียบ:** [อุปมาเชื่อมกับชีวิตประจำวัน]

---

## 📖 I: Information
[เนื้อหา — ดูรูปแบบย่อยด้านล่าง]

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide
::: info 💬 ถาม AI
"[Prompt ภาษาไทยสำหรับขอความช่วยเหลือจาก ChatGPT/Claude]"
:::

### 📝 PjBL Lab
[ใบงาน — ดูรูปแบบย่อยด้านล่าง]

---

## ✅ P: Progress

### 🗣️ Code Review
::: details ❓ คำถาม 1
**แนวคำตอบ:** ...
:::
::: details ❓ คำถาม 2
**แนวคำตอบ:** ...
:::

### 📋 Rubric (10 คะแนน)
| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |

---

### 📚 CLIL Vocabulary
| Technical Term | Meaning in Context |
| :--- | :--- |
```

---

## 🎨 Information Section Patterns

### รูปแบบ 1: Step-by-step (สำหรับเนื้อหาที่มีขั้นตอนชัดเจน)

```markdown
### ขั้นตอนที่ 1 — ชื่อขั้นตอน

อธิบายสั้น ๆ ว่าทำอะไร

\`\`\`bash
# คำสั่ง
npm create vite@latest my-project -- --template react-ts
\`\`\`

Terminal จะแสดงผล:

\`\`\`
✔ Project name: my-project
Done. Now run:
  cd my-project && npm install
\`\`\`

---

### ขั้นตอนที่ 2 — ชื่อขั้นตอน
```

**กฎ:** ทุกคำสั่ง bash ที่สำคัญต้องมี block แสดง expected output ตาม — นักเรียนรู้ว่า "สำเร็จ" หน้าตาเป็นอย่างไร

---

### รูปแบบ 2: โค้ดอธิบายทีละบรรทัด (สำหรับไฟล์สำคัญที่ต้องเข้าใจทุกบรรทัด)

```markdown
::: code-group
\`\`\`tsx [src/main.tsx]
import { StrictMode } from 'react'            // [1] นำเข้า StrictMode
import { createRoot } from 'react-dom/client' // [2] นำเข้าฟังก์ชัน createRoot
import App from './App.tsx'                   // [3] นำเข้า Component หลัก
import './index.css'                          // [4] โหลด CSS ทั้งแอป

createRoot(document.getElementById('root')!).render(
  <StrictMode>   {/* [5] ห่อด้วย StrictMode */}
    <App />      {/* [6] render Component หลัก */}
  </StrictMode>,
)
\`\`\`
:::

**สรุปการทำงาน:**
1. Browser เปิด `index.html`
2. `index.html` โหลด `main.tsx`
3. React วาง `<App />` ลงใน `<div id="root">`
```

**กฎ:** ใช้ `// [1] [2] [3]...` สำหรับบรรทัดสำคัญ ตามด้วย "สรุปการทำงาน:" ถ้ามีหลายขั้นตอน

---

### รูปแบบ 3: Code Tabs ✅/❌/💡 (สำหรับสอน TypeScript)

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
// TypeScript เดา Type ได้เองถ้าให้ค่าตั้งต้น
const equipmentName = 'MacBook Pro'  // รู้ว่าเป็น string
\`\`\`
:::
```

**กฎ:** Tab ✅ ❌ 💡 ใช้กับ TypeScript เสมอ ห้ามใช้ชื่อ Tab ภาษาไทยในรูปแบบนี้

---

### รูปแบบ 4: โครงสร้างโฟลเดอร์ (สำหรับอธิบาย Project Structure)

```markdown
\`\`\`
my-project/
├── src/                 ← โค้ดทั้งหมดอยู่ที่นี่
│   ├── components/      ← React Components ย่อย
│   ├── pages/           ← หน้าเว็บต่าง ๆ
│   ├── hooks/           ← Custom Hooks
│   ├── App.tsx          ← Component หลัก
│   └── main.tsx         ← Entry point — จุดเริ่มต้น
├── index.html           ← HTML template (มี <div id="root">)
└── vite.config.ts       ← การตั้งค่า Vite
\`\`\`

::: tip 💡 โฟลเดอร์ที่สำคัญ
[บอกว่าควรโฟกัสที่ไหน]
:::
```

---

## 📝 PjBL Lab Pattern

Lab ทุกอันต้องแบ่งเป็น "ขั้น" พร้อมระบุเวลา และมี ✅ บอก expected outcome:

```markdown
### 📝 PjBL Lab

**ขั้น 1: ชื่อขั้น (X นาที)**

- [ ] task ที่ต้องทำ
- [ ] task ที่ต้องทำ → ต้องเห็น [ผลลัพธ์ที่คาดหวัง] ✅

**ขั้น 2: ชื่อขั้น (X นาที)**

- [ ] task ที่ต้องทำ

\`\`\`tsx
// โค้ดตัวอย่างสำหรับ task นี้ (ถ้าจำเป็น)
\`\`\`

- [ ] บันทึกไฟล์ → Browser อัปเดตทันที ✅

**ขั้น 3: ทดสอบ (X นาที)**

- [ ] ลอง [สิ่งที่ผิด] → ต้องเห็น Error ✅
- [ ] แก้กลับ → Error หาย ✅
```

**กฎสำหรับ Lab:**
- แต่ละขั้นมีเวลาโดยประมาณ (ช่วยนักเรียนวางแผน)
- task ที่สำคัญมี ✅ บอก expected outcome ชัดเจน
- มีโค้ดตัวอย่างเมื่อ task ต้องการโค้ดใหม่
- task ทดสอบ TypeScript Error ต้องมีในทุก Lab

---

## 🗣️ Code Review Pattern

```markdown
### 🗣️ Code Review

::: details ❓ คำถาม (3-4 ข้อต่อบท)
**แนวคำตอบ:** [ตอบได้โดยไม่ต้องดูโค้ด — เน้นความเข้าใจ ไม่ใช่ท่อง]
:::
```

**กฎ:**
- 3-4 คำถามต่อบท (ไม่ใช่ 2)
- คำถามต้องเชื่อมกับโค้ดในบทนั้น เช่น "ทำไม `!` ถึงต้องใส่?"
- แนวคำตอบต้องอธิบาย "ทำไม" ไม่ใช่แค่ "อะไร"
- สลับคำถามเปรียบเทียบ (A vs B) กับคำถามอธิบาย (ทำงานอย่างไร)

---

## 🚫 Anti-Patterns (สิ่งที่ต้องหลีกเลี่ยง)

| ❌ ห้ามทำ | ✅ ควรทำแทน |
| :--- | :--- |
| ทฤษฎียาวโดยไม่มีโค้ด | โค้ดก่อน อธิบายทีละบรรทัด |
| Lab เป็นแค่ checklist ไม่มีคำอธิบาย | แบ่งขั้นตอน มี expected output ชัดเจน |
| TypeScript ซับซ้อนเกินระดับสัปดาห์ | ดู Course Outline — สอนแค่ที่กำหนด |
| Code Review 2 คำถาม | อย่างน้อย 3 คำถาม เน้น "ทำไม" |
| ตัวแปรภาษาไทย (`const ชื่อ = ...`) | CLIL: ตัวแปรต้องเป็นอังกฤษเสมอ |
| โค้ดไม่มีคอมเมนต์ภาษาไทย | บรรทัดสำคัญต้องมีคอมเมนต์อธิบาย |
| Terminal command ไม่มี expected output | แสดง output ทุกครั้งเพื่อให้นักเรียนตรวจสอบ |
