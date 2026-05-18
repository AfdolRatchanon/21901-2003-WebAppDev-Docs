# Cookies & localStorage — บันทึก/อ่าน/ลบข้อมูล Browser <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เรียนรู้ความแตกต่างระหว่าง localStorage, sessionStorage และ Cookie — เพื่อเลือกใช้ให้เหมาะกับการเก็บ JWT token ในโปรเจกต์ และเข้าใจวิธี restore auth state เมื่อ refresh หน้า ซึ่งเป็นพื้นฐานของ wk6-content2 (Axios Interceptor) และ wk6-lab (Login UI)

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
หลัง login สำเร็จ — ถ้า Refresh หน้า React state จะ reset เป็นค่าเริ่มต้นทั้งหมด ผู้ใช้ต้อง login ใหม่ทุกครั้งที่เปิด Browser ระบบเบิก-จ่ายอุปกรณ์ที่ใช้งานจริงต้องจำ session ไว้ได้ต้องเลือกวิธีเก็บข้อมูลให้คงอยู่: **localStorage** หรือ **Cookies**?
:::

> 💡 **เปรียบเทียบ:** localStorage เหมือน "โน้ตบุ๊กของตัวเอง" ที่วางไว้บนโต๊ะ — เปิดและเขียนได้เองเมื่อต้องการ ส่วน Cookie เหมือน "บัตรผ่าน" ที่ Browser พกไปส่งให้ Server อัตโนมัติทุกครั้งที่ออกนอกบ้าน

## 📖 I: Information

### ขั้นตอนที่ 1 — ทำไม React State ถึงหาย และทางแก้ (localStorage API)

ธรรมชาติของ React State (เช่น ค่าที่ได้จาก `useState`) ถูกจัดเก็บไว้ในหน่วยความจำชั่วคราว (RAM) ของคลับเบราว์เซอร์ ซึ่งหมายความว่าทันทีที่เรากดปุ่ม **Refresh** หน้าเว็บ หรือกดปิดแท็บ ข้อมูลเหล่านั้นจะถูกลบทิ้งและเริ่มต้นใหม่ทั้งหมด (Reset) เสมอ

ลักษณะนี้เป็นอุปสรรคใหญ่ต่อระบบการเข้าสู่ระบบ (Authentication) เพราะเราไม่ต้องการให้ผู้ใช้ตื่นมาล็อกอินใหม่ทุกครั้งที่โหลดเผลอรีเฟรชหน้า เราจึงจำเป็นต้องพึ่งพื้นที่จัดเก็บถาวรในฝั่งผู้ใช้ (Client-side Storage) ซึ่งมีทางเลือกยอดฮิตคือ **Cookies** หรือ **localStorage** โดยในเนื้อหานี้เราจะเจาะจงไปที่การใช้ localStorage API:

localStorage เป็น Web Storage API ที่ Browser ทุกตัวรองรับ — เก็บข้อมูลแบบ key-value (string เท่านั้น):

```ts [localStorage API — 4 คำสั่งหลัก]
// [1] setItem — บันทึก string
localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiJ9...')

// [2] getItem — อ่านกลับมา (คืน null ถ้าไม่มี key นั้น)
const token = localStorage.getItem('token')  // string | null

// [3] removeItem — ลบ key นั้น
localStorage.removeItem('token')

// [4] Object ต้อง JSON.stringify ก่อนเก็บ — localStorage เก็บ string เท่านั้น
const user = { id: 1, name: 'สมชาย', role: 'admin' }
localStorage.setItem('user', JSON.stringify(user))    // แปลง object → string

// [5] ต้อง JSON.parse เพื่ออ่านกลับเป็น object
const stored = localStorage.getItem('user')           // string | null
const parsed = stored ? JSON.parse(stored) : null     // object | null
```

**สรุป:** `setItem` → บันทึก, `getItem` → อ่าน, `removeItem` → ลบ, `JSON.stringify/parse` → แปลงระหว่าง object กับ string

::: code-group
```ts [✅ ใช้ try-catch กับ JSON.parse]
// JSON.parse โยน SyntaxError ถ้า string เสียหาย
// เช่น ผู้ใช้แก้ localStorage ด้วยมือใน DevTools
function getStoredUser(): User | null {
  const stored = localStorage.getItem('user')
  try {
    return stored ? (JSON.parse(stored) as User) : null  // [1] cast เป็น User type
  } catch {
    localStorage.removeItem('user')  // [2] ล้างข้อมูลที่เสียหาย
    return null
  }
}
```
```ts [❌ ไม่มี try-catch — แอปอาจ crash]
function getStoredUser() {
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
  // ❌ ถ้า stored เป็น "not-valid-json" → SyntaxError → แอป crash
  // ❌ ไม่มี type annotation → TypeScript ไม่รู้ว่า return อะไร
}
```
```ts [💡 ทดสอบด้วย DevTools]
// เปิด DevTools → Console แล้วลองพิมพ์:
localStorage.setItem('test', 'hello')
localStorage.getItem('test')          // → 'hello'
localStorage.removeItem('test')
localStorage.getItem('test')          // → null

// ดู Application tab → Local Storage → localhost:5173
// เห็น key-value ทั้งหมดที่เก็บอยู่
```
:::

### ขั้นตอนที่ 2 — เปรียบเทียบ 3 วิธีเก็บข้อมูล

| | **localStorage** | **sessionStorage** | **Cookie** |
| :--- | :--- | :--- | :--- |
| อายุข้อมูล | คงอยู่จนลบ | หายเมื่อปิด Tab | กำหนดด้วย `Expires`/`Max-Age` |
| ส่งไป Server อัตโนมัติ | ❌ ต้องส่งเอง (header) | ❌ | ✅ ทุก HTTP request |
| ความจุ | ~5 MB | ~5 MB | ~4 KB |
| ป้องกัน XSS | ❌ JavaScript อ่านได้ | ❌ | ✅ (`HttpOnly` flag) |
| ป้องกัน CSRF | ✅ | ✅ | ⚠️ ต้องตั้งค่า `SameSite` |
| ความง่ายในการใช้ | ⭐⭐⭐ ง่ายมาก | ⭐⭐⭐ ง่ายมาก | ⭐⭐ ต้องตั้งค่าหลายอย่าง |

**โปรเจกต์นี้เลือก `localStorage` เพราะ:**
1. **ง่ายกว่า** — ไม่ต้องตั้งค่า CORS credentials หรือ SameSite cookie บน Backend
2. **ครูตรวจได้ง่าย** — นักเรียนเห็น token ได้ตลอดใน DevTools Application tab
3. **เน้นสอน JWT concept** — ฝึกการส่ง `Authorization: Bearer <token>` ด้วยตนเอง

::: code-group
```ts [✅ โปรเจกต์นี้ — localStorage + Axios header]
// useAuth.ts: หลัง login สำเร็จ
localStorage.setItem('token', newToken)                          // [1] บันทึก token
localStorage.setItem('user', JSON.stringify(loggedInUser))      // [2] บันทึก user
apiClient.defaults.headers.common['Authorization'] =
  `Bearer ${newToken}`                                          // [3] ตั้ง Axios header
```
```ts [💡 Production จริง — HttpOnly Cookie (ปลอดภัยกว่า)]
// Backend ส่ง Set-Cookie header
// Set-Cookie: token=eyJhb...; HttpOnly; Secure; SameSite=Strict

// Frontend ไม่ต้องทำอะไร — Browser ส่ง cookie อัตโนมัติ
// ❌ JavaScript อ่าน cookie HttpOnly ไม่ได้ → ป้องกัน XSS
// ✅ เหมาะกับ production มากกว่า แต่ซับซ้อนกว่า
```
:::

### ขั้นตอนที่ 3 — Restore State เมื่อ Refresh

ปัญหาหลัก: React state หายเมื่อ refresh → แก้ด้วยการอ่าน localStorage ตอน component mount:

```ts [src/hooks/useAuth.ts — Lazy Initializer ป้องกัน state หาย]
export function useAuth(): AuthContextType {

  // [1] Lazy Initializer — ฟังก์ชัน () => {...} รันครั้งเดียวตอน mount
  //     อ่าน localStorage ก่อน render แรก → user ไม่หาย
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')       // [2] อ่าน JSON string
    try {
      return stored ? (JSON.parse(stored) as User) : null  // [3] parse → object
    } catch {
      return null                                       // [4] ป้องกัน JSON เสีย
    }
  })

  // [5] อ่าน token ตอน mount เช่นกัน
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('token')               // [6] string | null
  )

  // [7] logout: ลบออกทุกที่
  function logout() {
    localStorage.removeItem('token')                  // [8] ลบ localStorage
    localStorage.removeItem('user')
    delete apiClient.defaults.headers.common['Authorization']  // [9] ลบ Axios header
    setToken(null)
    setUser(null)
  }

  return { user, token, login, logout, isAuthenticated: token !== null }
}
```

**สรุปการทำงาน:** Lazy Initializer `[1]` อ่าน localStorage ก่อน render แรก → ถ้ามี token = ยังอยู่ในระบบ (ไม่ต้อง login ใหม่) → `logout()` ล้างทุกที่พร้อมกัน

| กรณี | ผลลัพธ์ |
| :--- | :--- |
| เปิดแอปครั้งแรก (ไม่มีข้อมูลใน localStorage) | `user = null`, `token = null` → แสดงหน้า Login |
| Login สำเร็จ → Refresh | อ่านจาก localStorage → ไม่ต้อง Login ใหม่ |
| Logout แล้ว Refresh | localStorage ว่าง → กลับไปหน้า Login |

#### 🔷 TypeScript ในบทนี้

- `JSON.parse(stored) as User` — type assertion บอก TypeScript ว่าข้อมูลที่ parse แล้วเป็น `User` type
- `useState<string | null>(() => localStorage.getItem('token'))` — Lazy Initializer + Generic type
- `getStoredUser(): User | null` — explicit return type บังคับให้ function ต้องคืนค่าที่ถูกต้อง

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ อธิบายความแตกต่างระหว่าง localStorage, sessionStorage, และ Cookies สำหรับเก็บ JWT token — ควรใช้วิธีไหน, ทำไม production ควรใช้ HttpOnly Cookie, และแสดงตัวอย่าง useState Lazy Initializer ที่อ่านข้อมูลจาก localStorage พร้อม try-catch"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่า localStorage, sessionStorage, Cookie ต่างกันอย่างไรในแง่อายุข้อมูลและความปลอดภัย
- [ ] รู้ว่าต้องใช้ `JSON.stringify` ก่อน setItem และ `JSON.parse` หลัง getItem เพราะ localStorage เก็บแค่ string
- [ ] เข้าใจว่า Lazy Initializer ป้องกัน state หายเมื่อ refresh ได้อย่างไร
:::

### 📝 PjBL Lab — ชิ้นงาน: `useAuth.ts` (localStorage section)

**เป้าหมาย:** ทำความเข้าใจว่าโปรเจกต์เก็บ session อย่างไร + ทดสอบพฤติกรรม refresh

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสของตนเองใน Component หลักที่แก้ไขในสัปดาห์นี้

#### ขั้น 1 — ทดสอบ localStorage ด้วย DevTools Console

1. เปิดโปรเจกต์ด้วย `npm run dev`
2. เปิด DevTools → Console → ลองพิมพ์:

```ts
// ทดสอบ localStorage API
localStorage.setItem('testKey', 'สวัสดี React')
localStorage.getItem('testKey')          // → 'สวัสดี React'

// ทดสอบกับ Object
const obj = { name: 'ทดสอบ', role: 'student' }
localStorage.setItem('testObj', JSON.stringify(obj))
JSON.parse(localStorage.getItem('testObj') || '')   // → { name: 'ทดสอบ', role: 'student' }

localStorage.removeItem('testKey')
localStorage.removeItem('testObj')
```

3. ดู DevTools → Application → Local Storage → `localhost:5173`

#### ขั้น 2 — ตรวจสอบ Auth Flow จริงของโปรเจกต์

1. Login ด้วย `admin@school.ac.th / password123`
2. DevTools → Application → Local Storage → ตรวจว่ามี key `token` และ `user`
3. **กด Refresh** → ยังอยู่ในหน้าหลัก ไม่ต้อง Login ใหม่ ✅
4. กด Logout → ตรวจว่า localStorage ถูกล้าง + redirect ไป /login ✅

#### ขั้น 3 — ทดสอบ Edge Cases

1. Login แล้วเปิด DevTools → แก้ค่า `token` ใน localStorage ให้ผิด → Refresh → แอปต้องจัดการได้ (ไม่ crash)
2. ลองลบ key `user` ออกจาก localStorage ด้วยมือ → Refresh → แอปต้องไม่ crash (lazy initializer ใช้ try-catch)

#### ขั้น Submit — ส่งงาน

- [ ] ตอบคำถาม: "localStorage กับ Cookie ต่างกันอย่างไร" ใน Google Doc
- [ ] บันทึก screenshot DevTools Application tab ที่เห็น `token` และ `user`
- [ ] `git add . && git commit -m "wk6: understand localStorage vs cookies auth session"`
- [ ] `git push origin main`
- [ ] เขียนสรุป 3-5 บรรทัดใน Google Doc พร้อม screenshot + ลิงก์ GitHub

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `localStorage.getItem('user')` ต้อง `JSON.parse()` ก่อนใช้?
**แนวคำตอบ:** localStorage รับและคืนค่าเป็น string เท่านั้น — เมื่อ login เราใช้ `JSON.stringify(user)` แปลง object เป็น string ก่อนเก็บ ดังนั้นเมื่ออ่านกลับต้องแปลงคืนด้วย `JSON.parse()` ถ้าไม่ parse ค่าที่ได้จะเป็น string เช่น `"{"id":1,"name":"สมชาย"}"` ไม่ใช่ object ที่เข้าถึง `.id` ได้
:::

::: details ❓ Lazy Initializer ใน `useState(() => {...})` ต่างจาก `useState(getValue())` อย่างไร?
**แนวคำตอบ:** `useState(getValue())` — `getValue()` ถูกเรียกทุกครั้งที่ Component re-render (แต่ผลลัพธ์ไม่ถูกใช้หลัง mount แรก — เปลือง)
`useState(() => getValue())` — ฟังก์ชันถูกเรียกครั้งเดียวตอน mount เท่านั้น เหมาะกับ operation ที่แพง เช่น localStorage read หรือ JSON.parse ที่ไม่อยาก run ซ้ำทุก render
:::

::: details ❓ ทำไม `logout()` ต้องลบทั้ง localStorage และ `apiClient.defaults.headers`?
**แนวคำตอบ:** ทั้งสองที่เก็บ token ไว้คนละที่:
- `localStorage` — เก็บถาวร ถ้าไม่ลบ refresh แล้วก็ยังมี token เก่า
- `apiClient.defaults.headers.common['Authorization']` — เก็บไว้ใน Axios instance ที่กำลัง run อยู่ ถ้าไม่ล้าง request ที่ส่งหลัง logout ยังจะแนบ token เก่าไปด้วย
ต้องล้างทั้งสองที่ถึงจะ logout สมบูรณ์
:::

::: details ❓ `HttpOnly Cookie` ปลอดภัยกว่า localStorage ยังไง — แล้วทำไมโปรเจกต์นี้ยังใช้ localStorage?
**แนวคำตอบ:** HttpOnly Cookie — JavaScript อ่านค่าไม่ได้ (Browser บล็อก) ทำให้ถ้ามี XSS attack ผู้โจมตีขโมย token ไม่ได้ ส่วน localStorage อ่านได้ด้วย `localStorage.getItem()` ทำให้ XSS อ่าน token ได้
โปรเจกต์ใช้ localStorage เพราะ: (1) เน้นการสอน JWT + Authorization header (2) ง่ายกว่า ไม่ต้องตั้งค่า Backend cookie (3) เหมาะกับ prototype และการเรียน — production จริงควรใช้ HttpOnly Cookie
:::

### 🐛 Common Errors

| Error | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `SyntaxError: Unexpected token` จาก `JSON.parse` | ค่าใน localStorage ไม่ใช่ JSON ที่ถูกต้อง | ใช้ `try-catch` ครอบ `JSON.parse` และ `removeItem` เมื่อ error |
| `localStorage.getItem()` คืน `null` แต่โค้ดไม่ตรวจ | ลืมเพิ่ม null check ก่อน `JSON.parse` | เพิ่ม `stored ? JSON.parse(stored) : null` ก่อนใช้ค่า |
| Refresh แล้ว state หาย ทั้งที่มีข้อมูลใน localStorage | ไม่ได้ใช้ Lazy Initializer — ใส่ค่าตรงใน `useState` | เปลี่ยนเป็น `useState(() => localStorage.getItem('token'))` |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| localStorage API | ใช้ set/get/remove + JSON ครบ | ใช้ได้บางส่วน | ไม่เข้าใจ API |
| Restore on refresh | lazy initializer + try-catch ถูกต้อง | restore ได้ แต่ไม่มี try-catch | ต้อง login ใหม่ทุกครั้ง |
| เข้าใจ Cookie vs localStorage | อธิบายได้พร้อม trade-off | อธิบายได้บางส่วน | ไม่เข้าใจ |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `localStorage` | โล-คัล สตอ-ร์เรจ | Web Storage API เก็บข้อมูลใน Browser ข้าม session (คงอยู่จนลบ) |
| `sessionStorage` | เซ็ส-ชัน สตอ-ร์เรจ | Web Storage API เก็บชั่วคราว หายเมื่อปิด Tab |
| `Cookie` | คุก-กี้ | ข้อมูลเล็กๆ ที่ Browser เก็บและส่งไปกับทุก HTTP Request อัตโนมัติ |
| `Session` | เซ็ส-ชัน | ช่วงเวลาที่ผู้ใช้ใช้งานแอปตั้งแต่ login จนถึง logout |
| `HttpOnly` | เอช-ที-ที-พี โอน-ลี่ | Cookie flag ที่ป้องกัน JavaScript อ่าน cookie — ป้องกัน XSS |
| `XSS` | เอ็กซ์-เอส-เอส | Cross-Site Scripting — ช่องโหว่ที่ code แปลกปลอมรันใน browser ผู้ใช้ |
| `JWT` | เจ-ดับ-บลิว-ที | JSON Web Token — token มาตรฐานสำหรับ authentication |
| `JSON.stringify` | เจ-สัน สตริง-กิ-ไฟ | แปลง JavaScript object → JSON string (เพื่อเก็บใน localStorage) |
| `JSON.parse` | เจ-สัน พาร์ส | แปลง JSON string → JavaScript object (เพื่ออ่านจาก localStorage) |
