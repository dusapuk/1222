import {
  Instagram,
  Twitter,
  Send,
  MessageCircle,
  Shield,
  CreditCard,
  RotateCcw,
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
    <footer className="mt-16 border-t border-[#e8e6e0] bg-[#f5f3ed]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-10">
          <div className="col-span-2 md:col-span-4">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#141413] text-[#faf9f5]">
                <span className="font-display text-lg leading-none">پ</span>
              </div>
              <div className="text-right">
                <span className="font-display text-xl text-[#141413]">پی‌کارت</span>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8e8a85] -mt-0.5">PIKART.IR</span>
              </div>
            </button>
            <p className="text-sm leading-7 text-[#5b5755] mb-5 max-w-sm">
              پی‌کارت، بزرگ‌ترین مارکت‌پلیس خرید گیفت کارت و اشتراک سرویس‌های بین‌المللی در ایران. تحویل آنی، ضمانت اصالت و پشتیبانی ۲۴ ساعته.
            </p>
            <div className="flex items-center gap-2">
              {[Instagram, Twitter, Send, MessageCircle].map((I, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffffff] text-[#5b5755] ring-1 ring-[#e8e6e0] transition-colors hover:text-[#141413] hover:ring-[#dad7d0]"
                >
                  <I size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#8e8a85]">
              دسته‌بندی‌ها
            </h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate('/c/' + c.slug)}
                    className="text-right text-sm text-[#141413] transition-colors hover:text-[#c2410c]"
                  >
                    {c.titleFa}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#8e8a85]">
              پشتیبانی
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-[#141413] transition-colors hover:text-[#c2410c]">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-4 text-[11px] uppercase tracking-[0.16em] text-[#8e8a85]">
              ضمانت‌ها
            </h4>
            <ul className="space-y-2 mb-6">
              {[
                { icon: Shield, label: 'نماد اعتماد الکترونیکی', hint: 'enamad.ir' },
                { icon: CreditCard, label: 'درگاه پرداخت معتبر', hint: 'بانک مرکزی' },
                { icon: RotateCcw, label: 'گارانتی بازگشت وجه', hint: 'تا ۷۲ ساعت' },
              ].map((it) => {
                const I = it.icon
                return (
                  <li
                    key={it.label}
                    className="flex items-center gap-3 rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] px-3 py-2.5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
                      <I size={14} className="text-[#5b5755]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-[#141413]">
                        {it.label}
                      </div>
                      <div className="truncate text-[10px] text-[#5b5755]">{it.hint}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
            <h4 className="mb-3 text-[11px] uppercase tracking-[0.16em] text-[#8e8a85]">
              قوانین
            </h4>
            <ul className="space-y-2 text-xs text-[#5b5755]">
              {footerLinks.legal.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-[#c2410c]">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e8e6e0] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#8e8a85]">© ۱۴۰۴ پی‌کارت. تمامی حقوق محفوظ است.</p>
          <span className="text-xs text-[#8e8a85]">طراحی و توسعه با ❤️ در ایران</span>
        </div>
      </div>
    </footer>
  )
}
