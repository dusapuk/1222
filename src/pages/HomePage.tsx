import {
  ChevronLeft,
  Sparkles,
  ArrowLeft,
  Send,
  Zap,
  ShieldCheck,
  Headphones,
  Lock,
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
import { iconFor } from '../lib/icons'
import { toPersianDigits } from '../lib/format'

export type HomePageProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featured = getFeaturedServices(8)
  const popular = getPopularServices(12)
  const totalServices = services.length

  return (
    <>
      {/* promo strip — saffron-soft band, single line, marketplace-style banner above hero */}
      <section className="border-b border-[#fbd4b8] bg-[#fef2e9]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-3 text-[12px] text-[#9a3412]">
          <span className="block h-1.5 w-1.5 rounded-full bg-[#c2410c]" />
          <span>تخفیف ویژه نوروزی</span>
          <span className="font-display text-base text-[#9a3412]">تا ۳۰٪</span>
          <span className="hidden sm:inline">روی همه سرویس‌ها</span>
          <button
            type="button"
            onClick={() => onNavigate('/search', { q: '', sort: 'discount' })}
            className="inline-flex items-center gap-1 font-medium text-[#c2410c] hover:text-[#9a3412]"
          >
            مشاهده
            <ArrowLeft size={12} />
          </button>
        </div>
      </section>

      {/* hero — marketplace banner: 8/4 split. Big visual deal on the right (RTL: visually right), 2 stacked side cards on left. Compact (~h-80). */}
      <section className="max-w-7xl mx-auto px-4 pt-5 md:pt-6">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* main banner */}
          <button
            type="button"
            onClick={() => onNavigate('/categories')}
            className="group relative block overflow-hidden rounded-[12px] ring-1 ring-[#e8e6e0] lg:col-span-8"
            style={{ aspectRatio: '16 / 7' }}
          >
            <img
              src="/images/home/hero-premium.jpg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0b0c10]/85 via-[#0b0c10]/45 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-end justify-end p-5 md:p-8 text-right">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#faf9f5]/95 px-3 py-1 text-[11px] font-medium text-[#9a3412]">
                <span className="block h-1.5 w-1.5 rounded-full bg-[#c2410c]" />
                مارکت‌پلیس سرویس‌های دیجیتال
              </span>
              <h1 className="font-display mt-3 max-w-md text-2xl leading-snug text-[#faf9f5] md:text-[2rem]">
                اشتراک‌های بین‌المللی، با بهترین قیمت بازار
              </h1>
              <p className="mt-1.5 max-w-md text-[13px] leading-7 text-[#dad7d0]">
                {toPersianDigits(totalServices.toLocaleString('en-US'))} سرویس در {toPersianDigits(categories.length)} دسته — تحویل آنی و ضمانت اصالت
              </p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#faf9f5] px-4 py-2 text-[13px] font-medium text-[#141413] transition-colors group-hover:bg-[#fef2e9] group-hover:text-[#9a3412]">
                مشاهده دسته‌بندی‌ها
                <ArrowLeft size={14} />
              </span>
            </div>
          </button>

          {/* side cards — stacked on lg, side by side on md, full on sm */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <button
              type="button"
              onClick={() => onNavigate('/c/ai-assistants')}
              className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-[12px] bg-[#141413] p-4 text-right text-[#faf9f5] ring-1 ring-[#141413] transition-transform hover:-translate-y-[1px]"
            >
              <Sparkles size={18} className="text-[#c2410c]" />
              <div>
                <div className="font-display text-lg leading-snug">هوش مصنوعی</div>
                <div className="mt-1 text-[12px] leading-6 text-[#dad7d0]">
                  ChatGPT, Midjourney, Claude
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] text-[#fbd4b8] group-hover:text-[#fef2e9]">
                مشاهده پلن‌ها
                <ArrowLeft size={12} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/c/ai-video')}
              className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-[12px] bg-[#fef2e9] p-4 text-right text-[#9a3412] ring-1 ring-[#fbd4b8] transition-transform hover:-translate-y-[1px]"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.18em]">تازه</span>
              <div>
                <div className="font-display text-lg leading-snug text-[#141413]">تولید ویدیو با AI</div>
                <div className="mt-1 text-[12px] leading-6 text-[#9a3412]/80">
                  Sora, Runway, Pika — به صرفه‌ترین پلن‌ها
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium">
                مشاهده
                <ArrowLeft size={12} />
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* category strip — compact 7-up grid (on lg) of icon+name tiles. Single saffron-graphite palette. */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5b5755]">
              دسته‌بندی‌ها
            </span>
            <h2 className="font-display mt-1 text-lg text-[#141413] md:text-xl">
              پر‌بازدیدترین دسته‌بندی‌ها
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/categories')}
            className="inline-flex items-center gap-1 text-[13px] font-medium text-[#141413] hover:text-[#c2410c]"
          >
            همه ({toPersianDigits(categories.length)})
            <ChevronLeft size={14} />
          </button>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {categories.slice(0, 7).map((c) => {
            const Icon = iconFor(c.icon)
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onNavigate('/c/' + c.slug)}
                className="group flex flex-col items-center justify-center gap-2 rounded-[12px] bg-[#ffffff] px-2 py-3 ring-1 ring-[#e8e6e0] transition-colors hover:bg-[#faf9f5] hover:ring-[#141413] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/40"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0] transition-colors group-hover:bg-[#fef2e9] group-hover:ring-[#fbd4b8]">
                  <Icon size={16} className="text-[#5b5755] transition-colors group-hover:text-[#c2410c]" />
                </span>
                <span className="line-clamp-2 text-center text-[12px] leading-4 text-[#141413]">
                  {c.titleFa}
                </span>
                <span className="text-[10px] tabular-nums text-[#8e8a85]">
                  {toPersianDigits(getCategoryServiceCount(c.id))}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* trust strip — single inline line with hairline dividers, marketplace-compact */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-[12px] bg-[#ffffff] px-4 py-3 ring-1 ring-[#e8e6e0]">
          {[
            { Icon: Zap, label: 'تحویل آنی', desc: '< ۳۰ ثانیه' },
            { Icon: ShieldCheck, label: 'ضمانت اصالت', desc: 'اکانت‌های اورجینال' },
            { Icon: Headphones, label: 'پشتیبانی ۲۴/۷', desc: 'شبانه‌روزی' },
            { Icon: Lock, label: 'پرداخت امن', desc: 'درگاه بانکی' },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="inline-flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
                <Icon size={14} className="text-[#5b5755]" />
              </span>
              <div className="text-right">
                <div className="font-display text-[13px] leading-tight text-[#141413]">{label}</div>
                <div className="text-[11px] leading-tight text-[#5b5755]">{desc}</div>
              </div>
            </div>
          ))}
        </div>
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
