/**
 * SSR / prerender entry point.
 *
 * Built as a separate Vite bundle (see `package.json` → `build:ssr`)
 * and consumed by `scripts/prerender.ts`. The script loads the
 * marketplace data once, then calls `render()` per route to obtain the
 * static body HTML that gets injected into the prerendered template.
 *
 * The browser never loads this file — `src/main.tsx` is the client
 * entry. Keeping the two entries separate means the SSR bundle stays
 * free of `window`-only side effects (CSS imports, hash-route bootstrap,
 * etc.).
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import {
  seedServiceDetail,
  setMarketplaceData,
  type Marketplace,
  type ServiceDetail,
} from './lib/data'
import { seedServiceReviews, type ServiceReview } from './lib/reviews'

export type RenderInput = {
  /** Path the route would have under `window.location.pathname`. */
  path: string
  /** Optional URLSearchParams as a plain object. */
  params?: Record<string, string>
  /** Marketplace catalogue. The same payload the client fetches at runtime. */
  marketplace: Marketplace
  /** Optional per-service detail to seed before render (service pages). */
  serviceDetail?: ServiceDetail | null
  /**
   * Optional per-service reviews to seed before render. When provided,
   * the SSR tree renders the reviews UI inline so server HTML matches
   * the post-hydration tree.
   */
  serviceReviews?: { slug: string; reviews: ServiceReview[] | null } | null
}

export type RenderOutput = {
  /** Static body markup to inject into the `<div id="root">` slot. */
  html: string
}

/**
 * Render the app to an HTML string for a single route. Idempotent —
 * the marketplace + per-service caches are repopulated on every call,
 * so the prerender driver can loop over thousands of routes safely.
 */
export function render(input: RenderInput): RenderOutput {
  setMarketplaceData(input.marketplace)
  if (input.serviceDetail !== undefined) {
    // Seed both the synchronous and async caches. ServiceDetailPage's
    // useState initialiser reads the sync cache so the SSR tree includes
    // the long description / FAQ before any effect runs.
    const slug = input.serviceDetail?.slug
    if (slug) seedServiceDetail(slug, input.serviceDetail)
  }
  if (input.serviceReviews) {
    seedServiceReviews(input.serviceReviews.slug, input.serviceReviews.reviews)
  }

  const html = renderToString(
    <StrictMode>
      <App initialPath={input.path} initialParams={input.params ?? {}} />
    </StrictMode>,
  )
  return { html }
}
