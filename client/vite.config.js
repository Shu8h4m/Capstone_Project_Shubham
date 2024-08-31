import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8800', // Backend server URL
        changeOrigin: true,
        secure: false,
        // No rewrite function needed here
      },
    },
  },
  },

);