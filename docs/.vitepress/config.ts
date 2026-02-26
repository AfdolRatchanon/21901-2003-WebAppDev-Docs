import { defineConfig } from 'vitepress'

export default defineConfig({
  // ⚠️ GitHub Pages: ถ้า deploy ไปที่ https://USERNAME.github.io/REPO-NAME/
  // ให้เปลี่ยน base เป็น '/REPO-NAME/'  เช่น  base: '/21901-2003/'
  // ถ้าใช้ custom domain หรือ root domain → ใช้ '/' (ค่าเริ่มต้น)
  base: '/',
  lang: 'th-TH',
  title: '21901-2003 Web App Dev',
  description: 'เอกสารประกอบการสอน | React + TypeScript + Tailwind | MIAP + PjBL + CLIL | TPQI 10302',

  themeConfig: {
    siteTitle: 'Web App Dev',

    nav: [
      { text: 'หน้าแรก', link: '/' },
      { text: 'Course Outline', link: '/course-outline' },
    ],

    sidebar: [
      {
        text: '📋 Course Outline',
        items: [
          { text: 'ภาพรวม 9 โมดูล', link: '/course-outline' },
        ],
      },
      {
        text: '📦 wk1 · โครงสร้างพื้นฐาน',
        collapsed: false,
        items: [
          { text: 'โครงสร้าง React + Vite + TypeScript',  link: '/wk1/wk1-content1-intro' },
          { text: 'JSX + Conditional Rendering + .map()',  link: '/wk1/wk1-content2-jsx' },
          { text: 'AI & Prompt Engineering',               link: '/wk1/wk1-content3-ai' },
          { text: '🛠️ Lab: สร้าง Component และ Props',    link: '/wk1/wk1-lab1-components' },
        ],
      },
      {
        text: '🔧 wk2 · State & Hooks',
        collapsed: false,
        items: [
          { text: 'useState — จัดการ State',          link: '/wk2/wk2-content1-state' },
          { text: 'useEffect — Side Effects',          link: '/wk2/wk2-content2-effect' },
          { text: 'Custom Hooks — แยก Logic',         link: '/wk2/wk2-content3-hooks' },
          { text: 'Data Model — Types & Interfaces',  link: '/wk2/wk2-content4-types' },
          { text: '🛠️ Lab: State + Mock Data Array',  link: '/wk2/wk2-lab1-data-mock' },
        ],
      },
      {
        text: '🎨 wk3 · UI + Forms + Validation',
        collapsed: false,
        items: [
          { text: 'Tailwind CSS — Utility Classes',      link: '/wk3/wk3-content1-tailwind' },
          { text: 'Controlled Forms — onChange + value', link: '/wk3/wk3-content2-forms' },
          { text: 'Form Validation + Zod',               link: '/wk3/wk3-content3-validation' },
          { text: '🛠️ Lab: EquipmentPage + BorrowForm',  link: '/wk3/wk3-lab1-asset-form' },
        ],
      },
      {
        text: '🔌 wk4 · API & Database',
        collapsed: false,
        items: [
          { text: 'ติดต่อ API ด้วย Axios',           link: '/wk4/wk4-content1-fetch' },
          { text: 'Async/Await & Loading State',      link: '/wk4/wk4-content2-async' },
          { text: 'Database Schema & API Types',      link: '/wk4/wk4-content3-database' },
          { text: '🛠️ Lab: เชื่อมต่อ API จริง',       link: '/wk4/wk4-lab1-api-connect' },
        ],
      },
      {
        text: '⚖️ wk5 · Midterm + State',
        collapsed: false,
        items: [
          { text: '📝 สอบกลางภาค + Project Review', link: '/wk5/wk5-midterm-exam' },
          { text: 'Props Drilling & useAuth',        link: '/wk5/wk5-content1-props' },
          { text: 'Context API + useContext',        link: '/wk5/wk5-content2-context' },
        ],
      },
      {
        text: '🔐 wk6 · Auth & Session',
        collapsed: false,
        items: [
          { text: 'Cookies & localStorage',            link: '/wk6/wk6-content1-cookies' },
          { text: 'Auth Session & Axios Interceptor',  link: '/wk6/wk6-content2-session' },
          { text: '🛠️ Lab: Login UI + Auth Flow',      link: '/wk6/wk6-lab1-login-ui' },
        ],
      },
      {
        text: '🛡️ wk7 · JWT + Routes + Realtime',
        collapsed: false,
        items: [
          { text: 'JWT: JSON Web Token',                link: '/wk7/wk7-content1-jwt' },
          { text: 'React Router v6 + Protected Routes', link: '/wk7/wk7-content2-routes' },
          { text: 'Real-time ด้วย Socket.io',            link: '/wk7/wk7-content3-realtime' },
          { text: '🛠️ Lab: Navbar + Auth Flow',          link: '/wk7/wk7-lab1-auth-flow' },
        ],
      },
      {
        text: '🚀 wk8 · Test & Deploy',
        collapsed: false,
        items: [
          { text: 'Test Plan — แผนการทดสอบ',        link: '/wk8/wk8-content1-testplan' },
          { text: 'เตรียม Deploy ระบบ',              link: '/wk8/wk8-content2-deploy' },
          { text: '🛠️ Lab: Go-Live Simulation',       link: '/wk8/wk8-lab1-golive' },
        ],
      },
      {
        text: '🏆 wk9 · Final',
        collapsed: false,
        items: [
          { text: '🎤 Project Defense — นำเสนอโปรเจกต์', link: '/wk9/wk9-project-defense' },
          { text: '📝 Final Exam — ทบทวน wk1-9',          link: '/wk9/wk9-final-exam' },
        ],
      },
    ],

    outline: { label: 'สารบัญ', level: [2, 3] },
    socialLinks: [],

    footer: {
      message: 'รายวิชา 21901-2003 การพัฒนาเว็บแอปพลิเคชัน',
      copyright: 'มาตรฐาน TPQI 10302 | Active Learning + PjBL + MIAP + CLIL',
    },

    docFooter: { prev: 'บทก่อนหน้า', next: 'บทถัดไป' },
    returnToTopLabel: 'กลับด้านบน',
    sidebarMenuLabel: 'เมนู',
    darkModeSwitchLabel: 'โหมดมืด',
    search: { provider: 'local' },
  },
})
