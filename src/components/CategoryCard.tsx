import { ChevronLeft } from 'lucide-react'
import type { Category } from '../lib/data'
import { iconFor, colorForCategory } from '../lib/icons'
import { toPersianDigits } from '../lib/format'

export type CategoryCardProps = {
  category: Category
  count: number
  onClick?: (slug: string) => void
}

export function CategoryCard({ category, count, onClick }: CategoryCardProps) {
  const Icon = iconFor(category.icon)
  const color = colorForCategory(category.slug)

  return (
    <button
      type="button"
      onClick={() => onClick?.(category.slug)}
      className="group relative bg-[#13141a] border border-[#1e1f2a] rounded-2xl p-5 sm:p-6 text-right hover:border-[#d4a853]/40 hover:bg-[#161722] transition-all overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#d4a853]/50"
    >
      <div
        className="absolute -top-12 -left-12 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none transition-opacity group-hover:opacity-25"
        style={{ background: color }}
      />

      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: `${color}15`, border: `1px solid ${color}33` }}
      >
        <Icon size={22} style={{ color }} />
      </div>

      <h3 className="font-bold text-base text-white mb-1.5 line-clamp-1 group-hover:text-[#d4a853] transition-colors">
        {category.titleFa}
      </h3>
      {category.description && (
        <p className="text-xs text-[#6b6c78] leading-6 line-clamp-2 mb-4 min-h-[3rem]">
          {category.description}
        </p>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-[#1e1f2a]">
        <span className="text-[11px] text-[#8a8b96]">
          {toPersianDigits(count)} سرویس
        </span>
        <span className="flex items-center gap-1 text-xs text-[#d4a853] font-medium">
          مشاهده
          <ChevronLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </span>
      </div>
    </button>
  )
}
