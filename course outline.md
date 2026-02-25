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
| **CLIL** | บังคับตั้งชื่อตัวแปร/ฟังก์ชัน/Interface เป็นภาษาอังกฤษ · ฝึกเขียน AI Prompt ภาษาอังกฤษ |
| **Progressive TypeScript** | สอน TS แบบ Just-in-Time ควบคู่ React — ไม่แยกสอนทฤษฎีล้วน |
| **PjBL** | ทุกบทต่อยอดโปรเจกต์ "ระบบเบิก-จ่ายอุปกรณ์ไอที" ชิ้นเดียวตั้งแต่ต้นจนจบ |
| **MIAP** | ทุกหน้า: Motivation → Information → Application → Progress |
| **AI-Assisted** | ทุกบทมี AI Prompt Guide พร้อมใช้ — เอกสารสร้างใน VitePress |

---

## Course Outline — 9 โมดูล / 18 สัปดาห์

### 📦 wk1 · โครงสร้างพื้นฐาน (สัปดาห์ 1–2)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 1 | `wk1-content1-intro.md` | โครงสร้าง React + ตั้งค่า Vite + TypeScript | `string`, `number`, `boolean` |
| 1 | `wk1-content2-ai.md` | AI & Prompt Engineering | — |
| 2 | `wk1-lab1-components.md` | **Lab:** Components & Props | Props Interface |

---

### 🛠️ wk2 · ฟังก์ชันและข้อมูล (สัปดาห์ 3–4)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 3 | `wk2-content1-hooks.md` | สร้างฟังก์ชัน (Custom Hooks) | `interface Equipment {}` |
| 3 | `wk2-content2-types.md` | สร้าง Data Model (Types & Interfaces) | `type`, `interface` |
| 4 | `wk2-lab1-data-mock.md` | **Lab:** State + Mock Data | `useState<Equipment[]>` |

---

### 🎨 wk3 · UI + Validation (สัปดาห์ 5–6)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 5 | `wk3-content1-tailwind.md` | Tailwind CSS + Responsive Grid | Union Types สำหรับ status |
| 5 | `wk3-content2-validation.md` | Form Validation (React Hook Form) | — |
| 6 | `wk3-lab1-asset-form.md` | **Lab:** ฟอร์มเบิกอุปกรณ์ + Error | `React.FormEvent` |

---

### 🔌 wk4 · API & Database (สัปดาห์ 7–8)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 7 | `wk4-content1-fetch.md` | Axios & API Calls | `apiClient.get<ApiResponse<T>>()` |
| 7 | `wk4-content2-async.md` | Async/Await + Loading State | `Promise<T>`, `useCallback` |
| 7 | `wk4-content3-database.md` | Database Design (Prisma Schema + ERD) | Type Aliases |
| 8 | `wk4-lab1-api-connect.md` | **Lab:** เชื่อมต่อ API จริง (CRUD) | `Promise<T>` |

---

### ⚖️ wk5 · Midterm + State (สัปดาห์ 9–10)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 9 | `wk5-midterm-exam.md` | **สอบกลางภาค** + นำเสนอโปรเจกต์ | ทบทวน Types & Interfaces |
| 10 | `wk5-content1-state.md` | State Management + Props vs Context | `AuthContextType` |

---

### 🔐 wk6 · Cookies & Session (สัปดาห์ 11–12)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 11 | `wk6-content1-cookies.md` | Cookies & localStorage + Lazy Initializer | `User \| null` |
| 11 | `wk6-content2-session.md` | Auth Session + Axios Interceptor | Type Assertion |
| 12 | `wk6-lab1-login-ui.md` | **Lab:** LoginPage + Auth Flow | `FormEvent` |

---

### 🛡️ wk7 · JWT + Routes + Real-time (สัปดาห์ 13–14)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 13 | `wk7-content1-jwt.md` | JWT Structure + requireAuth Middleware | `TokenPayload` |
| 13 | `wk7-content2-routes.md` | React Router v6 + Protected Routes | `React.ReactNode` |
| 13 | `wk7-content3-realtime.md` | Real-time Socket.io + Custom Hook | Event Payload Types |
| 14 | `wk7-lab1-auth-flow.md` | **Lab:** Navbar + Complete Auth Flow | `Record<K,V>` |

---

### 🚀 wk8 · Test & Deploy (สัปดาห์ 15–16)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 15 | `wk8-content1-testplan.md` | Test Plan + Test Cases | `Partial<T>`, `Omit<T>` |
| 16 | `wk8-content2-deploy.md` | Deploy + Environment Variables | `import.meta.env` |
| 16 | `wk8-lab1-golive.md` | **Lab:** Go Live Simulation + Demo | — |

---

### 🏆 wk9 · Final (สัปดาห์ 17–18)

| สัปดาห์ | ไฟล์ | หัวข้อ | TypeScript Focus |
| :-: | :--- | :--- | :--- |
| 17 | `wk9-project-defense.md` | Project Defense + Code Interview | ทบทวน Type Safety |
| 18 | `wk9-final-exam.md` | **สอบปลายภาค** — สมรรถนะรวบยอด | TypeScript ครอบคลุมทั้งหมด |

---

## การแมปหัวข้อจาก PDF หลักสูตร

| หัวข้อจาก PDF | ไฟล์ในหลักสูตร | สถานะ |
| :--- | :--- | :-: |
| โครงสร้างโปรแกรม | `wk1-content1-intro.md` | ✅ |
| สร้างและใช้ฟังก์ชัน | `wk2-content1-hooks.md` | ✅ |
| รับ/ตรวจสอบข้อมูลจากฟอร์ม | `wk3-content2-validation.md` | ✅ |
| เชื่อมต่อฐานข้อมูล (API) | `wk4-content1-fetch.md` | ✅ |
| ออกแบบและจัดการฐานข้อมูล | `wk4-content3-database.md` | ✅ เพิ่มใหม่ |
| การจัดการ Cookies | `wk6-content1-cookies.md` | ✅ |
| JSON Web Token / Session | `wk7-content1-jwt.md` | ✅ |
| Test Plan + Timeline | `wk8-content1-testplan.md` | ✅ |
| Go Live / No Go Live | `wk8-lab1-golive.md` | ✅ |
| AI Prompt Engineering | `wk1-content2-ai.md` | ➕ เพิ่มเติม |
| Real-time (Socket.io) | `wk7-content3-realtime.md` | ➕ เพิ่มใหม่ |
