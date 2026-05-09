import { useEffect, useState } from 'react'
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { SearchBox } from './SearchBox'
import { categories } from '../lib/data'
import { iconFor, colorForCategory } from '../lib/icons'

export type HeaderProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

function TopBar() {
  return (
    <div className="bg-[#101118] border-b border-[#1e1f2a]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 text-xs text-[#8a8b96]">
        <div className="flex items-center gap-5">
          <span className="hidden sm:flex items-center gap-1.5">
            <Phone size={12} />
            ۰۲۱-۹۱۰۰۹۲۰۰
          </span>
          <span className="hidden md:flex items-center gap-1.5">
            <Mail size={12} />
            info@pikart.ir
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-1.5">
            <MapPin size={12} />
            ارسال به سراسر ایران
          </span>
          <span className="text-[#d4a853] font-medium">🔥 تخفیف ویژه نوروزی تا ۳۰٪</span>
        </div>
      </div>
    </div>
  )
}

export function Header({ onNavigate }: HeaderProps) {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [allCatsOpen, setAllCatsOpen] = useState(false)

  // close menus when navigating
  useEffect(() => {
    const close = () => {
      setMobileMenu(false)
      setAllCatsOpen(false)
    }
    window.addEventListener('hashchange', close)
    return () => window.removeEventListener('hashchange', close)
  }, [])

  return (
    <>
      <TopBar />
      <header className="bg-[#0e0f15] sticky top-0 z-40 border-b border-[#1a1b26]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* logo */}
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 shrink-0"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg"
                style={{ background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)' }}
              >
                <span className="text-[#0b0c10]">پ</span>
              </div>
              <div className="leading-tight text-right hidden sm:block">
                <span className="font-extrabold text-lg text-white tracking-tight">پی‌کارت</span>
                <span className="block text-[10px] text-[#6b6c78] -mt-0.5">PIKART.IR</span>
              </div>
            </button>

            {/* search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2">
              <SearchBox onNavigate={onNavigate} />
            </div>

            {/* actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/categories')}
                className="hidden lg:flex items-center gap-2 text-sm text-[#c4c5d0] hover:text-[#d4a853] transition-colors px-3 h-10"
              >
                دسته‌بندی‌ها
              </button>
              <button
                type="button"
                className="relative p-2.5 rounded-lg hover:bg-[#16171f] transition-colors group"
                aria-label="سبد خرید"
              >
                <ShoppingCart
                  size={20}
                  className="text-[#8a8b96] group-hover:text-white transition-colors"
                />
              </button>
              <button
                type="button"
                className="hidden sm:flex items-center gap-2 bg-[#16171f] border border-[#252630] rounded-xl h-10 px-4 text-sm text-[#c4c5d0] hover:border-[#d4a853] hover:text-white transition-all"
              >
                <User size={16} />
                ورود
              </button>
              <button
                type="button"
                className="md:hidden p-2.5 rounded-lg hover:bg-[#16171f]"
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label="منو"
              >
                {mobileMenu ? (
                  <X size={20} className="text-white" />
                ) : (
                  <Menu size={20} className="text-[#8a8b96]" />
                )}
              </button>
            </div>
          </div>

          {/* mobile search */}
          <div className="md:hidden pb-3">
            <SearchBox onNavigate={onNavigate} />
          </div>
        </div>

        {/* category bar (desktop) */}
        <div className="hidden md:block border-t border-[#1a1b26] bg-[#0e0f15]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              {categories.slice(0, 9).map((c) => {
                const Icon = iconFor(c.icon)
                const color = colorForCategory(c.slug)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onNavigate('/c/' + c.slug)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#9a9baa] hover:text-white hover:bg-[#16171f] transition-all whitespace-nowrap shrink-0"
                  >
                    <Icon size={15} style={{ color }} />
                    {c.titleFa}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => onNavigate('/categories')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#d4a853] hover:bg-[#1a1716] transition-all whitespace-nowrap shrink-0 font-medium"
              >
                همه دسته‌ها
                <ChevronDown size={13} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      {mobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 top-[105px] bg-[#0b0c10] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white">منو</h3>
              <button
                type="button"
                onClick={() => setMobileMenu(false)}
                className="p-2 rounded-lg text-[#8a8b96] hover:bg-[#16171f]"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onNavigate('/')
                setMobileMenu(false)
              }}
              className="w-full text-right px-3 py-3 rounded-lg text-sm text-white hover:bg-[#16171f]"
            >
              صفحه اصلی
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('/categories')
                setMobileMenu(false)
              }}
              className="w-full text-right px-3 py-3 rounded-lg text-sm text-white hover:bg-[#16171f]"
            >
              همه دسته‌بندی‌ها
            </button>
            <button
              type="button"
              onClick={() => setAllCatsOpen((s) => !s)}
              className="w-full flex items-center justify-between text-right px-3 py-3 rounded-lg text-sm text-white hover:bg-[#16171f]"
            >
              <span>دسته‌بندی‌ها</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${allCatsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {allCatsOpen && (
              <div className="grid grid-cols-2 gap-2 mt-2 mb-3 px-1">
                {categories.map((c) => {
                  const Icon = iconFor(c.icon)
                  const color = colorForCategory(c.slug)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onNavigate('/c/' + c.slug)
                        setMobileMenu(false)
                      }}
                      className="flex items-center gap-2 bg-[#13141a] border border-[#1e1f2a] hover:border-[#d4a853]/40 rounded-xl p-3 text-right transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${color}15`, border: `1px solid ${color}33` }}
                      >
                        <Icon size={14} style={{ color }} />
                      </div>
                      <span className="text-xs text-white truncate">{c.titleFa}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <button
              type="button"
              className="w-full flex items-center gap-2 bg-[#16171f] border border-[#252630] rounded-xl h-11 px-4 text-sm text-white mt-3"
            >
              <User size={16} />
              ورود / ثبت‌نام
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
