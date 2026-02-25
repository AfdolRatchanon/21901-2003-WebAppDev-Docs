# แผนการทดสอบระบบ (Test Plan) <Badge type="info" text="TPQI 10302" />

## 🎯 M: Motivation

::: danger 🚨 ปัญหาจากโปรเจกต์ (PjBL Hook)
ระบบเบิก-จ่ายอุปกรณ์ใกล้เสร็จแล้ว — แต่ก่อน go-live ต้องทดสอบให้ครอบคลุม ทั้ง happy path (ทุกอย่างถูกต้อง) และ edge case (ข้อมูลผิด/network หาย) ถ้าไม่มีแผนทดสอบอาจพลาด bug สำคัญ!
:::

> 💡 **เปรียบเทียบ:** Test Plan เหมือน "checklist ก่อนบิน" ของนักบิน — ตรวจทุกระบบตามลำดับก่อนออกเดินทาง ไม่ใช่บินแล้วค่อยเช็คในอากาศ

---

## 📖 I: Information

### ประเภทการทดสอบ

| ประเภท | คืออะไร | ตัวอย่าง |
| :--- | :--- | :--- |
| **Unit Test** | ทดสอบ function เดียว | `getEquipments()` return array |
| **Integration Test** | ทดสอบหลาย component ร่วมกัน | Login → เห็น Navbar |
| **E2E Test** | ทดสอบเหมือนผู้ใช้จริง | Click ยืม → API call → UI update |
| **Manual Test** | ทดสอบด้วยมือตาม checklist | กรอกฟอร์ม, ดู Network tab |

### Test Plan: ระบบเบิก-จ่ายอุปกรณ์

#### Module 1: Authentication

| Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| Login ถูกต้อง | admin@school.ac.th / admin123 | redirect ไป /, เห็น Navbar | ⬜ |
| Login ผิดรหัสผ่าน | admin@school.ac.th / wrong | แสดง error message | ⬜ |
| Login ผิด email | notexist@test.com / pass | แสดง error message | ⬜ |
| Refresh หลัง login | - | ยังอยู่ใน session | ⬜ |
| Logout | กด "ออกจากระบบ" | redirect /login, clear localStorage | ⬜ |

#### Module 2: Equipment List

| Test Case | Input | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| โหลดรายการ | เปิดหน้า / | เห็นรายการอุปกรณ์จาก Backend | ⬜ |
| Backend ไม่ตอบ | ปิด Backend | แสดง error message | ⬜ |
| ไม่มีอุปกรณ์ | ลบทั้งหมด | แสดง "ยังไม่มีอุปกรณ์" | ⬜ |
| Loading state | Network throttle | แสดง "กำลังโหลดข้อมูล..." | ⬜ |

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

### TypeScript: Computed Counts Pattern

```tsx [AdminPage.tsx — countByStatus]
// นับจำนวนอุปกรณ์ตามสถานะ — TypeScript ตรวจสอบ key ให้
const countByStatus = {
  total:       equipments.length,
  available:   equipments.filter(e => e.status === 'available').length,
  borrowed:    equipments.filter(e => e.status === 'borrowed').length,
  maintenance: equipments.filter(e => e.status === 'maintenance').length,
}

// Stats Cards
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
  <div className="bg-white rounded-xl border p-4 text-center shadow-sm">
    <p className="text-3xl font-extrabold text-blue-600">{countByStatus.total}</p>
    <p className="text-xs text-slate-500 mt-1">ทั้งหมด</p>
  </div>
  {/* ... available, borrowed, maintenance cards */}
</div>
```

---

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ถาม AI
"สร้าง test plan checklist สำหรับ React web application ระบบเบิก-จ่ายอุปกรณ์ รวม test case สำหรับ: authentication (login/logout), รายการอุปกรณ์ (load/error/empty), การยืม/คืน และ admin CRUD จัดรูปแบบเป็น markdown table มีคอลัมน์ Test Case, Input, Expected Output และ Status"
:::

### 📝 PjBL Lab

- [ ] ดาวน์โหลด Test Plan template ด้านบนเป็นไฟล์ Markdown
- [ ] ทดสอบแต่ละ test case และทำเครื่องหมาย ✅ / ❌
- [ ] สำหรับ test ที่ ❌ — บันทึก bug และขั้นตอน reproduce
- [ ] ทดสอบ responsive: เปิดในมือถือ (DevTools → Device Mode)
- [ ] ทดสอบ Network throttle: ตั้ง "Slow 3G" แล้วทดสอบ loading states

---

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไม Test Plan ต้องมีทั้ง happy path และ edge case?
**แนวคำตอบ:** Happy path ทดสอบว่าระบบทำงานได้ตามปกติ แต่ bug ส่วนใหญ่เกิดที่ edge case — ข้อมูลผิดรูปแบบ, network หาย, ผู้ใช้กดปุ่มซ้ำ ฯลฯ การทดสอบแค่ happy path ทำให้ระบบพังเมื่อเจอสถานการณ์จริง
:::

::: details ❓ Manual Test ต่างจาก Automated Test อย่างไร?
**แนวคำตอบ:** Manual Test ทำโดยมนุษย์ตาม checklist — ยืดหยุ่นกว่า เหมาะกับ UI/UX testing แต่ใช้เวลามาก Automated Test เขียนโค้ด (เช่น Jest, Cypress) รันซ้ำได้เร็ว เหมาะกับ regression testing แต่ต้องลงทุนเขียนก่อน
:::

### 📋 Rubric (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Test Plan ครบ | ครอบคลุมทุก module + edge case | บาง module ขาด | ไม่มี test plan |
| ทดสอบตาม plan | ผ่านทุก test case | ผ่านบางส่วน | ไม่ได้ทดสอบ |
| บันทึก bugs | พบ bug + reproduce steps | พบ bug แต่ไม่มี steps | ไม่บันทึก |

---

### 📚 CLIL Vocabulary

| Technical Term | Meaning in Context |
| :--- | :--- |
| `Test Plan` | เอกสารกำหนดว่าจะทดสอบอะไร อย่างไร และคาดหวังผลอะไร |
| `Happy Path` | กรณีที่ทุกอย่างถูกต้อง — ผู้ใช้ทำตาม "เส้นทางปกติ" |
| `Edge Case` | กรณีที่อยู่ที่ "ขอบ" ของ input — ค่าผิดปกติหรือสถานการณ์พิเศษ |
| `Regression Test` | ทดสอบซ้ำหลังแก้ bug เพื่อให้แน่ใจว่าไม่พังส่วนอื่น |
| `Reproduce` | ทำซ้ำ bug ได้ตามขั้นตอนที่กำหนด |
