# เตรียม Deploy ระบบ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบทำงานได้บนเครื่อง Developer แล้ว — แต่ต้องให้คนอื่นใช้ได้ด้วย ต้อง "Deploy" ขึ้น Server จริง การ Deploy ไม่ใช่แค่ copy ไฟล์ .tsx ขึ้น server เพราะ Browser ไม่เข้าใจ TypeScript หรือ JSX ต้อง build ก่อนเสมอ
:::

> 💡 **เปรียบเทียบ:** Development เหมือน "ซ้อม" อยู่หลังเวที — Production เหมือน "แสดงจริง" ต่อหน้าผู้ชม กฎ กติกา และความระมัดระวังต่างกันมาก

---

## 📖 I: Information

### ขั้นตอนที่ 1 — ทำความเข้าใจสภาพแวดล้อม Development และ Production

การทำงานบนเครื่องคอมพิวเตอร์ของเราเอง (Localhost) เรียกว่า **Development Environment** ซึ่งเต็มไปด้วยตัวช่วยอำนวยความสะดวกสำหรับนักพัฒนา เช่น ข้อความแจ้งเตือน Error แบบละเอียด (Stack Trace) หรือระบบโหลดหน้าเว็บใหม่ทันทีเมื่อแก้โค้ด (Hot Reload) 

แต่เมื่อเราจะนำระบบขึ้นไปติดตั้งบนอินเทอร์เน็ตให้คนทั่วไปเข้าใช้งาน หรือที่เรียกว่า **Production Environment** กฎเกณฑ์จะพลิกกลับไปอีกด้าน เราไม่ต้องการให้คนนอกเห็นโครงสร้างโค้ด เราต้องการโค้ดที่รีดประสิทธิภาพจนมีขนาดเล็กที่สุด และต้องการช่องทางที่เชื่อมต่อไปยังฐานข้อมูลหรือเซิร์ฟเวอร์ปลายทางของจริง ซึ่งความแตกต่างหลัก ๆ มีดังนี้:

| | Development | Production |
| :--- | :--- | :--- |
| Port | 5173 (Vite dev server) | 80/443 (Web server) |
| API URL | ว่าง (Vite proxy ทำงานแทน) | URL จริง เช่น `https://api.example.com` |
| Build | ไม่ต้อง build (HMR) | `npm run build` → `dist/` |
| Source Maps | มี (debug ง่าย) | ไม่มี (ซ่อน source code) |
| Hot Reload | ✅ เปลี่ยนทันที | ❌ ต้อง deploy ใหม่ |
| JWT Secret | `dev-secret-key-...` | random string ยาว 64+ ตัวอักษร |
| Error Details | แสดงเต็ม (stack trace) | ซ่อน — แสดงแค่ message ทั่วไป |

**กฎสำคัญ:** Vite `server.proxy` ทำงานเฉพาะตอน `npm run dev` — เมื่อ build แล้วต้องตั้ง `VITE_API_URL` แทน

---

### ขั้นตอนที่ 2 — Build Frontend

```bash
# [1] เข้าไปใน folder frontend
cd project/frontend

# [2] ตรวจ TypeScript error ก่อน — ต้อง 0 errors
npx tsc --noEmit

# [3] Build production — แปลง TypeScript + JSX → JavaScript ที่ Browser อ่านได้
npm run build
# ผลลัพธ์: dist/ folder พร้อม deploy

# [4] Preview build ที่ port 4173 — ทดสอบก่อน deploy จริง
npm run preview
# เปิด http://localhost:4173

# [5] ดู Bundle Size จาก terminal output:
# dist/index.html          1.23 kB
# dist/assets/index-Cd1x.css   45.23 kB │ gzip: 8.12 kB
# dist/assets/index-Bk2y.js   234.56 kB │ gzip: 78.34 kB
```

**สรุป:** `tsc --noEmit` `[2]` ตรวจ type โดยไม่สร้างไฟล์ → `npm run build` `[3]` สร้าง `dist/` → `npm run preview` `[4]` ทดสอบก่อน deploy

::: code-group
```bash [✅ วิธีตรวจสอบ dist/ folder]
# หลัง build ดูโครงสร้าง dist/
ls dist/
# dist/
# ├── index.html       ← entry point
# ├── assets/
# │   ├── index-[hash].js   ← JavaScript bundle (minified)
# │   └── index-[hash].css  ← CSS bundle (minified)
# [hash] คือตัวเลข random — บังคับให้ Browser โหลดใหม่ทุกครั้ง (cache busting)
```

```bash [❌ ข้อผิดพลาดที่พบบ่อย]
# ❌ ลืมรัน build แล้วเอา src/ ขึ้น server
# Browser ไม่สามารถรัน .tsx ได้โดยตรง

# ❌ build ผ่านแต่ runtime error ใน Production
# สาเหตุ: VITE_API_URL ไม่ถูกตั้ง → API call ไปที่ '' (ตัวเอง)
# ตรวจ: DevTools → Network → ดู request URL
```

```bash [💡 cache busting คืออะไร]
# [hash] ใน ชื่อไฟล์ เช่น index-Cd1x.js
# เมื่อ build ใหม่ → hash เปลี่ยน → ชื่อไฟล์เปลี่ยน
# Browser เห็นชื่อใหม่ → โหลด version ใหม่ทันที
# ไม่ต้องกด Ctrl+Shift+R เพื่อ clear cache
```
:::

---

### ขั้นตอนที่ 3 — Environment Variables

```ts [src/api/config.ts — ใช้ env var]
import axios from 'axios'

// [1] import.meta.env คือ Vite env object — ดึงค่าจากไฟล์ .env
// [2] ?? '' คือ fallback: ถ้าไม่ตั้ง VITE_API_URL ให้ใช้ '' (relative URL → ผ่าน proxy)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',  // [3] dev: '' | prod: 'https://api.xxx.ac.th'
  headers: { 'Content-Type': 'application/json' },
})
```

::: code-group
```env [.env (development — ไม่ต้องตั้ง)]
# [1] Development: Vite proxy ทำงานแทน — ไม่ต้องตั้ง VITE_API_URL
# request /api/... → proxy ไป http://localhost:3000/api/...
# baseURL = '' ทำให้ axios ส่งไปที่ same origin (port 5173 → proxy → 3000)
```

```env [.env.production (ตั้งค่าสำหรับ deploy)]
# [2] Production: ตั้ง URL ของ Backend จริง
VITE_API_URL=https://api.myschool.ac.th

# [3] ตัวแปรที่ขึ้นต้นด้วย VITE_ เท่านั้นที่ expose ให้ Client code
# DATABASE_URL, JWT_SECRET ต้องอยู่ใน Backend เท่านั้น — ห้ามใส่ที่นี่
```

```ts [vite.config.ts — proxy development only]
// [4] server.proxy ทำงานเฉพาะ npm run dev เท่านั้น
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // [5] Backend port
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,  // [6] ต้องเปิด WebSocket proxy
      },
    },
  },
})
```
:::

**สรุปการทำงาน:** Development → `baseURL = ''` → Vite proxy `[4]` รับคำขอ `/api/...` → forward ไป `:3000` | Production → `baseURL = 'https://api...'` `[2]` → axios ส่งตรงไป Backend จริง

---

### Deploy Checklist

```bash
# Frontend
□ npx tsc --noEmit — 0 TypeScript errors
□ npm run build — ไม่มี error
□ npm run preview — ทดสอบ production mode ที่ localhost:4173
□ ตั้ง .env.production ให้ถูกต้อง (VITE_API_URL)

# Backend
□ เปลี่ยน JWT_SECRET เป็น random string ยาว 64+ ตัว (ไม่ใช่ dev-secret)
□ ตั้ง DATABASE_URL ให้ชี้ไป Production Database
□ เปิด CORS ให้ Frontend domain เท่านั้น
□ ปิด debug logs + stack trace errors

# Database
□ รัน npx prisma db push บน Production DB
□ Seed ข้อมูลเริ่มต้น (admin account)
□ Backup ข้อมูลก่อน deploy ทุกครั้ง
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"อะไรคือความแตกต่างหลักระหว่าง React development environment กับ production build ควรตั้ง environment variables อะไรบ้างสำหรับ production และ Vite proxy ทำงานอย่างไร ทำไมถึงใช้ไม่ได้ใน production — อธิบาย `VITE_` prefix และทำไม JWT_SECRET ต้องอยู่ใน Backend เท่านั้น"
:::

### 📝 PjBL Lab

**เป้าหมาย:** สร้าง production build สำเร็จและเข้าใจ dev/prod ต่างกันอย่างไร

---

#### ขั้น 0 — Student Identity

ตรวจสอบว่า `<footer>` ชื่อ-รหัสยังอยู่ใน Component หลัก ✅

---

#### ขั้น 1 — TypeScript Check + Build

```bash
cd project/frontend
npx tsc --noEmit   # ต้องได้ 0 errors
npm run build      # ต้องสำเร็จ — ดู bundle size
npm run preview    # เปิด localhost:4173
```

- [ ] `npx tsc --noEmit` ผ่าน — 0 errors ✅
- [ ] `npm run build` สำเร็จ — มี `dist/` folder ✅
- [ ] `npm run preview` — เปิดใน browser ทำงานได้ปกติ ✅
- [ ] บันทึก bundle size ที่ได้ (js + css กี่ kB?)

---

#### ขั้น 2 — ตรวจ dist/ และ Environment Variables

- [ ] เปิด `dist/` folder — ดูว่ามีไฟล์อะไรบ้าง? ชื่อ [hash] ใน filename คืออะไร?
- [ ] เปิด `dist/assets/index-[hash].js` ด้วย text editor — โค้ดอ่านยากไหม? ทำไม?
- [ ] ตอบคำถาม: ถ้าต้อง deploy จริง ต้องตั้ง `VITE_API_URL` เป็นอะไร?
- [ ] ตอบคำถาม: ทำไม Vite proxy ถึงใช้ไม่ได้ใน production?

---

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย screenshot: terminal หลัง build (แสดง bundle size) + localhost:4173 ทำงาน
- [ ] `git add project/frontend/dist/` (ถ้าต้องการ)
- [ ] `git commit -m "wk8: production build success, understand dev vs prod"`
- [ ] `git push origin main`
- [ ] เขียนสรุปใน Google Doc: `npm run build` ทำอะไร, `VITE_` prefix ทำไมสำคัญ, proxy กับ production ต่างกันอย่างไร + screenshot

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `npm run build` ถึงสำคัญกว่าแค่ copy ไฟล์ .tsx ขึ้น server?
**แนวคำตอบ:** Browser ไม่เข้าใจ TypeScript หรือ JSX โดยตรง — `npm run build` ทำหลายอย่าง: 1) ตรวจ TypeScript type 2) แปลง TSX → JavaScript 3) bundle ไฟล์หลายร้อยไฟล์เป็น 1-2 ไฟล์ 4) minify (ลบ space/comment) 5) optimize imports → ผลลัพธ์คือไฟล์ขนาดเล็ก รันได้ทุก Browser
:::

::: details ❓ `VITE_` prefix ใน env variable มีความสำคัญอย่างไร?
**แนวคำตอบ:** Vite จงใจ expose เฉพาะ env variable ที่ขึ้นต้นด้วย `VITE_` ให้ client code เท่านั้น ตัวแปรอื่นเช่น `DATABASE_URL`, `JWT_SECRET` จะไม่ถูก include ใน bundle ป้องกัน secret หลุดออกสู่ Browser — ถ้าใส่ `JWT_SECRET=abc` ใน `.env` และไม่มี `VITE_` prefix: `import.meta.env.JWT_SECRET` จะเป็น `undefined`
:::

::: details ❓ `import.meta.env.VITE_API_URL ?? ''` — ทำไมใช้ `??` แทน `||`?
**แนวคำตอบ:** `??` (Nullish Coalescing) คืนค่าขวาเฉพาะเมื่อค่าซ้ายเป็น `null` หรือ `undefined` เท่านั้น ส่วน `||` คืนค่าขวาถ้าค่าซ้าย "falsy" รวมถึง `''` (string ว่าง) ด้วย — ในกรณีนี้ Development ต้องการให้ `baseURL = ''` (string ว่าง) แต่ถ้าใช้ `||` แล้ว `VITE_API_URL` เป็น `undefined` → `'' || ''` = `''` OK แต่ถ้า `VITE_API_URL = ''` (ตั้งค่าว่าง) → `'' || ''` = `''` ยังโอเค ทั้งคู่ใช้ได้แต่ `??` ชัดเจนกว่าในเจตนา
:::

::: details ❓ ทำไม Vite proxy (`server.proxy`) ถึงใช้ไม่ได้ใน Production?
**แนวคำตอบ:** `server.proxy` เป็น feature ของ Vite **development server** (`npm run dev`) เมื่อ build แล้ว (`npm run build`) สิ่งที่ได้คือ static files ใน `dist/` — ไม่มี Vite server ทำงานอยู่ → ไม่มีใครรับ request `/api/...` และ forward ไป Backend → ต้องตั้ง `VITE_API_URL` ให้ชี้ไป Backend URL จริง หรือตั้ง reverse proxy (Nginx) แทน
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Build สำเร็จ | `npx tsc --noEmit` 0 errors + build ผ่าน | build ได้แต่มี warning | build ไม่ผ่าน |
| Environment Variables | เข้าใจความแตกต่าง dev/prod + `VITE_` prefix | รู้ว่าต้องตั้งแต่ไม่รู้ทำไม | ไม่รู้จัก env vars |
| Deploy checklist | ผ่านทุกข้อ + อธิบายได้ | ผ่านบางข้อ | ไม่ได้ทำ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Build` | กระบวนการแปลง Source Code เป็น Optimized Files สำหรับ Production |
| `Bundle` | ไฟล์ที่รวม JavaScript หลายไฟล์เข้าด้วยกันเป็นไฟล์เดียว |
| `Environment Variable` | ค่าตัวแปรที่เปลี่ยนตาม environment (dev/staging/prod) |
| `Minify` | บีบอัด JavaScript ให้เล็กลงโดยลบ space/comment/ชื่อตัวแปรออก |
| `dist/` | โฟลเดอร์ผลลัพธ์จากการ build พร้อม deploy |
| `CORS` | Cross-Origin Resource Sharing — นโยบาย Browser ที่ Backend ต้องตั้งค่า |
| `Cache Busting` | เทคนิค hash ในชื่อไฟล์เพื่อบังคับ Browser โหลด version ใหม่ |
| `Source Map` | ไฟล์แมป minified code กลับไปหา source code ต้นฉบับ (สำหรับ debug) |
