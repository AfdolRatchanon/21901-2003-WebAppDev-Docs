# Cookies กับการจัดเก็บ Session <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
หลัง login สำเร็จ — ถ้า Refresh หน้า ผู้ใช้จะต้อง login ใหม่ทุกครั้ง เพราะ state ใน React หายไปเมื่อ Browser โหลดหน้าใหม่ ต้องเลือกวิธีเก็บข้อมูล session ให้คงอยู่: **Cookies** หรือ **localStorage**?
:::

> 💡 **เปรียบเทียบ:** Cookies เหมือน "สมุดนัด" ที่ Browser พกไปส่งให้ Server ทุกครั้งที่ Request ส่วน localStorage เหมือน "กล่องเก็บของ" ในห้อง — ไม่ส่งอัตโนมัติ แต่ JavaScript ดึงมาใช้ได้เมื่อต้องการ

---

## 📖 I: Information

### เปรียบเทียบวิธีเก็บ Session

| | Cookies | localStorage | sessionStorage |
| :--- | :--- | :--- | :--- |
| อายุ | กำหนดได้ (`Expires`/`Max-Age`) | คงอยู่จนลบ | หายเมื่อปิด tab |
| ส่งอัตโนมัติ | ✅ ทุก HTTP request | ❌ ต้อง set header เอง | ❌ |
| ความจุ | ~4 KB | ~5 MB | ~5 MB |
| XSS Protection | `HttpOnly` ป้องกันได้ | ❌ JavaScript อ่านได้ | ❌ |
| CSRF Risk | ⚠️ ต้องป้องกัน | ✅ ไม่มีปัญหา | ✅ |

### โปรเจกต์ใช้ `localStorage` — ทำไม?

โปรเจกต์นี้เลือก `localStorage` เพราะ:
1. **ง่ายกว่า** — ไม่ต้องตั้งค่า CORS credentials, SameSite cookie บน Backend
2. **Vite proxy** — Frontend + Backend อยู่ domain เดียว (ผ่าน proxy) จึงไม่มี CORS issue
3. **สอน JWT concept** — เน้นให้นักเรียนเข้าใจ Authorization header มากกว่า Cookie

```ts [hooks/useAuth.ts — เก็บ token ใน localStorage]
async function login(email: string, password: string): Promise<boolean> {
  try {
    const { token: newToken, user: loggedInUser } = await loginApi(email, password)

    // บันทึกลง localStorage
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(loggedInUser))

    // ตั้ง Axios default header
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

    setToken(newToken)
    setUser(loggedInUser)
    return true
  } catch {
    return false
  }
}

function logout() {
  // ลบออกจาก localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete apiClient.defaults.headers.common['Authorization']
  setToken(null)
  setUser(null)
}
```

### Restore State เมื่อ Refresh

```ts [hooks/useAuth.ts — lazy initializer]
// useState lazy initializer — รันครั้งเดียวตอน mount
const [user, setUser] = useState<User | null>(() => {
  const stored = localStorage.getItem('user')
  try { return stored ? (JSON.parse(stored) as User) : null }
  catch { return null }  // ถ้า JSON เสีย → return null (ปลอดภัย)
})

const [token, setToken] = useState<string | null>(
  () => localStorage.getItem('token')
)
```

::: tip 💡 TypeScript Tip — Lazy Initializer
`useState(() => someExpensiveOp())` — การส่ง **function** ให้ useState แทน value ตรง ๆ เรียกว่า "lazy initializer" — React จะเรียกมันครั้งเดียวตอน component mount เท่านั้น เหมาะกับการอ่าน localStorage ที่ไม่อยาก re-run ทุก render
:::

### Cookie vs localStorage: เมื่อไรใช้อะไร

```
ระบบ Production จริง (Security สำคัญ):
✅ ใช้ HttpOnly Cookie เก็บ JWT
✅ Backend ส่ง Set-Cookie header
✅ ป้องกัน XSS (JavaScript อ่าน cookie ไม่ได้)
⚠️ ต้องจัดการ CSRF protection (SameSite=Strict/Lax)

ระบบการเรียนการสอน / Prototype:
✅ ใช้ localStorage เก็บ JWT
✅ Simple, explicit — นักเรียนเห็นได้ใน DevTools
✅ ไม่มี CORS/CSRF complexity
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"อธิบายความแตกต่างระหว่างการเก็บ JWT ใน cookies กับ localStorage ในแอป React ควรใช้วิธีไหนในสถานการณ์แบบใด และมี trade-off ด้านความปลอดภัยอย่างไร"
:::

### 📝 PjBL Lab

- [ ] เปิด DevTools → Application tab → Local Storage → localhost:5173
- [ ] Login แล้วดูว่ามี key `token` และ `user` ปรากฏขึ้น
- [ ] Refresh หน้า — ตรวจสอบว่า state คงอยู่ (ไม่ต้อง login ใหม่)
- [ ] กด Logout — ตรวจสอบว่า localStorage ถูกล้างออก
- [ ] ดู `useAuth.ts` — อธิบาย lazy initializer ให้เพื่อนฟัง
- [ ] เปิด Application tab → Cookies — ดูว่าโปรเจกต์นี้ใช้ cookie ไหม?

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `localStorage.getItem('user')` ต้อง `JSON.parse()`?
**แนวคำตอบ:** localStorage เก็บได้แค่ string — เมื่อ login เราใช้ `JSON.stringify(user)` แปลง object เป็น string ก่อนเก็บ ดังนั้นเมื่อจะอ่านกลับต้องใช้ `JSON.parse()` แปลง string กลับเป็น object ส่วน `try-catch` ป้องกันกรณี string เสียหาย (corrupt)
:::

::: details ❓ HttpOnly Cookie ดีกว่า localStorage ยังไง?
**แนวคำตอบ:** HttpOnly Cookie ไม่สามารถอ่านได้จาก JavaScript ทำให้ถ้ามี XSS attack (code แปลกปลอมรันใน browser) ก็ขโมย token ไม่ได้ ส่วน localStorage อ่านได้ด้วย `localStorage.getItem()` ใน console ทำให้ XSS อ่าน token ได้
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| localStorage ใช้ถูก | set/get/remove ครบ + parse | บางส่วนขาด | ไม่ได้เก็บ session |
| Restore on refresh | lazy initializer ถูกต้อง | restore ได้แต่ไม่ใช้ lazy | ต้อง login ใหม่ทุกครั้ง |
| เข้าใจ Cookie vs localStorage | อธิบายได้ครบพร้อม trade-off | อธิบายได้บางส่วน | ไม่เข้าใจ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Cookie` | ข้อมูลเล็กๆ ที่ Browser เก็บและส่งไปกับทุก Request |
| `localStorage` | Web Storage API เก็บข้อมูลใน Browser ข้าม session |
| `HttpOnly` | Cookie attribute ที่ป้องกัน JavaScript อ่าน cookie |
| `XSS` | Cross-Site Scripting — ช่องโหว่ที่ code แปลกปลอมรันใน browser |
| `CSRF` | Cross-Site Request Forgery — การโจมตีโดยใช้ cookie ที่ส่งอัตโนมัติ |
| `Lazy Initializer` | Function ที่ส่งให้ useState รันครั้งเดียวตอน mount |
