# Course Outline <Badge type="info" text="21901-2003" />

**รายวิชา:** 21901-2003 การพัฒนาเว็บแอปพลิเคชัน (Web Based Application Development)
**หน่วยกิต:** 1-4-3 | **มาตรฐาน:** TPQI 10302 ระดับ 3

---

## 🎯 จุดประสงค์รายวิชา

::: info วัตถุประสงค์
1. **ด้านความรู้ (Knowledge):** อธิบายหลักการ สถาปัตยกรรม และรูปแบบการพัฒนาเว็บแอปพลิเคชันได้
2. **ด้านทักษะ (Skills):** พัฒนาเว็บแอปพลิเคชันที่เชื่อมต่อฐานข้อมูล ทำ CRUD, Login/Logout, Registration และ Real-time ได้
3. **ด้านคุณลักษณะ (Attitude):** มีวินัย รับผิดชอบต่องานและผู้เรียนร่วม ประเมินงานอย่างมีหลักเกณฑ์ได้
:::

---

## 🏗️ โปรเจกต์หลักประจำวิชา

> **"ระบบเบิก-จ่ายอุปกรณ์ไอที" (IT Equipment Checkout System)**
> พัฒนาเว็บแอปสำหรับจัดการการยืม-คืนอุปกรณ์คอมพิวเตอร์ในองค์กร
> ครอบคลุม CRUD, Authentication, Real-time Status, Server Validation และ Deployment

---

## 📅 ตารางเนื้อหา 9 โมดูล (18 สัปดาห์)

### Module 1 — Web App Fundamentals <Badge type="tip" text="สัปดาห์ 1–2" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk1-content1-intro](/wk1/wk1-content1-intro) | Web App Architecture + HTTP + REST API | `string`, `number`, `boolean` |
| ใบงาน | [wk1-lab1-components](/wk1/wk1-lab1-components) | ติดตั้ง Node.js, npm, Vite + React | Basic Types ทบทวน |

**Learning Outcomes:** อธิบายความแตกต่างระหว่าง Web App กับ Website ได้ / ติดตั้ง Development Environment ได้

---

### Module 2 — React Components <Badge type="tip" text="สัปดาห์ 3–4" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk2-content1-state](/wk2/wk2-content1-state) | React, JSX, Props, State, useState | `interface`, `type` props |
| ใบงาน | [wk2-lab1-data-mock](/wk2/wk2-lab1-data-mock) | สร้าง Card Component รายการอุปกรณ์ | Typed Props |

**Learning Outcomes:** สร้าง Functional Component พร้อม Typed Props ได้ / ใช้ useState จัดการ State ได้

---

### Module 3 — UI + Forms + Validation <Badge type="tip" text="สัปดาห์ 5–6" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk3-content1-tailwind](/wk3/wk3-content1-tailwind) | Tailwind CSS — Utility Classes | `Union Types`, `Literal Types` |
| เนื้อหา | [wk3-content2-forms](/wk3/wk3-content2-forms) | Controlled Forms — onChange + value | `React.ChangeEvent<T>` |
| เนื้อหา | [wk3-content3-validation](/wk3/wk3-content3-validation) | Form Validation + Zod | Zod schema types |
| เนื้อหา | [wk3-content4-component-patterns](/wk3/wk3-content4-component-patterns) | Component Patterns — Function Props + Lifting State | `(id: number) => void` |
| ใบงาน | [wk3-lab1-asset-form](/wk3/wk3-lab1-asset-form) | EquipmentPage + BorrowForm | Type Guard |

**Learning Outcomes:** สร้าง Controlled Form ที่มี Validation พร้อมแสดง Error Message ได้ / ใช้ Function Props และ Lifting State Up ได้

---

### Module 4 — Database & CRUD <Badge type="tip" text="สัปดาห์ 7–8" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk4-content1-fetch](/wk4/wk4-content1-fetch) | REST API Fetch, Axios, CRUD Pattern | `Type Aliases`, Async/Await types |
| ใบงาน | [wk4-lab1-api-connect](/wk4/wk4-lab1-api-connect) | CRUD อุปกรณ์ไอที (Create/Read/Update/Delete) | Typed API Response |

**Learning Outcomes:** เชื่อมต่อ REST API ได้ / ทำ CRUD operations ครบ 4 operations ได้

---

### Module 5 — State Management <Badge type="tip" text="สัปดาห์ 9–10" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk5-content1-props](/wk5/wk5-content1-props) | Props Drilling & useAuth | `AuthContextType` |
| เนื้อหา | [wk5-content2-context](/wk5/wk5-content2-context) | Context API + useContext | `createContext<T>` |
| ใบงาน | [wk5-lab1-auth-context](/wk5/wk5-lab1-auth-context) | AuthContext + AuthProvider + Navbar | `AuthContextType` |

**Learning Outcomes:** แก้ปัญหา Props Drilling ด้วย Context API ได้ / สร้าง AuthProvider และใช้ useAuthContext() ได้

---

### Module 6 — Authentication <Badge type="tip" text="สัปดาห์ 10–12" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk6-content1-cookies](/wk6/wk6-content1-cookies) | Cookie, JWT, Session Management, Login/Logout | Generics `<T>` เบื้องต้น |
| ใบงาน | [wk6-lab1-login-ui](/wk6/wk6-lab1-login-ui) | เพิ่ม Login/Register เข้าระบบเบิก-จ่าย | Generic API Response |

**Learning Outcomes:** อธิบายความแตกต่าง Cookie กับ JWT ได้ / ทำ Protected Route ด้วย JWT ได้

---

### Module 7 — Real-time & Server Validation <Badge type="tip" text="สัปดาห์ 13–14" />

| ประเภท | ไฟล์ | หัวข้อ | TypeScript Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk7-content1-jwt](/wk7/wk7-content1-jwt) | JWT: JSON Web Token | JWT payload types |
| เนื้อหา | [wk7-content2-routes](/wk7/wk7-content2-routes) | React Router v6 + Protected Routes | `React.ReactNode` |
| เนื้อหา | [wk7-content3-realtime](/wk7/wk7-content3-realtime) | Real-time ด้วย Socket.io | Socket event types |
| ใบงาน | [wk7-lab1-auth-flow](/wk7/wk7-lab1-auth-flow) | Navbar + Auth Flow | Route guard types |

**Learning Outcomes:** ใช้ WebSocket แสดงข้อมูล Real-time ได้ / ทำ Server-side Validation ป้องกัน Invalid Data ได้

---

### Module 8 — DB Design & Deployment <Badge type="tip" text="สัปดาห์ 15–16" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk8-content1-testplan](/wk8/wk8-content1-testplan) | Database Design, Test Planning, Timeline |
| ใบงาน | [wk8-lab1-golive](/wk8/wk8-lab1-golive) | Deploy ระบบขึ้น Server + Go/No-go Checklist |

**Learning Outcomes:** ออกแบบ ER Diagram ได้ / วางแผนทดสอบ (Test Case) ได้ / Deploy เว็บแอปได้

---

### Module 9 — Final Project <Badge type="danger" text="สัปดาห์ 17–18 (สอบปลายภาค)" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| Project | [wk9-final-exam](/wk9/wk9-final-exam) | ส่งระบบเบิก-จ่ายอุปกรณ์ไอทีฉบับสมบูรณ์ |

**เกณฑ์ประเมิน:** ระบบทำงานครบถ้วน / มี Auth + Real-time / Deploy จริง / Code Review Presentation

---

## 📊 สัดส่วนคะแนน

| หัวข้อ | คะแนน |
| :--- | :---: |
| คะแนนเก็บ (มินิแล็บ wk1–wk4, wk6–wk8) | 40 |
| สอบกลางภาค (wk5 Project) | 20 |
| สอบปลายภาค (wk9 Final Project + Presentation) | 40 |
| **รวม** | **100** |

---

## 🛠️ Tech Stack ที่ใช้ในวิชา

::: code-group
```bash [Frontend]
React 18 + TypeScript + Vite
Tailwind CSS (styling)
Axios (HTTP client)
React Router (routing)
Zod (validation)
```
```bash [Backend]
Node.js + Express
Prisma ORM
SQLite (dev) / PostgreSQL (prod)
JSON Web Token (JWT)
Socket.io (real-time)
```
```bash [Tools]
Git + GitHub
VS Code + Extensions
Postman (API testing)
Railway / Render (deployment)
```
:::
