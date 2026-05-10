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
import { getCategoryBySlug } from './data'
import type { ServiceReview } from './reviews'
import type { BlogPost } from './blog'
import { computeBlogWordCount } from './blog'
import { hasPerBlogOgImage, perBlogOgImagePath } from './blogOgImages'
import type { AuthorPage } from './staticPages'
import { getServiceRegions, type RegionRef } from './regions'

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

export function organizationLd(args?: {
  /**
   * When provided, expands `OnlineStore.makesOffer` to a list of
   * `OfferCatalog`s (one per top-level category) so the marketplace's
   * 14 verticals are linked to the brand entity. Use on the home page
   * only — sub-pages should keep the lightweight Organization payload.
   */
  categories?: Array<Pick<Category, 'slug' | 'titleFa' | 'description'>>
}): Json {
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
  // Connect the OnlineStore entity to all 14 verticals so the
  // Knowledge Graph sees the marketplace as a parent entity grouping
  // the categories — strong signal for the brand-name SERP, used on
  // the home page only to keep sub-page payloads lean.
  if (args?.categories && args.categories.length > 0) {
    org.makesOffer = args.categories
      .filter((c) => c.slug && c.titleFa)
      .map((c) => ({
        '@type': 'OfferCatalog',
        '@id': absoluteUrl('/c/' + c.slug) + '#catalog',
        name: c.titleFa,
        url: absoluteUrl('/c/' + c.slug),
        ...(c.description
          ? { description: c.description.replace(/\s+/g, ' ').trim() }
          : {}),
        inLanguage: 'fa-IR',
      }))
  }
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
  /**
   * When true, this Product is the parent of a ProductGroup emitted as
   * a sibling JSON-LD block. We add `isVariantOf` so Google can match
   * the two entities. The flag is computed by
   * `shouldEmitProductGroup(category, plans)`.
   */
  hasProductGroup?: boolean
}): Json {
  const { service, category, plans, cheapest, path, longDescription, reviews, hasProductGroup } =
    args
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

  const regions = getServiceRegions({ service, category })
  const offers = buildOffers({ service, category, plans, cheapest, url, regions })

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
  if (hasProductGroup) {
    product.isVariantOf = { '@id': url + '#productgroup' }
  }

  // E-E-A-T signal: tell Google explicitly which audience we serve.
  // Mirrors the org-level `areaServed` so single-product pages stand on
  // their own without inheriting the Organization payload. When a
  // service genuinely serves multiple countries (streaming/music to
  // Persian-speakers in Turkey/UAE/Afghanistan, AI assistants to
  // Tajik/Iraqi/Afghan students), we surface the full list so Google's
  // «Available in your country» badge fires for those visitors too.
  product.audience = {
    '@type': 'PeopleAudience',
    geographicArea:
      regions.length === 1
        ? regionToCountryNode(regions[0])
        : regions.map(regionToCountryNode),
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

function regionToCountryNode(region: RegionRef): Json {
  return {
    '@type': 'Country',
    name: region.nameEn,
    identifier: region.code,
  }
}

function buildEligibleRegion(regions: RegionRef[]): Json | Json[] {
  if (regions.length === 1) return regionToCountryNode(regions[0])
  return regions.map(regionToCountryNode)
}

function buildOffers(args: {
  service: Service
  category?: Category
  plans: Plan[]
  cheapest: Plan | null
  url: string
  /** Optional pre-resolved regions — lets callers reuse the list. */
  regions?: RegionRef[]
}): Json | null {
  const { service, category, plans, cheapest, url } = args
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
  const regions = args.regions ?? getServiceRegions({ service, category })
  const eligibleRegion = buildEligibleRegion(regions)
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
 * `Person` payload for an editorial author. Used both inline inside
 * `Article.author` (referenced by `@id`) and as the top-level entity
 * on `/author/<slug>` pages. The `mainEntityOfPage` field pins the
 * Person to its public profile URL so Google can match it across
 * articles.
 */
export function personLd(args: { author: AuthorPage }): Json {
  const { author } = args
  const url = absoluteUrl(author.path)
  const person: Json = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': url + '#person',
    name: author.nameFa,
    url,
    mainEntityOfPage: url,
  }
  if (author.nameEn) person.alternateName = author.nameEn
  if (author.roleFa) person.jobTitle = author.roleFa
  if (author.bioFa) person.description = clampDescription(author.bioFa, 320)
  if (author.avatarUrl) person.image = absoluteUrl(author.avatarUrl)
  if (author.knowsAbout && author.knowsAbout.length > 0) {
    person.knowsAbout = author.knowsAbout
  }
  const sameAs = (author.sameAs ?? []).map((s) => s.trim()).filter(Boolean)
  if (sameAs.length > 0) person.sameAs = sameAs
  person.worksFor = { '@id': SITE_URL + '/#organization' }
  return person
}

/**
 * `ProfilePage` payload that wraps an author landing page. Google's
 * Profile Page rich result picks up `mainEntity` of type Person and
 * uses it for the «پروفایل نویسنده» SERP card.
 */
export function profilePageLd(args: { author: AuthorPage }): Json {
  const { author } = args
  const url = absoluteUrl(author.path)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': url + '#profilepage',
    url,
    name: author.nameFa,
    description: author.bioFa,
    inLanguage: 'fa-IR',
    mainEntity: { '@id': url + '#person' },
    isPartOf: { '@id': SITE_URL + '/#website' },
  }
}

/**
 * Categories whose plans behave like product variants (different
 * durations, regions, or account tiers of the same underlying
 * subscription). For services in these categories with 2+ active
 * priced plans we additionally emit a `ProductGroup` JSON-LD block so
 * Google can render the variant rich-result (per-row pricing in SERP)
 * on top of the existing `Product` snippet.
 *
 * Streaming + music are the obvious wins (Netflix «1 месяц / 3 месяца /
 * 1 год», Spotify Family vs Individual, etc). Other categories' plans
 * are often less variant-shaped (e.g. one-off licences) so we keep
 * scope tight per the SEO roadmap recommendation.
 */
export const PRODUCT_GROUP_CATEGORY_SLUGS: ReadonlySet<string> = new Set([
  'streaming',
  'music',
])

export function shouldEmitProductGroup(
  category: Category | undefined,
  plans: Plan[],
): boolean {
  if (!category) return false
  if (!PRODUCT_GROUP_CATEGORY_SLUGS.has(category.slug)) return false
  const active = plans.filter((p) => p.isActive && p.priceIrt != null)
  return active.length >= 2
}

/**
 * Map a plan's `durationDays` to a Persian human-readable variant
 * label («1 месяц», «салане»...). Returns null when the duration is
 * undefined / non-positive so we can omit the duration field rather
 * than emit «0 роз» in JSON-LD.
 */
function planDurationLabelFa(plan: Plan): string | null {
  const days = plan.durationDays ?? null
  if (!days || days <= 0) return null
  if (days >= 350) {
    const years = Math.max(1, Math.round(days / 365))
    return years === 1 ? '۱ سال' : `${years} سال`
  }
  if (days >= 27 && days <= 92) {
    const months = Math.max(1, Math.round(days / 30))
    return months === 1 ? '۱ ماه' : `${months} ماه`
  }
  if (days < 27) {
    return `${days} روز`
  }
  const months = Math.max(1, Math.round(days / 30))
  return `${months} ماه`
}

/**
 * `ProductGroup` payload for services whose plans are variants of the
 * same underlying subscription (different durations / regions /
 * account tiers). Emits one `Product` per active priced plan inside
 * `hasVariant`, each with its own SKU + Offer so Google's variant
 * rich-result can show per-row pricing.
 *
 * Returns null when the service has fewer than 2 active priced plans
 * — ProductGroup with a single variant is meaningless and Google
 * silently downgrades it to a regular Product anyway.
 */
export function productGroupLd(args: {
  service: Service
  category?: Category
  plans: Plan[]
  path: string
  longDescription?: string | null
}): Json | null {
  const { service, category, plans, path, longDescription } = args
  const active = plans
    .filter((p) => p.isActive && p.priceIrt != null)
    .sort((a, b) => (a.priceIrt ?? 0) - (b.priceIrt ?? 0))
  if (active.length < 2) return null

  const url = absoluteUrl(path)
  const groupId = url + '#productgroup'

  // variesBy hints which axes the variants disagree on. Schema.org
  // prefers full property URIs but accepts short Persian/English
  // tokens too. We collapse to a small whitelist («duration» /
  // «region» / «accountType») so Google can group rows in the variant
  // rich-result.
  const variesBy: string[] = []
  const distinctDurations = new Set(
    active.map((p) => p.durationDays).filter((d): d is number => d != null && d > 0),
  )
  const distinctRegions = new Set(
    active.map((p) => p.region).filter((r): r is string => Boolean(r && r.trim())),
  )
  const distinctAccountTypes = new Set(
    active.map((p) => p.accountType).filter((r): r is string => Boolean(r && r.trim())),
  )
  if (distinctDurations.size > 1) variesBy.push('https://schema.org/duration')
  if (distinctRegions.size > 1) variesBy.push('https://schema.org/availableAtOrFrom')
  if (distinctAccountTypes.size > 1) variesBy.push('accountType')

  // Description: reuse the long-marketing copy the parent Product uses
  // so SERP variant rows inherit the same blurb. Capped harder here
  // than on the parent Product (300 chars) because Google only uses
  // the variant description when the user expands a row.
  const longText = stripHtml(longDescription)
  const description = clampDescription(
    longText ||
      service.shortDescriptionFa ||
      `خرید ${service.titleFa}${category ? ' در دسته ' + category.titleFa : ''} با تحویل سریع و پشتیبانی فارسی.`,
    300,
  )

  const group: Json = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    '@id': groupId,
    name: service.titleFa,
    description,
    url,
    productGroupID: service.id,
    inLanguage: 'fa-IR',
    brand: {
      '@type': 'Brand',
      name: service.titleEn || service.titleFa,
    },
  }
  if (service.titleEn) group.alternateName = service.titleEn
  if (service.logoUrl) group.image = absoluteUrl(service.logoUrl)
  if (category) group.category = category.titleFa
  if (variesBy.length > 0) group.variesBy = variesBy

  const availability = service.inStock
    ? 'https://schema.org/InStock'
    : 'https://schema.org/OutOfStock'
  const seller: Json = { '@id': SITE_URL + '/#organization' }
  const variantRegions = getServiceRegions({ service, category })
  const variantEligibleRegion = buildEligibleRegion(variantRegions)

  // Cap variants at 20 — above that Google truncates the rich-result
  // anyway and we'd just bloat the prerendered HTML.
  group.hasVariant = active.slice(0, 20).map((plan) => {
    const variantId = url + '#variant-' + plan.id
    const durationLabel = planDurationLabelFa(plan)
    const variantNameParts = [service.titleFa]
    if (plan.titleFa) variantNameParts.push(plan.titleFa)
    else if (durationLabel) variantNameParts.push(durationLabel)
    const variant: Json = {
      '@type': 'Product',
      '@id': variantId,
      name: variantNameParts.join(' — '),
      sku: plan.id,
      isVariantOf: { '@id': groupId },
      inLanguage: 'fa-IR',
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'IRR',
        price: Math.round((plan.priceIrt as number) * 10),
        availability,
        seller,
        eligibleRegion: variantEligibleRegion,
      },
    }
    if (service.logoUrl) variant.image = absoluteUrl(service.logoUrl)
    const additionalProperty: Json[] = []
    if (plan.durationDays && plan.durationDays > 0) {
      additionalProperty.push({
        '@type': 'PropertyValue',
        propertyID: 'duration',
        name: 'مدت',
        value: durationLabel ?? `${plan.durationDays} روز`,
      })
    }
    if (plan.region && plan.region.trim()) {
      additionalProperty.push({
        '@type': 'PropertyValue',
        propertyID: 'region',
        name: 'منطقه',
        value: plan.region.trim(),
      })
    }
    if (plan.accountType && plan.accountType.trim()) {
      additionalProperty.push({
        '@type': 'PropertyValue',
        propertyID: 'accountType',
        name: 'نوع اکانت',
        value: plan.accountType.trim(),
      })
    }
    if (additionalProperty.length > 0) {
      variant.additionalProperty = additionalProperty
    }
    return variant
  })

  return group
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
  // Prefer the per-post 1200×630 social card emitted by
  // `scripts/generate-blog-og-images.ts`. Schema.org Article schema
  // accepts either a single URL string or an `[url1, url2, ...]`
  // array; we provide both the cover JPG and the social PNG so
  // Google can pick the cleanest aspect ratio for AI Overviews and
  // Discover.
  const ogImage = hasPerBlogOgImage(post.slug)
    ? absoluteUrl(perBlogOgImagePath(post.slug))
    : null
  const coverImage = post.coverImage
    ? absoluteUrl(post.coverImage)
    : absoluteUrl('/images/og/og-default.png')
  const image: string | string[] = ogImage
    ? [ogImage, coverImage]
    : coverImage
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

  // Word-count + reading time signals — Google uses both for AI
  // Overviews / Top Stories candidate selection. We compute against
  // the actual post body (sections + bullets + FAQ + howto) so the
  // numbers are honest even when the excerpt is brief.
  const wordCount = computeBlogWordCount(post)
  // Use a calmer 220 wpm for Persian (vs. the 250 wpm Anglophone
  // baseline) since Persian sentences carry more characters per word.
  const readingMinutes = Math.max(2, Math.ceil(wordCount / 220))
  // Resolve the human-readable Persian category title for
  // `articleSection` — the schema.org docs explicitly recommend a
  // human-readable name here, not a slug.
  const categoryTitleFa =
    getCategoryBySlug(post.primaryCategorySlug)?.titleFa ?? post.primaryCategorySlug

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
    articleSection: categoryTitleFa,
    wordCount,
    timeRequired: `PT${readingMinutes}M`,
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
