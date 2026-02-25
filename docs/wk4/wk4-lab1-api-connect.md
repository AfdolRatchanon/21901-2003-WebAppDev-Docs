# Lab: เชื่อมต่อ API จริง <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบที่สร้างใน wk1-3 ยังใช้ Mock Data — อุปกรณ์ที่แสดงอยู่ใน Browser ของนักเรียนแต่ละคนไม่เชื่อมกัน ต้องเปลี่ยนมาดึงข้อมูลจาก Backend จริงให้ทุกคนเห็นสถานะเดียวกัน!
:::

> 💡 **เป้าหมาย Lab นี้:** เปลี่ยนจาก `mockEquipments` → `getEquipments()` จาก Backend จริง พร้อม Loading / Error handling

---

## 📖 I: Information

### ภาพรวม Flow ข้อมูล

```
Browser                  Vite Proxy              Backend (localhost:3000)
   │                         │                         │
   │── GET /api/equipments ──▶│── forward ────────────▶│
   │                         │                         │── query MySQL
   │                         │                         │◀─ Equipment[]
   │◀─── { success, data } ──│◀──────────────────────-│
   │
   │  apiClient.get()     res.data.data
   │  → ApiResponse       → Equipment[]
```

### API Functions ที่สร้างไว้

::: code-group
```ts [api/equipmentApi.ts]
import { apiClient } from './config'
import type { Equipment, ApiResponse, EquipmentFormData } from '../types'

const ENDPOINT = '/api/equipments'

// GET /api/equipments
export async function getEquipments(): Promise<Equipment[]> {
  const res = await apiClient.get<ApiResponse<Equipment[]>>(ENDPOINT)
  return res.data.data  // unwrap: { success: true, data: [...] }
}

// POST /api/equipments — เพิ่มอุปกรณ์ใหม่
export async function createEquipment(
  payload: EquipmentFormData
): Promise<Equipment> {
  const res = await apiClient.post<ApiResponse<Equipment>>(ENDPOINT, payload)
  return res.data.data
}

// PATCH /api/equipments/:id — อัปเดตสถานะ (ยืม/คืน/ซ่อม)
export async function updateEquipmentStatus(
  id: number,
  status: Equipment['status'],
  borrowedBy?: string
): Promise<Equipment> {
  const res = await apiClient.patch<ApiResponse<Equipment>>(
    `${ENDPOINT}/${id}`,
    { status, borrowedBy: borrowedBy ?? null }
  )
  return res.data.data
}

// DELETE /api/equipments/:id
export async function deleteEquipment(id: number): Promise<void> {
  await apiClient.delete(`${ENDPOINT}/${id}`)
}
```

```ts [src/types/index.ts (ส่วน API)]
// Response wrapper จาก Backend
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

// Form data สำหรับเพิ่มอุปกรณ์ใหม่
export interface EquipmentFormData {
  name: string
  category: string
  serialNo: string
}
```
:::

### เปรียบเทียบ: Mock Data vs API จริง

```tsx
// ❌ wk2: ใช้ Mock Data (ข้อมูลอยู่ใน Browser เท่านั้น)
const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments)

// ✅ wk4: ใช้ useEquipments hook ที่ดึงจาก Backend
const { equipments, isLoading, error, refetch } = useEquipments()
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"มี Axios client อยู่ที่ `src/api/config.ts` แล้ว ต้องการสร้าง `src/api/equipmentApi.ts` ที่มีฟังก์ชัน TypeScript ดังนี้: `getEquipments()`, `createEquipment(payload)`, `updateEquipmentStatus(id, status, borrowedBy?)`, `deleteEquipment(id)` โดย API คืนค่าในรูปแบบ `{ success: boolean, data: T }` ใช้ generics"
:::

### 📝 PjBL Lab — เชื่อมต่อทีละขั้น

**ขั้น 1: เตรียม Backend**
```bash
cd project/backend
npm install
npx prisma db push
npm run db:seed
npm run dev
# ✅ Server รันที่ port 3000
```

**ขั้น 2: ทดสอบ API ก่อน**
```bash
# ทดสอบว่า Backend ตอบ
curl http://localhost:3000/api/equipments
# ควรได้: { "success": true, "data": [...] }
```

**ขั้น 3: เชื่อม Frontend**
- [ ] สร้าง `src/api/config.ts` พร้อม Axios instance + interceptors
- [ ] สร้าง `src/api/equipmentApi.ts` มีครบ 4 ฟังก์ชัน
- [ ] อัปเดต `useEquipments.ts` ให้เรียก `getEquipments()` แทน Mock Data
- [ ] เพิ่ม Loading state และ Error state ใน UI

**ขั้น 4: ทดสอบ Network tab**
- [ ] เปิด DevTools → Network tab → filter "Fetch/XHR"
- [ ] โหลดหน้า — ต้องเห็น `GET /api/equipments` status 200
- [ ] กดยืมอุปกรณ์ — ต้องเห็น `PATCH /api/equipments/:id`
- [ ] ดู Response body — ต้องมี `{ "success": true, "data": {...} }`

**ขั้น 5: ทดสอบ Error Handling**
- [ ] ปิด Backend แล้วโหลดหน้าใหม่ — ต้องแสดง error message ใน UI
- [ ] เปิด Backend กลับมา — กด refresh ข้อมูลควรกลับมา

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม `res.data.data` ถึงมีสอง `.data`?
**แนวคำตอบ:** `res` คือ Axios response object — `res.data` คือ body ที่ Backend ส่งมาซึ่งมีรูปแบบ `{ success, data }` ส่วน `res.data.data` คือ array ข้อมูลจริงที่อยู่ใน field `data` ของ body จึงต้อง `.data` สองครั้ง
:::

::: details ❓ Vite proxy คืออะไร ทำไมต้องใช้?
**แนวคำตอบ:** Vite proxy ทำให้ request ไปที่ `/api/...` จาก Frontend (port 5173) ถูก forward ไปยัง Backend (port 3000) อัตโนมัติ — ป้องกัน CORS error และไม่ต้อง hardcode URL ของ Backend ลงใน code
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| API เชื่อมได้ | ดึงจาก backend จริง เห็นใน Network tab | ดึงได้แต่ error บางกรณี | ยังใช้ mock data |
| CRUD ครบ | GET + PATCH ทำงานได้ | GET อย่างเดียว | ไม่มี |
| Error UI | แสดง error message เมื่อ backend ไม่ตอบ | มีแต่ไม่แสดงใน UI | ไม่มี error handling |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `CRUD` | Create, Read, Update, Delete — 4 operations พื้นฐานของ API |
| `CORS` | Cross-Origin Resource Sharing — นโยบาย Browser ป้องกัน request ข้าม domain |
| `Proxy` | ตัวกลาง forward request — Vite proxy ส่ง /api → localhost:3000 |
| `Network tab` | เครื่องมือใน DevTools แสดง HTTP requests ทั้งหมด |
| `Status 200` | HTTP response code แปลว่า "สำเร็จ" |
