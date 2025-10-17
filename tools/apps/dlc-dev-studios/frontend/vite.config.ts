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
    port: 5173,
    open: true,
    // Optional: Proxy configuration for API endpoints
    // Uncomment if you need to proxy API requests through the dev server
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:30089',
    //     changeOrigin: true,
    //   },
    //   '/health': {
    //     target: 'http://localhost:30089',
    //     changeOrigin: true,
    //   },
    // },
  },
})
