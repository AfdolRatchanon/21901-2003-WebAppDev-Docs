# คู่มือ MacBook Air M4 — สำหรับผู้ใช้ Windows ครั้งแรก <Badge type="tip" text="บทเรียนพิเศษ" />

> **บทนี้เตรียมอะไร:** ปรับตัวใช้ MacBook Air M4 ได้ภายใน 1 ชม. — ครอบคลุมทุกสิ่งที่ผู้ใช้ Windows ต้องรู้ก่อนเริ่มเขียนโค้ด

## 🎯 ทำไมต้องเรียนรู้ Mac?

::: danger 🚨 ปัญหาที่เกิดขึ้นจริง
นักเรียนที่ใช้ Windows มาทั้งชีวิต เมื่อได้รับ MacBook เครื่องแรก มักเสียเวลา 2-3 วันแรกไปกับปัญหาเล็กน้อย เช่น หาปุ่ม right-click ไม่เจอ, กด ⌘+Q แล้วงงว่าทำไม app หาย, พิมพ์ sudo password แล้วคิดว่าแป้นพิมพ์เสีย — ทั้งที่ถ้ารู้ล่วงหน้า 1 ชม. จะไม่มีปัญหาเหล่านี้เลย
:::

> 💡 **Mac ไม่ยากกว่า Windows** — แค่คิดต่างกัน เรียนรู้ความต่างก่อน แล้วทุกอย่างจะไหลลื่นเอง

## 🧠 Part 1: คิดแบบ Mac — สำคัญที่สุด

### Window ≠ Application

::: danger 🔴 ความเข้าใจผิดที่พบบ่อยที่สุด
```
Windows:  ปิดหน้าต่าง = ปิดโปรแกรม
Mac:      ปิดหน้าต่าง = แค่ซ่อนหน้าต่าง โปรแกรมยังรันอยู่
```
:::

```
⌘+W  =  ปิดหน้าต่าง  (window ยังอยู่ใน Dock, app ยังรัน)
⌘+Q  =  ปิดโปรแกรม  (quit จริงๆ)
⌘+H  =  ซ่อนทุกหน้าต่างของ app นั้น (ยังรันอยู่)
⌘+M  =  Minimize เข้า Dock

สังเกต: ถ้า app รันอยู่จะมีจุดเล็กๆ ใต้ icon ใน Dock
```

### Menu Bar อยู่บนสุดของจอ — เปลี่ยนตาม App

```
Windows:  เมนู File / Edit / View อยู่ข้างในหน้าต่างของแต่ละโปรแกรม
Mac:      เมนูทุกอย่างอยู่ที่ด้านบนสุดของจอเสมอ
          และเปลี่ยนตาม app ที่กำลัง active อยู่

ตัวอย่าง:
  กำลังใช้ VS Code → เมนูบนแสดง File/Edit/Selection/View...
  คลิกที่ Finder   → เมนูบนเปลี่ยนเป็น File/Edit/View/Go/Window...
```

### Full Screen ≠ Maximize

```
Windows:  กด □ → window ขยายเต็มจอ ยังอยู่ที่เดิม
Mac:      กดปุ่มเขียว → app หายไปใน Space ใหม่ (Fullscreen Space)
          ต้องปัด 3 นิ้วซ้าย/ขวา หรือ Mission Control ถึงจะหาเจอ

ถ้าแค่อยากขยาย window ใหญ่ขึ้น (ไม่ fullscreen):
  → Option + คลิกปุ่มเขียว
```

## 🖱️ Part 2: Trackpad — ทุก Gesture

### ค่า Default ของ Mac ที่ต้องรู้

::: info 💡 การกด Trackpad
Mac default = ต้องกดลงไปเพื่อ click (จะได้ยินเสียงคลิก)
ต่างจาก Windows trackpad บางรุ่นที่แค่แตะก็ click ได้
:::

::: info 💡 Natural Scroll — ทิศทางเลื่อนต่างจาก Windows
```
Mac default (Natural Scroll เปิดอยู่):
  เลื่อนนิ้วลง  →  หน้าเลื่อนขึ้น  (เหมือนเลื่อนกระดาษจริง)

Windows default:
  เลื่อนนิ้วลง  →  หน้าเลื่อนลง

อาจสับสนใน 2-3 วันแรก แต่ส่วนใหญ่จะคุ้นเองโดยธรรมชาติ
```
:::

### ตาราง Gesture ทั้งหมด

| นิ้ว | Gesture | ผลลัพธ์ |
| :---: | :--- | :--- |
| **1** | Tap (ถ้าเปิด Tap to Click) | Click |
| **1** | Double Tap | Double Click |
| **1** | กดหนัก (Force Click) | Lookup / Quick Preview |
| **1** | Tap + Drag | ลาก item |
| **2** | Tap | Right-Click |
| **2** | Scroll ↑↓←→ | เลื่อนหน้า |
| **2** | Double Tap เบาๆ | Smart Zoom (zoom เต็มที่ทันที) |
| **2** | Pinch in / out | Zoom ทีละนิด |
| **2** | Swipe ← | Back (Browser / Finder) |
| **2** | Swipe → | Forward (Browser / Finder) |
| **3** | Swipe ↑ | Mission Control (เห็นทุก window) |
| **3** | Swipe ↓ | App Exposé (window ของ app นี้) |
| **3** | Swipe ← → | สลับระหว่าง Desktop / Spaces |
| **3** | Drag (ต้องเปิดใน Accessibility ก่อน) | ย้าย Window |
| **4** | Pinch เข้า | Launchpad (grid ทุก app) |
| **4** | Spread ออก | แสดง Desktop |

### Force Click — กดหนักกว่าปกติ

```
สิ่งที่ Force Click ทำได้:
  กดที่คำ    → popup แปลความหมาย / dictionary ทันที
  กดที่ไฟล์  → Quick Look preview (เหมือนกด Space)
  กดที่ link → preview หน้าเว็บโดยไม่ต้องเปิด tab ใหม่
```

### Palm Rejection

```
ขณะพิมพ์ มือวางบน trackpad บ้างเป็นเรื่องปกติ
Mac จะ ignore การสัมผัสนั้นโดยอัตโนมัติ
แต่ถ้าวางนิ้วค้างนานเกินไป อาจ register เป็น input
→ ถ้าหน้าจอเปลี่ยนเองระหว่างพิมพ์ มักเกิดจากนี้
```

## ⌨️ Part 3: Keyboard & Shortcuts

### ปุ่มหลัก — ต่างจาก Windows

| ปุ่ม Mac | สัญลักษณ์ | เทียบ Windows | หน้าที่ |
| :--- | :---: | :--- | :--- |
| **Command** | ⌘ | Ctrl | Copy, Paste, Save, Undo |
| **Option** | ⌥ | Alt | Special characters |
| **Control** | ⌃ | (ไม่มีตรงๆ) | Terminal shortcuts |
| **Fn** | fn | Fn | Delete / Home / End / F-keys |

### Shortcuts เปรียบ Windows ↔ Mac

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| Copy | Ctrl+C | ⌘+C |
| Paste | Ctrl+V | ⌘+V |
| Cut (text) | Ctrl+X | ⌘+X |
| Undo | Ctrl+Z | ⌘+Z |
| **Redo** | **Ctrl+Y** | **⌘+Shift+Z** |
| Save | Ctrl+S | ⌘+S |
| Select All | Ctrl+A | ⌘+A |
| Find | Ctrl+F | ⌘+F |
| **Open Settings ทุก app** | — | **⌘+, (comma)** |
| **Force Quit** | Ctrl+Alt+Del | **⌘+Option+Esc** |
| **Spotlight / Search** | Win key | **⌘+Space** |
| Switch App | Alt+Tab | ⌘+Tab |
| **Switch Window ใน App เดียวกัน** | — | **⌘+`** (backtick) |
| **New tab** | Ctrl+T | ⌘+T |
| Close tab/window | Ctrl+W | ⌘+W |
| **Quit App** | Alt+F4 | **⌘+Q** |

### Delete / Home / End — ต่างมาก

| ทำอะไร | Mac | หมายเหตุ |
| :--- | :--- | :--- |
| ลบตัวซ้าย cursor | Delete | = Backspace บน Windows |
| **ลบตัวขวา cursor** | **Fn + Delete** | Windows มีปุ่ม Delete ตรงๆ |
| ลบทั้งคำ (ซ้าย) | Option + Delete | |
| ลบทั้งบรรทัด (ซ้าย) | ⌘ + Delete | |
| ไปต้นบรรทัด | ⌘ + ← | = Home บน Windows |
| ไปปลายบรรทัด | ⌘ + → | = End บน Windows |
| เลือกถึงต้นบรรทัด | ⌘ + Shift + ← | |
| เลือกถึงปลายบรรทัด | ⌘ + Shift + → | |

### Screenshot

| Shortcut | ผลลัพธ์ |
| :--- | :--- |
| ⌘ + Shift + 3 | ถ่ายทั้งจอ → บันทึก Desktop |
| ⌘ + Shift + 4 | เลือกพื้นที่ → บันทึก Desktop |
| ⌘ + Shift + 4 แล้วกด Space | ถ่าย window ที่เลือก |
| ⌘ + Shift + 5 | เมนูครบ (รวม Record Screen) |

::: tip 💡 Screenshot Annotation
หลังถ่าย screenshot จะมีภาพเล็กๆ ลอยมุมล่างขวา 3 วินาที
คลิกที่ภาพนั้น → เปิด Markup editor เพื่อวาด/เขียน/crop ก่อนบันทึก
:::

### Special Characters สำหรับ Dev

::: warning ⚠️ ตำแหน่งปุ่มบน Thai Keyboard ต่างจาก US
ถ้ากำลังใช้ Thai keyboard layout อยู่ ปุ่ม backtick, pipe, tilde จะอยู่คนละที่
สลับไปใช้ US layout ก่อนเขียนโค้ดเสมอ (Caps Lock หรือ ⌃+Space)
:::

| Symbol | ชื่อ | หาได้จาก (US layout) | ใช้ใน |
| :--- | :--- | :--- | :--- |
| `` ` `` | Backtick | ปุ่มซ้าย Tab | Template literals, Markdown |
| `\|` | Pipe | Shift + \ | Terminal commands |
| `~` | Tilde | Shift + `` ` `` | Home path `~/` |
| `@` | At | Shift + 2 | Email, decorators |

::: tip 💡 Keyboard Viewer — ดูตำแหน่งปุ่มได้เลย
System Settings → Keyboard → Input Sources → Show Input menu in menu bar
คลิก flag ที่ menu bar → Show Keyboard Viewer
กด Option หรือ Shift ค้างไว้เพื่อดูว่าแต่ละปุ่มพิมพ์อะไรออกมา
:::

## 🗂️ Part 4: Finder & File System

### โครงสร้างโฟลเดอร์ — ไม่มี C:/ D:/

```
Windows:                    Mac:
C:/                         /   (root)
  └─ Users/                   └─ Users/
       └─ Username/                └─ username/   ← ~ (tilde) = home
            ├─ Desktop/                 ├─ Desktop/
            ├─ Documents/               ├─ Documents/
            └─ Downloads/               ├─ Downloads/
D:/                                     └─ Applications/
E:/
```

::: tip 💡 ~ (Tilde) คือ Home
ใน Terminal พิมพ์ `cd ~` กลับ home ได้เสมอ
path `/Users/username/` เขียนย่อเป็น `~/` ได้เลย
:::

### Finder Shortcuts ที่ใช้บ่อย

| Shortcut | ทำอะไร | เทียบ Windows |
| :--- | :--- | :--- |
| Space | Quick Look — preview ไฟล์ทันที | (ไม่มี) |
| Return/Enter | **เปลี่ยนชื่อไฟล์** | = F2 บน Windows |
| ⌘ + Delete | ย้ายไป Trash | = Delete |
| ⌘ + Shift + . | แสดง/ซ่อน hidden files (.env, .gitignore) | (ไม่มี) |
| ⌘ + Shift + G | พิมพ์ path ตรงๆ (Go to Folder) | = address bar |
| ⌘ + ↑ | ขึ้นไป folder บน | = ปุ่ม Up |
| ⌘ + I | Get Info (Properties ของไฟล์) | = Right-click → Properties |
| ⌘ + C แล้ว ⌘ + Option + V | **ย้ายไฟล์ (Move)** | = Ctrl+X แล้ว Ctrl+V |

::: warning ⚠️ Cut ไฟล์บน Mac ต่างจาก Windows
Windows: Ctrl+X → Ctrl+V ย้ายไฟล์ได้เลย
Mac: ⌘+X ใช้ **cut text** เท่านั้น — ไม่ทำงานกับไฟล์ใน Finder
วิธีย้ายไฟล์: **⌘+C** (copy) แล้ว **⌘+Option+V** (move) ที่ปลายทาง
:::

### Trash

```
⌘+Delete              → ย้ายไป Trash (ยังไม่ลบจริง)
⌘+Z หลัง delete      → คืนไฟล์กลับทันที
⌘+Shift+Delete        → Empty Trash (ถามก่อน)
Right-click Trash     → Empty Trash
```

### iCloud Drive — ระวัง

::: warning ⚠️ Desktop/Documents อาจ sync cloud โดยอัตโนมัติ
ถ้า iCloud sync เปิดอยู่ — ไฟล์ในโฟลเดอร์เหล่านี้จะ upload ขึ้น cloud
อาจทำให้โปรเจกต์ขนาดใหญ่ (node_modules) sync ช้ามาก
→ System Settings → Apple ID → iCloud → iCloud Drive → Options
→ ปิด Desktop & Documents Folders sync
:::

## 🪟 Part 5: App & Window Management

### Dock — แทน Taskbar

```
Dock อยู่ด้านล่าง (หรือซ้าย/ขวา ปรับได้):
• จุดเล็กใต้ icon = app กำลังรันอยู่
• Right-click icon → Quit / Options / Show in Finder
• ลาก app ออกจาก Dock = ลบ shortcut (ไม่ได้ลบ app)
• ลาก app จาก Applications เข้า Dock = เพิ่ม shortcut
```

### Mission Control + Spaces

```
3 นิ้ว Swipe ↑  →  Mission Control: เห็นทุก window ทุก desktop

สร้าง Space ใหม่:
  Mission Control → คลิก + มุมบนขวา → Space ใหม่

สลับ Space:
  3 นิ้ว Swipe ← →  หรือ  ⌃+←  /  ⌃+→

แต่ละ Space ใช้ทำอะไร:
  Space 1 = VS Code + Terminal
  Space 2 = Browser
  Space 3 = อื่นๆ
```

### ติดตั้ง / ถอนโปรแกรม

::: code-group
```text [✅ วิธีติดตั้ง .dmg]
1. เปิดไฟล์ .dmg
2. หน้าต่าง Finder เปิดขึ้น เห็น icon ของ app + โฟลเดอร์ Applications
3. ลาก icon ของ app → วางลงในโฟลเดอร์ Applications
4. Eject .dmg (ลาก disk image ไป Trash)
```

```text [✅ วิธีถอน app]
1. เปิด Finder → Applications
2. ลาก app ที่ต้องการลบ → วาง Trash
3. Empty Trash

หรือใช้แอป AppCleaner (ฟรี) เพื่อลบ files ที่เกี่ยวข้องทั้งหมดด้วย
```

```text [⚠️ GateKeeper — "Apple cannot verify"]
เมื่อเปิด app ที่ดาวน์โหลดจากนอก App Store ครั้งแรก:
"App cannot be opened because Apple cannot check it for malicious software"

วิธีแก้:
  System Settings → Privacy & Security
  → ด้านล่างจะมี "App was blocked" → คลิก "Open Anyway"
```
:::

### Force Quit

```
⌘ + Option + Esc  →  เปิด Force Quit window
                      เลือก app ที่ค้าง → Force Quit

หรือ Right-click icon ใน Dock → Force Quit
หรือ Activity Monitor (แทน Task Manager) → Applications → ดับเบิ้ลคลิก → Quit
```

### Split View — Editor + Browser คู่กัน

```
1. กดค้างที่ปุ่มเขียว (Full Screen button) ของ VS Code
2. เลือก "Tile Window to Left of Screen"
3. คลิกเลือก Browser ด้านขวา
→ ได้ split screen Editor + Browser แบบ Windows Snap
```

## 💻 Part 6: Terminal สำหรับ Dev

### เปิด Terminal

```
วิธีที่ 1:  ⌘+Space → พิมพ์ "terminal" → Enter
วิธีที่ 2:  Finder → Applications → Utilities → Terminal
วิธีที่ 3:  ลาก folder จาก Finder → วางใน Terminal icon ใน Dock
            → เปิด Terminal ที่ path นั้นเลย
```

### Path บน Mac

```
Windows:   C:\Users\Username\Documents\project
Mac:       /Users/username/Documents/project
           หรือเขียนย่อว่า ~/Documents/project

สำคัญ:
  / ไม่ใช่ \    (path separator)
  ~ = home      (/Users/username)
  . = current   (โฟลเดอร์ปัจจุบัน)
  .. = parent   (โฟลเดอร์บน)
```

### sudo Password — อย่าตกใจ

::: danger 🔴 นักเรียนมักคิดว่า keyboard เสีย
```
$ sudo npm install -g ...
Password: _

พิมพ์ password ได้เลย — ไม่มีอะไรแสดงบนหน้าจอ
ไม่มี ●●●● ไม่มี *** — เป็นเรื่องปกติของ Unix
กด Enter เมื่อพิมพ์เสร็จ
```
:::

### Terminal Shortcuts ที่ใช้บ่อย

| Shortcut | ทำอะไร |
| :--- | :--- |
| ↑ / ↓ | ดู command ที่พิมพ์ก่อนหน้า / ถัดไป |
| Tab | Autocomplete path หรือ command |
| Tab Tab | แสดงตัวเลือกทั้งหมด |
| Ctrl+C | หยุด process ที่กำลังรันอยู่ |
| Ctrl+R | ค้นหา command เก่าด้วย keyword |
| Ctrl+L | Clear screen (หรือพิมพ์ `clear`) |
| ⌘+T | เปิด Terminal tab ใหม่ |
| ⌘+K | Clear terminal buffer |

### zsh + .zshrc — ต่างจาก Windows

```
Windows:  CMD ใช้ .bat  /  PowerShell ใช้ .ps1
Mac:      ใช้ zsh (Z Shell) — config อยู่ที่ ~/.zshrc

ถ้าต้องเพิ่ม PATH หรือ alias:
  nano ~/.zshrc
  → เพิ่ม export PATH="/opt/homebrew/bin:$PATH"
  → กด Ctrl+O บันทึก, Ctrl+X ออก
  source ~/.zshrc  → โหลดการตั้งค่าใหม่
```

### Xcode Command Line Tools

::: info 📌 จะ popup ครั้งแรกที่ใช้ git
```
$ git --version
→ popup: "The Xcode Command Line Tools are required"
→ กด Install ได้เลย รอ 3-5 นาที
```
นี่คือชุดเครื่องมือ dev พื้นฐาน (git, make, compiler) ไม่ใช่ Xcode ตัวเต็ม
:::

## 🖥️ Part 7: VS Code Shortcuts — Windows vs Mac

### 📝 Editing — ใช้บ่อยที่สุด

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| **Copy line down** (duplicate) | Shift+Alt+↓ | Shift+Option+↓ |
| **Copy line up** | Shift+Alt+↑ | Shift+Option+↑ |
| **Move line down** | Alt+↓ | Option+↓ |
| **Move line up** | Alt+↑ | Option+↑ |
| **Delete entire line** | Ctrl+Shift+K | ⌘+Shift+K |
| **Comment / Uncomment** | Ctrl+/ | ⌘+/ |
| Block comment | Shift+Alt+A | Shift+Option+A |
| **Format document** | Shift+Alt+F | Shift+Option+F |
| Indent more | Ctrl+] | ⌘+] |
| Indent less | Ctrl+[ | ⌘+[ |
| Insert line below | Ctrl+Enter | ⌘+Enter |
| Insert line above | Ctrl+Shift+Enter | ⌘+Shift+Enter |
| **Quick Fix / Lightbulb** | Ctrl+. | ⌘+. |
| Rename Symbol | F2 | F2 |

### 🔍 Search & Navigation

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| **Command Palette** | Ctrl+Shift+P | ⌘+Shift+P |
| **Quick Open (file)** | Ctrl+P | ⌘+P |
| Find in file | Ctrl+F | ⌘+F |
| **Find & Replace** | Ctrl+H | ⌘+Option+F |
| Find in all files | Ctrl+Shift+F | ⌘+Shift+F |
| Replace in all files | Ctrl+Shift+H | ⌘+Shift+H |
| Go to Line | Ctrl+G | ⌃+G |
| **Go to Definition** | F12 | F12 |
| Peek Definition | Alt+F12 | Option+F12 |
| Go Back | Alt+← | ⌃+- |
| Go Forward | Alt+→ | ⌃+Shift+- |

::: warning ⚠️ Find & Replace บน Mac ใช้ ⌘+H ไม่ได้
⌘+H บน Mac = Hide app (ซ่อนหน้าต่าง VS Code ทั้งหมด)
VS Code จึงใช้ **⌘+Option+F** แทนสำหรับ Find & Replace
:::

### 👥 Multi-Cursor — เขียนหลายที่พร้อมกัน

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| **เพิ่ม cursor ล่าง** | Ctrl+Alt+↓ | ⌘+Option+↓ |
| **เพิ่ม cursor บน** | Ctrl+Alt+↑ | ⌘+Option+↑ |
| **เลือก word ถัดไปที่เหมือนกัน** | Ctrl+D | ⌘+D |
| **เลือกทั้งหมดที่เหมือนกัน** | Ctrl+Shift+L | ⌘+Shift+L |
| Column selection (Box) | Shift+Alt+drag | Shift+Option+drag |

```
ตัวอย่าง Multi-Cursor:
  มี const a = 1, const b = 2, const c = 3 อยู่ 3 บรรทัด
  คลิกที่ 'a' → ⌘+D สองครั้ง → เลือก a, b, c พร้อมกัน
  พิมพ์ 'x' → ทั้งสามเปลี่ยนเป็น x พร้อมกัน
```

### 🗂️ Sidebar & Views

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| Toggle Sidebar | Ctrl+B | ⌘+B |
| Explorer (Files) | Ctrl+Shift+E | ⌘+Shift+E |
| Search | Ctrl+Shift+F | ⌘+Shift+F |
| Source Control (Git) | Ctrl+Shift+G | ⌃+Shift+G |
| Extensions | Ctrl+Shift+X | ⌘+Shift+X |
| **Toggle Terminal** | Ctrl+` | ⌃+` |
| New Terminal | Ctrl+Shift+` | ⌃+Shift+` |

### 📑 Tabs & Files

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| New file | Ctrl+N | ⌘+N |
| Save | Ctrl+S | ⌘+S |
| Close tab | Ctrl+W | ⌘+W |
| Reopen closed tab | Ctrl+Shift+T | ⌘+Shift+T |
| Next tab | Ctrl+Tab | ⌃+Tab |
| Previous tab | Ctrl+Shift+Tab | ⌃+Shift+Tab |
| **Split editor** | Ctrl+\ | ⌘+\ |
| Focus group 1/2/3 | Ctrl+1/2/3 | ⌘+1/2/3 |
| Zen Mode (focus) | Ctrl+K Z | ⌘+K Z |

### 💡 Code Intelligence

| ทำอะไร | Windows | Mac |
| :--- | :--- | :--- |
| Trigger IntelliSense | Ctrl+Space | ⌃+Space |
| Show hover info | Ctrl+K Ctrl+I | ⌘+K ⌘+I |
| Format selection | Ctrl+K Ctrl+F | ⌘+K ⌘+F |
| Toggle word wrap | Alt+Z | Option+Z |

::: tip 💡 Shortcut ที่ใช้บ่อยที่สุดใน React/TypeScript
```
⌘+Shift+P    → Command Palette (ทำทุกอย่างได้)
⌘+P          → เปิดไฟล์ที่ต้องการเร็วมาก
⌘+D          → เลือก occurrence ถัดไป (rename variable)
Shift+Option+↓  → duplicate บรรทัด
Option+↓/↑      → ย้ายบรรทัดขึ้น/ลง
⌘+/          → comment/uncomment
Shift+Option+F  → format code ทั้งไฟล์
⌃+`          → เปิด/ปิด Terminal
```
:::

## 💡 Part 8: Tips & Tricks ที่ซ่อนอยู่

### Spotlight — มีมากกว่าแค่เปิด App

```
⌘+Space แล้วพิมพ์:
  "terminal"        → เปิด Terminal
  "15% of 350"      → คิดเลขได้เลย (= 52.5)
  "100 USD in THB"  → แปลงเงินได้เลย
  "5 km in miles"   → แปลงหน่วยได้เลย
  ชื่อไฟล์          → ค้นหาไฟล์ทั่วเครื่อง
```

### Option+Click Menu Bar Icons — ข้อมูลซ่อน

```
Option + click WiFi      → IP address, signal strength, router info
Option + click 🔊        → เลือก audio output/input ทันที
Option + click Battery   → Battery health, cycle count
```

### Control Center — Toggle รวม

```
มุมบนขวาของ menu bar (ไอคอน toggle)
→ WiFi, Bluetooth, AirDrop, Focus Mode, Brightness, Volume
→ ใช้แทนการเข้า System Settings
```

### ⌘+, (Comma) — Settings ทุก App

```
VS Code:  ⌘+,  → Settings
Chrome:   ⌘+,  → Settings
Slack:    ⌘+,  → Preferences
Zoom:     ⌘+,  → Settings

Convention นี้ใช้ได้เกือบทุก app บน Mac
```

### Text Selection Tricks

```
Single click          → วาง cursor
Double click          → เลือกทั้งคำ
Triple click          → เลือกทั้ง paragraph
Shift + Click         → เลือกจาก cursor ถึงที่คลิก
3 นิ้ว Tap บนคำ      → Lookup dictionary / แปลภาษา (ถ้าเปิด)
Option+Click+Drag     → Column selection (ใน VS Code)
```

### Clipboard ไม่มี History

::: warning ⚠️ Mac ไม่มี Clipboard History แบบ Windows (Win+V)
แนะนำติดตั้ง **Maccy** (ฟรี, open source) หรือ **CopyClip**
→ เก็บประวัติ copy ทั้งหมด เรียกดูได้ทุกเมื่อ
:::

### Hot Corners — Shortcut ด้วยมุมจอ

```
System Settings → Desktop & Dock → Hot Corners
ตัวอย่างที่แนะนำ:
  มุมบนซ้าย  → Mission Control
  มุมล่างขวา → Lock Screen
  มุมล่างซ้าย → Desktop
```

### Preview App — PDF และรูป

```
เปิด PDF ด้วย Preview (built-in):
  → Annotate, highlight, sign, merge PDFs
  → Crop/resize รูป
  → ไม่ต้องติดตั้ง Adobe Reader
```

### Quick Actions ใน Finder

```
Right-click ที่ไฟล์ → Quick Actions:
  รูปภาพ → Rotate, Convert Image (PNG/JPEG/HEIC)
  หลายไฟล์ → Create PDF
  ไฟล์ใดก็ได้ → New Terminal at Folder
```

## 🔌 Part 9: Hardware

### USB-C Only — ต้องมี Hub

::: warning ⚠️ MacBook Air M4 ไม่มีช่อง USB-A, HDMI, SD Card
```
มีแค่:
  • 2 × Thunderbolt / USB-C 4
  • 1 × MagSafe (ชาร์จ)
  • 1 × 3.5mm headphone

ต้องมี USB-C Hub ที่มี:
  → USB-A (สำหรับ flash drive)
  → HDMI (สำหรับต่อจอภาพ/โปรเจกเตอร์)
  → SD Card (ถ้าใช้กล้อง)
```
:::

### MagSafe — ออกแบบมาไม่ให้เครื่องตก

```
สาย MagSafe ติดด้วยแม่เหล็ก
ถ้าสะดุดสาย → สายหลุดออกเองทันที ไม่พาเครื่องตกตาม
ชาร์จได้ทั้ง MagSafe และ USB-C (ด้านใดก็ได้)
```

### Eject External Drive ก่อนถอด

::: danger 🔴 อย่าถอด flash drive ออกตรงๆ
```
Windows: มี "Quick Removal" setting ถอดได้เลย
Mac:     ต้อง Eject ก่อนเสมอ มิฉะนั้นไฟล์อาจเสียหาย

วิธี Eject:
  ลาก drive icon ไป Trash (icon เปลี่ยนเป็น Eject)
  หรือ Right-click → Eject
  หรือ Finder sidebar → คลิก ⏏ ข้างชื่อ drive
```
:::

### Battery & Power

```
Sleep (ปิดฝา):    เปิดขึ้นมาทันที, ใช้ไฟน้อยมาก — M4 ยาวมาก
Shutdown:         ⌘ (Apple menu) → Shut Down
Restart:          ⌘ (Apple menu) → Restart
Low Power Mode:   Control Center → Battery → เปิดเมื่อแบตน้อย

ห้ามปิดฝาทิ้งไว้โดยที่ไม่ได้ชาร์จและกำลัง compile/build อยู่
```

## ✅ P: Progress

### 📋 Checklist — ทำครบก่อนเริ่มเรียน

::: tip ✅ ทักษะพื้นฐาน
- [ ] ใช้ 2 นิ้ว tap เป็น right-click ได้ ✅
- [ ] รู้ว่า ⌘+W กับ ⌘+Q ต่างกันอย่างไร ✅
- [ ] ใช้ Mission Control (3 นิ้วขึ้น) ได้ ✅
- [ ] Screenshot ด้วย ⌘+Shift+4 ได้ ✅
- [ ] เปิด Terminal ด้วย ⌘+Space ได้ ✅
- [ ] พิมพ์ sudo password แม้ไม่เห็นอักขระได้ ✅
:::

### 🐛 Common Errors

| อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| App หายไปหลังกดปุ่มเขียว | Full Screen ไปอยู่ Space ใหม่ | 3 นิ้ว Swipe ← → หรือ Mission Control |
| `false` ถูกเปลี่ยนเป็น `False` | พิมพ์โค้ดในแอปที่มี Autocorrect (Notes, TextEdit) | ใช้ VS Code เสมอสำหรับเขียนโค้ด — editor ไม่มี autocorrect |
| `"` กลายเป็น `"` | พิมพ์ใน Notes หรือ Pages ที่มี Smart Quotes | ใช้ VS Code เสมอ — editor ใช้ `"` ตรงๆ เสมอ |
| พิมพ์ sudo password แล้วไม่มีอะไรขึ้น | ปกติของ Unix | พิมพ์ต่อแล้ว Enter ได้เลย |
| App ลาก .dmg ไม่เข้า Applications | ลืม drag | ลากด้วย 1 นิ้ว กดค้างไว้แล้วลากช้าๆ |
| F5 ใน VS Code ไม่ทำงาน | F1-F12 เป็น media keys โดย default | กด **Fn + F5** เสมอเมื่อต้องการ function key |
| ไฟล์ย้ายไม่ได้ด้วย ⌘+X | Cut ไฟล์ไม่มีใน Mac | ⌘+C แล้ว ⌘+Option+V ที่ปลายทาง |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Trackpad` | แทร็ค-แพด | แผ่นสัมผัสแทนเมาส์บน MacBook |
| `Gesture` | เจส-เชอร์ | ท่าทางการสัมผัส trackpad เพื่อสั่งงาน |
| `Mission Control` | มิช-ชัน คอน-โทรล | ภาพรวม window และ Desktop ทั้งหมด |
| `Spaces` | สเปส-เซส | Virtual Desktop — หน้าจอเสมือนหลายจอ |
| `Spotlight` | สปอต-ไลท์ | ช่องค้นหาทุกอย่างใน Mac (⌘+Space) |
| `Finder` | ไฟน์-เดอร์ | โปรแกรมจัดการไฟล์ แทน Windows Explorer |
| `Terminal` | เทอร์-มิ-นัล | โปรแกรม command line ของ Mac |
| `zsh` | ซี-เชลล์ | Z Shell — โปรแกรม shell เริ่มต้นของ Mac |
| `Homebrew` | โฮม-บรู | Package manager สำหรับ Mac |
| `MagSafe` | แมก-เซฟ | หัวชาร์จแม่เหล็ก ออกแบบให้หลุดง่าย |
| `Force Click` | ฟอร์ซ คลิก | กด trackpad หนักกว่าปกติ เพื่อ action พิเศษ |
| `Eject` | อี-เจ็กท์ | นำ drive ออกจากระบบก่อนถอดสาย |
| `GateKeeper` | เกท-คีพ-เปอร์ | ระบบ Security ที่ตรวจ app ก่อนเปิด |
| `Dock` | ด็อค | แถบ shortcut ด้านล่าง แทน Taskbar |
| `Quick Look` | ควิค ลุค | preview ไฟล์ด้วยการกด Space |
