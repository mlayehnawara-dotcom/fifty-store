import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production build is split intentionally so users download only what each route needs.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    cssCodeSplit: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react/')) {
            return 'react-core';
          }

          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
            return 'motion-stack';
          }

          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }

          if (id.includes('recharts')) {
            return 'charts';
          }

          if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('react-helmet-async')) {
            return 'ui-kit';
          }
        },
      },
    },
  },
});
