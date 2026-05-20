# patten.md — แผน VitePress worldskill 2026 web technologies

ไฟล์นี้เก็บข้อตกลงและแผนการสร้างเอกสาร VitePress
อัปเดตทุกครั้งที่มีการเปลี่ยนแผน ก่อน Claude เริ่มลงมือทำ

## วัตถุประสงค์

สร้างเอกสาร VitePress สำหรับสอนนักเรียน **ปวช./ปวส. สำหรับแข่งขัน WorldSkill Web Technologies**
ให้สามารถ **สร้าง backend จากศูนย์** ได้ด้วยตัวเองแบบ step by step
นักเรียน **ไม่มี** โฟลเดอร์ backend ให้ดู — ต้องพิมพ์โค้ดตาม docs จนได้ backend ที่รันได้จริง
โค้ดอ้างอิงจริงอยู่ที่ `backend/` (ไม่รวม `backend/database/` เพราะกรรมการเตรียมให้)

## ที่ตั้งไฟล์

- VitePress project: `worldskill-2026-web-tech-docs/`
- ไฟล์วางแผนนี้: `patten.md` (ที่ root ของโปรเจ็ค)

## บริบทการแข่งขัน (สำคัญมาก)

- **สภาพแวดล้อม:** ห้องแข่งขัน ไม่มี internet ไม่มี VS Code extension
- **เครื่องมือที่ใช้ได้:** VS Code (เปล่าๆ), Terminal/Command Line, Postman
- **การสอน MariaDB/Database:** ผ่าน Command Line เท่านั้น
- **VS Code:** ห้ามสอนให้ลง extension ใดๆ ทั้งสิ้น
- **นักเรียน:** ปวช./ปวส. ที่เตรียมแข่ง WorldSkill สาขา Web Technologies
- **เป้าหมาย:** นักเรียนพิมพ์โค้ดตาม docs แล้วได้ backend ที่รันได้ครบถ้วน
- **Database/Schema:** กรรมการเตรียมไฟล์ .sql ให้ — นักเรียนใช้คำสั่ง import เข้าไปได้เลย

## หลักการสอน (สำคัญมาก)

### 1. Problem-first + เรียงลำดับตามการใช้งาน

แต่ละบทสอนในบริบท "เราจะทำ X ในบทหน้า ต้องรู้ Y ก่อน"
Flow หลัก:

```
บท 4  Express   → สร้าง app.js Hello World (hardcode PORT=8080)
บท 5  req & res → เพิ่ม route ทดสอบ params/query (ลบในบทถัดไป)
บท 6  dotenv    → แก้ app.js: PORT อ่านจาก .env
บท 7  cors      → แก้ app.js: เพิ่ม cors + express.json()
บท 8  Database  → SQL Commands + Import
บท 9  mysql2    → สร้าง db.js + แก้ app.js → skeleton สมบูรณ์
บท 10 Checkpoint → ตรวจสอบก่อนไปต่อ
บท 11 bcryptjs  → สร้าง authController.js (partial) + try/catch pattern
บท 12 jwt       → สร้าง auth.js middleware + เติม jwt.sign()
บท 13 Auth      → สร้าง routes/auth.js + ทดสอบ Postman จริง
บท 14 Arch      → role.js + flow diagram + HTTP status + response format
```

### 2. Incremental Code — โค้ดน้อยต่อบท ต่อยอดจากบทก่อน

แต่ละบทเพิ่มโค้ดแค่ **2-5 บรรทัด** จากบทก่อนหน้า ห้ามโยนโค้ดใหม่ทั้งก้อน

แสดง comment header บนโค้ดทุกครั้ง: `// app.js — บทที่ 6 เพิ่ม dotenv`

### 3. VitePress Diff Syntax — แสดงการเปลี่ยนแปลงทุกครั้ง

**บังคับใช้กับทุกบทที่แก้ไขไฟล์เดิม:**
- `// [!code ++]` — บรรทัดที่เพิ่มในบทนี้ (แสดงเป็นสีเขียว)
- `// [!code --]` — บรรทัดที่ลบออก (แสดงเป็นสีแดง)

```js
// app.js — บทที่ 6 เพิ่ม dotenv
require('dotenv').config();                      // [!code ++]
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello!'));
const PORT = 8080;                               // [!code --]
const PORT = process.env.PORT || 8080;           // [!code ++]
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
```

นักเรียนเห็นทันทีว่าต้องเพิ่มอะไร ลบอะไร โดยไม่ต้องอ่านคำอธิบาย

### 4. การทดสอบ — ใช้โค้ดจริง ไม่ใช่ node -e

**ห้าม** ทดสอบด้วย `node -e "..."` one-liner
**ต้องใช้** การรันโค้ดจริงที่นักเรียนสร้างในบทนั้น แล้วดูผลจาก terminal หรือ Postman

```
❌ node -e "require('dotenv').config(); console.log(process.env.PORT)"

✅ npm run dev → เห็น "Server running on http://localhost:8080"
   ตรวจว่า PORT ตรงกับ .env ที่ตั้งไว้
```

### 5. การอธิบายโค้ด — ใช้ inline comment แทน block อธิบาย

**ห้าม** ใช้หัวข้อ "อธิบายทีละบรรทัด:" หรือ block อธิบายยาวๆ หลังโค้ด
**ใช้** inline comment สั้นๆ แทรกในโค้ดโดยตรง ไม่เกิน 1 บรรทัด เฉพาะจุดที่ไม่ชัดเจน

```js
// ✅ ถูก
require('dotenv').config();           // โหลด .env ก่อนทุกอย่าง
const PORT = process.env.PORT || 8080; // อ่านจาก .env ถ้าไม่มีใช้ 8080

// ❌ ผิด — ห้ามทำ
`require('dotenv').config()` — ต้องอยู่บรรทัดแรกเสมอ เพราะโค้ดถัดไปอาจใช้ process.env ทันที...
```

### 6. Folder Structure Snapshot — ทุกบทที่สร้างไฟล์ใหม่

ทุกบทที่สร้างไฟล์หรือโฟลเดอร์ใหม่ **ต้องแสดง tree สั้นๆ ก่อนลงมือ** เพื่อให้นักเรียนรู้ว่าวางไฟล์ถูกที่

```
src/
├── app.js
├── config/
│   └── db.js
└── middlewares/
    └── auth.js   ← สร้างในบทนี้
```

นักเรียนไม่มี IDE extension ช่วยบอก — tree เล็กๆ นี้ช่วยได้มาก

### 7. SQL Command พื้นฐาน + Import (บท 8)

```sql
mysql -u root -p          -- login เข้า MariaDB
SHOW DATABASES;
USE worldskill2026;
SHOW TABLES;
DESCRIBE users;
SELECT * FROM users;
EXIT;
```

**SQL Import — สำคัญสุดตอนแข่ง** (รันจาก terminal ข้างนอก mysql):
```bash
mysql -u root -p worldskill2026 < schema.sql
```
> กรรมการจะให้ไฟล์ .sql มา ใช้คำสั่งนี้ import ได้เลย ไม่ต้องเขียน schema เอง

### 8. บทที่ 3 — เนื้อหาพิเศษที่ต้องมี

นอกจาก npm init และโครงสร้าง project ให้เพิ่ม 3 เรื่องนี้:

**8.1 CommonJS vs ESM — ทำไมใช้ `require` ไม่ใช่ `import`**
```js
// ✅ ที่เราใช้ — CommonJS (Node.js default)
const express = require('express');

// ❌ ห้ามใช้ — ES Module (ใช้ใน React/browser)
import express from 'express';
```
อธิบายสั้นๆ: Node.js ใช้ CommonJS เป็น default ถ้าใช้ import จะ error ทันที

**8.2 nodemon และ package.json scripts**
```json
"scripts": {
  "dev":   "nodemon src/app.js",  // รัน + restart อัตโนมัติเมื่อแก้ไฟล์
  "start": "node src/app.js"      // รันครั้งเดียว ไม่ restart
}
```
อธิบาย: `npm run dev` ใช้ระหว่างพัฒนา, `npm start` ใช้ production

**8.3 API Map — ตาราง endpoint ทั้งหมดที่จะสร้าง**
แสดงตาราง method + path + role ทั้งหมด ให้นักเรียนเห็นภาพรวมตั้งแต่ต้น

### 9. บทที่ 5 (req & res) — ต้องมีชิ้นงานเล็กๆ

**เนื้อหา (อ่านเพื่อเข้าใจ):**

| หัวข้อ | รายละเอียด |
|-------|-----------|
| `req` | req.body, req.params, req.query, req.headers + ตัวอย่างแต่ละอัน |
| `res` | res.send(), res.json(), res.status(), chain res.status(404).json() |
| HTTP Methods | GET / POST / PUT / DELETE — ใช้เมื่อไร ต่างกันยังไง |
| Route Params | `/api/users/:id` → `req.params.id` |
| Query String | `/api/tasks?page=1` → `req.query.page` |
| 404 handler | `app.use()` ท้ายสุด |

**ชิ้นงาน — เพิ่ม route ทดสอบชั่วคราว (ลบในบท 6):**
```js
// app.js — บทที่ 5 เพิ่ม test route
app.get('/test/:name', (req, res) => {
  res.json({ params: req.params, query: req.query }); // ทดสอบ params + query
});
```
ทดสอบ: Postman GET `http://localhost:8080/test/worldskill?year=2026`
ต้องได้: `{ "params": { "name": "worldskill" }, "query": { "year": "2026" } }`

> route นี้สร้างชั่วคราวเพื่อทดสอบความเข้าใจ — จะลบออกด้วย `[!code --]` ในบท 6

### 10. บทที่ 11 (bcryptjs) — try/catch pattern + การทดสอบ

บทนี้เป็น controller แรก — ต้องอธิบาย try/catch ก่อนลงมือเขียน:

**การทดสอบบท 11–12 (ยังไม่มี route):**
ยังทดสอบ Postman ไม่ได้และห้ามใช้ node -e — ทดสอบแค่ว่า server รันไม่ error:
```
npm run dev → ต้องเห็น "Backend running on http://localhost:8080" ไม่มี error
```
การทดสอบจริงของ bcrypt และ jwt จะเกิดขึ้นใน **บท 13** เมื่อ login สำเร็จครั้งแรก

```js
// ✅ ต้องครอบ try/catch เสมอ — ถ้า DB error โดยไม่จับ server จะ crash ทันที
async function login(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    // ...
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
```

อธิบาย: `async/await` ใช้คู่กับ `try/catch` เพราะ `await` สามารถ throw error ได้เสมอ

### 11. บทที่ 14 (Architecture) — เนื้อหาพิเศษก่อน API

บทนี้ไม่มี endpoint — เป็น "เตรียมความเข้าใจ" ก่อน API จะเริ่ม ต้องมีทั้ง 5 ส่วน:

**ส่วนที่ 1: สร้าง role.js middleware**
```js
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
  };
}
module.exports = authorize;
```

**ส่วนที่ 2: Request Flow Diagram (Mermaid sequenceDiagram)**
```
Client → cors → authenticate → authorize(role) → controller → DB → response
```

**ส่วนที่ 3: Middleware Order ใน app.js**
```js
app.use(cors(...));          // 1. cors ก่อนเสมอ
app.use(express.json());     // 2. parse body
app.use(autoClose);          // 3. autoClose (เพิ่มบท 20)
app.use('/api', authRoute);  // 4. routes
```
ลำดับผิด → ทำงานผิด (เช่น autoClose หลัง routes จะไม่ทำงาน)

**ส่วนที่ 4: HTTP Status Codes ที่ใช้ในโปรเจ็คนี้**

| Code | ใช้เมื่อ |
|------|---------|
| 200 | สำเร็จ (default) |
| 400 | ข้อมูลที่ส่งมาไม่ครบหรือผิดรูปแบบ |
| 401 | ไม่มี token หรือ token ผิด |
| 403 | มี token แต่ role ไม่มีสิทธิ์ |
| 404 | ไม่พบข้อมูลที่ขอ |
| 409 | ข้อมูลซ้ำ (เช่น submission ซ้ำใน session เดิม) |
| 500 | server error (catch จาก try/catch) |

**ส่วนที่ 5: Response Format มาตรฐาน**
```js
// ทุก endpoint ต้องส่งใน format นี้ตามโจทย์ TP2026
{ success: true,  data: { ... }, meta: {} }   // single object
{ success: true,  data: [ ... ], meta: {} }   // list
{ success: false, message: 'reason' }         // error
```

### 12. บทที่ 23 (Recheck) — ต้องมี Flow Diagram พิเศษ

Recheck มี logic ต่างจาก endpoint ทั่วไปมาก ต้องมี diagram ก่อน code:

```
POST /api/submissions/:id/recheck
  → เช็ค is_confirmed → ถ้า confirmed → 403
  → UPDATE status = 'checking' (ทันที)
  → setTimeout(2000ms)
    → สุ่ม frontend_score (0-25), backend_score (0-40)
    → ถ้ามี result row → UPDATE (reset is_confirmed = 0)
    → ถ้าไม่มี → INSERT ใหม่
    → UPDATE status = 'checked'
```

### 13. บทที่ 25 (Statistics) — AVG() คืน string ไม่ใช่ number

mysql2 คืนค่า AVG() เป็น string เสมอ ถ้าไม่แปลง frontend จะได้ "24.5" ไม่ใช่ 24.5:

```js
// ❌ ผิด — avg เป็น string
const avg = rows[0].avg_score;

// ✅ ถูก — แปลงเป็น number ก่อนส่ง
const avg = Number(rows[0].avg_score || 0).toFixed(2);
```

เพิ่ม note นี้ใน Common Errors ของบท 25

### 14. โครงสร้าง Backend จริง (ตรวจสอบจาก backend/src/)

**Routes (10 ไฟล์) + Controllers (10 ไฟล์):**
submissions.js และ results.js ใช้ร่วมกันระหว่าง candidate และ judge

| ไฟล์ | สร้างในบทที่ | เพิ่มฟังก์ชันในบท |
|------|------------|-----------------|
| routes/auth.js + authController.js | 13 | — |
| routes/config.js + configController.js | 15 | — |
| routes/tasks.js + tasksController.js | 16 | — |
| routes/submissions.js + submissionsController.js | 17 | 18 (POST+PUT), 22 (judge list), 23 (recheck) |
| routes/results.js + resultsController.js | 19 | 24 (judge confirm) |
| routes/session.js + sessionController.js | 20 | — |
| routes/candidates.js + candidatesController.js | 21 | — |
| routes/statistics.js + statisticsController.js | 25 | 26 (ranking) |
| routes/sessions.js + sessionsController.js | 27 | — |
| routes/report.js + reportController.js | 28 | — |

**หมายเหตุ paginate.js:** มีอยู่จริงใน `backend/src/utils/paginate.js` แต่ **ไม่สอนในบทเรียน**
tasks และ statistics endpoints จะ return ข้อมูลทั้งหมดโดยไม่มี pagination ในบทเรียน

### 15. สอนทีละ Endpoint — Pattern ซ้ำทุกบท

Pattern สำหรับ API chapters (15 เป็นต้นไป):
```
User Story → Folder Structure → Route snippet [!code ++] → Controller function → Postman test
```

ห้าม dump controller ทั้งไฟล์ในครั้งเดียว

| Middleware | สร้างในบทที่ | เหตุผล |
|------------|------------|--------|
| `auth.js` | 12 — jsonwebtoken | ใช้ jwt.verify() |
| `role.js` | 14 — Architecture | อธิบายก่อน API จะเริ่ม |
| `autoClose.js` | 20 — Session | feature ของ session |

### 16. VitePress Callouts — มาตรฐานการใช้

| Callout | ใช้เมื่อ | ตัวอย่าง |
|---------|---------|---------|
| `:::tip` | ข้อแนะนำเพิ่มเติมที่มีประโยชน์ แต่ไม่บังคับ | "ถ้าต้องการทดสอบเร็วขึ้น ใช้ Postman environment" |
| `:::warning` | ข้อผิดพลาดที่เกิดบ่อย ต้องระวัง | "ลืมใส่ Bearer space ก่อน token จะ 401 ทันที" |
| `:::danger` | ถ้าทำผิดจะพังหนักหรือมีผลต่อ security | "JWT_SECRET ห้ามเปิดเผย ถ้าหลุดทุกคนสร้าง token ปลอมได้" |

ใช้ `>` blockquote สำหรับ note ทั่วไปที่ไม่ใช่ warning

### 17. บทที่ 2 (Backend คืออะไร) — เนื้อหา

บทนี้ **ไม่มีโค้ดเลย** — เป็นภาพรวมระบบทั้งหมด:

1. Client คืออะไร (browser/Postman) → ส่ง request
2. Server คืออะไร (Node.js + Express) → รับ + ประมวลผล + ตอบกลับ
3. Database คืออะไร (MariaDB) → เก็บข้อมูล
4. ทั้งสามคุยกันยังไง → diagram แสดง flow
5. REST API คืออะไร → HTTP verb + URL + JSON response
6. ระบบที่จะสร้าง → ภาพรวม roles (candidate/judge/manager) + สิ่งที่แต่ละคนทำได้

จบบทแล้วนักเรียนต้องเข้าใจว่า "เราจะสร้างอะไร และมันทำงานยังไงในภาพรวม"

### 18. Code Style มาตรฐาน

ใช้เหมือนกันทุกไฟล์ทุกบท:

| หัวข้อ | มาตรฐาน |
|-------|---------|
| Quotes | single quote `'` เสมอ |
| Semicolon | มี `;` ทุกบรรทัด |
| Indent | 2 spaces |
| Comma | trailing comma ใน object/array หลายบรรทัด |

```js
// ✅ ถูก
const pool = require('../config/db');
const { username, password } = req.body;

// ❌ ผิด
const pool = require("../config/db")
const {username, password} = req.body
```

### 19. กฎการเขียนเนื้อหา

| หลักการ | รายละเอียด |
|---------|-----------|
| ภาษา | ไทยเป็นหลัก ศัพท์เทคนิคทับศัพท์ได้ |
| อธิบาย | inline comment สั้นๆ — ห้ามมี "อธิบายทีละบรรทัด:" |
| Diff syntax | `// [!code ++]` / `// [!code --]` ทุกครั้งที่แก้ไฟล์เดิม |
| Folder tree | แสดงก่อนสร้างไฟล์ใหม่ทุกครั้ง |
| Callouts | :::tip / :::warning / :::danger ตามมาตรฐานส่วน 16 |
| Code style | single quote, semicolon, 2-space indent ทุกไฟล์ |
| Diagram | Mermaid สำหรับ flow/sequence, ตาราง Markdown สำหรับรายการ |
| Mermaid graph | **ห้าม** ใช้ `graph` กับ text ภาษาไทย — ใช้ตารางแทน |
| เส้นขั้น `---` | **ห้ามใช้** — ใช้ `##` แทน |
| mkdir | **ห้ามสอน** — แสดง folder tree แล้วสร้างใน VS Code เอง |
| Testing | **ทุกบทต้องมี** — รันโค้ดจริง ไม่ใช่ node -e (บท 11-12 ทดสอบแค่ server start) |
| Incremental | ห้ามโค้ดที่ใช้แล้วทิ้ง (ยกเว้น test route บท 5 ที่ตั้งใจลบ) |
| paginate.js | มีในโปรเจ็คจริงแต่ **ไม่สอนในบทเรียน** |
| PDF report | **ไม่ใช้** — ตัดออก |
| "บทถัดไป" | **ไม่ต้องเขียน** — VitePress มี prev/next navigation อยู่แล้ว |

## Template มาตรฐาน — สำหรับบท Library (6, 7, 9, 11, 12)

```markdown
> **บทนี้เตรียมอะไร:** [บอกชัดว่าบทนี้สอนอะไร จะใช้จริงในบทที่เท่าไร]

## ปัญหา — [ชื่อปัญหา]
[แสดงให้เห็นว่าถ้าไม่มี library นี้จะเกิดอะไร]

## วิธีแก้ — [ชื่อ solution]
[อธิบาย concept]

## ทำไมถึงใช้ [Library] ไม่ใช่ตัวอื่น
[ตาราง: ตัวเลือก | เหตุผลที่ไม่ใช้]

## วิธีใช้งาน
[โค้ดพร้อม inline comment สั้นๆ]

## ชิ้นงาน — [ชื่อไฟล์ที่สร้าง/แก้]
[folder tree → โค้ดพร้อม [!code ++] / [!code --]]

## ทดสอบ
[รัน server จริง + ผลที่ต้องเห็น terminal + Postman (ถ้ามี)]

## Common Errors
[ตาราง error | สาเหตุ | วิธีแก้]
```

## Template มาตรฐาน — สำหรับ API Endpoint

```markdown
## METHOD /api/endpoint-name

> [User story — ใครต้องการอะไร → จึงต้องมี endpoint นี้]

[folder tree แสดงไฟล์ที่จะสร้าง/แก้]

**`routes/xxx.js`**
```js
router.METHOD('/path', authenticate, authorize('role'), ctrl.fn); // [!code ++]
```

**`controllers/xxxController.js`**
```js
async function fn(req, res) {
  try {
    // โค้ด พร้อม inline comment
    res.json({ success: true, data: result, meta: {} });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
```

**`app.js`** (ถ้ามี route ใหม่)
```js
app.use('/api', require('./routes/xxx')); // [!code ++]
```

**ทดสอบ Postman:**
```
METHOD http://localhost:8080/api/endpoint
Authorization: Bearer <token จากบท 13>
```
ต้องได้: `{ "success": true, "data": { ... }, "meta": {} }`

> Pattern: Route → Controller → pool.execute() → res.json() — เหมือนทุก endpoint


## สถานะปัจจุบัน

**ครบทั้ง 29 บทแล้ว** — config.mjs และ index.md อัปเดตแล้ว

### ไฟล์เก่าที่ยังค้างอยู่ (ไม่ได้อยู่ใน sidebar — ignoreDeadLinks ป้องกัน build error)

ไฟล์เหล่านี้มีอยู่แต่ไม่ได้ link ใน config.mjs — ลบได้เมื่อสะดวก:

```
Root:           04-database.md, 05-express-concepts.md, 08-mysql2.md,
                09-express-server.md, 10-bcryptjs.md, 11-jsonwebtoken.md, 24-test.md
auth/           12-auth.md
candidate/      16-my-result.md, 18-candidates.md, 19-submit.md, 20-results.md
judge/          17-session.md
manager/        21-statistics.md, 22-sessions.md, 23-report.md
```

## โครงสร้างไฟล์ VitePress (29 บท)

```
worldskill-2026-web-tech-docs/
├── .vitepress/config.mjs    ✅ อัปเดตแล้ว (29 บท + emoji + nav)
├── index.md                 ✅ อัปเดตแล้ว (29 บท + emoji)
│
├── 01-installation.md       ✅
├── 02-intro.md              ✅
├── 03-setup.md              ✅ + API Map + CommonJS + nodemon
├── 04-express.md            ✅ Hello World
├── 05-req-res.md            ✅ req&res + ชิ้นงานเล็ก (test route ลบในบท 6)
├── 06-dotenv.md             ✅ diff syntax + testing
├── 07-cors.md               ✅ diff syntax + testing
├── 08-database.md           ✅ SQL Commands + Import
├── 09-mysql2.md             ✅ diff syntax + testing
├── 10-checkpoint.md         ✅ checklist จริงก่อนไปต่อ
│
├── 11-bcryptjs.md           ✅ + try/catch pattern
├── 12-jsonwebtoken.md       ✅ + auth.js middleware
├── auth/
│   └── 13-auth.md           ✅ routes/auth.js + Postman test จริง
│
├── 14-architecture.md       ✅ role.js + flow diagram + HTTP status + response format
│
├── shared/
│   ├── 15-config.md         ✅
│   └── 16-tasks.md          ✅
├── candidate/
│   ├── 17-my-submission-get.md   ✅ GET เท่านั้น
│   ├── 18-my-submission-write.md ✅ POST + PUT
│   └── 19-my-result.md           ✅
├── judge/
│   ├── 20-session.md        ✅ start + close + autoClose.js
│   ├── 21-candidates.md     ✅
│   ├── 22-submissions.md    ✅
│   ├── 23-recheck.md        ✅ + flow diagram พิเศษ
│   └── 24-confirm.md        ✅
├── manager/
│   ├── 25-statistics.md     ✅ summary + status + AVG() note
│   ├── 26-ranking.md        ✅
│   ├── 27-sessions.md       ✅
│   └── 28-report.md         ✅ JSON + CSV เท่านั้น (ไม่มี PDF)
│
├── 29-checklist.md          ✅ Competition Checklist
├── glossary.md              ✅
└── frontend-coming-soon.md  ✅
```

## Incremental Build — app.js เพิ่มทีละบท

| บท | สิ่งที่เพิ่ม/เปลี่ยน ใน app.js |
|----|-------------------------------|
| 4 | สร้าง app.js: express + Hello World + listen(8080) |
| 5 | เพิ่ม test route (ลบในบท 6) |
| 6 | ลบ test route + เพิ่ม dotenv + PORT จาก .env |
| 7 | เพิ่ม cors + express.json() |
| 8 | ไม่เปลี่ยน app.js — เรียน SQL Commands |
| 9 | ลบ Hello World route + สร้าง db.js (skeleton สมบูรณ์) |
| 10 | ไม่เปลี่ยน app.js — Checkpoint เท่านั้น |
| 11 | ไม่เปลี่ยน app.js — สร้าง authController.js |
| 12 | ไม่เปลี่ยน app.js — สร้าง auth.js + เติม jwt ใน controller |
| 13 | เพิ่ม `app.use('/api', require('./routes/auth'))` |
| 14 | ไม่เปลี่ยน app.js — Architecture เท่านั้น |
| 15 | เพิ่ม route config |
| 16 | เพิ่ม route tasks |
| 17 | เพิ่ม route submissions |
| 18 | ไม่เปลี่ยน app.js — เพิ่มแค่ฟังก์ชันใน controller |
| 19 | เพิ่ม route results |
| 20 | เพิ่ม `app.use(autoClose)` + route session |
| 21 | เพิ่ม route candidates |
| 22 | submissions route มีแล้ว — เพิ่มแค่ฟังก์ชัน |
| 23 | submissions route มีแล้ว — เพิ่ม recheck function |
| 24 | results route มีแล้ว — เพิ่ม confirm function |
| 25 | เพิ่ม route statistics |
| 26 | statistics route มีแล้ว — เพิ่ม ranking function |
| 27 | เพิ่ม route sessions |
| 28 | เพิ่ม route report |

## บทที่ 29 — Competition Checklist

ไม่ใช่ทดสอบซ้ำ — เป็นขั้นตอนที่ต้องทำ **ตอนเริ่มแข่งจริง**:

```
1. รับไฟล์ .sql จากกรรมการ
2. mysql -u root -p worldskill2026 < schema.sql
3. สร้าง backend/.env จาก .env.example ใส่ค่าตามโจทย์
4. cd backend && npm install
5. npm run seed  (ถ้าโจทย์ให้ seed)
6. npm run dev  → เห็น "Backend running on :8080"
7. Postman: POST /api/login → ต้องได้ token
8. ทดสอบ endpoint ตาม marking scheme
```

## ข้อตกลงที่ตกลงกันแล้ว — ครบทั้งหมด

**หลักการสอน:**
- [x] Problem-first — แสดงปัญหาก่อน แล้วค่อยอธิบาย solution
- [x] บทแยกสำหรับทุก library — dotenv, cors, mysql2, bcryptjs, jsonwebtoken
- [x] ไม่มีบท Middlewares แยกต่างหาก — สอนในบริบทที่ใช้จริง
- [x] ห้าม "อธิบายทีละบรรทัด:" block — ใช้ inline comment สั้นๆ แทน
- [x] ห้าม node -e testing — ทดสอบด้วยโค้ดจริง + Postman
- [x] โค้ดน้อยต่อบท — เพิ่มทีละ 2-5 บรรทัด
- [x] VitePress diff syntax — `// [!code ++]` / `// [!code --]` ทุกครั้งที่แก้ไฟล์เดิม
- [x] Folder structure snapshot — ทุกบทที่สร้างไฟล์ใหม่
- [x] ห้าม Mermaid graph กับภาษาไทย → ตาราง Markdown แทน
- [x] ห้ามสอน mkdir → แสดง tree แล้วสร้างใน VS Code
- [x] ห้ามใช้ `---` → ใช้ `##` แทน
- [x] ห้ามเขียน "บทถัดไป" — VitePress มี prev/next อยู่แล้ว

**โครงสร้างบท:**
- [x] 29 บท (เพิ่มจาก 24 เพื่อแยกหัวข้อซับซ้อนออก)
- [x] บท 4 = Express Hello World, บท 5 = req&res แยกกัน
- [x] บท 5 มีชิ้นงานเล็ก (test route ที่ลบในบท 6)
- [x] บท 8 = Database + SQL (ย้ายจากบท 4 มาใกล้ mysql2)
- [x] บท 10 = Checkpoint แยกออกมา ไม่รวมกับ mysql2
- [x] บท 14 = Architecture chapter (role.js + flow + status + format + middleware order)
- [x] บท 17 = GET /api/my-submission เท่านั้น, บท 18 = POST+PUT
- [x] บท 23 = Recheck มี flow diagram พิเศษ
- [x] บท 29 = Competition Checklist

**เนื้อหาพิเศษในบทต่างๆ:**
- [x] บท 3: CommonJS vs ESM + nodemon/scripts + API Map
- [x] บท 8: SQL Import `mysql < file.sql` — สำคัญสุดตอนแข่ง
- [x] บท 10: Checkpoint จริง มี checklist ที่ต้องผ่านก่อนไปต่อ
- [x] บท 11: try/catch pattern + async/await อธิบายก่อน controller แรก
- [x] บท 13: รัน `npm run seed` ก่อนทดสอบ Postman
- [x] บท 14: role.js + request flow + HTTP status codes + response format + middleware order
- [x] บท 25: AVG() จาก mysql2 คืน string → ต้อง Number().toFixed(2)
- [x] ทุก API chapter: User Story ก่อนเสมอ

**เนื้อหาเพิ่มเติม (รอบนี้):**
- [x] VitePress callouts — :::tip/:::warning/:::danger มาตรฐานชัดเจน
- [x] บท 2 = ภาพรวมระบบ (Client/Server/DB/REST) ไม่มีโค้ด
- [x] config.mjs อัปเดตก่อนเป็นสิ่งแรกก่อนเขียนบทใดๆ
- [x] Code style: single quote, semicolon, 2-space indent ทุกไฟล์
- [x] บท 11-12 testing = แค่ตรวจว่า server start ไม่ error (Postman ทดสอบจริงในบท 13)
- [x] paginate.js มีในโปรเจ็คจริงแต่ไม่สอน (tasks/statistics return ทั้งหมดไม่มี pagination)
- [x] submissions.js + results.js ใช้ร่วมกัน candidate+judge — เพิ่ม function ทีละบท

**ตัดออก:**
- [x] PDF report — ไม่ใช้
- [x] "บทถัดไป" per-chapter — VitePress จัดการให้
