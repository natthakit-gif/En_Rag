/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ระบุ paths ของไฟล์ที่ใช้ Tailwind CSS
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  // ตัวเลือกการกำหนดค่าเพิ่มเติมของ DaisyUI (ถ้าต้องการ)
  daisyui: {
    themes: ["light", "dark"], // กำหนดธีมที่ต้องการใช้
  },
}
