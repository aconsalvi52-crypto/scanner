const CACHE_NAME = 'bio-scanner-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Network-First Strategy: Siempre busca la versión más nueva si hay internet.
// Si no hay internet (offline), usa la versión guardada en caché.
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Guarda la nueva versión en caché para usarla luego si no hay internet
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Fallback: si no hay internet, carga la versión guardada
        return caches.match(event.request);
      })
  );
});
