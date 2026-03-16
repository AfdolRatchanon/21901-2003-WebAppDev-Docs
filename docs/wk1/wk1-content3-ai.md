# การใช้ AI และ Prompt Engineering สำหรับ React/TypeScript <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระหว่างสร้าง **ระบบเบิก-จ่ายอุปกรณ์ไอที** นักเรียนติดปัญหา TypeScript Error แต่ไม่รู้จะถาม AI ว่าอย่างไร — ถามว่า "ทำไม Error?" แล้วได้คำตอบกว้างมากจนใช้ไม่ได้ เสียเวลาหลายชั่วโมง ทั้ง ๆ ที่ถ้าถามให้ดีจะได้คำตอบภายใน 30 วินาที
:::

> 💡 **เปรียบเทียบ:** การถาม AI เหมือนการสั่งอาหาร — บอกแค่ "อยากกินอะไรซักอย่าง" กับ "ข้าวผัดกุ้ง ไม่เผ็ด ไข่ดาว" ได้ผลต่างกันมาก

---

## 📖 I: Information

**Prompt Engineering (วิศวกรรมคำสั่ง)** คือศิลปะและทักษะแห่งการเขียนคำสั่ง (ข้อความ, คำถาม) เพื่อสื่อสารกับโมเดลปัญญาประดิษฐ์ (AI) ให้มันเข้าใจความต้องการที่แท้จริงของเราได้อย่างชัดเจนและครอบคลุมที่สุด 

การเปรียบเทียบ AI กับคนนั้น แตกต่างตรงที่ AI ไม่สามารถ "เดาใจ" หรือดูสภาพแวดล้อมรอบตัวผู้ใช้อย่างเจ๋ง ๆ เพื่อหาบริบทด้วยตัวเองได้ มันจะให้คำตอบตามที่เราป้อนข้อมูลหรือพิมพ์สั่งเพียงเท่านั้น ถ้าเราให้คำสั่งแบบคลุมเครือ กว้างขวาง หรือบอกรายละเอียดแบบข้ามขั้นตอน เราก็จะเจอกับคำตอบที่กว้างเกินไปและไม่สามารถนำมาใช้แก้ปัญหาการเขียนโค้ดที่เจอได้เลย ทักษะในการเขียน Prompt ที่ดีจึงส่งผลอย่างมหาศาลต่อระยะเวลาในการเรียนรู้การเขียนโปรแกรม

### โครงสร้าง Prompt ที่ดี — 4 ส่วน

| ส่วน | อธิบาย | ตัวอย่าง |
| :--- | :--- | :--- |
| **Context** | กำลังทำอะไรอยู่ | "กำลังสร้างระบบเบิก-จ่ายอุปกรณ์" |
| **Stack** | เทคโนโลยีที่ใช้ | "React 18 + TypeScript + Vite" |
| **Problem** | ปัญหาที่เจอ (ชัดเจน) | "ได้รับ Error: Type 'string' is not assignable..." |
| **Output** | ต้องการอะไรจาก AI | "ขอคำอธิบายและวิธีแก้พร้อมโค้ดตัวอย่าง" |

### เปรียบเทียบ: Prompt แย่ vs ดี

::: code-group
```text [❌ Prompt แย่ — ขาด Context]
"ทำไม TypeScript Error?"
"React ใช้ยังไง?"
"ช่วยเขียนโค้ดให้หน่อย"
"แก้ Bug นี้ให้หน่อย" (แปะโค้ดมาเฉย ๆ ไม่บอกอะไรเพิ่ม)
```

```text [✅ Prompt ดี — บอกบริบทครบ]
"กำลังสร้างระบบเบิก-จ่ายอุปกรณ์ไอทีโดยใช้ React 18 + TypeScript + Vite
มี Component ชื่อ EquipmentCard ที่รับ props: name (string), category (string), status (string)
ต้องการแสดง badge สีต่างกันตาม status:
  - 'available' = เขียว
  - 'borrowed' = แดง
  - 'maintenance' = เหลือง
ขอโค้ด TypeScript ที่ใช้ inline style ไม่ใช้ library ภายนอก"
```
:::

### วิธีถาม AI เมื่อเจอ TypeScript Error

เมื่อเจอ Error ให้ copy Error message และโค้ดที่ผิดมาด้วย:

::: code-group
```text [❌ ถามผิด]
"TypeScript Error อยู่ ช่วยแก้หน่อย"
```

```text [✅ ถามถูก]
"กำลังเรียน React 18 + TypeScript อยู่
ได้รับ Error นี้:

Type '{ name: string; status: string; }' is not assignable to type 'EquipmentCardProps'.
  Property 'category' is missing in type '{ name: string; status: string; }'
  but required in type 'EquipmentCardProps'.

โค้ดที่ทำให้เกิด Error:
  <EquipmentCard name="MacBook Pro" status="available" />

Interface ของฉัน:
  interface EquipmentCardProps {
    name: string
    category: string
    status: string
  }

ช่วยอธิบายว่า Error นี้เกิดจากอะไร และต้องแก้อย่างไร"
```
:::

::: tip 💡 Rule of 3 C's
- **Clear** — ชัดเจน ไม่คลุมเครือ
- **Contextual** — มี Context พอ (บอก Stack, บอกสิ่งที่ทำอยู่)
- **Constrained** — จำกัดขอบเขต (ขอตัวอย่างสั้น ๆ, ขอแค่ฟังก์ชันเดียว)
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ตัวอย่าง Prompt สำหรับโปรเจกต์นี้

**สำหรับขอโค้ดใหม่:**
"กำลังสร้างระบบเบิก-จ่ายอุปกรณ์ไอทีด้วย React 18 + TypeScript + Vite อยู่ ช่วยสร้าง component ชื่อ StatusBadge ที่รับ prop `status` ชนิด string แสดงสีเขียวสำหรับ 'available' สีเหลืองสำหรับ 'borrowed' ขอโค้ด TypeScript พร้อมอธิบายแต่ละบรรทัดแบบสั้น ๆ"

**สำหรับขอคำอธิบาย:**
"กำลังเรียน TypeScript อยู่ ช่วยอธิบายความแตกต่างระหว่าง `interface` กับ `type` พร้อมตัวอย่างสั้น ๆ ที่เกี่ยวกับข้อมูลอุปกรณ์ไอที เช่น Equipment, User"
:::

### 📝 PjBL Lab

**ขั้น 1: เปรียบเทียบ Prompt แย่ vs ดี (10 นาที)**

- [ ] เปิด ChatGPT, Claude, หรือ Gemini
- [ ] ถาม Prompt แย่: `"React component ยังไง"` → บันทึกคำตอบที่ได้ว่าเป็นอย่างไร
- [ ] ถาม Prompt ดีแบบ 4 ส่วน ถามเรื่องเดียวกัน → เปรียบเทียบคุณภาพคำตอบ
- [ ] สรุป 1-2 ประโยค: Prompt ดีกว่าอย่างไร?

**ขั้น 2: ฝึกถามเพื่อแก้ Error (15 นาที)**

- [ ] เปิดโปรเจกต์จาก Lab ก่อนหน้า (`EquipmentCard.tsx`)
- [ ] ลบ prop `category` ออกจาก `<EquipmentCard>` ให้เกิด TypeScript Error
- [ ] Copy Error message จาก VS Code ทั้งหมด
- [ ] เขียน Prompt ตามแบบ "ถามถูก" ด้านบน แล้วถาม AI
- [ ] ใช้คำตอบของ AI แก้ Error และทดสอบว่าโค้ดทำงาน ✅

**ขั้น 3: ถาม AI เพื่อต่อยอดโค้ด (15 นาที)**

- [ ] เขียน Prompt เพื่อขอให้ AI เพิ่ม prop `quantity: number` ให้ `EquipmentCard`
- [ ] นำโค้ดที่ AI ตอบมาใช้งาน — ทดสอบว่าแสดงจำนวนถูกต้อง
- [ ] บันทึก Prompt ที่ใช้และคำตอบลงใน Notion หรือ Google Doc ส่งครู

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องบอก Stack ใน Prompt ด้วย?
**แนวคำตอบ:** AI ไม่รู้ว่าเราใช้ React, Vue, หรือ Angular — ถ้าไม่บอก อาจได้โค้ด Vue มาแทน TypeScript version ก็สำคัญ เพราะ React 18 มีบางฟีเจอร์ที่ต่างจาก React 16 เช่น `createRoot` แทน `ReactDOM.render`
:::

::: details ❓ ถ้า AI ตอบผิดหรือโค้ดไม่ทำงาน ควรทำอย่างไร?
**แนวคำตอบ:** อย่าเริ่ม Conversation ใหม่ — AI ยังจำ Context เดิมได้ ให้ต่อ Prompt ว่า "คำตอบนั้นไม่ทำงาน ได้รับ Error: [Error message] โค้ดปัจจุบันคือ: [code] ช่วยลองใหม่อีกครั้ง" การ iterate (แก้ Prompt ซ้ำ) คือทักษะสำคัญ
:::

::: details ❓ AI ตอบผิดได้ไหม? ควรเชื่อ AI ทุกอย่างไหม?
**แนวคำตอบ:** AI ตอบผิดได้เสมอ โดยเฉพาะโค้ดที่ซับซ้อนหรือ API ที่เพิ่งอัปเดต ควรทดสอบโค้ดทุกครั้งก่อนใช้งานจริง และอ่านโค้ดที่ได้ให้เข้าใจก่อน — ไม่ copy-paste โดยไม่รู้ว่าทำอะไร AI เป็น "ผู้ช่วย" ไม่ใช่ "คำตอบสุดท้าย"
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| เขียน Prompt มี 4 ส่วน | ครบ Context, Stack, Problem, Output | มี 2-3 ส่วน | ขาดหรือไม่มี |
| เปรียบเทียบ Prompt แย่/ดี | บันทึกผลครบ พร้อมวิเคราะห์ | บันทึกแต่ไม่วิเคราะห์ | ไม่ได้ทำ |
| ใช้ AI แก้ Error จริง | ได้คำตอบ ใช้แก้ Error สำเร็จ | ได้คำตอบบางส่วน | ไม่ได้ลอง |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Prompt` | คำสั่ง/คำถามที่ส่งให้ AI |
| `Context` | บริบท — ข้อมูลพื้นหลังที่ช่วยให้ AI เข้าใจสถานการณ์ |
| `Stack` | กลุ่ม Technology ที่ใช้ในโปรเจกต์ทั้งหมด |
| `Output` | ผลลัพธ์ที่ต้องการได้รับจาก AI |
| `Iteration` | การปรับปรุงซ้ำ — แก้ Prompt และลองใหม่เรื่อย ๆ |
| `Hallucination` | AI ตอบข้อมูลผิดแต่ฟังดูน่าเชื่อ — ต้องตรวจสอบเสมอ |
