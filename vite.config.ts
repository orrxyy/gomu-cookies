import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './', // Gunakan titik satu agar dia mencari di folder yang sama
  plugins: [react(), tailwindcss()],
})
