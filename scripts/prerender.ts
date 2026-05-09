/**
 * Build-time SEO prerender.
 *
 * After `vite build`, this script reads `dist/index.html` as a template and
 * emits a per-route HTML file with the correct title / meta / canonical /
 * OG / Twitter / hreflang / JSON-LD already inlined in the <head>.
 *
 * The page body still mounts the React app on the client, so behaviour after
 * hydration is unchanged. The point is to make first-byte HTML correct for:
 *   - social previews (Telegram/Slack/Twitter ignore JS-injected meta)
 *   - search engines that cache pre-JS HTML for ranking signals
 *   - bots without a JS engine
 *
 * Routes prerendered:
 *   - /                  (home)
 *   - /categories        (categories index)
 *   - /c/<slug>          (every category)
 *   - /s/<slug>          (every service)
 *   - /404               (noindex stub for SPA fallback hosts)
 *
 * Usage: invoked by `npm run build`'s postbuild hook. Can also run manually:
 *   npx tsx scripts/prerender.ts
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  seoForCategoriesIndex,
  seoForCategory,
  seoForHome,
  seoForNotFound,
  seoForService,
} from '../src/lib/seoConfig'
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
  imageMimeFor,
} from '../src/lib/seo'
import type { SEOConfig } from '../src/hooks/useSEO'
import type { Category, Plan, Service, ServiceDetail } from '../src/lib/data'

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
const templatePath = resolve(distDir, 'index.html')

if (!existsSync(templatePath)) {
  console.error('[prerender] dist/index.html not found — run `vite build` first.')
  process.exit(1)
}

const marketplace = JSON.parse(
  readFileSync(resolve(repoRoot, 'public/data/marketplace.json'), 'utf8'),
) as { categories: Category[]; services: Service[]; plans: Plan[] }

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

type Route = { path: string; outFile: string; seo: SEOConfig }

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

for (const category of marketplace.categories) {
  if (!category.slug) continue
  const services = (servicesByCategory.get(category.id) ?? []).sort(
    (a, b) =>
      Number(b.isFeatured) - Number(a.isFeatured) ||
      Number(b.isPopular) - Number(a.isPopular),
  )
  routes.push({
    path: `/c/${category.slug}`,
    outFile: fileFor(`/c/${category.slug}`),
    seo: seoForCategory({
      category,
      services,
      categoryImage: imageForCategory(category.slug),
    }),
  })
}

const servicesDir = resolve(repoRoot, 'public/data/services')

function loadDetail(slug: string): ServiceDetail | null {
  const path = resolve(servicesDir, `${slug}.json`)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as ServiceDetail
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
  routes.push({
    path: `/s/${service.slug}`,
    outFile: fileFor(`/s/${service.slug}`),
    seo: seoForService({ service, category, plans, cheapest, detail }),
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

  const jsonLd: string[] = []
  for (const payload of seo.jsonLd ?? []) {
    if (!payload) continue
    // JSON-LD must escape `<` to avoid prematurely closing the script tag.
    const json = JSON.stringify(payload).replace(/</g, '\\u003c')
    jsonLd.push(`<script type="application/ld+json">${json}</script>`)
  }

  return { title: finalTitle, description: desc, canonical, tags, jsonLd }
}

function applyTemplate(template: string, seo: SEOConfig): string {
  const head = buildHead(seo)
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

  return html
}

let written = 0
for (const route of routes) {
  const html = applyTemplate(template, route.seo)
  mkdirSync(dirname(route.outFile), { recursive: true })
  writeFileSync(route.outFile, html, 'utf8')
  written++
}

console.log(`[prerender] wrote ${written} HTML files (${routes.length} routes)`)
