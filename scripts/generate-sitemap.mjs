// Build-time sitemap generator. Reads `public/data/marketplace.json` and emits
// `public/sitemap.xml` listing every static route, every category page, and
// every service detail page on the site.
//
// Run via `npm run build` (it is wired in as a `prebuild` step) or directly
// with `node scripts/generate-sitemap.mjs`.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const SITE_URL = process.env.PIKART_SITE_URL?.replace(/\/$/, '') || 'https://pikart.ir'
const dataPath = resolve(repoRoot, 'public/data/marketplace.json')
const publicDir = resolve(repoRoot, 'public')
const outPath = resolve(publicDir, 'sitemap.xml')

/** @typedef {{ slug: string }} HasSlug */

/** @type {{ categories: HasSlug[]; services: HasSlug[] }} */
const data = JSON.parse(readFileSync(dataPath, 'utf8'))

const today = new Date().toISOString().slice(0, 10)

/**
 * @param {string} loc
 * @param {{ priority?: string; changefreq?: string }} [opts]
 */
function url(loc, opts = {}) {
  const { priority = '0.6', changefreq = 'weekly' } = opts
  return [
    '  <url>',
    `    <loc>${SITE_URL}${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n')
}

const entries = []

// Static pages
entries.push(url('/', { priority: '1.0', changefreq: 'daily' }))
entries.push(url('/categories', { priority: '0.9', changefreq: 'daily' }))

// Category pages
for (const c of data.categories ?? []) {
  if (!c.slug) continue
  entries.push(
    url(`/c/${encodeURIComponent(c.slug)}`, { priority: '0.8', changefreq: 'daily' }),
  )
}

// Service pages
for (const s of data.services ?? []) {
  if (!s.slug) continue
  entries.push(
    url(`/s/${encodeURIComponent(s.slug)}`, { priority: '0.7', changefreq: 'weekly' }),
  )
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap-0.9">\n' +
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
