import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174,
    open: true,
    // Proxy configuration for API endpoints
    proxy: {
      '/health': 'http://localhost:30089',
      '/ops': 'http://localhost:30089',
      '/data': 'http://localhost:30089',
      '/game': 'http://localhost:30089',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
