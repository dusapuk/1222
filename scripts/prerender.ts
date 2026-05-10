/**
 * Build-time SEO prerender.
 *
 * After `vite build` and `vite build --ssr`, this script reads
 * `dist/index.html` as a template and emits a per-route HTML file with:
 *   - the correct title / meta / canonical / OG / Twitter / hreflang /
 *     JSON-LD already inlined in <head>, and
 *   - the React tree fully rendered into `<div id="root">` via
 *     `renderToString` (loaded from `dist-ssr/entry-server.js`), plus
 *     a `<script id="__SERVICE_DETAIL__">` payload that lets the
 *     client hydrate without re-fetching the same data.
 *
 * The result is real first-byte HTML for:
 *   - social previews (Telegram/Slack/Twitter ignore JS-injected meta)
 *   - search engines that cache pre-JS HTML for ranking signals
 *   - bots without a JS engine (Bingbot, Yandexbot, ...)
 *
 * Routes prerendered:
 *   - /                  (home)
 *   - /categories        (categories index)
 *   - /c/<slug>          (every category)
 *   - /s/<slug>          (every service)
 *   - /<static>          (about, contact, privacy, terms, refund, faq, guide)
 *   - /404               (noindex stub for SPA fallback hosts)
 *
 * Usage: invoked by `npm run build`. Can also run manually:
 *   npx tsx scripts/prerender.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import {
  seoForAuthorPage,
  seoForBlogIndex,
  seoForBlogPost,
  seoForCategoriesIndex,
  seoForCategory,
  seoForHome,
  seoForNotFound,
  seoForService,
  seoForStaticPage,
} from '../src/lib/seoConfig'
import { AUTHOR_PAGES, STATIC_PAGES } from '../src/lib/staticPages'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  ROBOTS_INDEX,
  ROBOTS_NOINDEX,
  SITE_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  getGeoMetas,
  getVerificationMetas,
  imageMimeFor,
} from '../src/lib/seo'
import type { SEOConfig } from '../src/hooks/useSEO'
import type { Category, Marketplace, Plan, Service, ServiceDetail } from '../src/lib/data'
import { setMarketplaceData } from '../src/lib/data'
import { BLOG_POSTS, getBlogPostsSorted } from '../src/lib/blog'
import type { ServiceReview } from '../src/lib/reviews'

// Hero image per category — inlined here to avoid pulling lucide-react
// (and thus the JSX runtime) into the Node prerender script.
const categoryImages: Record<string, string> = {
  'ai-assistants': '/images/categories/ai-assistants.jpg',
  'ai-image': '/images/categories/ai-image.jpg',
  'ai-video': '/images/categories/ai-video.jpg',
  'ai-voice-music': '/images/categories/ai-voice-music.jpg',
  'ai-writing-seo': '/images/categories/ai-writing-seo.jpg',
  'developer-tools': '/images/categories/developer-tools.jpg',
  'design-creative': '/images/categories/design-creative.jpg',
  'productivity-work': '/images/categories/productivity-work.jpg',
  streaming: '/images/categories/streaming.jpg',
  music: '/images/categories/music.jpg',
  education: '/images/categories/education.jpg',
  'cloud-storage': '/images/categories/cloud-storage.jpg',
  'social-communication': '/images/categories/social-communication.jpg',
  'business-marketing': '/images/categories/business-marketing.jpg',
}
function imageForCategory(slug: string): string | null {
  return categoryImages[slug] ?? null
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')
const distDir = resolve(repoRoot, 'dist')
const ssrDir = resolve(repoRoot, 'dist-ssr')
const templatePath = resolve(distDir, 'index.html')
const ssrEntryPath = resolve(ssrDir, 'entry-server.js')

if (!existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found — run `vite build` first.')
  process.exit(1)
}
if (!existsSync(ssrEntryPath)) {
  console.error(
    '[prerender] dist-ssr/entry-server.js not found — run `vite build --ssr src/entry-server.tsx --outDir dist-ssr` first.',
  )
  process.exit(1)
}

// Dynamic ESM import of the SSR bundle. We use pathToFileURL because Node's
// ESM loader rejects bare absolute paths on Windows.
const ssrModule = (await import(pathToFileURL(ssrEntryPath).href)) as {
  render: (input: {
    path: string
    params?: Record<string, string>
    marketplace: Marketplace
    serviceDetail?: ServiceDetail | null
    serviceReviews?: { slug: string; reviews: ServiceReview[] | null } | null
  }) => { html: string }
}

const marketplace = JSON.parse(
  readFileSync(resolve(repoRoot, 'public/data/marketplace.json'), 'utf8'),
) as { categories: Category[]; services: Service[]; plans: Plan[] }

// Seed `data.ts` so JSON-LD builders that look up categories by slug
// (e.g. `articleLd` resolving `articleSection` to the human-readable
// Persian title) work *before* the SSR `render()` step is invoked.
// `entry-server.tsx` re-seeds with the same payload, which is a no-op.
setMarketplaceData(marketplace as Marketplace)

const categoryById = new Map(marketplace.categories.map((c) => [c.id, c]))
const servicesByCategory = new Map<string, Service[]>()
for (const s of marketplace.services) {
  if (!s.slug) continue
  const arr = servicesByCategory.get(s.categoryId) ?? []
  arr.push(s)
  servicesByCategory.set(s.categoryId, arr)
}
const plansByService = new Map<string, Plan[]>()
for (const p of marketplace.plans) {
  if (!p.serviceId) continue
  const arr = plansByService.get(p.serviceId) ?? []
  arr.push(p)
  plansByService.set(p.serviceId, arr)
}

const template = readFileSync(templatePath, 'utf8')

type Route = {
  path: string
  outFile: string
  seo: SEOConfig
  /** Optional per-service detail to seed before SSR render. */
  serviceDetail?: ServiceDetail | null
  /** Optional per-service review payload to seed before SSR render. */
  serviceReviews?: { slug: string; reviews: ServiceReview[] | null } | null
  /** When true, do not run SSR for this route (kept as a spinner stub). */
  skipSsr?: boolean
}

function fileFor(routePath: string): string {
  if (routePath === '/' || routePath === '') return resolve(distDir, 'index.html')
  // strip leading slash and trailing slash
  const segments = routePath.replace(/^\/+|\/+$/g, '').split('/')
  return resolve(distDir, ...segments, 'index.html')
}

const routes: Route[] = []

routes.push({
  path: '/',
  outFile: fileFor('/'),
  seo: seoForHome({
    categoryCount: marketplace.categories.length,
    serviceCount: marketplace.services.length,
  }),
})

routes.push({
  path: '/categories',
  outFile: fileFor('/categories'),
  seo: seoForCategoriesIndex({
    categoryCount: marketplace.categories.length,
    serviceCount: marketplace.services.length,
    categories: marketplace.categories,
  }),
})

// Must mirror PAGE_SIZE in src/pages/CategoryPage.tsx so rel=next
// targets the same paginated routes the client side router emits.
const CATEGORY_PAGE_SIZE = 24

for (const category of marketplace.categories) {
  if (!category.slug) continue
  const services = (servicesByCategory.get(category.id) ?? []).sort(
    (a, b) =>
      Number(b.isFeatured) - Number(a.isFeatured) ||
      Number(b.isPopular) - Number(a.isPopular),
  )
  const pageCount = Math.max(1, Math.ceil(services.length / CATEGORY_PAGE_SIZE))
  routes.push({
    path: `/c/${category.slug}`,
    outFile: fileFor(`/c/${category.slug}`),
    seo: seoForCategory({
      category,
      services,
      categoryImage: imageForCategory(category.slug),
      page: 1,
      pageCount,
    }),
  })
}

const servicesDir = resolve(repoRoot, 'public/data/services')
const reviewsDir = resolve(repoRoot, 'public/data/reviews')

function loadDetail(slug: string): ServiceDetail | null {
  const path = resolve(servicesDir, `${slug}.json`)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ServiceDetail
  } catch {
    return null
  }
}

/**
 * Read verified reviews for a slug from `public/data/reviews/<slug>.json`
 * if the file exists. Accepts both the wrapper format
 * (`{slug, reviews}`) and a raw array. Returns null when no file is
 * present (most slugs) so SSR + JSON-LD agree to omit the review block.
 */
function loadReviews(slug: string): ServiceReview[] | null {
  const path = resolve(reviewsDir, `${slug}.json`)
  if (!existsSync(path)) return null
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as
      | { reviews?: ServiceReview[] }
      | ServiceReview[]
    const list = Array.isArray(parsed) ? parsed : parsed.reviews ?? []
    if (!Array.isArray(list) || list.length === 0) return null
    return list.filter(
      (r) => Number.isFinite(r.rating) && r.rating >= 1 && r.rating <= 5,
    )
  } catch {
    return null
  }
}

for (const service of marketplace.services) {
  if (!service.slug) continue
  const category = categoryById.get(service.categoryId)
  const plans = plansByService.get(service.id) ?? []
  const cheapest = [...plans]
    .filter((p) => p.priceIrt != null && p.isActive)
    .sort((a, b) => (a.priceIrt ?? 0) - (b.priceIrt ?? 0))[0] ?? null
  const detail = loadDetail(service.slug)
  const reviews = loadReviews(service.slug)
  routes.push({
    path: `/s/${service.slug}`,
    outFile: fileFor(`/s/${service.slug}`),
    seo: seoForService({ service, category, plans, cheapest, detail, reviews }),
    serviceDetail: detail,
    serviceReviews: { slug: service.slug, reviews },
  })
}

// Blog: index + per-post pages. Posts are pure data (TypeScript), so
// no extra IO is needed — we already imported BLOG_POSTS above.
const sortedBlogPosts = getBlogPostsSorted()
routes.push({
  path: '/blog',
  outFile: fileFor('/blog'),
  seo: seoForBlogIndex({ posts: sortedBlogPosts }),
})
for (const post of BLOG_POSTS) {
  const primaryService = marketplace.services.find(
    (s) => s.slug === post.primaryServiceSlug,
  )
  routes.push({
    path: `/blog/${post.slug}`,
    outFile: fileFor(`/blog/${post.slug}`),
    seo: seoForBlogPost({ post, primaryService: primaryService ?? null }),
  })
}

for (const page of STATIC_PAGES) {
  routes.push({
    path: page.path,
    outFile: fileFor(page.path),
    seo: seoForStaticPage(page),
  })
}

for (const author of AUTHOR_PAGES) {
  routes.push({
    path: author.path,
    outFile: fileFor(author.path),
    seo: seoForAuthorPage(author),
  })
}

routes.push({
  path: '/404',
  outFile: fileFor('/404'),
  seo: seoForNotFound('/404'),
})

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function metaTag(attr: 'name' | 'property', key: string, value: string): string {
  return `<meta ${attr}="${escapeHtml(key)}" content="${escapeHtml(value)}" />`
}

function linkTag(rel: string, href: string, extra: Record<string, string> = {}): string {
  const attrs = Object.entries(extra)
    .map(([k, v]) => `${k}="${escapeHtml(v)}"`)
    .join(' ')
  return `<link rel="${escapeHtml(rel)}" href="${escapeHtml(href)}"${attrs ? ' ' + attrs : ''} />`
}

function buildHead(seo: SEOConfig): {
  title: string
  description: string
  canonical: string
  tags: string[]
  jsonLd: string[]
} {
  const finalTitle = seo.rawTitle
    ? seo.title || DEFAULT_TITLE
    : seo.title
      ? `${seo.title} | ${SITE_NAME}`
      : DEFAULT_TITLE
  const desc = (seo.description ?? DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()
  const canonical = absoluteUrl(seo.path)
  const img = seo.image ? absoluteUrl(seo.image) : absoluteUrl(DEFAULT_OG_IMAGE)
  const ogType = seo.ogType ?? 'website'
  const robots = seo.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX
  const imgMime = imageMimeFor(img)
  const imgAlt = (seo.imageAlt ?? finalTitle).replace(/\s+/g, ' ').trim()

  const tags: string[] = [
    metaTag('name', 'description', desc),
    metaTag('name', 'robots', robots),
    metaTag('property', 'og:type', ogType),
    metaTag('property', 'og:site_name', SITE_NAME),
    metaTag('property', 'og:locale', SITE_LOCALE),
    metaTag('property', 'og:title', finalTitle),
    metaTag('property', 'og:description', desc),
    metaTag('property', 'og:url', canonical),
    metaTag('property', 'og:image', img),
    metaTag('property', 'og:image:secure_url', img),
  ]
  if (imgAlt) tags.push(metaTag('property', 'og:image:alt', imgAlt))
  if (imgMime) tags.push(metaTag('property', 'og:image:type', imgMime))
  if (seo.imageWidth) tags.push(metaTag('property', 'og:image:width', String(seo.imageWidth)))
  if (seo.imageHeight) tags.push(metaTag('property', 'og:image:height', String(seo.imageHeight)))

  tags.push(
    metaTag('name', 'twitter:card', 'summary_large_image'),
    metaTag('name', 'twitter:site', TWITTER_HANDLE),
    metaTag('name', 'twitter:title', finalTitle),
    metaTag('name', 'twitter:description', desc),
    metaTag('name', 'twitter:image', img),
  )
  if (imgAlt) tags.push(metaTag('name', 'twitter:image:alt', imgAlt))
  tags.push(
    linkTag('canonical', canonical),
    linkTag('alternate', canonical, { hreflang: 'fa-IR' }),
    linkTag('alternate', canonical, { hreflang: 'x-default' }),
  )

  if (seo.linkRelPrev) tags.push(linkTag('prev', seo.linkRelPrev))
  if (seo.linkRelNext) tags.push(linkTag('next', seo.linkRelNext))

  // Search engine site verification — Google Search Console / Yandex
  // Webmaster / Bing Webmaster ask for a per-property `<meta>` token to
  // confirm ownership before they expose indexing dashboards. We emit
  // these on every page (it's cheap, and putting them only on `/` means
  // re-verification fails on `*.vercel.app` previews where the home
  // template might not be rendered).
  for (const v of getVerificationMetas()) {
    tags.push(metaTag('name', v.name, v.content))
  }

  // Legacy geo metas — Yandex/Bing still consult `geo.region`,
  // `geo.placename`, `geo.position` and `ICBM` for local relevance.
  // Empty-by-default: getGeoMetas returns nothing if env vars aren't
  // set, so we never emit blank meta tags.
  for (const g of getGeoMetas()) {
    tags.push(metaTag('name', g.name, g.content))
  }

  // Per-page LCP image preload — for product pages the hero is the
  // service logo, which is also the og:image. Preloading it lets the
  // browser fetch it in parallel with the JS bundle and shaves
  // 300-600ms off LCP on the detail route.
  if (seo.image && seo.ogType === 'product') {
    const preloadAttrs: Record<string, string> = {
      as: 'image',
      fetchpriority: 'high',
    }
    if (imgMime) preloadAttrs.type = imgMime
    tags.push(linkTag('preload', img, preloadAttrs))
  }

  const jsonLd: string[] = []
  for (const payload of seo.jsonLd ?? []) {
    if (!payload) continue
    // JSON-LD must escape `<` to avoid prematurely closing the script tag.
    const json = JSON.stringify(payload).replace(/</g, '\\u003c')
    jsonLd.push(`<script type="application/ld+json">${json}</script>`)
  }

  return { title: finalTitle, description: desc, canonical, tags, jsonLd }
}

/**
 * Pattern that matches the SSR outlet block in `index.html`, including
 * the surrounding `<!--ssr-outlet-start-->` / `<!--ssr-outlet-end-->`
 * comment markers. Anything between (typically the loading-spinner stub)
 * is replaced with the React tree rendered by `ssrModule.render()`.
 */
const ROOT_SLOT_RE = /<!--ssr-outlet-start-->[\s\S]*?<!--ssr-outlet-end-->/

function buildRootMarkup(bodyHtml: string): string {
  return `<div id="root">${bodyHtml}</div>`
}

function buildBootstrapScript(serviceDetail: ServiceDetail | null | undefined): string {
  if (!serviceDetail) return ''
  // JSON in a <script type=application/json> still has to escape "<" so a
  // literal "</script>" in the payload cannot close the surrounding tag.
  const safeJson = JSON.stringify(serviceDetail).replace(/</g, '\\u003c')
  return `<script id="__SERVICE_DETAIL__" type="application/json">${safeJson}</script>`
}

function applyTemplate(template: string, route: Route): string {
  const head = buildHead(route.seo)
  let html = template

  // 1) Replace <title> body
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(head.title)}</title>`)

  // 2) Replace existing default meta description / og:* / twitter:* / canonical / hreflang
  //    with our per-route values, by stripping them all and re-emitting in one block.
  const stripPatterns: RegExp[] = [
    /<meta\s+name="description"[^>]*\/?>(\r?\n)?/gi,
    /<meta\s+name="robots"[^>]*\/?>(\r?\n)?/gi,
    /<meta\s+property="og:[^"]+"[^>]*\/?>(\r?\n)?/gi,
    /<meta\s+name="twitter:[^"]+"[^>]*\/?>(\r?\n)?/gi,
    /<link\s+rel="canonical"[^>]*\/?>(\r?\n)?/gi,
    /<link\s+rel="alternate"\s+hreflang="[^"]+"[^>]*\/?>(\r?\n)?/gi,
  ]
  for (const re of stripPatterns) html = html.replace(re, '')

  const insert = ['', ...head.tags, ...head.jsonLd, ''].join('\n    ')
  html = html.replace(/<\/head>/, `${insert}</head>`)

  // 3) Replace the loading-spinner placeholder with the SSR'd React tree
  //    plus an inlined per-service detail payload that the client uses to
  //    seed `getCachedServiceDetail()` *before* hydration runs.
  if (!route.skipSsr) {
    const params = paramsFromRoute(route)
    let bodyHtml = ''
    try {
      bodyHtml = ssrModule.render({
        path: route.path,
        params,
        marketplace,
        serviceDetail: route.serviceDetail,
        serviceReviews: route.serviceReviews,
      }).html
    } catch (err) {
      console.warn(`[prerender] SSR failed for ${route.path}:`, err)
      bodyHtml = ''
    }

    if (bodyHtml) {
      const bootstrap = buildBootstrapScript(route.serviceDetail)
      const replacement = bootstrap
        ? `${buildRootMarkup(bodyHtml)}\n    ${bootstrap}`
        : buildRootMarkup(bodyHtml)
      const replaced = html.replace(ROOT_SLOT_RE, replacement)
      if (replaced !== html) html = replaced
    }
  }

  return html
}

function paramsFromRoute(route: Route): Record<string, string> | undefined {
  // Only pagination is part of the prerendered URL set today (page=1 is
  // canonical-stripped). When we extend to per-page prerender, populate
  // this with the right query string per route.
  void route
  return undefined
}

let writtenSsr = 0
let written = 0
for (const route of routes) {
  const html = applyTemplate(template, route)
  mkdirSync(dirname(route.outFile), { recursive: true })
  writeFileSync(route.outFile, html, 'utf8')
  written++
  if (!route.skipSsr) writtenSsr++
}

console.log(
  `[prerender] wrote ${written} HTML files (${writtenSsr} with SSR body, ${routes.length} routes)`,
)
