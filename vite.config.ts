import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { target: 'es2020', chunkSizeWarningLimit: 4000, sourcemap: false },
  server: { host: true },
  // allow public tunnel hostnames (static built files only) when serving dist/
  preview: { allowedHosts: true },
});
