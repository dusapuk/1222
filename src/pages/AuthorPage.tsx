/**
 * Author landing page rendered at `/author/<slug>`. Single component
 * shared by every author entry in `AUTHOR_PAGES`. The page surfaces a
 * Person bio + knowsAbout list + public-profile links (LinkedIn /
 * Twitter / GitHub / Telegram), and is referenced by every blog post's
 * `Article.author.url` so it acts as the canonical Person entity for
 * Google's E-E-A-T heuristics.
 */
import { Mail, Globe, ExternalLink } from 'lucide-react'
import { useSEO } from '../hooks/useSEO'
import { seoForAuthorPage } from '../lib/seoConfig'
import { Breadcrumbs } from '../components/Breadcrumbs'
import type { AuthorPage } from '../lib/staticPages'
import { CONTACT_EMAIL } from '../lib/seo'

export type AuthorPageViewProps = {
  author: AuthorPage
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

function inferProfileLabel(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host.includes('linkedin')) return 'LinkedIn'
    if (host.includes('twitter') || host.includes('x.com')) return 'Twitter / X'
    if (host.includes('github')) return 'GitHub'
    if (host.includes('telegram') || host.includes('t.me')) return 'Telegram'
    if (host.includes('instagram')) return 'Instagram'
    return host
  } catch {
    return 'پروفایل'
  }
}

export function AuthorPageView({ author, onNavigate }: AuthorPageViewProps) {
  useSEO(seoForAuthorPage(author))

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 md:py-12 text-right">
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'وبلاگ', path: '/blog' },
            { label: author.nameFa },
          ]}
          onNavigate={onNavigate}
        />
      </div>

      <header className="mb-8 flex items-start gap-4 md:gap-6 flex-row-reverse md:flex-row-reverse">
        {author.avatarUrl && (
          <img
            src={author.avatarUrl}
            alt={author.nameFa}
            width={96}
            height={96}
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border border-[#1e1f2a] shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-1">
            {author.nameFa}
          </h1>
          {author.nameEn && (
            <p className="text-xs md:text-sm text-[#8a8b96] mb-2" dir="ltr">
              {author.nameEn}
            </p>
          )}
          {author.roleFa && (
            <p className="text-sm md:text-base text-[#d4a853] mb-2">{author.roleFa}</p>
          )}
          {author.bioFa && (
            <p className="text-sm md:text-[15px] text-[#c4c5d0] leading-8">{author.bioFa}</p>
          )}
        </div>
      </header>

      {author.longBioFa && author.longBioFa.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3">درباره {author.nameFa}</h2>
          {author.longBioFa.map((para, i) => (
            <p
              key={i}
              className="text-sm md:text-[15px] text-[#c4c5d0] leading-8 mb-2"
            >
              {para}
            </p>
          ))}
        </section>
      )}

      {author.knowsAbout && author.knowsAbout.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-white mb-3">حوزه‌های تخصصی</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm md:text-[15px] text-[#c4c5d0]">
            {author.knowsAbout.map((topic, i) => (
              <li
                key={i}
                className="flex items-center gap-2 bg-[#13141a] border border-[#1e1f2a] rounded-lg px-3 py-2"
              >
                <Globe size={14} className="text-[#d4a853] shrink-0" aria-hidden />
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {((author.sameAs && author.sameAs.length > 0) || CONTACT_EMAIL) && (
        <section className="mb-2 bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5">
          <h2 className="text-lg font-bold text-white mb-4">ارتباط و پروفایل‌ها</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#c4c5d0]">
            {(author.sameAs ?? []).map((url, i) => (
              <li key={i} className="flex items-center gap-3">
                <ExternalLink size={16} className="text-[#d4a853] shrink-0" aria-hidden />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#d4a853] truncate"
                  dir="ltr"
                >
                  {inferProfileLabel(url)}
                </a>
              </li>
            ))}
            {CONTACT_EMAIL && (
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-[#d4a853] shrink-0" aria-hidden />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-[#d4a853]">
                  {CONTACT_EMAIL}
                </a>
              </li>
            )}
          </ul>
        </section>
      )}
    </article>
  )
}
