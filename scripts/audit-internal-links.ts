/**
 * Audit the internal-link footprint across the marketplace.
 *
 * Run: `npm run audit:internal-links`.
 *
 * Pikart's primary on-page SEO lever is internal anchors: dicardo.ir
 * (the 5-year-old reference competitor) emits ~665 internal links on
 * its home page alone. Every page that ends up with fewer than
 * `MIN_INBOUND` distinct inbound links is at risk of becoming an
 * orphan in Google's link graph and bleeds PageRank from the rest
 * of the site.
 *
 * The script walks:
 *   - every category page  (`/c/<slug>` is linked from home, header,
 *     footer, breadcrumbs, sibling category pages)
 *   - every service page   (`/s/<slug>` is linked from category page
 *     grids, related-services blocks, blog posts that name it)
 *   - every blog post      (`/blog/<slug>` is linked from index, sibling
 *     posts in same category, service-page «مقالات مرتبط» block)
 *   - every author page    (`/author/<slug>` is linked from each
 *     post by the matching author)
 *
 * It prints a CSV-shaped report sorted ascending by inbound count so
 * the lowest-traffic pages float to the top, and exits non-zero when
 * any non-orphan page (i.e. one that should have inbound links)
 * has fewer than `HARD_FLOOR`. Soft warnings (`MIN_INBOUND`) are
 * reported but never fail CI — the operator iteratively closes the
 * gap as they expand the catalogue.
 *
 * Roadmap reference: «جریان داخلی / Internal linking audit» in
 * `pikart-roadmap-to-1.md`.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BLOG_POSTS, getRelatedBlogPostsForService } from '../src/lib/blog'
import type { BlogPost } from '../src/lib/blog'
import type { Category, Service } from '../src/lib/data'
import { AUTHOR_PAGES } from '../src/lib/staticPages'

type Marketplace = {
  services: Service[]
  categories: Category[]
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const marketplacePath = resolve(repoRoot, 'public/data/marketplace.json')

if (!existsSync(marketplacePath)) {
  console.error(`[audit-internal-links] missing ${marketplacePath}`)
  process.exit(2)
}

const marketplace = JSON.parse(
  readFileSync(marketplacePath, 'utf8'),
) as Marketplace

// `MIN_INBOUND` = warn threshold. A page with fewer inbound links
// than this is reported but doesn't fail the build.
const MIN_INBOUND = 3
// `HARD_FLOOR` = error threshold. A page with fewer inbound links
// than this fails CI. Set conservatively so `npm run build` doesn't
// regress every time a brand-new vertical lands.
const HARD_FLOOR = 1

type LinkPage = {
  /** Canonical site-relative URL (e.g. `/blog/foo`). */
  url: string
  /** Human-readable label for the report. */
  label: string
  /** `category` | `service` | `blog` | `author`. */
  kind: 'category' | 'service' | 'blog' | 'author'
}

const inboundCounts = new Map<string, number>()
const pages = new Map<string, LinkPage>()

function registerPage(page: LinkPage) {
  pages.set(page.url, page)
  if (!inboundCounts.has(page.url)) inboundCounts.set(page.url, 0)
}

function bump(url: string) {
  inboundCounts.set(url, (inboundCounts.get(url) ?? 0) + 1)
}

// --- Register every page that participates in the link graph ------------

const categoriesById = new Map<string, Category>()
for (const c of marketplace.categories) {
  categoriesById.set(c.id, c)
  registerPage({ url: '/c/' + c.slug, label: c.titleFa, kind: 'category' })
}

const servicesByCategory = new Map<string, Service[]>()
const servicesBySlug = new Map<string, Service>()
for (const s of marketplace.services) {
  if (!s.slug) continue
  servicesBySlug.set(s.slug, s)
  registerPage({ url: '/s/' + s.slug, label: s.titleFa, kind: 'service' })
  const list = servicesByCategory.get(s.categoryId) ?? []
  list.push(s)
  servicesByCategory.set(s.categoryId, list)
}

const postsBySlug = new Map<string, BlogPost>()
for (const p of BLOG_POSTS) {
  postsBySlug.set(p.slug, p)
  registerPage({ url: '/blog/' + p.slug, label: p.titleFa, kind: 'blog' })
}

for (const a of AUTHOR_PAGES) {
  registerPage({ url: a.path, label: a.nameFa, kind: 'author' })
}

// --- Count inbound anchors -----------------------------------------------

// 1. Category pages → linked from home, every header/footer (assumed
//    once per page render so we don't double-count them), every blog
//    post under that category, every service in that category.
for (const post of BLOG_POSTS) {
  const cat = marketplace.categories.find(
    (c) => c.slug === post.primaryCategorySlug,
  )
  if (cat) bump('/c/' + cat.slug)
}
for (const s of marketplace.services) {
  const cat = categoriesById.get(s.categoryId)
  if (cat) bump('/c/' + cat.slug)
}

// 2. Service pages → linked from their category-page grid (counted
//    once), from the «سرویس‌های مشابه» block on every sibling service
//    in the same category (we now show 10), from blog posts that name
//    them as a primary or related service.
for (const s of marketplace.services) {
  if (!s.slug) continue
  // Linked once from its own category page grid.
  bump('/s/' + s.slug)
  // Sibling service pages — we render the top-10 sibling services on
  // every service page. Cap the contribution at 10 so a 50-service
  // vertical doesn't artificially inflate the count past what the
  // UI actually emits.
  const siblings = servicesByCategory.get(s.categoryId) ?? []
  const siblingsToShow = Math.min(10, Math.max(0, siblings.length - 1))
  for (let i = 0; i < siblingsToShow; i++) bump('/s/' + s.slug)
}
for (const post of BLOG_POSTS) {
  if (post.primaryServiceSlug && servicesBySlug.has(post.primaryServiceSlug)) {
    bump('/s/' + post.primaryServiceSlug)
  }
  for (const slug of post.relatedServiceSlugs ?? []) {
    if (servicesBySlug.has(slug)) bump('/s/' + slug)
  }
}

// 3. Blog posts → linked from /blog index (once), from each sibling
//    post in the same category (`getRelatedBlogPostsForService`-style
//    grouping; we render up to 6 per post), from service pages where
//    the post is listed in «مقالات مرتبط».
const postsByCategory = new Map<string, BlogPost[]>()
for (const p of BLOG_POSTS) {
  const list = postsByCategory.get(p.primaryCategorySlug) ?? []
  list.push(p)
  postsByCategory.set(p.primaryCategorySlug, list)
}
for (const post of BLOG_POSTS) {
  // /blog index → counts once.
  bump('/blog/' + post.slug)
  const siblings = postsByCategory.get(post.primaryCategorySlug) ?? []
  const inboundFromSiblings = Math.min(6, Math.max(0, siblings.length - 1))
  for (let i = 0; i < inboundFromSiblings; i++) bump('/blog/' + post.slug)
}
for (const s of marketplace.services) {
  if (!s.slug) continue
  for (const post of getRelatedBlogPostsForService(s.slug, 6)) {
    bump('/blog/' + post.slug)
  }
}

// 4. Author pages → linked from every post that author signs.
for (const post of BLOG_POSTS) {
  if (post.authorUrl) bump(post.authorUrl)
}

// --- Report --------------------------------------------------------------

type Row = {
  url: string
  label: string
  kind: LinkPage['kind']
  inbound: number
}

const rows: Row[] = Array.from(pages.entries()).map(([url, page]) => ({
  url,
  label: page.label,
  kind: page.kind,
  inbound: inboundCounts.get(url) ?? 0,
}))
rows.sort((a, b) => a.inbound - b.inbound || a.url.localeCompare(b.url))

console.log('url,kind,inbound,label')
for (const r of rows) {
  // Quote the label since some Persian titles contain commas.
  console.log(`${r.url},${r.kind},${r.inbound},"${r.label.replace(/"/g, "'")}"`)
}

const warnings = rows.filter((r) => r.inbound < MIN_INBOUND && r.inbound >= HARD_FLOOR)
const errors = rows.filter((r) => r.inbound < HARD_FLOOR)

if (warnings.length > 0) {
  console.warn('\n[audit-internal-links] WARNING: pages below MIN_INBOUND=' + MIN_INBOUND)
  for (const r of warnings) {
    console.warn(`  ${r.url}  (${r.inbound} inbound, ${r.kind})`)
  }
}
if (errors.length > 0) {
  console.error('\n[audit-internal-links] ERROR: orphan pages below HARD_FLOOR=' + HARD_FLOOR)
  for (const r of errors) {
    console.error(`  ${r.url}  (${r.inbound} inbound, ${r.kind})`)
  }
  process.exit(1)
}

console.log(
  `\n[audit-internal-links] checked ${rows.length} pages (` +
    `${rows.filter((r) => r.kind === 'category').length} categories, ` +
    `${rows.filter((r) => r.kind === 'service').length} services, ` +
    `${rows.filter((r) => r.kind === 'blog').length} blog posts, ` +
    `${rows.filter((r) => r.kind === 'author').length} authors)`,
)
console.log(
  `[audit-internal-links] warnings=${warnings.length} errors=${errors.length}`,
)
