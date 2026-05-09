import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  initMarketplaceData,
  seedServiceDetail,
  type ServiceDetail,
} from './lib/data'

const rootEl = document.getElementById('root')!

/**
 * Read the per-service detail payload that the prerender step inlines
 * as `<script id="__SERVICE_DETAIL__" type="application/json">…</script>`
 * and seed the in-memory cache with it. Doing this *before* hydration
 * means `ServiceDetailPage`'s `useState` initialiser already has the
 * long description / FAQ on the very first render — which is the same
 * tree the SSR step produced, so React doesn't trip a hydration mismatch.
 *
 * On routes without an SSR'd service detail (home, category, static
 * pages, 404) the script is absent and this is a no-op.
 */
function bootstrapFromDom(): void {
  const node = document.getElementById('__SERVICE_DETAIL__')
  if (!node?.textContent) return
  try {
    const detail = JSON.parse(node.textContent) as ServiceDetail
    if (detail?.slug) seedServiceDetail(detail.slug, detail)
  } catch (err) {
    // Malformed payload should not block the rest of the boot.
    console.warn('[bootstrap] failed to parse __SERVICE_DETAIL__', err)
  }
}

/**
 * Detect whether the document was rendered on the server. We treat any
 * non-empty `#root` (other than the initial-loading spinner) as SSR'd
 * markup we should hydrate; an empty / spinner-only root means we fall
 * back to a client-only `createRoot` mount.
 */
function rootHasSsrContent(): boolean {
  if (!rootEl.firstElementChild) return false
  if (rootEl.firstElementChild.id === 'initial-loading') return false
  return true
}

bootstrapFromDom()
registerServiceWorker()

/**
 * Register the runtime cache Service Worker on production builds. Skipped
 * on `npm run dev` (Vite's HMR clashes with SW caching) and on plain
 * `http:` (other than `localhost`) so we don't bind a cache to an
 * insecure origin.
 */
function registerServiceWorker(): void {
  if (typeof navigator === 'undefined') return
  if (!('serviceWorker' in navigator)) return
  if (!import.meta.env.PROD) return
  if (
    window.location.protocol !== 'https:' &&
    window.location.hostname !== 'localhost'
  ) {
    return
  }
  // Defer registration to the `load` event so it never competes with
  // the initial paint or hydration work for bandwidth.
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
      console.warn('[sw] registration failed', err)
    })
  })
}

// Marketplace catalogue is fetched as a separate static asset
// (`/data/marketplace.json`) instead of being inlined in the JS bundle.
// We block the React mount on it so all components see populated data —
// including the very first render that hydrateRoot reconciles against
// the SSR tree.
initMarketplaceData()
  .catch((err) => {
    console.error('[marketplace] failed to load /data/marketplace.json', err)
  })
  .finally(() => {
    const tree = (
      <StrictMode>
        <App />
      </StrictMode>
    )
    if (rootHasSsrContent()) {
      hydrateRoot(rootEl, tree)
    } else {
      // Dev mode (`npm run dev`) and any production HTML that wasn't
      // post-processed by `scripts/prerender.ts` (custom hosts, fallback
      // 404s, etc.) get a plain client mount.
      createRoot(rootEl).render(tree)
    }
  })
