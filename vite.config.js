import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: './dist',
    },
    plugins: [react()],
    server: {
    host: true,
    strictPort: true,
    port: 8000,
    },
  };
});