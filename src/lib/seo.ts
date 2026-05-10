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
/**
 * 1200×630 PNG used by every social-preview unfurler when a route
 * doesn't supply its own image. We deliberately use PNG (not SVG):
 * Facebook, LinkedIn and Slack ignore SVG og:images entirely.
 */
export const DEFAULT_OG_IMAGE = '/images/og/og-default.png'

export const TWITTER_HANDLE = '@pikart_ir'

/**
 * Public, human-readable contact details. These are surfaced both in the
 * UI (header phone/email link, contact page) and in the Organization
 * JSON-LD's `telephone` / `email` / `contactPoint` fields. The `_TEL`
 * variant is the E.164 form `tel:` URLs and JSON-LD expect; the
 * `_DISPLAY` variant uses Persian digits for the Header chip.
 */
export const CONTACT_PHONE_TEL = '+982191009200'
export const CONTACT_PHONE_DISPLAY = '۰۲۱-۹۱۰۰۹۲۰۰'
export const CONTACT_EMAIL = 'info@pikart.ir'
/**
 * Postal address used in the Organization JSON-LD `address` field.
 * Currently a province-level address — once the legal registration is
 * complete, replace with the registered street + postal code.
 */
export const CONTACT_ADDRESS = {
  addressCountry: 'IR',
  addressRegion: 'تهران',
  addressLocality: 'تهران',
}

/**
 * Public social-media URLs the operator has chosen to publicly associate
 * with the brand. Used both:
 *   - as the `sameAs` array in the Organization JSON-LD (E-E-A-T signal
 *     — Google can confirm "this is the same entity" across the web), and
 *   - to render the social-icon row in the Footer.
 *
 * Values are read from build-time env vars (`VITE_PIKART_INSTAGRAM`,
 * `VITE_PIKART_TWITTER`, `VITE_PIKART_TELEGRAM`, `VITE_PIKART_WHATSAPP`)
 * so the operator can fill them in via Vercel project settings without
 * editing source. Entries with empty URLs are skipped everywhere.
 */
export type SocialNetwork = 'instagram' | 'twitter' | 'telegram' | 'whatsapp'

export type SocialLink = {
  network: SocialNetwork
  /** Public profile URL. Leave empty to hide the icon and skip JSON-LD. */
  url: string
  /** Persian aria-label rendered in the Footer. */
  labelFa: string
}

/**
 * Read a build-time env var, supporting both Vite (`import.meta.env`,
 * substituted at client build time) and Node tsx (`process.env`, used by
 * the prerender script). Either context returning a non-empty value
 * wins, so the operator only has to set the var once in their build env.
 */
function readEnv(name: string): string {
  const viteEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  const fromVite = viteEnv?.[name]
  if (typeof fromVite === 'string' && fromVite.length > 0) return fromVite.trim()
  const fromNode =
    typeof process !== 'undefined' && process.env ? process.env[name] : undefined
  if (typeof fromNode === 'string' && fromNode.length > 0) return fromNode.trim()
  return ''
}

function socialUrlFromEnv(name: string): string {
  return readEnv(name)
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    network: 'instagram',
    url: socialUrlFromEnv('VITE_PIKART_INSTAGRAM'),
    labelFa: 'اینستاگرام پی‌کارت',
  },
  {
    network: 'twitter',
    url: socialUrlFromEnv('VITE_PIKART_TWITTER'),
    labelFa: 'توییتر پی‌کارت',
  },
  {
    network: 'telegram',
    url: socialUrlFromEnv('VITE_PIKART_TELEGRAM'),
    labelFa: 'کانال تلگرام پی‌کارت',
  },
  {
    network: 'whatsapp',
    url: socialUrlFromEnv('VITE_PIKART_WHATSAPP'),
    labelFa: 'واتس‌اپ پی‌کارت',
  },
]

/**
 * Search-engine site verification tokens. Each search engine asks you to
 * paste a `<meta name="..." content="...">` into your homepage to confirm
 * ownership before it shows you indexing data. We read all four from env
 * so the operator can paste them once into Vercel without rebuilding the
 * code.
 */
export type VerificationMeta = { name: string; content: string }
const VERIFICATION_ENV_VARS: { name: string; envVar: string }[] = [
  { name: 'google-site-verification', envVar: 'VITE_GOOGLE_SITE_VERIFICATION' },
  { name: 'yandex-verification', envVar: 'VITE_YANDEX_VERIFICATION' },
  { name: 'msvalidate.01', envVar: 'VITE_BING_VERIFICATION' },
]

/** Returns only the verification metas that actually have a token configured. */
export function getVerificationMetas(): VerificationMeta[] {
  return VERIFICATION_ENV_VARS.flatMap(({ name, envVar }) => {
    const content = readEnv(envVar)
    return content ? [{ name, content }] : []
  })
}

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
export const ENAMAD_IFRAME_HTML = readEnv('VITE_ENAMAD_IFRAME_HTML')

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
