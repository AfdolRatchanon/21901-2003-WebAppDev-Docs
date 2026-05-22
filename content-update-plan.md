# Content Update Plan — 21901-2003 Web App Dev

> วางแผนจากการวิเคราะห์ช่องว่างเนื้อหาทั้งหมด เทียบกับ `project/frontend/` และมาตรฐาน TPQI 10302 ระดับ 3
> **อย่าลงมือจนกว่าจะอ่านแผนนี้ครบ**

## หลักการที่ตกลงไว้

| หลักการ | รายละเอียด |
|---|---|
| Code-First | เห็นโค้ดที่รันได้ก่อน → ทฤษฎีตามหลัง |
| Progressive Difficulty | ง่าย → ยาก ทุกไฟล์ ทุก wk |
| เนื้อหาสอดคล้อง project/frontend/ | ไม่สอนสิ่งที่ไม่มีในโปรเจกต์ |
| ขยายไฟล์เดิม | ไม่สร้างไฟล์ใหม่ถ้าของเดิมรับได้ |
| CSS: inline(wk1-2) → Tailwind(wk3+) | บอก 3 วิธีใน wk1 แต่ใช้แค่ inline ก่อน |
| Virtual DOM ระดับ conceptual | รู้หลักการ ไม่ต้องรู้ algorithm |
| Mermaid: node label ภาษาอังกฤษเท่านั้น | คำอธิบายภาษาไทยวางนอก diagram |

## งานทั้งหมด — แบ่งตามประเภท

### 🔧 Phase 0: Setup (ทำก่อนทุกอย่าง)

#### ติดตั้ง Mermaid Plugin

```bash
cd docs
npm install vitepress-plugin-mermaid mermaid
```

แก้ `docs/.vitepress/config.ts`:
```ts
import { withMermaid } from 'vitepress-plugin-mermaid'
export default withMermaid(defineConfig({ ... }))
```

### 📋 Phase 1: ปรับ Blueprint Files

#### 1.1 `course-outline.md`

| จุดที่ต้องแก้ | รายละเอียด |
|---|---|
| wk3 table | เพิ่มแถว `wk3-content4-component-patterns.md` |
| wk5 header | เปลี่ยนจาก "Midterm + State" → "State Management" |
| wk5 table | ลบแถว `wk5-midterm-exam.md` + เพิ่มแถว `wk5-lab1-auth-context.md` |
| wk8 TypeScript Focus | ลบ `Partial<T>`, `Omit<T>` — ไม่มีในโปรเจกต์ |

#### 1.2 `course-pattern.md`

**เพิ่ม section ใหม่:**

```
### รูปแบบ 5: Mermaid Diagram
  - ประเภทที่ใช้ได้: flowchart LR, graph TD, sequenceDiagram
  - กฎ: node label ต้องเป็นอังกฤษ — Thai ไปอยู่ข้างนอก diagram
  - ตัวอย่าง props flow, component tree, API sequence

### รูปแบบ 7: Theory Foundation Section
  - ใช้เมื่อหน้านั้นต้องอธิบาย concept เชิงทฤษฎีก่อนโค้ด
  - ต้องมี diagram + เปรียบเทียบ + ตัวอย่างโลกจริง
  - ไม่เกิน 1 หน้า A4

### Naming Convention Standard
  - PascalCase: Component, Interface, Type, Props
  - camelCase: variable, function, hook, file (ยกเว้น component/page)
  - ขึ้นต้น use: custom hook
  - ขึ้นต้น handle: event handler
  - ขึ้นต้น is/has/can: boolean state
  - ComponentNameProps: props interface

### Critical Bugs Section (เพิ่มใน Lab Pattern)
  - Array mutation bug: push vs spread
  - Object mutation bug
  - 0 && render bug
  - ลืม e.preventDefault() ใน form
```

**แก้ Anti-Patterns:**
```
เดิม: Mermaid graph กับ text ภาษาไทย → ใช้ตาราง Markdown แทน
ใหม่: Mermaid node label ต้องเป็นอังกฤษ — คำอธิบายภาษาไทยวางนอก diagram
```

### 📚 Phase 2: เพิ่มเนื้อหารายไฟล์

#### 2.1 `wk1-content1-intro.md` — ขยายใหญ่สุด

**เพิ่มก่อน setup steps (ลำดับใหม่: เห็นผลลัพธ์ → ทฤษฎี → setup):**

```
Section: React คืออะไร
  - แก้ปัญหาอะไรของ HTML+JS ธรรมดา
  - Component-based architecture
  - Declarative vs Imperative
  - Mermaid: flowchart LR — HTML/JS แบบเก่า vs React

Section: Virtual DOM (conceptual)
  - React เก็บ copy ของ DOM ใน memory
  - setState → diff เก่า/ใหม่ → update เฉพาะส่วนที่เปลี่ยน
  - ทำไม key ใน .map() ถึงสำคัญ
  - Mermaid: graph TD — render cycle

Section: Render Cycle
  - mount / update / unmount (conceptual เท่านั้น)
  - ASCII art: render cycle ① setState ② diff ③ update DOM

Section: File Structure + Naming Convention
  - โครงสร้าง src/ แต่ละโฟลเดอร์ทำอะไร
  - ตาราง naming convention ครบทุกประเภท
  - .tsx vs .ts — เมื่อไหรใช้อะไร
  - one component per file rule

Section: Named vs Default Export
  - ตาราง: named vs default ต่างกันอย่างไร
  - กฎของโปรเจกต์นี้: App.tsx = default, อื่น ๆ = named

Section: React.FC vs function declaration
  - React.FC (เก่า): const Card: React.FC<Props> = () => {} — ไม่แนะนำ
  - function declaration (ใหม่): export function Card({}: Props) {} — ใช้ในโปรเจกต์นี้
  - ทำไมเลือก function declaration: อ่านง่ายกว่า, hoisting ดีกว่า, TypeScript error ชัดกว่า
  - เตือนนักเรียน: ถ้าเจอ React.FC ใน tutorial เก่า → แปลงเป็น function declaration

Section: tsconfig.json strict mode
  - strict: true เปิดอะไรบ้าง (noImplicitAny, strictNullChecks ฯลฯ)
  - ทำไม TypeScript ถึง error ที่ดูเข้มงวด
  - ไม่ต้องแก้ tsconfig — ต้องแก้โค้ดให้ถูก
  - อ่านเพื่อเข้าใจ ไม่ต้องเขียนเอง

Section: React 18 createRoot
  - อธิบาย createRoot vs ReactDOM.render (เก่า)
  - เตือนนักเรียนถ้าเจอ tutorial เก่า

Section: CSS ใน React (brief)
  - วิธีที่ 1: inline style + double braces + camelCase
  - วิธีที่ 2: CSS file + className
  - วิธีที่ 3: Tailwind utility classes (wk3 จะสอนเต็ม)
  - โปรเจกต์นี้: wk1-2 ใช้ inline, wk3+ ใช้ Tailwind

Section: React DevTools
  - ติดตั้ง browser extension
  - ดู component tree, props, state
  - Network tab สำหรับ API (wk4)
```

#### 2.2 `wk1-content2-jsx.md` — ขยาย

```
Section: TSX vs HTML — ตารางเปรียบเทียบ
  - class → className
  - for → htmlFor
  - onclick → onClick (camelCase)
  - <input> → <input /> (self-closing บังคับ)
  - style="color:red" → style={{ color: 'red' }}

Section: {} Expression Rules
  - ใส่ได้: string, number, JSX, function call, ternary, &&
  - ใส่ไม่ได้: if/else statement, for loop (ต้องใช้ map), object โดยตรง
  - double braces: outer {} = JSX expression, inner {} = object

Section: Event Handler Types
  - onClick: React.MouseEvent<HTMLButtonElement>
  - onChange: React.ChangeEvent<HTMLInputElement>
  - onSubmit: React.FormEvent<HTMLFormElement>
  - Code tabs: ✅ ❌ 💡

Section: Conditional Rendering Patterns
  - && operator + 0 bug
  - ternary ? :
  - early return
  - 0 && <Component /> renders "0" → bug fix

Section: Fragment
  - ทำไม JSX return ได้แค่ root เดียว
  - <>...</> shorthand
  - เมื่อไหรใช้ Fragment แทน div

Section: Array Methods ใน JSX
  - .filter() ก่อน .map() — กรองก่อนแสดง
  - .find() — หา item เดียวจาก id
  - Code tabs: ✅ filter+map ❌ map แล้วค่อย hide ด้วย CSS
  - ตัวอย่าง: equipments.filter(e => e.status === 'available').map(...)
```

#### 2.3 `wk2-content1-state.md` — เพิ่ม

```
Section: Array & Object Immutability
  - ทำไมต้อง spread ไม่ใช่ push/mutate
  - Code tabs: push ❌ vs spread ✅
  - Object mutation ❌ vs { ...obj, key: value } ✅
  - เชื่อมกับ Virtual DOM: React compare by reference

Section: Functional setState (prev =>)
  - ❌ setEquipments(equipments.map(...)) — อาจได้ค่าเก่า (stale state)
  - ✅ setEquipments(prev => prev.map(...)) — ได้ค่าล่าสุดเสมอ
  - ใช้เมื่อ: new state พึ่งค่าเก่าของ state เดิม
  - ตัวอย่างในโปรเจกต์: AdminPage ลบ/เพิ่ม equipment

Section: Generic Type ใน useState<T>
  - useState<string>('') — กำหนด type ให้ state
  - useState<Equipment[]>([]) — state ที่เป็น array
  - useState<string | null>(null) — nullable state
  - TypeScript จะ error ถ้า setX รับค่าผิด type
  - Code tabs: ✅ มี generic ❌ ไม่มี → TS infer ผิด
  - หมายเหตุ: Generic<T> แบบสร้างเองสอนใน wk3 — wk2 แค่ใช้

Section: Destructuring Syntax
  - Object destructuring: function Card({ name, status }: Props)
  - Array destructuring: const [count, setCount] = useState(0)
  - Nested: const { user: { name } } = auth
  - Default value: function Card({ status = 'available' }: Props)

Section: key Prop Best Practices
  - ❌ ห้ามใช้ array index: key={index} — เมื่อ reorder list พัง
  - ✅ ใช้ unique id จาก data: key={item.id}
  - ทำไม key สำคัญ: React ใช้ระบุ item ใน Virtual DOM diff
```

#### 2.4 `wk2-content2-effect.md` — เพิ่ม

```
Section: Hook Rules (กฎ 2 ข้อ)
  - เรียกที่ top level เท่านั้น — ห้ามใน if/for/function ซ้อน
  - เรียกใน React component หรือ custom hook เท่านั้น
  - Code tabs: ❌ ผิด (hook ใน if) vs ✅ ถูก
  - ทำไม React ถึงมีกฎนี้ (brief)

Section: async function ใน useEffect (Critical Bug)
  - ❌ ผิด: useEffect(async () => { await fetch() }, [])
  - ✅ ถูก: useEffect(() => { async function load() {...}; load() }, [])
  - ทำไม useEffect callback เป็น async ตรง ๆ ไม่ได้
  - Code tabs: ❌ vs ✅

Section: useEffect Cleanup
  - return function จาก useEffect — รันตอน unmount
  - ใช้กับ Socket.io (wk7): socket.off() ตอน cleanup
  - ใช้กับ timer: clearTimeout / clearInterval
  - Code tabs: ✅ มี cleanup ❌ ไม่มี cleanup → memory leak

Section: StrictMode Double Invoke (Dev Only)
  - React.StrictMode เรียก useEffect 2 ครั้งโดยเจตนา — ตรวจ cleanup bug
  - นักเรียนจะเห็น API ถูก call 2 ครั้งและคิดว่า code พัง → บอกไว้ก่อน
  - เฉพาะ development mode เท่านั้น — production เรียกครั้งเดียว
  - วิธีแก้: อย่าแก้ code — มี cleanup function ที่ถูกต้องก็พอ
```

#### 2.5 `wk2-content4-types.md` — เพิ่ม

```
Section: TypeScript Operators
  - ! non-null assertion: getElementById('root')!
  - ?. optional chaining: auth.user?.role
  - ?? nullish coalescing: stored ?? 'default'
  - as type assertion: JSON.parse(stored) as User
  - Code tabs: ✅ ❌ 💡 ทุกตัว

Section: type vs interface — practical
  - interface: object shape (Equipment, User)
  - type: Union Types (EquipmentStatus, UserRole)
  - กฎง่าย ๆ: object → interface, union → type

Section: import type
  - import type { Equipment } vs import { Equipment }
  - import type = type-only, compiler ลบทิ้งตอน build
  - กฎ: import Interface/Type → ใช้ import type เสมอ
  - ทำไมโปรเจกต์ใช้ import type ทั่วไป

Section: null vs undefined
  - null: ตั้งใจให้ว่าง (เลือกเอง)
  - undefined: ยังไม่ได้กำหนดค่า (ไม่ตั้งใจ)
  - โปรเจกต์ใช้ | null ทุกที่: user | null, error | null, borrowingId | null
  - เช็ค: if (user) หรือ user !== null — ทั้งสองใช้ได้
  - Code tabs: ✅ | null ❌ | undefined ในบริบทที่ตั้งใจให้ว่าง

Section: Record<K, V>
  - Record<string, string> — object ที่ key-value เป็น type เดียวกัน
  - ตัวอย่างในโปรเจกต์: statusLabel, statusConfig ที่ map EquipmentStatus → string/className
  - const statusLabel: Record<EquipmentStatus, string> = { available: 'ว่าง', ... }
  - ต่างจาก index signature [key: string]: string ตรงที่ key จำกัดด้วย Union Type ได้
  - Code tabs: ✅ Record<EquipmentStatus, string> ❌ plain object ไม่มี type
```

#### 2.6 `wk3-content1-tailwind.md` — เพิ่ม

```
Section: Responsive Prefixes
  - ไม่มี prefix = mobile (default)
  - sm: md: lg: xl: breakpoints
  - ตัวอย่าง: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  - Mermaid หรือ ASCII: breakpoint scale

Section: Template Literal + Conditional className
  - `className={\`px-3 py-1 \${status === 'available' ? 'bg-green-100' : 'bg-red-100'}\`}`
  - ใช้สำหรับ status badge ใน EquipmentCard
  - hover: focus: variants สำหรับปุ่ม: hover:bg-blue-700 focus:ring-2
  - Code tabs: ✅ template literal ❌ string concatenation ด้วย +
```

#### 2.7 `wk3-content2-forms.md` — เพิ่ม

```
Section: Controlled vs Uncontrolled
  - Controlled: value={state} + onChange — React คุม
  - Uncontrolled: ref — DOM คุม
  - โปรเจกต์นี้ใช้ Controlled เสมอ — ทำไม
  - Code tabs: ✅ Controlled ❌ Uncontrolled

Section: e.preventDefault()
  - ถ้าลืม: หน้า refresh เมื่อ submit — debug ยาก
  - ต้องเป็น line แรกใน handleSubmit เสมอ

Section: Accessibility ใน Forms
  - <label htmlFor> + <input id> ต้องคู่กัน
  - <button type="submit"> vs <button type="button">
  - ห้ามใช้ <div onClick> แทน <button>
```

#### 2.8 `wk4-content1-fetch.md` หรือ `wk4-content2-async.md` — เพิ่ม

```
Section: 3-State Pattern (data + isLoading + error)
  const [data,      setData]      = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  - render pattern: isLoading → error → data
  - ASCII art: state machine ของ 3 state
  - เชื่อมกับ try-catch-finally ที่มีอยู่แล้ว

Section: Environment Variables
  - .env ไม่ commit ขึ้น git (.gitignore)
  - VITE_ prefix บังคับ
  - import.meta.env.VITE_API_URL
  - ตัวอย่าง: .env.example สำหรับ team

Section: Vite Proxy
  - อธิบายว่าทำไม /api → localhost:3000 ได้
  - vite.config.ts proxy config (อ่านเพื่อเข้าใจ ไม่ต้องเขียนเอง)
  - dev proxy ≠ production (สำคัญมาก)

Section: CORS คืออะไร (brief)
  - Browser บล็อก request ข้าม origin เองเป็น default
  - CORS = server บอก browser ว่า "origin นี้อนุญาต"
  - นักเรียนจะเห็น error "CORS policy" เมื่อ backend ยังไม่ได้ตั้ง header
  - วิธีแก้: เพิ่ม cors middleware ฝั่ง backend (ไม่ใช่แก้ frontend)
  - ASCII: Browser → ถามว่า allowed? → Server → Access-Control-Allow-Origin

Section: HTTP Status Codes ที่ต้องรู้
  - 200 OK — สำเร็จ
  - 201 Created — สร้างข้อมูลสำเร็จ (POST)
  - 400 Bad Request — ข้อมูลที่ส่งไปผิด (validation fail)
  - 401 Unauthorized — ไม่มี / token หมดอายุ → redirect ไป login
  - 403 Forbidden — มี token แต่ไม่มีสิทธิ์ (student เข้า admin page)
  - 404 Not Found — ไม่พบข้อมูล
  - 500 Internal Server Error — backend พัง
  - ตาราง: status → ความหมาย → React ทำอะไร (redirect / show error / retry)

Section: Promise<T> return type
  - async function login(): Promise<boolean> { ... }
  - async function fetchEquipments(): Promise<Equipment[]> { ... }
  - ทำไมต้องระบุ return type: TypeScript ตรวจ caller ได้
  - ห้าม return type เป็น Promise<any> — ใช้ type จริงเสมอ
  - Code tabs: ✅ Promise<boolean> ❌ Promise<any>
```

#### 2.9 ตรวจสอบ Project Setup Commands

ตรวจว่าไฟล์เหล่านี้มีคำสั่งติดตั้งครบไหม:

| Library | คำสั่ง | ตรวจใน |
|---|---|---|
| Vite + React + TS | `npm create vite@latest` | `wk1-content1-intro.md` |
| Tailwind CSS v3 | `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p` | `wk3-content1-tailwind.md` |
| Zod | `npm install zod` | `wk3-content3-validation.md` |
| Axios | `npm install axios` | `wk4-content1-fetch.md` |
| React Router v6 | `npm install react-router-dom` | `wk7-content2-routes.md` |
| Socket.io-client | `npm install socket.io-client` | `wk7-content3-realtime.md` |

ถ้าไม่มีในไฟล์ → เพิ่ม step แรกก่อนเนื้อหา

#### 2.10 `wk6-content1-cookies.md` — เพิ่ม

```
Section: Security Basics
  - localStorage: JS อ่านได้ → เสี่ยง XSS
  - httpOnly Cookie: JS อ่านไม่ได้ → ปลอดภัยกว่า
  - โปรเจกต์นี้ใช้ localStorage: เหมาะกับระบบภายใน, เรียนรู้ง่าย
  - กฎที่ต้องรู้: ไม่เก็บ password, logout ต้องลบ token
```

#### 2.11 `wk7-content1-jwt.md` — เพิ่ม

```
Section: JWT + localStorage Best Practices
  - ความเสี่ยง XSS + แนวทางป้องกัน (sanitize input)
  - Token ต้องมี exp (expiry)
  - ไม่เก็บข้อมูล sensitive ใน payload
  - Logout ต้องลบ token จาก localStorage
  - ห้ามเก็บ password ไม่ว่ากรณีใด
```

#### 2.12 `wk7-content2-routes.md` — เพิ่ม

```
Section: useNavigate vs window.location
  - window.location.href = '/login' — full page reload, ล้าง React state ทั้งหมด
  - navigate('/login') — SPA navigation, ไม่ reload, state ยังอยู่
  - ✅ ใช้ navigate() เสมอในโปรเจกต์ React Router
  - ❌ window.location ใช้ได้แค่ตอน logout แบบ hard-reset จงใจ
  - Code tabs: ✅ useNavigate ❌ window.location.href
  - ตัวอย่างในโปรเจกต์: LoginPage redirect หลัง login สำเร็จ

Section: useNavigate patterns
  - const navigate = useNavigate()
  - navigate('/') — go to home
  - navigate(-1) — go back
  - navigate('/login', { replace: true }) — replace history (ป้องกัน back กลับมา protected route)
  - replace: true สำคัญมาก: หลัง logout ต้อง replace ไม่งั้น back ได้

Section: ProtectedRoute Pattern
  - ตรวจ isAuthenticated ก่อน render children
  - ถ้าไม่ผ่าน: <Navigate to="/login" replace />
  - ถ้าผ่าน: render children
  - Code: แสดงโครงสร้างที่ใช้ใน project/frontend/src/components/ProtectedRoute.tsx
```

### 🗂️ Phase 3: ลำดับการทำงาน (Priority)

```
Priority 1 — Setup (ทำก่อน)
  [ ] ติดตั้ง vitepress-plugin-mermaid
  [ ] แก้ course-outline.md (wk3, wk5, wk8)
  [ ] แก้ course-pattern.md (Mermaid, naming, critical bugs)

Priority 2 — wk1 (สำคัญที่สุด เป็นรากฐาน)
  [ ] ขยาย wk1-content1-intro.md (React theory, Virtual DOM, naming)
  [ ] ขยาย wk1-content2-jsx.md (TSX deep, {} rules, critical bugs)

Priority 3 — wk2-wk4 (เนื้อหา core)
  [ ] wk2-content1: Generic<T> ใน useState + Array/Object immutability
  [ ] wk2-content2: Hook Rules + async useEffect + Cleanup + StrictMode double invoke
  [ ] wk2-content4: TypeScript operators + type vs interface + Record<K,V> + import type + null vs undefined
  [ ] wk3-content1: Responsive prefixes + conditional className
  [ ] wk3-content2: Controlled vs Uncontrolled + e.preventDefault + Accessibility
  [ ] wk4: 3-State pattern + Environment variables + Vite proxy + CORS + HTTP status codes + Promise<T>
  [ ] ตรวจสอบ setup commands ทุก wk

Priority 4 — wk6-wk7 (security + routing)
  [ ] wk6-content1: Security basics
  [ ] wk7-content1: JWT best practices
  [ ] wk7-content2: useNavigate vs window.location + navigate patterns + ProtectedRoute
```

## Mermaid Types ที่ใช้ในหลักสูตร

| Type | ใช้สำหรับ | ตัวอย่าง wk |
|---|---|---|
| `flowchart LR` | Props flow, Data flow | wk1, wk3 |
| `graph TD` | Component tree, File structure | wk1, wk3 |
| `sequenceDiagram` | API request/response cycle | wk4, wk6 |

**กฎ Mermaid:**
```
✅ node label เป็นอังกฤษ: App, EquipmentPage, API
✅ คำอธิบายภาษาไทยวางนอก diagram เป็น paragraph
❌ ห้าม: node["ส่ง props ลงไป"] — Thai ใน node พัง
```

## CSS Progression ที่ตกลงไว้

```
wk1-content1  แนะนำ 3 วิธีแบบสั้น (1 section)
wk1-wk2       ใช้ inline style เท่านั้น
wk3-content1  สอน Tailwind เต็ม + อธิบายว่าทำไม switch
wk3+          ใช้ Tailwind เป็นหลัก
```

## ข้อมูลอ้างอิงในการทำงาน

- **Project answer key:** `project/frontend/src/` — ดูก่อนเขียนทุกครั้ง
- **มาตรฐาน:** TPQI 10302 ระดับ 3 (`Web Based Application Development.txt`)
- **Blueprint:** `course-pattern.md`
- **Outline:** `course-outline.md`
- **Memory:** `c:\Users\dol_7\.claude\projects\...\memory\MEMORY.md`
