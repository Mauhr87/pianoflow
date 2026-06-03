const CACHE_NAME = 'pianoflow-pwa-v7';

const APP_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './css/styles.css?v=visual-refresh-6',
  './js/chord-library.js',
  './js/pattern-library.js',
  './js/practice-library.js?v=fingering-melodies-1',
  './js/storage.js',
  './js/piano-engine.js?v=fit-keyboard-1',
  './js/audio-engine.js',
  './js/midi-engine.js',
  './js/notation-engine.js',
  './js/session-generator.js?v=fingering-melodies-1',
  './js/player.js?v=follow-chords-2',
  './js/app.js?v=app-safe-area-2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
