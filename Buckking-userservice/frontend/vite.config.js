import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:8081',
      '/users': 'http://localhost:8081',
      '/roles': 'http://localhost:8081',
      '/profiles': 'http://localhost:8081',
      '/uploads': 'http://localhost:8081',
    }
  }
})
