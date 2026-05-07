import { useState } from 'react'
import './App.css'
import {
  Search,
  ShoppingCart,
  User,
  ChevronLeft,
  ChevronDown,
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
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Send,
  Tag,
  TrendingUp,
  Award,
  Heart,
  Eye,
  Flame,
  Percent,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react'

/* ───────── data ───────── */

const categories = [
  { name: 'بازی', icon: Gamepad2, color: '#e63946' },
  { name: 'موسیقی', icon: Music, color: '#2ec4b6' },
  { name: 'استریم', icon: Tv, color: '#9b5de5' },
  { name: 'هوش مصنوعی', icon: Brain, color: '#00b4d8' },
  { name: 'گیفت کارت', icon: Gift, color: '#f77f00' },
  { name: 'اپلیکیشن', icon: Smartphone, color: '#06d6a0' },
  { name: 'VPN و امنیت', icon: Shield, color: '#118ab2' },
  { name: 'آموزشی', icon: Globe, color: '#ef476f' },
]

const featuredProducts = [
  {
    id: 1,
    title: 'اشتراک ChatGPT Plus',
    subtitle: 'یک ماهه',
    price: '۸۹۰,۰۰۰',
    oldPrice: '۱,۱۰۰,۰۰۰',
    discount: 19,
    image: '/images/tech1.jpg',
    badge: 'پرفروش',
    badgeColor: '#e63946',
  },
  {
    id: 2,
    title: 'اشتراک Spotify Premium',
    subtitle: 'سه ماهه',
    price: '۴۵۰,۰۰۰',
    oldPrice: '۵۵۰,۰۰۰',
    discount: 18,
    image: '/images/spotify.jpg',
    badge: 'ویژه',
    badgeColor: '#2ec4b6',
  },
  {
    id: 3,
    title: 'گیفت کارت PlayStation',
    subtitle: '۵۰ دلاری',
    price: '۳,۲۵۰,۰۰۰',
    oldPrice: '۳,۵۰۰,۰۰۰',
    discount: 7,
    image: '/images/playstation.jpg',
    badge: '',
    badgeColor: '',
  },
  {
    id: 4,
    title: 'گیفت کارت Steam',
    subtitle: '۲۰ دلاری',
    price: '۱,۳۵۰,۰۰۰',
    oldPrice: '۱,۴۰۰,۰۰۰',
    discount: 4,
    image: '/images/steam.jpg',
    badge: '',
    badgeColor: '',
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
  { icon: Zap, title: 'تحویل آنی', desc: 'دریافت کد در کمتر از ۳۰ ثانیه' },
  { icon: Shield, title: 'ضمانت اصالت', desc: 'تمامی کدها اورجینال و معتبر' },
  { icon: Headphones, title: 'پشتیبانی ۲۴/۷', desc: 'پاسخگویی در هر ساعت از شبانه‌روز' },
  { icon: CreditCard, title: 'پرداخت امن', desc: 'درگاه بانکی معتبر و رمزنگاری شده' },
]

const footerLinks = {
  services: ['گیفت کارت استیم', 'اشتراک اسپاتیفای', 'گیفت کارت پلی‌استیشن', 'اشتراک نتفلیکس', 'گیفت کارت اپل'],
  support: ['سوالات متداول', 'راهنمای خرید', 'شرایط بازگشت وجه', 'تماس با ما', 'درباره ما'],
  legal: ['قوانین و مقررات', 'حریم خصوصی', 'شرایط استفاده'],
}

/* ───────── components ───────── */

function TopBar() {
  return (
    <div className="bg-[#101118] border-b border-[#1e1f2a]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 text-xs text-[#8a8b96]">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <Phone size={12} />
            ۰۲۱-۹۱۰۰۹۲۰۰
          </span>
          <span className="flex items-center gap-1.5">
            <Mail size={12} />
            info@pikart.ir
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} />
            ارسال به سراسر ایران
          </span>
          <span className="text-[#d4a853] font-medium">🔥 تخفیف ویژه نوروزی تا ۳۰٪</span>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [mobileMenu, setMobileMenu] = useState(false)
  return (
    <header className="bg-[#0e0f15] sticky top-0 z-50 border-b border-[#1a1b26]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg" style={{ background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)' }}>
              <span className="text-[#0b0c10]">پ</span>
            </div>
            <div className="leading-tight">
              <span className="font-extrabold text-lg text-white tracking-tight">پی‌کارت</span>
              <span className="block text-[10px] text-[#6b6c78] -mt-0.5">PIKART.IR</span>
            </div>
          </div>

          {/* search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="جستجوی سرویس، گیفت کارت، اشتراک..."
                className="w-full bg-[#16171f] border border-[#252630] rounded-xl h-11 pr-11 pl-4 text-sm text-[#e8e8ed] placeholder-[#505162] outline-none focus:border-[#d4a853] transition-colors"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#505162]" size={18} />
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 rounded-lg hover:bg-[#16171f] transition-colors group">
              <ShoppingCart size={20} className="text-[#8a8b96] group-hover:text-white transition-colors" />
              <span className="absolute -top-0.5 -left-0.5 w-4.5 h-4.5 bg-[#e63946] rounded-full text-[10px] font-bold flex items-center justify-center text-white">۳</span>
            </button>
            <button className="hidden sm:flex items-center gap-2 bg-[#16171f] border border-[#252630] rounded-xl h-10 px-4 text-sm text-[#c4c5d0] hover:border-[#d4a853] hover:text-white transition-all">
              <User size={16} />
              ورود / ثبت‌نام
            </button>
            <button className="md:hidden p-2.5 rounded-lg hover:bg-[#16171f]" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X size={20} className="text-white" /> : <Menu size={20} className="text-[#8a8b96]" />}
            </button>
          </div>
        </div>

        {/* mobile search */}
        {mobileMenu && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو..."
                className="w-full bg-[#16171f] border border-[#252630] rounded-xl h-11 pr-11 pl-4 text-sm text-[#e8e8ed] placeholder-[#505162] outline-none"
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#505162]" size={18} />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function CategoryBar() {
  return (
    <div className="bg-[#0e0f15] border-b border-[#1a1b26]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.name}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#9a9baa] hover:text-white hover:bg-[#16171f] transition-all whitespace-nowrap shrink-0"
              >
                <Icon size={16} style={{ color: cat.color }} />
                {cat.name}
              </button>
            )
          })}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-[#d4a853] hover:bg-[#1a1716] transition-all whitespace-nowrap shrink-0 font-medium">
            همه دسته‌ها
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function HeroBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* main banner */}
        <div className="lg:col-span-7 relative rounded-2xl overflow-hidden group cursor-pointer" style={{ minHeight: 320 }}>
          <img src="/images/banner1.jpg" alt="banner" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500 group-hover:scale-105 transition-transform" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(11,12,16,0.95) 0%, rgba(11,12,16,0.6) 50%, rgba(212,168,83,0.15) 100%)' }} />
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
                خرید آنی گیفت کارت، اشتراک و لایسنس سرویس‌های بین‌المللی با تحویل فوری و ضمانت بازگشت وجه
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button className="bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                مشاهده محصولات
              </button>
              <button className="border border-[#2a2b35] hover:border-[#d4a853] text-[#c4c5d0] hover:text-white px-6 py-3 rounded-xl text-sm transition-all">
                راهنمای خرید
              </button>
            </div>
          </div>
        </div>

        {/* side banners */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3">
          <div className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ minHeight: 155 }}>
            <img src="/images/gaming2.jpg" alt="gaming" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
            <div className="relative p-5 flex flex-col justify-end h-full">
              <span className="text-[10px] text-[#2ec4b6] font-bold mb-1">تخفیف ۳۰٪</span>
              <span className="text-sm font-bold text-white">بازی‌های PC</span>
              <span className="text-xs text-[#8a8b96] mt-0.5">استیم و اپیک گیمز</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden cursor-pointer group" style={{ minHeight: 155 }}>
            <img src="/images/spotify.jpg" alt="music" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-65 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/60 to-transparent" />
            <div className="relative p-5 flex flex-col justify-end h-full">
              <span className="text-[10px] text-[#d4a853] font-bold mb-1">جدید</span>
              <span className="text-sm font-bold text-white">اشتراک موسیقی</span>
              <span className="text-xs text-[#8a8b96] mt-0.5">اسپاتیفای و اپل‌میوزیک</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden cursor-pointer group col-span-2" style={{ minHeight: 155 }}>
            <img src="/images/netflix.jpg" alt="streaming" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0b0c10] via-[#0b0c10]/70 to-transparent" />
            <div className="relative p-5 flex items-center justify-between h-full">
              <div>
                <span className="text-[10px] text-[#ef476f] font-bold mb-1 block">محبوب‌ترین</span>
                <span className="text-lg font-bold text-white">سرویس‌های استریم</span>
                <span className="text-xs text-[#8a8b96] block mt-1">نتفلیکس، دیزنی‌پلاس، HBO و...</span>
              </div>
              <ChevronLeft size={24} className="text-[#505162]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function QuickPurchase() {
  const [selected, setSelected] = useState(0)
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">خرید سریع</h3>
            <span className="flex items-center gap-1 text-xs text-[#2ec4b6]">
              <Shield size={12} />
              تحویل آنی
            </span>
            <span className="flex items-center gap-1 text-xs text-[#d4a853]">
              <Award size={12} />
              اورجینال
            </span>
          </div>
        </div>

        {/* service icons row */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {quickServices.map((srv, i) => (
            <button
              key={srv.name}
              onClick={() => setSelected(i)}
              className={`flex flex-col items-center gap-2 shrink-0 p-3 rounded-xl transition-all ${
                selected === i
                  ? 'bg-[#1e1f2a] border border-[#d4a853]/30'
                  : 'hover:bg-[#1a1b22] border border-transparent'
              }`}
              style={{ minWidth: 80 }}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden">
                <img src={srv.img} alt={srv.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/1a1b26/505162/png?text=' + srv.name[0] }} />
              </div>
              <span className={`text-xs ${selected === i ? 'text-[#d4a853] font-medium' : 'text-[#8a8b96]'}`}>
                {srv.name}
              </span>
            </button>
          ))}
        </div>

        {/* purchase form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-4">
            <label className="text-xs text-[#6b6c78] mb-1.5 block">نام کاربری / ایمیل</label>
            <input
              type="text"
              placeholder={`نام کاربری ${quickServices[selected].name}`}
              className="w-full bg-[#0e0f15] border border-[#252630] rounded-xl h-11 px-4 text-sm text-[#e8e8ed] placeholder-[#3a3b48] outline-none focus:border-[#d4a853] transition-colors"
            />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs text-[#6b6c78] mb-1.5 block">مبلغ</label>
            <div className="flex">
              <input
                type="text"
                defaultValue="۱۰۰"
                className="w-full bg-[#0e0f15] border border-[#252630] border-l-0 rounded-r-xl h-11 px-4 text-sm text-[#e8e8ed] outline-none focus:border-[#d4a853] transition-colors"
              />
              <div className="flex items-center gap-1.5 bg-[#0e0f15] border border-[#252630] rounded-l-xl h-11 px-3 text-xs text-[#8a8b96] whitespace-nowrap">
                🇮🇷 تومان
                <ChevronDown size={12} />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-[#6b6c78] mb-1.5 block">کد تخفیف</label>
            <div className="relative">
              <input
                type="text"
                placeholder="کد تخفیف"
                className="w-full bg-[#0e0f15] border border-[#252630] rounded-xl h-11 pr-9 pl-4 text-sm text-[#e8e8ed] placeholder-[#3a3b48] outline-none focus:border-[#d4a853] transition-colors"
              />
              <Tag className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3a3b48]" size={14} />
            </div>
          </div>
          <div className="md:col-span-3">
            <button className="w-full bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold h-11 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              پرداخت ۶,۵۰۰,۰۰۰ ت
              <ArrowLeft size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, featured = false }: { product: typeof popularProducts[0] & { badge?: string; badgeColor?: string }; featured?: boolean }) {
  return (
    <div className={`group bg-[#13141a] border border-[#1e1f2a] rounded-2xl overflow-hidden hover:border-[#2a2b3a] transition-all cursor-pointer ${featured ? '' : ''}`}>
      {/* image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1b26/505162/png' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10]/80 via-transparent to-transparent" />

        {/* discount badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#e63946] text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
            <Percent size={10} />
            {product.discount}٪
          </div>
        )}

        {/* special badge */}
        {'badge' in product && product.badge && (
          <div className="absolute top-3 right-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ background: product.badgeColor }}>
            {product.badge}
          </div>
        )}

        {/* quick actions */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 bg-[#0b0c10]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-[#8a8b96] hover:text-[#e63946] transition-colors">
            <Heart size={14} />
          </button>
          <button className="w-8 h-8 bg-[#0b0c10]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-[#8a8b96] hover:text-white transition-colors">
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* info */}
      <div className="p-4">
        <h4 className="font-bold text-sm text-white mb-1 group-hover:text-[#d4a853] transition-colors">{product.title}</h4>
        <p className="text-xs text-[#6b6c78] mb-3">{product.subtitle}</p>

        {'rating' in product && (
          <div className="flex items-center gap-3 mb-3 text-xs text-[#6b6c78]">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-[#d4a853] fill-[#d4a853]" />
              {product.rating}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {product.sales?.toLocaleString()} فروش
            </span>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            {product.oldPrice && (
              <span className="text-xs text-[#505162] line-through block mb-0.5">{product.oldPrice}</span>
            )}
            <span className="font-black text-base text-white">{product.price}</span>
            <span className="text-[10px] text-[#6b6c78] mr-1">تومان</span>
          </div>
          <button className="bg-[#1e1f2a] hover:bg-[#d4a853] text-[#8a8b96] hover:text-[#0b0c10] w-9 h-9 rounded-xl flex items-center justify-center transition-all">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function FeaturedSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#d4a853] rounded-full" />
          <h2 className="text-xl font-black text-white">پیشنهادهای ویژه</h2>
          <span className="flex items-center gap-1 text-xs text-[#e63946] bg-[#e63946]/10 px-2.5 py-1 rounded-md font-medium">
            <Flame size={12} />
            داغ
          </span>
        </div>
        <button className="flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] transition-colors font-medium">
          مشاهده همه
          <ChevronLeft size={16} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {featuredProducts.map((p) => (
          <ProductCard key={p.id} product={{ ...p, rating: 4.9, sales: 1000 }} featured />
        ))}
      </div>
    </section>
  )
}

function PopularSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#2ec4b6] rounded-full" />
          <h2 className="text-xl font-black text-white">محبوب‌ترین‌ها</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-xs bg-[#1e1f2a] text-[#d4a853] px-3 py-1.5 rounded-lg font-medium border border-[#d4a853]/20">همه</button>
          <button className="text-xs text-[#6b6c78] px-3 py-1.5 rounded-lg hover:bg-[#16171f] transition-colors">بازی</button>
          <button className="text-xs text-[#6b6c78] px-3 py-1.5 rounded-lg hover:bg-[#16171f] transition-colors">استریم</button>
          <button className="text-xs text-[#6b6c78] px-3 py-1.5 rounded-lg hover:bg-[#16171f] transition-colors">گیفت کارت</button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {popularProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <button className="flex items-center gap-2 border border-[#2a2b35] hover:border-[#d4a853] text-[#8a8b96] hover:text-white px-8 py-3 rounded-xl text-sm transition-all">
          نمایش بیشتر
          <ChevronDown size={16} />
        </button>
      </div>
    </section>
  )
}

function CategoriesShowcase() {
  const showcaseItems = [
    {
      title: 'هوش مصنوعی',
      desc: 'اشتراک ChatGPT، Claude، Midjourney و...',
      color: '#00b4d8',
      items: ['ChatGPT Plus', 'Claude Pro', 'Midjourney', 'Gemini Advanced'],
      icon: Brain,
    },
    {
      title: 'بازی و سرگرمی',
      desc: 'گیفت کارت و اشتراک پلتفرم‌های گیمینگ',
      color: '#e63946',
      items: ['Steam', 'PlayStation', 'Xbox', 'Nintendo'],
      icon: Gamepad2,
    },
    {
      title: 'استریم و فیلم',
      desc: 'اشتراک سرویس‌های پخش آنلاین',
      color: '#9b5de5',
      items: ['Netflix', 'Disney+', 'HBO Max', 'Hulu'],
      icon: Tv,
    },
    {
      title: 'موسیقی',
      desc: 'اشتراک پلتفرم‌های موسیقی',
      color: '#2ec4b6',
      items: ['Spotify', 'Apple Music', 'YouTube Music', 'Tidal'],
      icon: Music,
    },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[#9b5de5] rounded-full" />
        <h2 className="text-xl font-black text-white">دسته‌بندی سرویس‌ها</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {showcaseItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.title}
              className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 hover:border-[#2a2b3a] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${item.color}15` }}>
                  <Icon size={20} style={{ color: item.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-[10px] text-[#6b6c78]">{item.desc}</p>
                </div>
              </div>
              <div className="space-y-2">
                {item.items.map((name) => (
                  <div key={name} className="flex items-center justify-between py-2 border-b border-[#1e1f2a] last:border-0 group/item">
                    <span className="text-xs text-[#9a9baa] group-hover/item:text-white transition-colors">{name}</span>
                    <ChevronLeft size={12} className="text-[#3a3b48] group-hover/item:text-[#d4a853] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-xl font-black text-white mb-2">چرا پی‌کارت؟</h2>
          <p className="text-sm text-[#6b6c78]">بیش از ۵۰,۰۰۰ مشتری راضی در سراسر ایران</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trustFeatures.map((feat) => {
            const Icon = feat.icon
            return (
              <div key={feat.title} className="text-center group">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1e1f2a] flex items-center justify-center mb-3 group-hover:bg-[#d4a853]/10 transition-colors">
                  <Icon size={24} className="text-[#d4a853]" />
                </div>
                <h4 className="font-bold text-sm text-white mb-1">{feat.title}</h4>
                <p className="text-xs text-[#6b6c78] leading-5">{feat.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  const stats = [
    { num: '۵۰,۰۰۰+', label: 'مشتری فعال' },
    { num: '۱,۲۰۰+', label: 'محصول و سرویس' },
    { num: '۹۹.۸٪', label: 'رضایت مشتریان' },
    { num: '< ۳۰ ثانیه', label: 'زمان تحویل' },
  ]
  return (
    <section className="max-w-7xl mx-auto px-4 py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#13141a] border border-[#1e1f2a] rounded-xl p-5 text-center">
            <div className="text-2xl font-black text-[#d4a853] mb-1">{s.num}</div>
            <div className="text-xs text-[#6b6c78]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1510 0%, #13141a 50%, #101520 100%)' }}>
        <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-5" style={{ background: '#d4a853', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: '#2ec4b6', filter: 'blur(60px)' }} />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-white mb-2">از تخفیف‌ها باخبر شوید</h3>
            <p className="text-sm text-[#6b6c78]">ایمیل خود را وارد کنید تا جدیدترین تخفیف‌ها و پیشنهادها را دریافت کنید</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="bg-[#0b0c10] border border-[#252630] rounded-xl h-11 px-4 text-sm text-[#e8e8ed] placeholder-[#3a3b48] outline-none focus:border-[#d4a853] transition-colors flex-1 md:w-64"
            />
            <button className="bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold h-11 px-6 rounded-xl text-sm transition-colors whitespace-nowrap flex items-center gap-2">
              <Send size={14} />
              عضویت
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#0a0b0e] border-t border-[#1a1b26] mt-8">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg" style={{ background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)' }}>
                <span className="text-[#0b0c10]">پ</span>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">پی‌کارت</span>
                <span className="block text-[10px] text-[#6b6c78] -mt-0.5">PIKART.IR</span>
              </div>
            </div>
            <p className="text-sm text-[#6b6c78] leading-7 mb-4 max-w-sm">
              پی‌کارت، بزرگ‌ترین مارکت‌پلیس خرید گیفت کارت و اشتراک سرویس‌های بین‌المللی در ایران. تحویل آنی، ضمانت اصالت و پشتیبانی ۲۴ ساعته.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-[#16171f] rounded-lg flex items-center justify-center text-[#6b6c78] hover:text-[#d4a853] hover:bg-[#1e1f2a] transition-all">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-[#16171f] rounded-lg flex items-center justify-center text-[#6b6c78] hover:text-[#d4a853] hover:bg-[#1e1f2a] transition-all">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-[#16171f] rounded-lg flex items-center justify-center text-[#6b6c78] hover:text-[#d4a853] hover:bg-[#1e1f2a] transition-all">
                <Send size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-[#16171f] rounded-lg flex items-center justify-center text-[#6b6c78] hover:text-[#d4a853] hover:bg-[#1e1f2a] transition-all">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* links */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-white mb-4">محصولات</h4>
            <ul className="space-y-2.5">
              {footerLinks.services.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-white mb-4">پشتیبانی</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-white mb-4">قوانین</h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* trust badges placeholder */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-white mb-4">نماد اعتماد</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#16171f] rounded-xl p-3 flex items-center justify-center aspect-square">
                <div className="text-center">
                  <Shield size={24} className="mx-auto text-[#2ec4b6] mb-1" />
                  <span className="text-[8px] text-[#6b6c78] block">نماد اعتماد</span>
                  <span className="text-[8px] text-[#6b6c78]">الکترونیکی</span>
                </div>
              </div>
              <div className="bg-[#16171f] rounded-xl p-3 flex items-center justify-center aspect-square">
                <div className="text-center">
                  <CreditCard size={24} className="mx-auto text-[#d4a853] mb-1" />
                  <span className="text-[8px] text-[#6b6c78] block">درگاه پرداخت</span>
                  <span className="text-[8px] text-[#6b6c78]">معتبر</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div className="border-t border-[#1a1b26] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#505162]">
            © ۱۴۰۴ پی‌کارت. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#505162]">
            <span>طراحی و توسعه با ❤️ در ایران</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ───────── main app ───────── */

function App() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
      <TopBar />
      <Header />
      <CategoryBar />
      <HeroBanner />
      <QuickPurchase />
      <FeaturedSection />
      <PopularSection />
      <StatsBar />
      <CategoriesShowcase />
      <TrustSection />
      <Newsletter />
      <Footer />
    </div>
  )
}

export default App
