# JWT: JSON Web Token — Token ที่เชื่อได้ <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
Backend ต้องรู้ว่า "Request ที่เข้ามาเป็นของใคร มี role อะไร" — ถ้า Backend ต้อง query Database ทุก request เพื่อเช็ค user จะช้ามาก JWT แก้ปัญหาโดยเข้ารหัสข้อมูล user ลงใน token ที่ Backend ตรวจสอบได้ทันทีโดยไม่ต้อง query DB!
:::

> 💡 **เปรียบเทียบ:** JWT เหมือน "บัตรประชาชน Smart Card" — ใครออกให้ (Backend sign), ใครมีบัตรพิสูจน์ตัวได้ (Frontend ส่ง token), ร้านค้าตรวจ chip ได้ทันที (Backend verify) โดยไม่ต้องโทรถาม กรมการปกครอง (Database) ทุกครั้ง

---

## 📖 I: Information

### ขั้นตอนที่ 1 — เจาะลึกโครงสร้าง JWT: กุญแจ 3 ส่วน

JSON Web Token (JWT) เป็นมาตรฐานปิดผนึกข้อมูลที่แพร่หลายที่สุดในการทำ Authentication ยุคใหม่ โดยหลักการของมันคือการเปลี่ยนให้ "ฝั่งผู้ใช้" เป็นคนถือข้อมูลประจำตัวเอาไว้เอง แทนที่จะให้เซิร์ฟเวอร์ต้องคอยจำว่าใครล็อกอินอยู่บ้าง

ความฉลาดของ JWT คือมันไม่ได้เข้ารหัสให้เป็นความลับ (ใครก็แกะอ่านได้) แต่มันใช้การแจกลายเซ็นดิจิทัล (Digital Signature) เพื่อรับประกันว่าข้อมูลนี้ส่งตรงมาจากเซิร์ฟเวอร์ของเราจริงและยังไม่ถูกแฮกเกอร์แอบดัดแปลงระหว่างทาง โดยตัวมันประกอบด้วย 3 ส่วน คั่นด้วย `.` (จุด) เสมอ:

JWT ประกอบด้วย 3 ส่วน คั่นด้วย `.` (จุด):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5Ac2Nob29sLmFjLnRoIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwODY0MDB9
.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

[   Header   ].[                  Payload                  ].[  Signature  ]
```

| ส่วน | เนื้อหา (decoded) | หมายเหตุ |
| :--- | :--- | :--- |
| **Header** | `{ "alg": "HS256", "typ": "JWT" }` | algorithm ที่ใช้ sign |
| **Payload** | `{ userId, email, role, iat, exp }` | ข้อมูล user — **ใครก็อ่านได้!** |
| **Signature** | `HMAC-SHA256(header+payload, secret)` | พิสูจน์ว่า Backend ออกให้จริง |

::: code-group
```ts [✅ decode Payload ด้วย atob()]
// Payload ถูก Base64 encode — ใครก็ decode ได้ (ไม่ใช่ encrypted)
const parts = token.split('.')   // [1] แยก 3 ส่วน
const payload = JSON.parse(atob(parts[1]))  // [2] decode ส่วนที่ 2
// → { userId: 1, email: 'admin@school.ac.th', role: 'admin', iat: ..., exp: ... }
```
```ts [💡 Payload ไม่ใช่ Encrypted — อย่าใส่ข้อมูล sensitive]
// ❌ ห้ามใส่ข้อมูลเหล่านี้ใน JWT payload:
// - password (ใครก็อ่านได้!)
// - เลขบัตรประชาชน
// - ข้อมูลส่วนตัวที่ไม่ควรเผยแพร่

// ✅ ใส่ได้: ข้อมูลที่ผู้ใช้รู้อยู่แล้ว
// userId, email, role, iat, exp
```
```ts [💡 ทดสอบ decode ด้วย jwt.io]
// 1. Login แล้ว copy token จาก localStorage DevTools
// 2. เปิด https://jwt.io
// 3. วาง token ใน Encoded box ซ้าย
// 4. ดู Decoded Payload ด้านขวา — เห็น userId, email, role, exp
```
:::

**`iat` และ `exp` คืออะไร:**
- `iat` (issued at) — Unix timestamp ตอนที่ Backend สร้าง token
- `exp` (expiration) — Unix timestamp ที่ token จะหมดอายุ (`expiresIn: '24h'` = 86400 วินาที)

---

### ขั้นตอนที่ 2 — Backend: Sign และ Verify JWT

```ts [backend/src/routes/auth.ts — Sign JWT ตอน login]
import jwt from 'jsonwebtoken'

// [1] POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // [2] ตรวจสอบ user + password ใน Database
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' })
  }

  // [3] Sign JWT — เข้ารหัสด้วย SECRET ที่มีแค่ Backend รู้
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },  // [4] Payload
    process.env.JWT_SECRET ?? 'dev-secret',                   // [5] Secret key
    { expiresIn: '24h' }                                      // [6] หมดอายุใน 24 ชั่วโมง
  )

  // [7] ส่ง token + user กลับ (frontend เก็บไว้ใน localStorage)
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } } })
})
```

```ts [backend/src/middleware/auth.ts — Verify JWT ทุก request]
import jwt from 'jsonwebtoken'

interface TokenPayload { userId: number; email: string; role: string }

// [1] requireAuth — Middleware ตรวจสอบ JWT ก่อน route handler
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization  // [2] อ่าน header

  // [3] ต้องมี format "Bearer <token>"
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อน' })
  }

  const token = authHeader.split(' ')[1]              // [4] ตัด "Bearer " ออก
  const secret = process.env.JWT_SECRET ?? 'dev-secret'

  try {
    const payload = jwt.verify(token, secret) as TokenPayload  // [5] ตรวจ signature + exp
    req.user = payload  // [6] แนบ user info เข้า request object
    next()              // [7] ผ่าน → ไปยัง route handler ต่อ
  } catch {
    res.status(401).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' })  // [8]
  }
}
```

**สรุปการทำงาน:** Backend sign token ด้วย secret `[5]` → Frontend เก็บและส่งกลับทุก request → Backend ตรวจ signature `[5]` → ถ้าผ่าน อ่าน payload ได้เลย `[6]` (ไม่ต้อง query DB)

---

### ขั้นตอนที่ 3 — Frontend: ส่ง JWT ทุก Request

```ts [src/api/config.ts — Interceptors จัดการ JWT]
// [1] Request interceptor — แนบ token ทุก request อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')           // [2] อ่าน token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`   // [3] format มาตรฐาน
  }
  return config                                         // [4] ส่ง request ต่อ
})

// [5] Response interceptor — จัดการ 401 (token หมดอายุ)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {     // [6] token invalid/expired
      localStorage.removeItem('token')        // [7] ล้าง token เก่า
      window.location.href = '/login'         // [8] กลับไป login
    }
    return Promise.reject(error)              // [9] ส่ง error ต่อ
  }
)
```

| ขั้นตอน | Frontend | Backend |
| :--- | :--- | :--- |
| Login | เรียก `/api/auth/login` | ตรวจ DB → sign JWT `[3]` → ส่ง token |
| ทุก API call | แนบ `Authorization: Bearer <token>` `[3]` | verify signature `[5]` → อ่าน payload `[6]` |
| Token หมดอายุ | รับ 401 `[6]` → ล้าง token `[7]` → /login `[8]` | ตรวจ exp → throw → 401 `[8]` |

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"อธิบาย JWT ให้นักเรียนมัธยมเข้าใจ: มีกี่ส่วน, แต่ละส่วนคืออะไร, ทำไม Payload ถึงไม่ปลอดภัยเหมือน encrypted, และแสดง TypeScript interface สำหรับ JWT payload ที่มี userId, email, role, iat, exp — อธิบายว่า jwt.verify() ตรวจ signature ยังไงโดยไม่ต้อง query Database"
:::

### 📝 PjBL Lab

**เป้าหมาย:** ทำความเข้าใจ JWT structure และ flow จริงของโปรเจกต์

---

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสของตนเองใน Component หลักที่แก้ไขในสัปดาห์นี้

---

#### ขั้น 1 — Decode JWT ด้วย jwt.io

1. Login ด้วย `admin@school.ac.th / password123`
2. DevTools → Application → Local Storage → copy ค่า `token`
3. เปิด [jwt.io](https://jwt.io) → วาง token ใน Encoded box ซ้าย
4. ดู Decoded Payload ด้านขวา — ต้องเห็น `userId`, `email`, `role`, `iat`, `exp`
5. ทดสอบ decode ด้วย Console: `JSON.parse(atob(token.split('.')[1]))`

---

#### ขั้น 2 — ตรวจสอบ Backend Middleware

1. เปิด `project/backend/src/middleware/auth.ts`
2. อ่านและ trace flow ทุกบรรทัดพร้อม comment `[1]-[8]`
3. เปิด `project/backend/src/routes/equipments.ts` — ดูว่า `requireAuth` ถูกใช้ตรงไหน
4. ทดสอบ: แก้ token ใน localStorage ให้ผิด 1 ตัวอักษร → refresh → ควร redirect ไป /login ✅

---

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย screenshot jwt.io ที่เห็น Payload ชัดเจน
- [ ] ตอบในรายงาน: "JWT ต่างจาก Session ยังไง, ทำไม Backend ไม่ต้อง query DB"
- [ ] `git commit -m "wk7: understand JWT structure and auth middleware"`
- [ ] `git push origin main`
- [ ] เขียนสรุป Google Doc + ลิงก์ + screenshot jwt.io

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ JWT Payload ถูก encrypt ไหม — ทำไมถึงอ่านได้ด้วย jwt.io โดยไม่ต้อง secret?
**แนวคำตอบ:** Payload ถูก **Base64 encode เท่านั้น — ไม่ใช่ encryption** ใครก็ decode ได้ด้วย `atob()` หรือ jwt.io โดยไม่ต้อง secret key ดังนั้นไม่ควรใส่ข้อมูล sensitive เช่น password ใน payload
ที่ปลอดภัยคือ **Signature** — ถ้าแก้ payload แม้ 1 ตัวอักษร signature จะ invalid → `jwt.verify()` throw error → 401
:::

::: details ❓ `exp` ใน JWT คืออะไร และ Backend ตรวจสอบอย่างไร?
**แนวคำตอบ:** `exp` (expiration) เป็น Unix timestamp (จำนวนวินาทีนับตั้งแต่ 1 มกราคม 1970) บอกว่า token จะหมดอายุเมื่อไร `jwt.verify()` ตรวจ `exp` อัตโนมัติ: ถ้า `Math.floor(Date.now()/1000) > exp` → throw `TokenExpiredError` → Backend ตอบ 401 → Frontend interceptor จับ → redirect /login ผู้ใช้ต้อง login ใหม่เพื่อรับ token ใหม่
:::

::: details ❓ ทำไม JWT ดีกว่า Session-based auth (DB lookup ทุก request)?
**แนวคำตอบ:** Session-based: ทุก request ต้อง query DB (`SELECT * FROM sessions WHERE id = ?`) → ช้า, ต้องมี shared DB ถ้า scale หลาย server
JWT: ตรวจ signature ด้วย math (HMAC-SHA256) → ไม่ต้อง query DB → เร็วกว่ามาก → scale ได้ง่ายกว่า (stateless)
ข้อเสีย JWT: revoke ยาก ต้องรอ exp หมดอายุ (ถ้า token ถูกขโมย ยกเลิกได้ยาก)
:::

::: details ❓ `as TokenPayload` ใน `jwt.verify(token, secret) as TokenPayload` คืออะไร?
**แนวคำตอบ:** `jwt.verify()` return type คือ `string | JwtPayload` (กว้างเกิน) TypeScript ไม่รู้ว่า payload มี field `userId`, `email`, `role` หรือไม่
`as TokenPayload` คือ **Type Assertion** — บอก TypeScript ว่า "เชื่อฉัน — runtime payload มี structure นี้" ใช้ได้เมื่อเรามั่นใจว่า Backend sign payload แบบนั้นจริง ๆ — ถ้าเดา type ผิดจะเจอ runtime error แทน compile error
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| เข้าใจ JWT Structure | อธิบาย 3 ส่วน + decode Payload ได้ | รู้คร่าว ๆ แต่ decode ไม่ได้ | ไม่เข้าใจ |
| requireAuth middleware | trace flow ได้ + อธิบาย jwt.verify | รู้คร่าว ๆ | ไม่รู้ |
| เข้าใจ Token Expiry | อธิบาย exp + 401 interceptor flow | รู้ว่ามี exp แต่ไม่เข้าใจ flow | ไม่รู้ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `JWT` | JSON Web Token — มาตรฐาน token สำหรับ authentication แบบ stateless |
| `Payload` | ส่วนกลางของ JWT เก็บข้อมูล user (Base64 encoded — ไม่ใช่ encrypted) |
| `Signature` | ลายเซ็นดิจิทัลสร้างด้วย HMAC-SHA256 — พิสูจน์ว่า Backend ออกให้จริง |
| `iat` | Issued At — Unix timestamp ตอนสร้าง token |
| `exp` | Expiration — Unix timestamp ที่ token หมดอายุ |
| `Stateless` | ไม่เก็บ state บน Server — ข้อมูลทั้งหมดอยู่ใน token |
| `Type Assertion` | `as Type` — บอก TypeScript ว่า type คือนี้ (override type inference) |
| `Middleware` | ฟังก์ชันที่รันระหว่าง HTTP request ถึง route handler บน Server |
