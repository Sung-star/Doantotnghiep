import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'axios'
          ],
          'components': [
            './src/components/layout/Navbar.jsx',
            './src/components/layout/Footer.jsx',
            './src/components/product/ProductCard.jsx'
          ],
          'pages-user': [
            './src/pages/user/Home.jsx',
            './src/pages/user/ProductDetail.jsx',
            './src/pages/user/Cart.jsx',
            './src/pages/user/Checkout.jsx'
          ],
          'pages-admin': [
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/Products.jsx',
            './src/pages/admin/Orders.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild'
  },
  server: {
    port: 3000,
    strictPort: false
  }
})
