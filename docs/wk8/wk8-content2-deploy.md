# เตรียม Deploy ระบบ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบทำงานได้บนเครื่อง Developer แล้ว — แต่ต้องให้คนอื่นใช้ได้ด้วย ต้อง "Deploy" ขึ้น Server จริง การ Deploy ไม่ใช่แค่ copy ไฟล์ แต่ต้องเข้าใจความแตกต่างระหว่าง Development กับ Production environment
:::

> 💡 **เปรียบเทียบ:** Development เหมือน "ซ้อม" อยู่หลังเวที — Production เหมือน "แสดงจริง" ต่อหน้าผู้ชม กฎ กติกา และความระมัดระวังต่างกันมาก

---

## 📖 I: Information

### Development vs Production

| | Development | Production |
| :--- | :--- | :--- |
| Port | 5173 (Vite dev server) | 80/443 (Nginx/Web server) |
| API URL | ว่าง (Vite proxy) | URL จริง เช่น `https://api.example.com` |
| Build | ไม่ต้อง build | `npm run build` → `dist/` |
| Source Maps | มี (debug ง่าย) | ไม่มี (ซ่อน code) |
| Hot Reload | ✅ | ❌ |
| JWT Secret | `dev-secret-key-...` | ต้องเป็น random string ยาว |

### Build Frontend

```bash
# ขั้น 1: build
cd project/frontend
npm run build
# ผลลัพธ์: dist/ folder

# ขั้น 2: preview build locally
npm run preview
# เปิด http://localhost:4173

# ขั้น 3: ดู bundle size
# Vite แสดง output: gzip ขนาดไฟล์
```

### Environment Variables

::: code-group
```env [.env (development — ไม่ต้องตั้ง)]
# Vite ใช้ proxy → ไม่ต้องตั้ง VITE_API_URL
```

```env [.env.production (ตั้งค่าสำหรับ deploy)]
# URL ของ Backend จริง
VITE_API_URL=https://api.myschool.ac.th
```

```ts [api/config.ts — ใช้ env var]
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  // Development: '' → proxy ไป localhost:3000
  // Production: 'https://api.myschool.ac.th'
  headers: { 'Content-Type': 'application/json' },
})
```
:::

### vite.config.ts — Proxy (Development only)

```ts [vite.config.ts]
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,  // WebSocket proxy
      },
    },
  },
})
```

::: tip 💡 สำคัญ
`server.proxy` ทำงานเฉพาะตอน `npm run dev` เท่านั้น ตอน build จริง (`npm run build`) ไม่มี proxy — ต้องตั้ง `VITE_API_URL` ให้ถูกต้อง
:::

### Deploy Checklist

```bash
# Frontend
□ npm run build — ไม่มี TypeScript error
□ ตั้ง .env.production ให้ถูกต้อง
□ ทดสอบ npm run preview ก่อน deploy

# Backend
□ เปลี่ยน JWT_SECRET เป็น random string ยาว (ไม่ใช่ dev-secret)
□ ตั้ง DATABASE_URL ให้ชี้ไป Production DB
□ เปิด CORS ให้ Frontend domain
□ ปิด debug logs

# Database
□ รัน npx prisma db push บน Production DB
□ Seed ข้อมูลเริ่มต้น (admin account)
□ Backup ข้อมูลก่อน deploy ทุกครั้ง
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"อะไรคือความแตกต่างหลักระหว่าง React development environment กับ production build ควรตั้ง environment variables อะไรบ้างสำหรับ production และ Vite proxy ทำงานอย่างไร ทำไมถึงใช้ไม่ได้ใน production"
:::

### 📝 PjBL Lab

- [ ] รัน `npm run build` ใน project/frontend — ตรวจว่าไม่มี error
- [ ] รัน `npm run preview` — ทดสอบ build version ที่ localhost:4173
- [ ] ดู dist/ folder — มีไฟล์อะไรบ้าง?
- [ ] ดู Terminal output หลัง build — bundle size เป็นเท่าไร?
- [ ] เปรียบเทียบ `.env` กับ `.env.production` — ต่างกันอย่างไร?
- [ ] อธิบาย: ทำไม proxy ถึงใช้ไม่ได้ใน Production?

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `npm run build` ถึงสำคัญกว่าแค่ copy ไฟล์ .tsx ขึ้น server?
**แนวคำตอบ:** Browser ไม่เข้าใจ TypeScript หรือ JSX โดยตรง — `npm run build` แปลง TypeScript → JavaScript, bundle ไฟล์หลายร้อยไฟล์เป็นไฟล์เดียว, minify โค้ด, optimize imports ทำให้โหลดเร็วและรันได้ใน Browser ทุกตัว
:::

::: details ❓ `VITE_` prefix ใน env variable มีความสำคัญอย่างไร?
**แนวคำตอบ:** Vite จงใจ expose เฉพาะ env variable ที่ขึ้นต้นด้วย `VITE_` ให้ client code เท่านั้น ตัวแปรอื่นเช่น `DATABASE_URL`, `JWT_SECRET` จะไม่ถูก include ใน bundle ป้องกัน secret หลุดออกสู่ Browser
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Build สำเร็จ | `npm run build` ไม่มี error | build ได้แต่มี warning | build ไม่ผ่าน |
| Environment Variables | เข้าใจความแตกต่าง dev/prod | รู้ว่าต้องตั้งแต่ไม่รู้วิธี | ไม่รู้จัก env vars |
| Deploy checklist | ผ่านทุกข้อ | ผ่านบางข้อ | ไม่ได้ทำ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Build` | กระบวนการแปลง Source Code เป็น Optimized Files สำหรับ Production |
| `Bundle` | ไฟล์ที่รวม JavaScript หลายไฟล์เข้าด้วยกัน |
| `Environment Variable` | ค่าตัวแปรที่เปลี่ยนตาม environment (dev/staging/prod) |
| `Minify` | บีบอัด JavaScript ให้เล็กลงโดยลบ space/comment ออก |
| `dist/` | โฟลเดอร์ผลลัพธ์จากการ build พร้อม deploy |
| `CORS` | Cross-Origin Resource Sharing — นโยบาย Browser ที่ Backend ต้องตั้งค่า |
