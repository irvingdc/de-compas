import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared'),
      '@firebase-config': path.resolve(__dirname, '../../packages/firebase-config'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
}) 