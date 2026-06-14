const STATIC_CACHE = "busintory-admin-static-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "./offline.html",

  // Core JS
  "/js/config.js",
  "/js/auth.js",
  "/js/navigation.js",
  "/js/app.js",

  // Utilities
  "/js/utils/dom.js",
  "/js/utils/helpers.js",

  // Pages
  "/js/pages/dashboard.js",
  "/js/pages/products.js",
  "/js/pages/brands.js",
  "/js/pages/categories.js",
  "/js/pages/staff.js"
];


self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
      .catch(err => console.error("Failed to cache app shell:", err))
  );
});


self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== STATIC_CACHE)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});


self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore Supabase
  if (url.hostname.includes("supabase.co")) {
    return;
  }

  // HTML pages
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match("./offline.html"))
    );
    return;
  }
  

  // CSS + JS
  if (
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);

    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, response.clone());

    return response;
  } catch {
    return caches.match(request);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);

  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then(response => {
      cache.put(request, response.clone());
      return response;
    });

  return cached || fetchPromise;
}