# 21901-2003 การพัฒนาเว็บแอปพลิเคชัน

ตำราเรียนรายวิชา **21901-2003 Web Based Application Development** (หน่วยกิต 1-4-3)
จัดทำในรูปแบบเว็บไซต์ด้วย VitePress สำหรับใช้ประกอบการสอนในระดับอาชีวศึกษา

**โปรเจกต์หลัก:** ระบบเบิก-จ่ายอุปกรณ์ไอที (IT Equipment Checkout System)
**Stack:** React 18 + TypeScript + Tailwind CSS v3 + Vite · Node.js + Prisma + MySQL + Socket.io + JWT

---

## บรรณานุกรม

### แหล่งอ้างอิงภาษาไทย

สถาบันคุณวุฒิวิชาชีพ (องค์การมหาชน). (2566). *มาตรฐานอาชีพและคุณวุฒิวิชาชีพ สาขาวิชาชีพเทคโนโลยีสารสนเทศและการสื่อสาร และดิจิทัลคอนเทนต์ อาชีพนักพัฒนาระบบ รหัส 10302 ระดับ 3*. กรุงเทพฯ: สถาบันคุณวุฒิวิชาชีพ (องค์การมหาชน). สืบค้นเมื่อ 16 มีนาคม 2569, จาก https://tpqi-net.tpqi.go.th

สำนักงานคณะกรรมการการอาชีวศึกษา. (2567). *หลักสูตรประกาศนียบัตรวิชาชีพชั้นสูง พุทธศักราช 2563 ประเภทวิชาอุตสาหกรรม สาขาวิชาเทคโนโลยีสารสนเทศ รายวิชา 21901-2003 การพัฒนาเว็บแอปพลิเคชัน*. กรุงเทพฯ: สำนักงานคณะกรรมการการอาชีวศึกษา.

---

### แหล่งอ้างอิงภาษาต่างประเทศ

Axios Contributors. (2024). *Axios: Promise based HTTP client for the browser and node.js*. Retrieved March 16, 2026, from https://axios-http.com

Auth0 by Okta. (2024). *JSON Web Tokens: Introduction to JWT*. Retrieved March 16, 2026, from https://jwt.io

Colby, A. (2024). *Zod: TypeScript-first schema validation with static type inference*. Retrieved March 16, 2026, from https://zod.dev

Meta Platforms, Inc. (2024). *React: The library for web and native user interfaces*. Retrieved March 16, 2026, from https://react.dev

Microsoft Corporation. (2024). *TypeScript: JavaScript with syntax for types*. Retrieved March 16, 2026, from https://www.typescriptlang.org

Node.js Contributors. (2024). *Node.js: Run JavaScript everywhere*. Retrieved March 16, 2026, from https://nodejs.org

OpenJS Foundation. (2024). *Express: Fast, unopinionated, minimalist web framework for Node.js*. Retrieved March 16, 2026, from https://expressjs.com

Prisma Data, Inc. (2024). *Prisma: Next-generation Node.js and TypeScript ORM*. Retrieved March 16, 2026, from https://www.prisma.io

Socket.IO Contributors. (2024). *Socket.IO: Bidirectional and low-latency communication for every platform*. Retrieved March 16, 2026, from https://socket.io

Tailwind Labs, Inc. (2024). *Tailwind CSS: A utility-first CSS framework*. Retrieved March 16, 2026, from https://tailwindcss.com

Vite Contributors. (2024). *Vite: Next generation frontend tooling*. Retrieved March 16, 2026, from https://vitejs.dev

VitePress Contributors. (2024). *VitePress: Vite & Vue powered static site generator*. Retrieved March 16, 2026, from https://vitepress.dev

---

## โครงสร้างโปรเจกต์

```
├── docs/                  ← VitePress textbook site (wk1–wk9)
│   ├── .vitepress/
│   │   └── config.ts      ← Sidebar + navigation config
│   ├── wk1/ ถึง wk9/     ← เนื้อหาตำราเรียนทุกสัปดาห์
│   └── package.json
└── project/
    ├── frontend/          ← React 18 + TypeScript + Vite (answer key)
    └── backend/           ← Node.js + Express + Prisma + MySQL
```

## วิธีรัน

```bash
# Textbook site
cd docs
npm install
npm run dev        # localhost:5173

# Frontend (answer key)
cd project/frontend
npm install
npm run dev        # localhost:5173

# Backend
cd project/backend
npm install
npx prisma db push
npm run db:seed
npm run dev        # localhost:3000
```

## บัญชีทดสอบ (หลัง seed)

| บัญชี | รหัสผ่าน | สิทธิ์ |
| :--- | :--- | :--- |
| admin@school.ac.th | password123 | Admin |
| teacher@school.ac.th | password123 | Teacher |
| student@school.ac.th | password123 | Student |
