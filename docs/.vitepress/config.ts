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
          { text: 'React + Vite + TypeScript', link: '/wk1/wk1-content1-intro' },
          { text: 'AI & Prompt Engineering', link: '/wk1/wk1-content2-ai' },
          { text: '🛠️ Lab: Components & Props', link: '/wk1/wk1-lab1-components' },
        ],
      },
      {
        text: '🛠️ wk2 · ฟังก์ชันและข้อมูล',
        collapsed: false,
        items: [
          { text: 'Custom Hooks', link: '/wk2/wk2-content1-hooks' },
          { text: 'Data Model (Interfaces)', link: '/wk2/wk2-content2-types' },
          { text: '🛠️ Lab: State + Mock Data', link: '/wk2/wk2-lab1-data-mock' },
        ],
      },
      {
        text: '🎨 wk3 · UI + Validation',
        collapsed: false,
        items: [
          { text: 'Tailwind CSS', link: '/wk3/wk3-content1-tailwind' },
          { text: 'Form Validation', link: '/wk3/wk3-content2-validation' },
          { text: '🛠️ Lab: ฟอร์มเบิกอุปกรณ์', link: '/wk3/wk3-lab1-asset-form' },
        ],
      },
      {
        text: '🔌 wk4 · API & Database',
        collapsed: false,
        items: [
          { text: 'Axios & API Calls', link: '/wk4/wk4-content1-fetch' },
          { text: 'Async/Await & Loading', link: '/wk4/wk4-content2-async' },
          { text: 'Database Design (Prisma)', link: '/wk4/wk4-content3-database' },
          { text: '🛠️ Lab: เชื่อมต่อ API จริง', link: '/wk4/wk4-lab1-api-connect' },
        ],
      },
      {
        text: '⚖️ wk5 · Midterm + State',
        collapsed: false,
        items: [
          { text: '📝 สอบกลางภาค', link: '/wk5/wk5-midterm-exam' },
          { text: 'Context & Props State', link: '/wk5/wk5-content1-state' },
        ],
      },
      {
        text: '🔐 wk6 · Cookies & Session',
        collapsed: false,
        items: [
          { text: 'Cookies & localStorage', link: '/wk6/wk6-content1-cookies' },
          { text: 'Auth Session & Interceptor', link: '/wk6/wk6-content2-session' },
          { text: '🛠️ Lab: Login + Auth Flow', link: '/wk6/wk6-lab1-login-ui' },
        ],
      },
      {
        text: '🛡️ wk7 · JWT + Routes + RT',
        collapsed: false,
        items: [
          { text: 'JSON Web Token (JWT)', link: '/wk7/wk7-content1-jwt' },
          { text: 'React Router v6', link: '/wk7/wk7-content2-routes' },
          { text: 'Real-time (Socket.io)', link: '/wk7/wk7-content3-realtime' },
          { text: '🛠️ Lab: Auth Flow สมบูรณ์', link: '/wk7/wk7-lab1-auth-flow' },
        ],
      },
      {
        text: '🚀 wk8 · Test & Deploy',
        collapsed: false,
        items: [
          { text: 'Test Plan', link: '/wk8/wk8-content1-testplan' },
          { text: 'Deploy & Environment', link: '/wk8/wk8-content2-deploy' },
          { text: '🛠️ Lab: Go Live', link: '/wk8/wk8-lab1-golive' },
        ],
      },
      {
        text: '🏆 wk9 · Final',
        collapsed: false,
        items: [
          { text: '🎤 Project Defense', link: '/wk9/wk9-project-defense' },
          { text: '📝 Final Exam', link: '/wk9/wk9-final-exam' },
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
