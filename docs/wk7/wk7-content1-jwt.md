# JWT: JSON Web Token <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
Backend ต้องรู้ว่า "Request ที่เข้ามาเป็นของใคร มี role อะไร" โดยไม่ต้องถาม Database ทุกครั้ง — JWT แก้ปัญหานี้โดยเข้ารหัสข้อมูล user ลงใน token ที่ Backend ตรวจสอบได้ทันทีโดยไม่ต้อง query DB!
:::

> 💡 **เปรียบเทียบ:** JWT เหมือน "บัตรประชาชน" — ใครออกบัตรให้ (Backend sign) ใครมีบัตรก็พิสูจน์ตัวตนได้ (Frontend ส่ง token) ร้านค้าตรวจบัตรเองได้ (Backend verify) โดยไม่ต้องโทรถาม กรมพัฒนาฝีมือแรงงาน (Database) ทุกครั้ง

---

## 📖 I: Information

### โครงสร้าง JWT

JWT ประกอบด้วย 3 ส่วน คั่นด้วย `.`

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWRtaW5Ac2Nob29sLmFjLnRoIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE2MDAwODY0MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

[Header].[Payload].[Signature]
```

| ส่วน | เนื้อหา (decoded) | ความสำคัญ |
| :--- | :--- | :--- |
| Header | `{ "alg": "HS256", "typ": "JWT" }` | algorithm ที่ใช้ sign |
| Payload | `{ userId, email, role, iat, exp }` | ข้อมูล user (อ่านได้ทุกคน!) |
| Signature | `HMAC-SHA256(header+payload, secret)` | พิสูจน์ว่า Backend ออกให้จริง |

::: warning ⚠️ JWT Payload ไม่ใช่ Encrypted
Payload ถูก Base64 encode เท่านั้น — **ใครก็ถอดรหัสได้** ด้วย [jwt.io](https://jwt.io) ดังนั้นไม่ควรใส่ข้อมูล sensitive เช่น password, เลข ID บัตรประชาชน ลงใน JWT
:::

### Backend: สร้างและตรวจสอบ JWT

```ts [backend/src/middleware/auth.ts]
import jwt from 'jsonwebtoken'

interface TokenPayload {
  userId: number
  email: string
  role: string
}

// Middleware: ตรวจสอบ JWT ทุก request
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  // ต้องมี header รูปแบบ "Bearer <token>"
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'กรุณาเข้าสู่ระบบก่อน' })
    return
  }

  const token = authHeader.split(' ')[1]  // ตัด "Bearer " ออก
  const secret = process.env.JWT_SECRET ?? 'dev-secret'

  try {
    const payload = jwt.verify(token, secret) as TokenPayload
    req.user = payload  // แนบ user info เข้า request
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Token ไม่ถูกต้องหรือหมดอายุ' })
  }
}

// Middleware: ตรวจสอบ role
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'ไม่มีสิทธิ์ดำเนินการนี้' })
      return
    }
    next()
  }
}
```

### Frontend: ส่ง JWT ทุก Request

```ts [api/config.ts — request interceptor]
// Axios interceptor แนบ JWT อัตโนมัติ
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

::: tip 💡 TypeScript Tip — `as TokenPayload`
`jwt.verify()` return type คือ `string | JwtPayload` (กว้างมาก) การใช้ `as TokenPayload` บอก TypeScript ว่า "เชื่อฉันเถอะ — payload นี้มีรูปแบบนี้" เรียกว่า **Type Assertion** — ใช้ได้เมื่อเรามั่นใจใน runtime behavior มากกว่า TypeScript
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"อธิบายว่า JWT (JSON Web Token) ทำงานอย่างไรในเว็บแอปพลิเคชัน JWT มีกี่ส่วนและแต่ละส่วนคืออะไร ทำไม payload ถึงไม่เป็นความลับ และแสดง TypeScript interface สำหรับ JWT payload ที่มี userId, email และ role"
:::

### 📝 PjBL Lab

- [ ] เปิด [jwt.io](https://jwt.io) ใน Browser
- [ ] Login ระบบแล้ว copy token จาก localStorage
- [ ] วาง token ใน jwt.io — ดู Payload ที่ decode ออกมา
- [ ] ดู `project/backend/src/middleware/auth.ts` — อธิบาย flow ของ `requireAuth`
- [ ] ทดสอบ: แก้ token ใน localStorage ให้ผิด 1 ตัวอักษร → refresh → ควรถูก redirect

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ JWT ต่างจาก Session Cookie อย่างไร?
**แนวคำตอบ:** Session Cookie เก็บแค่ Session ID ใน DB — ทุก request Backend ต้อง query DB หา user ทำให้ช้า JWT เก็บข้อมูล user ไว้ใน token — Backend ตรวจ signature แล้วอ่านข้อมูลได้เลยโดยไม่ต้อง query DB แต่ JWT ยกเลิก (revoke) ยากกว่า
:::

::: details ❓ `exp` ใน JWT payload หมายถึงอะไร?
**แนวคำตอบ:** `exp` ย่อมาจาก expiration — เป็น Unix timestamp บอกว่า token หมดอายุเมื่อไร `jwt.verify()` จะ throw error อัตโนมัติถ้า token หมดอายุแล้ว ทำให้ต้องกำหนด expiry เสมอ เช่น `expiresIn: '24h'`
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| เข้าใจ JWT Structure | อธิบาย 3 ส่วน + decode ได้ | รู้ว่า JWT คืออะไรแต่ไม่ decode | ไม่เข้าใจ |
| requireAuth middleware | อธิบาย flow ได้ครบ | รู้คร่าว ๆ | ไม่รู้ |
| Type Assertion | อธิบาย `as TokenPayload` ได้ | ใช้ได้แต่ไม่เข้าใจ | ไม่รู้ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `JWT` | JSON Web Token — มาตรฐาน token สำหรับ authentication |
| `Payload` | ส่วนกลางของ JWT ที่เก็บข้อมูล user (Base64 encoded เท่านั้น) |
| `Signature` | ลายเซ็นดิจิทัล พิสูจน์ว่า token ออกจาก Backend จริง |
| `Middleware` | ฟังก์ชันที่รันระหว่าง request ถึง route handler บน Server |
| `Type Assertion` | `as Type` บอก TypeScript ว่า "เชื่อฉัน — type คือนี้" |
| `exp` | Expiration — เวลาหมดอายุของ JWT (Unix timestamp) |
