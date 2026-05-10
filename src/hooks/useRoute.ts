import { useCallback, useEffect, useState } from 'react'

/** Parsed route. The pathname (no query, no hash) plus search params. */
export type Route = {
  path: string
  params: URLSearchParams
}

/** Strip trailing slashes — `/s/chatgpt/` and `/s/chatgpt` route the same. */
function normalisePath(p: string | undefined | null): string {
  if (!p || p === '/') return '/'
  const stripped = p.replace(/\/+$/, '')
  return stripped || '/'
}

function parseLocation(initial?: { path?: string; params?: Record<string, string> } | null): Route {
  // Server-side / Node: use whatever the prerender script passed in.
  if (typeof window === 'undefined') {
    const params = new URLSearchParams()
    if (initial?.params) {
      for (const [k, v] of Object.entries(initial.params)) params.set(k, v)
    }
    return { path: normalisePath(initial?.path), params }
  }
  const { pathname, search, hash } = window.location

  // Legacy hash route (`#/foo`, `#/foo?bar=baz`) — translate to history API.
  if ((!pathname || pathname === '/') && hash.startsWith('#/')) {
    const raw = hash.slice(1)
    const [hp, hq = ''] = raw.split('?')
    return { path: normalisePath(hp), params: new URLSearchParams(hq) }
  }

  return {
    path: normalisePath(pathname),
    params: new URLSearchParams(search.startsWith('?') ? search.slice(1) : search),
  }
}

function buildHref(path: string, params?: URLSearchParams | Record<string, string | number | null | undefined>): string {
  let qs: string
  if (params instanceof URLSearchParams) {
    qs = params.toString()
  } else if (params) {
    const sp = new URLSearchParams()
    for (const [k, v] of Object.entries(params)) {
      if (v == null || v === '') continue
      sp.set(k, String(v))
    }
    qs = sp.toString()
  } else {
    qs = ''
  }
  return qs ? `${path}?${qs}` : path
}

/**
 * History API based router. Treats URLs like `/s/foo`, `/c/bar?page=2` as
 * first-class routes (good for SEO and social sharing).
 *
 * Backward compat: if the user lands on the site via a legacy hash URL
 * (e.g. `https://pikart.ir/#/s/foo`) we transparently rewrite it to the
 * canonical `/s/foo` form via `history.replaceState` on first render.
 *
 * `initial` is consumed during the SSR pass so the server-rendered tree
 * matches the route the prerender script targets (e.g. `/s/chatgpt`).
 * Browser callers should leave it undefined — the hook reads
 * `window.location` instead.
 */
export function useRoute(initial?: { path?: string; params?: Record<string, string> } | null): {
  route: Route
  navigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  setParams: (updates: Record<string, string | number | null | undefined>) => void
} {
  const [route, setRoute] = useState<Route>(() => parseLocation(initial))

  // One-shot: rewrite legacy `#/...` URLs to history-API URLs on first load.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const { hash, pathname } = window.location
    if ((!pathname || pathname === '/') && hash.startsWith('#/')) {
      const raw = hash.slice(1)
      const [hp, hq = ''] = raw.split('?')
      const dest = buildHref(hp || '/', new URLSearchParams(hq))
      window.history.replaceState({}, '', dest)
      setRoute(parseLocation())
    }
  }, [])

  // Listen for back/forward + custom in-app navigations.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onPop = () => setRoute(parseLocation())
    window.addEventListener('popstate', onPop)
    window.addEventListener('pikart:navigate', onPop as EventListener)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('pikart:navigate', onPop as EventListener)
    }
  }, [])

  const navigate = useCallback(
    (path: string, params?: Record<string, string | number | null | undefined>) => {
      if (typeof window === 'undefined') return
      const dest = buildHref(path, params)
      const current = window.location.pathname + window.location.search
      if (dest !== current) {
        window.history.pushState({}, '', dest)
        window.dispatchEvent(new Event('pikart:navigate'))
      }
      // ensure scroll to top on path change
      const samePath = path === window.location.pathname || path === route.path
      if (!samePath) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      }
    },
    [route.path],
  )

  const setParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      if (typeof window === 'undefined') return
      const next = new URLSearchParams(window.location.search)
      for (const [k, v] of Object.entries(updates)) {
        if (v == null || v === '') next.delete(k)
        else next.set(k, String(v))
      }
      const dest = buildHref(window.location.pathname, next)
      const current = window.location.pathname + window.location.search
      if (dest !== current) {
        window.history.replaceState({}, '', dest)
        window.dispatchEvent(new Event('pikart:navigate'))
      }
    },
    [],
  )

  return { route, navigate, setParams }
}
