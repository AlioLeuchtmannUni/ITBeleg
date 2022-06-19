self.addEventListener('install', event => event.waitUntil(
    caches.open('PWA-DEMO').then(cache => cache.add('/'))
));

self.addEventListener('fetch', event => event.respondWith(
    caches.open('PWA-DEMO')
    .then(cache => cache.match(event.request))
    .then(response => response || fetch(event.request))
));