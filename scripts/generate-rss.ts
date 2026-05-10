/**
 * Build-time RSS feed generator.
 *
 * Imports `src/lib/blog.ts` directly (via tsx) so the feed always
 * matches the in-repo content store. Emits `public/rss.xml` as a
 * valid RSS 2.0 feed with an Atom self-link pointing back at the
 * canonical feed URL. Persian feed readers and aggregators (Feedly,
 * NewsBlur) consume this directly.
 *
 * Wired into `npm run build` as a `prebuild` step alongside the
 * sitemap generator.
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getBlogPostsSorted } from '../src/lib/blog'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..')

const SITE_URL =
  process.env.PIKART_SITE_URL?.replace(/\/$/, '') ||
  process.env.VITE_PIKART_SITE_URL?.replace(/\/$/, '') ||
  'https://pikart.ir'
const SITE_NAME = process.env.PIKART_SITE_NAME || 'پی‌کارت'
const FEED_TITLE = `${SITE_NAME} — وبلاگ`
const FEED_DESCRIPTION =
  'راهنمای خرید اشتراک‌های دیجیتال، اکانت پرمیوم، گیفت‌کارت و سرویس‌های هوش مصنوعی برای کاربران ایرانی.'
const FEED_LANG = 'fa-IR'

const publicDir = resolve(repoRoot, 'public')
const outPath = resolve(publicDir, 'rss.xml')

function escapeXml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function rfc822(iso: string | undefined): string {
  if (!iso) return new Date().toUTCString()
  // Treat the date as UTC midnight to keep it stable across builds.
  const d = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return new Date().toUTCString()
  return d.toUTCString()
}

const posts = getBlogPostsSorted()

const feedUrl = SITE_URL + '/rss.xml'
const lastBuildDate = posts[0]?.dateModified
  ? rfc822(posts[0].dateModified)
  : new Date().toUTCString()

const items = posts
  .map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`
    const pubDate = rfc822(post.datePublished)
    const enclosureLine = post.coverImage
      ? `      <enclosure url="${escapeXml(SITE_URL + post.coverImage)}" type="image/jpeg" />`
      : ''
    return [
      '    <item>',
      `      <title>${escapeXml(post.titleFa || post.slug)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <dc:creator>${escapeXml(post.author || SITE_NAME)}</dc:creator>`,
      `      <description>${escapeXml(post.excerpt || '')}</description>`,
      enclosureLine,
      '    </item>',
    ]
      .filter((line) => line !== '')
      .join('\n')
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(SITE_URL + '/blog')}</link>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>${FEED_LANG}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>pikart-build</generator>
${items}
  </channel>
</rss>
`

mkdirSync(publicDir, { recursive: true })
writeFileSync(outPath, xml, 'utf8')

console.log(`[rss] wrote ${outPath} — ${posts.length} posts`)
