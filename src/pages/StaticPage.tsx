import { Mail, MessageCircle, Phone, MapPin, Clock } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { seoForStaticPage } from '../lib/seoConfig'
import { Breadcrumbs } from '../components/Breadcrumbs'
import type { StaticPage } from '../lib/staticPages'

export type StaticPageViewProps = {
  page: StaticPage
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function StaticPageView({ page, onNavigate }: StaticPageViewProps) {
  useSEO(seoForStaticPage(page))

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12 text-right">
      <div className="mb-4">
        <Breadcrumbs
          items={[{ label: page.breadcrumbFa ?? page.titleFa }]}
          onNavigate={onNavigate}
        />
      </div>

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
          {page.titleFa}
        </h1>
        {page.introFa && (
          <p className="text-sm md:text-base text-[#c4c5d0] leading-8">{page.introFa}</p>
        )}
      </header>

      {page.sections?.map((section) => (
        <section key={section.heading} className="mb-7">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3">{section.heading}</h2>
          {section.body.split('\n').map((para, i) => (
            <p
              key={i}
              className="text-sm md:text-[15px] text-[#c4c5d0] leading-8 mb-2"
            >
              {para}
            </p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm md:text-[15px] text-[#c4c5d0] leading-7 list-disc pr-5 marker:text-[#d4a853]">
              {section.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </section>
      ))}

      {page.faq && page.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-4">سوالات و پاسخ‌ها</h2>
          <div className="space-y-3">
            {page.faq.map((qa, i) => (
              <details
                key={i}
                className="group bg-[#13141a] border border-[#1e1f2a] rounded-xl px-4 py-3 open:border-[#3a3b48]"
              >
                <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm md:text-[15px] font-bold text-white">
                  <span>{qa.question}</span>
                  <span className="shrink-0 text-[#6b6c78] text-lg leading-none transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#c4c5d0] leading-8">{qa.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {page.contact && (
        <section className="mb-2 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5">
          <h2 className="text-lg font-bold text-white mb-4">اطلاعات تماس</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#c4c5d0]">
            <li className="flex items-start gap-3">
              <Phone size={16} className="text-[#d4a853] mt-0.5" aria-hidden />
              <div>
                <div className="text-xs text-[#6b6c78] mb-0.5">تلفن</div>
                <a href={`tel:${page.contact.phoneTel}`} className="hover:text-[#d4a853]">
                  {page.contact.phoneFa}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="text-[#d4a853] mt-0.5" aria-hidden />
              <div>
                <div className="text-xs text-[#6b6c78] mb-0.5">ایمیل</div>
                <a href={`mailto:${page.contact.email}`} className="hover:text-[#d4a853]">
                  {page.contact.email}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-[#d4a853] mt-0.5" aria-hidden />
              <div>
                <div className="text-xs text-[#6b6c78] mb-0.5">آدرس</div>
                <span>{page.contact.address}</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="text-[#d4a853] mt-0.5" aria-hidden />
              <div>
                <div className="text-xs text-[#6b6c78] mb-0.5">ساعات پشتیبانی</div>
                <span>{page.contact.hours}</span>
              </div>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-[#1e1f2a] flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-[#8a8b96]">
              <MessageCircle size={14} className="text-[#d4a853]" aria-hidden />
              برای پاسخ سریع‌تر، تیکت پشتیبانی از پنل کاربری ارسال کنید.
            </span>
          </div>
        </section>
      )}
    </article>
  )
}
