# แผนคะแนน T Score — 21901-2003 การพัฒนาเว็บแอปพลิเคชัน

**ภาคเรียน:** 1/2569  
**มาตรฐาน:** TPQI 10302 ระดับ 3

---

## 📊 ตารางคะแนนรวม

| คะแนน | รายละเอียดงาน | คะแนนที่ได้ |
| :--- | :--- | :---: |
| **T1-1** | ใบงาน: สร้าง Component และ Props (wk1-lab) — สร้าง EquipmentCard Component พร้อม TypeScript Interface และ Status Badge | 5 |
| **T1-2** | ใบงาน: State + Mock Data Array (wk2-lab) — สร้างหน้ารายการอุปกรณ์ด้วย useState, .map(), filter ด้วยปุ่มสถานะ | 5 |
| **T2-1** | ใบงาน: Forms + Tailwind + Validation (wk3-lab) — สร้าง BorrowForm ด้วย Controlled Form, Inline Validation และ Tailwind CSS | 5 |
| **T2-2** | ใบงาน: เชื่อมต่อ API จริง (wk4-lab) — ทำ CRUD อุปกรณ์ผ่าน REST API พร้อม Loading/Error State และ TypeScript Types | 5 |
| **Mid** | Project ประจำวิชา (wk5) — ส่งระบบ CRUD อุปกรณ์ครบวงจร พร้อม Form Validation, API Connection, TypeScript Types และ Commit History | 20 |
| **T3-1** | ใบงาน: Login UI + Auth Flow (wk6-lab) — สร้างหน้า Login ด้วย Tailwind CSS, JWT Authentication, localStorage และ Protected Route | 5 |
| **T3-2** | ใบงาน: Navbar + Role-based Access (wk7-lab) — สร้าง Navbar แสดง Role Badge, Active Link, ซ่อนเมนูตาม Role และทดสอบ Real-time | 5 |
| **T4** | บูรณาการ: Go-Live Simulation (wk8-lab) — Build Production, Full System Test ≥ 8/10 ข้อ และ Demo ต่อผู้ใช้จริง | 10 |
| **T5** | Project Defense (wk9) — นำเสนอโปรเจกต์ระบบเบิก-จ่ายอุปกรณ์ไอทีฉบับสมบูรณ์ ตอบคำถามกรรมการ 15 นาที | 10 |
| **Final** | สอบปฏิบัติปลายภาค 1/2569 (wk9-final-exam) — Code Reading, Code Writing, Conceptual ครอบคลุม wk1-9 | 20 |
| **จิตพิสัย** | พฤติกรรม + มาเรียน — การตรงต่อเวลา, การมีส่วนร่วม, ความรับผิดชอบ, ความร่วมมือ | 10 |
| | **รวมคะแนน** | **100** |

---

## 📝 รายละเอียดแต่ละ T (Criteria / เกณฑ์การให้คะแนน)

### T1-1 — ใบงาน Component และ Props `wk1` (5 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| สร้าง Component | มี Interface + Destructuring + 3 การ์ด | มี Component แต่ขาด TypeScript | ยังไม่ได้สร้าง |
| ทดสอบ TypeScript Error | ลอง error → TS แจ้งถูกต้อง | ลองแต่ไม่เข้าใจผล | ไม่ได้ทดสอบ |
| Status Badge | 3 สีตรงกับสถานะถูกต้อง | มีบางส่วน | ไม่มี Badge |

### T1-2 — ใบงาน State + Mock Data `wk2` (5 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Mock Data ครบ | ข้อมูลครบทุก field, ครบ 3 status | บาง field ขาด | ไม่มี Mock Data |
| Filter ทำงาน | กดปุ่มแล้วกรองถูกต้องทุก status | กรองได้บางส่วน | ไม่มี filter |
| Badge สีถูกต้อง | เขียว/แดง/เหลืองถูกทุกรายการ | มีบางสถานะ | ไม่มี badge |

### T2-1 — ใบงาน Forms + Validation `wk3` (5 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Tailwind + statusConfig | ไม่มี inline style เหลือ, grid responsive ทำงาน | แปลงบางส่วน | ยังใช้ inline style |
| BorrowForm Validation | ตรวจ purpose + date ถูกต้อง, error แสดงชัดเจน | ตรวจแค่บางส่วน | ไม่มี validation |
| Inline BorrowForm flow | กด-กรอก-ยืนยัน-การ์ดเปลี่ยน flow ครบ | flow ทำงานบางส่วน | BorrowForm ไม่ integrate |

### T2-2 — ใบงาน API Connect + CRUD `wk4` (5 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| API เชื่อมได้ | GET + PATCH ทำงาน เห็นใน Network tab | GET ได้แต่ PATCH ไม่ได้ | ยังใช้ mock data |
| Loading/Error UI | 3 states แสดงถูกต้องทุกกรณี | แสดงบางส่วน | ไม่มี state UI |
| TypeScript types | types/index.ts ครบ ไม่มี `any` | มีบางส่วน | ไม่มี types file |

### Mid — Project ประจำวิชา `wk5` (20 คะแนน)

| เกณฑ์ | ดีมาก (8-10) | พอใช้ (4-7) | ปรับปรุง (0-3) |
| :--- | :--- | :--- | :--- |
| Components (10) | EquipmentCard + EquipmentPage + Navbar ครบ ทำงานได้ | มีบางส่วน หรือ error เล็กน้อย | ขาด component หลัก |
| TypeScript (10) | Interface/Type ถูกต้อง ไม่มี `any` เลย | มี `any` 1-2 จุด หรือ type ไม่ครบ | ไม่ใช้ TypeScript / error มาก |
| Tailwind CSS (10) | UI สวยงาม + responsive ทุกขนาด | UI พอใช้ ไม่ responsive | ไม่ใช้ Tailwind / UI ใช้ไม่ได้ |
| API Connect (10) | ดึงข้อมูลจริงได้ + loading + error state | ดึงได้บางส่วน / ไม่มี loading | ไม่เชื่อมต่อ API |
| Presentation (10) | อธิบาย code ได้ชัดเจน ตอบคำถามได้ | อธิบายได้บางส่วน | อ่าน code ไม่ออก |

### T3-1 — ใบงาน Login UI + Auth Flow `wk6` (5 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| UI สมบูรณ์ | Tailwind ครบ, error msg, loading state | แสดงได้แต่ styling ไม่ครบ | ไม่มี form |
| Auth Flow | login → persist → logout + ทุก case ผ่าน | login ได้แต่ไม่ persist | ไม่ทำงาน |
| Network Tab | เห็น Authorization header ถูกต้อง | เห็น request แต่ไม่มี header | ไม่ได้ตรวจ |

### T3-2 — ใบงาน Navbar + Role-based Access `wk7` (5 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Navbar สมบูรณ์ | Active link + role badge + logout ทำงานครบ | บางส่วนขาด | ไม่มี Navbar |
| Role-based menu | admin/teacher เห็นจัดการ, student ไม่เห็น | ทำงานบางกรณี | ไม่มี |
| Complete auth flow | login → persist → role → real-time → logout | บางขั้นตอนขาด | ไม่ทำงาน |

### T4 — บูรณาการ: Go-Live Simulation `wk8` (10 คะแนน)

| เกณฑ์ | ดีมาก (3-4) | พอใช้ (1-2) | ปรับปรุง (0) |
| :--- | :--- | :--- | :--- |
| Build ผ่าน | 0 TypeScript errors + build สำเร็จ | มี warning แต่ build ผ่าน | build ไม่ผ่าน |
| Full System Test | ผ่าน ≥ 8/10 + บันทึก bug ครบ | ผ่าน 5-7/10 | < 5/10 |
| Demo | นำเสนอได้ครบตาม script + demo real-time | นำเสนอได้บางส่วน | ไม่ได้ demo |

### T5 — Project Defense `wk9` (10 คะแนน)

| เกณฑ์ | ดีมาก (5) | พอใช้ (3) | ปรับปรุง (0-1) |
| :--- | :--- | :--- | :--- |
| Demo ครบถ้วน | ทุก feature ทำงาน ภายใน 5 นาที | บางส่วนขาด / เกินเวลา | Demo ไม่ได้ |
| อธิบาย Technical Stack | อธิบายพร้อมเหตุผล "ทำไม" | อธิบายได้แค่ "อะไร" | อธิบายไม่ได้ |
| ตอบคำถาม | ตอบได้ทุกคำถาม จากความเข้าใจ | ตอบได้บางส่วน | ตอบไม่ได้ |
| Code Quality | 0 TS errors + clean code | บาง warning | มี error |

### Final — สอบปฏิบัติปลายภาค 1/2569 `wk9` (20 คะแนน)

| ส่วน | น้ำหนัก | เกณฑ์ |
| :--- | :---: | :--- |
| Code Reading | 30% | อ่าน code + อธิบาย comment + ตอบคำถามถูกต้อง |
| Code Writing | 40% | เขียน TypeScript + logic ถูกต้อง ทำงานได้จริง |
| Conceptual | 30% | อธิบาย concept ด้วยภาษาธรรมชาติ + ยกตัวอย่างได้ |

### จิตพิสัย — พฤติกรรม + มาเรียน (10 คะแนน)

| เกณฑ์ | รายละเอียด | คะแนน |
| :--- | :--- | :---: |
| การมาเรียน | เข้าเรียนครบตามตาราง ตรงต่อเวลา | 5 |
| พฤติกรรมในชั้นเรียน | มีส่วนร่วม ความรับผิดชอบ ความร่วมมือ ไม่รบกวนผู้อื่น | 5 |

---

## 🗓️ ปฏิทิน T Score

| T | Module | สัปดาห์ | คะแนน |
| :--- | :--- | :---: | :---: |
| T1-1 | Component + Props (wk1-lab) | 1-2 | 5 |
| T1-2 | State + Mock Data (wk2-lab) | 3-4 | 5 |
| T2-1 | Forms + Tailwind + Validation (wk3-lab) | 5-6 | 5 |
| T2-2 | API Connect + CRUD (wk4-lab) | 7-8 | 5 |
| **Mid** | **Project ประจำวิชา** | **9** | **20** |
| T3-1 | Login UI + Auth Flow (wk6-lab) | 10-12 | 5 |
| T3-2 | Navbar + Role-based Access (wk7-lab) | 13-14 | 5 |
| T4 | Go-Live Simulation (wk8-lab) | 15-16 | 10 |
| T5 | Project Defense (wk9) | 17-18 | 10 |
| **Final** | **สอบปฏิบัติปลายภาค** | **17-18** | **20** |
| **จิตพิสัย** | **พฤติกรรม + มาเรียน** | ตลอดภาค | **10** |
| | **รวม** | | **100** |
