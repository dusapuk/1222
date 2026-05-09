import {
  ChevronLeft,
  Star,
  Shield,
  Zap,
  Headphones,
  CreditCard,
  Sparkles,
  Flame,
  TrendingUp,
  Award,
  Tag,
  Send,
  ArrowLeft,
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
import { iconFor, colorForCategory } from '../lib/icons'
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
      {/* hero */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div
            className="lg:col-span-7 relative rounded-2xl overflow-hidden group cursor-pointer"
            style={{ minHeight: 320 }}
            onClick={() => onNavigate('/categories')}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 30% 50%, rgba(212,168,83,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(155,93,229,0.15), transparent 50%), linear-gradient(135deg, #0e0f15 0%, #13141a 50%, #0b0c10 100%)',
              }}
            />
            <div className="relative p-8 flex flex-col justify-between h-full" style={{ minHeight: 320 }}>
              <div>
                <span className="inline-flex items-center gap-1.5 bg-[#e63946] text-white text-xs font-bold px-3 py-1 rounded-md mb-4">
                  <Flame size={12} />
                  پیشنهاد ویژه
                </span>
                <h2 className="text-3xl lg:text-4xl font-black text-white leading-relaxed mb-3">
                  اشتراک‌های بین‌المللی
                  <br />
                  <span className="text-[#d4a853]">با بهترین قیمت</span>
                </h2>
                <p className="text-[#9a9baa] text-sm max-w-md leading-7">
                  بیش از {toPersianDigits(totalServices.toLocaleString('en-US'))} سرویس فعال در{' '}
                  {toPersianDigits(categories.length)} دسته‌بندی — تحویل آنی، ضمانت اصالت و پرداخت
                  امن.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigate('/categories')
                  }}
                  className="bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  مشاهده دسته‌بندی‌ها
                  <ArrowLeft size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onNavigate('/c/ai-assistants')
                  }}
                  className="border border-[#2a2b35] hover:border-[#d4a853] text-[#c4c5d0] hover:text-white px-6 py-3 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <Sparkles size={14} />
                  هوش مصنوعی
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-3">
            {topCategories.map((c, idx) => {
              const Icon = iconFor(c.icon)
              const color = colorForCategory(c.slug)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onNavigate('/c/' + c.slug)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer group text-right ${
                    idx === 3 ? 'col-span-2' : ''
                  }`}
                  style={{ minHeight: idx === 3 ? 110 : 155 }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${color}22 0%, #0e0f15 60%, #0b0c10 100%)`,
                    }}
                  />
                  <div className="relative p-5 flex flex-col justify-between h-full">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: `${color}25`, border: `1px solid ${color}55` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold mb-1 block" style={{ color }}>
                        {toPersianDigits(getCategoryServiceCount(c.id))} سرویس
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-[#d4a853] transition-colors line-clamp-1">
                        {c.titleFa}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* trust strip */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: Zap, title: 'تحویل آنی', desc: 'دریافت در کمتر از ۳۰ ثانیه', color: '#d4a853' },
            { icon: Shield, title: 'ضمانت اصالت', desc: 'کدها و اکانت‌های اورجینال', color: '#2ec4b6' },
            { icon: Headphones, title: 'پشتیبانی ۲۴/۷', desc: 'پاسخگویی شبانه روزی', color: '#9b5de5' },
            { icon: CreditCard, title: 'پرداخت امن', desc: 'درگاه بانکی معتبر', color: '#06d6a0' },
          ].map((it) => {
            const I = it.icon
            return (
              <div
                key={it.title}
                className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-4 flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${it.color}15`, border: `1px solid ${it.color}33` }}
                >
                  <I size={20} style={{ color: it.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white mb-0.5 truncate">{it.title}</div>
                  <div className="text-[11px] text-[#6b6c78] truncate">{it.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* featured */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 bg-[#d4a853] rounded-full" />
            <h2 className="text-xl font-black text-white">پیشنهادهای ویژه</h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#e63946] bg-[#e63946]/10 px-2.5 py-1 rounded-md font-medium">
              <Flame size={12} />
              داغ
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/search', { q: '', sort: 'discount' })}
            className="flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] transition-colors font-medium"
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
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 bg-[#9b5de5] rounded-full" />
            <h2 className="text-xl font-black text-white">دسته‌بندی سرویس‌ها</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/categories')}
            className="flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] transition-colors font-medium"
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
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 bg-[#2ec4b6] rounded-full" />
            <h2 className="text-xl font-black text-white">محبوب‌ترین‌ها</h2>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[#2ec4b6] bg-[#2ec4b6]/10 px-2.5 py-1 rounded-md font-medium">
              <TrendingUp size={12} />
              پرفروش
            </span>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/search', { q: '', sort: 'popular' })}
            className="flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] transition-colors font-medium"
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

      {/* stats */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { num: toPersianDigits(totalServices.toLocaleString('en-US')) + '+', label: 'سرویس فعال' },
            { num: toPersianDigits(categories.length), label: 'دسته‌بندی' },
            { num: '۹۹.۸٪', label: 'رضایت مشتریان' },
            { num: '< ۳۰ ثانیه', label: 'زمان تحویل' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#13141a] border border-[#1e1f2a] rounded-xl p-5 text-center"
            >
              <div className="text-2xl font-black text-[#d4a853] mb-1">{s.num}</div>
              <div className="text-xs text-[#6b6c78]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div
          className="rounded-2xl p-8 relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, #1a1510 0%, #13141a 50%, #101520 100%)',
          }}
        >
          <div
            className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-5 pointer-events-none"
            style={{ background: '#d4a853', filter: 'blur(80px)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5 pointer-events-none"
            style={{ background: '#2ec4b6', filter: 'blur(60px)' }}
          />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-black text-white mb-2">از تخفیف‌ها باخبر شوید</h3>
              <p className="text-sm text-[#6b6c78]">
                ایمیل خود را وارد کنید تا جدیدترین تخفیف‌ها و پیشنهادها را دریافت کنید
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex w-full md:w-auto gap-2"
            >
              <input
                type="email"
                placeholder="ایمیل شما"
                className="bg-[#0b0c10] border border-[#252630] rounded-xl h-11 px-4 text-sm text-[#e8e8ed] placeholder-[#3a3b48] outline-none focus:border-[#d4a853] transition-colors flex-1 md:w-64"
              />
              <button
                type="submit"
                className="bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold h-11 px-6 rounded-xl text-sm transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <Send size={14} />
                عضویت
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SEO/marketing strip */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: Star, title: 'پلتفرم برتر', desc: 'بزرگ‌ترین تنوع سرویس‌های دیجیتال در ایران' },
            { icon: Award, title: 'تجربه چندساله', desc: 'هزاران سفارش موفق با رضایت کامل' },
            { icon: Tag, title: 'تخفیف ویژه', desc: 'بهترین قیمت بازار + کد تخفیف عضویت' },
          ].map((it) => {
            const I = it.icon
            return (
              <div
                key={it.title}
                className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 flex items-start gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-[#d4a853]/10 border border-[#d4a853]/20 flex items-center justify-center shrink-0">
                  <I size={20} className="text-[#d4a853]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">{it.title}</div>
                  <div className="text-xs text-[#6b6c78] leading-6">{it.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
