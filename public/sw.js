/**
 * pikart.ir Service Worker — runtime caching, no precache.
 *
 * Strategy:
 *   - Hashed Vite assets   (`/assets/index-*.js|css`, `/icons/*`, `/fonts/*`,
 *     `/images/*`)               → cache-first, long lived (immutable).
 *   - Marketplace catalogue (`/data/marketplace.json` and per-service
 *                            `/data/services/*.json`) → stale-while-revalidate
 *                            so repeat visits paint instantly while we
 *                            refresh the cache in the background.
 *   - HTML navigations            → network-first with a cached fallback
 *                            (lets `index.html` updates ship to users on
 *                            the very next request, but still works offline).
 *   - Everything else             → straight passthrough.
 *
 * Cache invalidation between deploys is implicit:
 *   - Asset URLs include a content hash, so a new build produces new keys
 *     and the old ones are eventually evicted by the LRU below.
 *   - HTML is network-first, so users always see the latest navigation
 *     response when online.
 */
const SW_VERSION = 'pikart-v1'
const STATIC_CACHE = `${SW_VERSION}-static`
const DATA_CACHE = `${SW_VERSION}-data`
const HTML_CACHE = `${SW_VERSION}-html`

const STATIC_URL_PATTERN = /\/(assets|icons|fonts|images|imported-images)\//
const DATA_URL_PATTERN = /\/data\/.*\.json$/
const HTML_FALLBACK = '/index.html'

self.addEventListener('install', (event) => {
  // Take over as soon as the new SW finishes installing — keeps cache
  // versions in sync with the deployed JS bundle on the very next paint.
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(SW_VERSION))
          .map((k) => caches.delete(k)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith(networkFirst(req, HTML_CACHE, HTML_FALLBACK))
    return
  }

  if (DATA_URL_PATTERN.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req, DATA_CACHE))
    return
  }

  if (STATIC_URL_PATTERN.test(url.pathname)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE))
    return
  }
})

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(req)
  if (cached) return cached
  try {
    const res = await fetch(req)
    if (res.ok) cache.put(req, res.clone())
    return res
  } catch (err) {
    if (cached) return cached
    throw err
  }
}

async function networkFirst(req, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName)
  try {
    const res = await fetch(req)
    if (res.ok) cache.put(req, res.clone())
    return res
  } catch (err) {
    const cached = await cache.match(req)
    if (cached) return cached
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl)
      if (fallback) return fallback
    }
    throw err
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(req)
  const network = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone())
      return res
    })
    .catch(() => null)
  return cached || (await network) || Response.error()
}
