import { useEffect } from 'react'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  TWITTER_HANDLE,
  absoluteUrl,
} from '../lib/seo'

export type SEOConfig = {
  /** Page title — wrapped automatically with site name unless `rawTitle` is true. */
  title?: string
  /** If true, use `title` exactly without appending site name. */
  rawTitle?: boolean
  description?: string
  /** Path on the site (e.g. "/s/foo"). Used for canonical + og:url. */
  path: string
  /** Optional absolute or site-relative image URL for og:image / twitter:image. */
  image?: string | null
  /** OpenGraph type. Defaults to "website". Use "product" on service pages. */
  ogType?: string
  /** If true, set <meta name="robots" content="noindex,follow">. Defaults to false. */
  noindex?: boolean
  /** Optional list of JSON-LD payloads to inject. */
  jsonLd?: Array<Record<string, unknown> | null>
}

/**
 * Updates document.title, meta tags, canonical link and JSON-LD scripts for
 * the current page. Cleans up its injected JSON-LD blocks on unmount/change so
 * stale schemas don't pile up across navigations.
 */
export function useSEO(config: SEOConfig): void {
  const {
    title,
    rawTitle,
    description,
    path,
    image,
    ogType = 'website',
    noindex = false,
    jsonLd,
  } = config

  // Stable serialisation so we only re-inject when the actual payload
  // changes, not on every render that creates a new array reference.
  const jsonLdKey = JSON.stringify(jsonLd ?? null)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const finalTitle = rawTitle
      ? title || DEFAULT_TITLE
      : title
        ? `${title} | ${SITE_NAME}`
        : DEFAULT_TITLE
    document.title = finalTitle

    const canonical = absoluteUrl(path)
    const desc = (description ?? DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()
    const img = image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE)

    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow')

    setMeta('property', 'og:type', ogType)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', SITE_LOCALE)
    setMeta('property', 'og:title', finalTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:url', canonical)
    setMeta('property', 'og:image', img)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:site', TWITTER_HANDLE)
    setMeta('name', 'twitter:title', finalTitle)
    setMeta('name', 'twitter:description', desc)
    setMeta('name', 'twitter:image', img)

    setLink('canonical', canonical)

    // hreflang — site is fa-IR; we expose the same URL as default for now
    setLink('alternate', canonical, { hreflang: 'fa-IR' })
    setLink('alternate', canonical, { hreflang: 'x-default' })

    const payloads: Array<Record<string, unknown>> = jsonLdKey
      ? (JSON.parse(jsonLdKey) ?? []).filter(
          (x: unknown): x is Record<string, unknown> => Boolean(x),
        )
      : []
    const removers = payloads.map((payload, i) =>
      injectJsonLd(payload, `seo-jsonld-${i}`),
    )

    return () => {
      for (const remove of removers) remove()
    }
  }, [title, rawTitle, description, path, image, ogType, noindex, jsonLdKey])
}

function setMeta(attr: 'name' | 'property', key: string, value: string): void {
  const sel = `meta[${attr}="${cssEscape(key)}"]`
  let el = document.head.querySelector<HTMLMetaElement>(sel)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  if (el.getAttribute('content') !== value) {
    el.setAttribute('content', value)
  }
}

function setLink(rel: string, href: string, attrs: Record<string, string> = {}): void {
  const extra = Object.entries(attrs)
    .map(([k, v]) => `[${k}="${cssEscape(v)}"]`)
    .join('')
  const sel = `link[rel="${cssEscape(rel)}"]${extra}`
  let el = document.head.querySelector<HTMLLinkElement>(sel)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
    document.head.appendChild(el)
  }
  if (el.getAttribute('href') !== href) el.setAttribute('href', href)
}

function injectJsonLd(payload: Record<string, unknown>, id: string): () => void {
  const elId = `${id}-${(payload as { '@type'?: string })['@type'] ?? 'data'}`
  let el = document.getElementById(elId) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = elId
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(payload)
  const created = el
  return () => {
    if (created.parentNode) created.parentNode.removeChild(created)
  }
}

// CSS.escape polyfill-lite — only used for our own keys, so a simple version is fine.
function cssEscape(value: string): string {
  return value.replace(/(["\\])/g, '\\$1')
}

// Re-export so pages can import a single SEO entry-point.
export { SITE_URL }
