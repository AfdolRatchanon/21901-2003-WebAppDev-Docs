# Real-time ด้วย Socket.io — อัปเดตทันทีโดยไม่ Refresh <Badge type="info" text="TPQI 10302" />

> **บทนี้เตรียมอะไร:** เข้าใจความแตกต่างระหว่าง HTTP polling และ WebSocket, สร้าง custom hook `useEquipmentRealtime` ด้วย Socket.io, และใช้ `useCallback` ป้องกัน reconnect loop

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
นักเรียนคนหนึ่งยืมอุปกรณ์ — นักเรียนคนอื่นบนหน้าจอต่างกันต้องเห็นสถานะเปลี่ยนทันทีโดยไม่ต้อง refresh หน้า ถ้าใช้ polling (เช็ค API ทุก 5 วินาที) จะเปลือง bandwidth มากและ update ล่าช้า **Socket.io** แก้ปัญหาด้วย WebSocket ที่ Server push ข้อมูลหาทุก Client ทันทีที่มีการเปลี่ยนแปลง
:::

> 💡 **เปรียบเทียบ:** HTTP polling เหมือนโทรถาม "มีข่าวไหม?" ทุก 5 นาที ส่วน Socket.io เหมือนให้ไปรษณีย์ "กดกริ่ง" เมื่อมีจดหมายถึง — เร็วกว่าและไม่เปลืองทรัพยากร

## 📖 I: Information

### ขั้นตอนที่ 1 — WebSocket vs HTTP: เปรียบเทียบ

| | HTTP (REST API) | WebSocket (Socket.io) |
| :--- | :--- | :--- |
| ทิศทาง | Client → Server เท่านั้น | สองทิศทาง (bidirectional) |
| การเชื่อมต่อ | เปิด-ปิดทุก request | เปิดค้างไว้ตลอด session |
| Server push | ❌ ต้อง polling | ✅ Server ส่งได้ทุกเมื่อ |
| Use case | CRUD ทั่วไป | Chat, notifications, live data |
| Overhead | สูง (HTTP headers ทุก request) | ต่ำ (ต่อครั้งเดียว) |

**Real-time flow ในโปรเจกต์:**

```
Client A (ยืมอุปกรณ์)      Backend (Node.js)        Client B (หน้าจออื่น)
        │                        │                        │
        │── PATCH /api/eq/1 ────▶│                        │
        │                        │── บันทึก DB ────────────│
        │                        │── socket.emit('equipmentStatusChanged', payload)
        │◀── HTTP response ───────│────────────────────▶│
        │                        │                  อัปเดต UI ทันที!
```

### ขั้นตอนที่ 2 — useEquipmentRealtime Hook

```ts [src/hooks/useEquipmentRealtime.ts]
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'                      // [1] Socket.io client
import type { EquipmentStatusChangedPayload } from '../types'

export function useEquipmentRealtime(
  onStatusChange: (payload: EquipmentStatusChangedPayload) => void  // [2] callback
) {
  const [isConnected, setIsConnected] = useState(false)  // [3] ติดตามสถานะเชื่อมต่อ

  useEffect(() => {

    // [4] เชื่อมต่อ Socket.io — path '/socket.io' proxied ผ่าน Vite
    const socket = io({ path: '/socket.io' })

    // [5] Events สำหรับ connection status
    socket.on('connect',    () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    // [6] รับ event เมื่อสถานะอุปกรณ์เปลี่ยน — call callback ที่ส่งมา
    socket.on('equipmentStatusChanged', (payload: EquipmentStatusChangedPayload) => {
      onStatusChange(payload)  // [7] ส่งต่อให้ Component จัดการ
    })

    // [8] เข้า room สำหรับรับอัปเดตอุปกรณ์
    socket.emit('joinRoom', 'equipment-updates')

    // [9] Cleanup: disconnect เมื่อ component unmount — ป้องกัน memory leak
    return () => {
      socket.disconnect()
    }

  }, [onStatusChange])  // [10] dependency — รัน useEffect ใหม่ถ้า callback เปลี่ยน

  return { isConnected }  // [11] ส่ง connection status ออกไปให้ UI แสดง
}
```

**สรุปการทำงาน:** เชื่อมต่อ `[4]` → เข้า room `[8]` → รับฟัง event `[6]` → เมื่อ Server emit → call callback `[7]` → Component อัปเดต UI → cleanup `[9]` เมื่อออกจากหน้า

### ขั้นตอนที่ 3 — ใช้ Hook ใน EquipmentPage

```tsx [src/pages/EquipmentPage.tsx — เพิ่ม Real-time]
import { useCallback } from 'react'
import { useEquipments } from '../hooks/useEquipments'
import { useEquipmentRealtime } from '../hooks/useEquipmentRealtime'
import type { EquipmentStatusChangedPayload } from '../types'

export function EquipmentPage({ auth }: EquipmentPageProps) {
  const { equipments, setEquipments, isLoading, error, refetch } = useEquipments()

  // [1] callback ที่อัปเดต state โดยตรง (ไม่ refetch ทั้งหมด)
  //     ต้องใช้ useCallback เพราะเป็น dependency ของ useEquipmentRealtime
  const handleRealtimeChange = useCallback(
    (payload: EquipmentStatusChangedPayload) => {
      // [2] .map() เพื่ออัปเดตเฉพาะ equipment ที่ id ตรงกัน
      setEquipments(prev =>
        prev.map(eq =>
          eq.id === payload.equipmentId
            ? { ...eq, status: payload.newStatus, borrowedBy: payload.borrowedBy }  // [3] Spread + Override
            : eq  // [4] ไม่เปลี่ยน equipment อื่น
        )
      )
    },
    [setEquipments]  // [5] dependency
  )

  // [6] เริ่มฟัง real-time events
  const { isConnected } = useEquipmentRealtime(handleRealtimeChange)

  return (
    <main className="max-w-6xl mx-auto p-6">

      {/* [7] Connection indicator */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">รายการอุปกรณ์</h1>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
          isConnected
            ? 'bg-green-100 text-green-700'  // [8] เชื่อมต่อ
            : 'bg-red-100 text-red-600'      // [9] ออฟไลน์
        }`}>
          {isConnected ? '● เชื่อมต่อแล้ว (Real-time)' : '○ ออฟไลน์'}
        </span>
      </div>

      {/* Equipment grid ... */}
    </main>
  )
}
```

**ทำไมใช้ `useCallback` กับ `handleRealtimeChange`:**
`useEquipmentRealtime` มี `[onStatusChange]` ใน dependency array → ถ้าไม่ wrap ด้วย `useCallback` `handleRealtimeChange` จะสร้างใหม่ทุก render → `useEffect` ใน `useEquipmentRealtime` disconnect + reconnect ซ้ำไม่หยุด (Infinite Loop)

::: code-group
```ts [✅ Vite Proxy — Socket.io ผ่าน port เดียว]
// vite.config.ts — proxy ทั้ง HTTP และ WebSocket
server: {
  proxy: {
    '/api':       'http://localhost:3000',
    '/socket.io': {
      target: 'http://localhost:3000',
      ws: true,  // [1] ต้องเปิด WebSocket proxy ด้วย
    },
  },
}
// Frontend port 5173 → proxy → Backend port 3000
// ไม่มี CORS เพราะ same origin
```
```ts [💡 Object Spread + Override Pattern]
// { ...eq, status: payload.newStatus, borrowedBy: payload.borrowedBy }
// Copy ทุก field จาก eq แล้ว override เฉพาะที่เปลี่ยน
// ไม่ต้อง type field ที่ไม่เปลี่ยน (id, name, category, serialNo, ...)
// TypeScript ตรวจ type ทุก field ที่ override ให้อัตโนมัติ
```
:::

#### 🔷 TypeScript ในบทนี้

- `EquipmentStatusChangedPayload` — interface ของข้อมูลที่ Server emit มาพร้อม Socket event
- `useCallback<(payload: EquipmentStatusChangedPayload) => void>` — Generic type ของ callback function
- Object Spread `{ ...eq, status: newStatus }` — TypeScript ตรวจ type ของ field ที่ override อัตโนมัติ

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง custom React hook ชื่อ `useEquipmentRealtime` ด้วย TypeScript + socket.io-client ที่: 1) รับ `onStatusChange` callback เป็น parameter 2) เชื่อมต่อ Socket.io และรับฟัง event 'equipmentStatusChanged' 3) เข้า room 'equipment-updates' 4) return `isConnected: boolean` 5) disconnect เมื่อ unmount — อธิบายว่าทำไม `onStatusChange` ต้องอยู่ใน dependency array ของ useEffect"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] Backend รันอยู่ที่ port 3000 และ Socket.io ทำงาน
- [ ] vite.config.ts มี `ws: true` ใน proxy สำหรับ `/socket.io`
:::

### 📝 PjBL Lab — ชิ้นงาน: `src/hooks/useEquipmentRealtime.ts`

**เป้าหมาย:** เห็น Real-time update ด้วยตาตนเอง

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสในหน้า EquipmentPage

#### ขั้น 1 — ตรวจสอบ Setup

1. เปิด `src/hooks/useEquipmentRealtime.ts` — อ่าน code ทุกบรรทัดพร้อม comment `[1]-[11]`
2. เปิด `vite.config.ts` — ตรวจว่ามี `ws: true` ใน proxy สำหรับ `/socket.io`
3. รัน Backend + Frontend พร้อมกัน

#### ขั้น 2 — ทดสอบ Real-time

1. Login แล้วเปิด 2 Browser window/tab ที่ URL เดียวกัน
2. ใน window ที่ 1: กดยืมอุปกรณ์
3. ดู window ที่ 2: สีการ์ดต้องเปลี่ยนทันที (ไม่ต้อง refresh) ✅
4. ดู Connection indicator — ต้องแสดง "เชื่อมต่อแล้ว (Real-time)" ✅
5. ปิด Backend → indicator ควรเปลี่ยนเป็น "ออฟไลน์" ✅

#### ขั้น Submit — ส่งงาน

- [ ] ถ่าย video screen หรือ 2 screenshot ของ 2 window ที่ sync กัน
- [ ] ตอบในรายงาน: "ทำไม Socket.io ดีกว่า polling, useCallback ช่วยยังไง"
- [ ] `git commit -m "wk7: understand socket.io realtime pattern"`
- [ ] `git push origin main`
- [ ] เขียนสรุป Google Doc + ลิงก์ GitHub + screenshots

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `handleRealtimeChange` ต้องใช้ `useCallback`?
**แนวคำตอบ:** `useEquipmentRealtime` มี `[onStatusChange]` ใน dependency array ของ useEffect — ถ้าไม่ wrap `handleRealtimeChange` ด้วย `useCallback` มันจะสร้าง function reference ใหม่ทุก render → `useEffect` เห็น dependency เปลี่ยน → disconnect + reconnect Socket.io ใหม่ → render → วนซ้ำ `useCallback` จดจำ function reference ไว้ตลอด (จนกว่า `setEquipments` จะเปลี่ยน) ตัดวงจรนี้ได้
:::

::: details ❓ Socket.io ต่างจาก WebSocket ดั้งเดิมอย่างไร?
**แนวคำตอบ:** WebSocket เป็น low-level protocol ที่รองรับสองทิศทาง แต่ไม่มี features ระดับสูง ส่วน Socket.io สร้างบน WebSocket และเพิ่ม: auto-reconnect (ถ้าเน็ตหลุด), rooms (กลุ่มย่อย), fallback to long-polling (ถ้า WebSocket ไม่รองรับ), event naming ที่อ่านง่าย Socket.io จึงเหมาะ production มากกว่า raw WebSocket
:::

::: details ❓ `{ ...eq, status: payload.newStatus }` ทำงานอย่างไร?
**แนวคำตอบ:** Object Spread `...eq` copy ทุก field จาก `eq` ออกมา แล้ว `status: payload.newStatus` override ค่า field `status` เท่านั้น field อื่น (id, name, category, serialNo, borrowedBy) ยังเป็นค่าเดิม TypeScript ตรวจ type ของ field ที่ override ให้ด้วย ทำให้ปลอดภัยและเขียนสั้นกว่าการ copy ทีละ field
:::

::: details ❓ ทำไมต้องมี cleanup function (`return () => socket.disconnect()`) ใน useEffect?
**แนวคำตอบ:** ถ้าไม่มี cleanup: เมื่อ EquipmentPage unmount (ผู้ใช้ navigate ออก) Socket.io connection ยังคงเปิดอยู่ → Server ยังส่ง event → callback เรียก `setEquipments` ใน component ที่ unmount แล้ว → React warning "memory leak" → อาจทำให้ state ผิดพลาด cleanup `socket.disconnect()` ตัด connection ให้เรียบร้อยเมื่อ component ออกจาก tree
:::

### 🐛 Common Errors

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| Connection indicator ค้างที่ "ออฟไลน์" | ลืมตั้ง `ws: true` ใน vite.config.ts | เพิ่ม `ws: true` ใน `/socket.io` proxy entry |
| Socket reconnect loop ไม่หยุด | `handleRealtimeChange` ไม่ได้ wrap ด้วย `useCallback` | ใช้ `useCallback` กับ callback ที่ส่งเข้า hook |
| UI ไม่อัปเดตแม้ Socket event มา | ลืม call `setEquipments` ใน callback | ตรวจ `onStatusChange` ถูก call และ `setEquipments` อยู่ใน closure |

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Real-time ทำงาน | เห็น update instant จาก 2 window | เชื่อมต่อได้แต่ไม่อัปเดต UI | ไม่ได้ implement |
| Connection indicator | แสดงถูกต้อง online/offline | แสดงบางกรณี | ไม่มี |
| Cleanup | disconnect เมื่อ unmount | - | ไม่มี cleanup (memory leak) |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `WebSocket` | เว็บ-ซ็อค-เก็ต | Protocol สำหรับสื่อสารสองทิศทางระหว่าง Client-Server แบบ persistent |
| `Socket.io` | ซ็อค-เก็ต ไอโอ | Library บน WebSocket เพิ่ม rooms, events, auto-reconnect |
| `Realtime` | เรียล-ไทม์ | อัปเดตข้อมูลทันทีโดยไม่ต้อง refresh หรือ polling |
| `emit` | อี-มิท | ส่ง event จาก Client ไป Server หรือ Server ไป Client |
| `Broadcast` | บรอด-คาสท์ | ส่ง event ไปยัง clients ทุกคนพร้อมกัน |
| `Event` | อี-เวนท์ | สัญญาณที่ส่งระหว่าง client-server ใน Socket.io |
| `Room` | รูม | กลุ่มย่อยของ connections — emit เฉพาะสมาชิกในห้อง |
| `Object Spread` | อ็อบ-เจ็คท์ สเปรด | `{ ...obj, key: value }` — copy object แล้ว override บาง field |
| `Polling` | โพล-ลิง | เช็ค API ซ้ำตามเวลา — ไม่ efficient เท่า WebSocket |
| `Cleanup Function` | คลีน-อัพ ฟังก์-ชัน | ฟังก์ชัน return จาก useEffect — รันเมื่อ component unmount |
