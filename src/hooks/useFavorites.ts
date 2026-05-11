import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'pikart:favorites'
const CHANGE_EVENT = 'pikart:favorites-change'

function readFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((v): v is string => typeof v === 'string'))
  } catch {
    return new Set()
  }
}

function writeToStorage(set: Set<string>): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)))
  } catch {
    // localStorage unavailable (private mode / quota). Skip silently.
  }
}

/**
 * Shared favourites store backed by `localStorage`. SSR-safe: the hook
 * starts with an empty set on the server and hydrates from storage on
 * mount. Toggling broadcasts a custom event so every mounted instance
 * (cards, detail page, header counter…) stays in sync without a full
 * context provider.
 */
export function useFavorites(): {
  favorites: Set<string>
  isFavorite: (slug: string) => boolean
  toggleFavorite: (slug: string) => void
} {
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setFavorites(readFromStorage())
    const onChange = () => setFavorites(readFromStorage())
    window.addEventListener(CHANGE_EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const toggleFavorite = useCallback((slug: string) => {
    if (typeof window === 'undefined' || !slug) return
    const current = readFromStorage()
    if (current.has(slug)) current.delete(slug)
    else current.add(slug)
    writeToStorage(current)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites])

  return { favorites, isFavorite, toggleFavorite }
}
