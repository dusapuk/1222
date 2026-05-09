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
  SITE_NAME,
  SITE_NAME_EN,
  SITE_URL,
  absoluteUrl,
  clampDescription,
} from './seo'
import type { Category, Plan, Service } from './data'

type Json = Record<string, unknown>

export function organizationLd(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE_URL + '/#organization',
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url: SITE_URL + '/',
    logo: absoluteUrl('/favicon.svg'),
    sameAs: [],
  }
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
}): Json {
  const { service, category, plans, cheapest, path } = args
  const url = absoluteUrl(path)

  const description = clampDescription(
    service.shortDescriptionFa ??
      `خرید ${service.titleFa}${category ? ' در دسته ' + category.titleFa : ''} با تحویل سریع، پشتیبانی فارسی و ضمانت اصالت در پی‌کارت.`,
    300,
  )

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
  return product
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

  if (priced.length > 1) {
    const prices = priced.map((p) => p.priceIrt as number)
    return {
      '@type': 'AggregateOffer',
      priceCurrency: 'IRR',
      lowPrice: Math.round(Math.min(...prices) * 10), // toman → rial
      highPrice: Math.round(Math.max(...prices) * 10),
      offerCount: priced.length,
      availability,
      url,
    }
  }

  const single = cheapest ?? priced[0]
  if (single?.priceIrt != null) {
    return {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: Math.round(single.priceIrt * 10),
      availability,
      url,
    }
  }

  if (service.fromPriceIrt != null) {
    return {
      '@type': 'Offer',
      priceCurrency: 'IRR',
      price: Math.round(service.fromPriceIrt * 10),
      availability,
      url,
    }
  }
  return null
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
