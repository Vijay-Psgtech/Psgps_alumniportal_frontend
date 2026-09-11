// Service worker intentionally disabled for local development and debugging.
// The browser was intercepting app fetches and causing "Failed to fetch" on localhost.
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.resolve());
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return;
  }

  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(fetch(request).catch(() => caches.match(request)));
});