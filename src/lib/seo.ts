/**
 * SEO configuration & helpers.
 *
 * SITE_URL is the canonical, production origin used inside JSON-LD,
 * canonical links, OG/Twitter URLs and the build-time sitemap. It must NOT
 * contain a trailing slash.
 */
export const SITE_URL = 'https://pikart.ir'
export const SITE_NAME = 'پی‌کارت'
export const SITE_NAME_EN = 'Pikart'
export const SITE_LOCALE = 'fa_IR'
export const DEFAULT_LANG = 'fa'

export const DEFAULT_TITLE = 'پی‌کارت | مارکت‌پلیس سرویس‌های دیجیتال'
export const DEFAULT_DESCRIPTION =
  'خرید اشتراک‌های دیجیتال، اکانت‌های پرمیوم، گیفت‌کارت و سرویس‌های هوش مصنوعی با بهترین قیمت، تحویل آنی و ضمانت اصالت در پی‌کارت.'
export const DEFAULT_OG_IMAGE = '/images/og/og-default.svg'

export const TWITTER_HANDLE = '@pikart_ir'

/**
 * Build an absolute URL from an in-app path. Empty / undefined returns the site root.
 */
export function absoluteUrl(path?: string | null): string {
  if (!path) return SITE_URL + '/'
  if (/^https?:\/\//i.test(path)) return path
  const clean = path.startsWith('/') ? path : '/' + path
  return SITE_URL + clean
}

/**
 * Truncate to a sensible meta-description length (Google ~150-160 chars).
 * Strips newlines and collapses whitespace.
 */
export function clampDescription(input: string | null | undefined, max = 158): string {
  if (!input) return DEFAULT_DESCRIPTION
  const s = input.replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return s.slice(0, max - 1).replace(/[\s,،.;:!?؟]+$/, '') + '…'
}

/**
 * Canonical absolute URL for a route path. Currently the site uses
 * History-API style paths (`/s/<slug>`, `/c/<slug>`, ...). The hash-routed
 * variants exist only as legacy fallbacks and redirect on load.
 */
export function canonicalUrl(path: string): string {
  return absoluteUrl(path)
}
