/**
 * Per-service og:image generator — SEO roadmap #15.
 *
 * Generates 1200×630 PNG previews for the top-N services in the
 * catalogue (popular + featured + first 100 by plan count). Output is
 * written to `public/og/services/<slug>.png`. If a file already
 * exists, the script regenerates it (so brand colour / catalogue copy
 * changes flow through without manual asset shuffling).
 *
 * Why per-service og:image?
 *   - Social previewers (Facebook, LinkedIn, Slack, Twitter) downscale
 *     square logos badly, often clipping the brand wordmark.
 *   - A 1200×630 PNG with logo + title + brand colour gives every
 *     service a hero-style social card without any post-processing.
 *
 * Run via: `npx tsx scripts/generate-og-images.ts` — included in
 * `npm run prebuild` so production builds always ship fresh og:images.
 */
import sharp from 'sharp'
import { promises as fs } from 'fs'
import { dirname, join } from 'path'

const ROOT = process.cwd()
const MARKET_PATH = join(ROOT, 'public/data/marketplace.json')
const OUT_DIR = join(ROOT, 'public/og/services')
const PUBLIC_DIR = join(ROOT, 'public')

const WIDTH = 1200
const HEIGHT = 630
const BG = '#0b0c10'
const ACCENT = '#d4a853'

type ServiceLite = {
  slug: string
  titleFa: string
  titleEn: string | null
  shortDescriptionFa: string | null
  logoUrl: string | null
  brandColor: string | null
  isPopular: boolean
  isFeatured: boolean
  planCount: number
}

type Marketplace = {
  services: ServiceLite[]
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

async function loadLogo(logoUrl: string | null): Promise<Buffer | null> {
  if (!logoUrl) return null
  // Site-relative paths only. Skip absolute URLs (CDN cost; we have
  // local copies under public/).
  if (!logoUrl.startsWith('/')) return null
  const abs = join(PUBLIC_DIR, logoUrl)
  try {
    const buf = await fs.readFile(abs)
    return await sharp(buf)
      .resize({ width: 200, height: 200, fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer()
  } catch {
    return null
  }
}

function buildSvg(args: {
  service: ServiceLite
  hasLogo: boolean
}): string {
  const { service, hasLogo } = args
  const titleFa = escapeXml(clipText(service.titleFa, 32))
  const titleEn = service.titleEn ? escapeXml(clipText(service.titleEn, 36)) : ''
  const subtitle = escapeXml(
    `خرید رسمی + پشتیبانی فارسی + پرداخت تومانی`,
  )
  const cta = escapeXml('PIKART.IR — مارکت‌پلیس دیجیتال ایران')
  const accent = service.brandColor && /^#[0-9a-fA-F]{6}$/.test(service.brandColor)
    ? service.brandColor
    : ACCENT

  // Two-column layout: brand mark + title on the right (RTL),
  // accent gradient frame on the left.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="#13141a"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="0" y="0" width="14" height="${HEIGHT}" fill="url(#accentGrad)"/>
  <rect x="60" y="60" width="${WIDTH - 120}" height="${HEIGHT - 120}" rx="32" ry="32"
    fill="none" stroke="${accent}" stroke-opacity="0.18" stroke-width="2"/>

  <!-- Brand identity strip (top right, RTL) -->
  <text x="${WIDTH - 90}" y="118" text-anchor="end" font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="26" font-weight="700" fill="${accent}" direction="rtl">
    pikart.ir
  </text>
  <line x1="${WIDTH - 90}" y1="138" x2="${WIDTH - 380}" y2="138" stroke="${accent}" stroke-opacity="0.4" stroke-width="2"/>

  <!-- Service title (large, RTL) -->
  <text x="${WIDTH - 90}" y="290" text-anchor="end" font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="64" font-weight="900" fill="#ffffff" direction="rtl">
    خرید ${titleFa}
  </text>

  ${titleEn ? `<text x="${WIDTH - 90}" y="345" text-anchor="end" font-family="Inter, system-ui, sans-serif"
    font-size="32" font-weight="600" fill="#9a9baa" direction="ltr">
    ${titleEn}
  </text>` : ''}

  <!-- Subtitle / value-prop -->
  <text x="${WIDTH - 90}" y="420" text-anchor="end" font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="28" font-weight="500" fill="#c4c5d0" direction="rtl">
    ${subtitle}
  </text>

  <!-- CTA strip pinned to the bottom -->
  <rect x="60" y="${HEIGHT - 100}" width="${WIDTH - 120}" height="2" fill="${accent}" fill-opacity="0.4"/>
  <text x="${WIDTH - 90}" y="${HEIGHT - 50}" text-anchor="end" font-family="Vazirmatn, Inter, system-ui, sans-serif"
    font-size="22" font-weight="700" fill="${accent}" direction="rtl">
    ${cta}
  </text>
  ${hasLogo ? `<rect x="80" y="${HEIGHT / 2 - 100}" width="200" height="200" rx="40" ry="40" fill="#13141a" stroke="${accent}" stroke-opacity="0.25" stroke-width="2"/>` : ''}
</svg>`
}

async function pickTop(services: ServiceLite[], target: number): Promise<ServiceLite[]> {
  const ranked = services
    .filter((s) => s.slug && s.titleFa)
    .map((s) => {
      let score = 0
      if (s.isPopular) score += 100
      if (s.isFeatured) score += 50
      score += Math.min(40, (s.planCount ?? 0) * 5)
      return { s, score }
    })
    .sort((a, b) => b.score - a.score || a.s.slug.localeCompare(b.s.slug))
    .map((x) => x.s)
  return ranked.slice(0, target)
}

async function main(): Promise<void> {
  const raw = await fs.readFile(MARKET_PATH, 'utf8')
  const market = JSON.parse(raw) as Marketplace
  const services = market.services ?? []
  const top = await pickTop(services, 100)
  console.log(`[og-images] generating ${top.length} per-service og:images`)

  await fs.mkdir(OUT_DIR, { recursive: true })

  let ok = 0
  let withLogo = 0

  for (const service of top) {
    const logoBuf = await loadLogo(service.logoUrl)
    const hasLogo = !!logoBuf
    const svg = buildSvg({ service, hasLogo })

    const composite: sharp.OverlayOptions[] = []
    if (logoBuf) {
      composite.push({
        input: logoBuf,
        left: 90,
        top: Math.round(HEIGHT / 2 - 100) + 10,
      })
      withLogo++
    }

    const outPath = join(OUT_DIR, `${service.slug}.png`)
    await fs.mkdir(dirname(outPath), { recursive: true })
    await sharp(Buffer.from(svg))
      .composite(composite)
      .png({ compressionLevel: 9, quality: 90 })
      .toFile(outPath)
    ok++
  }

  console.log(
    `[og-images] wrote ${ok} files (with logo: ${withLogo}, plain: ${ok - withLogo}) to ${OUT_DIR.replace(ROOT, '')}`,
  )

  // Mirror the slug list into a TS manifest so seoForService can
  // pick the per-service og:image without a filesystem lookup.
  const manifestPath = join(ROOT, 'src/lib/serviceOgImages.ts')
  const slugs = top.map((s) => s.slug).sort()
  const manifest = `/**
 * Manifest of slugs that have a per-service og:image PNG generated by
 * \`scripts/generate-og-images.ts\` — SEO roadmap #15.
 *
 * AUTO-GENERATED — do not edit by hand. Run \`npm run og:images\` to
 * regenerate after touching the marketplace catalogue.
 *
 * The generator writes 1200×630 PNGs to
 * \`public/og/services/<slug>.png\` for the top-100 services. We
 * mirror the slug list here so \`seoForService\` can pick the
 * per-service file without a filesystem check at runtime.
 */
const SERVICE_OG_SLUGS: ReadonlySet<string> = new Set([
${slugs.map((s) => `  ${JSON.stringify(s)},`).join('\n')}
])

export function hasPerServiceOgImage(slug: string): boolean {
  return SERVICE_OG_SLUGS.has(slug)
}

export function perServiceOgImagePath(slug: string): string {
  return \`/og/services/\${slug}.png\`
}
`
  await fs.writeFile(manifestPath, manifest, 'utf8')
  console.log(`[og-images] wrote manifest to ${manifestPath.replace(ROOT, '')} (${slugs.length} slugs)`)
}

main().catch((err) => {
  console.error('[og-images] failed:', err)
  process.exit(1)
})
