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

import { getBlogPostsSorted, type BlogPost } from '../src/lib/blog'

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

function iso8601(iso: string | undefined): string {
  if (!iso) return new Date().toISOString()
  const d = new Date(iso + 'T00:00:00Z')
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

/**
 * Resolve `[label](slug)` and `[label](path)` markup inside blog body
 * paragraphs to absolute anchors. Mirrors what `BlogPostPage` does in
 * the React app, but for plain HTML emitted into the feed.
 */
function resolveInline(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label: string, target: string) => {
    const t = target.trim()
    let href: string
    if (t.startsWith('http://') || t.startsWith('https://')) {
      href = t
    } else if (t.startsWith('/')) {
      href = SITE_URL + t
    } else {
      href = `${SITE_URL}/s/${t}`
    }
    return `<a href="${escapeXml(href)}">${escapeXml(label)}</a>`
  })
}

/**
 * Render a post into a self-contained HTML body suitable for
 * `<content:encoded>` and Atom `<content type="html">`. We keep the
 * markup intentionally minimal (h2/h3/p/ul/strong/a) so feed readers
 * that strip CSS still get readable copy.
 */
function renderPostBodyHtml(post: BlogPost): string {
  const parts: string[] = []
  if (post.coverImage) {
    parts.push(
      `<p><img src="${escapeXml(SITE_URL + post.coverImage)}" alt="${escapeXml(post.coverAlt || post.titleFa)}" /></p>`,
    )
  }
  if (post.excerpt) {
    parts.push(`<p><strong>${escapeXml(post.excerpt)}</strong></p>`)
  }
  for (const section of post.sections) {
    const tag = section.level === 'h3' ? 'h3' : 'h2'
    parts.push(`<${tag}>${escapeXml(section.heading)}</${tag}>`)
    if (section.body) {
      for (const para of section.body) {
        parts.push(`<p>${resolveInline(escapeXml(para))}</p>`)
      }
    }
    if (section.bullets && section.bullets.length > 0) {
      const bullets = section.bullets
        .map((b) => `<li>${resolveInline(escapeXml(b))}</li>`)
        .join('')
      parts.push(`<ul>${bullets}</ul>`)
    }
    if (section.cta) {
      const href = section.cta.path.startsWith('http')
        ? section.cta.path
        : SITE_URL + section.cta.path
      parts.push(
        `<p><a href="${escapeXml(href)}"><strong>${escapeXml(section.cta.label)}</strong></a></p>`,
      )
    }
  }
  if (post.faq && post.faq.length > 0) {
    parts.push('<h2>پرسش‌های متداول</h2>')
    for (const f of post.faq) {
      parts.push(`<p><strong>${escapeXml(f.question)}</strong></p>`)
      parts.push(`<p>${escapeXml(f.answer)}</p>`)
    }
  }
  return parts.join('\n')
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
    const html = renderPostBodyHtml(post)
    const categoriesXml = post.keywords
      .slice(0, 5)
      .map((k) => `      <category>${escapeXml(k)}</category>`)
      .join('\n')
    return [
      '    <item>',
      `      <title>${escapeXml(post.titleFa || post.slug)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <dc:creator>${escapeXml(post.author || SITE_NAME)}</dc:creator>`,
      `      <description>${escapeXml(post.excerpt || '')}</description>`,
      `      <content:encoded><![CDATA[${html}]]></content:encoded>`,
      categoriesXml,
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

// ---- Atom 1.0 mirror ---------------------------------------------------
// Same content, Atom envelope. Some readers (and aggregators like
// Bing/Yandex Webmaster) prefer Atom over RSS for richer date/content
// fields. We expose both at stable URLs so subscribers don't have to
// switch when their reader changes preference.
const atomFeedUrl = SITE_URL + '/atom.xml'
const atomItems = posts
  .map((post) => {
    const url = `${SITE_URL}/blog/${post.slug}`
    const html = renderPostBodyHtml(post)
    const updated = iso8601(post.dateModified || post.datePublished)
    const published = iso8601(post.datePublished)
    const categoriesXml = post.keywords
      .slice(0, 5)
      .map((k) => `    <category term="${escapeXml(k)}" />`)
      .join('\n')
    return [
      '  <entry>',
      `    <id>${escapeXml(url)}</id>`,
      `    <title>${escapeXml(post.titleFa || post.slug)}</title>`,
      `    <link rel="alternate" type="text/html" href="${escapeXml(url)}" />`,
      `    <updated>${updated}</updated>`,
      `    <published>${published}</published>`,
      `    <author><name>${escapeXml(post.author || SITE_NAME)}</name></author>`,
      `    <summary type="html"><![CDATA[${escapeXml(post.excerpt || '')}]]></summary>`,
      `    <content type="html"><![CDATA[${html}]]></content>`,
      categoriesXml,
      '  </entry>',
    ]
      .filter((line) => line !== '')
      .join('\n')
  })
  .join('\n')

const atomXml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${FEED_LANG}">
  <title>${escapeXml(FEED_TITLE)}</title>
  <subtitle>${escapeXml(FEED_DESCRIPTION)}</subtitle>
  <link rel="self" href="${escapeXml(atomFeedUrl)}" />
  <link rel="alternate" type="text/html" href="${escapeXml(SITE_URL + '/blog')}" />
  <id>${escapeXml(atomFeedUrl)}</id>
  <updated>${iso8601(posts[0]?.dateModified || posts[0]?.datePublished)}</updated>
  <generator>pikart-build</generator>
${atomItems}
</feed>
`

writeFileSync(resolve(publicDir, 'atom.xml'), atomXml, 'utf8')

console.log(`[rss] wrote ${outPath} — ${posts.length} posts`)
console.log(`[rss] wrote ${resolve(publicDir, 'atom.xml')} — atom mirror`)
