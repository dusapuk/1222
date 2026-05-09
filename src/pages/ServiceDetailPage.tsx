import { useMemo, useState } from 'react'
import {
  ShoppingCart,
  Heart,
  Share2,
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
  type Plan,
  type Service,
} from '../lib/data'
import { ProductCard } from '../components/ProductCard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { formatToman, toPersianDigits } from '../lib/format'
import { iconFor } from '../lib/icons'

const FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23f5f3ed"/><circle cx="32" cy="26" r="9" fill="%23dad7d0"/><path d="M14 56c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="%23dad7d0"/></svg>'

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

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-[#141413] mb-3">سرویس پیدا نشد</h1>
        <button
          type="button"
          onClick={() => onNavigate('/categories')}
          className="text-[#c2410c] hover:underline"
        >
          مشاهده دسته‌بندی‌ها
        </button>
      </div>
    )
  }

  const discount = getDiscountPct(service)
  const Icon = category ? iconFor(category.icon) : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: 'دسته‌بندی‌ها', path: '/categories' },
          ...(category ? [{ label: category.titleFa, path: `/c/${category.slug}` }] : []),
          { label: service.titleFa },
        ]}
        onNavigate={onNavigate}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* main info */}
        <div className="lg:col-span-7">
          <div className="rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] overflow-hidden">
            <div className="mx-auto w-full max-w-[460px] sm:max-w-[520px] md:max-w-[560px] p-3 sm:p-4">
              <div className="relative aspect-square overflow-hidden rounded-[12px] bg-[#f5f3ed]">
                <img
                  src={service.logoUrl ?? FALLBACK}
                  alt={service.titleFa}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = FALLBACK
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] p-6 md:p-8">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
              توضیحات
            </span>
            <h2 className="font-display mt-1 text-2xl text-[#141413]">
              درباره {service.titleFa}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[#5b5755] whitespace-pre-line">
              {service.shortDescriptionFa ??
                'این سرویس به صورت رسمی ارائه می‌شود. تمام پلن‌ها در همین صفحه قابل مقایسه است و سفارش‌ها در کمتر از چند ساعت تحویل داده می‌شود.'}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
              {[
                { label: 'تحویل سریع', desc: service.deliveryTimeFa ?? '۱۵ دقیقه تا چند ساعت' },
                { label: 'ضمانت اصالت', desc: 'فعال‌سازی روی اکانت اصلی' },
                { label: 'پشتیبانی فارسی', desc: 'پاسخگویی ۲۴ ساعته' },
                { label: `${toPersianDigits(service.planCount)} پلن`, desc: 'بهترین قیمت' },
              ].map((it) => (
                <div key={it.label} className="border-r border-[#e8e6e0] pr-4">
                  <div className="font-display text-base leading-snug text-[#141413]">
                    {it.label}
                  </div>
                  <div className="mt-1 text-[11px] leading-6 text-[#5b5755]">{it.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* purchase card */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] p-6 md:p-8">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-[#faf9f5] ring-1 ring-[#e8e6e0] p-2">
                <img
                  src={service.logoUrl ?? FALLBACK}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                {category && Icon && (
                  <button
                    type="button"
                    onClick={() => onNavigate('/c/' + category.slug)}
                    className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] px-2 py-0.5 text-[10px] font-medium text-[#5b5755] transition-shadow hover:ring-[#dad7d0]"
                  >
                    <Icon size={10} />
                    {category.titleFa}
                  </button>
                )}
                <h1 className="font-display text-2xl leading-tight text-[#141413] line-clamp-2">
                  {service.titleFa}
                </h1>
                {service.titleEn && (
                  <p className="mt-1 text-xs text-[#8e8a85]" dir="ltr">
                    {service.titleEn}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-1.5">
              {service.isPopular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#141413] px-2 py-0.5 text-[10px] font-medium text-[#faf9f5]">
                  <Flame size={10} />
                  پرفروش
                </span>
              )}
              {service.isAi && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] px-2 py-0.5 text-[10px] font-medium text-[#141413]">
                  <Sparkles size={10} />
                  هوش مصنوعی
                </span>
              )}
              {discount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#c2410c] px-2 py-0.5 text-[10px] font-medium text-[#faf9f5]">
                  <Percent size={10} />
                  {discount}٪ تخفیف
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${
                  service.inStock
                    ? 'bg-[#faf9f5] ring-[#e8e6e0] text-[#141413]'
                    : 'bg-[#fdebec] ring-[#f3c8c9] text-[#b91c1c]'
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

            <div className="mb-5 rounded-[12px] bg-[#faf9f5] ring-1 ring-[#e8e6e0] p-5">
              {selectedPlan ? (
                <>
                  <div className="mb-1 line-clamp-1 text-[11px] text-[#5b5755]">
                    {selectedPlan.titleFa}
                  </div>
                  {selectedPlan.compareAtIrt && getPlanDiscountPct(selectedPlan) > 0 && (
                    <span className="mb-1 block text-[11px] text-[#a8a39d] line-through">
                      {formatToman(selectedPlan.compareAtIrt)} تومان
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-3xl text-[#141413] md:text-4xl">
                      {formatToman(selectedPlan.priceIrt)}
                    </span>
                    <span className="text-xs text-[#5b5755]">تومان</span>
                  </div>
                  {servicePlans.length > 1 && (
                    <p className="mt-1 text-[10px] text-[#5b5755]">
                      {toPersianDigits(servicePlans.length)} پلن قابل انتخاب
                    </p>
                  )}
                </>
              ) : (
                <>
                  {service.compareAtIrt && discount > 0 && (
                    <span className="mb-1 block text-[11px] text-[#a8a39d] line-through">
                      {formatToman(service.compareAtIrt)} تومان
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] text-[#5b5755]">از</span>
                    <span className="font-display text-3xl text-[#141413] md:text-4xl">
                      {formatToman(service.fromPriceIrt)}
                    </span>
                    <span className="text-xs text-[#5b5755]">تومان</span>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              disabled={!service.inStock}
              className="mb-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#141413] text-sm font-medium text-[#faf9f5] transition-colors hover:bg-[#000000] disabled:bg-[#e8e6e0] disabled:text-[#a8a39d] disabled:cursor-not-allowed"
            >
              <ShoppingCart size={15} />
              {service.inStock ? 'مشاهده پلن‌ها و خرید' : 'ناموجود'}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] hover:ring-[#141413] text-[#141413] text-xs transition-shadow"
              >
                <Heart size={13} />
                علاقه‌مندی
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] hover:ring-[#141413] text-[#141413] text-xs transition-shadow"
              >
                <Share2 size={13} />
                اشتراک گذاری
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* plans */}
      {servicePlans.length > 0 && (
        <section className="mt-12">
          <div className="mb-6 flex items-end gap-3">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
                پلن‌ها
              </span>
              <h2 className="font-display mt-1 text-2xl text-[#141413] md:text-3xl">
                پلن‌ها و قیمت‌ها
                <span className="mr-2 text-base text-[#5b5755]">
                  ({toPersianDigits(servicePlans.length)} پلن)
                </span>
              </h2>
            </div>
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
                  className={`relative flex flex-col gap-3 rounded-[12px] bg-[#ffffff] p-5 text-right transition-shadow ring-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'ring-2 ring-[#141413]'
                      : 'ring-[#e8e6e0] hover:ring-[#dad7d0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display flex-1 text-lg leading-snug text-[#141413] line-clamp-2">
                      {p.titleFa}
                    </h3>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {p.isPopular && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#141413] px-2 py-0.5 text-[10px] font-medium text-[#faf9f5]">
                          <Flame size={10} />
                          پرفروش
                        </span>
                      )}
                      {planDiscount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#c2410c] px-2 py-0.5 text-[10px] font-medium text-[#faf9f5]">
                          <Percent size={10} />
                          {toPersianDigits(planDiscount)}٪
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {p.durationDays != null && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] px-2 py-1 text-[10px] text-[#5b5755]">
                        <Calendar size={10} />
                        {toPersianDigits(p.durationDays)} روز
                      </span>
                    )}
                    {p.credits != null && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] px-2 py-1 text-[10px] text-[#5b5755]">
                        <Coins size={10} />
                        {toPersianDigits(p.credits)} اعتبار
                      </span>
                    )}
                    {p.region && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] px-2 py-1 text-[10px] text-[#5b5755]">
                        <Globe size={10} />
                        {p.region}
                      </span>
                    )}
                    {!inStock && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fdebec] ring-1 ring-[#f3c8c9] px-2 py-1 text-[10px] font-medium text-[#b91c1c]">
                        <AlertCircle size={10} />
                        ناموجود
                      </span>
                    )}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-2 border-t border-[#e8e6e0] pt-3">
                    <div className="min-w-0">
                      {p.compareAtIrt && planDiscount > 0 && (
                        <span className="block text-[10px] leading-tight text-[#a8a39d] line-through">
                          {formatToman(p.compareAtIrt)}
                        </span>
                      )}
                      <span className="block whitespace-nowrap font-display text-xl leading-tight text-[#141413]">
                        {formatToman(p.priceIrt)}
                      </span>
                      <span className="mr-1 text-[10px] text-[#5b5755]">تومان</span>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-medium ${
                        isSelected
                          ? 'bg-[#141413] text-[#faf9f5]'
                          : 'bg-[#faf9f5] ring-1 ring-[#e8e6e0] text-[#5b5755]'
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
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b5755]">
                مرتبط
              </span>
              <h2 className="font-display mt-1 text-2xl text-[#141413] md:text-3xl">
                سرویس‌های مشابه
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('/c/' + category.slug)}
              className="text-xs font-medium text-[#141413] transition-colors hover:text-[#c2410c]"
            >
              مشاهده همه
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {related.map((s) => (
              <ProductCard
                key={s.id}
                service={s}
                onClick={() => onNavigate('/s/' + s.slug)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
