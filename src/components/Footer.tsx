import {
  Instagram,
  Twitter,
  Send,
  MessageCircle,
  Shield,
  CreditCard,
  RotateCcw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { categories } from '../lib/data'
import { ENAMAD_IFRAME_HTML, SOCIAL_LINKS, type SocialNetwork } from '../lib/seo'
import { AppLink } from './AppLink'

const supportLinks: { label: string; path: string }[] = [
  { label: 'سوالات متداول', path: '/faq' },
  { label: 'راهنمای خرید', path: '/guide' },
  { label: 'شرایط بازگشت وجه', path: '/refund' },
  { label: 'تماس با ما', path: '/contact' },
  { label: 'درباره ما', path: '/about' },
]

const legalLinks: { label: string; path: string }[] = [
  { label: 'قوانین و مقررات', path: '/terms' },
  { label: 'حریم خصوصی', path: '/privacy' },
]

const socialIcon: Record<SocialNetwork, LucideIcon> = {
  instagram: Instagram,
  twitter: Twitter,
  telegram: Send,
  whatsapp: MessageCircle,
}

export type FooterProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function Footer({ onNavigate }: FooterProps) {
  const visibleSocial = SOCIAL_LINKS.filter((s) => s.url.trim().length > 0)
  const enamadAvailable = ENAMAD_IFRAME_HTML.trim().length > 0

  return (
    <footer className="bg-[#0a0b0e] border-t border-[#1a1b26] mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 mb-10">
          <div className="col-span-2 md:col-span-4">
            <AppLink
              href="/"
              onNavigate={onNavigate}
              aria-label="پی‌کارت — صفحه اصلی"
              className="flex items-center gap-3 mb-4 no-underline text-inherit"
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
            </AppLink>
            <p className="text-sm text-[#6b6c78] leading-7 mb-4 max-w-sm">
              پی‌کارت، بزرگ‌ترین مارکت‌پلیس خرید گیفت کارت و اشتراک سرویس‌های بین‌المللی در ایران. تحویل آنی، ضمانت اصالت و پشتیبانی ۲۴ ساعته.
            </p>
            {visibleSocial.length > 0 && (
              <div className="flex items-center gap-3">
                {visibleSocial.map((s) => {
                  const I = socialIcon[s.network]
                  return (
                    <a
                      key={s.network}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.labelFa}
                      className="w-9 h-9 bg-[#16171f] rounded-lg flex items-center justify-center text-[#6b6c78] hover:text-[#d4a853] hover:bg-[#1e1f2a] transition-all"
                    >
                      <I size={16} />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-white mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <AppLink
                    href={'/c/' + c.slug}
                    onNavigate={onNavigate}
                    className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors text-right no-underline"
                  >
                    {c.titleFa}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-sm text-white mb-4">پشتیبانی</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.path}>
                  <AppLink
                    href={link.path}
                    onNavigate={onNavigate}
                    className="text-sm text-[#6b6c78] hover:text-[#d4a853] transition-colors text-right no-underline"
                  >
                    {link.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="font-bold text-sm text-white mb-4">ضمانت‌ها</h4>
            <ul className="space-y-2 mb-6">
              {[
                {
                  icon: Shield,
                  label: 'نماد اعتماد الکترونیکی',
                  hint: enamadAvailable ? 'enamad.ir' : 'در حال ثبت',
                  color: '#2ec4b6',
                },
                {
                  icon: CreditCard,
                  label: 'درگاه پرداخت معتبر',
                  hint: 'بانک مرکزی',
                  color: '#d4a853',
                },
                {
                  icon: RotateCcw,
                  label: 'گارانتی بازگشت وجه',
                  hint: 'تا ۷۲ ساعت',
                  color: '#9b5de5',
                },
              ].map((it) => {
                const I = it.icon
                return (
                  <li
                    key={it.label}
                    className="relative overflow-hidden bg-[#16171f] border border-[#1e1f2a] rounded-xl px-3 py-2.5 flex items-center gap-3"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -left-6 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full blur-2xl opacity-30"
                      style={{ background: it.color }}
                    />
                    <div
                      className="relative w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: `${it.color}1f`,
                        border: `1px solid ${it.color}40`,
                      }}
                    >
                      <I size={16} style={{ color: it.color }} />
                    </div>
                    <div className="relative min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{it.label}</div>
                      <div className="text-[10px] text-[#6b6c78] truncate">{it.hint}</div>
                    </div>
                  </li>
                )
              })}
            </ul>
            {enamadAvailable && (
              <div
                className="mb-4 inline-flex"
                // E-Namad provides a small `<a>...</a>` snippet whose content
                // and merchant id we can't safely express in JSX. Inserting
                // the raw HTML is the documented embed method.
                dangerouslySetInnerHTML={{ __html: ENAMAD_IFRAME_HTML }}
              />
            )}
            <h4 className="font-bold text-sm text-white mb-3">قوانین</h4>
            <ul className="space-y-2 text-xs text-[#6b6c78]">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <AppLink
                    href={link.path}
                    onNavigate={onNavigate}
                    className="hover:text-[#d4a853] transition-colors text-right no-underline"
                  >
                    {link.label}
                  </AppLink>
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
