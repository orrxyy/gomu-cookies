import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Base harus sesuai dengan nama repository GitHub kamu
  base: '/gomu-cookies/', 
  plugins: [react(), tailwindcss()],
})
