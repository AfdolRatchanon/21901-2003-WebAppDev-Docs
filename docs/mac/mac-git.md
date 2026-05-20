# Git & GitHub บน Mac — ตั้งแต่ศูนย์จนถึง Push <Badge type="tip" text="บทเรียนพิเศษ" />

> **บทนี้เตรียมอะไร:** ใช้ Git และ GitHub บน Mac ได้ตั้งแต่ตั้งค่าครั้งแรก จนถึง push โค้ดขึ้น GitHub — ครอบคลุม GitHub CLI (gh), SSH key, .gitignore สำหรับ Mac และวิธีล้างข้อมูลก่อนคืนเครื่องที่ใช้ร่วมกัน

## 🎯 M: Motivation

::: danger 🚨 ปัญหาที่เกิดขึ้นจริง
นักเรียนที่ย้ายมาจาก Windows มักงงกับ Git บน Mac เพราะ: ไม่มี Git Bash ให้ดาวน์โหลด, พิมพ์ password แล้วไม่มีอะไรขึ้น, push แล้วได้ error `Permission denied (publickey)` และโปรเจกต์เพื่อนเห็น `.DS_Store` ที่ไม่ควรอยู่ใน repo — ทั้งหมดนี้แก้ได้ใน 30 นาทีถ้ารู้ล่วงหน้า
:::

> 💡 **Mac มี Terminal ที่ดีกว่า Git Bash มาก** — ไม่ต้องติดตั้งอะไรเพิ่ม ใช้ได้เลย

## 📖 I: Information

### ขั้นตอนที่ 1 — ตรวจสอบ Git และตั้งค่าครั้งแรก

Git ติดตั้งมาพร้อม Xcode Command Line Tools แล้ว ตรวจสอบ:

```bash
git --version
# git version 2.x.x (Apple Git-xxx)
```

ตั้งค่า identity — **ทำครั้งเดียว ใช้ได้ทุก repo บนเครื่อง:**

```bash
git config --global user.name "ชื่อจริง นามสกุล"
git config --global user.email "email@example.com"
git config --global init.defaultBranch main
```

ตรวจสอบว่าตั้งค่าถูกต้อง:

```bash
git config --list
# user.name=ชื่อจริง นามสกุล
# user.email=email@example.com
# init.defaultBranch=main
```

::: info 📌 config เก็บที่ไหน?
`~/.gitconfig` — เปิดดูได้ด้วย `cat ~/.gitconfig`
:::

### ขั้นตอนที่ 2 — Workflow พื้นฐาน

::: code-group
```bash [✅ ขั้นตอนส่งงานทุกครั้ง]
# 1) ดูสถานะ — ทำก่อนเสมอ
git status

# 2) เพิ่มไฟล์ที่ต้องการ commit
git add src/components/EquipmentCard.tsx
# หรือเพิ่มทุกไฟล์ที่เปลี่ยน
git add .

# 3) บันทึก snapshot พร้อม message
git commit -m "feat: add EquipmentCard component with status badge"

# 4) ส่งขึ้น GitHub
git push origin main
```

```bash [💡 คำสั่งที่ใช้บ่อย]
git log --oneline        # ดู commit history แบบสั้น
git diff                 # ดูว่าเปลี่ยนอะไรบ้าง (ยังไม่ add)
git diff --staged        # ดูที่ add แล้ว ยังไม่ commit
git restore FileName     # ยกเลิกการแก้ไขไฟล์ (คืนกลับเป็นของเดิม)
git restore --staged .   # un-stage ทุกไฟล์ (ถอนออกจาก add)
```
:::

**สรุป Workflow:** `แก้ code → git status → git add → git commit → git push`

### ขั้นตอนที่ 3 — เชื่อมต่อ GitHub ครั้งแรก

#### สร้าง Repository ใหม่บน GitHub

```
1. เปิด github.com → Sign in
2. คลิก "+" มุมบนขวา → "New repository"
3. ตั้งชื่อ repo เช่น "equipment-checkout"
4. เลือก Public หรือ Private
5. ❌ อย่าติ๊ก "Initialize this repository" (ถ้าจะ push จากเครื่องเรา)
6. คลิก "Create repository"
```

#### ผูก repo ในเครื่องกับ GitHub

```bash
# ทำใน Terminal ที่ folder โปรเจกต์
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

::: tip 💡 `-u` คืออะไร?
`-u` (upstream) ตั้งค่า tracking — push ครั้งต่อไปพิมพ์แค่ `git push` ได้เลย ไม่ต้องระบุ `origin main` ซ้ำ
:::

### ขั้นตอนที่ 4 — GitHub CLI: Login แบบเดียวกับ Windows

บน Windows มี popup browser ให้ login GitHub อัตโนมัติ — Mac ทำได้เหมือนกันด้วย **GitHub CLI (`gh`)**

```bash
# [1] ติดตั้ง GitHub CLI (Homebrew ต้องมีแล้ว)
brew install gh

# [2] login — เลือก HTTPS → Login with a web browser
gh auth login
```

Terminal จะถามทีละขั้น:

```
? What account do you want to log into?          GitHub.com
? What is your preferred protocol?               HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate?            Login with a web browser

! First copy your one-time code: XXXX-XXXX
Press Enter to open github.com in your browser...
✓ Authentication complete.
✓ Logged in as USERNAME
```

::: warning ⚠️ `git push` ยังถามอยู่หลัง `gh auth login`?
ต้องรันเพิ่มอีก 1 คำสั่ง — `gh auth login` เปิด session แต่ยังไม่ได้บอก git ให้ใช้ `gh`:
```bash
gh auth setup-git
```
คำสั่งนี้ตั้งค่า `credential.helper` ให้ git ใช้ `gh` จัดการ token แทน — หลังจากนี้ `git push` จะไม่ถามอีก
:::

::: details 🔧 `gh auth setup-git` แล้วได้ Error — แก้ตามนี้

**แบบที่ 1 — ยังไม่ได้ login:**
```
error connecting to github.com: not logged in
```
```bash
gh auth login    # login ก่อน แล้วค่อยรัน gh auth setup-git ใหม่
```

**แบบที่ 2 — credential.helper ชนกับของเดิม (พบบ่อยที่สุด):**
```
error: cannot run credential helper '/usr/local/bin/gh auth git-credential'
```
```bash
# เคลียร์ credential helper เดิมก่อน
git config --global --unset-all credential.helper

# ตั้งค่าใหม่
gh auth setup-git

# ตรวจสอบ
git config --global credential.helper
# /opt/homebrew/bin/gh auth git-credential  ← ถูกต้อง
```

**แบบที่ 3 — `gh` หาไม่เจอ:**
```
zsh: command not found: gh
```
```bash
# Homebrew PATH ยังไม่ได้ตั้ง — เพิ่มเข้า .zshrc
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
source ~/.zshrc

# ลองใหม่
gh auth setup-git
```
:::

ตรวจสอบว่าตั้งค่าสำเร็จ:

```bash
gh auth status
# ✓ Logged in to github.com as USERNAME
# ✓ Git operations for github.com configured to use https protocol

git config --global credential.helper
# /opt/homebrew/bin/gh auth git-credential
```

### ขั้นตอนที่ 5 — SSH Key (วิธีถาวร ไม่ต้องพึ่ง gh)

HTTPS ต้องพิมพ์ password ทุกครั้ง (หรือ PAT) — SSH ใช้ key file แทน เข้าสะดวกกว่ามาก

#### สร้าง SSH Key

```bash
# [1] สร้าง key (ed25519 เป็น algorithm ปัจจุบันที่แนะนำ)
ssh-keygen -t ed25519 -C "email@example.com"

# [2] กด Enter 3 ครั้ง (ใช้ path default + ไม่ตั้ง passphrase)
# Generating public/private ed25519 key pair.
# Enter file in which to save the key (/Users/username/.ssh/id_ed25519): [Enter]
# Enter passphrase (empty for no passphrase): [Enter]
# Enter same passphrase again: [Enter]

# [3] เพิ่ม key เข้า ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

#### คัดลอก Public Key ไปใส่ GitHub

```bash
# [4] copy public key ไปยัง clipboard
pbcopy < ~/.ssh/id_ed25519.pub
# (pbcopy คือ copy to clipboard บน Mac — ไม่มีบน Windows)
```

```
GitHub:
  Settings → SSH and GPG keys → New SSH key
  → Title: "MacBook Air M4"
  → Key: วาง (⌘+V)
  → Add SSH key
```

#### เปลี่ยน remote จาก HTTPS เป็น SSH

```bash
# [5] ตรวจสอบ remote ปัจจุบัน
git remote -v
# origin  https://github.com/USERNAME/REPO.git (fetch)

# [6] เปลี่ยนเป็น SSH
git remote set-url origin git@github.com:USERNAME/REPO.git

# [7] ทดสอบ
ssh -T git@github.com
# Hi USERNAME! You've successfully authenticated...
```

::: info 💡 SSH URL vs HTTPS URL
```
HTTPS:  https://github.com/USERNAME/REPO.git
SSH:    git@github.com:USERNAME/REPO.git
```
:::

### ขั้นตอนที่ 6 — .gitignore สำหรับ Mac

Mac สร้างไฟล์ `.DS_Store` ในทุกโฟลเดอร์อัตโนมัติ — ไม่ควรอยู่ใน repo

::: warning ⚠️ .DS_Store คืออะไร?
ไฟล์ hidden ที่ Finder สร้างเพื่อเก็บ metadata ของโฟลเดอร์ (icon positions, view settings) — ไม่มีประโยชน์ต่อโค้ด และสร้าง noise ใน git diff
:::

`.gitignore` มาตรฐานสำหรับโปรเจกต์นี้:

```gitignore
# Mac
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes

# Node.js
node_modules/
dist/
.env
.env.local

# Editor
.vscode/settings.json
*.log
```

::: tip 💡 ถ้า .DS_Store ถูก track ไปแล้ว
```bash
# ลบออกจาก tracking โดยไม่ลบไฟล์จริง
git rm -r --cached .DS_Store
git commit -m "chore: remove .DS_Store from tracking"
```
:::

### ขั้นตอนที่ 7 — Clone และ Branch

```bash
# Clone repo จาก GitHub มาเครื่อง
git clone git@github.com:USERNAME/REPO.git
cd REPO

# สร้าง branch ใหม่สำหรับ feature
git checkout -b feature/borrow-form

# ดู branch ทั้งหมด
git branch

# สลับกลับ main
git checkout main

# Merge branch เข้า main
git merge feature/borrow-form
```

::: code-group
```bash [✅ Branch Workflow]
git checkout -b feature/login-page   # สร้างและสลับ branch ใหม่
# ... แก้ code ...
git add .
git commit -m "feat: add login page with form validation"
git push origin feature/login-page   # push branch ขึ้น GitHub
# เปิด Pull Request บน GitHub
```

```bash [❌ ทำทุกอย่างบน main]
# ไม่แนะนำสำหรับงานทีม
# ถ้าพัง main จะพังทั้งทีม
```
:::

### ขั้นตอนที่ 8 — คืนเครื่อง: ล้างข้อมูลก่อนส่ง

::: danger 🔴 ต้องทำทุกครั้งก่อนส่งเครื่อง — ไม่ว่าจะใช้วิธีไหน
ถ้าไม่ล้าง นักเรียนคนถัดไปอาจ push code ขึ้น GitHub ของเราได้โดยไม่รู้ตัว
:::

::: code-group
```bash [วิธี GitHub CLI (gh)]
# [1] logout gh — ลบ token ออกจาก Keychain
gh auth logout

# [2] ลบ credential helper ที่ gh ตั้งไว้
git config --global --unset-all credential.helper

# [3] ลบ git identity
git config --global --unset user.name
git config --global --unset user.email

# [4] ตรวจสอบ
gh auth status             # You are not logged into any GitHub hosts
git config --global user.name  # ไม่มีผลลัพธ์
```

```bash [วิธี SSH Key]
# [1] ลบ SSH key files ในเครื่อง
rm -f ~/.ssh/id_ed25519
rm -f ~/.ssh/id_ed25519.pub

# [2] เอา key ออกจาก ssh-agent ที่รันอยู่
ssh-add -D

# [3] ลบ git identity
git config --global --unset user.name
git config --global --unset user.email

# [4] ตรวจสอบ
ssh -T git@github.com      # Permission denied (publickey) ← ถูกต้อง
git config --global user.name  # ไม่มีผลลัพธ์
ls ~/.ssh/                 # ไม่มี id_ed25519
```
:::

::: warning ⚠️ ถ้าใช้ SSH — ต้องลบ public key ออกจาก GitHub ด้วย
ลบไฟล์ในเครื่องอย่างเดียวไม่พอ key ยังอยู่ที่ GitHub และยังใช้ login ได้:
```
GitHub → Settings → SSH and GPG keys
→ หา key ที่ชื่อ "MacBook Air M4" → Delete → ยืนยัน password
```
:::

## 🛠️ A: Application

### 🤖 AI Prompt Guide

::: info 💬 ตัวอย่าง Prompt สำหรับปัญหา Git
**เมื่อ push ไม่ได้:**
"กำลังใช้ Git บน Mac ทำโปรเจกต์ React ได้ error นี้ตอน git push: `Permission denied (publickey)` ใช้ SSH URL แล้ว ขอขั้นตอนตรวจสอบและแก้ไข SSH key บน macOS"

**เมื่อ merge conflict:**
"เกิด merge conflict ในไฟล์ `src/App.tsx` ขณะ git merge ข้อความ conflict แบบนี้: [วาง conflict markers] ช่วยอธิบายวิธีแก้ conflict ทีละขั้นตอน"
:::

::: tip ✅ Mini-Checkpoint ก่อน Lab
- [ ] `git --version` พิมพ์แล้วเห็น version number ✅
- [ ] `git config --list` เห็น `user.name` และ `user.email` ถูกต้อง ✅
- [ ] มี GitHub account พร้อมใช้งาน ✅
:::

### 📝 PjBL Lab — ชิ้นงาน: Push โปรเจกต์ Equipment Checkout ขึ้น GitHub

#### ขั้น 0 — Student Identity

- [ ] เปิด `src/App.tsx` หรือหน้าหลัก — ตรวจว่า `<footer>` ชื่อ-รหัสยังอยู่ ✅

#### ขั้น 1 — ตั้งค่า Git (5 นาที)

- [ ] รัน `git config --global user.name` และ `user.email` ให้ถูกต้อง
- [ ] รัน `git config --list` ตรวจสอบ

#### ขั้น 2 — สร้าง .gitignore (5 นาที)

- [ ] สร้างไฟล์ `.gitignore` ที่ root ของโปรเจกต์
- [ ] ใส่ `.DS_Store`, `node_modules/`, `dist/`, `.env` ✅
- [ ] รัน `git status` — ตรวจว่า `node_modules/` ไม่ปรากฏ

#### ขั้น 3 — ตั้งค่า SSH Key (10 นาที)

- [ ] รัน `ls ~/.ssh/` ตรวจว่ามี `id_ed25519` แล้วหรือยัง
- [ ] ถ้ายังไม่มี: รัน `ssh-keygen -t ed25519 -C "email"` → `ssh-add`
- [ ] `pbcopy < ~/.ssh/id_ed25519.pub` → วางใน GitHub Settings
- [ ] ทดสอบ `ssh -T git@github.com` → เห็น "successfully authenticated" ✅

#### ขั้น 4 — Push โปรเจกต์ (10 นาที)

- [ ] สร้าง repo ใหม่บน GitHub ชื่อ `equipment-checkout`
- [ ] รัน `git init`, `git add .`, `git commit -m "first commit"`
- [ ] รัน `git remote add origin git@github.com:USERNAME/equipment-checkout.git`
- [ ] รัน `git push -u origin main` ✅
- [ ] เปิด GitHub ตรวจว่าเห็นไฟล์ทั้งหมดแล้ว

#### ขั้น Submit — ส่งงาน

- [ ] `git push` ล่าสุดขึ้น GitHub สำเร็จ ✅
- [ ] Google Doc: แปะลิงก์ GitHub repo + screenshot หน้า repo

## ✅ P: Progress

### 🗣️ Code Review

::: details ❓ ทำไมต้องใช้ SSH แทน HTTPS?
**แนวคำตอบ:** HTTPS ต้องพิมพ์ username + password (หรือ Personal Access Token) ทุกครั้ง SSH ใช้ key pair — private key อยู่ในเครื่อง, public key อยู่ที่ GitHub — เมื่อ push SSH จะ verify key แทน password ทำให้สะดวกและปลอดภัยกว่า เพราะ key ยาวมากกว่า password มาก
:::

::: details ❓ `git add .` กับ `git add FileName` ต่างกันอย่างไร ควรใช้อันไหน?
**แนวคำตอบ:** `git add .` เพิ่มทุกไฟล์ที่เปลี่ยนใน directory ปัจจุบัน — สะดวกแต่อาจเพิ่มไฟล์ที่ไม่ต้องการ (เช่น `.env` ถ้าลืมใส่ .gitignore) `git add FileName` เพิ่มทีละไฟล์ — ควบคุมได้แม่นยำกว่า สำหรับมือใหม่แนะนำ `git add .` แต่ต้อง `git status` ก่อนเสมอเพื่อตรวจว่าจะ commit อะไร
:::

::: details ❓ ทำไม commit message ถึงสำคัญ?
**แนวคำตอบ:** commit message คือ "บันทึกการทำงาน" ที่ทีมและตัวเองในอนาคตจะอ่าน `git log --oneline` แสดง message ทุก commit ถ้าเขียนว่า "fix" หรือ "update" ไม่รู้ว่าแก้อะไร pattern ที่ดี: `type: description` เช่น `feat: add login form`, `fix: correct status badge color`, `chore: update .gitignore`
:::

::: details ❓ `git restore` กับ `git reset` ต่างกันอย่างไร?
**แนวคำตอบ:** `git restore FileName` — ยกเลิกการแก้ไขไฟล์ที่ยังไม่ได้ add (คืนกลับเป็น version ของ commit ล่าสุด) `git restore --staged FileName` — un-stage ไฟล์ออกจาก index (ยังเก็บการแก้ไขไว้) `git reset --hard` — อันตราย: ยกเลิกทุกอย่างกลับไป commit ที่ระบุ ไม่ควรใช้ถ้าไม่แน่ใจ
:::

### 🐛 Common Errors

| อาการ | สาเหตุ | วิธีแก้ |
| :--- | :--- | :--- |
| `Permission denied (publickey)` | SSH key ยังไม่ได้ผูกกับ GitHub | `ssh -T git@github.com` ตรวจสอบ — ถ้าไม่ผ่านให้สร้าง key ใหม่และเพิ่มใน GitHub Settings |
| `git push` แล้วขอ username/password | ยังไม่ได้ตั้งค่า credential helper | รัน `gh auth login` แล้วตามด้วย `gh auth setup-git` |
| `gh auth login` แล้ว push ยังถามอยู่ | ลืมรัน `gh auth setup-git` | รัน `gh auth setup-git` — คำสั่งนี้แยกจาก login |
| `src refspec main does not match any` | ยังไม่มี commit แรกเลย | `git add .` แล้ว `git commit -m "first commit"` ก่อน push |
| `.DS_Store` ปรากฏใน `git status` | ลืมสร้าง `.gitignore` | สร้าง `.gitignore` แล้วใส่ `.DS_Store` — ถ้า track แล้วให้ `git rm --cached .DS_Store` |
| `fatal: not a git repository` | ยังไม่ได้ init หรือ cd ผิด folder | `git init` หรือ `cd` เข้าโฟลเดอร์โปรเจกต์ก่อน |
| พิมพ์ password แล้วไม่มีอะไรขึ้น | ปกติของ Unix — Terminal ซ่อน input | พิมพ์ต่อแล้ว Enter ได้เลย |

### 📚 CLIL Vocabulary

| Technical Term | คำอ่าน | Meaning in Context |
| :--- | :--- | :--- |
| `Repository` | รี-พอส-ซิ-ทอ-รี | โฟลเดอร์โปรเจกต์ที่ Git ติดตาม — มักเรียกสั้นว่า repo |
| `Commit` | คอม-มิท | บันทึก snapshot ของโค้ด ณ เวลานั้น พร้อม message |
| `Push` | พุช | ส่ง commit จากเครื่องขึ้น remote (GitHub) |
| `Pull` | พูล | ดึง commit จาก remote มายังเครื่อง |
| `Clone` | โคลน | คัดลอก repo จาก GitHub มาเครื่องทั้งหมด |
| `Branch` | แบรนช์ | สาขาของ commit history — ทำงานแยกโดยไม่กระทบ main |
| `Merge` | เมิร์จ | รวม branch กลับเข้า main |
| `Remote` | รี-โมท | ที่อยู่ของ repo บน server เช่น GitHub — ชื่อ default คือ `origin` |
| `SSH Key` | เอส-เอส-เอช คีย์ | คู่ key สำหรับยืนยันตัวตน — private อยู่เครื่อง, public อยู่ GitHub |
| `gh` | จี-เอช | GitHub CLI — เครื่องมือจัดการ GitHub จาก Terminal รวมถึง auth |
| `gh auth login` | จี-เอช ออธ โล-กิน | เข้าสู่ระบบ GitHub ผ่าน browser — เก็บ token ใน Keychain |
| `gh auth setup-git` | จี-เอช ออธ เซ็ต-อัพ-กิท | บอก git ให้ใช้ gh เป็น credential helper — ต้องรันหลัง login |
| `pbcopy` | พี-บี-คอ-พี | คำสั่ง Mac สำหรับ copy ข้อความเข้า clipboard จาก Terminal |
| `.gitignore` | ดอท-กิท-อิก-นอร์ | ไฟล์กำหนดรายชื่อไฟล์/โฟลเดอร์ที่ Git ไม่ต้องติดตาม |
| `.DS_Store` | ดอท-ดี-เอส-สโตร์ | ไฟล์ hidden ที่ Mac สร้างอัตโนมัติ — ไม่ควรอยู่ใน repo |
