import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
/** writes dist/sw.js: precaches the exact build (hashed assets + shell), cache name per version; relative URLs = folder scope */
const serviceWorker = (): Plugin => ({
  name: 'owf-sw', apply: 'build',
  writeBundle(opts, bundle) {
    const out = opts.dir!; const files = ['./', 'index.html', 'manifest.webmanifest', 'favicon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png', ...Object.keys(bundle)];
    const sw = fs.readFileSync('src/sw-template.js', 'utf8').replace('__VERSION__', pkg.version + '-' + Date.now().toString(36)).replace('__FILES__', JSON.stringify([...new Set(files)]));
    fs.writeFileSync(path.join(out, 'sw.js'), sw);
  },
});
export default defineConfig({
  base: './',
  plugins: [serviceWorker()],
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  build: { target: 'es2020', chunkSizeWarningLimit: 4000, sourcemap: false },
  server: { host: true },
  // allow public tunnel hostnames (static built files only) when serving dist/
  preview: { allowedHosts: true },
});
