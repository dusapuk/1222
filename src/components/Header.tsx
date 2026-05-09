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
import { iconFor } from '../lib/icons'

export type HeaderProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

function TopBar() {
  return (
    <div className="bg-[#f5f3ed] border-b border-[#e8e6e0]">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9 text-xs text-[#5b5755]">
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
          <span className="font-medium text-[#c2410c]">تخفیف ویژه نوروزی تا ۳۰٪</span>
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
      <header className="sticky top-0 z-40 bg-[#faf9f5]/95 backdrop-blur-[2px] border-b border-[#e8e6e0]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* logo */}
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 shrink-0"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#141413] text-[#faf9f5]">
                <span className="font-display text-lg leading-none">پ</span>
              </div>
              <div className="leading-tight text-right hidden sm:block">
                <span className="font-display text-xl text-[#141413] tracking-tight">پی‌کارت</span>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8e8a85] -mt-0.5">PIKART.IR</span>
              </div>
            </button>

            {/* search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-2">
              <SearchBox onNavigate={onNavigate} />
            </div>

            {/* actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onNavigate('/categories')}
                className="hidden lg:flex items-center gap-2 text-sm text-[#141413] transition-colors hover:text-[#c2410c] px-3 h-10"
              >
                دسته‌بندی‌ها
              </button>
              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#f5f3ed]"
                aria-label="سبد خرید"
              >
                <ShoppingCart size={18} className="text-[#141413]" />
              </button>
              <button
                type="button"
                className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#141413] px-4 h-10 text-sm font-medium text-[#faf9f5] transition-colors hover:bg-[#000000]"
              >
                <User size={15} />
                ورود
              </button>
              <button
                type="button"
                className="md:hidden flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f5f3ed]"
                onClick={() => setMobileMenu(!mobileMenu)}
                aria-label="منو"
              >
                {mobileMenu ? (
                  <X size={20} className="text-[#141413]" />
                ) : (
                  <Menu size={20} className="text-[#141413]" />
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
        <div className="hidden md:block border-t border-[#e8e6e0]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              {categories.slice(0, 9).map((c) => {
                const Icon = iconFor(c.icon)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onNavigate('/c/' + c.slug)}
                    className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#5b5755] transition-colors hover:bg-[#f5f3ed] hover:text-[#141413] whitespace-nowrap shrink-0"
                  >
                    <Icon size={14} className="text-[#5b5755]" />
                    {c.titleFa}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => onNavigate('/categories')}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-[#c2410c] transition-colors hover:bg-[#fef2e9] whitespace-nowrap shrink-0"
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
        <div className="md:hidden fixed inset-0 z-50 top-[105px] bg-[#faf9f5] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg text-[#141413]">منو</h3>
              <button
                type="button"
                onClick={() => setMobileMenu(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b5755] hover:bg-[#f5f3ed]"
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
              className="w-full text-right px-3 py-3 rounded-xl text-sm text-[#141413] hover:bg-[#f5f3ed]"
            >
              صفحه اصلی
            </button>
            <button
              type="button"
              onClick={() => {
                onNavigate('/categories')
                setMobileMenu(false)
              }}
              className="w-full text-right px-3 py-3 rounded-xl text-sm text-[#141413] hover:bg-[#f5f3ed]"
            >
              همه دسته‌بندی‌ها
            </button>
            <button
              type="button"
              onClick={() => setAllCatsOpen((s) => !s)}
              className="w-full flex items-center justify-between text-right px-3 py-3 rounded-xl text-sm text-[#141413] hover:bg-[#f5f3ed]"
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
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onNavigate('/c/' + c.slug)
                        setMobileMenu(false)
                      }}
                      className="flex items-center gap-2 rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] hover:ring-[#dad7d0] p-3 text-right transition-shadow"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
                        <Icon size={13} className="text-[#5b5755]" />
                      </span>
                      <span className="text-xs text-[#141413] truncate">{c.titleFa}</span>
                    </button>
                  )
                })}
              </div>
            )}
            <button
              type="button"
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#141413] px-4 text-sm font-medium text-[#faf9f5]"
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
