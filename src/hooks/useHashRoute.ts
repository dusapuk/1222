import { useEffect, useState, useCallback } from 'react'

/** Parsed hash route. The hash is in the form `#/path?query`. */
export type Route = {
  path: string
  params: URLSearchParams
}

function parseHash(hash: string): Route {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const cleaned = raw || '/'
  const [path, search = ''] = cleaned.split('?')
  return {
    path: path || '/',
    params: new URLSearchParams(search),
  }
}

export function useHashRoute(): {
  route: Route
  navigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  setParams: (updates: Record<string, string | number | null | undefined>) => void
} {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined'
      ? { path: '/', params: new URLSearchParams() }
      : parseHash(window.location.hash),
  )

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback(
    (path: string, params?: Record<string, string | number | null | undefined>) => {
      const search = new URLSearchParams()
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v == null || v === '') continue
          search.set(k, String(v))
        }
      }
      const qs = search.toString()
      const next = qs ? `#${path}?${qs}` : `#${path}`
      if (typeof window !== 'undefined') {
        if (window.location.hash !== next) {
          window.location.hash = next
        }
        // ensure scroll to top on path change
        if (path !== route.path) {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
        }
      }
    },
    [route.path],
  )

  const setParams = useCallback(
    (updates: Record<string, string | number | null | undefined>) => {
      const next = new URLSearchParams(route.params.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v == null || v === '') next.delete(k)
        else next.set(k, String(v))
      }
      const qs = next.toString()
      const dest = qs ? `#${route.path}?${qs}` : `#${route.path}`
      window.location.hash = dest
    },
    [route.path, route.params],
  )

  return { route, navigate, setParams }
}
