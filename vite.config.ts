import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',  // Listen on all interfaces
    strictPort: true,   // Don't try other ports
    cors: true,         // Enable CORS
    hmr: {
      host: '10.80.210.65',
      port: 3000
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