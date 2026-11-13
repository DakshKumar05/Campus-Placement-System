import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    // Calls to /api/... are forwarded to the Spring Boot backend, so the
    // browser sees one origin and no CORS setup is needed.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
