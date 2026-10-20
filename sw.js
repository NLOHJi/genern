const CACHE = 'pfgen-v3';
const ASSETS = ['./', './index.html', './style.css', './script.js', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const c = res.clone(); caches.open(CACHE).then(cache => cache.put(e.request, c));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
