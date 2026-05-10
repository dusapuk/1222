import { Calendar, ArrowLeft } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { seoForBlogIndex } from '../lib/seoConfig'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { AppLink } from '../components/AppLink'
import { getBlogPostsSorted } from '../lib/blog'
import { toPersianDigits } from '../lib/format'

export type BlogIndexPageProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

const FALLBACK_COVER = '/images/og/og-default.png'

function formatPersianDate(iso: string): string {
  // Render YYYY-MM-DD (Gregorian) as Persian-digit day/month/year.
  // Doesn't convert to Jalali calendar — keeping the canonical
  // date stable for `datePublished` matters more than the calendar.
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${toPersianDigits(d)}/${toPersianDigits(m)}/${toPersianDigits(y)}`
}

export function BlogIndexPage({ onNavigate }: BlogIndexPageProps) {
  const posts = getBlogPostsSorted()
  useSEO(seoForBlogIndex({ posts }))

  return (
    <article className="max-w-5xl mx-auto px-4 py-8 md:py-12 text-right">
      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'وبلاگ' }]} onNavigate={onNavigate} />
      </div>

      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
          وبلاگ پی‌کارت — راهنمای خرید اشتراک‌های دیجیتال
        </h1>
        <p className="text-sm md:text-base text-[#c4c5d0] leading-8">
          راهنماهای کامل خرید اکانت ChatGPT Plus، Midjourney، Canva Pro، Adobe Creative Cloud،
          Apple Music، Duolingo Super و دیگر سرویس‌های دیجیتال از ایران — با قیمت تومانی،
          تحویل آنی، گارانتی اصالت و راهنمای فعال‌سازی برای کاربر ایرانی.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <AppLink
            key={post.slug}
            href={`/blog/${post.slug}`}
            onNavigate={onNavigate}
            className="group bg-[#13141a] border border-[#1e1f2a] rounded-2xl overflow-hidden hover:border-[#d4a853]/40 transition-colors no-underline text-inherit flex flex-col"
            aria-label={post.titleFa}
          >
            <div className="relative aspect-[16/9] bg-[#0e0f15] overflow-hidden">
              <img
                src={post.coverImage || FALLBACK_COVER}
                alt={post.coverAlt}
                width={1200}
                height={630}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center gap-2 text-[11px] text-[#6b6c78] mb-2">
                <Calendar size={12} />
                <span>{formatPersianDate(post.datePublished)}</span>
              </div>
              <h2 className="text-base md:text-lg font-bold text-white leading-7 mb-3 group-hover:text-[#d4a853] transition-colors">
                {post.titleFa}
              </h2>
              <p className="text-xs md:text-sm text-[#9a9baa] leading-7 flex-1">
                {post.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#d4a853] font-medium">
                مطالعه کامل
                <ArrowLeft size={14} />
              </span>
            </div>
          </AppLink>
        ))}
      </div>
    </article>
  )
}
