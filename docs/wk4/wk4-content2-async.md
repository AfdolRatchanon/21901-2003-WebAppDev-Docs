# Async/Await กับ Loading State <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
เมื่อกด "ยืมอุปกรณ์" แล้ว Backend ใช้เวลาบันทึกข้อมูล — ถ้าไม่มี Loading State ผู้ใช้จะไม่รู้ว่าระบบกำลังทำงานอยู่ อาจกดซ้ำหลายครั้งจนข้อมูลผิด ต้องจัดการ **async/await + loading + error** ให้ถูกต้อง!
:::

> 💡 **เปรียบเทียบ:** async/await เหมือนสั่งอาหาร Delivery — เราส่งคำสั่ง (Request) แล้วรอ (await) จนอาหารมาถึง ระหว่างรอเราทำอย่างอื่นได้ (non-blocking) ส่วน Loading Spinner คือ "กำลังจัดส่ง" ที่แสดงให้ผู้ใช้รู้ว่าระบบกำลังทำงาน

---

## 📖 I: Information

### 3 สถานะที่ทุก async operation ต้องจัดการ

| สถานะ | ความหมาย | แสดงใน UI |
| :--- | :--- | :--- |
| `isLoading = true` | กำลังรอผลจาก API | Spinner / "กำลังโหลด..." |
| `error != null` | API ตอบกลับผิดพลาด | Error message |
| ข้อมูลพร้อม | ได้ข้อมูลแล้ว | แสดงรายการ |

### Pattern: try-catch-finally

::: code-group
```ts [useEquipments.ts]
import { useState, useEffect, useCallback } from 'react'
import { getEquipments } from '../api/equipmentApi'
import type { Equipment } from '../types'

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEquipments = useCallback(async () => {
    setIsLoading(true)    // 1. เริ่ม: แสดง loading
    setError(null)        // 2. reset error เก่า
    try {
      const data = await getEquipments()  // 3. รอ API
      setEquipments(data)                 // 4. บันทึกข้อมูล
    } catch {
      setError('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้')  // 5. แสดง error
    } finally {
      setIsLoading(false)  // 6. เสมอ: ปิด loading
    }
  }, [])

  useEffect(() => {
    fetchEquipments()
  }, [fetchEquipments])

  return { equipments, setEquipments, isLoading, error, refetch: fetchEquipments }
}
```

```tsx [EquipmentPage.tsx (loading + error UI)]
export function EquipmentPage({ auth }: EquipmentPageProps) {
  const { equipments, isLoading, error } = useEquipments()

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* Loading State */}
      {isLoading && (
        <p className="text-center text-slate-400 py-16">กำลังโหลดข้อมูล...</p>
      )}

      {/* Fetch Error */}
      {error && (
        <p className="text-center text-red-600 bg-red-50 rounded-lg px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {/* Equipment Grid — แสดงเมื่อโหลดเสร็จและไม่มี error */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipments.map(eq => (
          <div key={eq.id} className="bg-white rounded-xl border p-4">
            {eq.name}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!isLoading && equipments.length === 0 && (
        <p className="text-center text-slate-400 py-16">ยังไม่มีอุปกรณ์ในระบบ</p>
      )}

    </main>
  )
}
```
:::

::: tip 💡 TypeScript Tip — `useCallback` dependency array
`useCallback(async () => { ... }, [])` — array ว่าง `[]` หมายถึง function นี้ไม่ขึ้นกับ state/props ใดเลย จึงสร้างครั้งเดียวตลอดชีวิต component ทำให้ `useEffect` ที่ depend on มันไม่ loop ซ้ำ
:::

### async function กับ action (Borrow/Return)

```tsx [EquipmentPage.tsx — handleBorrow]
// ยืมอุปกรณ์ — PATCH status = 'borrowed'
async function handleBorrow(equipmentId: number) {
  if (!purpose.trim()) {
    setActionError('กรุณาระบุวัตถุประสงค์การใช้งาน')
    return
  }
  try {
    await updateEquipmentStatus(equipmentId, 'borrowed', auth.user?.name ?? '')
    setBorrowingId(null)
    setPurpose('')
    refetch()                    // ดึงข้อมูลใหม่หลัง action สำเร็จ
  } catch {
    setActionError('ไม่สามารถยืมอุปกรณ์ได้ กรุณาลองใหม่')
  }
}
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง custom React hook ชื่อ `useEquipments` ด้วย TypeScript โดยมี states: `equipments: Equipment[]`, `isLoading: boolean`, `error: string | null` ใช้ `useCallback` ครอบฟังก์ชัน fetch และใช้ `useEffect` เรียกตอน mount ใช้ pattern try-catch-finally"
:::

### 📝 PjBL Lab

- [ ] อัปเดต `useEquipments.ts` ให้มี 3 states: `equipments`, `isLoading`, `error`
- [ ] ใช้ `try-catch-finally` ใน `fetchEquipments` — `finally` ต้อง `setIsLoading(false)` เสมอ
- [ ] แสดง "กำลังโหลดข้อมูล..." ขณะ `isLoading === true`
- [ ] แสดง error message เมื่อ API ไม่ตอบ (ปิด Backend แล้วลองโหลด)
- [ ] แสดง "ยังไม่มีอุปกรณ์" เมื่อ array ว่าง
- [ ] ทดสอบ: เปิด Network tab → throttle เป็น "Slow 3G" ดู Loading state

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `finally` ถึงสำคัญกว่า `setIsLoading(false)` ใน try/catch แยก?
**แนวคำตอบ:** ถ้าใส่ `setIsLoading(false)` ทั้งใน `try` และ `catch` แยกกัน — ถ้าเกิด error ที่ไม่คาดคิด (ไม่ใช่ network error) อาจ throw หลุด catch แล้ว loading ค้างตลอด `finally` รันเสมอไม่ว่าจะ success หรือ error ทำให้แน่ใจ 100% ว่า loading จะปิด
:::

::: details ❓ `useCallback` กับ `useEffect` ทำงานร่วมกันอย่างไร?
**แนวคำตอบ:** `useEffect(() => { fetchEquipments() }, [fetchEquipments])` — บอกว่า "รัน effect นี้ทุกครั้งที่ `fetchEquipments` เปลี่ยน" ถ้าไม่ wrap `fetchEquipments` ด้วย `useCallback` มันจะสร้างใหม่ทุก render ทำให้ useEffect loop ซ้ำตลอด
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Loading State | แสดง/ซ่อนถูกต้อง ใช้ finally | มีแต่ไม่ใช้ finally | ไม่มี loading |
| Error Handling | จับ error + แสดงใน UI | จับได้แต่ไม่แสดง | ไม่มี error handling |
| Empty State | แสดงเมื่อ array ว่าง | - | ไม่มี empty state |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `async/await` | Syntax สำหรับเขียนโค้ดที่ต้องรอผล (asynchronous) แบบอ่านง่าย |
| `try-catch-finally` | โครงสร้างจัดการ error: ลอง → ถ้าพัง → เสมอ |
| `Loading State` | สถานะ "กำลังโหลด" ที่บอกผู้ใช้ว่าระบบกำลังทำงาน |
| `useCallback` | React Hook ที่ memo function ไม่ให้สร้างใหม่ทุก render |
| `refetch` | ดึงข้อมูลใหม่จาก API (มักเรียกหลัง mutation สำเร็จ) |
