import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
  rollupOptions: {
      external: ['src/lib/aaclData.ts','src/lib/cdwData.ts', 'src/lib/icsData.ts','src/lib/kuimarishaData.ts','src/lib/mamebData.ts','src/lib/npppData.ts','src/lib/vacisKeData.ts', 'src/lib/vacisTzData.ts'],
  },
},
});
