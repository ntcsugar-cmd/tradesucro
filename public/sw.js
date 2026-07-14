/**
 * TradeSucro Service Worker (Basic PWA Foundation)
 * --------------------------------------------------------------------
 * Scope: app-shell caching + offline fallback. This is intentionally a
 * "basic" service worker per the v1.9 brief — it does not attempt full
 * offline data sync (the app has no real backend to sync against yet).
 *
 * Strategy:
 *   - Navigations (HTML pages): network-first, falling back to the
 *     cached page, then to /offline.html if nothing is cached.
 *   - Static assets (icons, manifest): cache-first, since they never
 *     change without a new deployment.
 *
 * Push notifications: TradeSucro has no push backend yet, so the
 * `push` and `notificationclick` listeners below are wired but inert —
 * they define the contract (payload shape, click routing) so a real
 * push server can be dropped in later without touching this file
 * again. See FUTURE READY in the v1.9 brief.
 */

const CACHE_VERSION = "tradesucro-v2"; // v2: official brand identity (App Identity System v1.0) — bumped so installed clients pick up the new icons
const APP_SHELL_CACHE = `${CACHE_VERSION}-shell`;

const APP_SHELL_URLS = [
  "/offline.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("tradesucro-") && key !== APP_SHELL_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith("/icons/") || url.pathname === "/manifest.json") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
  }
});

/* ------------------------------------------------------------------ */
/* Future Ready: Push Notifications                                    */
/* ------------------------------------------------------------------ */

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "TradeSucro", body: event.data.text() };
  }

  const title = payload.title || "TradeSucro";
  const options = {
    body: payload.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    data: { url: payload.url || "/dashboard" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(targetUrl));
      if (existing) return existing.focus();
      return self.clients.openWindow(targetUrl);
    })
  );
});
