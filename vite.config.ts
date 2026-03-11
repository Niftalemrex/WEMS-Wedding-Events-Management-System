import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detect if we are in production (GH Pages) or local dev
const isGHPages = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  base: isGHPages
    ? '/WEMS-Wedding-Events-Management-System/' // GitHub Pages path
    : '/', // Local dev
})