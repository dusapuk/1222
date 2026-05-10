import { useMemo } from 'react'
import { Calendar, User, Tag, ShoppingCart, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { seoForBlogPost } from '../lib/seoConfig'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { AppLink } from '../components/AppLink'
import { findBlogPost, getBlogPostsSorted, type BlogPost } from '../lib/blog'
import { getCategoryBySlug, getServiceBySlug } from '../lib/data'
import { toPersianDigits } from '../lib/format'
import { seoForNotFound } from '../lib/seoConfig'

export type BlogPostPageProps = {
  slug: string
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

const FALLBACK_COVER = '/images/og/og-default.png'

function formatPersianDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${toPersianDigits(d)}/${toPersianDigits(m)}/${toPersianDigits(y)}`
}

export function BlogPostPage({ slug, onNavigate }: BlogPostPageProps) {
  const post = findBlogPost(slug)
  const primaryService = post ? getServiceBySlug(post.primaryServiceSlug) : undefined
  const primaryCategory = post ? getCategoryBySlug(post.primaryCategorySlug) : undefined

  // Other posts in the same category for the related box.
  const related: BlogPost[] = useMemo(() => {
    if (!post) return []
    return getBlogPostsSorted()
      .filter((p) => p.slug !== post.slug)
      .filter((p) => p.primaryCategorySlug === post.primaryCategorySlug)
      .slice(0, 3)
  }, [post])

  useSEO(post ? seoForBlogPost({ post, primaryService }) : seoForNotFound(`/blog/${slug}`))

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-white mb-3">مقاله پیدا نشد</h1>
        <p className="text-sm text-[#9a9baa] mb-5">
          مقاله‌ای با این آدرس در وبلاگ پی‌کارت موجود نیست.
        </p>
        <AppLink
          href="/blog"
          onNavigate={onNavigate}
          className="inline-flex items-center gap-2 text-[#d4a853] hover:underline"
        >
          بازگشت به وبلاگ
          <ArrowLeft size={14} />
        </AppLink>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 md:py-10 text-right">
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'وبلاگ', path: '/blog' },
            { label: post.titleFa },
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <header className="mb-7">
        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
          {post.titleFa}
        </h1>
        <p className="text-sm md:text-base text-[#c4c5d0] leading-8 mb-4">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#8a8b96]">
          <span className="flex items-center gap-1.5">
            <User size={12} />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {formatPersianDate(post.datePublished)}
          </span>
          {primaryCategory && (
            <AppLink
              href={`/c/${primaryCategory.slug}`}
              onNavigate={onNavigate}
              className="flex items-center gap-1.5 hover:text-[#d4a853] transition-colors no-underline"
            >
              <Tag size={12} />
              {primaryCategory.titleFa}
            </AppLink>
          )}
        </div>
      </header>

      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-[#0e0f15] border border-[#1e1f2a] mb-7">
        <img
          src={post.coverImage || FALLBACK_COVER}
          alt={post.coverAlt}
          width={1200}
          height={630}
          loading="eager"
          decoding="async"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Top sticky CTA — drives transactional intent above the fold */}
      {primaryService && (
        <PrimaryCta
          post={post}
          primaryServiceSlug={primaryService.slug}
          primaryServiceTitleFa={primaryService.titleFa}
          onNavigate={onNavigate}
        />
      )}

      <div className="space-y-6">
        {post.sections.map((section, idx) => {
          const Heading = section.level === 'h3' ? 'h3' : 'h2'
          return (
            <section
              key={`${section.heading}-${idx}`}
              className="bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 md:p-7"
            >
              <Heading
                className={
                  section.level === 'h3'
                    ? 'text-base md:text-lg font-bold text-white mb-3'
                    : 'text-lg md:text-xl font-black text-white mb-4'
                }
              >
                {section.heading}
              </Heading>
              {section.body?.map((para, i) => (
                <p
                  key={i}
                  className="text-sm md:text-[15px] text-[#c4c5d0] leading-8 mb-3 last:mb-0"
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
              {section.cta && (
                <div className="mt-4">
                  <AppLink
                    href={section.cta.path}
                    onNavigate={onNavigate}
                    className="inline-flex items-center gap-2 bg-[#1a1b26] hover:bg-[#21222d] border border-[#d4a853]/30 hover:border-[#d4a853] rounded-xl px-4 py-2.5 text-sm font-bold text-[#d4a853] transition-colors no-underline"
                  >
                    <ShoppingCart size={14} />
                    {section.cta.label}
                    <ArrowLeft size={14} />
                  </AppLink>
                </div>
              )}
            </section>
          )
        })}
      </div>

      {post.faq && post.faq.length > 0 && (
        <section className="mt-7 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 md:p-7">
          <h2 className="text-lg md:text-xl font-black text-white mb-4">سوالات متداول</h2>
          <ul className="space-y-3">
            {post.faq.map((qa, i) => (
              <li
                key={i}
                className="bg-[#0e0f15] border border-[#1e1f2a] rounded-xl p-4"
              >
                <h3 className="text-sm font-bold text-white mb-2">{qa.question}</h3>
                <p className="text-xs md:text-sm text-[#9a9baa] leading-7 whitespace-pre-line">
                  {qa.answer}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom transactional CTA — second-chance close */}
      {primaryService && (
        <BottomCta
          post={post}
          primaryServiceSlug={primaryService.slug}
          primaryServiceTitleFa={primaryService.titleFa}
          onNavigate={onNavigate}
        />
      )}

      {(post.relatedServiceSlugs?.length ?? 0) > 0 && (
        <section className="mt-7">
          <h2 className="text-lg font-black text-white mb-4">سرویس‌های مرتبط برای خرید</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(post.relatedServiceSlugs ?? []).map((sslug) => {
              const s = getServiceBySlug(sslug)
              if (!s) return null
              return (
                <AppLink
                  key={sslug}
                  href={`/s/${s.slug}`}
                  onNavigate={onNavigate}
                  className="bg-[#13141a] border border-[#1e1f2a] hover:border-[#d4a853]/40 rounded-xl p-3 flex items-center gap-3 transition-colors no-underline text-inherit"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#0e0f15] border border-[#1e1f2a] flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                    {s.logoUrl ? (
                      <img
                        src={s.logoUrl}
                        alt={`لوگو ${s.titleFa}`}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-[#6b6c78]">{s.titleFa[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      خرید {s.titleFa}
                    </div>
                    <div className="text-[10px] text-[#6b6c78] truncate">
                      {s.titleEn || 'مشاهده پلن‌ها'}
                    </div>
                  </div>
                </AppLink>
              )
            })}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-7">
          <h2 className="text-lg font-black text-white mb-4">مقالات مرتبط</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {related.map((p) => (
              <AppLink
                key={p.slug}
                href={`/blog/${p.slug}`}
                onNavigate={onNavigate}
                className="bg-[#13141a] border border-[#1e1f2a] hover:border-[#d4a853]/40 rounded-xl p-4 transition-colors no-underline text-inherit block"
              >
                <h3 className="text-sm font-bold text-white leading-7 mb-2 line-clamp-3">
                  {p.titleFa}
                </h3>
                <p className="text-xs text-[#8a8b96] leading-6 line-clamp-2">{p.excerpt}</p>
              </AppLink>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

function PrimaryCta({
  post,
  primaryServiceSlug,
  primaryServiceTitleFa,
  onNavigate,
}: {
  post: BlogPost
  primaryServiceSlug: string
  primaryServiceTitleFa: string
  onNavigate: BlogPostPageProps['onNavigate']
}) {
  return (
    <aside className="mb-6 bg-gradient-to-br from-[#1f1a0c] to-[#13141a] border border-[#d4a853]/30 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1">
        <div className="text-[11px] text-[#d4a853] font-bold mb-1.5">پیشنهاد ویژه پی‌کارت</div>
        <div className="text-base md:text-lg font-black text-white mb-1">
          {post.primaryCtaLabel}
        </div>
        <div className="text-xs md:text-sm text-[#c4c5d0] leading-6">
          قیمت لحظه‌ای، تحویل آنی و گارانتی اصالت در صفحه «{primaryServiceTitleFa}»
        </div>
      </div>
      <AppLink
        href={`/s/${primaryServiceSlug}`}
        onNavigate={onNavigate}
        className="inline-flex items-center justify-center gap-2 bg-[#d4a853] hover:bg-[#e3b864] text-[#0b0c10] font-bold px-5 py-3 rounded-xl shrink-0 no-underline transition-colors"
      >
        <ShoppingCart size={16} />
        مشاهده قیمت و خرید
        <ArrowLeft size={14} />
      </AppLink>
    </aside>
  )
}

function BottomCta({
  post,
  primaryServiceSlug,
  primaryServiceTitleFa,
  onNavigate,
}: {
  post: BlogPost
  primaryServiceSlug: string
  primaryServiceTitleFa: string
  onNavigate: BlogPostPageProps['onNavigate']
}) {
  return (
    <aside className="mt-7 bg-[#0e0f15] border border-[#1e1f2a] rounded-2xl p-5 md:p-7 text-center">
      <div className="text-base md:text-lg font-black text-white mb-2">
        آماده خرید {primaryServiceTitleFa} هستید؟
      </div>
      <p className="text-xs md:text-sm text-[#9a9baa] leading-7 mb-4 max-w-xl mx-auto">
        پی‌کارت با پرداخت ریالی، تحویل آنی، گارانتی اصالت تا پایان دوره و پشتیبانی فارسی،
        راحت‌ترین مسیر خرید این سرویس از ایران را پیشنهاد می‌دهد.
      </p>
      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-[#c4c5d0] mb-5">
        <li className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-[#06d6a0]" />
          پرداخت ریالی شاپرک
        </li>
        <li className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-[#06d6a0]" />
          تحویل آنی پس از پرداخت
        </li>
        <li className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-[#06d6a0]" />
          گارانتی اصالت
        </li>
      </ul>
      <AppLink
        href={`/s/${primaryServiceSlug}`}
        onNavigate={onNavigate}
        className="inline-flex items-center gap-2 bg-[#d4a853] hover:bg-[#e3b864] text-[#0b0c10] font-bold px-6 py-3 rounded-xl no-underline transition-colors"
      >
        <ShoppingCart size={16} />
        {post.primaryCtaLabel}
        <ArrowLeft size={14} />
      </AppLink>
    </aside>
  )
}
