// Service Worker para detectar actualizaciones
// 🔹 IMPORTANTE: Cambia esta versión cada vez que hagas un deploy
const CACHE_VERSION = "v1.0.1";
const CACHE_NAME = `mab-motors-${CACHE_VERSION}`;

// Recursos que siempre queremos cachear
const STATIC_CACHE = ["/", "/index.html", "/no-image.png"];

self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker instalando:", CACHE_VERSION);

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Cacheando recursos estáticos");
        return cache.addAll(STATIC_CACHE);
      })
      .then(() => self.skipWaiting()) // Activa inmediatamente
  );
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activado:", CACHE_VERSION);

  // Limpia cachés antiguos
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(
              (name) => name.startsWith("mab-motors-") && name !== CACHE_NAME
            )
            .map((name) => {
              console.log("🗑️ Eliminando caché antiguo:", name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia: Network first, fallback to cache
self.addEventListener("fetch", (event) => {
  // Solo cachear GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Solo cachear respuestas exitosas
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, intenta con caché
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log("📦 Sirviendo desde caché:", event.request.url);
            return cachedResponse;
          }
          // Si no hay caché, devuelve error
          return new Response("Sin conexión", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
      })
  );
});

// Escucha mensajes del cliente
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
