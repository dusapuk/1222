/**
 * Per-blog-post og:image generator — SEO roadmap A4.
 *
 * Generates 1200×630 PNG previews for every entry in
 * `BLOG_POSTS`. Each card carries the post's Persian H1, the category
 * label, and a category-tinted accent stripe so social previewers
 * (LinkedIn, Telegram, X, Slack, Facebook) display a unique hero
 * instead of the generic per-category JPG.
 *
 * Without this script every blog post shares one of 14 category
 * fallbacks — Google itself sees enough variation through the
 * `coverImage` JPG, but social previewers compress those badly. The
 * generated PNGs use vector text so titles stay legible at any
 * downscale.
 *
 * Output:
 *   - `public/og/blog/<slug>.png` — 1200×630 PNG per post.
 *   - `src/lib/blogOgImages.ts` — mirror manifest so `seoForBlogPost`
 *     can pick the file with no filesystem check at runtime.
 *
 * Run via: `npx tsx scripts/generate-blog-og-images.ts` — wired into
 * `npm run prebuild` so production builds always ship fresh OGs.
 */
import sharp from 'sharp'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'

import { BLOG_POSTS } from '../src/lib/blog'
import { colorForCategory } from '../src/lib/icons'

const ROOT = process.cwd()
const OUT_DIR = join(ROOT, 'public/og/blog')

const WIDTH = 1200
const HEIGHT = 630
const BG = '#0b0c10'

// Category slug → human-readable Persian label. Mirrors `seoForBlogPost`
// so the OG card and the JSON-LD `articleSection` agree on naming.
const CATEGORY_LABELS_FA: Record<string, string> = {
  'ai-assistants': 'دستیارهای هوش مصنوعی',
  'ai-image': 'تولید تصویر با هوش مصنوعی',
  'ai-video': 'ویدئو هوش مصنوعی',
  'ai-voice-music': 'صدا و موسیقی AI',
  'ai-writing-seo': 'نگارش و سئوی AI',
  'developer-tools': 'ابزارهای توسعه',
  'design-creative': 'طراحی و خلاقیت',
  'productivity-work': 'کار و بهره‌وری',
  streaming: 'فیلم و سرگرمی',
  music: 'موسیقی',
  education: 'آموزش و یادگیری',
  'cloud-storage': 'فضای ابری',
  'social-communication': 'شبکه‌های اجتماعی',
  'business-marketing': 'کسب‌وکار و مارکتینگ',
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function clipText(input: string, max: number): string {
  if (input.length <= max) return input
  return input.slice(0, max - 1).trimEnd() + '…'
}

/**
 * Naively wraps a Persian/English string into 2 lines of at most
 * `maxPerLine` characters each. Persian is right-to-left so we just
 * split on whitespace from the start; SVG `direction="rtl"` handles
 * the rendering order. Returns the original string as a single line
 * if it already fits, or `[line1, line2]` otherwise.
 */
function wrapTwoLines(text: string, maxPerLine: number): [string] | [string, string] {
  const trimmed = text.trim()
  if (trimmed.length <= maxPerLine) return [trimmed]
  const words = trimmed.split(/\s+/)
  let line1 = ''
  let i = 0
  for (; i < words.length; i++) {
    const candidate = line1 ? `${line1} ${words[i]}` : words[i]
    if (candidate.length > maxPerLine) break
    line1 = candidate
  }
  if (!line1) {
    // First word alone exceeds the budget — hard-clip without wrapping.
    return [clipText(trimmed, maxPerLine * 2)]
  }
  const line2 = clipText(words.slice(i).join(' '), maxPerLine)
  return line2 ? [line1, line2] : [line1]
}

function buildSvg(args: {
  titleFa: string
  categoryLabel: string
  accent: string
}): string {
  const { titleFa, categoryLabel, accent } = args
  const titleLines = wrapTwoLines(titleFa, 32)
  const categorySafe = escapeXml(clipText(categoryLabel, 28))
  const cta = escapeXml('PIKART.IR — مارکت‌پلیس دیجیتال ایران')

  const titleSvg = titleLines
    .map((line, idx) => {
      const y = titleLines.length === 1 ? 320 : 290 + idx * 78
      return `<text x="${WIDTH - 80}" y="${y}" text-anchor="end"
        font-family="Vazirmatn, Inter, system-ui, sans-serif"
        font-size="58" font-weight="900" fill="#ffffff" direction="rtl">
        ${escapeXml(line)}
      </text>`
    })
    .join('\n')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#13141a"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.30"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Left accent bar -->
  <rect x="0" y="0" width="14" height="${HEIGHT}" fill="url(#accentGrad)"/>

  <!-- Soft outer frame -->
  <rect x="60" y="60" width="${WIDTH - 120}" height="${HEIGHT - 120}" rx="32" ry="32"
    fill="none" stroke="${accent}" stroke-opacity="0.18" stroke-width="2"/>

  <!-- Brand line (top right, RTL) -->
  <text x="${WIDTH - 80}" y="118" text-anchor="end"
    font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="26" font-weight="700" fill="${accent}" direction="rtl">
    pikart.ir / blog
  </text>
  <line x1="${WIDTH - 80}" y1="138" x2="${WIDTH - 380}" y2="138"
    stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>

  <!-- Category chip -->
  <rect x="${WIDTH - 380}" y="170" width="300" height="46" rx="23" ry="23"
    fill="${accent}" fill-opacity="0.14"
    stroke="${accent}" stroke-opacity="0.55" stroke-width="1.5"/>
  <text x="${WIDTH - 230}" y="201" text-anchor="middle"
    font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="22" font-weight="700" fill="${accent}" direction="rtl">
    ${categorySafe}
  </text>

  ${titleSvg}

  <!-- Bottom CTA strip -->
  <rect x="60" y="${HEIGHT - 100}" width="${WIDTH - 120}" height="2"
    fill="${accent}" fill-opacity="0.4"/>
  <text x="${WIDTH - 80}" y="${HEIGHT - 50}" text-anchor="end"
    font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="22" font-weight="700" fill="${accent}" direction="rtl">
    ${cta}
  </text>
</svg>`
}

async function main(): Promise<void> {
  console.log(`[blog-og] generating ${BLOG_POSTS.length} per-post og:images`)
  await fs.mkdir(OUT_DIR, { recursive: true })

  const slugs: string[] = []
  let ok = 0

  for (const post of BLOG_POSTS) {
    const accent = colorForCategory(post.primaryCategorySlug)
    const categoryLabel =
      CATEGORY_LABELS_FA[post.primaryCategorySlug] ?? post.primaryCategorySlug

    const svg = buildSvg({
      titleFa: post.titleFa,
      categoryLabel,
      accent,
    })

    const outPath = join(OUT_DIR, `${post.slug}.png`)
    await fs.mkdir(dirname(outPath), { recursive: true })
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9, quality: 90 })
      .toFile(outPath)
    slugs.push(post.slug)
    ok++
  }

  console.log(`[blog-og] wrote ${ok} files to ${OUT_DIR.replace(ROOT, '')}`)

  const manifestPath = join(ROOT, 'src/lib/blogOgImages.ts')
  const sortedSlugs = [...slugs].sort()
  const manifest = `/**
 * Manifest of slugs that have a per-post og:image PNG generated by
 * \`scripts/generate-blog-og-images.ts\` — SEO roadmap A4.
 *
 * AUTO-GENERATED — do not edit by hand. Run
 * \`npx tsx scripts/generate-blog-og-images.ts\` to regenerate after
 * touching \`BLOG_POSTS\`.
 *
 * The generator writes 1200×630 PNGs to
 * \`public/og/blog/<slug>.png\`. We mirror the slug list here so
 * \`seoForBlogPost\` can pick the per-post file without a filesystem
 * check at runtime.
 */
const BLOG_OG_SLUGS: ReadonlySet<string> = new Set([
${sortedSlugs.map((s) => `  ${JSON.stringify(s)},`).join('\n')}
])

export function hasPerBlogOgImage(slug: string): boolean {
  return BLOG_OG_SLUGS.has(slug)
}

export function perBlogOgImagePath(slug: string): string {
  return \`/og/blog/\${slug}.png\`
}
`
  await fs.writeFile(manifestPath, manifest, 'utf8')
  console.log(
    `[blog-og] wrote manifest to ${manifestPath.replace(ROOT, '')} (${sortedSlugs.length} slugs)`,
  )
}

main().catch((err) => {
  console.error('[blog-og] failed:', err)
  process.exit(1)
})
