# 21901-2003 Web Based Application Development

**รหัสวิชา:** 21901-2003 | **หน่วยกิต:** 1-4-3 | **มาตรฐาน:** TPQI 10302 ระดับ 3

**Stack:** React 18 + TypeScript + Tailwind CSS v3 + Vite · Node.js + Prisma + MySQL + Socket.io + JWT

**โปรเจกต์หลัก:** ระบบเบิก-จ่ายอุปกรณ์ไอที (IT Equipment Checkout System)

---

## สมรรถนะรายวิชา

1. แสดงความรู้เกี่ยวกับการเขียนโปรแกรมเว็บด้วยภาษาโปรแกรมคอมพิวเตอร์ตามหลักการ
2. พัฒนาเว็บแอปพลิเคชันด้วยโปรแกรมภาษาคอมพิวเตอร์
3. เขียนแผนการทดสอบเว็บแอปพลิเคชันตามหลักการ
4. ประยุกต์ใช้งานการพัฒนาเว็บแอปพลิเคชันด้วยโปรแกรมภาษาคอมพิวเตอร์

**คำอธิบายรายวิชา (สรุปจาก PDF):** โครงสร้างโปรแกรม · ฟังก์ชัน · รับ/ตรวจสอบข้อมูลจากฟอร์ม · เชื่อมต่อฐานข้อมูล · Cookies · JWT Session · ออกแบบและจัดการฐานข้อมูล · Test Plan · Go Live

---

## นโยบายการสอน

| นโยบาย | รายละเอียด |
| :--- | :--- |
| **Code-First** | เรียนผ่านโค้ดก่อนเสมอ — ทุกหัวข้อเริ่มจาก "ดูโค้ดตัวอย่างที่รันได้" ไม่ใช่ทฤษฎีล้วน |
| **Progressive Difficulty** | เนื้อหาเรียงจากง่ายไปยากทุกบท — เวอร์ชัน 1 (ไม่มี style) → เวอร์ชัน 2 (เพิ่ม badge) → เวอร์ชัน 3 (เพิ่ม Tailwind) |
| **CLIL** | บังคับตั้งชื่อตัวแปร/ฟังก์ชัน/Interface เป็นภาษาอังกฤษ · ฝึกเขียน AI Prompt ภาษาอังกฤษ |
| **Progressive TypeScript** | สอน TypeScript แบบ Just-in-Time ควบคู่ React — ดู "TypeScript Focus" ในตารางแต่ละ wk |
| **PjBL** | ทุกบทต่อยอดโปรเจกต์ "ระบบเบิก-จ่ายอุปกรณ์ไอที" ชิ้นเดียวตั้งแต่ต้นจนจบ |
| **MIAP** | ทุกหน้า: Motivation → Information → Application → Progress |
| **AI-Assisted** | ทุกบทมี AI Prompt Guide พร้อมใช้ · บทที่ 1 สอน Prompt Engineering โดยตรง |
| **Student Identity** | Task แรกของทุก Lab: แสดงชื่อ-รหัสนักเรียนบนหน้าเว็บใน `<footer>` — ยืนยันว่าทำเอง |
| **Submit** | ทุก Lab: Push code ขึ้น GitHub repo ส่วนตัว + เขียนสรุป 3-5 บรรทัดใน Google Doc พร้อมลิงก์ + screenshot |

---

## นโยบาย Lab (ใบงานปฏิบัติ)

- **ขั้น 0** ของทุก Lab: render ชื่อ-รหัสนักเรียนใน `<footer>` บนหน้าเว็บ
- เนื้อหา Lab เรียงจากง่ายไปยากเสมอ: ขั้นพื้นฐาน → ขั้นเพิ่มคุณสมบัติ → ขั้นทดสอบ Error
- ทุก task สำคัญมี ✅ บอก expected outcome ชัดเจน
- มี **Bonus Task** สำหรับนักเรียนที่ทำเสร็จก่อนเวลา
- **ขั้นสุดท้าย** ของทุก Lab: `git push` + สรุปลง Google Doc

---

## Course Outline — 9 โมดูล / 18 สัปดาห์

### 📦 wk1 · โครงสร้างพื้นฐาน (สัปดาห์ 1–2)

> **เป้าหมาย:** ติดตั้งและรันโปรเจกต์ React ได้ · เข้าใจ TypeScript Basic Types · ใช้ AI ช่วย Debug ได้

| สัปดาห์ | ไฟล์ | หัวข้อ | สิ่งที่นักเรียนทำได้เมื่อจบ |
| :-: | :--- | :--- | :--- |
| 1 | `wk1-content1-intro.md` | React + Vite + TypeScript: setup, folder structure, main.tsx, Basic Types | สร้างโปรเจกต์ · รัน `npm run dev` · ใช้ Basic Types ได้ |
| 1 | `wk1-content2-jsx.md` | JSX + Conditional Rendering + `.map()` สำหรับรายการ | แสดง badge สีตามเงื่อนไข · วน loop แสดงรายการได้ |
| 1 | `wk1-content3-ai.md` | AI & Prompt Engineering: 4-part prompt, debug TypeScript Error ด้วย AI | เขียน Prompt ดีขึ้น · ถาม AI แก้ Error เป็น |
| 2 | `wk1-lab1-components.md` | **Lab:** Component + Props + Interface + Status Badge | สร้าง EquipmentCard รับ props · แสดง badge สีตามสถานะ |

**TypeScript Focus:** `string`, `number`, `boolean` · Props Interface · `Record<string, string>`

---

### 🛠️ wk2 · ฟังก์ชันและข้อมูล (สัปดาห์ 3–4)

> **เป้าหมาย:** เข้าใจ useState + useEffect · สร้าง Custom Hook · ออกแบบ Data Model · แสดง Mock Data

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 3 | `wk2-content1-state.md` | useState — State, Setter, Re-render | `useState<T>`, `T \| null` |
| 3 | `wk2-content2-effect.md` | useEffect — Side Effects, Dependency Array | — |
| 3 | `wk2-content3-hooks.md` | Custom Hooks (useEquipments) | `interface Equipment {}` |
| 3 | `wk2-content4-types.md` | Data Model: Types & Interfaces | `type`, `interface`, Union Types |
| 4 | `wk2-lab1-data-mock.md` | **Lab:** State + Mock Data Array | `useState<Equipment[]>` |

---

### 🎨 wk3 · UI + Forms + Validation (สัปดาห์ 5–6)

> **เป้าหมาย:** ติดตั้ง Tailwind CSS · สร้าง Controlled Form · เพิ่ม Validation · จัดการ FormEvent

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 5 | `wk3-content1-tailwind.md` | Tailwind CSS + Responsive Grid | Union Types สำหรับ status |
| 5 | `wk3-content2-forms.md` | Controlled Forms — onChange, value, FormEvent | `React.ChangeEvent<HTMLInputElement>`, `React.FormEvent` |
| 6 | `wk3-content3-validation.md` | Form Validation (Zod / manual) | — |
| 6 | `wk3-lab1-asset-form.md` | **Lab:** ฟอร์มเบิกอุปกรณ์ + Error | `React.FormEvent` |

---

### 🔌 wk4 · API & Database (สัปดาห์ 7–8)

> **เป้าหมาย:** เรียก API ด้วย Axios · จัดการ loading/error state · เข้าใจโครงสร้าง Database

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 7 | `wk4-content1-fetch.md` | Axios & API Calls | `apiClient.get<ApiResponse<T>>()` |
| 7 | `wk4-content2-async.md` | Async/Await + Loading State | `Promise<T>`, `useCallback` |
| 7 | `wk4-content3-database.md` | Database Schema & API Response Types — อ่าน ERD เพื่อเข้าใจโครงสร้าง API | Type Aliases |
| 8 | `wk4-lab1-api-connect.md` | **Lab:** เชื่อมต่อ API จริง (CRUD) | `Promise<T>` |

---

### ⚖️ wk5 · Midterm + State (สัปดาห์ 9–10)

> **เป้าหมาย:** สอบกลางภาค · เข้าใจ Context API · แยก global state จาก local state ได้

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 9 | `wk5-midterm-exam.md` | **สอบกลางภาค** + นำเสนอโปรเจกต์ | ทบทวน Types & Interfaces |
| 10 | `wk5-content1-props.md` | Props Drilling — เมื่อไหร่ควร Lift State ขึ้นไปไว้ที่ parent | — |
| 10 | `wk5-content2-context.md` | Context API + useContext — แชร์ state ข้าม component | `createContext<T>`, `AuthContextType` |

---

### 🔐 wk6 · Cookies & Session (สัปดาห์ 11–12)

> **เป้าหมาย:** เข้าใจ localStorage · สร้าง Axios Interceptor · ทำ Login UI

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 11 | `wk6-content1-cookies.md` | Cookies & localStorage — บันทึก อ่าน และลบข้อมูลใน Browser | `User \| null` |
| 11 | `wk6-content2-session.md` | Auth Session + Axios Interceptor | Type Assertion |
| 12 | `wk6-lab1-login-ui.md` | **Lab:** LoginPage + Auth Flow | `FormEvent` |

---

### 🛡️ wk7 · JWT + Routes + Real-time (สัปดาห์ 13–14)

> **เป้าหมาย:** เข้าใจ JWT · สร้าง Protected Routes · รับ real-time event ด้วย Socket.io

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 13 | `wk7-content1-jwt.md` | JWT Structure + Token Expiry Check + ProtectedRoute Logic | `TokenPayload` |
| 13 | `wk7-content2-routes.md` | React Router v6 + Protected Routes | `React.ReactNode` |
| 13 | `wk7-content3-realtime.md` | Real-time Socket.io + Custom Hook | Event Payload Types |
| 14 | `wk7-lab1-auth-flow.md` | **Lab:** Navbar + Complete Auth Flow | `Record<K,V>` |

---

### 🚀 wk8 · Test & Deploy (สัปดาห์ 15–16)

> **เป้าหมาย:** เขียน Test Cases · Deploy บน Render/VPS · สาธิตระบบสมบูรณ์

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 15 | `wk8-content1-testplan.md` | Test Plan + Test Cases | `Partial<T>`, `Omit<T>` |
| 16 | `wk8-content2-deploy.md` | Deploy + Environment Variables | `import.meta.env` |
| 16 | `wk8-lab1-golive.md` | **Lab:** Go Live Simulation + Demo | — |

---

### 🏆 wk9 · Final (สัปดาห์ 17–18)

> **เป้าหมาย:** นำเสนอโปรเจกต์ · สอบปลายภาค (Practical + Theory)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 17 | `wk9-project-defense.md` | Project Defense + Code Interview | ทบทวน Type Safety |
| 18 | `wk9-final-exam.md` | **สอบปลายภาค** — สมรรถนะรวบยอด | TypeScript ครอบคลุมทั้งหมด |

---

## การแมปหัวข้อจาก PDF หลักสูตร

| หัวข้อจาก PDF | ไฟล์ในหลักสูตร | สถานะ |
| :--- | :--- | :-: |
| โครงสร้างโปรแกรม | `wk1-content1-intro.md` | ✅ |
| สร้างและใช้ฟังก์ชัน | `wk2-content3-hooks.md` | ✅ |
| รับข้อมูลจากฟอร์ม (Controlled Form) | `wk3-content2-forms.md` | ✅ |
| ตรวจสอบข้อมูลจากฟอร์ม (Validation) | `wk3-content3-validation.md` | ✅ |
| เชื่อมต่อฐานข้อมูล (API) | `wk4-content1-fetch.md` | ✅ |
| ออกแบบและจัดการฐานข้อมูล | `wk4-content3-database.md` | ✅ |
| การจัดการ Cookies | `wk6-content1-cookies.md` | ✅ |
| JSON Web Token / Session | `wk7-content1-jwt.md` | ✅ |
| Test Plan + Timeline | `wk8-content1-testplan.md` | ✅ |
| Go Live / No Go Live | `wk8-lab1-golive.md` | ✅ |
| AI Prompt Engineering | `wk1-content3-ai.md` | ➕ เพิ่มเติม |
| Real-time (Socket.io) | `wk7-content3-realtime.md` | ➕ เพิ่มใหม่ |
