# useEffect — Side Effects และการโหลดข้อมูล <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายต้องโหลดรายการอุปกรณ์จาก Backend API ตอนที่หน้าเว็บเปิดขึ้นมาครั้งแรก — แต่ถ้าเรียก API ใน Component โดยตรง มันจะรันซ้ำทุกครั้งที่ re-render ทำให้ส่ง request ไปหาเซิร์ฟเวอร์ไม่รู้จบ
:::

> 💡 **เปรียบเทียบ:** `useEffect` เหมือน "ตั้งนาฬิกาปลุก" — บอกว่า "ให้ทำสิ่งนี้ตอนที่หน้าเปิดขึ้น (หรือเมื่อค่าบางอย่างเปลี่ยน)" ไม่ใช่ทำทุกครั้งที่ render

---

## 📖 I: Information

### useEffect คืออะไร?

ในการทำงานของ React Component เมื่อโค้ดใน JSX เปลี่ยนแปลง Component จะทำการวาดใหม่ (Re-render) เสมอ แต่ในการสร้างแอปพลิเคชันจริง เรามักมีความจำเป็นที่จะต้องให้ Component เข้าถึงโลกภายนอกที่ React ควบคุมไม่ได้ (หรือไม่ได้อยู่ในวงจรการวาดหน้าจอปกติ) สิ่งเหล่านี้เรียกว่า **Side Effect (ผลกระทบข้างเคียง)** ซึ่ง `useEffect` เป็น Hook ที่ถูกออกแบบมารับหน้าที่จัดการเรื่องนี้โดยเฉพาะ

**Side Effect** คืองานทั้งหมดที่เกี่ยวโยงกับระบบภายนอกหรือมีผลกระทบต่อสิ่งอื่นที่ไม่ใช่แค่การคืนค่า JSX ออกมา ได้แก่:
- โหลดข้อมูลจาก API
- ตั้ง event listener
- เปลี่ยน document.title

::: code-group
```tsx [❌ เรียก API ตรงใน render — วนซ้ำไม่หยุด]
export function EquipmentList() {
  const [equipments, setEquipments] = useState([])

  // ❌ ทุกครั้งที่ setEquipments เรียก → re-render → fetch อีก → ...
  fetch('/api/equipments')
    .then(res => res.json())
    .then(data => setEquipments(data))

  return <div>...</div>
}
```

```tsx [✅ ใช้ useEffect — รันแค่ครั้งเดียวตอน mount]
import { useState, useEffect } from 'react'

export function EquipmentList() {
  const [equipments, setEquipments] = useState([])

  // ✅ useEffect รันหลัง render เสร็จ และ [] คือ dependency array ว่าง
  // หมายความว่า: รันแค่ครั้งเดียวตอน Component ถูกสร้าง (mount)
  useEffect(() => {
    fetch('/api/equipments')
      .then(res => res.json())
      .then(data => setEquipments(data))
  }, [])  // ← dependency array ว่าง = รันแค่ครั้งแรก

  return <div>...</div>
}
```
:::

---

### ขั้นตอนที่ 1 — โครงสร้างของ useEffect

```tsx [src/App.tsx]
import { useState, useEffect } from 'react'

export default function App() {
  const [equipments, setEquipments] = useState<string[]>([])
  const [isLoading, setIsLoading]   = useState<boolean>(true)

  useEffect(() => {
    // [1] โค้ดใน callback นี้รันหลัง render เสร็จ
    console.log('Component mounted!')

    // [2] จำลองการโหลดข้อมูล (delay 1 วินาที)
    setTimeout(() => {
      setEquipments(['MacBook Pro', 'iPad Air', 'Projector'])
      setIsLoading(false)
    }, 1000)

  }, []) // [3] dependency array — [] = รันแค่ครั้งแรก

  if (isLoading) return <p>กำลังโหลด...</p>

  return (
    <ul>
      {equipments.map((name) => <li key={name}>{name}</li>)}
    </ul>
  )
}
```

**สรุป:**
1. Component render ครั้งแรก → แสดง "กำลังโหลด..."
2. `useEffect` รันหลัง render → โหลดข้อมูล (delay 1 วิ)
3. `setEquipments` และ `setIsLoading` → re-render → แสดงรายการ ✅

---

### ขั้นตอนที่ 2 — Dependency Array ควบคุม "เมื่อไหร่ที่ useEffect รัน"

::: code-group
```tsx [[] — รันครั้งเดียว (on mount)]
useEffect(() => {
  // รันแค่ครั้งแรกที่ Component ถูกสร้าง
  fetch('/api/equipments').then(...)
}, [])
```

```tsx [[someValue] — รันทุกครั้งที่ someValue เปลี่ยน]
const [page, setPage] = useState(1)

useEffect(() => {
  // รันทุกครั้งที่ page เปลี่ยน (โหลดหน้าใหม่)
  fetch(`/api/equipments?page=${page}`).then(...)
}, [page])  // ← เมื่อ page เปลี่ยน effect จะรันใหม่
```

```tsx [ไม่มี [] — รันทุก render (ระวัง!)]
useEffect(() => {
  // ⚠️ รันทุกครั้งที่ Component re-render — อาจทำให้ช้า
  console.log('re-rendered')
})  // ← ไม่มี dependency array
```
:::

::: warning ⚠️ ลืม dependency array
ถ้าลืมใส่ `[]` และ effect ของคุณเรียก `setState` ข้างใน → วนซ้ำไม่หยุด! เป็น Bug ที่พบบ่อยมากใน React
:::

---

### ขั้นตอนที่ 3 — useEffect กับ async/await

`useEffect` callback ไม่รับ async function โดยตรง — ต้องประกาศ async ภายใน:

::: code-group
```tsx [✅ วิธีที่ถูก — async function ภายใน]
useEffect(() => {
  // ประกาศ async function ข้างใน
  async function loadEquipments() {
    setIsLoading(true)
    try {
      const res = await fetch('/api/equipments')
      const data = await res.json()
      setEquipments(data)
    } catch (error) {
      console.error('โหลดข้อมูลไม่สำเร็จ:', error)
    } finally {
      setIsLoading(false)
    }
  }

  loadEquipments()  // เรียก function ที่สร้างไว้
}, [])
```

```tsx [❌ วิธีที่ผิด — async callback โดยตรง]
// ❌ useEffect ไม่รับ async callback
useEffect(async () => {
  const data = await fetch('/api/equipments')  // Error!
}, [])
```
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"กำลังเรียน React 18 + TypeScript อยู่ ต้องการโหลดข้อมูลจาก API ตอน Component mount โดยใช้ useEffect + useState ช่วยเขียนตัวอย่างที่จัดการ loading state และ error state ด้วย ขอ TypeScript แบบเต็ม พร้อม interface สำหรับ response data"
:::

### 📝 PjBL Lab

**ขั้น 0: ระบุตัวตน (2 นาที)**

- [ ] เพิ่ม footer ชื่อ-รหัสของตนเองใน Component หลัก ✅

**ขั้น 1: useEffect พื้นฐาน (10 นาที)**

- [ ] เพิ่ม `useEffect` ใน `App.tsx` ที่มี `console.log('mounted')` ภายใน
- [ ] เปิด Browser DevTools (F12) → Console → ต้องเห็น "mounted" แค่ **1 ครั้ง** ✅
- [ ] ลองลบ `[]` ออก (dependency array) → สังเกตว่า log แสดงบ่อยขึ้นไหม

**ขั้น 2: จำลองการโหลดข้อมูล (15 นาที)**

- [ ] เพิ่ม `isLoading: boolean` state เริ่มต้น `true`
- [ ] ใน `useEffect` ใช้ `setTimeout` delay 1.5 วินาที แล้ว `setEquipments([...])` และ `setIsLoading(false)`
- [ ] แสดงข้อความ "กำลังโหลด..." เมื่อ `isLoading` เป็น `true`
- [ ] รอ 1.5 วิ → รายการต้องปรากฏใน Browser ✅

**ขั้น 3: Dependency Array (10 นาที)**

- [ ] เพิ่ม `selectedCategory: string` state เริ่มต้น `'all'`
- [ ] เพิ่มปุ่ม filter เช่น "Notebook", "Tablet", "ทั้งหมด"
- [ ] เพิ่ม `useEffect` ที่มี `[selectedCategory]` ใน dependency → log category เมื่อกดปุ่ม ✅

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `useEffect` ถึงรันหลัง render ไม่ใช่ก่อน?
**แนวคำตอบ:** React ต้องการให้ render เสร็จก่อนจึงจะทำ side effect — เพราะ effect บางอย่างต้องการ DOM ที่ render แล้ว เช่น การอ่านขนาด element ด้วย `ref` นอกจากนี้ยังทำให้ UI ไม่ค้างรอ side effect ก่อนแสดง
:::

::: details ❓ Dependency array `[]` กับ `[value]` ต่างกันอย่างไรในทางปฏิบัติ?
**แนวคำตอบ:** `[]` = mount once คือโหลดข้อมูลครั้งแรกแล้วไม่โหลดอีก ใช้สำหรับ initial data fetch `[value]` = รันทุกครั้งที่ value เปลี่ยน ใช้สำหรับ search/filter — เช่น ทุกครั้งที่ keyword เปลี่ยน ให้ fetch ใหม่ด้วย keyword นั้น
:::

::: details ❓ ทำไม async callback ใน useEffect โดยตรงไม่ได้?
**แนวคำตอบ:** `useEffect` คาดว่า callback จะ return `undefined` หรือ cleanup function ส่วน `async function` จะ return `Promise` เสมอ ซึ่ง React ไม่รู้วิธีจัดการ Promise นั้น — ทางแก้คือประกาศ `async function` ไว้ข้างใน แล้วเรียกมัน
:::

::: details ❓ ถ้าลืม Dependency Array จะเกิดอะไร?
**แนวคำตอบ:** `useEffect` จะรันทุกครั้งที่ Component re-render ถ้า effect นั้นเรียก `setState` → เกิด re-render อีก → effect รันอีก → วนไม่หยุด (infinite loop) นี่เป็น Bug ที่พบบ่อยมาก — ต้องใส่ `[]` เสมอเมื่อต้องการรันแค่ครั้งเดียว
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| useEffect พื้นฐาน | mounted log แค่ 1 ครั้ง ถูกต้อง | มี useEffect แต่ไม่มี `[]` | ยังไม่ได้ใช้ |
| Loading State | แสดง "กำลังโหลด..." แล้วข้อมูล | มีบางส่วน | ไม่มี loading state |
| Dependency Array | เข้าใจและใช้ถูกต้อง | มีแต่ไม่แน่ใจ | ไม่เข้าใจ |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Side Effect` | การกระทำที่อยู่นอกการ render เช่น fetch API, timer, event listener |
| `useEffect` | Hook สำหรับทำ side effect หลัง render |
| `Dependency Array` | Array ที่บอก useEffect ว่าให้รันใหม่เมื่อค่าไหนเปลี่ยน |
| `Mount` | ตอนที่ Component ถูกสร้างและแสดงใน DOM ครั้งแรก |
| `Unmount` | ตอนที่ Component ถูกลบออกจาก DOM |
| `Cleanup Function` | ฟังก์ชันที่ return จาก useEffect สำหรับทำความสะอาดก่อน unmount |
