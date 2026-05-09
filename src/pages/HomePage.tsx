import {
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  Send,
} from 'lucide-react'
import {
  categories,
  getCategoryServiceCount,
  getFeaturedServices,
  getPopularServices,
  services,
} from '../lib/data'
import { ProductCard } from '../components/ProductCard'
import { CategoryCard } from '../components/CategoryCard'
import { iconFor, imageForCategory } from '../lib/icons'
import { toPersianDigits } from '../lib/format'

export type HomePageProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featured = getFeaturedServices(8)
  const popular = getPopularServices(12)
  const topCategories = categories.slice(0, 4)
  const totalServices = services.length

  return (
    <>
      {/* hero — editorial split: large serif headline + photo card */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 lg:order-1 order-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
              <span className="block h-px w-6 bg-[#c2410c]" />
              مارکت‌پلیس سرویس‌های دیجیتال
            </span>
            <h1 className="font-display mt-3 text-4xl leading-[1.1] text-[#141413] md:text-5xl lg:text-6xl">
              اشتراک‌های بین‌المللی،
              <br />
              <span className="text-[#c2410c]">با بهترین قیمت بازار.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#5b5755]">
              بیش از {toPersianDigits(totalServices.toLocaleString('en-US'))} سرویس فعال در{' '}
              {toPersianDigits(categories.length)} دسته‌بندی — تحویل آنی، ضمانت اصالت
              و پرداخت امن، بدون واسطه.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('/categories')}
                className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-6 py-3 text-sm font-medium text-[#faf9f5] transition-colors hover:bg-[#000000]"
              >
                مشاهده دسته‌بندی‌ها
                <ArrowLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/c/ai-assistants')}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-[#141413] ring-1 ring-[#e8e6e0] transition-colors hover:ring-[#141413]"
              >
                <Sparkles size={14} />
                هوش مصنوعی
              </button>
            </div>
          </div>

          <div
            onClick={() => onNavigate('/categories')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onNavigate('/categories')}
            className="lg:col-span-5 lg:order-2 order-1 group relative cursor-pointer overflow-hidden rounded-[12px] ring-1 ring-[#e8e6e0]"
            style={{ aspectRatio: '4 / 5' }}
          >
            <img
              src="/images/home/hero-premium.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </div>
      </section>

      {/* top category strip */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {topCategories.map((c) => {
            const Icon = iconFor(c.icon)
            const image = imageForCategory(c.slug)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onNavigate('/c/' + c.slug)}
                className="group flex flex-col overflow-hidden rounded-[12px] bg-[#ffffff] text-right ring-1 ring-[#e8e6e0] transition-[transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:ring-[#dad7d0] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f3ed]">
                  <img
                    src={image}
                    alt={c.titleFa}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
                    <Icon size={14} className="text-[#5b5755]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-display text-base text-[#141413]">
                      {c.titleFa}
                    </span>
                    <span className="block text-[11px] text-[#5b5755]">
                      {toPersianDigits(getCategoryServiceCount(c.id))} سرویس
                    </span>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* trust strip — typographic line, not multicolored icon chips */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="hairline mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {[
            { label: 'تحویل آنی', desc: 'دریافت در کمتر از ۳۰ ثانیه' },
            { label: 'ضمانت اصالت', desc: 'کدها و اکانت‌های اورجینال' },
            { label: 'پشتیبانی ۲۴/۷', desc: 'پاسخگویی شبانه‌روزی' },
            { label: 'پرداخت امن', desc: 'درگاه بانکی معتبر' },
          ].map((it) => (
            <div key={it.label} className="border-r border-[#e8e6e0] pr-4">
              <div className="font-display text-lg leading-snug text-[#141413]">
                {it.label}
              </div>
              <div className="mt-1 text-[12px] leading-6 text-[#5b5755]">
                {it.desc}
              </div>
            </div>
          ))}
        </div>
        <div className="hairline mt-8" />
      </section>

      {/* featured */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
              پیشنهاد ویژه
            </span>
            <h2 className="font-display mt-1 text-2xl text-[#141413] md:text-3xl">
              پیشنهادهای ویژه‌ی این هفته
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/search', { q: '', sort: 'discount' })}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#141413] transition-colors hover:text-[#c2410c]"
          >
            مشاهده همه
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.map((s) => (
            <ProductCard key={s.id} service={s} onClick={() => onNavigate('/s/' + s.slug)} />
          ))}
        </div>
      </section>

      {/* category showcase */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b5755]">
              دسته‌بندی‌ها
            </span>
            <h2 className="font-display mt-1 text-2xl text-[#141413] md:text-3xl">
              تمام سرویس‌ها در یک نگاه
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/categories')}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#141413] transition-colors hover:text-[#c2410c]"
          >
            همه دسته‌بندی‌ها
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.slice(0, 8).map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              count={getCategoryServiceCount(c.id)}
              onClick={(slug) => onNavigate('/c/' + slug)}
            />
          ))}
        </div>
      </section>

      {/* popular */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5b5755]">
              محبوب‌ترین‌ها
            </span>
            <h2 className="font-display mt-1 text-2xl text-[#141413] md:text-3xl">
              پرفروش‌ترین‌ سرویس‌ها
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/search', { q: '', sort: 'popular' })}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[#141413] transition-colors hover:text-[#c2410c]"
          >
            مشاهده همه
            <ChevronLeft size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {popular.map((s) => (
            <ProductCard key={s.id} service={s} onClick={() => onNavigate('/s/' + s.slug)} />
          ))}
        </div>
      </section>

      {/* stats — editorial tabular line */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="hairline mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
          {[
            { num: toPersianDigits(totalServices.toLocaleString('en-US')) + '+', label: 'سرویس فعال' },
            { num: toPersianDigits(categories.length), label: 'دسته‌بندی' },
            { num: '۹۹.۸٪', label: 'رضایت مشتریان' },
            { num: '< ۳۰ ثانیه', label: 'زمان تحویل' },
          ].map((s) => (
            <div key={s.label} className="border-r border-[#e8e6e0] pr-4">
              <div className="font-display text-3xl text-[#141413]">{s.num}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#5b5755]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div className="hairline mt-8" />
      </section>

      {/* newsletter — flat saffron-soft block, no glow */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-[12px] bg-[#fef2e9] px-6 py-10 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-md">
              <h3 className="font-display text-2xl text-[#141413] md:text-3xl">
                از تخفیف‌ها باخبر شوید.
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#5b5755]">
                ایمیل خود را وارد کنید — جدیدترین پیشنهادها و کدهای تخفیف
                مستقیم در صندوق ورودی شما.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full gap-2 md:w-auto"
            >
              <input
                type="email"
                placeholder="ایمیل شما"
                className="h-12 flex-1 rounded-full bg-[#ffffff] px-5 text-sm text-[#141413] placeholder-[#a8a39d] outline-none ring-1 ring-[#e8e6e0] transition-shadow focus:ring-[#141413] md:w-72"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-[#141413] px-6 text-sm font-medium text-[#faf9f5] transition-colors hover:bg-[#000000]"
              >
                <Send size={14} />
                عضویت
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
