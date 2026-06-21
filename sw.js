const CACHE_VERSION = 'pianoflow-v1-mobile-pwa';
const APP_CACHE = `${CACHE_VERSION}-app`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './css/styles.css',
  './js/chord-library.js',
  './js/pattern-library.js',
  './js/practice-library.js',
  './js/storage.js',
  './js/piano-engine.js',
  './js/audio-engine.js',
  './js/midi-engine.js',
  './js/notation-engine.js',
  './js/session-generator.js',
  './js/player.js',
  './js/app.js',
];

const VEROVIO_HOST = 'www.verovio.org';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, './index.html'));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  if (url.hostname === VEROVIO_HOST) {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return caches.match(request, { ignoreSearch: true })
      .then(match => match || caches.match(fallbackUrl));
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  const refresh = fetch(request)
    .then(response => {
      if (response && response.ok) {
        caches.open(APP_CACHE).then(cache => cache.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => null);

  return cached || refresh || caches.match('./index.html');
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone());
  return response;
}
