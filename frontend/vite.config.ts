import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // reroute requests to the backend
  server: {
    host: '0.0.0.0',
    proxy: {
      '/health': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/files': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/shortTermRentals': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/chart2': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/area': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/geojson': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/mapData': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
      '/downloadData': {
        target: process.env.VITE_BACKEND_URL || 'https://be.fp-p21.fwe24.ivia.ch',
        changeOrigin: true,
      },
    },
  }
})
