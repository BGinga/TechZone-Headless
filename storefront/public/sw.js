// public/sw.js

const CACHE_NAME = "tz-pwa-v1";
const APP_SHELL = ["/", "/manifest.webmanifest"];

// ✅ 1. INSTALACIÓN
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ✅ 2. ACTIVACIÓN (limpiar versiones viejas)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k)))
      )
    )
  );
  self.clients.claim();
});

// ✅ 3. ESTRATEGIAS DE CACHÉ
// Helper strategies
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || fetchPromise;
};

const networkFirst = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await cache.match(request);
    return (
      cached ||
      new Response("{}", {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
};

// ✅ 4. INTERCEPTOR DE PETICIONES
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora non-GET
  if (request.method !== "GET") return;

  // API de búsqueda → network-first para frescura
  if (url.pathname.startsWith("/api/search")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Imágenes, fuentes, CSS/JS → stale-while-revalidate
  if (
    request.destination === "image" ||
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"
  ) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // App shell y navegación → stale-while-revalidate básico
  if (request.mode === "navigate" || APP_SHELL.includes(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});