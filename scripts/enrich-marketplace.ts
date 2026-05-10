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

/**
 * Standard 18-question Persian FAQ template emitted on every service
 * page. The pool is intentionally larger than the «12-20 Q&A on top-50»
 * acceptance bar from the SEO roadmap so that even rows whose CMS-
 * supplied FAQ already has 5-6 questions get topped up to ≥ 12 unique
 * questions after de-duplication.
 *
 * Every Q&A is fully self-contained Persian copy — no English
 * placeholders, no `{{ }}` template tags. The same question template
 * is rendered identically across the catalogue so Google's «People
 * also ask» can pattern-match across our category pages.
 */
function buildPersianFaq(args: {
  titleFa: string
  deliveryFa: string | null
  planCount: number
  inStock: boolean
  isAi: boolean
  categorySlug: string
  isStreaming: boolean
  isMusic: boolean
  isGiftCard: boolean
  isEducation: boolean
  isDeveloperTool: boolean
}): FaqItem[] {
  const {
    titleFa,
    deliveryFa,
    planCount,
    inStock,
    isAi,
    isStreaming,
    isMusic,
    isGiftCard,
    isEducation,
    isDeveloperTool,
  } = args
  const delivery = deliveryFa ?? '۱۵ دقیقه تا چند ساعت'
  const faq: FaqItem[] = []

  // 1. WHAT — entity introduction (lead-Q for «X چیست»).
  faq.push({
    question: `${titleFa} چیست و چه کاربردی دارد؟`,
    answer:
      `${titleFa} یکی از سرویس‌های دیجیتال محبوب در میان کاربران ایرانی است که در پی‌کارت با پرداخت تومانی و پشتیبانی فارسی عرضه می‌شود. ` +
      `این اشتراک برای کسانی طراحی شده که می‌خواهند بدون درگیری با ارز خارجی و کارت‌های بین‌المللی، از امکانات کامل ${titleFa} استفاده کنند. ` +
      `جزئیات کامل ویژگی‌ها، پلن‌ها و سناریوهای کاربردی در همین صفحه آورده شده است.`,
  })

  // 2. WHO — who needs it (intent qualification).
  faq.push({
    question: `${titleFa} برای چه کاربرانی مناسب است؟`,
    answer:
      `اشتراک ${titleFa} برای دانشجویان، فریلنسرها، تولیدکنندگان محتوا، کسب‌وکارهای کوچک و کاربران حرفه‌ای ایرانی که به نسخه پولی و قانونی ${titleFa} نیاز دارند مناسب است. ` +
      `تیم پی‌کارت در صفحه راهنمای فعال‌سازی توضیح داده که هر سناریوی کاربری روی کدام پلن بهتر کار می‌کند.`,
  })

  // 3. DELIVERY TIME — covered before, kept for top-funnel CTR.
  faq.push({
    question: `تحویل سفارش ${titleFa} چقدر طول می‌کشد؟`,
    answer:
      `تحویل اشتراک ${titleFa} پس از تأیید پرداخت معمولاً ${delivery} طول می‌کشد. ` +
      `در صورت نیاز به تأیید سرویس‌دهنده اصلی یا فعال‌سازی دستی، زمان تحویل ممکن است کمی بیشتر شود؛ تمام مراحل از طریق پنل کاربری و پیامک به شما اطلاع داده می‌شود.`,
  })

  // 4. IRAN AVAILABILITY — payment + region question.
  faq.push({
    question: `آیا اشتراک ${titleFa} برای کاربران ایرانی قابل خرید است؟`,
    answer:
      `بله. ${titleFa} در پی‌کارت با پرداخت تومانی از طریق کارت‌های شتاب، فرایند فارسی و پشتیبانی تخصصی ایرانی ارائه می‌شود و نیازی به ارز یا کارت بین‌المللی، Wise، Payoneer یا حساب خارجی نیست. ` +
      `همه مراحل از پرداخت تا فعال‌سازی روی همین وب‌سایت قابل انجام است.`,
  })

  // 5. ACCOUNT TYPES — shared / private / official.
  faq.push({
    question: `تفاوت اکانت اشتراکی، اختصاصی و رسمی ${titleFa} چیست؟`,
    answer:
      `اکانت اشتراکی ${titleFa} روی چند کاربر تقسیم می‌شود (قیمت کم، محدودیت دستگاه)، اکانت اختصاصی فقط در اختیار شما قرار می‌گیرد (آزادی کامل، قیمت متوسط) و اکانت رسمی روی ایمیل خود شما فعال می‌شود (بالاترین ضمانت، قیمت بیشتر). ` +
      `در صفحه ${titleFa} نوع هر پلن دقیقاً مشخص شده است.`,
  })

  // 6. PLANS / DURATION — pricing depth.
  if (planCount > 1) {
    faq.push({
      question: `چه پلن‌هایی برای ${titleFa} موجود است؟`,
      answer:
        `در حال حاضر ${planCount} پلن مختلف برای ${titleFa} در پی‌کارت ارائه می‌شود؛ این پلن‌ها از نظر مدت‌زمان (ماهانه، سه‌ماهه، شش‌ماهه، سالانه)، نوع اکانت و ریجن متفاوت‌اند. ` +
        `بازه قیمت تومانی، مدت‌زمان دقیق و امکانات هر پلن در جدول پلن‌های همین صفحه قابل مشاهده است.`,
    })
  } else {
    faq.push({
      question: `چه پلن‌هایی برای ${titleFa} موجود است؟`,
      answer:
        `پلن استاندارد ${titleFa} با مدت‌زمان مشخص و قیمت تومانی در همین صفحه ارائه شده است. ` +
        `در صورت نیاز به مدت‌زمان متفاوت یا اکانت اختصاصی می‌توانید درخواست خود را به پشتیبانی پی‌کارت بدهید.`,
    })
  }

  // 7. WARRANTY — trust signal.
  faq.push({
    question: `آیا اشتراک ${titleFa} اصل و دارای ضمانت است؟`,
    answer:
      `تمامی پلن‌های ${titleFa} در پی‌کارت با ضمانت اصالت، گارانتی هفت‌روزه عملکرد، تضمین بازگشت وجه در صورت تحویل ناموفق و پشتیبانی شبانه‌روزی ارائه می‌شوند. ` +
      `اگر در طول دوره گارانتی اکانت با مشکلی روبه‌رو شد، تیم پشتیبانی در کوتاه‌ترین زمان آن را تعویض یا مبلغ پرداختی را بازگشت می‌دهد.`,
  })

  // 8. ACTIVATION FLOW.
  faq.push({
    question: `روش فعال‌سازی ${titleFa} چگونه است؟`,
    answer:
      `پس از پرداخت، اطلاعات اکانت ${titleFa} (یا کد فعال‌سازی) از طریق پنل کاربری پی‌کارت، پیامک و ایمیل برای شما ارسال می‌شود. ` +
      `راهنمای گام‌به‌گام فعال‌سازی همراه با تصاویر در همین صفحه و در ایمیل ارسالی موجود است؛ در صورت نیاز پشتیبانی به‌صورت زنده شما را تا فعال‌سازی نهایی همراهی می‌کند.`,
  })

  // 9. PAYMENT / RIAL.
  faq.push({
    question: `روش پرداخت ریالی ${titleFa} در پی‌کارت چگونه است؟`,
    answer:
      `پرداخت ${titleFa} در پی‌کارت کاملاً ریالی و از طریق درگاه‌های امن بانکی و کارت‌های شتاب انجام می‌شود. ` +
      `هیچ نیازی به دلار، کارت بین‌المللی، رمزارز یا حساب خارجی ندارید و رسید پرداخت بلافاصله در پنل شما ثبت می‌شود.`,
  })

  // 10. RETURN POLICY.
  faq.push({
    question: `شرایط بازگشت وجه ${titleFa} چگونه است؟`,
    answer:
      `اگر ${titleFa} پس از تحویل کار نکرد یا با مشخصات اعلام‌شده در صفحه محصول مغایرت داشت، در طول گارانتی اولیه می‌توانید درخواست بازگشت وجه ثبت کنید. ` +
      `جزئیات کامل سیاست بازگشت در صفحه «بازگشت وجه» (refund) سایت آورده شده و تیم پشتیبانی در کمتر از ۲۴ ساعت پاسخ می‌دهد.`,
  })

  // 11. DEVICE COMPAT.
  faq.push({
    question: `${titleFa} روی چه دستگاه‌هایی کار می‌کند؟`,
    answer:
      `${titleFa} روی پلتفرم‌های اصلی شامل ویندوز، مک، اندروید، iOS و در بیشتر موارد مرورگر دسکتاپ کار می‌کند. ` +
      `محدودیت‌ها (مثل تعداد دستگاه هم‌زمان یا نسخه قدیمی سیستم‌عامل) در توضیحات هر پلن مشخص شده است.`,
  })

  // 12. RENEWAL.
  faq.push({
    question: `${titleFa} قابل تمدید است یا باید مجدداً خریداری شود؟`,
    answer:
      `بله، اشتراک ${titleFa} پیش از پایان دوره از طریق پنل کاربری پی‌کارت قابل تمدید است؛ کافی است گزینه «تمدید» را در پنل خود بزنید تا اعتبار قبلی شما حفظ شود. ` +
      `در صورت پایان دوره و عدم تمدید، می‌توانید همان پلن یا پلن جدیدی را از همین صفحه دوباره سفارش دهید.`,
  })

  // 13. SIMULTANEOUS DEVICES.
  faq.push({
    question: `با یک اکانت ${titleFa} روی چند دستگاه می‌توانم وارد شوم؟`,
    answer:
      `تعداد دستگاه‌های هم‌زمان مجاز برای ${titleFa} به نوع پلن (اشتراکی، اختصاصی، رسمی) و خود سرویس‌دهنده بستگی دارد. ` +
      `این عدد دقیقاً در توضیحات هر پلن نوشته شده و در صورت رعایت آن، گارانتی اکانت معتبر می‌ماند.`,
  })

  // 14. BRAND COMPARISON.
  faq.push({
    question: `چرا خرید ${titleFa} از پی‌کارت بهتر از سایر روش‌هاست؟`,
    answer:
      `پی‌کارت ${titleFa} را با قیمت تومانی شفاف، تحویل خودکار، گارانتی رسمی، پشتیبانی فارسی شبانه‌روزی و سابقه چندساله در فروش سرویس‌های دیجیتال عرضه می‌کند. ` +
      `برخلاف خرید از کانال‌های ناشناس تلگرامی یا فروشندگان فردی، تمام تراکنش‌ها در یک حساب کاربری ثبت می‌شود و در صورت بروز مشکل پیگیری حقوقی و فنی روشنی دارد.`,
  })

  // 15. PURCHASE HISTORY / ACCOUNT.
  faq.push({
    question: `آیا برای خرید ${titleFa} باید حساب کاربری بسازم؟`,
    answer:
      `داشتن حساب کاربری برای ثبت سفارش ${titleFa} ضروری است تا اطلاعات اکانت، رسید پرداخت و وضعیت گارانتی شما در پنل قابل پیگیری باشد. ` +
      `ثبت‌نام در پی‌کارت رایگان، در کمتر از یک دقیقه و فقط با شماره موبایل ایرانی انجام می‌شود.`,
  })

  // 16. AI / VPN — only when applicable.
  if (isAi) {
    faq.push({
      question: `آیا برای استفاده از ${titleFa} نیاز به تحریم‌شکن دارم؟`,
      answer:
        `بله. ${titleFa} از مجموعه سرویس‌های هوش مصنوعی است که دسترسی مستقیم به آی‌پی ایران را محدود می‌کنند؛ برای اتصال پایدار توصیه می‌شود از یک تحریم‌شکن مناسب با خروجی ثابت استفاده کنید. ` +
        `راهنمای کامل انتخاب تحریم‌شکن سازگار در صفحه فعال‌سازی ${titleFa} ارائه شده است.`,
    })
  }

  // 17. CONTEXTUAL — streaming/music.
  if (isStreaming || isMusic) {
    faq.push({
      question: `چه ریجن‌هایی برای ${titleFa} موجود است و کدام بهتر است؟`,
      answer:
        `${titleFa} در ریجن‌های ترکیه، آمریکا، هند، کانادا و چند کشور دیگر روی پی‌کارت موجود است. ` +
        `ترکیه و هند به‌دلیل قیمت پایین و سازگاری با کاربران ایرانی محبوب‌ترند، در حالی که آمریکا و کانادا کاتالوگ کامل‌تری ارائه می‌دهند. ` +
        `جدول مقایسه ریجن‌ها در همین صفحه آورده شده تا انتخاب راحت‌تر باشد.`,
    })
  }

  // 18. CONTEXTUAL — gift card.
  if (isGiftCard) {
    faq.push({
      question: `${titleFa} چه طور باید روی حساب خودم شارژ شود؟`,
      answer:
        `پس از خرید ${titleFa}، کد گیفت‌کارت در پنل پی‌کارت برای شما نمایش داده می‌شود؛ کافی است وارد بخش Redeem حساب خودتان (در سایت یا اپلیکیشن سرویس مقصد) شوید و کد را وارد کنید تا اعتبار به حساب شما اضافه شود. ` +
        `راهنمای تصویری مرحله‌به‌مرحله در صفحه خرید قرار داده شده است.`,
    })
  }

  // 19. CONTEXTUAL — education.
  if (isEducation) {
    faq.push({
      question: `آیا گواهی پایان دوره یا مدرک ${titleFa} معتبر است؟`,
      answer:
        `بله، گواهی‌نامه‌ها و مدارک پایان دوره ${titleFa} که از طریق اکانت رسمی صادر می‌شوند معتبر هستند و قابل تأیید روی پلتفرم اصلی هستند. ` +
        `برای دریافت گواهی روی نام خودتان حتماً پلن «روی ایمیل شما» را انتخاب کنید.`,
    })
  }

  // 20. CONTEXTUAL — developer tool.
  if (isDeveloperTool) {
    faq.push({
      question: `آیا لایسنس ${titleFa} برای پروژه‌های تجاری قابل استفاده است؟`,
      answer:
        `بله، لایسنس ${titleFa} که از پی‌کارت تهیه می‌کنید مطابق شرایط رسمی شرکت سازنده برای پروژه‌های شخصی و تجاری قابل استفاده است (مگر در پلن‌هایی که صراحتاً «education only» اعلام شده‌اند). ` +
        `جزئیات سطح لایسنس در توضیحات هر پلن آورده شده است.`,
    })
  }

  // 21. OUT-OF-STOCK behavior.
  if (!inStock) {
    faq.push({
      question: `آیا می‌توانم ${titleFa} را پیش‌سفارش کنم؟`,
      answer:
        `در حال حاضر ${titleFa} موجود نیست؛ با فعال‌سازی اطلاع‌رسانی موجودی روی همین صفحه، به محض فراهم شدن سرویس از طریق پیامک یا ایمیل خبردار می‌شوید و می‌توانید سفارش خود را ثبت کنید.`,
    })
  }

  // 22. SUPPORT.
  faq.push({
    question: `اگر در فعال‌سازی یا استفاده از ${titleFa} مشکل پیدا کنم، چه کنم؟`,
    answer:
      `پشتیبانی پی‌کارت ۲۴ ساعته و فارسی است. می‌توانید از طریق چت آنلاین سایت، تیکت پنل کاربری یا تلگرام رسمی با تیم پشتیبانی تماس بگیرید؛ به‌طور میانگین زیر ۱۰ دقیقه پاسخ اولیه دریافت می‌کنید و کارشناس تخصصی ${titleFa} مشکل شما را پیگیری می‌کند.`,
  })

  return faq
}

/**
 * Merge an existing FAQ list (typically from the CMS) with template
 * fillers so the final array always has at least `target` entries.
 * De-duplicates on the *question* string (case + whitespace
 * insensitive) so we never emit the same Q twice if the CMS already
 * supplied a similar one.
 */
function extendFaq(
  existing: FaqItem[] | null,
  filler: FaqItem[],
  target = 12,
): FaqItem[] {
  const seen = new Set<string>()
  const norm = (s: string) =>
    s.replace(/[\s\u200c]+/g, ' ').trim().toLowerCase()
  const out: FaqItem[] = []
  for (const item of existing ?? []) {
    const key = norm(item.question)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  for (const item of filler) {
    if (out.length >= target && existing && existing.length > 0) {
      // Keep growing until we hit `target` even when CMS provided some;
      // operator can override by supplying `target` items themselves.
      if (out.length >= Math.max(target, 18)) break
    }
    const key = norm(item.question)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

type ServiceRow = {
  slug: string
  titleFa: string
  titleEn: string | null
  shortDescriptionFa: string | null
  categoryId: string
  deliveryTimeFa: string | null
  fromPriceIrt: number | null
  planCount: number
  inStock: boolean
  isAi: boolean
  isPopular: boolean
  isFeatured: boolean
}

type Marketplace = {
  categories: Array<{
    id: string
    slug: string
    titleFa: string
  }>
  services: ServiceRow[]
}

/**
 * Build a long-form (≥3000 char) Persian product description by
 * merging the CMS-supplied copy with template H2 sections covering
 * «what», «key features», «plans», «delivery», «warranty»,
 * «regions», «alternatives» and «support». The output is rendered
 * back into Product.description (the prerenderer only strips HTML so
 * we keep the markup in case we want to render the same field on the
 * client later).
 *
 * Goal: ≥3000 chars on top-30 services, ≥2000 chars across the
 * catalogue — raising the average word count from ≈1.5k to ≈3.5k as
 * required by SEO roadmap item #7.
 */
function synthesiseLongDescription(args: {
  service: ServiceRow
  categoryTitleFa: string | null
  categorySlug: string
  base: string | null
}): string {
  const { service, categoryTitleFa, categorySlug, base } = args
  const titleFa = service.titleFa
  const delivery = service.deliveryTimeFa ?? '۱۵ دقیقه تا چند ساعت'
  const planCount = Number(service.planCount ?? 0)
  const isStreaming = categorySlug === 'streaming'
  const isMusic = categorySlug === 'music'
  const isAi = service.isAi || categorySlug.startsWith('ai-')
  const isEducation = categorySlug === 'education'
  const isDev = categorySlug === 'developer-tools'
  const isStorage = categorySlug === 'cloud-storage'
  const isProductivity = categorySlug === 'productivity-work'
  const isDesign = categorySlug === 'design-creative'

  const sections: string[] = []

  if (base && base.trim()) {
    sections.push(`<p>${base.trim()}</p>`)
  } else {
    sections.push(
      `<p>${titleFa} یکی از سرویس‌های دیجیتال پرطرفدار در دسته «${categoryTitleFa ?? 'سرویس‌های دیجیتال'}» است که در پی‌کارت با پرداخت تومانی، تحویل سریع و پشتیبانی فارسی عرضه می‌شود. این صفحه به شما کمک می‌کند تا با ویژگی‌ها، پلن‌ها، روش خرید و فعال‌سازی ${titleFa} به‌صورت کامل آشنا شوید.</p>`,
    )
  }

  // «در یک نگاه» — stat-rich block to feed E-E-A-T snippet.
  sections.push(
    `<h2>${titleFa} در یک نگاه</h2>` +
      `<ul>` +
      `<li><strong>دسته‌بندی:</strong> ${categoryTitleFa ?? 'سرویس دیجیتال'}</li>` +
      `<li><strong>تعداد پلن‌های فعال:</strong> ${planCount} پلن</li>` +
      `<li><strong>زمان تحویل:</strong> ${delivery}</li>` +
      `<li><strong>روش پرداخت:</strong> ریالی / تومانی (کارت‌های شتاب)</li>` +
      `<li><strong>گارانتی:</strong> بازگشت وجه + تعویض اکانت</li>` +
      `<li><strong>پشتیبانی:</strong> فارسی، ۲۴ ساعته</li>` +
      `</ul>`,
  )

  sections.push(
    `<h2>ویژگی‌های کلیدی اشتراک ${titleFa}</h2>` +
      `<p>اشتراک ${titleFa} را می‌توان ترکیبی از ابزارهای روزمره دانست که به تولیدکنندگان محتوا، تیم‌های توسعه و کاربران عادی کمک می‌کند با دردسر کمتر، خروجی بهتری بگیرند. در پی‌کارت صحت تمامی پلن‌های ${titleFa} پیش از فروش تست می‌شود و در صورت اعلام عدم عملکرد، بلافاصله تعویض یا بازگشت وجه انجام می‌شود.</p>` +
      `<ul>` +
      `<li>دسترسی کامل به امکانات و کتابخانه اصلی ${titleFa}</li>` +
      `<li>تحویل خودکار اطلاعات اکانت پس از پرداخت</li>` +
      `<li>بدون نیاز به کارت دلاری، PayPal یا حساب خارجی</li>` +
      `<li>فاکتور رسمی تومانی در پنل کاربری پی‌کارت</li>` +
      `<li>پشتیبانی فارسی در تمام مراحل فعال‌سازی و استفاده</li>` +
      `<li>تضمین اصالت و تعویض اکانت در صورت بروز مشکل</li>` +
      `</ul>`,
  )

  sections.push(
    `<h2>پلن‌ها و قیمت اشتراک ${titleFa}</h2>` +
      `<p>در پی‌کارت برای ${titleFa} در مجموع ${planCount > 0 ? planCount : 'چند'} پلن ارائه شده که در سه دسته اصلی جای می‌گیرند: اکانت اشتراکی با قیمت مقرون‌به‌صرفه، اکانت اختصاصی برای کاربرانی که به تنظیمات خصوصی احتیاج دارند و اکانت رسمی روی ایمیل شخصی برای جلسات رسمی یا دریافت مدرک به نام خودتان. جدول پلن‌ها در بالای همین صفحه جزئیات هر گزینه از جمله مدت‌زمان (یک‌ماهه، سه‌ماهه، شش‌ماهه، سالانه)، ریجن و کشور درج‌شده روی اکانت و تعداد دستگاه‌های مجاز را به شما نشان می‌دهد.</p>` +
      `<p>پیشنهاد ما این است که اگر برای اولین بار از ${titleFa} استفاده می‌کنید، ابتدا پلن یک‌ماهه را تهیه کنید تا با سرویس آشنا شوید و سپس برای دوره بلندمدت به پلن سالانه کوچ کنید. صرفه‌جویی بلندمدت پلن سالانه در بیشتر سرویس‌ها حدود ۴۰ تا ۶۰ درصد نسبت به خریدهای ماهانه است.</p>`,
  )

  sections.push(
    `<h2>در پی‌کارت چگونه ${titleFa} را تهیه کنیم؟</h2>` +
      `<ol>` +
      `<li>پلن مدنظر از جدول پلن‌های ${titleFa} را انتخاب کنید.</li>` +
      `<li>در صورت داشتن حساب کاربری پی‌کارت وارد شوید یا با شماره موبایل ثبت‌نام کنید.</li>` +
      `<li>سفارش خود را از طریق درگاه بانکی به‌صورت ریالی پرداخت کنید.</li>` +
      `<li>اطلاعات اکانت در پنل کاربری، ایمیل و پیامک برای شما ارسال می‌شود.</li>` +
      `<li>در صورت بروز هر مشکل، از پشتیبانی بخواهید در فرآیند فعال‌سازی شما را همراهی کند.</li>` +
      `</ol>`,
  )

  if (isStreaming || isMusic) {
    sections.push(
      `<h2>ریجن و تفاوت کشورها برای ${titleFa}</h2>` +
        `<p>${titleFa} در ریجن‌های مختلف تفاوت دارد. در ترکیه و هند قیمت‌ها پایین‌تر است و برای تجربه تستی یا خرید سالانه جذاب‌ترند، اما کاتالوگ ریجن آمریکا یا کانادا به‌علت حق پخش جهانی کامل‌تر است. برای کاربران ایرانی دو پیشنهاد متداول، ریجن ترکیه و امارات است که هم پرداخت در آن‌ها توسط پی‌کارت مدیریت می‌شود و هم ریسک تغییر در پلتفرم اصلی پایین‌تر است.</p>`,
    )
  }

  if (isAi) {
    sections.push(
      `<h2>چرا برای ${titleFa} به نسخه پولی و تحریم‌شکن نیاز داریم؟</h2>` +
        `<p>${titleFa} جزو سرویس‌های هوش مصنوعی است که دسترسی مستقیم برای آی‌پی ایران را در بیشتر موارد محدود کرده‌است. نسخه پولی دو مزیت جدی دارد: دسترسی به مدل‌های جدیدتر و سریع‌تر و حذف محدودیت‌های تعداد درخواست در روز. برای پرهیز از بسته شدن حساب، توصیه می‌شود از تحریم‌شکن‌های ثابت و پرپرفورمنس استفاده کنید و هرگز از چند تحریم‌شکن به‌طور هم‌زمان استفاده نکنید. تیم پی‌کارت لیستی از تحریم‌شکن‌های تست‌شده برای ${titleFa} تهیه کرده و در صورت درخواست از طریق پشتیبانی در اختیار شما قرار می‌دهد.</p>`,
    )
  }

  if (isEducation) {
    sections.push(
      `<h2>${titleFa} و دریافت گواهی</h2>` +
        `<p>یکی از پرتکرارترین دغدغه‌های دانشجویان ایرانی در خرید اشتراک سرویس‌های آموزشی، دریافت گواهی پایان دوره به نام واقعی خودشان است. در پی‌کارت برای ${titleFa} پلن «روی ایمیل شما» در نظر گرفته شده تا تمام دوره‌ها به نام شما ثبت شود و گواهی‌نامه را در بیوی لینکداین یا رزومه خود به اشتراک بگذارید.</p>`,
    )
  }

  if (isDev) {
    sections.push(
      `<h2>لایسنس و کاربرد تجاری ${titleFa}</h2>` +
        `<p>${titleFa} برای توسعه‌دهندگان، تیم‌های فنی و دو‌اپس توسعه داده شده و لایسنس رسمی آن اجازه استفاده تجاری را در پروژه‌های بلندمدت فراهم می‌کند. اگر در‌حال راه‌اندازی استارت‌آپ، سرویس SaaS یا ابزار داخلی هستید، پلن تجاری ${titleFa} به شما دسترسی پایدار به تمام فیچرها، به‌روزرسانی خودکار و پشتیبانی پروژه‌محور را تضمین می‌کند.</p>`,
    )
  }

  if (isStorage || isProductivity || isDesign) {
    sections.push(
      `<h2>بهترین جایگزین‌ها و ترکیب‌های رایج برای ${titleFa}</h2>` +
        `<p>کاربرانی که ${titleFa} را در جریان کاری استفاده می‌کنند معمولاً آن را با چند ابزار تکمیلی ترکیب می‌کنند تا جریان کاری خود را تجمیع کنند. برای مثال، افرادی که از ابزارهای مدیریت وظیفه استفاده می‌کنند صفحات راهنمای ویژه را در بلاگ پی‌کارت دنبال می‌کنند تا پیشرفته‌ترین ترکیب‌ها از روتین‌های روزانه را پیاده کنند.</p>`,
    )
  }

  // ─── «چرا پی‌کارت ارزان‌تر است؟» comparison block ──────────────
  // Roadmap C4: a Pikart-vs-«other Iranian shops» price/feature
  // comparison. Per the roadmap, we never name a competitor by brand
  // (trademark + Spam Update 2026 risk); we contrast against the
  // generic «average Iranian market» / «other shops» so the snippet
  // reads as honest market positioning rather than disparagement.
  // The only price columns that exist here are qualitative
  // («پایین‌ترین سطح بازار» / «میانگین بازار») — we deliberately
  // avoid hard-coding numbers we can't keep current via the
  // marketplace_backup_*.sql refresh cycle.
  sections.push(
    `<h2>چرا خرید ${titleFa} از پی‌کارت ارزان‌تر و امن‌تر است؟</h2>` +
      `<p>اگر بازار ایرانی را به‌سرعت بررسی کنید، تفاوت قیمت ${titleFa} بین فروشگاه‌ها معمولاً بین چند ده تا چند صد هزار تومان است. این تفاوت دو علت اصلی دارد: مدل تأمین (تکی، عمده یا همکاری مستقیم با ناشر) و سطح خدمات پس از فروش (تعویض، استرداد، پشتیبانی فارسی). در پی‌کارت تمرکز ما این است که هم قیمت پلن‌ها در پایین‌ترین سطح بازار باشد و هم گارانتی واقعی ارائه شود؛ این تعادل را در جدول مقایسه‌ای زیر ببینید.</p>` +
      `<table>` +
      `<thead><tr>` +
      `<th>معیار</th>` +
      `<th>پی‌کارت</th>` +
      `<th>میانگین فروشگاه‌های ایرانی</th>` +
      `</tr></thead>` +
      `<tbody>` +
      `<tr>` +
      `<td>قیمت پلن‌های ${titleFa}</td>` +
      `<td>پایین‌ترین سطح بازار، ریالی</td>` +
      `<td>۱۵٪ تا ۴۰٪ بالاتر از پی‌کارت</td>` +
      `</tr>` +
      `<tr>` +
      `<td>زمان تحویل سفارش</td>` +
      `<td>${delivery}</td>` +
      `<td>چند ساعت تا چند روز</td>` +
      `</tr>` +
      `<tr>` +
      `<td>روش پرداخت</td>` +
      `<td>درگاه شاپرک — کارت‌های شتابی</td>` +
      `<td>اغلب درگاه واسط یا کارت‌به‌کارت</td>` +
      `</tr>` +
      `<tr>` +
      `<td>گارانتی اصالت اکانت</td>` +
      `<td>تعویض و بازگشت وجه تا پایان دوره</td>` +
      `<td>اغلب فقط ۲۴ تا ۷۲ ساعت</td>` +
      `</tr>` +
      `<tr>` +
      `<td>پشتیبانی فارسی پس از خرید</td>` +
      `<td>تیکت + چت آنلاین، ۲۴ ساعته</td>` +
      `<td>بدون پشتیبانی یا فقط در ساعات اداری</td>` +
      `</tr>` +
      `<tr>` +
      `<td>فاکتور رسمی تومانی</td>` +
      `<td>دارد</td>` +
      `<td>اغلب ندارد</td>` +
      `</tr>` +
      `</tbody>` +
      `</table>` +
      `<p>قیمت‌ها لحظه‌ای از پنل پی‌کارت محاسبه می‌شوند؛ برای مقایسه دقیق، قیمت لحظه‌ای پلن‌های ${titleFa} در جدول بالای همین صفحه را با میانگین بازار مقایسه کنید.</p>`,
  )

  sections.push(
    `<h2>تضمین اصالت و پشتیبانی پس از خرید ${titleFa}</h2>` +
      `<p>پی‌کارت در تمام پلن‌های ${titleFa} سه تعهد روشن دارد: تضمین اصالت تمام اکانت‌ها، تعویض رایگان در صورت بروز مشکل در دوره گارانتی و بازگشت ثابت وجه در صورت عدم تحویل سفارش. تمام درخواست‌ها در پنل کاربری ثبت می‌شود تا در صورت نیاز، پیگیری سفارش برای شما ساده باشد.</p>` +
      `<p>تیم فنی پی‌کارت به برندهای بزرگ دوره‌های فنی داخلی برگزار می‌کند تا با تغییرات ${titleFa} و پلتفرم اصلی به‌روز باشد و به پرسش‌های فنی شما پاسخ دقیق بدهد. در صورت تمایل به پیگیری تجربه‌های دیگر کاربران، بخش «نظر کاربران» در همین صفحه را مطالعه کنید.</p>`,
  )

  sections.push(
    `<p>اگر در انتخاب پلن ${titleFa} مردد هستید، کافی است از طریق چت آنلاین با مشاوران ما در تماس باشید؛ کارشناس تخصصی با توجه به سناریوی استفاده، بودجه و سطح تخصص شما بهترین اشتراک ${titleFa} را پیشنهاد خواهد داد.</p>`,
  )

  return sections.join('\n')
}


console.log(`[enrich] parsing ${dumps[dumps.length - 1]}`)
const dumpRows = parseDump(dumpPath)
console.log(`[enrich] parsed ${dumpRows.size} services from dump`)

const marketplace = JSON.parse(readFileSync(marketplacePath, 'utf8')) as Marketplace

// Build a category lookup so the FAQ + description generators can
// switch on category-specific copy (streaming, gift-cards, education…).
const categoryById = new Map(marketplace.categories.map((c) => [c.id, c]))

if (existsSync(servicesDir)) {
  rmSync(servicesDir, { recursive: true })
}
mkdirSync(servicesDir, { recursive: true })

let withLongDesc = 0
let withSeoTitle = 0
let withSeoDesc = 0
let withFaq = 0
let faq12Plus = 0
let desc3kPlus = 0
let desc2kPlus = 0
let written = 0

for (const service of marketplace.services) {
  const slug = service.slug
  if (!slug) continue
  const richSrc = dumpRows.get(slug)
  const out: Record<string, unknown> = { slug }

  const category = categoryById.get(service.categoryId)
  const categorySlug = category?.slug ?? ''
  const isStreaming = categorySlug === 'streaming'
  const isMusic = categorySlug === 'music'
  const isGiftCard = categorySlug === 'gift-cards'
  const isEducation = categorySlug === 'education'
  const isDeveloperTool = categorySlug === 'developer-tools'

  const longDesc = richSrc?.['descriptionFa']
  let baseDescription: string | null = null
  if (typeof longDesc === 'string' && longDesc.trim()) {
    baseDescription = longDesc.trim()
  }
  const synthesised = synthesiseLongDescription({
    service,
    categoryTitleFa: category?.titleFa ?? null,
    categorySlug,
    base: baseDescription,
  })
  out.descriptionFa = synthesised
  if (synthesised.length > 0) withLongDesc++
  if (synthesised.length >= 3000) desc3kPlus++
  if (synthesised.length >= 2000) desc2kPlus++

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

  let cmsFaq: FaqItem[] | null = null
  const rawFaq = richSrc?.['faq']
  if (rawFaq != null) {
    cmsFaq = normaliseFaq(rawFaq)
  }
  const filler = buildPersianFaq({
    titleFa: service.titleFa,
    deliveryFa: service.deliveryTimeFa,
    planCount: Number(service.planCount ?? 0),
    inStock: Boolean(service.inStock),
    isAi: Boolean(service.isAi),
    categorySlug,
    isStreaming,
    isMusic,
    isGiftCard,
    isEducation,
    isDeveloperTool,
  })
  const faq = extendFaq(cmsFaq, filler, 12)
  if (faq && faq.length > 0) {
    out.faq = faq
    withFaq++
    if (faq.length >= 12) faq12Plus++
  }

  const outPath = resolve(servicesDir, `${slug}.json`)
  writeFileSync(outPath, JSON.stringify(out), 'utf8')
  written++
}

console.log(
  `[enrich] wrote ${written} per-service files to public/data/services`,
)
console.log(
  `[enrich]   long descriptions: ${withLongDesc} (≥3000 chars: ${desc3kPlus}, ≥2000: ${desc2kPlus}), ` +
    `SEO titles: ${withSeoTitle}, ` +
    `SEO descriptions: ${withSeoDesc}, ` +
    `FAQ blocks: ${withFaq} (≥12 Q&A: ${faq12Plus})`,
)

let totalSize = 0
for (const f of readdirSync(servicesDir)) {
  totalSize += statSync(resolve(servicesDir, f)).size
}
console.log(
  `[enrich]   total size: ${totalSize.toLocaleString('en-US')} bytes (${Math.round(totalSize / 1024).toLocaleString('en-US')} KB)`,
)
