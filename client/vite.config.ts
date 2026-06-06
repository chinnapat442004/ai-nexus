import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      // อนุญาตให้ Popup จาก Google OAuth
      // สื่อสารกลับมายังหน้าเว็บได้
      // ลดปัญหา Cross-Origin-Opener-Policy และ ปัญหาต่างๆที่เกิดจาก Google Login ใน Development
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
});
