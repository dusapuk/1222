import { ShoppingCart, Heart, Eye, Percent, Sparkles, Flame, AlertCircle } from 'lucide-react'
import type { Service } from '../lib/data'
import { getDiscountPct } from '../lib/data'
import { formatToman } from '../lib/format'

const FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23f5f3ed"/><circle cx="32" cy="26" r="9" fill="%23dad7d0"/><path d="M14 56c0-9.94 8.06-18 18-18s18 8.06 18 18" fill="%23dad7d0"/></svg>'

export type ProductCardProps = {
  service: Service
  onClick?: (s: Service) => void
  variant?: 'default' | 'compact'
}

export function ProductCard({ service: s, onClick, variant = 'default' }: ProductCardProps) {
  const discount = getDiscountPct(s)
  const compact = variant === 'compact'

  return (
    <div
      onClick={() => onClick?.(s)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick?.(s)
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] transition-[transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:ring-[#dad7d0] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30"
    >
      <div className={`relative aspect-square overflow-hidden bg-[#f5f3ed] ${compact ? 'p-4' : ''}`}>
        <img
          src={s.logoUrl ?? FALLBACK}
          alt={s.titleFa}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = FALLBACK
          }}
        />

        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          {discount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-[#c2410c] px-2 py-0.5 text-[10px] font-medium text-[#faf9f5]">
              <Percent size={10} />
              {discount}٪
            </span>
          )}
          {s.isPopular && (
            <span className="flex items-center gap-1 rounded-full bg-[#141413] px-2 py-0.5 text-[10px] font-medium text-[#faf9f5]">
              <Flame size={10} />
              پرفروش
            </span>
          )}
          {s.isAi && (
            <span className="flex items-center gap-1 rounded-full bg-[#faf9f5] px-2 py-0.5 text-[10px] font-medium text-[#141413] ring-1 ring-[#e8e6e0]">
              <Sparkles size={10} />
              AI
            </span>
          )}
        </div>

        {!s.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#faf9f5]/80">
            <span className="flex items-center gap-1.5 rounded-full bg-[#141413] px-3 py-1 text-xs font-medium text-[#faf9f5]">
              <AlertCircle size={12} />
              ناموجود
            </span>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf9f5] text-[#5b5755] ring-1 ring-[#e8e6e0] transition-colors hover:text-[#c2410c]"
            aria-label="افزودن به علاقه‌مندی"
          >
            <Heart size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#faf9f5] text-[#5b5755] ring-1 ring-[#e8e6e0] transition-colors hover:text-[#141413]"
            aria-label="نمایش سریع"
          >
            <Eye size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h4 className="mb-1 line-clamp-1 font-display text-base text-[#141413] transition-colors group-hover:text-[#c2410c]">
          {s.titleFa}
        </h4>
        <p className="mb-3 min-h-[2.5rem] line-clamp-2 text-[11px] leading-5 text-[#5b5755]">
          {s.shortDescriptionFa ?? s.titleEn ?? ''}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            {s.compareAtIrt && discount > 0 && (
              <span className="block text-[11px] leading-tight text-[#a8a39d] line-through">
                {formatToman(s.compareAtIrt)}
              </span>
            )}
            <span className="block whitespace-nowrap font-display text-lg leading-tight text-[#141413]">
              از {formatToman(s.fromPriceIrt)}
            </span>
            <span className="mr-1 text-[10px] text-[#8e8a85]">تومان</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onClick?.(s)
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141413] text-[#faf9f5] transition-transform duration-150 group-hover:bg-[#c2410c]"
            aria-label="افزودن به سبد"
          >
            <ShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
