# 📘 Vocational Web Dev: Content Pattern & Standard

คู่มือและมาตรฐานการเขียนเนื้อหารายวิชา 21901-2003 การพัฒนาเว็บแอปพลิเคชัน
ออกแบบมาเพื่อการจัดการเรียนการสอนอาชีวศึกษา (Active Learning + PjBL + MIAP + CLIL)

> 🤖 **AI-Generated Textbook:** เอกสารนี้เป็น "แม่แบบ (Blueprint)" สำหรับให้ AI สร้างเนื้อหาบทเรียนลงใน VitePress เพื่อใช้แทนหนังสือเรียนแบบดั้งเดิม

---

## 📖 โปรเจกต์นี้คืออะไร?

เอกสารรายวิชาเว็บแอปพลิเคชันที่สร้างด้วย VitePress บูรณาการกระบวนการสอน MIAP + PjBL + CLIL + AI เพื่อตอบสนองมาตรฐาน TPQI รหัส 10302 (นักพัฒนาระบบ ระดับ 3)

---

## ✨ จุดเด่น (Key Features)

- **Code-First Examples** — โค้ดมาก่อนทฤษฎีเสมอ หลายตัวอย่างเรียงจากง่ายไปยาก
- **Progressive Difficulty** — ทุกบทเริ่มง่าย แล้วค่อย ๆ เพิ่มความซับซ้อนทีละขั้น
- **MIAP Flow** — ทุกหน้าเดินตาม Motivation → Information → Application → Progress
- **CLIL Integration** — โค้ดทุกชิ้นใช้ภาษาอังกฤษ มีคลังคำศัพท์ท้ายบท
- **Progressive TypeScript** — สอน TypeScript แบบ Just-in-Time ตามระดับสัปดาห์ ไม่ Overload
- **Student Identity in Lab** — task แรกของทุก Lab ให้นักเรียนใส่ชื่อตนเองในโค้ด
- **Code Review Prep** — คำถาม 3-4 ข้อท้ายบท เน้น "ทำไม" ไม่ใช่ท่อง

---

## ⚙️ คำชี้แจงสำหรับ AI (AI Generator Instructions)

เมื่อ AI ได้รับคำสั่งให้สร้างเนื้อหา AI ต้อง:

1. **Code-First:** เริ่มด้วยโค้ดตัวอย่างที่รันได้ก่อนเสมอ — อธิบายทฤษฎีแทรกในโค้ด ไม่ใช่ก่อนโค้ด
2. **เรียงง่ายไปยาก:** เวอร์ชัน 1 (พื้นฐาน) → เวอร์ชัน 2 (เพิ่มคุณสมบัติ) ภายในบทเดียวกัน
3. **ตัวอย่างเยอะ:** ทุก concept ต้องมีอย่างน้อย 2 ตัวอย่าง — ✅ ถูก และ ❌ ผิด
4. **สอดแทรกบริบท** "ระบบเบิก-จ่ายอุปกรณ์ไอที" ในทุกใบงาน Lab
5. **TypeScript Just-in-Time:** สอน TypeScript ตามระดับที่ระบุใน Course Outline เท่านั้น
6. **Student Identity:** ใส่ task แรกของทุก Lab เป็นการพิมพ์ชื่อนักเรียน

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
[เนื้อหา — Code-First, เรียงง่ายไปยาก, ดูรูปแบบย่อยด้านล่าง]

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide
::: info 💬 ถาม AI
"[Prompt ภาษาไทยสำหรับขอความช่วยเหลือจาก ChatGPT/Claude]"
:::

### 📝 PjBL Lab
[ใบงาน — เริ่มด้วย Student Identity, เรียงง่ายไปยาก, ดูรูปแบบย่อยด้านล่าง]

---

## ✅ P: Progress

### 🗣️ Code Review
::: details ❓ คำถาม (3-4 ข้อ เน้น "ทำไม")
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

เรียงขั้นตอนจากพื้นฐาน → ซับซ้อน ทีละขั้น อย่าข้ามขั้น:

```markdown
### ขั้นตอนที่ 1 — ชื่อขั้นตอน

อธิบายสั้น ๆ ว่าทำอะไร (1-2 บรรทัด)

\`\`\`bash
# คำสั่งที่ต้องรัน
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

**กฎ:** ทุกคำสั่ง bash ต้องมี block แสดง expected output — นักเรียนรู้ว่า "สำเร็จ" หน้าตาเป็นอย่างไร

---

### รูปแบบ 2: โค้ดอธิบายทีละบรรทัด (สำหรับไฟล์สำคัญ)

```markdown
::: code-group
\`\`\`tsx [src/main.tsx]
import { StrictMode } from 'react'            // [1] นำเข้า StrictMode
import { createRoot } from 'react-dom/client' // [2] นำเข้าฟังก์ชัน createRoot
import App from './App.tsx'                   // [3] นำเข้า Component หลัก

createRoot(document.getElementById('root')!).render(
  <StrictMode>   {/* [4] StrictMode ช่วยตรวจจับ bug */}
    <App />      {/* [5] render Component หลัก */}
  </StrictMode>,
)
\`\`\`
:::

**สรุปการทำงาน:**
1. Browser เปิด `index.html`
2. React วาง `<App />` ลงใน `<div id="root">`
```

**กฎ:** ใช้ `// [1] [2]...` สำหรับบรรทัดสำคัญ ตามด้วย "สรุปการทำงาน:" เสมอ

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

**กฎ:** Tab ✅ ❌ 💡 ใช้กับ TypeScript เสมอ และต้องมีทั้ง 3 tab ในหัวข้อ TypeScript ทุกหัวข้อ

---

### รูปแบบ 4: Progressive Versions (เวอร์ชันง่ายไปยาก ภายในบทเดียว)

```markdown
### [Component name] เวอร์ชัน 1 — พื้นฐาน

\`\`\`tsx
// เวอร์ชัน 1: แสดงข้อมูลพื้นฐาน ยังไม่มี styling
export function EquipmentCard({ name, status }: Props) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{status}</p>
    </div>
  )
}
\`\`\`

บันทึกไฟล์ → ดู Browser → ต้องเห็นข้อมูลแสดงออกมา ✅

---

### [Component name] เวอร์ชัน 2 — เพิ่ม Status Badge

\`\`\`tsx
// เวอร์ชัน 2: เพิ่ม badge สีตามสถานะ
export function EquipmentCard({ name, status }: Props) {
  const color = { available: 'green', borrowed: 'red' }

  return (
    <div>
      <h3>{name}</h3>
      <span style={{ color: color[status] }}>{status}</span>  {/* ← เพิ่มสี */}
    </div>
  )
}
\`\`\`
```

**กฎ:** ทุกเวอร์ชันต้องรันได้จริง — อย่าให้นักเรียนรอถึงเวอร์ชันสุดท้ายแล้วค่อยเห็นผล

---

### รูปแบบ 5: โครงสร้างโฟลเดอร์

```markdown
\`\`\`
my-project/
├── src/                 ← โค้ดทั้งหมดอยู่ที่นี่
│   ├── components/      ← React Components ย่อย
│   ├── pages/           ← หน้าเว็บต่าง ๆ
│   ├── App.tsx          ← Component หลัก
│   └── main.tsx         ← Entry point
├── index.html           ← HTML template (มี <div id="root">)
└── vite.config.ts       ← การตั้งค่า Vite
\`\`\`

::: tip 💡 โฟลเดอร์ที่สำคัญ
[บอกว่าควรโฟกัสที่ไหน เช่น "เกือบทุกอย่างอยู่ใน src/"]
:::
```

---

## 📝 PjBL Lab Pattern

### Task แรก: Student Identity (บังคับทุก Lab)

```markdown
**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม footer แสดงชื่อของตนเองไว้ที่ด้านล่างสุดของ Component หลักใน Lab:

\`\`\`tsx
{/* footer แสดงชื่อผู้จัดทำ — เปลี่ยนเป็นชื่อ-รหัสของตนเอง */}
<footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
\`\`\`

- [ ] บันทึกไฟล์ → ต้องเห็นชื่อของตนเองปรากฏบนหน้าเว็บ ✅
```

### Lab ส่วนที่เหลือ: ขั้นตอนพร้อม expected outcome

```markdown
**ขั้น 1: ชื่อขั้น (X นาที)**

- [ ] task ที่ต้องทำ
- [ ] task ที่ต้องทำ → ต้องเห็น [ผลลัพธ์ที่คาดหวัง] ✅

**ขั้น 2: เพิ่มคุณสมบัติ (X นาที)**

- [ ] task → Browser อัปเดตทันที ✅

**ขั้น 3: ทดสอบ Error (5 นาที)**

- [ ] ลอง [สิ่งที่ผิด] → ต้องเห็น Error ✅
- [ ] แก้กลับ → Error หาย ✅

**🎯 Bonus (ถ้าเวลาเหลือ)**

- [ ] [ต่อยอดที่ยากขึ้น สำหรับนักเรียนที่เร็ว]
```

### Task สุดท้าย: Submit (บังคับทุก Lab)

```markdown
**ขั้น X: ส่งงาน**

- [ ] Push code ขึ้น GitHub repo ส่วนตัว:

\`\`\`bash
git add .
git commit -m "wkX-lab: [ชื่อ Lab] by ชื่อ-นามสกุล"
git push
\`\`\`

- [ ] เปิด Google Doc ประจำรายวิชา → เขียนสรุป 3-5 บรรทัด:
  - เรียนรู้อะไรจาก Lab นี้?
  - ปัญหาที่เจอและวิธีแก้?
  - แปะลิงก์ GitHub repo + screenshot หน้าเว็บที่มีชื่อตนเอง
```

**กฎสำหรับ Lab:**
- **ขั้น 0 Student Identity** ต้องเป็น task แรกเสมอ (ก่อน task เนื้อหา)
- **Task สุดท้าย** ต้องเป็น Submit (GitHub + Google Doc) เสมอ
- แต่ละขั้นมีเวลาโดยประมาณ (ช่วยนักเรียนวางแผน)
- task สำคัญมี ✅ บอก expected outcome ชัดเจน
- มี **Bonus Task** สำหรับนักเรียนที่ทำเสร็จก่อน
- Task ทดสอบ TypeScript Error ต้องมีในทุก Lab

---

## 🗣️ Code Review Pattern

```markdown
### 🗣️ Code Review

::: details ❓ คำถาม (3-4 ข้อต่อบท)
**แนวคำตอบ:** [ตอบได้โดยไม่ต้องดูโค้ด — เน้นความเข้าใจ ไม่ใช่ท่อง]
:::
```

**กฎ:**
- **3-4 คำถามต่อบท** — ไม่น้อยกว่า 3
- สลับใช้คำถามแบบ: เปรียบเทียบ (A vs B) · อธิบาย (ทำงานอย่างไร) · ทำไม (เหตุผล)
- แนวคำตอบต้องอธิบาย "ทำไม" ไม่ใช่แค่ "อะไร"
- คำถามต้องเชื่อมกับโค้ดที่นักเรียนเพิ่งเขียน ไม่ใช่ทฤษฎีลอย ๆ

---

## 🚫 Anti-Patterns (สิ่งที่ต้องหลีกเลี่ยง)

| ❌ ห้ามทำ | ✅ ควรทำแทน |
| :--- | :--- |
| ทฤษฎียาวก่อนโค้ด | โค้ดก่อน อธิบายแทรกในโค้ด |
| ตัวอย่างเดียวต่อ concept | อย่างน้อย 2 ตัวอย่าง: ✅ ถูก และ ❌ ผิด |
| เวอร์ชันสมบูรณ์ทันที | เริ่มง่าย → ค่อย ๆ เพิ่มในขั้นถัดไป |
| Lab เป็น checklist ไม่มีคำอธิบาย | แบ่งขั้น มี expected output ชัดเจน |
| ไม่มี Student Identity ใน Lab | task แรกเสมอ: `STUDENT_NAME` + แสดงบน UI |
| TypeScript ซับซ้อนเกินระดับสัปดาห์ | ดู Course Outline — สอนแค่ที่กำหนด |
| Code Review 2 คำถาม | อย่างน้อย 3 คำถาม เน้น "ทำไม" |
| ตัวแปรภาษาไทย (`const ชื่อ = ...`) | CLIL: ตัวแปรต้องเป็นอังกฤษเสมอ |
| Terminal command ไม่มี expected output | แสดง output ทุกครั้งเพื่อให้นักเรียนตรวจสอบ |
| โค้ดไม่มีคอมเมนต์ | บรรทัดสำคัญต้องมีคอมเมนต์ภาษาไทยอธิบาย |
