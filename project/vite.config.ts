import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
          const moduleId = id.replaceAll('\\', '/');

          if (
            moduleId.includes('/react/') ||
            moduleId.includes('/react-dom/') ||
            moduleId.includes('/react-router-dom/') ||
            moduleId.includes('/react-is/') ||
            moduleId.includes('/scheduler/')
          ) {
            return 'vendor-react';
          }

          if (
            moduleId.includes('/recharts/') ||
            moduleId.includes('/d3-') ||
            moduleId.includes('/decimal.js-light/') ||
            moduleId.includes('/react-smooth/')
          ) {
            return 'admin-charts';
          }

          if (moduleId.includes('framer-motion') || moduleId.includes('gsap') || moduleId.includes('lenis')) {
            return 'motion-stack';
          }

          if (moduleId.includes('@supabase/supabase-js')) {
            return 'supabase';
          }

          if (moduleId.includes('lucide-react') || moduleId.includes('react-hot-toast') || moduleId.includes('react-helmet-async')) {
            return 'ui-kit';
          }
        },
      },
    },
  },
});
