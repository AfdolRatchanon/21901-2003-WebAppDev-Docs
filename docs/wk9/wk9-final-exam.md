# Final Exam: ทบทวนและประเมินผล <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
หลังจาก 18 สัปดาห์สร้างระบบเบิก-จ่ายอุปกรณ์ไอที — Final Exam นี้ไม่ใช่แค่ทดสอบว่าจำอะไรได้ แต่ทดสอบว่า "เข้าใจ" และ "นำไปประยุกต์ใช้กับโปรเจกต์ใหม่ได้" ไหม
:::

> 💡 **เป้าหมาย:** ไม่ใช่แค่ผ่าน exam — แต่มี **ทักษะ** ที่ใช้ได้จริงในอุตสาหกรรม

---

## 📖 I: Information

### สรุป 9 Module ที่เรียนมา

| Module | หัวข้อหลัก | TypeScript Level | ทักษะที่ได้ |
| :--- | :--- | :--- | :--- |
| wk1 | React + Vite + TypeScript | Basic Types | สร้างโปรเจกต์ใหม่ได้ |
| wk2 | Custom Hooks + Interfaces | Interfaces | แยก logic ออกจาก UI |
| wk3 | Tailwind CSS + Form Validation | Union Types + FormEvent | สร้าง UI สวยงามได้เร็ว |
| wk4 | Axios + Async/Await + DB Design | Generics + Promise | เชื่อม API จริงได้ |
| wk5 | State Management + Context | Props Types | จัดการ state ข้าม component |
| wk6 | Cookies + Session + Interceptor | Type Assertion | Auth system ครบวงจร |
| wk7 | JWT + Routes + Real-time | Advanced Types | Secure app + Real-time |
| wk8 | Test Plan + Deploy | Utility Types | Go-live ได้ |
| wk9 | Project Defense | - | นำเสนอผลงานได้ |

### ประเภทคำถาม Final Exam

#### ส่วนที่ 1: Code Reading (30%)
อ่านโค้ดแล้วตอบคำถาม

```tsx
// คำถาม: โค้ดนี้ทำงานอย่างไร? มีปัญหาอะไรบ้าง?
export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipments = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getEquipments()
      setEquipments(data)
    } catch {
      setError('ไม่สามารถโหลดข้อมูลได้')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEquipments()
  }, [fetchEquipments])

  return { equipments, setEquipments, isLoading, error, refetch: fetchEquipments }
}
```

> **ตัวอย่างคำถาม:**
> - `useCallback` มีไว้ทำอะไร?
> - ถ้าลบ `finally` ออก จะเกิดอะไรขึ้น?
> - `refetch: fetchEquipments` ใช้ที่ไหนและทำไม?

#### ส่วนที่ 2: Code Writing (40%)
เขียนโค้ดตาม spec ที่กำหนด

```
ตัวอย่างโจทย์:
"สร้าง function `updateEquipmentStatus(id, status, borrowedBy?)`
ที่ใช้ Axios ส่ง PATCH request ไปที่ /api/equipments/:id
พร้อม TypeScript type ที่ถูกต้อง"
```

#### ส่วนที่ 3: Conceptual (30%)
ตอบคำถามเชิงแนวคิด

> **ตัวอย่างคำถาม:**
> - อธิบาย JWT ในภาษาที่คนที่ไม่รู้ Tech เข้าใจได้
> - เมื่อไรควรใช้ `useCallback`?
> - `Props Drilling` คืออะไรและแก้อย่างไร?

### Self-Assessment Checklist

```markdown
## ทักษะที่ควรมีหลังจบ wk9

### Frontend (React + TypeScript)
□ สร้างโปรเจกต์ React + TypeScript + Vite ได้ด้วยตัวเอง
□ เขียน TypeScript Interface และ Generic Types ได้
□ สร้าง Custom Hook ที่มี loading/error state ได้
□ เชื่อมต่อ API ด้วย Axios พร้อม interceptors ได้
□ สร้าง Auth system (login/logout/persist) ได้
□ ใช้ React Router v6 กับ Protected Routes ได้
□ ใช้ Socket.io สำหรับ real-time ได้
□ Build และ deploy frontend ได้

### Soft Skills
□ อ่าน error message แล้วแก้ได้เองโดยไม่ต้องถาม
□ ใช้ DevTools (Network, Console, Application) ได้คล่อง
□ อธิบายโค้ดของตัวเองให้คนอื่นเข้าใจได้
□ ถาม AI ได้ถูกวิธีและ critical think ผลลัพธ์ได้
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"เรียนคอร์สพัฒนาเว็บด้วย React + TypeScript + Node.js จบแล้ว ช่วยสร้าง self-assessment checklist ที่ครอบคลุม: การออกแบบ component, การใช้ TypeScript, การเชื่อมต่อ API, authentication, real-time features และการ deploy พร้อมแนะนำโปรเจกต์ 3 อย่างสำหรับฝึกทักษะเหล่านี้ต่อ"
:::

### 📝 Final Lab — ทบทวนความรู้

**ส่วนที่ 1: Code Quiz (15 นาที)**
- [ ] อ่าน `src/hooks/useAuth.ts` ทุกบรรทัด — อธิบายให้เพื่อนฟังได้
- [ ] อ่าน `src/api/config.ts` — อธิบาย interceptors ทั้ง 2 ตัว
- [ ] อ่าน `src/components/ProtectedRoute.tsx` — trace logic redirect

**ส่วนที่ 2: Mini Project (60 นาที)**
- [ ] สร้าง React component ใหม่ที่ไม่มีใน codebase — เช่น "BorrowHistory" ที่แสดงประวัติการยืม
- [ ] ใช้ TypeScript type ที่เหมาะสม
- [ ] เชื่อมกับ API (ถ้ามี endpoint)

---

## ✅ P: Progress

### 📋 Final Exam Rubric (100 คะแนน)

| ส่วน | น้ำหนัก | เกณฑ์ |
| :--- | :--- | :--- |
| Code Reading | 30 คะแนน | อ่าน code + ตอบคำถามถูก |
| Code Writing | 40 คะแนน | เขียน code ถูก TypeScript + logic |
| Conceptual | 30 คะแนน | อธิบาย concept ได้ |

### เกณฑ์ผ่าน TPQI 10302

| ระดับ | คะแนน | ความหมาย |
| :--- | :--- | :--- |
| ดีเยี่ยม | 90-100 | พร้อมทำงาน Junior Frontend Developer |
| ดี | 80-89 | เข้าใจ concept ทั้งหมด ทำงานได้โดยมี mentor |
| ผ่าน | 60-79 | เข้าใจพื้นฐาน ต้องฝึกเพิ่ม |
| ไม่ผ่าน | < 60 | ต้องทบทวนและทดสอบใหม่ |

---

### 📚 CLIL Vocabulary — รวมคำศัพท์สำคัญทั้งหมด

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Component` | ส่วนประกอบย่อยของ UI ที่ใช้ซ้ำได้ |
| `Hook` | React function พิเศษที่เริ่มด้วย `use` ใช้จัดการ state/lifecycle |
| `TypeScript` | JavaScript ที่มี Type system ช่วยป้องกัน bug ก่อน runtime |
| `REST API` | มาตรฐานการออกแบบ API โดยใช้ HTTP methods (GET/POST/PATCH/DELETE) |
| `JWT` | JSON Web Token — มาตรฐาน token สำหรับ authentication |
| `WebSocket` | Protocol สำหรับการสื่อสารแบบสองทิศทาง real-time |
| `Deploy` | นำระบบขึ้น server ให้ผู้ใช้จริงเข้าถึงได้ |
| `TPQI 10302` | มาตรฐานอาชีพไอที ระดับ 3 — พัฒนา Web Application |
