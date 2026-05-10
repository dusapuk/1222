// Build-time sitemap generator. Reads `public/data/marketplace.json` and emits
// `public/sitemap.xml` listing every static route, every category page, and
// every service detail page on the site.
//
// Lastmod policy:
//   - Static pages get the marketplace.json mtime as a coarse "last edited"
//     date.
//   - Category pages get the most recent mtime from any
//     `public/data/services/<slug>.json` belonging to that category, or the
//     marketplace mtime if no per-service files exist yet.
//   - Service pages get the mtime of their per-service JSON
//     (`public/data/services/<slug>.json`) when it exists. This is the file
//     that contains the long description, FAQ and SEO override copy, so its
//     mtime is the truest signal of when the page's content changed.
//
// We also embed Google's image-sitemap extension on category and service
// URLs so Image Search has a direct list of every product / category hero
// image plus its alt-text.
//
// Run via `npm run build` (it is wired in as a `prebuild` step) or directly
// with `node scripts/generate-sitemap.mjs`.

import { readFileSync, writeFileSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const SITE_URL = process.env.PIKART_SITE_URL?.replace(/\/$/, '') || 'https://pikart.ir'
const dataPath = resolve(repoRoot, 'public/data/marketplace.json')
const servicesDir = resolve(repoRoot, 'public/data/services')
const publicDir = resolve(repoRoot, 'public')
const outPath = resolve(publicDir, 'sitemap.xml')

/** @typedef {{ slug: string; categoryId?: string; logoUrl?: string|null; titleFa?: string }} Service */
/** @typedef {{ id?: string; slug: string; titleFa?: string }} Category */

/** @type {{ categories: Category[]; services: Service[] }} */
const data = JSON.parse(readFileSync(dataPath, 'utf8'))

const today = new Date().toISOString().slice(0, 10)

function dateOnly(d) {
  return new Date(d).toISOString().slice(0, 10)
}

function safeMtime(filePath, fallback) {
  try {
    return dateOnly(statSync(filePath).mtimeMs)
  } catch {
    return fallback
  }
}

const marketplaceMtime = safeMtime(dataPath, today)

// Index per-category list of services and the latest-modified service file
// in each category. We use the most recent per-service mtime as the
// category page's lastmod, since the page lists all services in that
// category and changes whenever any of them is edited.
const servicesByCategory = new Map()
const categoryLatestMtime = new Map()
for (const s of data.services ?? []) {
  if (!s.slug || !s.categoryId) continue
  const arr = servicesByCategory.get(s.categoryId) ?? []
  arr.push(s)
  servicesByCategory.set(s.categoryId, arr)
  const detailPath = resolve(servicesDir, `${s.slug}.json`)
  if (existsSync(detailPath)) {
    const m = statSync(detailPath).mtimeMs
    const cur = categoryLatestMtime.get(s.categoryId)
    if (cur == null || m > cur) categoryLatestMtime.set(s.categoryId, m)
  }
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function absoluteImage(loc) {
  if (!loc) return null
  if (/^https?:\/\//i.test(loc)) return loc
  return SITE_URL + (loc.startsWith('/') ? '' : '/') + loc
}

/**
 * @param {string} loc
 * @param {{ priority?: string; changefreq?: string; lastmod?: string;
 *   images?: Array<{ loc: string; title?: string; caption?: string }> }} [opts]
 */
function url(loc, opts = {}) {
  const {
    priority = '0.6',
    changefreq = 'weekly',
    lastmod = today,
    images,
  } = opts
  const lines = [
    '  <url>',
    `    <loc>${escapeXml(SITE_URL + loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
  ]
  for (const img of images ?? []) {
    const abs = absoluteImage(img.loc)
    if (!abs) continue
    lines.push('    <image:image>')
    lines.push(`      <image:loc>${escapeXml(abs)}</image:loc>`)
    if (img.title) lines.push(`      <image:title>${escapeXml(img.title)}</image:title>`)
    if (img.caption)
      lines.push(`      <image:caption>${escapeXml(img.caption)}</image:caption>`)
    lines.push('    </image:image>')
  }
  lines.push('  </url>')
  return lines.join('\n')
}

const entries = []

// Static pages
entries.push(
  url('/', { priority: '1.0', changefreq: 'daily', lastmod: marketplaceMtime }),
)
entries.push(
  url('/categories', {
    priority: '0.9',
    changefreq: 'daily',
    lastmod: marketplaceMtime,
  }),
)

// Trust / content pages — these are referenced from the footer of every
// page so they should be discoverable directly from the sitemap too.
const TRUST_PAGES = ['about', 'contact', 'privacy', 'terms', 'refund', 'faq', 'guide']
for (const slug of TRUST_PAGES) {
  entries.push(
    url(`/${slug}`, {
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: marketplaceMtime,
    }),
  )
}

// Category pages — embed the static category hero image as a sitemap image.
const categoryImages = {
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

for (const c of data.categories ?? []) {
  if (!c.slug) continue
  const latest = categoryLatestMtime.get(c.id)
  const lastmod = latest != null ? dateOnly(latest) : marketplaceMtime
  const images = []
  const hero = categoryImages[c.slug]
  if (hero) {
    images.push({
      loc: hero,
      title: c.titleFa ? `خرید ${c.titleFa}` : undefined,
    })
  }
  entries.push(
    url(`/c/${encodeURIComponent(c.slug)}`, {
      priority: '0.8',
      changefreq: 'daily',
      lastmod,
      images,
    }),
  )
}

// Service pages — lastmod tracks the per-service JSON file when present.
for (const s of data.services ?? []) {
  if (!s.slug) continue
  const detailPath = resolve(servicesDir, `${s.slug}.json`)
  const lastmod = safeMtime(detailPath, marketplaceMtime)
  const images = []
  if (s.logoUrl) {
    images.push({
      loc: s.logoUrl,
      title: s.titleFa ? `خرید ${s.titleFa}` : undefined,
    })
  }
  entries.push(
    url(`/s/${encodeURIComponent(s.slug)}`, {
      priority: '0.7',
      changefreq: 'weekly',
      lastmod,
      images,
    }),
  )
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9"\n' +
  '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  entries.join('\n') +
  '\n</urlset>\n'

mkdirSync(publicDir, { recursive: true })
writeFileSync(outPath, xml, 'utf8')

const totalUrls = entries.length
const cats = data.categories?.length ?? 0
const svcs = data.services?.length ?? 0
console.log(
  `[sitemap] wrote ${outPath} — ${totalUrls} URLs (${cats} categories, ${svcs} services)`,
)
