// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // ✅ CORRECT PLUGIN
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ✅ Works with Vite (no PostCSS)
  ],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
})
