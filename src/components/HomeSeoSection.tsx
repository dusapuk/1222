/**
 * Compact SEO copy rendered at the bottom of the home page.
 *
 * Layout (top-down):
 *   1. «پی‌کارت چیست؟» — a single ~100-word Persian paragraph that
 *      anchors the brand entity + primary commercial keyword.
 *   2. «چرا پی‌کارت؟» — 6 USP tiles (icon + 2-word label + 1-line
 *      sub-label), mirroring the layout the top Persian competitor
 *      numberland.ir uses on its winning landing.
 *   3. «جدیدترین مقالات» — the 3 newest blog posts, each linking to
 *      `/blog/<slug>`. Drives internal-link equity to the topical-
 *      authority hub instead of dumping copy on the home page.
 *   4. «سؤالات پرتکرار» — 10 Q&A `<details>` accordion, also emitted
 *      as `FAQPage` JSON-LD via `seoForHome` to surface People-also-
 *      ask snippets in the brand SERP.
 *
 * The whole block is server-rendered (lives inside `HomePage`, which
 * is the entry rendered by the SSR step) so the prerendered
 * `dist/index.html` ships with the full structured copy in the very
 * first payload — the requirement Google's Helpful Content / E-E-A-T
 * updates reward, without the «wall of text» the legacy version
 * shipped (~4 000 Persian words spread across 23 long blocks).
 */
import {
  ChevronLeft,
  Zap,
  Shield,
  CreditCard,
  Globe,
  Headphones,
  RefreshCw,
  Calendar,
  ArrowLeft,
} from 'lucide-react'
import { AppLink } from './AppLink'
import { HOME_FAQ } from '../lib/homeContent'
import { getBlogPostsSorted } from '../lib/blog'
import { toPersianDigits } from '../lib/format'

export type HomeSeoSectionProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

const WHY_USP_TILES = [
  {
    icon: Zap,
    title: 'تحویل آنی',
    desc: 'دریافت در کمتر از ۳۰ ثانیه پس از پرداخت',
    color: '#d4a853',
  },
  {
    icon: Shield,
    title: 'ضمانت اصالت',
    desc: 'گارانتی ۷ روزه و جایگزینی رایگان',
    color: '#2ec4b6',
  },
  {
    icon: CreditCard,
    title: 'پرداخت تومانی',
    desc: 'درگاه شاپرک با کارت بانکی ایرانی',
    color: '#06d6a0',
  },
  {
    icon: Globe,
    title: 'بدون VPN',
    desc: 'سایت داخل ایران، بدون نیاز به تحریم‌شکن',
    color: '#9b5de5',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی ۲۴/۷',
    desc: 'فارسی، انگلیسی و پشتو، شبانه‌روزی',
    color: '#3b82f6',
  },
  {
    icon: RefreshCw,
    title: 'جایگزینی رایگان',
    desc: 'تعویض ۲۴ ساعته یا بازگشت کامل وجه',
    color: '#e63946',
  },
] as const

function formatPersianDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${toPersianDigits(d)}/${toPersianDigits(m)}/${toPersianDigits(y)}`
}

export function HomeSeoSection({ onNavigate }: HomeSeoSectionProps) {
  const latestPosts = getBlogPostsSorted().slice(0, 3)

  return (
    <section
      className="max-w-7xl mx-auto px-4 py-10"
      aria-labelledby="home-why-heading"
    >
      {/* Intro + 6-tile USP grid */}
      <div className="rounded-2xl bg-[#13141a] border border-[#1e1f2a] p-6 md:p-10">
        <header className="mb-6 max-w-3xl">
          <h2
            id="home-why-heading"
            className="text-2xl md:text-3xl font-black text-white mb-3"
          >
            پی‌کارت چیست؟
          </h2>
          <p className="text-sm md:text-base text-[#c4c5d0] leading-8">
            پی‌کارت یک مارکت‌پلیس فارسی‌زبان برای خرید اکانت پرمیوم سرویس‌های
            بین‌المللی است؛ از{' '}
            <AppLink
              href="/c/ai-assistants"
              onNavigate={onNavigate}
              className="text-[#d4a853] hover:text-[#c49a48] no-underline"
            >
              ChatGPT Plus، Claude و Gemini
            </AppLink>{' '}
            تا{' '}
            <AppLink
              href="/c/streaming"
              onNavigate={onNavigate}
              className="text-[#d4a853] hover:text-[#c49a48] no-underline"
            >
              Spotify و Netflix
            </AppLink>
            ، Adobe، Canva و گیفت‌کارت. تحویل آنی، ضمانت اصالت، پرداخت تومانی
            از طریق شاپرک، بدون نیاز به VPN — همه چیز در یک پنل کاربری فارسی.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {WHY_USP_TILES.map((tile) => {
            const I = tile.icon
            return (
              <div
                key={tile.title}
                className="relative overflow-hidden bg-[#0b0c10] border border-[#1e1f2a] rounded-xl p-4 flex items-start gap-3 transition-colors hover:border-[#2a2b35] group"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-8 -bottom-8 h-24 w-24 rounded-full blur-2xl opacity-30 transition-opacity group-hover:opacity-50"
                  style={{ background: tile.color }}
                />
                <div
                  className="relative w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${tile.color}1f`,
                    border: `1px solid ${tile.color}40`,
                  }}
                >
                  <I size={18} style={{ color: tile.color }} />
                </div>
                <div className="relative min-w-0">
                  <div className="text-sm font-bold text-white mb-0.5">
                    {tile.title}
                  </div>
                  <div className="text-[11px] text-[#8b8c98] leading-6">
                    {tile.desc}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Latest blog posts strip */}
      {latestPosts.length > 0 && (
        <div
          className="mt-8 rounded-2xl bg-[#13141a] border border-[#1e1f2a] p-6 md:p-10"
          aria-labelledby="home-latest-articles-heading"
        >
          <header className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2
                id="home-latest-articles-heading"
                className="text-2xl md:text-3xl font-black text-white mb-2"
              >
                جدیدترین مقالات
              </h2>
              <p className="text-sm text-[#9a9baa] leading-7 max-w-3xl">
                راهنماهای فارسی خرید اشتراک‌های دیجیتال، فعال‌سازی،
                قیمت تومانی و مقایسه پلن‌ها.
              </p>
            </div>
            <AppLink
              href="/blog"
              onNavigate={onNavigate}
              className="hidden md:flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] font-medium no-underline whitespace-nowrap"
            >
              همه مقالات
              <ChevronLeft size={16} />
            </AppLink>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestPosts.map((post) => (
              <AppLink
                key={post.slug}
                href={`/blog/${post.slug}`}
                onNavigate={onNavigate}
                className="group bg-[#0b0c10] border border-[#1e1f2a] rounded-xl overflow-hidden hover:border-[#d4a853]/30 transition-colors no-underline text-inherit flex flex-col"
                aria-label={post.titleFa}
              >
                <div className="relative aspect-[16/9] bg-[#0e0f15] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.coverAlt}
                    width={1200}
                    height={630}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#6b6c78] mb-2">
                    <Calendar size={12} />
                    <span>{formatPersianDate(post.datePublished)}</span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white leading-7 mb-2 group-hover:text-[#d4a853] transition-colors line-clamp-2">
                    {post.titleFa}
                  </h3>
                  <p className="text-xs text-[#9a9baa] leading-7 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#d4a853] font-medium">
                    مطالعه کامل
                    <ArrowLeft size={12} />
                  </span>
                </div>
              </AppLink>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <AppLink
              href="/blog"
              onNavigate={onNavigate}
              className="inline-flex items-center gap-1 text-sm text-[#d4a853] hover:text-[#c49a48] font-medium no-underline"
            >
              همه مقالات
              <ChevronLeft size={16} />
            </AppLink>
          </div>
        </div>
      )}

      {/* FAQ */}
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
