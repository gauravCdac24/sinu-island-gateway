import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Only scan src/ — prevents Vite from crawling the sanity/ sub-project
    entries: ['src/**/*.{ts,tsx,js,jsx}'],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',  // Listen on all interfaces
    strictPort: true,   // Don't try other ports
    cors: true,         // Enable CORS
    hmr: {
      host: 'localhost',
      port: 3000
    },
    // When VITE_API_URL=/api, dev requests hit the Express app (default port 7000)
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_TARGET || 'http://localhost:7000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') || '/',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  preview: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    sourcemap: false
  }
})