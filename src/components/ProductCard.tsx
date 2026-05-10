import { ShoppingCart, Heart, Eye, Percent, Sparkles, Flame, AlertCircle, Activity } from 'lucide-react'
import type { MouseEvent } from 'react'
import type { Service } from '../lib/data'
import { getDiscountPct } from '../lib/data'
import { formatToman } from '../lib/format'
import { AppLink } from './AppLink'
import { liveOrderLabelFa } from '../lib/liveCounter'

const FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%231a1b26"/><circle cx="32" cy="26" r="9" fill="%23505162"/><path d="M14 56c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="%23505162"/></svg>'

export type ProductCardProps = {
  service: Service
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  variant?: 'default' | 'compact'
}

export function ProductCard({ service: s, onNavigate, variant = 'default' }: ProductCardProps) {
  const discount = getDiscountPct(s)
  const compact = variant === 'compact'
  const href = '/s/' + s.slug
  // SEO roadmap #18: build-time deterministic order counter.
  // Surfaces social-proof activity on every card without needing a
  // realtime backend. Skipped for out-of-stock services.
  const liveLabel = liveOrderLabelFa(s)

  // Inner action buttons (favourite / quick view / cart) must not bubble
  // up to the outer link. Stop propagation on the wrapping anchor click
  // event so a click on the heart icon doesn't navigate to the product.
  function stop(e: MouseEvent): void {
    e.stopPropagation()
    e.preventDefault()
  }

  return (
    <AppLink
      href={href}
      onNavigate={onNavigate}
      aria-label={`خرید ${s.titleFa}`}
      className="group bg-[#13141a] border border-[#1e1f2a] rounded-2xl overflow-hidden hover:border-[#d4a853]/40 transition-all flex flex-col focus:outline-none focus:ring-2 focus:ring-[#d4a853]/50 no-underline text-inherit"
    >
      <div className={`relative overflow-hidden aspect-square bg-gradient-to-br from-[#1a1b26] to-[#0e0f15] ${compact ? 'p-4' : ''}`}>
        <img
          src={s.logoUrl ?? FALLBACK}
          alt={`خرید ${s.titleFa}${s.titleEn ? ' – ' + s.titleEn : ''}`}
          width={400}
          height={400}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = FALLBACK
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0b0c10]/70 to-transparent pointer-events-none" />

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-[#e63946] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
              <Percent size={10} />
              {discount}٪
            </span>
          )}
          {s.isPopular && (
            <span className="bg-[#d4a853] text-[#0b0c10] text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
              <Flame size={10} />
              پرفروش
            </span>
          )}
          {s.isAi && (
            <span className="bg-[#9b5de5] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
              <Sparkles size={10} />
              AI
            </span>
          )}
        </div>

        {!s.inStock && (
          <div className="absolute inset-0 bg-[#0b0c10]/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#1e1f2a] text-[#e63946] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <AlertCircle size={12} />
              ناموجود
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={stop}
            className="w-8 h-8 bg-[#0b0c10]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-[#8a8b96] hover:text-[#e63946] transition-colors"
            aria-label="افزودن به علاقه‌مندی"
          >
            <Heart size={14} />
          </button>
          <button
            type="button"
            onClick={stop}
            className="w-8 h-8 bg-[#0b0c10]/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-[#8a8b96] hover:text-white transition-colors"
            aria-label="نمایش سریع"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-sm text-white mb-1 line-clamp-1 group-hover:text-[#d4a853] transition-colors">
          {s.titleFa}
        </h4>
        <p className="text-[11px] text-[#6b6c78] mb-3 line-clamp-2 leading-5 min-h-[2.5rem]">
          {s.shortDescriptionFa ?? s.titleEn ?? ''}
        </p>
        {liveLabel && (
          <div
            className="-mt-1 mb-3 inline-flex self-start items-center gap-1 bg-[#06d6a0]/12 text-[#06d6a0] text-[10px] font-bold px-2 py-1 rounded-md"
            aria-label={liveLabel}
            title={liveLabel}
          >
            <Activity size={10} />
            {liveLabel}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            {s.compareAtIrt && discount > 0 && (
              <span className="text-[11px] text-[#505162] line-through block leading-tight">
                {formatToman(s.compareAtIrt)}
              </span>
            )}
            <span className="font-black text-[15px] text-white leading-tight whitespace-nowrap">
              از {formatToman(s.fromPriceIrt)}
            </span>
            <span className="text-[10px] text-[#6b6c78] mr-1">تومان</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onNavigate(href)
            }}
            className="bg-[#1e1f2a] hover:bg-[#d4a853] text-[#8a8b96] hover:text-[#0b0c10] w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0"
            aria-label="افزودن به سبد"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </AppLink>
  )
}
