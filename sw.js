/* Service worker de Mi agenda: permite abrir la app sin internet.
   Al publicar una versión nueva, cambia el número de VERSION. */
const VERSION = "mi-agenda-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./libs/xlsx.full.min.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", event => {
  // Si algún archivo falla, la instalación no se cae: se guarda lo que sí esté disponible.
  event.waitUntil(
    caches.open(VERSION)
      .then(cache => Promise.all(APP_SHELL.map(u => cache.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", event => {
  // Permite actualizar de inmediato desde la página: navigator.serviceWorker.controller.postMessage('actualizar')
  if (event.data === "actualizar") self.skipWaiting();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Páginas: primero la red (para recibir actualizaciones); sin conexión, la copia guardada.
  if (req.mode === "navigate" || (url.origin === location.origin && /\.html?$/.test(url.pathname))) {
    event.respondWith(
      fetch(req)
        .then(res => { const copia = res.clone(); caches.open(VERSION).then(c => c.put("./index.html", copia)); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
    );
    return;
  }

  // Archivos propios, tipografías y librerías: copia guardada y actualización en segundo plano.
  const cacheable = url.origin === location.origin
    || /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)
    || /(^|\.)cdnjs\.cloudflare\.com$/.test(url.hostname)
    || /(^|\.)cdn\.jsdelivr\.net$/.test(url.hostname);
  if (!cacheable) return;

  event.respondWith(
    caches.open(VERSION).then(cache =>
      cache.match(req).then(hit => {
        const red = fetch(req)
          .then(res => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; })
          .catch(() => hit);
        return hit || red;
      })
    )
  );
});
