// Офлайн-работа Оттиска: файлы приложения берутся из кэша, обновление — при новой версии.
const CACHE = 'ottisk-1.2.0-mv9cdl0v';
const PRECACHE = ["./","app.css","app.js","fonts/fonts.css","fonts/golos-text-cyrillic-400-normal.woff2","fonts/golos-text-cyrillic-500-normal.woff2","fonts/golos-text-cyrillic-600-normal.woff2","fonts/golos-text-cyrillic-700-normal.woff2","fonts/golos-text-latin-400-normal.woff2","fonts/golos-text-latin-500-normal.woff2","fonts/golos-text-latin-600-normal.woff2","fonts/golos-text-latin-700-normal.woff2","fonts/golos-text-latin-ext-400-normal.woff2","fonts/golos-text-latin-ext-500-normal.woff2","fonts/golos-text-latin-ext-600-normal.woff2","fonts/golos-text-latin-ext-700-normal.woff2","fonts/jetbrains-mono-cyrillic-400-normal.woff2","fonts/jetbrains-mono-cyrillic-500-normal.woff2","fonts/jetbrains-mono-latin-400-normal.woff2","fonts/jetbrains-mono-latin-500-normal.woff2","fonts/jetbrains-mono-latin-ext-400-normal.woff2","fonts/jetbrains-mono-latin-ext-500-normal.woff2","fonts/unbounded-cyrillic-600-normal.woff2","fonts/unbounded-cyrillic-700-normal.woff2","fonts/unbounded-latin-600-normal.woff2","fonts/unbounded-latin-700-normal.woff2","fonts/unbounded-latin-ext-600-normal.woff2","fonts/unbounded-latin-ext-700-normal.woff2","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","manifest.webmanifest","pdf-boot.mjs","vendor/pdf-lib.min.js","vendor/pdf.min.mjs","vendor/pdf.worker.min.mjs"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
