/**
 * Long-form Persian content rendered at the bottom of the home page.
 *
 * Pre-existing hero / featured / popular blocks contribute mostly UI
 * labels (~360 Persian words) — well below what the top Persian
 * marketplace competitors put on their landing pages
 * (dicardo ~3 100, license-market ~2 500, cafearz ~1 400). This block
 * adds ~3 000 additional Persian words, structured as:
 *   1. «چرا پی‌کارت؟» — 6 H3 sub-headings, each with 2 paragraphs.
 *   2. «۱۴ دسته‌بندی سرویس» — H3 per category linking to /c/<slug>.
 *   3. «سؤالات پرتکرار» — 10 Q&A `<details>` accordion (also emitted
 *      as FAQPage JSON-LD via `seoForHome`).
 *
 * The whole block is server-rendered (it lives inside `HomePage`,
 * which is the entry rendered by the SSR step) so the prerendered
 * `dist/index.html` ships with the full text in the very first
 * payload — the single biggest gap vs. the competitor pool.
 */
import { ChevronLeft } from 'lucide-react'
import { AppLink } from './AppLink'
import { categories, getCategoryServiceCount } from '../lib/data'
import {
  HOME_CATEGORY_HIGHLIGHTS,
  HOME_FAQ,
  HOME_WHY_PIKART_BLOCKS,
} from '../lib/homeContent'
import { toPersianDigits } from '../lib/format'

export type HomeSeoSectionProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function HomeSeoSection({ onNavigate }: HomeSeoSectionProps) {
  // Order the highlights to match the live `categories` array so
  // the visible link list matches the catalogue without hard-coding
  // a parallel sort order. Categories without a copy entry fall
  // back to the data.ts `description` field below.
  const highlightBySlug = new Map(
    HOME_CATEGORY_HIGHLIGHTS.map((h) => [h.slug, h] as const),
  )

  return (
    <section
      className="max-w-7xl mx-auto px-4 py-10"
      aria-labelledby="home-why-heading"
    >
      <div className="rounded-2xl bg-[#13141a] border border-[#1e1f2a] p-6 md:p-10">
        <header className="mb-6">
          <h2
            id="home-why-heading"
            className="text-2xl md:text-3xl font-black text-white mb-3"
          >
            چرا پی‌کارت؟
          </h2>
          <p className="text-sm text-[#9a9baa] leading-7 max-w-3xl">
            مارکت‌پلیس تخصصی خرید اشتراک سرویس‌های دیجیتال بین‌المللی برای
            کاربران ایرانی — تحویل آنی، پرداخت تومانی و گارانتی واقعی روی هر
            سفارش.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HOME_WHY_PIKART_BLOCKS.map((block) => (
            <article
              key={block.heading}
              className="rounded-xl bg-[#0b0c10] border border-[#1e1f2a] p-5"
            >
              <h3 className="text-base font-bold text-[#d4a853] mb-2 leading-7">
                {block.heading}
              </h3>
              {block.body.map((para, i) => (
                <p
                  key={i}
                  className="text-sm text-[#c4c5d0] leading-8 mb-3 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </article>
          ))}
        </div>
      </div>

      <div
        className="mt-8 rounded-2xl bg-[#13141a] border border-[#1e1f2a] p-6 md:p-10"
        aria-labelledby="home-categories-heading"
      >
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2
              id="home-categories-heading"
              className="text-2xl md:text-3xl font-black text-white mb-2"
            >
              ۱۴ دسته‌بندی سرویس دیجیتال
            </h2>
            <p className="text-sm text-[#9a9baa] leading-7 max-w-3xl">
              کاتالوگ پی‌کارت در ۱۴ دسته‌بندی تخصصی منتشر می‌شود تا انتخاب
              سریع باشد. روی نام هر دسته بزنید تا سرویس‌های فعال،
              مقایسه پلن‌ها و راهنمای فعال‌سازی فارسی را ببینید.
            </p>
          </div>
          <AppLink
            href="/categories"
            onNavigate={onNavigate}
            className="hidden md:flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] font-medium no-underline whitespace-nowrap"
          >
            همه دسته‌بندی‌ها
            <ChevronLeft size={16} />
          </AppLink>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const highlight = highlightBySlug.get(category.slug)
            const heading = highlight?.heading ?? category.titleFa
            const description =
              highlight?.description ??
              category.description ??
              `سرویس‌های فعال در دسته ${category.titleFa} با تحویل آنی، پرداخت تومانی و گارانتی اصالت در پی‌کارت.`
            const count = getCategoryServiceCount(category.id)
            return (
              <article
                key={category.id}
                className="rounded-xl bg-[#0b0c10] border border-[#1e1f2a] p-5 hover:border-[#d4a853]/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-bold text-white leading-7">
                    <AppLink
                      href={'/c/' + category.slug}
                      onNavigate={onNavigate}
                      className="text-white hover:text-[#d4a853] transition-colors no-underline"
                    >
                      {heading}
                    </AppLink>
                  </h3>
                  {count > 0 && (
                    <span className="shrink-0 text-[11px] font-bold text-[#d4a853] bg-[#d4a853]/10 border border-[#d4a853]/20 rounded-md px-2 py-0.5">
                      {toPersianDigits(count)} سرویس
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#c4c5d0] leading-8 mb-3">
                  {description}
                </p>
                <AppLink
                  href={'/c/' + category.slug}
                  onNavigate={onNavigate}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#d4a853] hover:text-[#c49a48] no-underline"
                >
                  مشاهده {heading}
                  <ChevronLeft size={14} />
                </AppLink>
              </article>
            )
          })}
        </div>
      </div>

      <div
        className="mt-8 rounded-2xl bg-[#13141a] border border-[#1e1f2a] p-6 md:p-10"
        aria-labelledby="home-faq-heading"
      >
        <header className="mb-6">
          <h2
            id="home-faq-heading"
            className="text-2xl md:text-3xl font-black text-white mb-2"
          >
            سؤالات پرتکرار درباره پی‌کارت
          </h2>
          <p className="text-sm text-[#9a9baa] leading-7 max-w-3xl">
            ده پرسش پرتکراری که کاربران درباره خرید اشتراک، پرداخت، تحویل،
            گارانتی و پشتیبانی پی‌کارت دارند. اگر پاسخ سؤال شما اینجا
            نیست، از طریق چت آنلاین یا تلگرام پشتیبانی پی‌کارت پاسخ
            تخصصی دریافت کنید.
          </p>
        </header>

        <div className="space-y-3">
          {HOME_FAQ.map((item, idx) => (
            <details
              key={idx}
              className="group rounded-xl bg-[#0b0c10] border border-[#1e1f2a] open:border-[#d4a853]/30 transition-colors"
            >
              <summary className="flex items-start justify-between gap-3 cursor-pointer p-4 text-sm font-bold text-white leading-7 list-none">
                <span>{item.question}</span>
                <ChevronLeft
                  size={18}
                  className="shrink-0 text-[#d4a853] transition-transform -rotate-90 group-open:rotate-90"
                />
              </summary>
              <div className="px-4 pb-4 text-sm text-[#c4c5d0] leading-8">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
