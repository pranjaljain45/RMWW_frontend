import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: '${import.meta.env.VITE_BACKEND_URL}',   // Your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Strip `/api` prefix
      },
    },
  },
});
