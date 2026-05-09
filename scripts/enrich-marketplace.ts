/**
 * Generate per-service rich-data JSON files from the Postgres pg_dump in
 * `marketplace_backup_*.sql`.
 *
 * The runtime catalogue (`public/data/marketplace.json`) intentionally
 * keeps the per-service payload small: only the fields needed by the
 * browse / search / category pages. The long marketing copy, FAQ, SEO
 * overrides, instructions and requirements live in separate per-service
 * JSON files at `public/data/services/<slug>.json`. They are:
 *
 *   - fetched lazily by `ServiceDetailPage` when a user opens a product
 *     detail page (no impact on home/category load);
 *   - read at build time by `scripts/prerender.ts` to embed
 *     `Product.description`, `FAQPage` and SEO-overridden meta into the
 *     static HTML of every service URL.
 *
 * Run: `npm run enrich` (also wired into `prebuild`).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const dumps = readdirSync(repoRoot)
  .filter((f) => /^marketplace_backup_.*\.sql$/.test(f))
  .sort()
if (dumps.length === 0) {
  console.warn(
    '[enrich] no marketplace_backup_*.sql found in repo root — skipping enrichment.',
  )
  process.exit(0)
}
const dumpPath = resolve(repoRoot, dumps[dumps.length - 1])

const marketplacePath = resolve(repoRoot, 'public/data/marketplace.json')
const servicesDir = resolve(repoRoot, 'public/data/services')

if (!existsSync(marketplacePath)) {
  console.error(`[enrich] missing ${marketplacePath}`)
  process.exit(1)
}

type CopyRow = Record<string, string | null | unknown>

const COPY_HEADER_RE = /^COPY public\."Service" \(([^)]+)\) FROM stdin;/
const COPY_END = '\\.'

function unescapePg(value: string): string | null {
  if (value === '\\N') return null
  let out = ''
  for (let i = 0; i < value.length; i++) {
    const ch = value[i]
    if (ch === '\\' && i + 1 < value.length) {
      const next = value[i + 1]
      switch (next) {
        case '\\':
          out += '\\'
          break
        case 't':
          out += '\t'
          break
        case 'n':
          out += '\n'
          break
        case 'r':
          out += '\r'
          break
        case 'b':
          out += '\b'
          break
        case 'f':
          out += '\f'
          break
        case 'v':
          out += '\v'
          break
        default:
          out += ch + next
      }
      i++
      continue
    }
    out += ch
  }
  return out
}

function parseDump(path: string): Map<string, CopyRow> {
  const text = readFileSync(path, 'utf8')
  const lines = text.split('\n')
  const rows = new Map<string, CopyRow>()
  let inCopy = false
  let cols: string[] = []

  for (const line of lines) {
    if (!inCopy) {
      const m = line.match(COPY_HEADER_RE)
      if (m) {
        cols = m[1]
          .split(',')
          .map((c) => c.trim().replace(/^"|"$/g, ''))
        inCopy = true
      }
      continue
    }
    if (line === COPY_END) break

    const parts = line.split('\t')
    if (parts.length !== cols.length) {
      console.warn(
        `[enrich] skip: expected ${cols.length} cols, got ${parts.length}`,
      )
      continue
    }
    const record: CopyRow = {}
    for (let i = 0; i < cols.length; i++) {
      const col = cols[i]
      const raw = unescapePg(parts[i])
      if (col === 'faq' || col === 'faqEn') {
        if (raw == null || raw.trim() === '') {
          record[col] = null
        } else {
          try {
            record[col] = JSON.parse(raw)
          } catch (err) {
            console.warn(`[enrich] bad jsonb cell on ${col}:`, err)
            record[col] = null
          }
        }
      } else {
        record[col] = raw
      }
    }
    const slug = record['slug']
    if (typeof slug === 'string') rows.set(slug, record)
  }
  return rows
}

type FaqItem = { question: string; answer: string }

function normaliseFaq(value: unknown): FaqItem[] | null {
  if (!Array.isArray(value) || value.length === 0) return null
  const out: FaqItem[] = []
  for (const item of value) {
    if (!item || typeof item !== 'object') continue
    const obj = item as Record<string, unknown>
    const question =
      (obj.question as string | undefined) ??
      (obj.q as string | undefined) ??
      (obj.title as string | undefined) ??
      (obj.Q as string | undefined)
    const answer =
      (obj.answer as string | undefined) ??
      (obj.a as string | undefined) ??
      (obj.text as string | undefined) ??
      (obj.body as string | undefined) ??
      (obj.A as string | undefined)
    if (typeof question === 'string' && typeof answer === 'string') {
      const q = question.trim()
      const a = answer.trim()
      if (q && a) out.push({ question: q, answer: a })
    }
  }
  return out.length > 0 ? out : null
}

function buildPersianFaq(args: {
  titleFa: string
  deliveryFa: string | null
  planCount: number
  inStock: boolean
  isAi: boolean
}): FaqItem[] {
  const { titleFa, deliveryFa, planCount, inStock, isAi } = args
  const delivery = deliveryFa ?? '۱۵ دقیقه تا چند ساعت'
  const faq: FaqItem[] = []

  faq.push({
    question: `تحویل سفارش ${titleFa} چقدر طول می‌کشد؟`,
    answer:
      `تحویل اشتراک ${titleFa} پس از تأیید پرداخت معمولاً ${delivery} طول می‌کشد. ` +
      `در صورت نیاز به تأیید سرویس‌دهنده اصلی، زمان تحویل ممکن است کمی بیشتر شود.`,
  })
  faq.push({
    question: `آیا اشتراک ${titleFa} برای کاربران ایرانی قابل خرید است؟`,
    answer:
      `بله. ${titleFa} در پی‌کارت با پرداخت تومانی، فرایند فارسی و ` +
      `پشتیبانی تخصصی برای کاربران داخل ایران ارائه می‌شود و نیازی ` +
      `به ارز یا کارت بین‌المللی ندارید.`,
  })
  if (planCount > 1) {
    faq.push({
      question: `چه پلن‌هایی برای ${titleFa} موجود است؟`,
      answer:
        `در حال حاضر ${planCount} پلن مختلف برای ${titleFa} ارائه می‌شود؛ ` +
        `بازه قیمت و مدت‌زمان هر پلن در همین صفحه قابل مشاهده و انتخاب است.`,
    })
  }
  faq.push({
    question: `آیا اشتراک ${titleFa} اصل و دارای ضمانت است؟`,
    answer:
      `تمامی پلن‌های ${titleFa} در پی‌کارت با ضمانت اصالت، تضمین ` +
      `بازگشت وجه در صورت تحویل ناموفق و پشتیبانی شبانه‌روزی ارائه می‌شوند.`,
  })
  if (!inStock) {
    faq.push({
      question: `آیا می‌توانم ${titleFa} را پیش‌سفارش کنم؟`,
      answer:
        `در حال حاضر ${titleFa} موجود نیست؛ با فعال‌سازی اطلاع‌رسانی موجودی، ` +
        `به محض فراهم شدن سرویس از طریق پیامک یا ایمیل خبردار می‌شوید.`,
    })
  }
  if (isAi) {
    faq.push({
      question: `آیا برای استفاده از ${titleFa} نیاز به تحریم‌شکن دارم؟`,
      answer:
        `بله. ${titleFa} از مجموعه سرویس‌های هوش مصنوعی است و برای ` +
        `اتصال پایدار توصیه می‌شود از یک کانکشن مناسب (تحریم‌شکن) استفاده کنید. ` +
        `راهنمای کامل در صفحه فعال‌سازی ارائه می‌شود.`,
    })
  }
  return faq
}

type Marketplace = {
  services: Array<{
    slug: string
    titleFa: string
    deliveryTimeFa: string | null
    planCount: number
    inStock: boolean
    isAi: boolean
  }>
}

console.log(`[enrich] parsing ${dumps[dumps.length - 1]}`)
const dumpRows = parseDump(dumpPath)
console.log(`[enrich] parsed ${dumpRows.size} services from dump`)

const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8')) as Marketplace

if (existsSync(servicesDir)) {
  rmSync(servicesDir, { recursive: true })
}
mkdirSync(servicesDir, { recursive: true })

let withLongDesc = 0
let withSeoTitle = 0
let withSeoDesc = 0
let withFaq = 0
let written = 0

for (const service of marketplace.services) {
  const slug = service.slug
  if (!slug) continue
  const richSrc = dumpRows.get(slug)
  const out: Record<string, unknown> = { slug }

  const longDesc = richSrc?.['descriptionFa']
  if (typeof longDesc === 'string' && longDesc.trim()) {
    out.descriptionFa = longDesc.trim()
    withLongDesc++
  }

  const seoTitle = richSrc?.['seoTitleFa']
  if (typeof seoTitle === 'string' && seoTitle.trim()) {
    out.seoTitleFa = seoTitle.trim()
    withSeoTitle++
  }

  const seoDesc = richSrc?.['seoDescriptionFa']
  if (typeof seoDesc === 'string' && seoDesc.trim()) {
    out.seoDescriptionFa = seoDesc.trim()
    withSeoDesc++
  }

  const requirements = richSrc?.['requirementsFa']
  if (typeof requirements === 'string' && requirements.trim()) {
    out.requirementsFa = requirements.trim()
  }

  const instructions = richSrc?.['instructionsFa']
  if (typeof instructions === 'string' && instructions.trim()) {
    out.instructionsFa = instructions.trim()
  }

  let faq: FaqItem[] | null = null
  const rawFaq = richSrc?.['faq']
  if (rawFaq != null) {
    faq = normaliseFaq(rawFaq)
  }
  if (!faq) {
    faq = buildPersianFaq({
      titleFa: service.titleFa,
      deliveryFa: service.deliveryTimeFa,
      planCount: Number(service.planCount ?? 0),
      inStock: Boolean(service.inStock),
      isAi: Boolean(service.isAi),
    })
  }
  if (faq && faq.length > 0) {
    out.faq = faq
    withFaq++
  }

  const outPath = resolve(servicesDir, `${slug}.json`)
  writeFileSync(outPath, JSON.stringify(out), 'utf8')
  written++
}

console.log(
  `[enrich] wrote ${written} per-service files to public/data/services`,
)
console.log(
  `[enrich]   long descriptions: ${withLongDesc}, ` +
    `SEO titles: ${withSeoTitle}, ` +
    `SEO descriptions: ${withSeoDesc}, ` +
    `FAQ blocks: ${withFaq}`,
)

let totalSize = 0
for (const f of readdirSync(servicesDir)) {
  totalSize += statSync(resolve(servicesDir, f)).size
}
console.log(
  `[enrich]   total size: ${totalSize.toLocaleString('en-US')} bytes (${Math.round(totalSize / 1024).toLocaleString('en-US')} KB)`,
)
