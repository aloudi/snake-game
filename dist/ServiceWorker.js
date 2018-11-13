const cacheName = 'cache1';
const files = [
  '/',
  '/index.html',
  '/bundle.js',
  '/fonts/webpixel_bitmap_bold.otf',
  '/fonts/webpixel_bitmap.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  // eslint-disable-next-line no-console
  console.log('I am working service worker on installing phase');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(files))
  );
});

self.addEventListener('activate', event => {
  // eslint-disable-next-line no-console
  console.log('I am working service worker on activating phase');
  self.clients.claim();
  const cacheWhiteList = [cacheName];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhiteList.includes(cacheName)) return caches.delete(cacheName);
        })
      ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        // eslint-disable-next-line no-console
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      // eslint-disable-next-line no-console
      console.log('Network request for ', event.request.url);

      return fetch(event.request)
        .then(response => {
          caches.open(cacheName)
            .then(cache => {
              cache.put(event.request.url, response);
            })
            .catch(err => console.error(err));

          return response.clone();
        });
    }).catch(err => console.error(err))
  );
});
