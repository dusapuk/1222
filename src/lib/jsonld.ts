/**
 * Builders for schema.org JSON-LD payloads. Each helper returns a plain
 * object that is serialised by `useSEO` and injected into <head> as a
 * `<script type="application/ld+json">` block.
 *
 * Keep payloads minimal: Google ignores extra fields and noisy schemas can
 * trigger rich-result warnings. Only include data we can actually verify
 * (e.g. don't fake aggregateRating until reviews are imported).
 */
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_TEL,
  CURRENCIES_ACCEPTED,
  GEO_MAP_URL,
  PAYMENT_ACCEPTED,
  PRODUCT_DESCRIPTION_MAX,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_URL,
  SOCIAL_LINKS,
  absoluteUrl,
  clampDescription,
  getGeoCoordinates,
  stripHtml,
} from './seo'
import type { Category, Plan, Service } from './data'
import type { ServiceReview } from './reviews'
import type { BlogPost } from './blog'

/**
 * Hard-cap validity for short-lived offers. Schema.org Offer prefers a
 * `priceValidUntil` to communicate the price freeze window; without it,
 * Google may flag the offer as stale and stop showing rich pricing in
 * SERP. We default to ~6 months from build time — long enough that
 * normal price tweaks don't invalidate the snippet, short enough that a
 * stale build can't promise an indefinite price.
 */
function defaultPriceValidUntil(): string {
  const now = new Date()
  now.setMonth(now.getMonth() + 6)
  return now.toISOString().slice(0, 10)
}

type Json = Record<string, unknown>

export function organizationLd(): Json {
  const sameAs = SOCIAL_LINKS.map((s) => s.url.trim()).filter(Boolean)
  const coords = getGeoCoordinates()
  const currencies = CURRENCIES_ACCEPTED.split(',').map((s) => s.trim()).filter(Boolean)
  const payments = PAYMENT_ACCEPTED.split(',').map((s) => s.trim()).filter(Boolean)

  // Use a multi-typed entity: stays a regular Organization for the
  // generic knowledge graph, declares OnlineStore so Google understands
  // it's a marketplace, and declares LocalBusiness so the geo +
  // currenciesAccepted + paymentAccepted fields below are recognised.
  const org: Json = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'OnlineStore', 'LocalBusiness'],
    '@id': SITE_URL + '/#organization',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL + '/',
    logo: absoluteUrl('/favicon.svg'),
    image: absoluteUrl('/images/og/og-default.png'),
    telephone: CONTACT_PHONE_TEL,
    email: CONTACT_EMAIL,
    address: {
      '@type': 'PostalAddress',
      ...CONTACT_ADDRESS,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: CONTACT_PHONE_TEL,
        email: CONTACT_EMAIL,
        availableLanguage: ['Persian', 'fa', 'en'],
        areaServed: 'IR',
      },
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Iran',
      identifier: 'IR',
    },
  }
  if (currencies.length) org.currenciesAccepted = currencies.join(', ')
  if (payments.length) org.paymentAccepted = payments.join(', ')
  if (coords) {
    org.geo = {
      '@type': 'GeoCoordinates',
      latitude: coords.latitude,
      longitude: coords.longitude,
    }
  }
  if (GEO_MAP_URL) org.hasMap = GEO_MAP_URL
  if (sameAs.length > 0) org.sameAs = sameAs
  return org
}

export function websiteLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_URL + '/#website',
    url: SITE_URL + '/',
    name: SITE_NAME,
    inLanguage: 'fa-IR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: SITE_URL + '/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': SITE_URL + '/#organization' },
  }
}

export type Crumb = { name: string; path?: string }

export function breadcrumbLd(items: Crumb[]): Json {
  // Always start with Home; items already exclude home.
  const all: Crumb[] = [{ name: 'خانه', path: '/' }, ...items]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => {
      const entry: Json = {
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
      }
      if (c.path) entry.item = absoluteUrl(c.path)
      return entry
    }),
  }
}

export function itemListLd(services: Service[], path: string): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: absoluteUrl(path),
    numberOfItems: services.length,
    itemListElement: services.slice(0, 24).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl('/s/' + s.slug),
      name: s.titleFa,
    })),
  }
}

export function collectionPageLd(args: {
  category: Category
  count: number
  path: string
}): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    url: absoluteUrl(args.path),
    name: args.category.titleFa,
    description: clampDescription(args.category.description),
    inLanguage: 'fa-IR',
    isPartOf: { '@id': SITE_URL + '/#website' },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: args.count,
    },
  }
}

export function productLd(args: {
  service: Service
  category?: Category
  plans: Plan[]
  cheapest: Plan | null
  path: string
  /** Long marketing description (preferred for richer Product snippets). */
  longDescription?: string | null
  /**
   * Verified user reviews. When 3+ entries are present, the Product
   * payload gets `aggregateRating` + the first 5 reviews inline.
   * Without enough reviews we omit both fields rather than fabricate a
   * rating — fake aggregateRating violates Google's review snippets
   * guidelines and risks a manual penalty.
   */
  reviews?: ServiceReview[] | null
}): Json {
  const { service, category, plans, cheapest, path, longDescription, reviews } = args
  const url = absoluteUrl(path)

  // `Product.description` is the field Google extracts for AI Overviews
  // and featured-snippet expansion. Competitors keep this field at
  // 30 000+ characters (license-market.ir: 32 549). We deliberately do
  // NOT clamp to ~300 chars here — if a long marketing copy exists,
  // we strip its HTML and pass the full text up to PRODUCT_DESCRIPTION_MAX
  // (Google silently truncates beyond that). The much shorter
  // `<meta description>` is built separately in `seoForService`.
  const longText = stripHtml(longDescription)
  let description: string
  if (longText && longText.length > 300) {
    description = longText.slice(0, PRODUCT_DESCRIPTION_MAX).trim()
  } else {
    description = clampDescription(
      longText ||
        service.shortDescriptionFa ||
        `خرید ${service.titleFa}${category ? ' در دسته ' + category.titleFa : ''} با تحویل سریع، پشتیبانی فارسی و ضمانت اصالت در پی‌کارت.`,
      300,
    )
  }

  const offers = buildOffers({ service, plans, cheapest, url })

  const product: Json = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': url + '#product',
    name: service.titleFa,
    description,
    url,
    sku: service.id,
    category: category?.titleFa,
    inLanguage: 'fa-IR',
    brand: {
      '@type': 'Brand',
      name: service.titleEn || service.titleFa,
    },
  }

  if (service.titleEn) product.alternateName = service.titleEn
  if (service.logoUrl) {
    product.image = absoluteUrl(service.logoUrl)
  }
  if (offers) product.offers = offers

  // E-E-A-T signal: tell Google explicitly which audience we serve.
  // Mirrors the org-level `areaServed` so single-product pages stand on
  // their own without inheriting the Organization payload.
  product.audience = {
    '@type': 'PeopleAudience',
    geographicArea: { '@type': 'Country', name: 'Iran', identifier: 'IR' },
  }

  // SpeakableSpecification — hints to Google Assistant / voice search
  // which DOM nodes are read aloud. Kept conservative: only the H1
  // (`.product-summary` is the title region) and the price block.
  product.speakable = {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', '.product-summary', '.product-price'],
  }

  const reviewBlocks = buildReviewBlocks(reviews ?? [])
  if (reviewBlocks) {
    product.aggregateRating = reviewBlocks.aggregateRating
    product.review = reviewBlocks.reviews
  }

  return product
}

/**
 * Build aggregateRating + per-review payloads from operator-provided
 * review data. Only emits the JSON when at least 3 verified reviews
 * exist (Google's documented minimum for usable aggregate snippets and
 * a sanity threshold against single-review noise).
 */
function buildReviewBlocks(reviews: ServiceReview[]):
  | { aggregateRating: Json; reviews: Json[] }
  | null {
  const verified = reviews.filter(
    (r) => r.verified !== false && r.rating > 0 && r.rating <= 5,
  )
  if (verified.length < 3) return null
  const sum = verified.reduce((acc, r) => acc + r.rating, 0)
  const avg = sum / verified.length
  const aggregateRating: Json = {
    '@type': 'AggregateRating',
    ratingValue: Math.round(avg * 10) / 10,
    bestRating: 5,
    worstRating: 1,
    reviewCount: verified.length,
    ratingCount: verified.length,
  }
  const reviewLd = verified.slice(0, 5).map((r) => {
    const entry: Json = {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      author: {
        '@type': 'Person',
        name: r.author || 'کاربر پی‌کارت',
      },
    }
    if (r.datePublished) entry.datePublished = r.datePublished
    if (r.body) entry.reviewBody = r.body
    return entry
  })
  return { aggregateRating, reviews: reviewLd }
}

function buildOffers(args: {
  service: Service
  plans: Plan[]
  cheapest: Plan | null
  url: string
}): Json | null {
  const { service, plans, cheapest, url } = args
  const priced = plans.filter((p) => p.priceIrt != null && p.isActive)
  const availability = service.inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock'

  // Fields shared across every Offer / AggregateOffer variant: the
  // schema.org-recommended trust signals Google requires for rich
  // pricing snippets. `seller`, `priceValidUntil`, return policy and a
  // shipping zero-fee descriptor are the four that gate Merchant Center
  // eligibility for digital products.
  const seller: Json = { '@id': SITE_URL + '/#organization' }
  const priceValidUntil = defaultPriceValidUntil()
  const eligibleRegion: Json = {
    '@type': 'Country',
    name: 'Iran',
    identifier: 'IR',
  }
  const hasMerchantReturnPolicy: Json = {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: 'IR',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 3,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
  }
  // Digital delivery: instant, no shipping cost, no shipping time.
  const shippingDetails: Json = {
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: 0,
      currency: 'IRR',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: 'IR',
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 0, unitCode: 'HUR' },
      transitTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'HUR' },
    },
  }

  // UnitPriceSpecification surfaces the cheapest plan's per-unit
  // pricing (typically per month). Even when we emit AggregateOffer,
  // Google can use this to show a "تجدید ماهانه" hint in pricing
  // rich-results when a single base unit is identifiable.
  const unitPriceSpec = buildUnitPriceSpec(cheapest ?? priced[0])

  if (priced.length > 1) {
    const prices = priced.map((p) => p.priceIrt as number)
    const aggregate: Json = {
      '@type': 'AggregateOffer',
      priceCurrency: 'IRR',
      lowPrice: Math.round(Math.min(...prices) * 10), // toman → rial
      highPrice: Math.round(Math.max(...prices) * 10),
      offerCount: priced.length,
      availability,
      url,
      priceValidUntil,
      eligibleRegion,
      seller,
      hasMerchantReturnPolicy,
      shippingDetails,
    }
    if (unitPriceSpec) aggregate.priceSpecification = unitPriceSpec
    return aggregate
  }

  const single = cheapest ?? priced[0]
  if (single?.priceIrt != null) {
    const offer: Json = {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: Math.round(single.priceIrt * 10),
      availability,
      url,
      priceValidUntil,
      eligibleRegion,
      seller,
      hasMerchantReturnPolicy,
      shippingDetails,
    }
    if (unitPriceSpec) offer.priceSpecification = unitPriceSpec
    return offer
  }

  if (service.fromPriceIrt != null) {
    return {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: Math.round(service.fromPriceIrt * 10),
      availability,
      url,
      priceValidUntil,
      eligibleRegion,
      seller,
      hasMerchantReturnPolicy,
      shippingDetails,
    }
  }
  return null
}

/**
 * Map a plan's `durationDays` to a schema.org `unitCode` + `unitText`
 * pair. Returns null when the plan has no usable duration (e.g.
 * lifetime / undefined) so we omit the price spec rather than emit a
 * misleading per-day value.
 */
function buildUnitPriceSpec(plan: Plan | null | undefined): Json | null {
  if (!plan || plan.priceIrt == null) return null
  const days = plan.durationDays ?? null
  if (!days || days <= 0) return null

  // Pick a sensible base unit. Schema.org's UnitPriceSpecification
  // accepts UN/CEFACT codes via `unitCode`; we use the readable
  // `unitText` mostly for Persian display in rich-result previews.
  let unitText = 'MONTH'
  let referenceQuantityValue = 1
  if (days >= 350) {
    unitText = 'YEAR'
  } else if (days >= 27 && days <= 92) {
    unitText = 'MONTH'
    referenceQuantityValue = Math.max(1, Math.round(days / 30))
  } else if (days < 27) {
    unitText = 'DAY'
    referenceQuantityValue = days
  } else {
    unitText = 'MONTH'
    referenceQuantityValue = Math.max(1, Math.round(days / 30))
  }

  return {
    '@type': 'UnitPriceSpecification',
    price: Math.round(plan.priceIrt * 10),
    priceCurrency: 'IRR',
    referenceQuantity: {
      '@type': 'QuantitativeValue',
      value: referenceQuantityValue,
      unitText,
    },
  }
}

export type FaqItem = { question: string; answer: string }

export function faqLd(items: FaqItem[]): Json | null {
  const cleaned = items
    .map((i) => ({
      question: (i.question || '').trim(),
      answer: (i.answer || '').trim(),
    }))
    .filter((i) => i.question.length > 0 && i.answer.length > 0)
  if (!cleaned.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cleaned.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: i.answer,
      },
    })),
  }
}

/**
 * `Article` payload for a single blog post. We use the more specific
 * `BlogPosting` subtype — Google explicitly recognises it for the
 * Article rich result and recommends it for blog content.
 *
 * `mainEntityOfPage` lets Google pin the article to its canonical page,
 * `publisher` references the global Organization node, and `about`
 * points at the primary service entity so the article and product are
 * semantically linked in the knowledge graph.
 */
export function articleLd(args: {
  post: BlogPost
  /**
   * Optional URL of the primary service the post promotes — used as
   * `about` so Google understands the entity association between blog
   * post and product page.
   */
  primaryServiceUrl?: string | null
  primaryServiceName?: string | null
}): Json {
  const { post, primaryServiceUrl, primaryServiceName } = args
  const url = absoluteUrl('/blog/' + post.slug)
  const image = post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl('/images/og/og-default.png')
  const dateModified = post.dateModified || post.datePublished

  // E-E-A-T: tie the post to a real `Person` whenever the operator has
  // configured one (`authorUrl` → author landing page, `authorSameAs`
  // → LinkedIn / Twitter). Falls back to the brand string-only author
  // so we never emit a half-filled Person node.
  const author: Json = {
    '@type': 'Person',
    name: post.author,
  }
  if (post.authorUrl) author.url = absoluteUrl(post.authorUrl)
  if (post.authorSameAs && post.authorSameAs.length > 0) {
    author.sameAs = post.authorSameAs.filter(Boolean)
  }

  const article: Json = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': url + '#article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: post.titleFa,
    description: clampDescription(post.excerpt, 200),
    image,
    inLanguage: 'fa-IR',
    datePublished: post.datePublished,
    dateModified,
    url,
    author,
    publisher: { '@id': SITE_URL + '/#organization' },
    keywords: post.keywords.join(', '),
    articleSection: post.primaryCategorySlug,
    isPartOf: { '@id': SITE_URL + '/blog#blog' },
  }
  if (primaryServiceUrl && primaryServiceName) {
    article.about = {
      '@type': 'Product',
      name: primaryServiceName,
      url: primaryServiceUrl,
    }
  }
  return article
}

export type HowToStep = {
  /** Persian step heading ("ورود به سایت", ...). */
  name: string
  /** Body text — plain Persian. */
  text: string
  /** Optional in-app or absolute image URL illustrating the step. */
  image?: string | null
  /** Optional anchor URL (the “go to step” link in HowTo rich-results). */
  url?: string | null
}

/**
 * `HowTo` payload — emits a step-by-step rich card in Google SERP
 * (separate from the FAQPage card). Particularly effective for
 * activation / setup posts («فعال‌سازی ChatGPT»,
 * «تغییر ریجن اپل آیدی»).
 *
 * Returns null when there are fewer than 2 steps — Google requires
 * `HowTo.step` to contain at least two `HowToStep` entries.
 */
export function howToLd(args: {
  name: string
  description: string
  /** ISO 8601 duration, e.g. `PT5M`. Defaults to PT5M when omitted. */
  totalTime?: string | null
  steps: HowToStep[]
}): Json | null {
  const cleaned = (args.steps ?? [])
    .map((s) => ({
      name: (s.name || '').trim(),
      text: (s.text || '').trim(),
      image: s.image || null,
      url: s.url || null,
    }))
    .filter((s) => s.name.length > 0 && s.text.length > 0)
  if (cleaned.length < 2) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: args.name,
    description: clampDescription(args.description, 200),
    inLanguage: 'fa-IR',
    totalTime: args.totalTime || 'PT5M',
    step: cleaned.map((s, i) => {
      const entry: Json = {
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      }
      if (s.image) entry.image = absoluteUrl(s.image)
      if (s.url) entry.url = absoluteUrl(s.url)
      return entry
    }),
  }
}

/**
 * Top-level `Blog` payload for the /blog index page. References every
 * post as `blogPost`. Google uses this to discover the article hub when
 * the post-level Article schemas are scattered across separate URLs.
 */
export function blogLd(args: { posts: BlogPost[] }): Json {
  const { posts } = args
  const url = SITE_URL + '/blog'
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url + '#blog',
    name: SITE_NAME + ' — وبلاگ',
    description:
      'راهنمای خرید اشتراک‌های دیجیتال، مقایسه پلن‌ها، فعال‌سازی سرویس‌های بین‌المللی برای کاربران ایرانی.',
    inLanguage: 'fa-IR',
    url,
    publisher: { '@id': SITE_URL + '/#organization' },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      '@id': absoluteUrl('/blog/' + post.slug) + '#article',
      headline: post.titleFa,
      url: absoluteUrl('/blog/' + post.slug),
      datePublished: post.datePublished,
      dateModified: post.dateModified || post.datePublished,
    })),
  }
}
