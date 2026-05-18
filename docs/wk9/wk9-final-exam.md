# Final Exam: ทบทวนและประเมินผล <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เตรียมสอบปลายภาค — ทบทวน 9 module ที่เรียนมา, ฝึกอ่าน code จริงและอธิบาย comment, เขียน component ใหม่ด้วย TypeScript, และประเมินตัวเองว่าพร้อมเป็น Junior Frontend Developer แค่ไหน

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
หลังจาก 9 สัปดาห์สร้างระบบเบิก-จ่ายอุปกรณ์ไอที — Final Exam นี้ไม่ใช่แค่ทดสอบว่าจำอะไรได้ แต่ทดสอบว่า "เข้าใจ" และ "นำไปประยุกต์ใช้กับโปรเจกต์ใหม่ได้" ไหม อ่าน code ที่ไม่เคยเห็นมาก่อนแล้วตอบได้ไหม?
:::

> 💡 **เป้าหมาย:** ไม่ใช่แค่ผ่าน exam — แต่มี **ทักษะ** ที่ใช้ได้จริงในอุตสาหกรรม Frontend Development

## 📖 I: Information

### ขั้นตอนที่ 1 — ประมวลผลและสรุป 9 Module ที่เรียนมา

การสอบ Final Exam ไม่ใช่การวัดความจำว่าเราท่องโค้ดได้แม่นยำแค่ไหน แต่เป็นการวัด "ความเข้าใจ" และ "ไหวพริบ" ในการแก้ปัญหา (Problem Solving) หรือความสามารถในการอ่านโค้ดคนอื่นแล้วตรวจสอบได้ว่ามันทำงานอย่างไร (Code Reading) ซึ่งเป็นทักษะที่ใช้จริงในการทำงานเป็นทีมในระดับอุตสาหกรรม

ตลอดเวลา 9 สัปดาห์ที่ผ่านมา เราได้เดินทางตั้งแต่การตั้งค่าโปรเจกต์เปล่า ๆ จนกลายเป็นโครงสร้างแอปพลิเคชันที่มีระบบครบวงจร ลองมาทบทวนกันว่าเราได้เก็บเกี่ยวอาวุธชิ้นไหนไปบ้าง:

| Module | หัวข้อหลัก | TypeScript Level | ทักษะที่ได้ |
| :--- | :--- | :--- | :--- |
| wk1 | React + Vite + TypeScript Setup | Basic Types, JSX | สร้างโปรเจกต์ใหม่ได้ด้วยตัวเอง |
| wk2 | Custom Hooks + Interfaces + State | Interfaces, Union | แยก logic ออกจาก UI ได้ |
| wk3 | Tailwind CSS + Controlled Forms | FormEvent, Zod | สร้าง UI + Validation ได้เร็ว |
| wk4 | Axios + Async/Await + DB Design | Generics, Promise | เชื่อม API จริงพร้อม types ได้ |
| wk5 | Props Drilling + Context API | Props Types | จัดการ state ข้าม component |
| wk6 | Auth: localStorage + Axios Interceptor | Type Assertion | Auth system ครบวงจร |
| wk7 | JWT + React Router + Socket.io Realtime | Advanced Types | Secure app + Real-time |
| wk8 | Test Plan + Production Build | Utility Types | Go-live production ได้ |
| wk9 | Project Defense + Final Exam | - | นำเสนอ + สรุปความรู้ทั้งหมด |

### ขั้นตอนที่ 2 — ประเภทคำถาม Final Exam

#### ส่วนที่ 1: Code Reading (30 คะแนน)

อ่าน code แล้วตอบคำถาม — วิเคราะห์ว่าทำงานอย่างไรและมีปัญหาอะไร:

```tsx
// [1] Custom Hook ที่อ่านในข้อสอบ — ดูทุก [comment]
export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])   // [2] Generic
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)          // [3] nullable

  // [4] useCallback ป้องกัน function reference เปลี่ยนทุก render
  const fetchEquipments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getEquipments()    // [5] await async function
      setEquipments(data)
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้')   // [6] error state
    } finally {
      setIsLoading(false)                   // [7] รันเสมอ — ทั้ง success และ error
    }
  }, [])  // [8] dependency ว่าง = สร้างครั้งเดียว

  useEffect(() => {
    fetchEquipments()   // [9] เรียกตอน mount
  }, [fetchEquipments]) // [10] dependency คือ fetchEquipments

  return { equipments, setEquipments, isLoading, error, refetch: fetchEquipments }
}
```

> **ตัวอย่างคำถาม Code Reading:**
> - `[4]` `useCallback` มีไว้ทำอะไร? ถ้าลบออกจะเกิดอะไรขึ้น?
> - `[7]` `finally` ต่างจากการวาง `setIsLoading(false)` หลัง try-catch อย่างไร?
> - `[3]` ทำไม error เป็น `string | null` ไม่ใช่ `string?` (optional)?
> - `refetch: fetchEquipments` ใช้ที่ไหนในโปรเจกต์และทำไม?

### ขั้นตอนที่ 2 — ส่วนที่ 2: Code Writing (40 คะแนน)

เขียน code ตาม spec ที่กำหนด — ต้องถูกต้องทั้ง TypeScript และ logic:

```
ตัวอย่างโจทย์ 1:
"สร้าง function updateEquipmentStatus(id: number, status: EquipmentStatus, borrowedBy: string | null)
ที่ใช้ Axios ส่ง PATCH request ไปที่ /api/equipments/:id
return Promise<Equipment> — ใส่ TypeScript type ที่ถูกต้องครบถ้วน"

ตัวอย่างโจทย์ 2:
"สร้าง ProtectedRoute component ที่:
1) redirect ไป /login ถ้า isAuthenticated = false
2) redirect ไป /forbidden ถ้า requiredRole ระบุและ user.role ไม่ตรง
3) ใช้ Navigate จาก react-router-dom พร้อม replace prop"

ตัวอย่างโจทย์ 3:
"สร้าง interface BorrowRecord ที่มี: id (number), equipmentId (number),
borrowedBy (string), purpose (string), borrowDate (string), returnDate (string | null)"
```

### ขั้นตอนที่ 3 — ส่วนที่ 3: Conceptual (30 คะแนน)

ตอบคำถามเชิงแนวคิด — อธิบายได้ในภาษาธรรมชาติ:

```
ตัวอย่างคำถาม:
□ อธิบาย JWT 3 ส่วน (Header.Payload.Signature) ให้คนที่ไม่รู้ Tech เข้าใจ
□ เมื่อไรควรใช้ useCallback? ถ้าไม่ใช้จะเกิดอะไรขึ้น?
□ Props Drilling คืออะไร? เมื่อไรควรเปลี่ยนไปใช้ Context API?
□ Axios interceptor ทำงานอย่างไร? ทำไมถึงสะดวกกว่าการแนบ token ในทุก request?
□ ทำไม cleanup function ใน useEffect ถึงสำคัญกับ Socket.io?
```

### ขั้นตอนที่ 4 — Self-Assessment Checklist

ตรวจสอบตัวเองว่าทำได้แค่ไหน:

```markdown
## ทักษะ Frontend (React + TypeScript)
□ สร้างโปรเจกต์ React + TypeScript + Vite ได้ด้วยตัวเอง (ไม่ดู tutorial)
□ เขียน TypeScript Interface และ Generic Types ได้
□ สร้าง Custom Hook ที่มี loading/error state ได้
□ เชื่อมต่อ API ด้วย Axios พร้อม request/response interceptors ได้
□ สร้าง Auth system (login → localStorage → restore on refresh → logout) ได้
□ ใช้ React Router v6 กับ Protected Routes + Navigate ได้
□ ใช้ Socket.io สำหรับ real-time + cleanup on unmount ได้
□ `npm run build` → 0 errors → `npm run preview` ได้

## ทักษะ Developer (Soft Skills)
□ อ่าน TypeScript error message แล้วแก้ได้เองโดยไม่ต้องถาม
□ ใช้ DevTools ได้คล่อง: Network (headers, payload), Application (localStorage), Console
□ อธิบาย code ของตัวเองให้คนอื่นเข้าใจได้ใน 5 นาที
□ ถาม AI ได้ถูกวิธี + critical think ผลลัพธ์ก่อนนำไปใช้
□ git workflow: add → commit → push ทุก feature พร้อม meaningful commit message
```

**ระดับความพร้อม:**
- ✅ ≥ 12/13 ข้อ → พร้อมทำงาน Junior Frontend Developer
- ✅ 9-11 ข้อ → เข้าใจ concept ทั้งหมด ต้องฝึก implementation เพิ่ม
- ✅ < 9 ข้อ → ทบทวน wk ที่ยังไม่แน่ใจ

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"เรียนคอร์สพัฒนาเว็บด้วย React + TypeScript + Node.js จบแล้ว ช่วยสร้าง self-assessment checklist ที่ครอบคลุม: TypeScript types, React hooks (useState/useEffect/useCallback/useContext), Axios interceptors, authentication flow, real-time WebSocket และ production build — พร้อมแนะนำโปรเจกต์ 3 อย่างสำหรับฝึกทักษะเหล่านี้ต่อในระดับ Junior Developer"
:::

### 📝 Final Lab — ชิ้นงาน: `src/pages/BorrowHistoryPage.tsx`

**เป้าหมาย:** ทดสอบว่าอ่าน code จริงได้และเขียน component ใหม่ได้

#### ขั้น 0 — Student Identity

ตรวจสอบว่า `<footer>` ชื่อ-รหัสยังอยู่ใน Component หลัก ✅
GitHub repository มี commit ครบทุก wk1-8 ✅

#### ขั้น 1 — Code Reading Quiz (15 นาที)

อ่าน source code จริงแล้วตอบคำถามเหล่านี้ด้วยตัวเอง (ไม่ดูเฉลย):

- [ ] เปิด `src/hooks/useAuth.ts` — อธิบาย Lazy Initializer ใน `useState(() => {...})` ได้
- [ ] เปิด `src/api/config.ts` — อธิบาย request interceptor และ response interceptor แต่ละขั้นตอนได้
- [ ] เปิด `src/components/ProtectedRoute.tsx` — trace logic: redirect เมื่อไหร่ บน path ไหน

#### ขั้น 2 — Mini Project (60 นาที)

สร้าง React component ใหม่ที่ยังไม่มีใน codebase:

```
โจทย์: สร้าง BorrowHistory component
- แสดงประวัติการยืมอุปกรณ์ (ถ้ามี API endpoint)
- ถ้าไม่มี API: ใช้ mock data array ที่มี BorrowRecord interface ถูกต้อง
- ต้องมี: TypeScript type, loading state, error state, empty state
- Optional: กรองตามวันที่หรือ equipment category
```

- [ ] สร้าง `src/types/index.ts` เพิ่ม `interface BorrowRecord` ✅
- [ ] สร้าง `src/hooks/useBorrowHistory.ts` — Custom Hook ✅
- [ ] สร้าง `src/pages/BorrowHistoryPage.tsx` ✅
- [ ] เพิ่ม route ใน App.tsx ✅

#### ขั้น Submit — ส่งงาน

- [ ] ตอบ Self-Assessment Checklist ด้านบน — บันทึกใน Google Doc
- [ ] `git add . && git commit -m "wk9: final exam - borrow history component"`
- [ ] `git push origin main`
- [ ] เขียนสรุปใน Google Doc:
  - Self-Assessment ผ่านกี่ข้อ
  - ทักษะที่แข็งแกร่งที่สุดใน wk1-8 คืออะไร
  - อยากพัฒนาเรื่องอะไรต่อไป
  - ลิงก์ GitHub + screenshots ทุก feature

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ `useCallback` กับ `useEffect` dependency — เชื่อมกันอย่างไร?
**แนวคำตอบ:** `useEffect` รัน effect ใหม่ทุกครั้งที่ dependency เปลี่ยน ถ้าใส่ function ใน dependency array และ function นั้นสร้างใหม่ทุก render → useEffect รัน loop ไม่หยุด `useCallback` จดจำ function reference ไว้ตลอด (จนกว่า dependency ของ useCallback เปลี่ยน) → useEffect เห็น reference เดิม → ไม่รัน loop สรุป: ทุก function ที่ใส่ใน useEffect dependency ควร wrap ด้วย useCallback
:::

::: details ❓ `finally` ใน try-catch-finally ต่างจากการวาง code หลัง try-catch อย่างไร?
**แนวคำตอบ:** `finally` รัน **เสมอ** ไม่ว่า try จะ throw error หรือไม่ รวมถึงกรณีที่มี `return` ใน try ด้วย ส่วนการวาง code หลัง try-catch ถ้า catch rethrow error → code ที่วางหลังนั้นจะไม่รัน ในกรณี `setIsLoading(false)` ใน finally → มั่นใจว่า loading state จะ false เสมอ ไม่ว่า fetch สำเร็จหรือไม่ ป้องกัน "ค้างที่ loading" ตลอดกาล
:::

::: details ❓ `Props Drilling` คืออะไร และเมื่อไรควรเปลี่ยนไปใช้ Context API?
**แนวคำตอบ:** Props Drilling = ส่ง props ผ่าน component หลายชั้นโดยที่ชั้นกลางไม่ได้ใช้เอง เช่น `App → Layout → Page → Card → Button` ส่ง `auth` ผ่านทุกชั้น — ปัญหา: ถ้าเปลี่ยน interface ต้องแก้ทุกชั้น ควรเปลี่ยนเป็น Context API เมื่อ: 1) tree ลึก ≥ 3 ชั้น 2) ข้อมูลใช้ใน component หลายจุดที่กระจัดกระจาย 3) ข้อมูลเปลี่ยนบ่อยและต้อง re-render เฉพาะที่ใช้
:::

::: details ❓ หลังเรียน wk1-9 จบ — ขั้นต่อไปในการพัฒนาทักษะ Frontend Developer คืออะไร?
**แนวคำตอบ:** ขั้นต่อไปที่แนะนำ: 1) **Testing** — เรียน Jest + React Testing Library (unit/integration test) 2) **State Management** — Zustand หรือ Redux Toolkit สำหรับ app ขนาดใหญ่ 3) **Next.js** — React framework พร้อม Server-Side Rendering (SSR) 4) **CI/CD** — GitHub Actions deploy อัตโนมัติ 5) **โปรเจกต์ส่วนตัว** — สร้างสิ่งที่แก้ปัญหาจริงในชีวิต แล้วใส่ GitHub Portfolio ที่สำคัญ: การเรียนรู้ต่อเนื่องสำคัญกว่าการรู้ทุก technology
:::

### 📋 Final Exam Rubric (100 คะแนน)

| ส่วน | น้ำหนัก | เกณฑ์ |
| :--- | :--- | :--- |
| Code Reading | 30 คะแนน | อ่าน code + อธิบาย [comment] + ตอบคำถามถูกต้อง |
| Code Writing | 40 คะแนน | เขียน TypeScript + logic ถูกต้อง ทำงานได้จริง |
| Conceptual | 30 คะแนน | อธิบาย concept ด้วยภาษาธรรมชาติ + ยกตัวอย่างได้ |

### เกณฑ์ผ่าน TPQI 10302

| ระดับ | คะแนน | ความหมาย |
| :--- | :--- | :--- |
| ดีเยี่ยม | 90-100 | พร้อมทำงาน Junior Frontend Developer |
| ดี | 80-89 | เข้าใจ concept ทั้งหมด ทำงานได้โดยมี mentor |
| ผ่าน | 60-79 | เข้าใจพื้นฐาน ต้องฝึก implementation เพิ่ม |
| ไม่ผ่าน | < 60 | ต้องทบทวนและทดสอบใหม่ |

### 📚 CLIL Vocabulary — สรุปคำศัพท์สำคัญทั้งหมด

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Component` | คอม-โพ-เนนท์ | ส่วนประกอบย่อยของ UI ที่ใช้ซ้ำได้ รับ props และ render JSX |
| `Hook` | ฮุค | React function พิเศษที่เริ่มด้วย `use` — จัดการ state/lifecycle |
| `TypeScript` | ไทพ์-สคริปท์ | JavaScript ที่มี Type system ช่วยป้องกัน bug ก่อน runtime |
| `REST API` | เรสท์ เอ-พี-ไอ | มาตรฐาน API โดยใช้ HTTP methods (GET/POST/PATCH/DELETE) |
| `JWT` | เจ-ดับ-บลิว-ที | JSON Web Token — token 3 ส่วน Header.Payload.Signature |
| `WebSocket` | เว็บ-ซ็อค-เก็ต | Protocol สำหรับสื่อสารสองทิศทาง real-time แบบ persistent |
| `Interceptor` | อิน-เตอร์-เซ็ป-เตอร์ | Middleware ของ Axios — รันก่อน/หลังทุก request/response |
| `Context API` | คอน-เท็กซ์ เอ-พี-ไอ | React built-in สำหรับแชร์ state โดยไม่ต้อง Props Drilling |
| `Deploy` | ดี-พลอย | นำระบบขึ้น server ให้ผู้ใช้จริงเข้าถึงได้ |
| `Defense` | ดี-เฟนส์ | การนำเสนอและพิสูจน์ผลงานต่อกรรมการ |
| `TPQI 10302` | ที-พี-คิว-ไอ | มาตรฐานอาชีพไอที ระดับ 3 — Developer พัฒนา Web Application |
