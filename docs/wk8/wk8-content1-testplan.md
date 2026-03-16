# แผนการทดสอบระบบ (Test Plan) <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ใกล้เสร็จแล้ว — แต่ก่อน go-live ต้องทดสอบให้ครอบคลุม ทั้ง happy path (ทุกอย่างถูกต้อง) และ edge case (ข้อมูลผิด/network หาย) ถ้าไม่มีแผนทดสอบอาจพลาด bug สำคัญที่ทำให้ระบบพังต่อหน้าผู้ใช้จริง!
:::

> 💡 **เปรียบเทียบ:** Test Plan เหมือน "checklist ก่อนบิน" ของนักบิน — ตรวจทุกระบบตามลำดับก่อนออกเดินทาง ไม่ใช่บินแล้วค่อยเช็คในอากาศ

---

## 📖 I: Information

### ขั้นตอนที่ 1 — ทำความเข้าใจประเภทและระดับของการทดสอบระบบ

ก่อนที่ระบบจะถูกปล่อยออกไปให้ผู้ใช้งานจริงสัมผัส (Go-Live) สิ่งที่ขาดไม่ได้เลยคือ "กระบวนการทดสอบ (Testing)" ซึ่งเปรียบเสมือนด่านตรวจคุณภาพสุดท้ายเพื่อป้องกันความผิดพลาดระดับรุนแรง การทดสอบที่ดีไม่ได้มีแค่การตรวจว่าระบบ "ทำงานได้" แต่รวมถึงการตรวจว่าเมื่อพบ "ข้อมูลขยะ" หรือสิ่งที่ไม่คาดฝัน ระบบ "รับมือได้หรือไม่"

ในวงการพัฒนาซอฟต์แวร์ เราแบ่งสเกลหรือระดับของการทดสอบออกเป็นหลายระดับ เพื่อให้ครอบคลุมทั้งในระดับจุดย่อยที่สุดไปจนถึงภาพรวมทั้งระบบที่เชื่อมต่อกัน:

| ประเภท | คืออะไร | ตัวอย่าง |
| :--- | :--- | :--- |
| **Unit Test** | ทดสอบ function เดียว | `getEquipments()` return array |
| **Integration Test** | ทดสอบหลาย component ร่วมกัน | Login → เห็น Navbar |
| **E2E Test** | ทดสอบเหมือนผู้ใช้จริง | Click ยืม → API call → UI update |
| **Manual Test** | ทดสอบด้วยมือตาม checklist | กรอกฟอร์ม, ดู Network tab |

**โปรเจกต์นี้ใช้:** Manual Testing ด้วย Browser DevTools — เหมาะกับ project ขนาดเล็ก เริ่มเรียนรู้กระบวนการก่อน Automated Testing

---

### ขั้นตอนที่ 2 — Test Case Tables (4 Module)

#### Module 1: Authentication

| Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| Login ถูกต้อง | admin@school.ac.th / password123 | redirect ไป /, เห็น Navbar | ⬜ |
| Login ผิดรหัสผ่าน | admin@school.ac.th / wrong | แสดง error message | ⬜ |
| Login ผิด email | notexist@test.com / pass | แสดง error message | ⬜ |
| Refresh หลัง login | F5 ขณะ login อยู่ | ยังอยู่ใน session (ไม่ถูก logout) | ⬜ |
| Logout | กด "ออกจากระบบ" | redirect /login, localStorage ว่าง | ⬜ |

#### Module 2: Equipment List

| Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| โหลดรายการ | เปิดหน้า / | เห็นรายการอุปกรณ์จาก Backend | ⬜ |
| Backend ไม่ตอบ | ปิด Backend server | แสดง error message | ⬜ |
| ไม่มีอุปกรณ์ | ลบทั้งหมดจาก DB | แสดง "ยังไม่มีอุปกรณ์" | ⬜ |
| Loading state | Network throttle "Slow 3G" | แสดง "กำลังโหลดข้อมูล..." | ⬜ |

#### Module 3: Borrow / Return

| Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| ยืมอุปกรณ์ว่าง | กดยืม + กรอกข้อมูล | สถานะเปลี่ยนเป็น "ถูกยืม" | ⬜ |
| ยืมโดยไม่กรอก purpose | กดยืนยันทันที | แสดง validation error | ⬜ |
| คืนอุปกรณ์ | กด "คืนอุปกรณ์" | สถานะเปลี่ยนเป็น "ว่าง" | ⬜ |
| Real-time update | ยืมจาก tab อื่น | อีก tab เห็นการเปลี่ยนแปลงทันที | ⬜ |

#### Module 4: Admin Functions

| Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| เข้า /admin (admin) | Login เป็น admin | เข้าได้ เห็น stats cards | ⬜ |
| เข้า /admin (student) | Login เป็น student | 403 Forbidden | ⬜ |
| เพิ่มอุปกรณ์ใหม่ | กรอกครบ 3 field | อุปกรณ์ปรากฏในตาราง | ⬜ |
| เพิ่มซ้ำ Serial No. | serialNo ที่มีอยู่แล้ว | แสดง error | ⬜ |
| ลบอุปกรณ์ว่าง | กด "ลบ" | รายการหายออกจากตาราง | ⬜ |

---

### ขั้นตอนที่ 3 — TypeScript: Computed Counts Pattern

```tsx [src/pages/AdminPage.tsx — countByStatus]
// [1] คำนวณ stats จาก array ที่มีอยู่แล้ว — ไม่ต้อง API call เพิ่ม
const countByStatus = {
  total:       equipments.length,                                    // [2] นับทั้งหมด
  available:   equipments.filter(e => e.status === 'available').length,   // [3] กรองเฉพาะว่าง
  borrowed:    equipments.filter(e => e.status === 'borrowed').length,    // [4] กรองเฉพาะถูกยืม
  maintenance: equipments.filter(e => e.status === 'maintenance').length, // [5] กรองเฉพาะซ่อม
}

// [6] Stats Cards — 4 cards ใน grid
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
  <div className="bg-white rounded-xl border p-4 text-center shadow-sm">
    <p className="text-3xl font-extrabold text-blue-600">{countByStatus.total}</p>
    <p className="text-xs text-slate-500 mt-1">ทั้งหมด</p>
  </div>
  <div className="bg-white rounded-xl border p-4 text-center shadow-sm">
    <p className="text-3xl font-extrabold text-green-600">{countByStatus.available}</p>
    <p className="text-xs text-slate-500 mt-1">ว่าง</p>           {/* [7] */}
  </div>
  <div className="bg-white rounded-xl border p-4 text-center shadow-sm">
    <p className="text-3xl font-extrabold text-red-600">{countByStatus.borrowed}</p>
    <p className="text-xs text-slate-500 mt-1">ถูกยืม</p>
  </div>
  <div className="bg-white rounded-xl border p-4 text-center shadow-sm">
    <p className="text-3xl font-extrabold text-yellow-600">{countByStatus.maintenance}</p>
    <p className="text-xs text-slate-500 mt-1">ซ่อมบำรุง</p>
  </div>
</div>
```

**สรุปการทำงาน:** `equipments` array `[1]` มาจาก `useEquipments` hook → `.filter()` `[3-5]` กรองตาม status → `.length` นับ → แสดงใน Stats Cards `[6]` — คำนวณ derived state จาก state ที่มีอยู่แล้ว ไม่ต้อง fetch เพิ่ม

::: code-group
```tsx [✅ Computed from State — ไม่ต้อง fetch เพิ่ม]
// countByStatus คำนวณจาก equipments ที่ useState เก็บอยู่แล้ว
// เมื่อ equipments อัปเดต → countByStatus คำนวณใหม่อัตโนมัติ ✅
const countByStatus = {
  total:     equipments.length,
  available: equipments.filter(e => e.status === 'available').length,
}
```

```tsx [❌ State แยก — sync ยาก]
// ❌ ถ้าเก็บ count แยก useState จะ sync ยาก
const [total, setTotal] = useState(0)
const [available, setAvailable] = useState(0)
// ต้อง update ทั้งหมดทุกครั้งที่ equipments เปลี่ยน — prone to bugs
```

```tsx [💡 Edge Cases ที่ต้องทดสอบ]
// Empty state — ไม่มีอุปกรณ์เลย
equipments.length === 0 → countByStatus.total === 0 ✅

// All borrowed
// ทุกตัว status === 'borrowed'
countByStatus.available === 0 ✅

// Status ผิด (ไม่อยู่ใน union type)
// TypeScript ป้องกัน — 'available' | 'borrowed' | 'maintenance' เท่านั้น ✅
```
:::

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง test plan checklist สำหรับ React web application ระบบเบิก-จ่ายอุปกรณ์ รวม test case สำหรับ: authentication (login/logout/persist), รายการอุปกรณ์ (load/error/empty/loading), การยืม/คืน (happy path + edge case) และ admin CRUD จัดรูปแบบเป็น markdown table มีคอลัมน์ Test Case, Input, Expected Output และ Status อธิบายความต่างระหว่าง happy path กับ edge case ด้วย"
:::

### 📝 PjBL Lab

**เป้าหมาย:** ทดสอบระบบครบทุก module ตาม Test Plan และบันทึกผล

---

#### ขั้น 0 — Student Identity

เพิ่ม `<footer>` ชื่อ-รหัสในหน้า AdminPage หรือ EquipmentPage:

```tsx
<footer style={{ marginTop: 40, borderTop: '1px solid #eee', paddingTop: 12, color: '#aaa', fontSize: 12 }}>
  จัดทำโดย: ชื่อ-นามสกุล · รหัสนักเรียน
</footer>
```

---

#### ขั้น 1 — เตรียม Backend + ดาวน์โหลด Test Plan

```bash
cd project/backend
npm run dev       # Backend รันที่ port 3000
# ถ้าฐานข้อมูลว่าง: npx prisma db push && npm run db:seed
```

- [ ] สร้างไฟล์ `test-plan.md` — copy test case tables จากด้านบน
- [ ] เปิด DevTools → Application → Local Storage ไว้ติดตามขณะทดสอบ

---

#### ขั้น 2 — ทดสอบ Module 1: Authentication

- [ ] Login ด้วย admin@school.ac.th / password123 → ต้องเห็น Navbar + badge "ผู้ดูแล"
- [ ] Login ด้วย password ผิด → ต้องเห็น error message บนหน้า
- [ ] กด F5 ขณะ login → ต้องยังอยู่ใน session (ไม่ถูก redirect ไป /login)
- [ ] กด Logout → localStorage ต้องว่าง + redirect ไป /login

ทำเครื่องหมาย ✅ หรือ ❌ ในไฟล์ test-plan.md

---

#### ขั้น 3 — ทดสอบ Module 2: Equipment List

1. DevTools → Network → ตั้ง Throttle เป็น "Slow 3G"
2. Refresh หน้า → ต้องเห็น loading state

- [ ] ปิด Backend server → เปิดหน้า / → ต้องเห็น error message
- [ ] เปิด Backend กลับ → Refresh → รายการปรากฏตามปกติ

---

#### ขั้น 4 — ทดสอบ Module 3 + 4

- [ ] ยืมอุปกรณ์โดยไม่กรอก purpose → ต้องเห็น validation error
- [ ] เปิด 2 tab → ยืมจาก tab 1 → tab 2 ต้องเห็นการเปลี่ยนแปลงทันที (Real-time)
- [ ] Login เป็น student → พิมพ์ URL `/admin` ตรง → ต้องเห็นหน้า 403
- [ ] Login เป็น admin → เพิ่มอุปกรณ์ใหม่ → ปรากฏในตาราง

---

#### ขั้น Submit — ส่งงาน

- [ ] ทำ test-plan.md ครบทุก test case (✅ หรือ ❌) + บันทึก bug ที่พบ
- [ ] `git add test-plan.md`
- [ ] `git commit -m "wk8: complete test plan with all module results"`
- [ ] `git push origin main`
- [ ] เขียนสรุปใน Google Doc: test case ไหนผ่าน/ไม่ผ่าน, bug ที่พบคืออะไร, แก้อย่างไร

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Test Plan ต้องมีทั้ง happy path และ edge case?
**แนวคำตอบ:** Happy path ทดสอบว่าระบบทำงานได้ตามปกติ แต่ bug ส่วนใหญ่เกิดที่ edge case — ข้อมูลผิดรูปแบบ, network หาย, ผู้ใช้กดปุ่มซ้ำ ฯลฯ การทดสอบแค่ happy path ทำให้ระบบพังเมื่อเจอสถานการณ์จริง เช่น ถ้าไม่ทดสอบ "Login ผิดรหัส" อาจไม่รู้ว่า error message ไม่แสดงเลย
:::

::: details ❓ Manual Test ต่างจาก Automated Test อย่างไร — ควรใช้อันไหน?
**แนวคำตอบ:** Manual Test ทำโดยมนุษย์ตาม checklist — ยืดหยุ่นกว่า เหมาะกับ UI/UX testing และ exploratory testing แต่ใช้เวลามากและพลาดได้ง่ายเมื่อทดสอบซ้ำ Automated Test เขียนโค้ด (Jest, Cypress, Playwright) รันซ้ำได้อัตโนมัติ เหมาะกับ regression testing แต่ต้องลงทุนเขียนก่อน — สำหรับโปรเจกต์นี้ใช้ Manual เพื่อเข้าใจ concept ก่อน
:::

::: details ❓ `equipments.filter(e => e.status === 'available').length` — ทำไมไม่เก็บไว้ใน useState แยก?
**แนวคำตอบ:** ถ้าเก็บ count แยกใน useState ต้องอัปเดต 2 state พร้อมกันทุกครั้งที่ equipments เปลี่ยน → ง่ายต่อการลืมอัปเดตตัวหนึ่ง → state ไม่ sync กัน → bug ซ่อนตัว ส่วน computed value ที่คำนวณจาก equipments โดยตรงจะ sync อัตโนมัติทุก render หลักการ: **อย่าเก็บ state ที่คำนวณจาก state อื่นได้**
:::

::: details ❓ Status ⬜ ในตาราง Test Case หมายถึงอะไร — แทนด้วยอะไรเมื่อทดสอบ?
**แนวคำตอบ:** ⬜ = ยังไม่ได้ทดสอบ → เมื่อทดสอบแล้ว: ✅ = ผ่าน (Expected Output ตรงกัน), ❌ = ไม่ผ่าน (พฤติกรรมต่างจากที่คาด) → สำหรับกรณีที่ ❌ ต้องบันทึก: สิ่งที่เกิดจริง + ขั้นตอน reproduce + ไฟล์/บรรทัดที่น่าจะเป็นสาเหตุ
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Test Plan ครบ | ครอบคลุมทุก module + edge case | บาง module ขาด | ไม่มี test plan |
| ทดสอบตาม plan | ผ่านทุก test case ✅ | ผ่านบางส่วน | ไม่ได้ทดสอบ |
| บันทึก bugs | พบ bug + reproduce steps ครบ | พบ bug แต่ไม่มี steps | ไม่บันทึก |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Test Plan` | เอกสารกำหนดว่าจะทดสอบอะไร อย่างไร และคาดหวังผลอะไร |
| `Happy Path` | กรณีที่ทุกอย่างถูกต้อง — ผู้ใช้ทำตาม "เส้นทางปกติ" |
| `Edge Case` | กรณีที่อยู่ที่ "ขอบ" ของ input — ค่าผิดปกติหรือสถานการณ์พิเศษ |
| `Regression Test` | ทดสอบซ้ำหลังแก้ bug เพื่อให้แน่ใจว่าไม่พังส่วนอื่น |
| `Reproduce` | ทำซ้ำ bug ได้ตามขั้นตอนที่กำหนด |
| `Computed Value` | ค่าที่คำนวณจาก state อื่น — ไม่ต้องเก็บใน useState แยก |
| `Unit Test` | ทดสอบ function เดียวแยกจากส่วนอื่น |
| `E2E Test` | End-to-End — ทดสอบทั้งระบบเหมือนผู้ใช้จริง |
