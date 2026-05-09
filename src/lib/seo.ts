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
 * Public social-media URLs the operator has chosen to publicly associate
 * with the brand. Used both:
 *   - as the `sameAs` array in the Organization JSON-LD (E-E-A-T signal
 *     — Google can confirm "this is the same entity" across the web), and
 *   - to render the social-icon row in the Footer.
 *
 * Add real, public URLs here. Entries with an empty `url` are skipped
 * everywhere, so it's safe to leave them partially filled.
 */
export type SocialNetwork = 'instagram' | 'twitter' | 'telegram' | 'whatsapp'

export type SocialLink = {
  network: SocialNetwork
  /** Public profile URL. Leave empty to hide the icon and skip JSON-LD. */
  url: string
  /** Persian aria-label rendered in the Footer. */
  labelFa: string
}

export const SOCIAL_LINKS: SocialLink[] = [
  { network: 'instagram', url: '', labelFa: 'اینستاگرام پی‌کارت' },
  { network: 'twitter', url: '', labelFa: 'توییتر پی‌کارت' },
  { network: 'telegram', url: '', labelFa: 'کانال تلگرام پی‌کارت' },
  { network: 'whatsapp', url: '', labelFa: 'واتس‌اپ پی‌کارت' },
]

/**
 * E-Namad (نماد اعتماد الکترونیکی) embed code provided by enamad.ir
 * after the operator completes the registration. When non-empty, the
 * Footer renders the official trust seal iframe; otherwise we keep the
 * generic guarantee badges and a clearly-labelled "ثبت در حال انجام"
 * placeholder so we never claim a credential we don't have.
 *
 * Paste the raw iframe HTML the enamad.ir dashboard provides (it
 * contains the unique merchant id) into ENAMAD_IFRAME_HTML to switch
 * the placeholder for the real seal.
 */
export const ENAMAD_IFRAME_HTML = ''

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
 * Robots directive emitted on every indexable page. The `max-*-preview`
 * directives explicitly opt-in to large image previews and full snippets
 * in Google SERP — Google falls back to conservative defaults otherwise.
 *
 * Mirrors what Yoast/RankMath emit by default on competing Persian
 * marketplaces (e.g. paymenter.store) so we don't leave SERP real-estate
 * on the table.
 */
export const ROBOTS_INDEX = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
export const ROBOTS_NOINDEX = 'noindex, follow'

/**
 * Map a file extension to an OpenGraph `og:image:type` MIME. Unknown
 * extensions return null so we omit the meta rather than emit a guess.
 */
export function imageMimeFor(url: string | null | undefined): string | null {
  if (!url) return null
  const m = url.toLowerCase().match(/\.([a-z0-9]+)(?:[?#]|$)/)
  if (!m) return null
  switch (m[1]) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    case 'svg':
      return 'image/svg+xml'
    case 'avif':
      return 'image/avif'
    default:
      return null
  }
}

/**
 * Canonical absolute URL for a route path. Currently the site uses
 * History-API style paths (`/s/<slug>`, `/c/<slug>`, ...). The hash-routed
 * variants exist only as legacy fallbacks and redirect on load.
 */
export function canonicalUrl(path: string): string {
  return absoluteUrl(path)
}
