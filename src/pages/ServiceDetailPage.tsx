import { useEffect, useMemo, useState } from 'react'
import {
  ShoppingCart,
  Heart,
  Share2,
  Shield,
  Zap,
  Award,
  Sparkles,
  Flame,
  Percent,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Coins,
  Globe,
} from 'lucide-react'
import {
  getServiceBySlug,
  getCategoryById,
  getServicesByCategory,
  getDiscountPct,
  getPlansByService,
  getPlanDiscountPct,
  getCachedServiceDetail,
  loadServiceDetail,
  type Plan,
  type Service,
  type ServiceDetail,
} from '../lib/data'
import {
  getCachedServiceReviews,
  loadServiceReviews,
  summarizeReviews,
  type ServiceReview,
} from '../lib/reviews'
import { ProductCard } from '../components/ProductCard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { AppLink } from '../components/AppLink'
import { formatToman, toPersianDigits } from '../lib/format'
import { iconFor, colorForCategory } from '../lib/icons'
import { useSEO } from '../hooks/useSEO'
import { seoForService, seoForServiceNotFound } from '../lib/seoConfig'

const FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%231a1b26"/><circle cx="32" cy="26" r="9" fill="%23505162"/><path d="M14 56c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="%23505162"/></svg>'

export type ServiceDetailPageProps = {
  slug: string
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function ServiceDetailPage({ slug, onNavigate }: ServiceDetailPageProps) {
  const service = getServiceBySlug(slug)
  const category = service ? getCategoryById(service.categoryId) : undefined

  const servicePlans: Plan[] = useMemo(
    () => (service ? getPlansByService(service.id) : []),
    [service],
  )
  const cheapestPlan: Plan | null = useMemo(() => {
    if (!servicePlans.length) return null
    return [...servicePlans]
      .filter((p) => p.priceIrt != null)
      .sort((a, b) => (a.priceIrt ?? 0) - (b.priceIrt ?? 0))[0] ?? null
  }, [servicePlans])
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    cheapestPlan?.id ?? servicePlans[0]?.id ?? null,
  )
  const selectedPlan: Plan | null =
    servicePlans.find((p) => p.id === selectedPlanId) ?? cheapestPlan

  const related: Service[] = useMemo(() => {
    if (!service) return []
    return getServicesByCategory(service.categoryId)
      .filter((s) => s.id !== service.id)
      .slice(0, 4)
  }, [service])

  // Lazy-loaded long description, FAQ and SEO overrides for THIS slug.
  // Kept as a separate fetch from the main catalogue so browse pages
  // don't pay for it. The prerender step seeds the sync cache with the
  // matching `<script id="__SERVICE_DETAIL__">` payload, so SSR and the
  // first hydration paint render the same tree (no mismatch warning).
  const [detail, setDetail] = useState<ServiceDetail | null>(() => {
    const seeded = getCachedServiceDetail(slug)
    return seeded ?? null
  })
  useEffect(() => {
    let cancelled = false
    if (!service) {
      setDetail(null)
      return
    }
    loadServiceDetail(service.slug).then((d) => {
      if (!cancelled) setDetail(d)
    })
    return () => {
      cancelled = true
    }
  }, [service])

  // Verified user reviews — absent for most slugs (file not committed),
  // null/empty array means "don't show reviews UI / aggregateRating".
  // The seeded sync cache mirrors the prerender step so SSR keeps the
  // same tree across hydrations.
  const [reviews, setReviews] = useState<ServiceReview[] | null>(() => {
    const seeded = getCachedServiceReviews(slug)
    return seeded ?? null
  })
  useEffect(() => {
    let cancelled = false
    if (!service) {
      setReviews(null)
      return
    }
    loadServiceReviews(service.slug).then((r) => {
      if (!cancelled) setReviews(r)
    })
    return () => {
      cancelled = true
    }
  }, [service])

  useSEO(
    service
      ? seoForService({
          service,
          category,
          plans: servicePlans,
          cheapest: cheapestPlan,
          detail,
          reviews,
        })
      : seoForServiceNotFound(slug),
  )

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-white mb-3">سرویس پیدا نشد</h1>
        <a
          href="/categories"
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
            e.preventDefault()
            onNavigate('/categories')
          }}
          className="text-[#d4a853] hover:underline"
        >
          مشاهده دسته‌بندی‌ها
        </a>
      </div>
    )
  }

  const discount = getDiscountPct(service)
  const Icon = category ? iconFor(category.icon) : null
  const color = category ? colorForCategory(category.slug) : '#d4a853'

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <Breadcrumbs
        items={[
          { label: 'دسته‌بندی‌ها', path: '/categories' },
          ...(category ? [{ label: category.titleFa, path: `/c/${category.slug}` }] : []),
          { label: service.titleFa },
        ]}
        onNavigate={onNavigate}
      />

      {/* Canonical <h1> for the page — must precede every other heading
          in the DOM for SEO. The visible product card in the sidebar
          shows a styled <p> with the same copy so the page still reads
          "خرید X" prominently to humans. Keep this sr-only so we
          don't double-render the title visually. */}
      <h1 className="sr-only">خرید {service.titleFa}{service.titleEn ? ` — ${service.titleEn}` : ''}</h1>

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* main info */}
        <div className="lg:col-span-7">
          <div className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl overflow-hidden">
            <div className="mx-auto w-full max-w-[460px] sm:max-w-[520px] md:max-w-[560px] p-3 sm:p-4">
              <div className="relative aspect-square bg-gradient-to-br from-[#1a1b26] to-[#0e0f15] overflow-hidden rounded-xl ring-1 ring-[#1e1f2a]">
                <img
                  src={service.logoUrl ?? FALLBACK}
                  alt={`خرید ${service.titleFa}${service.titleEn ? ' – ' + service.titleEn : ''}`}
                  width={560}
                  height={560}
                  {...({ fetchpriority: 'high' } as Record<string, string>)}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = FALLBACK
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0b0c10]/70 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="mt-5 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 md:p-6">
            <h2 className="text-lg font-black text-white mb-3">درباره {service.titleFa}</h2>
            <p className="text-sm text-[#9a9baa] leading-7 whitespace-pre-line">
              {detail?.descriptionFa ??
                service.shortDescriptionFa ??
                'این سرویس به صورت رسمی ارائه می‌شود. تمام پلن‌ها در همین صفحه قابل مقایسه است و سفارش‌ها در کمتر از چند ساعت تحویل داده می‌شود.'}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              {[
                { icon: Zap, label: 'تحویل سریع', desc: service.deliveryTimeFa ?? '۱۵ دقیقه تا چند ساعت', color: '#d4a853' },
                { icon: Shield, label: 'ضمانت اصالت', desc: 'فعال‌سازی روی اکانت اصلی', color: '#2ec4b6' },
                { icon: Award, label: 'پشتیبانی فارسی', desc: 'پاسخگویی ۲۴ ساعته', color: '#9b5de5' },
                { icon: CheckCircle2, label: `${toPersianDigits(service.planCount)} پلن`, desc: 'بهترین قیمت', color: '#06d6a0' },
              ].map((it) => {
                const I = it.icon
                return (
                  <div
                    key={it.label}
                    className="bg-[#0e0f15] border border-[#1e1f2a] rounded-xl p-3"
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center mb-2"
                      style={{ background: `${it.color}15`, border: `1px solid ${it.color}33` }}
                    >
                      <I size={16} style={{ color: it.color }} />
                    </div>
                    <div className="text-xs font-bold text-white mb-1">{it.label}</div>
                    <div className="text-[10px] text-[#6b6c78] leading-5">{it.desc}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {detail?.faq && detail.faq.length > 0 && (
            <div className="mt-5 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 md:p-6">
              <h2 className="text-lg font-black text-white mb-4">
                سوالات متداول درباره {service.titleFa}
              </h2>
              <ul className="space-y-3">
                {detail.faq.map((qa, i) => (
                  <li
                    key={i}
                    className="bg-[#0e0f15] border border-[#1e1f2a] rounded-xl p-4"
                  >
                    <h3 className="text-sm font-bold text-white mb-2">
                      {qa.question}
                    </h3>
                    <p className="text-xs text-[#9a9baa] leading-7 whitespace-pre-line">
                      {qa.answer}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ReviewsSection reviews={reviews} serviceTitleFa={service.titleFa} />
        </div>

        {/* purchase card */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-20 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 md:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-[#0e0f15] border border-[#1e1f2a] flex items-center justify-center shrink-0 overflow-hidden p-2">
                <img
                  src={service.logoUrl ?? FALLBACK}
                  alt={`${service.titleFa} — لوگو`}
                  width={56}
                  height={56}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                {category && Icon && (
                  <a
                    href={'/c/' + category.slug}
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
                      e.preventDefault()
                      onNavigate('/c/' + category.slug)
                    }}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-md mb-1.5 transition-colors hover:opacity-80 no-underline"
                    style={{ background: `${color}15`, color }}
                  >
                    <Icon size={10} />
                    {category.titleFa}
                  </a>
                )}
                <p
                  aria-hidden="true"
                  className="text-lg font-black text-white leading-tight line-clamp-2 m-0"
                >
                  خرید {service.titleFa}
                </p>
                {service.titleEn && (
                  <p className="text-xs text-[#6b6c78] mt-0.5" dir="ltr">
                    {service.titleEn}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {service.isPopular && (
                <span className="bg-[#d4a853]/15 text-[#d4a853] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Flame size={10} />
                  پرفروش
                </span>
              )}
              {service.isAi && (
                <span className="bg-[#9b5de5]/15 text-[#9b5de5] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Sparkles size={10} />
                  هوش مصنوعی
                </span>
              )}
              {discount > 0 && (
                <span className="bg-[#e63946]/15 text-[#e63946] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                  <Percent size={10} />
                  {discount}٪ تخفیف
                </span>
              )}
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${
                  service.inStock
                    ? 'bg-[#2ec4b6]/15 text-[#2ec4b6]'
                    : 'bg-[#e63946]/15 text-[#e63946]'
                }`}
              >
                {service.inStock ? (
                  <>
                    <CheckCircle2 size={10} />
                    موجود
                  </>
                ) : (
                  <>
                    <AlertCircle size={10} />
                    ناموجود
                  </>
                )}
              </span>
            </div>

            <div className="bg-[#0e0f15] border border-[#1e1f2a] rounded-xl p-4 mb-4">
              {selectedPlan ? (
                <>
                  <div className="text-[11px] text-[#6b6c78] mb-1 line-clamp-1">
                    {selectedPlan.titleFa}
                  </div>
                  {selectedPlan.compareAtIrt && getPlanDiscountPct(selectedPlan) > 0 && (
                    <span className="text-[11px] text-[#505162] line-through block mb-1">
                      {formatToman(selectedPlan.compareAtIrt)} تومان
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-black text-white">
                      {formatToman(selectedPlan.priceIrt)}
                    </span>
                    <span className="text-xs text-[#6b6c78]">تومان</span>
                  </div>
                  {servicePlans.length > 1 && (
                    <p className="text-[10px] text-[#6b6c78] mt-1">
                      {toPersianDigits(servicePlans.length)} پلن قابل انتخاب
                    </p>
                  )}
                </>
              ) : (
                <>
                  {service.compareAtIrt && discount > 0 && (
                    <span className="text-[11px] text-[#505162] line-through block mb-1">
                      {formatToman(service.compareAtIrt)} تومان
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] text-[#6b6c78]">از</span>
                    <span className="text-2xl md:text-3xl font-black text-white">
                      {formatToman(service.fromPriceIrt)}
                    </span>
                    <span className="text-xs text-[#6b6c78]">تومان</span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              disabled={!service.inStock}
              className="w-full bg-[#d4a853] hover:bg-[#c49a48] disabled:bg-[#1e1f2a] disabled:text-[#6b6c78] disabled:cursor-not-allowed text-[#0b0c10] font-bold h-12 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 mb-2"
            >
              <ShoppingCart size={16} />
              {service.inStock ? 'مشاهده پلن‌ها و خرید' : 'ناموجود'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#0e0f15] border border-[#1e1f2a] hover:border-[#d4a853]/40 text-[#9a9baa] hover:text-white text-xs h-10 rounded-xl transition-all"
              >
                <Heart size={14} />
                علاقه‌مندی
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#0e0f15] border border-[#1e1f2a] hover:border-[#d4a853]/40 text-[#9a9baa] hover:text-white text-xs h-10 rounded-xl transition-all"
              >
                <Share2 size={14} />
                اشتراک گذاری
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* plans */}
      {servicePlans.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-6 bg-[#d4a853] rounded-full" />
            <h2 className="text-lg font-black text-white">پلن‌ها و قیمت‌ها</h2>
            <span className="text-xs text-[#6b6c78]">
              ({toPersianDigits(servicePlans.length)} پلن)
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {servicePlans.map((p) => {
              const planDiscount = getPlanDiscountPct(p)
              const isSelected = p.id === selectedPlanId
              const inStock = (p.stockStatus ?? 'IN_STOCK') === 'IN_STOCK'
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={!inStock}
                  onClick={() => setSelectedPlanId(p.id)}
                  className={`relative text-right bg-[#13141a] border rounded-2xl p-4 transition-all flex flex-col gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'border-[#d4a853] ring-1 ring-[#d4a853]/40'
                      : 'border-[#1e1f2a] hover:border-[#d4a853]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white leading-6 line-clamp-2 flex-1">
                      {p.titleFa}
                    </h3>
                    <div className="flex flex-col gap-1 items-end shrink-0">
                      {p.isPopular && (
                        <span className="bg-[#d4a853] text-[#0b0c10] text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Flame size={10} />
                          پرفروش
                        </span>
                      )}
                      {planDiscount > 0 && (
                        <span className="bg-[#e63946] text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Percent size={10} />
                          {toPersianDigits(planDiscount)}٪
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.durationDays != null && (
                      <span className="bg-[#0e0f15] border border-[#1e1f2a] text-[10px] text-[#9a9baa] px-2 py-1 rounded-md flex items-center gap-1">
                        <Calendar size={10} />
                        {toPersianDigits(p.durationDays)} روز
                      </span>
                    )}
                    {p.credits != null && (
                      <span className="bg-[#0e0f15] border border-[#1e1f2a] text-[10px] text-[#9a9baa] px-2 py-1 rounded-md flex items-center gap-1">
                        <Coins size={10} />
                        {toPersianDigits(p.credits)} اعتبار
                      </span>
                    )}
                    {p.region && (
                      <span className="bg-[#0e0f15] border border-[#1e1f2a] text-[10px] text-[#9a9baa] px-2 py-1 rounded-md flex items-center gap-1">
                        <Globe size={10} />
                        {p.region}
                      </span>
                    )}
                    {!inStock && (
                      <span className="bg-[#e63946]/15 text-[#e63946] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <AlertCircle size={10} />
                        ناموجود
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-2 border-t border-[#1e1f2a] flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      {p.compareAtIrt && planDiscount > 0 && (
                        <span className="text-[10px] text-[#505162] line-through block leading-tight">
                          {formatToman(p.compareAtIrt)}
                        </span>
                      )}
                      <span className="font-black text-base text-white leading-tight whitespace-nowrap">
                        {formatToman(p.priceIrt)}
                      </span>
                      <span className="text-[10px] text-[#6b6c78] mr-1">تومان</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                        isSelected
                          ? 'bg-[#d4a853] text-[#0b0c10]'
                          : 'bg-[#1e1f2a] text-[#9a9baa]'
                      }`}
                    >
                      {isSelected ? 'انتخاب شد' : 'انتخاب'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* related */}
      {related.length > 0 && category && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 bg-[#d4a853] rounded-full" />
              <h2 className="text-lg font-black text-white">سرویس‌های مشابه</h2>
            </div>
            <AppLink
              href={'/c/' + category.slug}
              onNavigate={onNavigate}
              className="text-xs text-[#d4a853] hover:underline font-medium no-underline"
            >
              مشاهده همه
            </AppLink>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {related.map((s) => (
              <ProductCard
                key={s.id}
                service={s}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

/**
 * Display block for verified user reviews. Renders nothing when fewer
 * than 3 verified reviews exist (matches the JSON-LD threshold) so we
 * never advertise a half-empty review section. This component is the
 * visible counterpart to the `aggregateRating` + `review` block in
 * `productLd()` so SERP and on-page UI stay consistent.
 */
function ReviewsSection({
  reviews,
  serviceTitleFa,
}: {
  reviews: ServiceReview[] | null
  serviceTitleFa: string
}) {
  const summary = summarizeReviews(reviews)
  if (!summary || !reviews) return null

  // Show all verified reviews up to a sensible cap on detail pages.
  const verifiedReviews = reviews
    .filter((r) => r.verified !== false && r.rating > 0 && r.rating <= 5)
    .slice(0, 12)

  return (
    <div className="mt-5 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-lg font-black text-white">
          نظرات کاربران درباره {serviceTitleFa}
        </h2>
        <div className="flex items-center gap-3 bg-[#0e0f15] border border-[#1e1f2a] rounded-xl px-4 py-2 self-start md:self-auto">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const filled = i < Math.round(summary.average)
              return (
                <svg
                  key={i}
                  width={16}
                  height={16}
                  viewBox="0 0 20 20"
                  fill={filled ? '#d4a853' : 'transparent'}
                  stroke={filled ? '#d4a853' : '#3a3b48'}
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.9z" />
                </svg>
              )
            })}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-black text-white">
              {toPersianDigits(summary.average.toFixed(1))}
            </span>
            <span className="text-[10px] text-[#6b6c78]">
              از {toPersianDigits(summary.count)} نظر
            </span>
          </div>
        </div>
      </div>

      <ul className="space-y-3">
        {verifiedReviews.map((r, i) => (
          <li
            key={i}
            className="bg-[#0e0f15] border border-[#1e1f2a] rounded-xl p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {r.author || 'کاربر پی‌کارت'}
                </span>
                {r.datePublished && (
                  <span className="text-[10px] text-[#6b6c78]">
                    {r.datePublished}
                  </span>
                )}
              </div>
              <div
                className="flex items-center gap-0.5"
                aria-label={`امتیاز ${r.rating} از ۵`}
              >
                {Array.from({ length: 5 }).map((_, j) => {
                  const filled = j < r.rating
                  return (
                    <svg
                      key={j}
                      width={12}
                      height={12}
                      viewBox="0 0 20 20"
                      fill={filled ? '#d4a853' : 'transparent'}
                      stroke={filled ? '#d4a853' : '#3a3b48'}
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9L10 15l-5.2 2.7 1-5.9L1.5 7.7l5.9-.9z" />
                    </svg>
                  )
                })}
              </div>
            </div>
            {r.body && (
              <p className="text-xs text-[#c4c5d0] leading-7 whitespace-pre-line">
                {r.body}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
