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
import { clampDescription } from './seo'
import {
  breadcrumbLd,
  collectionPageLd,
  faqLd,
  itemListLd,
  organizationLd,
  productLd,
  websiteLd,
} from './jsonld'

export function seoForHome(args: {
  categoryCount: number
  serviceCount: number
}): SEOConfig {
  const { categoryCount, serviceCount } = args
  return {
    rawTitle: true,
    title: 'پی‌کارت | خرید اشتراک‌ها و سرویس‌های دیجیتال با تحویل آنی',
    description: clampDescription(
      `بزرگ‌ترین مارکت‌پلیس خرید اکانت‌های پرمیوم، گیفت‌کارت، اشتراک‌های بین‌المللی و سرویس‌های هوش مصنوعی در ایران. بیش از ${serviceCount.toLocaleString('en-US')} سرویس فعال در ${categoryCount} دسته‌بندی.`,
    ),
    path: '/',
    image: '/images/home/hero-premium.jpg',
    jsonLd: [organizationLd(), websiteLd(), breadcrumbLd([])],
  }
}

export function seoForCategoriesIndex(args: {
  categoryCount: number
  serviceCount: number
  categories: Category[]
}): SEOConfig {
  const { categoryCount, serviceCount, categories } = args
  return {
    title: 'همه دسته‌بندی‌های سرویس‌های دیجیتال',
    description: clampDescription(
      `${categoryCount.toLocaleString('en-US')} دسته‌بندی و ${serviceCount.toLocaleString('en-US')} سرویس فعال — اکانت‌های پرمیوم، گیفت‌کارت، اشتراک‌های بین‌المللی و سرویس‌های هوش مصنوعی با تحویل آنی و ضمانت اصالت.`,
    ),
    path: '/categories',
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
}): SEOConfig {
  const { category, services, categoryImage, page = 1 } = args
  const path = `/c/${category.slug}` + (page > 1 ? `?page=${page}` : '')
  return {
    title: `خرید ${category.titleFa} با بهترین قیمت`,
    description: clampDescription(
      category.description ||
        `${services.length.toLocaleString('en-US')} سرویس فعال در دسته ${category.titleFa} — تحویل آنی، ضمانت اصالت و پشتیبانی فارسی در پی‌کارت.`,
    ),
    path,
    image: categoryImage,
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
}): SEOConfig {
  const { service, category, plans, cheapest, detail } = args
  const path = `/s/${service.slug}`

  // SEO-overridden title/description from the original CMS — fall back
  // to a generated "خرید {service}" line if the service has no override.
  const fallbackTitle = `خرید ${service.titleFa}${service.titleEn ? ` - ${service.titleEn}` : ''}`
  const titleRaw = detail?.seoTitleFa?.trim() || fallbackTitle
  const fallbackDescription =
    service.shortDescriptionFa ||
    `خرید ${service.titleFa}${category ? ' در دسته ' + category.titleFa : ''} با تحویل آنی، ضمانت اصالت و پشتیبانی فارسی در پی‌کارت.`
  const description = clampDescription(
    detail?.seoDescriptionFa?.trim() || fallbackDescription,
  )

  const productJsonLd = productLd({
    service,
    category,
    plans,
    cheapest,
    path,
    longDescription: detail?.descriptionFa,
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

  if (detail?.faq && detail.faq.length > 0) {
    const fp = faqLd(detail.faq)
    if (fp) jsonLd.push(fp)
  }

  return {
    rawTitle: !!detail?.seoTitleFa,
    title: titleRaw,
    description,
    path,
    image: service.logoUrl,
    ogType: 'product',
    jsonLd,
  }
}

export function seoForServiceNotFound(slug: string): SEOConfig {
  return {
    title: 'سرویس پیدا نشد',
    description: 'سرویس مورد نظر در پی‌کارت پیدا نشد.',
    path: `/s/${slug}`,
    noindex: true,
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
