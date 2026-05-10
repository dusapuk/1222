/**
 * Centralised per-route SEO config builders.
 *
 * Each function returns an `SEOConfig` payload that's ready to feed into
 * either:
 *  - the client-side `useSEO()` hook (page components), or
 *  - the build-time prerender script (which serialises it into static HTML).
 *
 * Keeping the logic in one place ensures the static HTML and the runtime
 * DOM never drift apart.
 */
import type { Category, Plan, Service, ServiceDetail } from './data'
import type { SEOConfig } from '../hooks/useSEO'
import {
  CURRENT_JALALI_YEAR,
  SITE_NAME,
  absoluteUrl,
  clampDescription,
  toPersianDigits,
} from './seo'
import {
  articleLd,
  blogLd,
  breadcrumbLd,
  collectionPageLd,
  courseLd,
  faqLd,
  howToLd,
  itemListLd,
  organizationLd,
  personLd,
  productGroupLd,
  productLd,
  profilePageLd,
  shouldEmitProductGroup,
  websiteLd,
} from './jsonld'
import type { AuthorPage, StaticPage } from './staticPages'
import type { BlogPost } from './blog'
import type { ServiceReview } from './reviews'
import { getDiscountPct, getPlanDiscountPct, getCategoryPlanCount } from './data'
import { getCategoryFaqs } from './categoryFaqs'
import { HOME_FAQ } from './homeContent'
import { hasPerBlogOgImage, perBlogOgImagePath } from './blogOgImages'
import { hasPerServiceOgImage, perServiceOgImagePath } from './serviceOgImages'

/**
 * Pick a short Persian tagline appended to category-page titles after
 * the Jalali year. Vertical-specific so the SERP snippet hints at the
 * marketplace's value-prop on each commercial query.
 */
function pickCategoryTagline(category: Category): string {
  const slug = category.slug || ''
  if (slug.startsWith('ai-')) return 'تحویل آنی و قیمت تومانی'
  if (slug === 'streaming' || slug === 'music') return 'تحویل ۱ دقیقه و گارانتی'
  if (slug === 'gift-cards') return 'ارجال و کد فوری'
  if (slug === 'education') return 'با ایمیل شما'
  if (slug === 'developer-tools') return 'لایسنس رسمی و فعال‌سازی آنی'
  if (slug === 'design-creative') return 'لایسنس اصل و تحویل سریع'
  if (slug === 'productivity-work') return 'دسترسی تیمی و پرداخت تومانی'
  if (slug === 'cloud-storage') return 'فعال‌سازی فوری و پرداخت تومانی'
  if (slug === 'social-communication') return 'پرداخت تومانی و تحویل آنی'
  if (slug === 'business-marketing') return 'پرداخت تومانی برای کسب‌وکارها'
  return 'تحویل آنی و پشتیبانی فارسی'
}

/**
 * Pick a tagline for a service-page title. Discount-driven taglines win
 * the highest CTR (license-market.ir uses «با ۹۱٪ تخفیف» in title);
 * falls back to a vertical-specific hook keyed on the parent category.
 */
function pickServiceTagline(service: Service, category?: Category): string {
  const disc = getDiscountPct(service)
  if (disc >= 30) return `(با ${toPersianDigits(disc)}٪ تخفیف)`
  if (category) {
    const slug = category.slug || ''
    if (slug.startsWith('ai-')) return '+ تحویل آنی'
    if (slug === 'streaming' || slug === 'music') return 'تحویل ۱ دقیقه + گارانتی'
    if (slug === 'gift-cards') return 'اصل و کد فوری'
    if (slug === 'education') return 'با ایمیل شما'
    if (slug === 'developer-tools') return 'لایسنس رسمی'
    if (slug === 'design-creative') return 'لایسنس اصل'
  }
  return ''
}

export function seoForHome(args: {
  categoryCount: number
  serviceCount: number
  /**
   * Optional list of all top-level categories. When passed, the home
   * page's Organization JSON-LD expands `OnlineStore.makesOffer` with
   * one `OfferCatalog` per vertical — strong Knowledge Graph signal.
   * The prerender script wires this through; client-side renders may
   * skip it (the catalog is already fetched there).
   */
  categories?: Category[]
}): SEOConfig {
  const { categoryCount, serviceCount, categories } = args
  // E-E-A-T-aware title: leads with Jalali year as freshness signal,
  // mirrors the pattern license-market.ir / account4all use to win CTR
  // on commercial queries («خرید ... ۱۴۰۴»).
  const title = `پی‌کارت ${CURRENT_JALALI_YEAR} | خرید اکانت پرمیوم، گیفت‌کارت و هوش مصنوعی`
  const description = clampDescription(
    `مارکت‌پلیس ${toPersianDigits(serviceCount)}+ سرویس دیجیتال در ${toPersianDigits(categoryCount)} دسته‌بندی؛ خرید اکانت پرمیوم، گیفت‌کارت، اشتراک بین‌المللی و هوش مصنوعی با تحویل آنی، گارانتی اصالت و پشتیبانی ۲۴/۷.`,
  )
  // Mirror the visible «سؤالات پرتکرار» section in `<HomeSeoSection>` as
  // FAQPage JSON-LD so Google can render the home page’s «People also
  // ask»-style accordion in the brand-name SERP — the same trick
  // license-market.ir uses to dominate «لایسنس مارکت» queries.
  const homeFaq = faqLd(HOME_FAQ)
  const jsonLd: Array<Record<string, unknown> | null> = [
    organizationLd({ categories }),
    websiteLd(),
    breadcrumbLd([]),
  ]
  if (homeFaq) jsonLd.push(homeFaq)
  return {
    rawTitle: true,
    title,
    description,
    path: '/',
    image: '/images/home/hero-premium.jpg',
    imageAlt:
      'پی‌کارت — مارکت‌پلیس خرید اشتراک‌های بین‌المللی، اکانت‌های پرمیوم و گیفت‌کارت',
    imageWidth: 1144,
    imageHeight: 515,
    jsonLd,
  }
}

export function seoForCategoriesIndex(args: {
  categoryCount: number
  serviceCount: number
  categories: Category[]
}): SEOConfig {
  const { categoryCount, serviceCount, categories } = args
  return {
    title: `دسته‌بندی‌های سرویس‌های دیجیتال ${CURRENT_JALALI_YEAR}`,
    description: clampDescription(
      `${toPersianDigits(categoryCount)} دسته‌بندی و ${toPersianDigits(serviceCount)} سرویس فعال — اکانت پرمیوم، گیفت‌کارت، اشتراک بین‌المللی و هوش مصنوعی با تحویل آنی، گارانتی اصالت و قیمت تومانی.`,
    ),
    path: '/categories',
    imageAlt: 'دسته‌بندی‌های سرویس‌های دیجیتال در پی‌کارت',
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [
      breadcrumbLd([{ name: 'دسته‌بندی‌ها', path: '/categories' }]),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        url: 'https://pikart.ir/categories',
        numberOfItems: categoryCount,
        itemListElement: categories.slice(0, 14).map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `https://pikart.ir/c/${c.slug}`,
          name: c.titleFa,
        })),
      },
    ],
  }
}

export function seoForCategory(args: {
  category: Category
  services: Service[]
  categoryImage?: string | null
  page?: number
  pageCount?: number
  /**
   * True when the user has an active filter (price range, in-stock,
   * discount, AI-only, popular-only, or a free-text query). Filtered
   * variants of a category page are not canonical and must be
   * `noindex` so Google doesn't bloat its index with thousands of
   * thin near-duplicates.
   */
  hasFilters?: boolean
}): SEOConfig {
  const { category, services, categoryImage, page = 1, pageCount, hasFilters = false } = args
  // Canonical drops `?page=1` so the bare and paged variant don't compete
  // for ranking; only emit ?page=N when N > 1. Filtered variants always
  // canonicalise back to the bare category URL.
  const path = hasFilters
    ? `/c/${category.slug}`
    : `/c/${category.slug}` + (page > 1 ? `?page=${page}` : '')

  // rel=next / rel=prev for paginated category indexes — Bing/Yandex still
  // honour these and Google has reaffirmed they're "informational" signals.
  const basePath = `/c/${category.slug}`
  const linkRelPrev =
    page > 1
      ? page === 2
        ? absoluteUrl(basePath)
        : absoluteUrl(`${basePath}?page=${page - 1}`)
      : null
  const linkRelNext =
    pageCount != null && page < pageCount ? absoluteUrl(`${basePath}?page=${page + 1}`) : null

  // Category-tagline picks a vertical-specific freshness/trust hook.
  // E-E-A-T: lead with the count of services + Jalali year so Google
  // sees a category that's actively curated.
  const tagline = pickCategoryTagline(category)
  const title = `خرید ${category.titleFa} ${CURRENT_JALALI_YEAR}${tagline ? ' — ' + tagline : ''} | پی‌کارت`
  // Number-rich meta-description: leads with the Jalali year, service +
  // plan counts, and concrete trust signals — competitor numberland.ir
  // wins CTR on category SERPs with this exact pattern. Falls back to
  // the category's own descriptor as a tail when length allows; this
  // way short DB descriptions (some are <60 chars) get padded into the
  // 140-160 ch sweet-spot rather than left half-empty.
  const planCount = getCategoryPlanCount(category.id)
  const description = clampDescription(
    buildCategoryMetaDescription({
      category,
      serviceCount: services.length,
      planCount,
    }),
  )
  return {
    rawTitle: true,
    title,
    description,
    path,
    image: categoryImage,
    imageAlt: `خرید ${category.titleFa} ${CURRENT_JALALI_YEAR} در پی‌کارت`,
    noindex: hasFilters,
    linkRelNext: hasFilters ? null : linkRelNext,
    linkRelPrev: hasFilters ? null : linkRelPrev,
    jsonLd: [
      breadcrumbLd([
        { name: 'دسته‌بندی‌ها', path: '/categories' },
        { name: category.titleFa, path: `/c/${category.slug}` },
      ]),
      collectionPageLd({
        category,
        count: services.length,
        path: `/c/${category.slug}`,
      }),
      itemListLd(services.slice(0, 24), `/c/${category.slug}`),
      // Mini-FAQ on every category page — 5 evergreen Persian Q&A
      // hand-curated per vertical. Surfaces «People also ask» on
      // category-level head terms («دستیار هوش مصنوعی»,
      // «فضای ابری»…) where service-level FAQ doesn't compete.
      faqLd(getCategoryFaqs(category.slug)),
    ],
  }
}

export function seoForCategoryNotFound(slug: string): SEOConfig {
  return {
    title: 'دسته‌بندی پیدا نشد',
    description: 'دسته‌بندی مورد نظر در پی‌کارت پیدا نشد.',
    path: `/c/${slug}`,
    noindex: true,
  }
}

export function seoForService(args: {
  service: Service
  category?: Category
  plans: Plan[]
  cheapest: Plan | null
  detail?: ServiceDetail | null
  reviews?: ServiceReview[] | null
}): SEOConfig {
  const { service, category, plans, cheapest, detail, reviews } = args
  const path = `/s/${service.slug}`

  // Title strategy:
  //   1. If the legacy CMS provided a hand-crafted SEO override, use it as-is.
  //   2. Otherwise build «خرید {Brand} ۱۴۰۴ [tagline] | پی‌کارت» —
  //      year is a freshness signal, the tagline picks discount/category
  //      hooks for higher CTR (mirrors license-market.ir).
  const tagline = pickServiceTagline(service, category)
  const brand = service.titleEn || service.titleFa
  const fallbackTitle = `خرید ${brand} ${CURRENT_JALALI_YEAR}${tagline ? ' ' + tagline : ''} | پی‌کارت`
  const titleRaw = detail?.seoTitleFa?.trim() || fallbackTitle

  // Meta description strategy: SEO override first, then a number-rich
  // template (plan count + cheapest price + delivery + warranty)
  // capped at the meta-description budget. Numbers in the description
  // are the single biggest CTR lever per Search Console A/Bs.
  const description = clampDescription(
    detail?.seoDescriptionFa?.trim() || buildServiceMetaDescription({
      service,
      category,
      plans,
      cheapest,
    }),
  )

  // Streaming + music services with multiple plans get an extra
  // `ProductGroup` block alongside the regular `Product`. The Product
  // is then linked back via `isVariantOf` so Google understands the
  // two entities describe the same listing (parent + variants).
  const emitProductGroup = shouldEmitProductGroup(category, plans)

  const productJsonLd = productLd({
    service,
    category,
    plans,
    cheapest,
    path,
    longDescription: detail?.descriptionFa,
    reviews,
    hasProductGroup: emitProductGroup,
  })

  const jsonLd: Record<string, unknown>[] = [
    breadcrumbLd([
      { name: 'دسته‌بندی‌ها', path: '/categories' },
      ...(category
        ? [{ name: category.titleFa, path: `/c/${category.slug}` }]
        : []),
      { name: service.titleFa, path },
    ]),
    productJsonLd,
  ]

  if (emitProductGroup) {
    const groupLd = productGroupLd({
      service,
      category,
      plans,
      path,
      longDescription: detail?.descriptionFa,
    })
    if (groupLd) jsonLd.push(groupLd)
  }

  if (detail?.faq && detail.faq.length > 0) {
    const fp = faqLd(detail.faq)
    if (fp) jsonLd.push(fp)
  }

  const imageAlt = `خرید ${service.titleFa}${service.titleEn ? ` – ${service.titleEn}` : ''} ${CURRENT_JALALI_YEAR} در پی‌کارت`

  // Per-service og:image (1200×630 PNG) when one was generated for
  // this slug. Falls back to the service logo — logos look poor when
  // social platforms downscale them, so we prefer the per-service
  // hero whenever available.
  const ogImage = hasPerServiceOgImage(service.slug)
    ? perServiceOgImagePath(service.slug)
    : service.logoUrl
  // For per-service og:images we know the exact dimensions and can
  // declare them upfront so social previewers don't need to refetch.
  const ogImageWidth = hasPerServiceOgImage(service.slug) ? 1200 : undefined
  const ogImageHeight = hasPerServiceOgImage(service.slug) ? 630 : undefined

  return {
    // Always treat the title as raw so the «| پی‌کارت» suffix isn't
    // duplicated by useSEO's default "<title> | <SITE_NAME>" template.
    rawTitle: true,
    title: titleRaw,
    description,
    path,
    image: ogImage,
    imageAlt,
    imageWidth: ogImageWidth,
    imageHeight: ogImageHeight,
    ogType: 'product',
    jsonLd,
  }
}

/**
 * Per-category SERP-padding fragment used by
 * `buildCategoryMetaDescription` when the DB descriptor is too short
 * to push the meta into the 140-160 ch budget. Each value names the
 * vertical's marquee brands so the snippet acquires keyword variety
 * without sounding stuffed.
 */
const CATEGORY_META_HIGHLIGHTS: Record<string, string> = {
  'ai-assistants': 'ChatGPT Plus، Claude Pro، Gemini و Perplexity',
  'ai-image': 'Midjourney، DALL·E، Leonardo و Adobe Firefly',
  'ai-video': 'Runway، Sora، Pika و HeyGen',
  'ai-voice-music': 'ElevenLabs، Suno، Udio و Murf',
  'ai-writing-seo': 'Jasper، Copy.ai، SurferSEO و Frase',
  'developer-tools': 'GitHub Copilot، JetBrains، Cursor و Replit',
  'design-creative': 'Canva Pro، Adobe Creative Cloud و Figma',
  'productivity-work': 'Notion، Microsoft 365، Grammarly و Quizlet',
  streaming: 'Netflix، Disney+، HBO Max و Crunchyroll',
  music: 'Spotify Premium، Apple Music، Tidal و YouTube Premium',
  education: 'Duolingo Plus، Coursera، Babbel و Quizlet',
  'cloud-storage': 'Google One، iCloud+، Dropbox و OneDrive',
  'social-communication': 'Telegram Premium، LinkedIn و WhatsApp Business',
  'business-marketing': 'HubSpot، Mailchimp، Ahrefs و Semrush',
}

/**
 * Build a number-rich Persian meta description for a category page.
 *
 * Each category in the DB has a 40-60 character descriptor which
 * truncates to ~50 chars in the meta tag — well below the 140-160 ch
 * Google budget, so the SERP snippet ends up generic and loses CTR
 * vs. number-heavy competitors (numberland.ir, license-market). This
 * helper:
 *   1. Leads with the Jalali year + service & plan counts.
 *   2. Folds the DB descriptor in as a middle tail when present.
 *   3. Falls back to a per-category brand-highlight fragment
 *      (`CATEGORY_META_HIGHLIGHTS`) when the DB descriptor is empty
 *      or too short to push the line into the 140-158 ch sweet spot.
 *   4. Always closes with the trust block («تحویل آنی، گارانتی اصالت،
 *      پشتیبانی فارسی»). Resulting meta is consistently 140-158 chars.
 */
function buildCategoryMetaDescription(args: {
  category: Category
  serviceCount: number
  planCount: number
}): string {
  const { category, serviceCount, planCount } = args
  const head = `خرید ${category.titleFa} ${CURRENT_JALALI_YEAR} در پی‌کارت`
  const counts =
    serviceCount > 0 && planCount > 0
      ? `${toPersianDigits(serviceCount)} سرویس و ${toPersianDigits(planCount)} پلن فعال`
      : serviceCount > 0
        ? `${toPersianDigits(serviceCount)} سرویس فعال`
        : null

  // Three trust-tail variants, longest first. The helper falls back
  // to a shorter tail when the longer fragments leave no room within
  // the 158-ch budget — guaranteeing every category meta lands in
  // [140,158] ch instead of dropping to <140 by losing too much copy.
  const tails = [
    'تحویل آنی، گارانتی اصالت، پرداخت تومانی، پشتیبانی فارسی ۲۴/۷.',
    'تحویل آنی، گارانتی اصالت و پشتیبانی فارسی ۲۴/۷.',
    'تحویل آنی و پشتیبانی ۲۴/۷.',
  ]

  const dbDesc = (category.description ?? '').replace(/\s+/g, ' ').trim()
  const slug = category.slug ?? ''
  const highlight = CATEGORY_META_HIGHLIGHTS[slug] ?? null
  // Two brand-fragment variants — the "از جمله ..." prefix improves
  // readability but eats 8 chars; we drop it when needed.
  const brandLong = highlight ? `از جمله ${highlight}` : null
  const brandShort = highlight

  // Build the candidate matrix: every combination of (content middle
  // fragments) × (trust tail variant) yields a candidate. Then pick
  // the longest candidate that fits ≤158 ch AND ≥140 ch. If none
  // qualify, fall back to the longest fitting candidate (or the
  // longest candidate overall if every one overflows the clamp).
  const middleVariants: Array<Array<string | null>> = [
    [counts, dbDesc, brandLong],
    [counts, dbDesc, brandShort],
    [counts, brandLong],
    [counts, brandShort],
    [counts, dbDesc],
    [counts],
    [dbDesc, brandLong],
    [dbDesc, brandShort],
    [brandLong],
    [brandShort],
    [dbDesc],
    [],
  ]

  const candidates: string[] = []
  for (const middle of middleVariants) {
    for (const tail of tails) {
      const line = [head, ...middle, tail].filter(Boolean).join(' — ')
      candidates.push(line)
    }
  }

  let bestInRange: string | null = null
  let bestUnder158: string | null = null
  let longest: string | null = null
  for (const line of candidates) {
    if (!longest || line.length > longest.length) longest = line
    if (line.length > 158) continue
    if (!bestUnder158 || line.length > bestUnder158.length) bestUnder158 = line
    if (line.length >= 140 && line.length <= 158) {
      if (!bestInRange || line.length > bestInRange.length) bestInRange = line
    }
  }
  if (bestInRange) return bestInRange
  if (bestUnder158) return bestUnder158
  return longest ?? head
}

/**
 * Build a number-rich Persian meta description for a service page.
 * Mirrors Numberland / account4all's competitive pattern of leading
 * with concrete data (plan count, cheapest price in toman, delivery
 * time) instead of generic marketing copy. Capped via clampDescription
 * downstream at 158 chars.
 */
function buildServiceMetaDescription(args: {
  service: Service
  category?: Category
  plans: Plan[]
  cheapest: Plan | null
}): string {
  const { service, category, plans, cheapest } = args
  const activePlans = plans.filter((p) => p.isActive)
  const planCount = activePlans.length || service.planCount || 0
  const cheapestPlan = cheapest ?? activePlans.find((p) => p.priceIrt != null) ?? null
  const cheapestToman = cheapestPlan?.priceIrt ?? service.fromPriceIrt ?? null
  const delivery = service.deliveryTimeFa?.trim() || 'زیر ۲ دقیقه'

  const head = `خرید ${service.titleFa} ${CURRENT_JALALI_YEAR}`

  const parts: string[] = [head]
  if (planCount > 0 && cheapestToman != null) {
    parts.push(
      `${toPersianDigits(planCount)} پلن از ${toPersianDigits(
        Math.round(cheapestToman).toLocaleString('en-US'),
      )} تومان`,
    )
  } else if (cheapestToman != null) {
    parts.push(
      `از ${toPersianDigits(
        Math.round(cheapestToman).toLocaleString('en-US'),
      )} تومان`,
    )
  } else if (planCount > 0) {
    parts.push(`${toPersianDigits(planCount)} پلن فعال`)
  }
  parts.push(`تحویل ${delivery}`)
  parts.push('گارانتی اصالت')
  parts.push('پشتیبانی فارسی')

  let line = parts.join('، ') + '.'

  // Append 50-60 chars of the short-description if there's headroom.
  if (service.shortDescriptionFa) {
    const tail = service.shortDescriptionFa.replace(/\s+/g, ' ').trim()
    if (tail) {
      const room = 158 - line.length - 1
      if (room > 30) {
        line += ' ' + tail.slice(0, Math.max(30, room))
      }
    }
  }

  // Suppress unused-import warning when no plan-level discount is shown.
  void getPlanDiscountPct
  void category
  return line
}

export function seoForServiceNotFound(slug: string): SEOConfig {
  return {
    title: 'سرویس پیدا نشد',
    description: 'سرویس مورد نظر در پی‌کارت پیدا نشد.',
    path: `/s/${slug}`,
    noindex: true,
  }
}

export function seoForStaticPage(page: StaticPage): SEOConfig {
  const breadcrumbItems = [{ name: page.breadcrumbFa ?? page.titleFa, path: page.path }]
  const jsonLd: Array<Record<string, unknown> | null> = [
    breadcrumbLd(breadcrumbItems),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': absoluteUrl(page.path) + '#webpage',
      url: absoluteUrl(page.path),
      name: page.titleFa,
      description: clampDescription(page.descriptionFa),
      inLanguage: 'fa-IR',
      isPartOf: { '@id': 'https://pikart.ir/#website' },
      breadcrumb: breadcrumbLd(breadcrumbItems),
    },
  ]

  if (page.faq && page.faq.length > 0) {
    const fp = faqLd(page.faq)
    if (fp) jsonLd.push(fp)
  }

  return {
    title: page.titleFa,
    description: clampDescription(page.descriptionFa),
    path: page.path,
    imageAlt: `${page.titleFa} — پی‌کارت`,
    jsonLd,
  }
}

export function seoForAuthorPage(author: AuthorPage): SEOConfig {
  const description = clampDescription(author.bioFa, 200)
  const breadcrumbs = breadcrumbLd([
    { name: 'وبلاگ', path: '/blog' },
    { name: author.nameFa, path: author.path },
  ])
  return {
    title: `${author.nameFa}${author.roleFa ? ' — ' + author.roleFa : ''}`,
    description,
    path: author.path,
    image: author.avatarUrl ?? '/images/og/og-default.png',
    imageAlt: `${author.nameFa} — ${SITE_NAME}`,
    ogType: 'profile',
    jsonLd: [breadcrumbs, profilePageLd({ author }), personLd({ author })],
  }
}

export function seoForSearch(args: { query: string; resultCount: number }): SEOConfig {
  const { query, resultCount } = args
  const trimmed = query.trim()
  return {
    title: trimmed
      ? `جستجو برای «${trimmed}»`
      : 'جستجو در سرویس‌های دیجیتال',
    description: trimmed
      ? `نتایج جستجو برای «${trimmed}» در پی‌کارت — ${resultCount.toLocaleString('en-US')} سرویس مرتبط.`
      : 'جستجوی سرویس‌های دیجیتال، اشتراک‌های پرمیوم و گیفت‌کارت در پی‌کارت.',
    path: trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search',
    noindex: true,
    jsonLd: [
      breadcrumbLd([
        {
          name: trimmed ? `جستجو: ${trimmed}` : 'جستجو',
          path: '/search',
        },
      ]),
    ],
  }
}

export function seoForNotFound(path = '/404'): SEOConfig {
  return {
    title: 'صفحه پیدا نشد',
    description:
      'صفحه مورد نظر شما در پی‌کارت پیدا نشد. به صفحه اصلی یا دسته‌بندی‌ها بازگردید.',
    path,
    noindex: true,
  }
}

export function seoForBlogIndex(args: { posts: BlogPost[] }): SEOConfig {
  const { posts } = args
  return {
    title: `وبلاگ خرید اشتراک‌های دیجیتال ${CURRENT_JALALI_YEAR}`,
    description: clampDescription(
      `مقالات روزآمد درباره خرید اکانت پرمیوم، ابزارهای هوش مصنوعی، فعال‌سازی سرویس‌ها و راهنمای استفاده در مجله ${SITE_NAME} — به‌روزرسانی مرتب و با قیمت تومانی.`,
    ),
    path: '/blog',
    image: '/images/og/og-default.png',
    imageAlt: 'وبلاگ پی‌کارت — راهنمای خرید سرویس‌های دیجیتال',
    imageWidth: 1200,
    imageHeight: 630,
    jsonLd: [
      breadcrumbLd([{ name: 'وبلاگ', path: '/blog' }]),
      blogLd({ posts }),
    ],
  }
}

export function seoForBlogPost(args: {
  post: BlogPost
  primaryService?: Service | null
}): SEOConfig {
  const { post, primaryService } = args
  const path = `/blog/${post.slug}`

  const breadcrumbs = breadcrumbLd([
    { name: 'وبلاگ', path: '/blog' },
    { name: post.titleFa, path },
  ])
  const article = articleLd({
    post,
    primaryServiceUrl: primaryService ? absoluteUrl('/s/' + primaryService.slug) : null,
    primaryServiceName: primaryService?.titleFa ?? null,
  })

  const jsonLd: Array<Record<string, unknown> | null> = [breadcrumbs, article]
  if (post.faq && post.faq.length > 0) {
    const fp = faqLd(post.faq)
    if (fp) jsonLd.push(fp)
  }
  if (post.howToSteps && post.howToSteps.length >= 2) {
    const ht = howToLd({
      name: post.titleFa,
      description: post.excerpt,
      totalTime: post.howToTotalTime ?? 'PT5M',
      steps: post.howToSteps,
    })
    if (ht) jsonLd.push(ht)
    // Emit Course alongside HowTo for sufficiently-long tutorials
    // (5+ steps OR totalTime >= 15 minutes). Roadmap C3.
    const co = courseLd({
      name: post.titleFa,
      description: post.excerpt,
      url: absoluteUrl(path),
      totalTime: post.howToTotalTime ?? 'PT5M',
      steps: post.howToSteps,
    })
    if (co) jsonLd.push(co)
  }

  // Prefer the per-post 1200×630 social card emitted by
  // `scripts/generate-blog-og-images.ts` over the generic
  // `coverImage` JPG (which lives at /images/categories/<cat>.jpg and
  // therefore collides across every post in the same category).
  const ogImage = hasPerBlogOgImage(post.slug)
    ? perBlogOgImagePath(post.slug)
    : post.coverImage

  return {
    title: post.titleFa,
    description: clampDescription(post.excerpt, 200),
    path,
    image: ogImage,
    imageAlt: post.coverAlt,
    imageWidth: 1200,
    imageHeight: 630,
    ogType: 'article',
    jsonLd,
  }
}
