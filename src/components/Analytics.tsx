import { useEffect } from 'react'

/**
 * Google Analytics 4 — env-driven, lazy, SPA-aware.
 *
 * Behaviour:
 *   - Reads `VITE_GA4_ID` (e.g. `G-XXXXXXXXXX`) from `import.meta.env`.
 *     If unset or empty (the default until the user has a real domain
 *     and a GA property to point at), the component is a no-op and
 *     emits zero requests.
 *   - Loads `gtag.js` once with `async` so it never blocks LCP, then
 *     fires the initial `page_view` for the landing URL.
 *   - Listens for our internal `pikart:navigate` event (dispatched by
 *     `useRoute` on every SPA navigation) plus the native `popstate`
 *     event, and re-fires `page_view` with the new path. This is what
 *     makes engagement metrics meaningful for a history-API SPA.
 *   - Side-effect only — renders nothing.
 *
 * Privacy: `anonymize_ip` is forced on. We do not load anything until
 * the env var is set, so this is GDPR-clean by default; once a real
 * GA4 ID is in play, you may want to gate the `enable()` call on a
 * cookie banner.
 */
export function Analytics({ currentPath }: { currentPath: string }) {
  const measurementId = (import.meta.env.VITE_GA4_ID ?? '').trim()
  const enabled = Boolean(measurementId) && typeof window !== 'undefined'

  // 1) One-shot script injection.
  useEffect(() => {
    if (!enabled) return
    if (document.getElementById('ga4-loader')) return

    const w = window as Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
    w.dataLayer = w.dataLayer ?? []
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer!.push(args)
    }

    w.gtag('js', new Date())
    w.gtag('config', measurementId, {
      anonymize_ip: true,
      // Let us drive page_view on SPA navigation manually.
      send_page_view: false,
    })

    const script = document.createElement('script')
    script.id = 'ga4-loader'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
    document.head.appendChild(script)
  }, [enabled, measurementId])

  // 2) Per-route page_view.
  useEffect(() => {
    if (!enabled) return
    const w = window as Window & { gtag?: (...args: unknown[]) => void }
    if (typeof w.gtag !== 'function') return
    w.gtag('event', 'page_view', {
      page_path: currentPath,
      page_location: window.location.href,
      page_title: document.title,
    })
  }, [enabled, currentPath])

  return null
}
