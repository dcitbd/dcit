/**
 * DREAM CAREER IT - Progressive Web App (PWA) Service Worker
 */
const CACHE_NAME = 'dcit-pwa-v5';
self.addEventListener('install', (e) => {
    self.skipWaiting();
});
self.addEventListener('activate', (e) => {
    e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
