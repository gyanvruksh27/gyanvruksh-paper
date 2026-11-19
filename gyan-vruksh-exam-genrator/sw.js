const CACHE_NAME = 'gyan-vruksh-exam-v1';
const urlsToCache = [
  './index.html',
  './settings.html',
  './question-bank.html',
  './paper-builder.html',
  './solutions.html',
  './css/dashboard.css',
  './css/forms.css',
  './css/question-bank.css',
  './css/paper-builder.css',
  './css/solutions.css',
  './css/pdf-print.css',
  './js/app.js',
  './js/settings.js',
  './js/question-bank.js',
  './js/builder.js',
  './js/solutions.js',
  './js/pdf-generator.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch Data (Offline Support)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});