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
      className="group relative aspect-[4/5] rounded-2xl text-right overflow-hidden border border-[#1e1f2a] hover:border-[#d4a853]/40 transition-all focus:outline-none focus:ring-2 focus:ring-[#d4a853]/50"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${color}55 0%, ${color}22 35%, #0e0f15 75%, #0b0c10 100%)`,
        }}
      />

      <Icon
        className="absolute -top-4 -right-4 opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500 pointer-events-none"
        size={220}
        strokeWidth={1.25}
        style={{ color }}
      />

      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/85 to-transparent pointer-events-none" />

      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <h3 className="font-black text-lg text-white mb-1.5 line-clamp-1 group-hover:text-[#d4a853] transition-colors">
          {category.titleFa}
        </h3>
        {category.description && (
          <p className="text-xs text-[#9a9baa] leading-6 line-clamp-2 mb-4">
            {category.description}
          </p>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-[11px] text-[#c4c5d0] font-medium">
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
      </div>
    </button>
  )
}
