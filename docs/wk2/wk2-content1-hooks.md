# สร้างฟังก์ชัน (Custom Hooks) <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ไอที มีหลายหน้าที่ต้องแสดงรายการอุปกรณ์ — ทั้งหน้าหลัก หน้า Admin และหน้าสถิติ ถ้าเขียนโค้ดดึงข้อมูลซ้ำในทุกหน้า เมื่อ API เปลี่ยน ต้องไปแก้ทุกที่ จะดีกว่าไหมถ้ามี "ฟังก์ชันกลาง" ที่ทุกหน้าเรียกใช้ร่วมกันได้?
:::

> 💡 **เปรียบเทียบ:** Custom Hook ก็เหมือน "สูตรทำอาหาร" — เขียนสูตรครั้งเดียว ทำกี่ครั้งก็ได้ผลเหมือนกัน ต่างคนต่างทำได้โดยไม่ต้องเริ่มจากศูนย์

---

## 📖 I: Information

**Custom Hook** คือฟังก์ชันที่ชื่อขึ้นต้นด้วย `use` และนำ React Hooks (`useState`, `useEffect`) มารวมกัน เพื่อ **แยก Logic ออกจาก UI** ทำให้ Component ดูแลง่ายขึ้น

::: code-group
```ts [hooks/useEquipments.ts]
import { useState, useEffect, useCallback } from 'react'

// Interface กำหนด shape ของอุปกรณ์ (TS Focus: wk2)
interface Equipment {
  id: number
  name: string
  category: string
  status: string
}

export function useEquipments() {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // useCallback ป้องกัน function ถูกสร้างใหม่ทุก render
  const fetchEquipments = useCallback(async () => {
    setIsLoading(true)
    try {
      // TODO wk4: เปลี่ยนเป็น API จริง
      const mockData: Equipment[] = [
        { id: 1, name: 'MacBook Pro', category: 'Notebook', status: 'available' },
        { id: 2, name: 'iPad Air', category: 'Tablet', status: 'borrowed' },
      ]
      setEquipments(mockData)
    } catch {
      setError('โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchEquipments() }, [fetchEquipments])

  // return object ให้ component เรียกใช้
  return { equipments, isLoading, error, refetch: fetchEquipments }
}
```

```tsx [EquipmentPage.tsx]
// วิธีใช้ useEquipments ใน Component
import { useEquipments } from '../hooks/useEquipments'

export function EquipmentPage() {
  const { equipments, isLoading, error } = useEquipments() // เรียกใช้ Hook

  if (isLoading) return <p>กำลังโหลด...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      {equipments.map(eq => (
        <p key={eq.id}>{eq.name} — {eq.status}</p>
      ))}
    </div>
  )
}
```
:::

::: tip 💡 TypeScript Tip — Interface
`interface Equipment { }` กำหนดว่าอ็อบเจ็กต์ต้องมี field อะไรบ้าง ถ้าลืมใส่ field TypeScript จะแจ้ง error ทันที ช่วยป้องกัน Bug ก่อน run โปรแกรม
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง React custom hook ชื่อ `useEquipments` ที่ดึงรายการอุปกรณ์ซึ่งมี field: id (number), name (string), status (string) พร้อมใส่ loading state และ error state ด้วย TypeScript types"
:::

### 📝 PjBL Lab

สร้างไฟล์ `src/hooks/useEquipments.ts` โดยทำตาม checklist:

- [ ] สร้าง interface `Equipment` มีฟิลด์ `id`, `name`, `category`, `status`
- [ ] สร้าง `useState<Equipment[]>([])` สำหรับเก็บรายการ
- [ ] สร้าง `useState<boolean>(true)` สำหรับ loading
- [ ] สร้าง `useState<string | null>(null)` สำหรับ error
- [ ] เขียน `fetchEquipments` ด้วย mock data ก่อน (wk4 ค่อยเปลี่ยนเป็น API จริง)
- [ ] ใช้ `useEffect` เรียก `fetchEquipments` ตอน component mount
- [ ] `return { equipments, isLoading, error, refetch: fetchEquipments }`
- [ ] ใช้ Hook ใน `EquipmentPage.tsx` แสดงรายชื่ออุปกรณ์

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Custom Hook ชื่อต้องขึ้นต้นด้วย `use`?
**แนวคำตอบ:** เป็น Convention ของ React ที่บอกว่าฟังก์ชันนี้ใช้ React Hooks ข้างใน ถ้าไม่ขึ้นต้นด้วย `use` React จะไม่ตรวจสอบ Rules of Hooks ให้ อาจเกิด Bug แปลก ๆ ได้
:::

::: details ❓ ต่างกันอย่างไรระหว่าง `useEffect` กับ `useCallback`?
**แนวคำตอบ:** `useEffect` ใช้รัน side effect (เช่น fetch ข้อมูล) ตอน mount หรือ dependency เปลี่ยน ส่วน `useCallback` ใช้จดจำ function ให้ reference เดิม ไม่สร้างใหม่ทุก render ช่วยป้องกัน `useEffect` รันซ้ำโดยไม่จำเป็น
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Interface ถูกต้อง | กำหนด type ครบทุก field | บางส่วนเป็น `any` | ไม่มี interface |
| Hook ทำงานได้ | loading/error/data ครบ | บางส่วนขาด | Hook ไม่ทำงาน |
| Component ใช้ Hook | แสดงข้อมูลถูกต้อง | แสดงแต่ไม่มี loading | ไม่ได้ใช้ Hook |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Custom Hook` | ฟังก์ชันที่สร้างขึ้นเองโดยรวม React Hooks เพื่อแชร์ Logic |
| `useState` | Hook สำหรับเก็บและอัปเดตข้อมูลใน Component |
| `useEffect` | Hook สำหรับรัน side effect เมื่อ Component mount หรือ data เปลี่ยน |
| `interface` | คีย์เวิร์ด TypeScript ใช้กำหนด shape ของ Object |
| `refetch` | ฟังก์ชันที่ให้ Component เรียกเพื่อโหลดข้อมูลใหม่ |
