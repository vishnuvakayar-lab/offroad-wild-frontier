// OFFROAD: WILD FRONTIER service worker (generated at build). Scope = the folder it is served from (e.g. /preview/).
const CACHE = 'owf-__VERSION__';
const FILES = __FILES__;
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('owf-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !u.pathname.startsWith(new URL(self.registration.scope).pathname)) return; // never outside the scope
  if (e.request.mode === 'navigate') { e.respondWith(fetch(e.request).catch(() => caches.match('index.html'))); return; } // network-first page: new builds show up
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))); // hashed assets: cache-first
});
