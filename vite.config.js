import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['react-icons/fa', 'react-icons/go', 'react-icons/lia', 'react-icons/bs', 'react-icons/md'],
          'utility-vendor': ['axios', 'react-helmet-async']
        }
      }
    },
    // Optimize build performance
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    }
  },
  // Optimize development performance
  server: {
    hmr: {
      overlay: false // Disable error overlay for better dev experience
    }
  },
  // Asset optimization
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.webp', '**/*.svg']
})
