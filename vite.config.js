import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps every path relative, so the built `dist` folder works on any
// static host (or a sub-folder) without extra configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
})
