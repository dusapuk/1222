// Build-time sitemap generator. Reads `public/data/marketplace.json` and emits
// a Sitemap **index** at `public/sitemap.xml` referencing five child sitemaps:
//
//   - `sitemap-pages.xml`       — home + categories index + blog index +
//                                 trust pages (about/contact/privacy/...) +
//                                 author landing pages (Sprint 2 №12)
//   - `sitemap-categories.xml`  — every /c/<slug> page
//   - `sitemap-services.xml`    — every /s/<slug> page (~1404 URLs)
//   - `sitemap-blog.xml`        — blog index + every /blog/<slug> post
//   - `sitemap-authors.xml`     — every /author/<slug> page
//
// Splitting buys Search Console two big wins:
//   1. coverage stats are reported per type (services vs blog vs trust),
//      so the operator can quickly tell which segment regressed.
//   2. the index file stays under the 50 MB / 50 000-URL per-file limit
//      even as the catalogue grows past today's ~1404 services.
//
// The previous monolithic `sitemap.xml` is preserved as the index file
// itself (still served at `https://pikart.ir/sitemap.xml`) so we don't
// invalidate any robots.txt references the operator has already
// submitted to Search Console.
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

import { getBlogPostsSorted } from '../src/lib/blog'
import { STATIC_PAGES, AUTHOR_PAGES } from '../src/lib/staticPages'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const SITE_URL = process.env.PIKART_SITE_URL?.replace(/\/$/, '') || 'https://pikart.ir'
const dataPath = resolve(repoRoot, 'public/data/marketplace.json')
const servicesDir = resolve(repoRoot, 'public/data/services')
const publicDir = resolve(repoRoot, 'public')
const indexPath = resolve(publicDir, 'sitemap.xml')

type Service = {
  slug: string
  categoryId?: string
  logoUrl?: string | null
  titleFa?: string
}
type Category = { id?: string; slug: string; titleFa?: string }

const data = JSON.parse(readFileSync(dataPath, 'utf8')) as {
  categories: Category[]
  services: Service[]
}

const today = new Date().toISOString().slice(0, 10)

function dateOnly(d: string | number | Date): string {
  return new Date(d).toISOString().slice(0, 10)
}

function safeMtime(filePath: string, fallback: string): string {
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
const servicesByCategory = new Map<string, Service[]>()
const categoryLatestMtime = new Map<string, number>()
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

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function absoluteImage(loc: string | null | undefined): string | null {
  if (!loc) return null
  if (/^https?:\/\//i.test(loc)) return loc
  return SITE_URL + (loc.startsWith('/') ? '' : '/') + loc
}

type SitemapImage = { loc: string; title?: string; caption?: string }
type UrlOpts = {
  priority?: string
  changefreq?: string
  lastmod?: string
  images?: SitemapImage[]
}

function url(loc: string, opts: UrlOpts = {}): string {
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

function urlset(entries: string[]): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9"\n' +
    '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    entries.join('\n') +
    '\n</urlset>\n'
  )
}

function writeSitemap(filename: string, entries: string[]): { filename: string; count: number; mtime: string } {
  const out = resolve(publicDir, filename)
  mkdirSync(publicDir, { recursive: true })
  writeFileSync(out, urlset(entries), 'utf8')
  return { filename, count: entries.length, mtime: today }
}

// -------------------------------------------------------------------------
// Child sitemap: pages (home, categories index, blog index, trust pages)
// -------------------------------------------------------------------------

const pagesEntries: string[] = []
pagesEntries.push(
  url('/', { priority: '1.0', changefreq: 'daily', lastmod: marketplaceMtime }),
)
pagesEntries.push(
  url('/categories', {
    priority: '0.9',
    changefreq: 'daily',
    lastmod: marketplaceMtime,
  }),
)

// Trust / content pages — these are referenced from the footer of every
// page so they should be discoverable directly from the sitemap too.
// Read from STATIC_PAGES so adding a new page in the source file
// automatically extends the sitemap too.
for (const page of STATIC_PAGES) {
  pagesEntries.push(
    url(page.path, {
      priority: '0.5',
      changefreq: 'monthly',
      lastmod: marketplaceMtime,
    }),
  )
}

// -------------------------------------------------------------------------
// Child sitemap: categories
// -------------------------------------------------------------------------

const categoriesEntries: string[] = []
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

for (const c of data.categories ?? []) {
  if (!c.slug) continue
  const latest = categoryLatestMtime.get(c.id ?? '')
  const lastmod = latest != null ? dateOnly(latest) : marketplaceMtime
  const images: SitemapImage[] = []
  const hero = categoryImages[c.slug]
  if (hero) {
    images.push({
      loc: hero,
      title: c.titleFa ? `خرید ${c.titleFa}` : undefined,
    })
  }
  categoriesEntries.push(
    url(`/c/${encodeURIComponent(c.slug)}`, {
      priority: '0.8',
      changefreq: 'daily',
      lastmod,
      images,
    }),
  )
}

// -------------------------------------------------------------------------
// Child sitemap: services
// -------------------------------------------------------------------------

const servicesEntries: string[] = []
for (const s of data.services ?? []) {
  if (!s.slug) continue
  const detailPath = resolve(servicesDir, `${s.slug}.json`)
  const lastmod = safeMtime(detailPath, marketplaceMtime)
  const images: SitemapImage[] = []
  if (s.logoUrl) {
    images.push({
      loc: s.logoUrl,
      title: s.titleFa ? `خرید ${s.titleFa}` : undefined,
    })
  }
  servicesEntries.push(
    url(`/s/${encodeURIComponent(s.slug)}`, {
      priority: '0.7',
      changefreq: 'weekly',
      lastmod,
      images,
    }),
  )
}

// -------------------------------------------------------------------------
// Child sitemap: blog
// -------------------------------------------------------------------------

const blogEntries: string[] = []
const blogPosts = getBlogPostsSorted()
let blogLastmod = today
if (blogPosts.length > 0) {
  blogLastmod =
    [...blogPosts.map((p) => p.dateModified || p.datePublished)]
      .filter(Boolean)
      .sort()
      .slice(-1)[0] || today
  blogEntries.push(
    url('/blog', {
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: blogLastmod,
    }),
  )
  for (const post of blogPosts) {
    const lastmod = post.dateModified || post.datePublished || today
    const images: SitemapImage[] = []
    if (post.coverImage) {
      images.push({
        loc: post.coverImage,
        title: post.titleFa,
        caption: post.coverAlt,
      })
    }
    blogEntries.push(
      url(`/blog/${encodeURIComponent(post.slug)}`, {
        priority: '0.7',
        changefreq: 'monthly',
        lastmod,
        images,
      }),
    )
  }
}

// -------------------------------------------------------------------------
// Child sitemap: authors
// -------------------------------------------------------------------------

const authorsEntries: string[] = []
for (const author of AUTHOR_PAGES) {
  const lastmod = blogLastmod || marketplaceMtime
  authorsEntries.push(
    url(author.path, {
      priority: '0.5',
      changefreq: 'monthly',
      lastmod,
    }),
  )
}

// -------------------------------------------------------------------------
// Write child sitemaps + the index
// -------------------------------------------------------------------------

const written: { filename: string; count: number; mtime: string }[] = []
written.push(writeSitemap('sitemap-pages.xml', pagesEntries))
written.push(writeSitemap('sitemap-categories.xml', categoriesEntries))
written.push(writeSitemap('sitemap-services.xml', servicesEntries))
written.push(writeSitemap('sitemap-blog.xml', blogEntries))
// Authors sitemap is intentionally written even when empty so we don't
// have to special-case the index — empty <urlset> is valid per
// sitemaps.org spec and Search Console accepts it.
written.push(writeSitemap('sitemap-authors.xml', authorsEntries))

const indexBody = written
  .map(
    ({ filename, mtime }) =>
      '  <sitemap>\n' +
      `    <loc>${escapeXml(SITE_URL + '/' + filename)}</loc>\n` +
      `    <lastmod>${mtime}</lastmod>\n` +
      '  </sitemap>',
  )
  .join('\n')

const indexXml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">\n' +
  indexBody +
  '\n</sitemapindex>\n'

mkdirSync(publicDir, { recursive: true })
writeFileSync(indexPath, indexXml, 'utf8')

const totalUrls = written.reduce((acc, w) => acc + w.count, 0)
const summary = written.map((w) => `${w.filename} (${w.count})`).join(', ')
console.log(
  `[sitemap] wrote ${indexPath} sitemap index referencing ${written.length} files — ${summary} — ${totalUrls} URLs total`,
)
