# Async/Await กับ Loading State <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** บทนี้สอน pattern try-catch-finally สำหรับ async API call พร้อม 3 states (loading/error/data) ที่บรรจุใน Custom Hook useEquipments ซึ่งเป็น hook หลักที่ใช้ตลอดโปรเจกต์จนถึง wk7

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
เมื่อกด "ยืมอุปกรณ์" แล้ว Backend ใช้เวลาบันทึกข้อมูล — ถ้าไม่มี Loading State ผู้ใช้จะไม่รู้ว่าระบบกำลังทำงานอยู่ อาจกดซ้ำหลายครั้งจนข้อมูลผิด ต้องจัดการ **async/await + loading + error** ให้ถูกต้อง!
:::

> 💡 **เปรียบเทียบ:** async/await เหมือนสั่งอาหาร Delivery — เราส่งคำสั่ง (Request) แล้วรอ (await) จนอาหารมาถึง ระหว่างรอเราทำอย่างอื่นได้ (non-blocking) ส่วน Loading Spinner คือ "กำลังจัดส่ง" ที่แสดงให้ผู้ใช้รู้ว่าระบบกำลังทำงาน

## 📖 I: Information

### ขั้นตอนที่ 1 — จัดการความไม่แน่นอนด้วย Async/Await + 3 States

การเรียกใช้งาน API นั้นมีความเร็วไม่แน่นอน (Asynchronous) ขึ้นอยู่กับขนาดของข้อมูลและความเร็วของอินเทอร์เน็ต เราไม่มีทางรู้เลยว่าเซิร์ฟเวอร์จะตอบกลับมาเมื่อไหร่ หรือจะเกิดข้อผิดพลาดหรือไม่ ดังนั้นในโลกของ React เราจำเป็นต้องออกแบบตอบสนองผู้ใช้ (UX) เสมอว่าระบบกำลังทำอะไรอยู่ โดยมีสถานะกลไกที่ต้องดูแล 3 อย่างเมื่อสื่อสารกับ API:

1. **Loading State:** โหมด 'กำลังโหลด' เพื่อให้ผู้ใช้เห็นว่าระบบกำลังทำงาน ไม่นิ่งค้างไป
2. **Success/Data State:** หากโหลดข้อมูลสำเร็จ นำข้อมูลไปเก็บรักษาก่อนจะวาดออกหน้าจอ
3. **Error State:** หากเซิร์ฟเวอร์เจอปัญหา หรืออินเทอร์เน็ตหลุด เราต้องเปิดเผยข้อความแจ้งเตือนปัญหานั้นให้ผู้ใช้ทราบ (เช่น "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้")

เราใช้ **`try-catch-finally`** ในการจัดการ 3 สถานะนี้ ลองทำข้อมูล(try) ถ้าพลาดจับการโยน(catch) ไม่ว่าอย่างไรการทำงานต้องสิ้นสุดเสมอเพื่อปิดวงจร Loading(finally)

พฤติกรรมนี้ถ้าเราเขียนติดกับ UI Component ตรง ๆ จะทำให้โค้ดยาวและดูวุ่นวาย ดังนั้นเราจึงจับทุกอย่างมารวมไว้ใน **Custom Hook** ที่ชื่อ `useEquipments`:

3 สถานะที่ทุก async operation ต้องจัดการ:

| สถานะ | ความหมาย | แสดงใน UI |
| :--- | :--- | :--- |
| `isLoading = true` | กำลังรอผลจาก API | "กำลังโหลดข้อมูล..." |
| `error != null` | API ตอบกลับผิดพลาด | Error message สีแดง |
| ข้อมูลพร้อม + `isLoading = false` | ได้ข้อมูลแล้ว | แสดงรายการ |

::: code-group
```ts [src/hooks/useEquipments.ts ✅]
import { useState, useEffect, useCallback } from 'react'
import { getEquipments } from '../api/equipmentApi'
import type { Equipment } from '../types'

export function useEquipments() {
  const [equipments,  setEquipments]  = useState<Equipment[]>([])
  const [isLoading,   setIsLoading]   = useState<boolean>(true)
  const [error,       setError]       = useState<string | null>(null)

  // [1] useCallback — memo function ไม่ให้สร้างใหม่ทุก render
  //     ถ้าไม่ wrap ด้วย useCallback → useEffect ด้านล่าง loop ซ้ำตลอด
  const fetchEquipments = useCallback(async () => {
    setIsLoading(true)   // [2] เปิด loading ก่อนเสมอ
    setError(null)       // [3] ล้าง error เก่า

    try {
      const data = await getEquipments()  // [4] รอ API — ถ้า Error จะ throw ออกมา
      setEquipments(data)                 // [5] บันทึกข้อมูลสำเร็จ
    } catch {
      setError('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้')  // [6] จับ error ทุกชนิด
    } finally {
      setIsLoading(false)  // [7] ปิด loading เสมอ ไม่ว่าจะ success หรือ error
    }
  }, [])  // [] = ไม่ขึ้นกับ state ใด — สร้างครั้งเดียวตลอดชีวิต component

  // [8] useEffect — เรียก fetchEquipments ครั้งแรกตอน mount
  //     dependency [fetchEquipments] → เรียกใหม่เมื่อฟังก์ชันเปลี่ยน (ซึ่งไม่เปลี่ยน)
  useEffect(() => {
    fetchEquipments()
  }, [fetchEquipments])

  // [9] return refetch ด้วย — ใช้ refresh ข้อมูลหลัง borrow/return/delete
  return { equipments, setEquipments, isLoading, error, refetch: fetchEquipments }
}
```

```tsx [EquipmentPage.tsx — Loading/Error/Empty State ✅]
export function EquipmentPage() {
  const { equipments, isLoading, error } = useEquipments()

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* [1] Loading State — แสดงขณะรอ API */}
      {isLoading && (
        <p className="text-center text-slate-400 py-16">กำลังโหลดข้อมูล...</p>
      )}

      {/* [2] Fetch Error — แสดงเมื่อ API ไม่ตอบหรือ error */}
      {error && (
        <p className="text-center text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4">{error}</p>
      )}

      {/* [3] Equipment Grid — แสดงเมื่อโหลดเสร็จ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipments.map(eq => (
          <div key={eq.id} className="bg-white rounded-xl border p-4">{eq.name}</div>
        ))}
      </div>

      {/* [4] Empty State — แสดงเมื่อ array ว่าง (ไม่ใช่ loading) */}
      {!isLoading && equipments.length === 0 && (
        <p className="text-center text-slate-400 py-16">ยังไม่มีอุปกรณ์ในระบบ</p>
      )}

    </main>
  )
}
```
:::

**สรุป:** `try` ดึงข้อมูล → `catch` จัดการ error → `finally` ปิด loading เสมอ ✅

### ขั้นตอนที่ 2 — async function สำหรับ action (Borrow/Return)

Pattern ที่ต้องจัดการ loading + error ใน action แตกต่างจากการ fetch:

```tsx [EquipmentPage.tsx — handleBorrow async]
// [1] ยืมอุปกรณ์ — PATCH /api/equipments/:id
async function handleBorrow(equipmentId: number, purpose: string) {
  setActionError(null)
  // [2] ไม่ต้องมี isLoading แยก — ใช้ disabled button แทน
  try {
    // [3] await — รอ PATCH request สำเร็จก่อนทำอย่างอื่น
    await updateEquipmentStatus(equipmentId, 'borrowed', 'Mock User')
    setBorrowingId(null)   // ปิด BorrowForm
    setPurpose('')
    refetch()              // [4] ดึงข้อมูลใหม่หลัง action สำเร็จ
  } catch {
    // [5] Error เกิดใน try → มาที่นี่ — ไม่ crash app
    setActionError('ไม่สามารถยืมอุปกรณ์ได้ กรุณาลองใหม่')
  }
}
```

#### 🔷 TypeScript ในบทนี้

```ts [TypeScript ที่ใช้ในบทนี้]
// [1] useState<boolean> และ useState<string | null>
//     ใช้กำหนด type ของ state ให้ชัดเจน
const [isLoading, setIsLoading] = useState<boolean>(true)
const [error,     setError]     = useState<string | null>(null)

// [2] useCallback<T> — Generic type อนุมานอัตโนมัติจาก async function
const fetchEquipments = useCallback(async () => {
  // ... TypeScript อนุมาน return type เป็น Promise<void>
}, [])

// [3] async/await — syntax สำหรับ Promise
//     await หยุดรอ Promise ก่อน ค่อยทำบรรทัดต่อไป
const data = await getEquipments()  // data เป็น Equipment[] (TypeScript รู้จาก return type)

// [4] try-catch โดยไม่ระบุ error variable
//     TypeScript 4.x+ รองรับ catch {} โดยไม่ต้องระบุ (e: unknown)
try { ... } catch { ... }
```

**สรุป:** `useState<boolean>` + `async/await` + `try-catch-finally` คือ pattern มาตรฐาน async ใน React ✅

### 3-State Pattern — data + isLoading + error

Pattern มาตรฐานสำหรับทุก API call ใน React:

```tsx
const [equipments, setEquipments] = useState<Equipment[]>([])
const [isLoading,  setIsLoading]  = useState(false)
const [error,      setError]      = useState<string | null>(null)
```

```
ลำดับ render:
① isLoading = true  → แสดง "กำลังโหลด..."
② error ≠ null      → แสดง error message (ถ้า fetch fail)
③ data พร้อม        → แสดงรายการอุปกรณ์
```

::: code-group
```tsx [✅ render pattern ที่ถูกต้อง]
// เรียงลำดับ: loading → error → data
if (isLoading) return <p className="text-center py-8">กำลังโหลด...</p>
if (error)     return <p className="text-red-500">{error}</p>
if (equipments.length === 0) return <p>ไม่พบอุปกรณ์</p>

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {equipments.map(eq => <EquipmentCard key={eq.id} {...eq} />)}
  </div>
)
```
```tsx [💡 ASCII: state machine]
// idle → loading → success
//              └→ error
```
:::

### Promise&lt;T&gt; return type — ต้องระบุเสมอ

::: code-group
```ts [✅ ระบุ return type ครบ]
async function login(email: string, password: string): Promise<boolean> {
  const res = await apiClient.post<ApiResponse<{ token: string }>>('/auth/login', { email, password })
  return res.data.success
}

async function fetchEquipments(): Promise<Equipment[]> {
  const res = await apiClient.get<ApiResponse<Equipment[]>>('/equipments')
  return res.data.data
}
```
```ts [❌ Promise(any) — TypeScript ช่วยไม่ได้]
async function login(...): Promise<any> {  // ❌ any ทำให้ type checking พัง
  return await apiClient.post('/auth/login', ...)
}
```
:::

> TypeScript ตรวจ caller ได้ถ้าระบุ return type ชัดเจน — caller รู้ว่า `await login(...)` คืน `boolean`

## 🛠️ A: Application

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] อธิบายได้ว่าทำไม `finally` ดีกว่าใส่ `setIsLoading(false)` ใน try และ catch แยกกัน
- [ ] บอกได้ว่า `useCallback` ป้องกัน infinite loop ได้อย่างไรเมื่อใช้ร่วมกับ `useEffect`
:::

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการสร้าง custom hook `useEquipments` ที่: 1) มี states `equipments: Equipment[]`, `isLoading: boolean`, `error: string | null` 2) ใช้ `useCallback` ครอบ async fetch function พร้อม `try-catch-finally` 3) ใช้ `useEffect` เรียก fetch ตอน mount 4) return `refetch` ให้ Component เรียกหลัง action สำเร็จ 5) แสดง Loading/Error/Empty state ใน Component — ใช้ TypeScript types ถูกต้อง"
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/hooks/useEquipments.ts`

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เปิด `useEquipments.ts` → ตรวจสอบว่า `<footer>` ชื่อ-รหัสของตนเองอยู่ใน Component ที่ใช้ Hook ✅

**ขั้น 1: อัปเดต useEquipments Hook (15 นาที)**

- [ ] เปิด `src/hooks/useEquipments.ts`
- [ ] ลบ Mock Data ออก แทนที่ด้วย `import { getEquipments } from '../api/equipmentApi'`
- [ ] เพิ่ม state `isLoading: boolean` เริ่มต้น `true`
- [ ] เพิ่ม state `error: string | null` เริ่มต้น `null`
- [ ] ครอบ fetch ด้วย `useCallback(async () => {...}, [])` พร้อม `try-catch-finally`
- [ ] ใช้ `useEffect(() => { fetchEquipments() }, [fetchEquipments])`
- [ ] ทดสอบ: เปิด Backend → รายการแสดงจาก API จริง ✅

**ขั้น 2: แสดง Loading/Error/Empty State (10 นาที)**

- [ ] ใน `EquipmentPage.tsx` เพิ่ม `{isLoading && <p>กำลังโหลด...</p>}`
- [ ] เพิ่ม `{error && <p className="text-red-600">{error}</p>}`
- [ ] เพิ่ม `{!isLoading && equipments.length === 0 && <p>ยังไม่มีอุปกรณ์</p>}`
- [ ] ทดสอบ: ปิด Backend → ต้องเห็น error message ✅
- [ ] ทดสอบ: Network tab → Throttle "Slow 3G" → ต้องเห็น Loading state ✅

**ขั้น 3: refetch หลัง action (10 นาที)**

- [ ] เพิ่ม `handleBorrow` async function ด้วย `try-catch` + เรียก `updateEquipmentStatus`
- [ ] เรียก `refetch()` หลัง action สำเร็จ
- [ ] ทดสอบ: กดยืมอุปกรณ์ → status การ์ดเปลี่ยนหลัง refetch ✅

**ขั้นสุดท้าย: Submit**

- [ ] `git add src/hooks/useEquipments.ts src/pages/EquipmentPage.tsx && git commit -m "wk4: useEquipments with loading/error state and real API"` → `git push`
- [ ] เขียนสรุปใน Google Doc: `try-catch-finally` ต่างกันอย่างไร, `useCallback` ป้องกัน infinite loop ยังไง พร้อม screenshot Loading state + ลิงก์ repo

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `finally` ถึงดีกว่าใส่ `setIsLoading(false)` ใน try และ catch แยกกัน?
**แนวคำตอบ:** ถ้าใส่ `setIsLoading(false)` ใน try และ catch แยก — ถ้าเกิด error ที่ไม่คาดคิด (throw หลุด catch block ที่เขียนไว้) loading จะค้างตลอด `finally` รันเสมอ ไม่ว่าจะ success หรือ error หรือ unexpected throw ทำให้แน่ใจ 100% ว่า loading ปิด
:::

::: details ❓ `useCallback` กับ `useEffect` ทำงานร่วมกันอย่างไร — ทำไมต้องมีทั้งคู่?
**แนวคำตอบ:** `useEffect(() => { fetchEquipments() }, [fetchEquipments])` — รัน effect ทุกครั้งที่ `fetchEquipments` เปลี่ยน ถ้าไม่ wrap ด้วย `useCallback` ฟังก์ชันจะสร้างใหม่ทุก render → `fetchEquipments` เปลี่ยน → useEffect รันใหม่ → fetch → re-render → ฟังก์ชันสร้างใหม่ → loop ซ้ำตลอด `useCallback` กับ `[]` ทำให้สร้างครั้งเดียว
:::

::: details ❓ `refetch` vs `setEquipments` ต่างกันอย่างไร และควรใช้อันไหนหลัง action?
**แนวคำตอบ:** `setEquipments` แก้ state โดยตรง (optimistic update — ไวแต่อาจไม่ sync กับ server) ส่วน `refetch` ดึงข้อมูลใหม่จาก API จริง (pessimistic update — ช้ากว่าแต่รับประกันว่า sync) ใน wk4 ใช้ `refetch` ก่อน ใน wk7 (Real-time) จะเปลี่ยนเป็น `setEquipments` โดยตรงเมื่อได้รับ Socket event
:::

::: details ❓ ทำไม Empty State (`equipments.length === 0`) ต้องตรวจ `!isLoading` ด้วย?
**แนวคำตอบ:** ตอนเริ่มต้น `equipments = []` และ `isLoading = true` — ถ้าไม่ตรวจ `!isLoading` จะแสดง "ยังไม่มีอุปกรณ์" ทันทีก่อน API ตอบ ซึ่งผิด ผู้ใช้จะเห็น Loading กับ "ยังไม่มี" พร้อมกัน การเพิ่ม `!isLoading &&` ทำให้ Empty State แสดงเฉพาะเมื่อโหลดเสร็จแล้วจริงๆ ว่างเปล่า
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| API ถูกเรียกซ้ำไม่หยุด (infinite loop) | `fetchEquipments` ไม่ได้ wrap ด้วย `useCallback` ทำให้สร้างใหม่ทุก render | เพิ่ม `useCallback(async () => {...}, [])` ครอบฟังก์ชัน fetch |
| Loading ค้างตลอดเมื่อเกิด error | ไม่ได้ใส่ `setIsLoading(false)` ใน `finally` | ย้าย `setIsLoading(false)` เข้า `finally` block แทน try/catch |
| Empty state แสดงก่อนข้อมูลโหลด | <code v-pre>{equipments.length === 0 && &lt;p&gt;ว่าง&lt;/p&gt;}</code> ไม่มี `!isLoading` | เพิ่ม `!isLoading &&` เพื่อตรวจว่าโหลดเสร็จจริงก่อน |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| try-catch-finally | finally ปิด loading เสมอ, catch แสดง error | มีแต่ไม่ใช้ finally | ไม่มี error handling |
| 3 States ครบ | loading/error/empty state แสดงถูกต้อง | มีบางส่วน | ไม่มี state แสดง |
| refetch ทำงาน | กด borrow/return → ข้อมูล refresh | refetch มีแต่ไม่เรียก | ใช้ mock data ต่อ |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `async/await` | เอ-ซิงค์ อะ-เวท | Syntax สำหรับเขียน asynchronous code แบบอ่านง่าย เหมือน synchronous |
| `try-catch-finally` | ทราย-แคทช์-ไฟ-นัล-ลี | โครงสร้างจัดการ error: try=ลอง, catch=ถ้าพัง, finally=เสมอ |
| `Loading State` | โหลด-ดิ่ง สเตท | สถานะ "กำลังโหลด" ที่บอกผู้ใช้ว่าระบบกำลังรอผลจาก API |
| `Error Handling` | เออ-เรอ แฮน-ดลิ่ง | การจัดการข้อผิดพลาดที่อาจเกิดจาก API หรือ network |
| `useCallback` | อิว-คอล-แบค | React Hook ที่ memo function ไม่ให้สร้างใหม่ทุก render |
| `refetch` | รี-เฟทช์ | เรียก fetch ใหม่จาก API เพื่อ sync ข้อมูลหลัง action สำเร็จ |
| `Empty State` | เอม-ตี้ สเตท | UI ที่แสดงเมื่อไม่มีข้อมูล — ดีกว่าแสดงหน้าว่างเปล่า |
| `Promise` | พรอม-มิส | Object ที่แทน async operation ที่ยังไม่เสร็จ — resolve หรือ reject |
