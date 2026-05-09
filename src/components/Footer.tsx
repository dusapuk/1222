import {
  Instagram,
  Twitter,
  Send,
  MessageCircle,
  Shield,
  CreditCard,
} from 'lucide-react'
import { categories } from '../lib/data'

const footerLinks = {
  support: ['سوالات متداول', 'راهنمای خرید', 'شرایط بازگشت وجه', 'تماس با ما', 'درباره ما'],
  legal: ['قوانین و مقررات', 'حریم خصوصی', 'شرایط استفاده'],
}

export type FooterProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0a0b0e] border-t border-[#1a1b26] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-10">
          <div className="col-span-2 md:col-span-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 mb-4"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg"
                style={{ background: 'linear-gradient(135deg, #d4a853 0%, #b8860b 100%)' }}
              >
                <span className="text-[#0b0c10]">پ</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-lg text-white">پی‌کارت</span>
                <span className="block text-[10px] text-[#6b6c78] -mt-0.5">PIKART.IR</span>
              </div>
            </button>
            <p className="text-sm text-[#6b6c78] leading-7 mb-4 max-w-sm">
              پی‌کارت، بزرگ‌ترین مارکت‌پلیس خرید گیفت کارت و اشتراک سرویس‌های بین‌المللی در ایران. تحویل آنی، ضمانت اصالت و پشتیبانی ۲۴ ساعته.
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Twitter, Send, MessageCircle].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-[#16171f] rounded-lg flex items-center justify-center text-[#6b6c78] hover:text-[#d4a853] hover:bg-[#1e1f2a] transition-all"
                >
                  <I size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-white mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('/c/' + c.slug)}
                    className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors text-right"
                  >
                    {c.titleFa}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-white mb-4">پشتیبانی</h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-white mb-4">نماد اعتماد</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-[#16171f] rounded-xl p-3 flex items-center justify-center aspect-square">
                <div className="text-center">
                  <Shield size={22} className="mx-auto text-[#2ec4b6] mb-1" />
                  <span className="text-[8px] text-[#6b6c78] block">نماد اعتماد</span>
                  <span className="text-[8px] text-[#6b6c78]">الکترونیکی</span>
                </div>
              </div>
              <div className="bg-[#16171f] rounded-xl p-3 flex items-center justify-center aspect-square">
                <div className="text-center">
                  <CreditCard size={22} className="mx-auto text-[#d4a853] mb-1" />
                  <span className="text-[8px] text-[#6b6c78] block">درگاه پرداخت</span>
                  <span className="text-[8px] text-[#6b6c78]">معتبر</span>
                </div>
              </div>
            </div>
            <h4 className="font-bold text-sm text-white mb-3">قوانین</h4>
            <ul className="space-y-2 text-xs text-[#6b6c78]">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-[#d4a853] transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a1b26] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#505162]">© ۱۴۰۴ پی‌کارت. تمامی حقوق محفوظ است.</p>
          <span className="text-xs text-[#505162]">طراحی و توسعه با ❤️ در ایران</span>
        </div>
      </div>
    </footer>
  )
}
