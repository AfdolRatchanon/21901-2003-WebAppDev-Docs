# Real-time ด้วย Socket.io <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
นักเรียนคนหนึ่งยืมอุปกรณ์ — นักเรียนคนอื่นต้องเห็นสถานะเปลี่ยนทันที โดยไม่ต้อง refresh หน้า ถ้าใช้ polling (เช็ค API ทุก 5 วินาที) จะเปลือง bandwidth มาก **Socket.io** แก้ปัญหาด้วย WebSocket ที่ Server push ข้อมูลหาทุก Client แบบ Real-time!
:::

> 💡 **เปรียบเทียบ:** Polling เหมือนโทรถาม "มีจดหมายไหม?" ทุก 5 นาที ส่วน Socket.io เหมือนให้ไปรษณีย์ "กดกริ่ง" เมื่อจดหมายมาถึง — เร็วกว่าและไม่เปลืองทรัพยากร

---

## 📖 I: Information

### WebSocket vs HTTP

| | HTTP (REST) | WebSocket (Socket.io) |
| :--- | :--- | :--- |
| ทิศทาง | Client → Server → Client | สองทิศทาง (bidirectional) |
| การเชื่อมต่อ | เปิด-ปิดทุก request | เปิดค้างไว้ตลอด session |
| Use case | CRUD ทั่วไป | Real-time: chat, notifications, live data |
| Server push | ❌ ไม่ได้ (ต้อง polling) | ✅ Server ส่งได้ทุกเมื่อ |

### Flow ของ Real-time ในโปรเจกต์

```
Client A                 Server                   Client B
    │                        │                        │
    │── PATCH /api/eq/1 ────▶│                        │
    │                        │── บันทึก DB ────────────│
    │                        │── emit('equipmentStatusChanged', payload)
    │                        │──────────────────────▶│
    │                        │                        │ อัปเดต UI ทันที!
    │◀── response ───────────│                        │
    │ refetch()              │                        │
```

### Frontend: useEquipmentRealtime Hook

::: code-group
```ts [hooks/useEquipmentRealtime.ts]
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import type { EquipmentStatusChangedPayload } from '../types'

export function useEquipmentRealtime(
  onStatusChange: (payload: EquipmentStatusChangedPayload) => void
) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // เชื่อมต่อ Socket.io (proxied ผ่าน /socket.io path)
    const socket = io({ path: '/socket.io' })

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    // รับ event เมื่อสถานะอุปกรณ์เปลี่ยน
    socket.on('equipmentStatusChanged', (payload: EquipmentStatusChangedPayload) => {
      onStatusChange(payload)
    })

    // เข้า room สำหรับอัปเดตอุปกรณ์
    socket.emit('joinRoom', 'equipment-updates')

    // cleanup: disconnect เมื่อ component unmount
    return () => {
      socket.disconnect()
    }
  }, [onStatusChange])

  return { isConnected }
}
```

```ts [src/types/index.ts — Payload type]
// ข้อมูลที่ Server ส่งมาเมื่อสถานะเปลี่ยน
export interface EquipmentStatusChangedPayload {
  equipmentId: number
  newStatus: 'available' | 'borrowed' | 'maintenance'
  borrowedBy: string | null
}
```

```tsx [pages/EquipmentPage.tsx — ใช้ hook]
export function EquipmentPage({ auth }: EquipmentPageProps) {
  const { equipments, setEquipments, isLoading, error, refetch } = useEquipments()

  // อัปเดต state โดยตรงเมื่อรับ real-time event (ไม่ต้อง refetch)
  const handleRealtimeChange = useCallback(
    (payload: EquipmentStatusChangedPayload) => {
      setEquipments(prev =>
        prev.map(eq =>
          eq.id === payload.equipmentId
            ? { ...eq, status: payload.newStatus, borrowedBy: payload.borrowedBy }
            : eq
        )
      )
    },
    [setEquipments]
  )

  const { isConnected } = useEquipmentRealtime(handleRealtimeChange)

  return (
    <main>
      {/* Real-time connection indicator */}
      <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
        isConnected
          ? 'bg-green-100 text-green-700'
          : 'bg-red-100 text-red-600'
      }`}>
        {isConnected ? '● เชื่อมต่อแล้ว (Real-time)' : '○ ออฟไลน์'}
      </span>
      {/* ... Equipment Grid ... */}
    </main>
  )
}
```
:::

::: tip 💡 TypeScript Tip — Spread + Override
`{ ...eq, status: payload.newStatus, borrowedBy: payload.borrowedBy }` คือ **Object Spread** — copy ทุก field จาก `eq` แล้ว override แค่ `status` และ `borrowedBy` ที่เปลี่ยน ไม่ต้อง type field อื่นซ้ำ
:::

### Vite Proxy สำหรับ Socket.io

```ts [vite.config.ts]
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/socket.io': {
        target: 'http://localhost:3000',
        ws: true,  // ← สำคัญ! ต้องเปิด WebSocket proxy
      },
    },
  },
})
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง custom React hook ชื่อ `useEquipmentRealtime` โดยใช้ socket.io-client และ TypeScript ให้เชื่อมต่อ Socket.io, รับฟัง event 'equipmentStatusChanged', เข้า room 'equipment-updates' และ return ค่า `isConnected` เป็น boolean พร้อม cleanup เมื่อ unmount"
:::

### 📝 PjBL Lab

- [ ] ดู `src/hooks/useEquipmentRealtime.ts` — เข้าใจ lifecycle: connect → join room → listen → cleanup
- [ ] ดู `vite.config.ts` — ดู proxy สำหรับ `/socket.io` ว่าเปิด `ws: true` ไหม
- [ ] รัน Backend + Frontend พร้อมกัน
- [ ] เปิด 2 Browser window — ยืมอุปกรณ์ในหน้าต่างหนึ่ง อีกหน้าต่างควรเปลี่ยนทันที
- [ ] ดู Connection indicator — ควรแสดง "เชื่อมต่อแล้ว (Real-time)"
- [ ] ปิด Backend — indicator ควรเปลี่ยนเป็น "ออฟไลน์"

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `handleRealtimeChange` ต้องใช้ `useCallback`?
**แนวคำตอบ:** `useEquipmentRealtime` มี `[onStatusChange]` ใน dependency array — ถ้าไม่ wrap `handleRealtimeChange` ด้วย `useCallback` มันจะสร้างใหม่ทุก render ทำให้ `useEffect` ใน `useEquipmentRealtime` disconnect แล้ว reconnect ซ้ำตลอดเวลา
:::

::: details ❓ Socket.io ต่างจาก WebSocket ปกติยังไง?
**แนวคำตอบ:** WebSocket เป็น low-level protocol ส่วน Socket.io สร้างบน WebSocket และเพิ่ม features: auto-reconnect, rooms, fallback to polling (ถ้า WebSocket ไม่รองรับ), event naming ที่อ่านง่าย Socket.io จึงเหมาะกับ production มากกว่า
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Real-time ทำงาน | เห็นการเปลี่ยนแปลง real-time | เชื่อมต่อได้แต่ไม่อัปเดต UI | ไม่ได้ implement |
| Connection indicator | แสดงถูกต้องทั้ง online/offline | แสดงบางกรณี | ไม่มี |
| Cleanup | disconnect เมื่อ unmount | - | ไม่มี cleanup (memory leak) |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `WebSocket` | Protocol สำหรับการสื่อสารแบบสองทิศทางระหว่าง Client-Server |
| `Socket.io` | Library สร้างบน WebSocket เพิ่ม rooms, events, auto-reconnect |
| `emit` | ส่ง event จาก Client ไป Server (หรือ Server ไป Client) |
| `Room` | กลุ่มย่อยของ Socket.io connections — emit เฉพาะสมาชิกในห้อง |
| `Object Spread` | `{ ...obj, key: value }` — copy object แล้ว override บาง field |
| `Polling` | การเช็ค API ซ้ำ ๆ ตามเวลา — ไม่ efficient เท่า WebSocket |
