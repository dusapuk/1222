import { useState } from 'react'
import './App.css'
import {
  Search,
  ShoppingCart,
  User,
  ArrowLeft,
  ArrowUpLeft,
  Star,
  Shield,
  Zap,
  Headphones,
  CreditCard,
  Gamepad2,
  Music,
  Tv,
  Brain,
  Gift,
  Smartphone,
  Globe,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Send,
  TrendingUp,
  Heart,
  Menu,
  X,
  Sparkles,
  Tag,
  Plus,
  Minus,
  ChevronDown,
} from 'lucide-react'

/* ───────── data ───────── */

const categories = [
  { name: 'بازی', icon: Gamepad2 },
  { name: 'موسیقی', icon: Music },
  { name: 'استریم', icon: Tv },
  { name: 'هوش مصنوعی', icon: Brain },
  { name: 'گیفت کارت', icon: Gift },
  { name: 'اپلیکیشن', icon: Smartphone },
  { name: 'VPN و امنیت', icon: Shield },
  { name: 'آموزشی', icon: Globe },
]

const featuredProducts = [
  {
    id: 1,
    title: 'اشتراک ChatGPT Plus',
    subtitle: 'یک ماهه — پلن حرفه‌ای',
    price: '۸۹۰,۰۰۰',
    oldPrice: '۱,۱۰۰,۰۰۰',
    discount: 19,
    image: '/images/tech1.jpg',
    badge: 'پرفروش',
  },
  {
    id: 2,
    title: 'اشتراک Spotify Premium',
    subtitle: 'سه ماهه — اکانت اصلی',
    price: '۴۵۰,۰۰۰',
    oldPrice: '۵۵۰,۰۰۰',
    discount: 18,
    image: '/images/spotify.jpg',
    badge: 'ویژه',
  },
  {
    id: 3,
    title: 'گیفت کارت PlayStation',
    subtitle: '۵۰ دلاری — منطقه آمریکا',
    price: '۳,۲۵۰,۰۰۰',
    oldPrice: '۳,۵۰۰,۰۰۰',
    discount: 7,
    image: '/images/playstation.jpg',
    badge: '',
  },
  {
    id: 4,
    title: 'گیفت کارت Steam',
    subtitle: '۲۰ دلاری — منطقه آرژانتین',
    price: '۱,۳۵۰,۰۰۰',
    oldPrice: '۱,۴۰۰,۰۰۰',
    discount: 4,
    image: '/images/steam.jpg',
    badge: '',
  },
]

const popularProducts = [
  { id: 5, title: 'اشتراک Netflix', subtitle: 'یک ماهه Premium', price: '۷۲۰,۰۰۰', oldPrice: '۸۵۰,۰۰۰', discount: 15, image: '/images/netflix.jpg', rating: 4.8, sales: 2340 },
  { id: 6, title: 'گیفت کارت Apple', subtitle: '۲۵ دلاری', price: '۱,۷۰۰,۰۰۰', oldPrice: '۱,۸۵۰,۰۰۰', discount: 8, image: '/images/apple.jpg', rating: 4.9, sales: 1890 },
  { id: 7, title: 'گیفت کارت Xbox', subtitle: '۵۰ دلاری', price: '۳,۱۰۰,۰۰۰', oldPrice: '۳,۳۰۰,۰۰۰', discount: 6, image: '/images/xbox.jpg', rating: 4.7, sales: 1450 },
  { id: 8, title: 'اشتراک YouTube Premium', subtitle: 'سه ماهه', price: '۵۸۰,۰۰۰', oldPrice: '۶۵۰,۰۰۰', discount: 11, image: '/images/gaming1.jpg', rating: 4.6, sales: 3200 },
  { id: 9, title: 'گیفت کارت Google Play', subtitle: '۱۰ دلاری', price: '۶۸۰,۰۰۰', oldPrice: '۷۲۰,۰۰۰', discount: 6, image: '/images/google.jpg', rating: 4.5, sales: 4100 },
  { id: 10, title: 'اشتراک PUBG Mobile', subtitle: '۶۰ UC', price: '۶۵,۰۰۰', oldPrice: '۸۰,۰۰۰', discount: 19, image: '/images/pubg.jpg', rating: 4.4, sales: 8900 },
  { id: 11, title: 'لایسنس Adobe Creative', subtitle: 'یک ساله', price: '۴,۲۰۰,۰۰۰', oldPrice: '۵,۰۰۰,۰۰۰', discount: 16, image: '/images/gaming2.jpg', rating: 4.8, sales: 560 },
  { id: 12, title: 'اشتراک Discord Nitro', subtitle: 'سه ماهه', price: '۷۸۰,۰۰۰', oldPrice: '۸۵۰,۰۰۰', discount: 8, image: '/images/gaming3.jpg', rating: 4.3, sales: 2100 },
]

const quickServices = [
  { name: 'Steam', img: '/images/steam.jpg' },
  { name: 'PlayStation', img: '/images/playstation.jpg' },
  { name: 'Xbox', img: '/images/xbox.jpg' },
  { name: 'Apple', img: '/images/apple.jpg' },
  { name: 'Spotify', img: '/images/spotify.jpg' },
  { name: 'Netflix', img: '/images/netflix.jpg' },
  { name: 'Google Play', img: '/images/google.jpg' },
  { name: 'PUBG', img: '/images/pubg.jpg' },
]

const trustFeatures = [
  { icon: Zap, title: 'تحویل آنی', desc: 'دریافت کد در کمتر از ۳۰ ثانیه پس از پرداخت' },
  { icon: Shield, title: 'ضمانت اصالت', desc: 'تمامی کدها اورجینال و معتبر، با بازگشت کامل وجه' },
  { icon: Headphones, title: 'پشتیبانی ۲۴/۷', desc: 'تیم پاسخگویی آماده در هر ساعت از شبانه‌روز' },
  { icon: CreditCard, title: 'پرداخت امن', desc: 'درگاه بانکی معتبر و رمزنگاری کامل تراکنش' },
]

const footerLinks = {
  services: ['گیفت کارت استیم', 'اشتراک اسپاتیفای', 'گیفت کارت پلی‌استیشن', 'اشتراک نتفلیکس', 'گیفت کارت اپل'],
  support: ['سوالات متداول', 'راهنمای خرید', 'شرایط بازگشت وجه', 'تماس با ما', 'درباره ما'],
  legal: ['قوانین و مقررات', 'حریم خصوصی', 'شرایط استفاده'],
}

/* ───────── small UI primitives ───────── */

function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const isSm = size === 'sm'
  return (
    <a href="#" className="inline-flex items-center gap-2.5 group">
      <div
        className={`${isSm ? 'w-8 h-8' : 'w-9 h-9'} rounded-[10px] flex items-center justify-center`}
        style={{
          background: 'linear-gradient(150deg, var(--accent) 0%, var(--accent-strong) 100%)',
          boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset, 0 6px 20px -8px rgba(244,162,97,0.5)',
        }}
      >
        <span className="font-black text-sm" style={{ color: 'var(--bg)' }}>پ</span>
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight ${isSm ? 'text-sm' : 'text-base'}`} style={{ color: 'var(--text)' }}>
          پی‌کارت
        </div>
        <div className="text-[10px] font-mono tracking-[0.2em] -mt-0.5" style={{ color: 'var(--text-faint)' }}>
          PIKART
        </div>
      </div>
    </a>
  )
}

/* ───────── components ───────── */

function AnnouncementBar() {
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 flex items-center justify-between h-9 text-xs">
        <div className="flex items-center gap-5" style={{ color: 'var(--text-dim)' }}>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--positive)', boxShadow: '0 0 6px var(--positive)' }} />
            پشتیبانی آنلاین
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone size={11} />
            ۰۲۱-۹۱۰۰۹۲۰۰
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5">
            <Mail size={11} />
            info@pikart.ir
          </span>
        </div>
        <div className="flex items-center gap-5" style={{ color: 'var(--text-dim)' }}>
          <span className="hidden md:inline">ارسال در سراسر ایران</span>
          <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
            <Sparkles size={11} />
            تخفیف نوروزی تا ۳۰٪
          </span>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{ background: 'rgba(10,10,11,0.78)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-center justify-between h-[68px] gap-6">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden lg:flex items-center gap-7 text-[13px]">
              <a href="#" className="link-quiet font-medium">فروشگاه</a>
              <a href="#" className="link-quiet font-medium">دسته‌بندی‌ها</a>
              <a href="#" className="link-quiet font-medium">پیشنهادها</a>
              <a href="#" className="link-quiet font-medium">راهنما</a>
            </nav>
          </div>

          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="جستجو در ۱,۲۰۰+ محصول…"
                className="w-full h-11 pr-11 pl-16 text-[13px] outline-none transition-colors rounded-[10px] border"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--border-strong)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
              <Search
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
                size={16}
                style={{ color: 'var(--text-dim)' }}
              />
              <kbd
                className="hidden sm:inline-flex absolute left-2.5 top-1/2 -translate-y-1/2 items-center h-6 px-2 text-[10px] font-mono rounded border"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-dim)',
                }}
              >
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="hidden sm:flex w-10 h-10 rounded-[10px] items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.color = 'var(--text)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <Heart size={17} />
            </button>
            <button
              className="relative w-10 h-10 rounded-[10px] flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.color = 'var(--text)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              <ShoppingCart size={17} />
              <span
                className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
              >
                ۳
              </span>
            </button>
            <button
              className="hidden md:inline-flex h-10 px-4 items-center gap-2 rounded-[10px] text-[13px] font-medium border transition-all"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <User size={15} />
              ورود
            </button>
            <button
              className="lg:hidden w-10 h-10 rounded-[10px] flex items-center justify-center"
              style={{ color: 'var(--text)' }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو…"
                className="w-full h-11 pr-11 pl-4 text-sm outline-none rounded-[10px] border"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-dim)' }} />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function CategoryBar() {
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
        <div className="flex items-center gap-1 py-2.5 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.name}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[13px] whitespace-nowrap shrink-0 transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text)'
                  e.currentTarget.style.background = 'var(--surface)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <Icon size={14} />
                {cat.name}
              </button>
            )
          })}
          <div className="mx-2 h-4 w-px" style={{ background: 'var(--border-strong)' }} />
          <button
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] whitespace-nowrap shrink-0 font-medium"
            style={{ color: 'var(--accent)' }}
          >
            همه دسته‌ها
            <ArrowLeft size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="ambient-glow"
        style={{ top: -120, right: -100, width: 480, height: 480, background: 'rgba(244,162,97,0.18)' }}
      />
      <div
        className="ambient-glow"
        style={{ bottom: -160, left: -120, width: 380, height: 380, background: 'rgba(110,231,183,0.08)' }}
      />

      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7 fade-up">
            <div className="eyebrow mb-6">مارکت‌پلیس سرویس‌های دیجیتال</div>
            <h1
              className="font-black tracking-tight leading-[1.1] mb-6"
              style={{
                fontSize: 'clamp(2.4rem, 5.2vw, 4.5rem)',
                color: 'var(--text)',
              }}
            >
              خرید آنی هر چیز
              <br />
              <span style={{ color: 'var(--text-muted)' }}>دیجیتالی که</span>{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, var(--accent) 0%, #f7c98a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                نیاز دارید
              </span>
              .
            </h1>

            <p
              className="text-[15px] lg:text-base leading-8 max-w-xl mb-10 fade-up fade-up-1"
              style={{ color: 'var(--text-muted)' }}
            >
              گیفت‌کارت، اشتراک و لایسنس بیش از ۱۲۰ سرویس بین‌المللی
              با قیمت منصفانه، تحویل کمتر از ۳۰ ثانیه و ضمانت بازگشت وجه.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-12 fade-up fade-up-2">
              <button className="btn btn-accent">
                مشاهده محصولات
                <ArrowLeft size={16} />
              </button>
              <button className="btn btn-ghost">راهنمای خرید</button>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-5 fade-up fade-up-3">
              {[
                { num: '۵۰K+', label: 'مشتری فعال' },
                { num: '۱.۲K+', label: 'محصول' },
                { num: '۹۹.۸٪', label: 'رضایت' },
                { num: '< ۳۰s', label: 'تحویل' },
              ].map((s, i, arr) => (
                <div key={s.label} className="flex items-center gap-10">
                  <div>
                    <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--text)' }}>
                      {s.num}
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                      {s.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && <div className="hidden md:block w-px h-8" style={{ background: 'var(--border)' }} />}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative fade-up fade-up-2">
            <div className="relative aspect-[5/6] max-w-[440px] mr-auto">
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden border"
                style={{
                  borderColor: 'var(--border-strong)',
                  boxShadow: '0 40px 80px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset',
                }}
              >
                <img
                  src="/images/banner1.jpg"
                  alt="hero"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = 'https://placehold.co/440x528/1a1a1d/45454d/png?text=PIKART'
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.2) 50%, rgba(10,10,11,0.95) 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="eyebrow mb-3">پیشنهاد ویژه</div>
                  <div className="text-2xl font-black mb-1" style={{ color: 'var(--text)' }}>
                    اشتراک ChatGPT Plus
                  </div>
                  <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    تا ۱۹٪ تخفیف برای اولین سفارش
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-5 -left-5 lg:-left-10 w-[180px] rounded-2xl p-4 border backdrop-blur-md"
                style={{
                  background: 'rgba(19,19,22,0.85)',
                  borderColor: 'var(--border-strong)',
                  boxShadow: '0 20px 50px -15px rgba(0,0,0,0.7)',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    <Zap size={15} />
                  </div>
                  <div className="text-[11px] font-mono tracking-widest" style={{ color: 'var(--text-dim)' }}>
                    INSTANT
                  </div>
                </div>
                <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--text)' }}>
                  ۲۸<span className="text-sm font-bold mr-1" style={{ color: 'var(--text-muted)' }}>ثانیه</span>
                </div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>
                  میانگین زمان تحویل
                </div>
              </div>

              <div
                className="absolute -bottom-6 -right-4 lg:-right-8 w-[200px] rounded-2xl p-4 border backdrop-blur-md"
                style={{
                  background: 'rgba(19,19,22,0.85)',
                  borderColor: 'var(--border-strong)',
                  boxShadow: '0 20px 50px -15px rgba(0,0,0,0.7)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[11px] font-mono tracking-widest" style={{ color: 'var(--text-dim)' }}>
                    REVIEWS
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="fill-current" style={{ color: 'var(--accent)' }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--text)' }}>
                    ۴.۹
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    / ۵
                  </div>
                </div>
                <div className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>
                  از ۱۲,۸۴۰ نظر
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-y overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="py-5 relative">
          <div className="marquee">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-12 px-6 shrink-0">
                {['Steam', 'PlayStation', 'Xbox', 'Apple', 'Spotify', 'Netflix', 'Discord', 'YouTube', 'ChatGPT', 'Adobe'].map((b) => (
                  <span
                    key={b + dup}
                    className="text-base lg:text-lg font-bold tracking-tight whitespace-nowrap"
                    style={{ color: 'var(--text-faint)' }}
                  >
                    {b}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div
            className="absolute inset-y-0 right-0 w-24 pointer-events-none"
            style={{ background: 'linear-gradient(270deg, transparent, var(--bg))' }}
          />
          <div
            className="absolute inset-y-0 left-0 w-24 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, var(--bg))' }}
          />
        </div>
      </div>
    </section>
  )
}

function QuickPurchase() {
  const [selected, setSelected] = useState(0)
  const [amount, setAmount] = useState('۱۰۰')
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="eyebrow mb-4">خرید سریع</div>
          <h2 className="text-3xl lg:text-4xl font-black tracking-tight mb-4 leading-tight" style={{ color: 'var(--text)' }}>
            از انتخاب تا تحویل،
            <br />
            <span style={{ color: 'var(--text-muted)' }}>کمتر از یک دقیقه.</span>
          </h2>
          <p className="text-sm leading-7 mb-5" style={{ color: 'var(--text-muted)' }}>
            سرویس مورد نظر را انتخاب کنید، مبلغ را وارد کنید و فوراً کد را در ایمیل و حساب کاربری خود دریافت کنید.
          </p>
          <ul className="space-y-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {['اعتبار شارژ مستقیم به اکانت', 'بدون نیاز به VPN یا کارت بین‌المللی', 'ضمانت بازگشت وجه در صورت بروز مشکل'].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <span
                  className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--accent)' }}
                />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-8">
          <div
            className="rounded-2xl border p-6 lg:p-8 relative overflow-hidden"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="absolute top-0 right-0 w-72 h-72 ambient-glow" style={{ background: 'var(--accent-soft)' }} />

            <div className="relative">
              <div className="flex gap-2 mb-7 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {quickServices.map((srv, i) => (
                  <button
                    key={srv.name}
                    onClick={() => setSelected(i)}
                    className="flex flex-col items-center gap-2 shrink-0 p-3 rounded-xl border transition-all"
                    style={{
                      background: selected === i ? 'var(--surface-2)' : 'transparent',
                      borderColor: selected === i ? 'var(--border-accent)' : 'var(--border)',
                      minWidth: 86,
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={srv.img}
                        alt={srv.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://placehold.co/48x48/1a1a1d/45454d/png?text=' + srv.name[0]
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: selected === i ? 'var(--accent)' : 'var(--text-muted)' }}
                    >
                      {srv.name}
                    </span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <label className="text-[11px] font-medium mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                    نام کاربری / ایمیل
                  </label>
                  <input
                    type="text"
                    placeholder={`نام کاربری ${quickServices[selected].name}`}
                    className="w-full h-11 px-4 text-sm outline-none rounded-[10px] border transition-colors"
                    style={{
                      background: 'var(--bg-elevated)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-[11px] font-medium mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                    مبلغ
                  </label>
                  <div
                    className="flex items-center h-11 rounded-[10px] border"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                  >
                    <button
                      onClick={() => setAmount((v) => v)}
                      className="w-10 h-full flex items-center justify-center"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 h-full bg-transparent outline-none text-sm text-center tabular-nums"
                      style={{ color: 'var(--text)' }}
                    />
                    <button
                      className="w-10 h-full flex items-center justify-center"
                      style={{ color: 'var(--text-dim)' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="md:col-span-4">
                  <label className="text-[11px] font-medium mb-1.5 block uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                    کد تخفیف
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="در صورت داشتن…"
                      className="w-full h-11 pr-10 pl-4 text-sm outline-none rounded-[10px] border"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                      }}
                    />
                    <Tag
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                      size={14}
                      style={{ color: 'var(--text-faint)' }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mt-7 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-dim)' }}>
                    مبلغ قابل پرداخت
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black tabular-nums" style={{ color: 'var(--text)' }}>
                      ۶,۵۰۰,۰۰۰
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      تومان
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-accent h-12 px-7 text-base"
                  style={{ minWidth: 200 }}
                >
                  ادامه پرداخت
                  <ArrowLeft size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
}: {
  product: typeof popularProducts[0] & { badge?: string }
}) {
  return (
    <article
      className="group rounded-2xl overflow-hidden border card-hover cursor-pointer relative"
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1d/45454d/png'
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(10,10,11,0.4) 100%)' }}
        />

        {product.discount > 0 && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold tabular-nums backdrop-blur-md"
            style={{
              background: 'rgba(244,162,97,0.15)',
              color: 'var(--accent)',
              border: '1px solid var(--border-accent)',
            }}
          >
            ٪{product.discount}-
          </div>
        )}

        {'badge' in product && product.badge && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border"
            style={{
              background: 'rgba(10,10,11,0.7)',
              color: 'var(--text)',
              borderColor: 'var(--border-strong)',
            }}
          >
            {product.badge}
          </div>
        )}

        <button
          className="absolute bottom-3 left-3 w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-md border opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: 'rgba(10,10,11,0.8)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-muted)',
          }}
        >
          <Heart size={14} />
        </button>
      </div>

      <div className="p-4 lg:p-5">
        <h3
          className="font-bold text-[14px] leading-snug transition-colors line-clamp-2 mb-1.5"
          style={{ color: 'var(--text)' }}
        >
          {product.title}
        </h3>
        <p className="text-[12px] mb-4" style={{ color: 'var(--text-dim)' }}>
          {product.subtitle}
        </p>

        {'rating' in product && product.rating && (
          <div className="flex items-center gap-3 mb-4 text-[11px]" style={{ color: 'var(--text-dim)' }}>
            <span className="inline-flex items-center gap-1">
              <Star size={11} className="fill-current" style={{ color: 'var(--accent)' }} />
              <span className="tabular-nums">{product.rating}</span>
            </span>
            <span className="w-px h-3" style={{ background: 'var(--border-strong)' }} />
            <span className="inline-flex items-center gap-1">
              <TrendingUp size={11} />
              <span className="tabular-nums">{product.sales?.toLocaleString('fa-IR')}</span> فروش
            </span>
          </div>
        )}

        <div className="flex items-end justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="leading-tight">
            {product.oldPrice && (
              <div className="text-[11px] line-through tabular-nums mb-0.5" style={{ color: 'var(--text-faint)' }}>
                {product.oldPrice}
              </div>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="font-black text-base tabular-nums" style={{ color: 'var(--text)' }}>
                {product.price}
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                تومان
              </span>
            </div>
          </div>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent-foreground)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-2)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            <ArrowUpLeft size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8">
      <div>
        <div className="eyebrow mb-3">{eyebrow}</div>
        <h2 className="text-2xl lg:text-3xl font-black tracking-tight" style={{ color: 'var(--text)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-2 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}

function FeaturedSection() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <SectionHeader
        eyebrow="پیشنهاد ویژه"
        title="محصولات منتخب این هفته"
        subtitle="تخفیف‌ها و انتخاب‌های ویژه تیم پی‌کارت — تا انتهای موجودی."
        action={
          <a
            href="#"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium pb-1 border-b transition-colors"
            style={{ color: 'var(--accent)', borderColor: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
          >
            مشاهده همه
            <ArrowLeft size={14} />
          </a>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
        {featuredProducts.map((p) => (
          <ProductCard key={p.id} product={{ ...p, rating: 4.9, sales: 1000 }} />
        ))}
      </div>
    </section>
  )
}

function PopularSection() {
  const filters = ['همه', 'بازی', 'استریم', 'گیفت کارت', 'هوش مصنوعی']
  const [active, setActive] = useState(0)
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <SectionHeader
        eyebrow="محبوب‌ترین‌ها"
        title="پرفروش‌های این ماه"
        subtitle="بر اساس فروش و امتیاز خریداران در ۳۰ روز گذشته."
      />

      <div className="flex items-center gap-1.5 mb-7 flex-wrap">
        {filters.map((f, i) => (
          <button
            key={f}
            onClick={() => setActive(i)}
            className="px-4 h-9 rounded-md text-[13px] font-medium transition-all border"
            style={{
              background: active === i ? 'var(--text)' : 'transparent',
              color: active === i ? 'var(--bg)' : 'var(--text-muted)',
              borderColor: active === i ? 'var(--text)' : 'var(--border)',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
        {popularProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <button className="btn btn-ghost h-11 px-6">
          نمایش بیشتر
          <ChevronDown size={16} />
        </button>
      </div>
    </section>
  )
}

function CategoriesShowcase() {
  const showcase = [
    {
      title: 'هوش مصنوعی',
      desc: 'جدیدترین ابزارهای AI برای کار و خلاقیت.',
      items: ['ChatGPT Plus', 'Claude Pro', 'Midjourney', 'Gemini Advanced'],
      icon: Brain,
      image: '/images/tech1.jpg',
    },
    {
      title: 'بازی و سرگرمی',
      desc: 'تمام پلتفرم‌های گیمینگ، یک‌جا.',
      items: ['Steam', 'PlayStation', 'Xbox', 'Nintendo'],
      icon: Gamepad2,
      image: '/images/gaming1.jpg',
    },
    {
      title: 'استریم و فیلم',
      desc: 'سرویس‌های پخش جهانی، با اکانت اصلی.',
      items: ['Netflix', 'Disney+', 'HBO Max', 'Hulu'],
      icon: Tv,
      image: '/images/netflix.jpg',
    },
    {
      title: 'موسیقی',
      desc: 'گوش دادن بدون محدودیت، بدون تبلیغ.',
      items: ['Spotify', 'Apple Music', 'YouTube Music', 'Tidal'],
      icon: Music,
      image: '/images/spotify.jpg',
    },
  ]

  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <SectionHeader
        eyebrow="کاوش بر اساس دسته"
        title="هر آنچه دنبالش هستید."
        subtitle="از ابزارهای هوش مصنوعی تا گیفت‌کارت‌های گیمینگ — همه در یک تجربه کاربری واحد."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {showcase.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.title}
              href="#"
              className="group relative rounded-2xl overflow-hidden border card-hover"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <div className="aspect-[5/3] relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://placehold.co/400x240/1a1a1d/45454d/png?text=' + item.title
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.85) 100%)' }}
                />
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md border"
                  style={{ background: 'rgba(10,10,11,0.6)', borderColor: 'var(--border-strong)', color: 'var(--accent)' }}
                >
                  <Icon size={18} />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </h3>
                  <ArrowUpLeft size={16} className="mt-0.5 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--text-dim)' }} />
                </div>
                <p className="text-[12px] mb-4 leading-6" style={{ color: 'var(--text-dim)' }}>
                  {item.desc}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.items.map((name) => (
                    <span
                      key={name}
                      className="text-[11px] px-2 py-1 rounded-md border"
                      style={{
                        background: 'var(--surface-2)',
                        borderColor: 'var(--border)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <SectionHeader eyebrow="چرا پی‌کارت" title="اعتماد ۵۰,۰۰۰ مشتری در سراسر ایران." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border"
        style={{ background: 'var(--border)', borderColor: 'var(--border)' }}
      >
        {trustFeatures.map((feat) => {
          const Icon = feat.icon
          return (
            <div
              key={feat.title}
              className="p-6 lg:p-7 group"
              style={{ background: 'var(--surface)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors"
                style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}
              >
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text)' }}>
                {feat.title}
              </h3>
              <p className="text-[13px] leading-7" style={{ color: 'var(--text-muted)' }}>
                {feat.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
      <div
        className="rounded-3xl border p-10 lg:p-14 relative overflow-hidden"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="ambient-glow"
          style={{ top: -100, right: -100, width: 400, height: 400, background: 'rgba(244,162,97,0.18)' }}
        />
        <div
          className="ambient-glow"
          style={{ bottom: -100, left: -50, width: 320, height: 320, background: 'rgba(110,231,183,0.06)' }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <div className="eyebrow mb-4">خبرنامه</div>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tight mb-4 leading-tight" style={{ color: 'var(--text)' }}>
              اولین کسی باشید که از تخفیف‌ها باخبر می‌شود.
            </h3>
            <p className="text-sm leading-7" style={{ color: 'var(--text-muted)' }}>
              هر هفته یک ایمیل کوتاه با بهترین پیشنهادها و معرفی محصولات جدید. می‌توانید هر زمان لغو کنید.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 h-12 px-4 text-sm outline-none rounded-[10px] border transition-colors"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
            <button type="submit" className="btn btn-accent h-12 px-7">
              <Send size={15} />
              عضویت
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t mt-8" style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="text-[13px] leading-7 mt-5 mb-6 max-w-sm" style={{ color: 'var(--text-muted)' }}>
              پی‌کارت، مارکت‌پلیس سرویس‌های دیجیتال در ایران. تحویل آنی،
              ضمانت اصالت و پشتیبانی ۲۴ ساعته.
            </p>
            <div className="flex items-center gap-2.5">
              {[Instagram, Twitter, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent)'
                    e.currentTarget.style.borderColor = 'var(--border-strong)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[13px] mb-4 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              محصولات
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] link-quiet">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[13px] mb-4 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              پشتیبانی
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] link-quiet">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[13px] mb-4 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              قوانین
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a href="#" className="text-[13px] link-quiet">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[13px] mb-4 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
              نمادها
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-lg p-3 flex flex-col items-center justify-center text-center border aspect-square"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <Shield size={20} style={{ color: 'var(--positive)' }} />
                <span className="text-[9px] mt-1.5 leading-tight" style={{ color: 'var(--text-dim)' }}>
                  اعتماد
                  <br />
                  الکترونیکی
                </span>
              </div>
              <div
                className="rounded-lg p-3 flex flex-col items-center justify-center text-center border aspect-square"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <CreditCard size={20} style={{ color: 'var(--accent)' }} />
                <span className="text-[9px] mt-1.5 leading-tight" style={{ color: 'var(--text-dim)' }}>
                  درگاه
                  <br />
                  معتبر
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="pt-7 flex flex-col md:flex-row items-center justify-between gap-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-[12px]" style={{ color: 'var(--text-faint)' }}>
            © ۱۴۰۴ پی‌کارت — تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-5 text-[12px]" style={{ color: 'var(--text-faint)' }}>
            <a href="#" className="link-quiet">حریم خصوصی</a>
            <a href="#" className="link-quiet">شرایط استفاده</a>
            <a href="#" className="link-quiet">کوکی‌ها</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ───────── main app ───────── */

function App() {
  return (
    <div className="min-h-screen grain">
      <AnnouncementBar />
      <Header />
      <CategoryBar />
      <Hero />
      <QuickPurchase />
      <FeaturedSection />
      <PopularSection />
      <CategoriesShowcase />
      <TrustSection />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default App
