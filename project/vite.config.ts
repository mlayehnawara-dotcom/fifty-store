import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Keep React + charting in the same vendor chunk to avoid manualChunks load-order bugs.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            id.includes('recharts')
          ) {
            return 'vendor-react';
          }

          if (id.includes('framer-motion') || id.includes('gsap') || id.includes('lenis')) {
            return 'motion-stack';
          }

          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }

          if (id.includes('lucide-react') || id.includes('react-hot-toast') || id.includes('react-helmet-async')) {
            return 'ui-kit';
          }
        },
      },
    },
  },
});
