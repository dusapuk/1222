import { ChevronLeft } from 'lucide-react'
import type { Category } from '../lib/data'
import { iconFor, colorForCategory, imageForCategory } from '../lib/icons'
import { toPersianDigits } from '../lib/format'

export type CategoryCardProps = {
  category: Category
  count: number
  onClick?: (slug: string) => void
}

export function CategoryCard({ category, count, onClick }: CategoryCardProps) {
  const Icon = iconFor(category.icon)
  const color = colorForCategory(category.slug)
  const image = imageForCategory(category.slug)

  return (
    <button
      type="button"
      onClick={() => onClick?.(category.slug)}
      className="group relative block w-full overflow-hidden rounded-2xl bg-[#0e0f15] text-right transition-all focus:outline-none focus:ring-2 focus:ring-[#d4a853]/50"
      style={{
        aspectRatio: '5 / 4',
        boxShadow: `0 1px 0 0 ${color}22, 0 0 0 1px #1e1f2a`,
      }}
    >
      <img
        src={image}
        alt={category.titleFa}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* tinted color veil for cohesion + slight per-category hue */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-multiply opacity-50 transition-opacity group-hover:opacity-30"
        style={{ background: `linear-gradient(135deg, ${color}33 0%, #0b0c10cc 100%)` }}
      />

      {/* readability gradient bottom -> top */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-3/4"
        style={{
          background:
            'linear-gradient(to top, rgba(8,9,14,0.96) 0%, rgba(8,9,14,0.78) 35%, rgba(8,9,14,0.18) 75%, rgba(8,9,14,0) 100%)',
        }}
      />

      {/* top-left accent bar */}
      <span
        aria-hidden
        className="absolute top-4 right-4 h-7 w-1 rounded-full"
        style={{ background: color }}
      />

      {/* icon chip top-right */}
      <div
        className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-xl backdrop-blur-md transition-transform group-hover:scale-110"
        style={{
          background: `${color}26`,
          border: `1px solid ${color}66`,
          boxShadow: `0 4px 18px -6px ${color}88`,
        }}
      >
        <Icon size={18} style={{ color }} />
      </div>

      {/* hover-only golden border ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: 'inset 0 0 0 1.5px rgba(212,168,83,0.55)' }}
      />

      {/* content */}
      <div className="relative flex h-full flex-col justify-end p-4 sm:p-5">
        {category.titleEn && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {category.titleEn}
          </span>
        )}
        <h3 className="mb-3 text-xl font-black leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-2xl">
          {category.titleFa}
        </h3>
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-bold backdrop-blur-md"
            style={{
              background: `${color}26`,
              color,
              border: `1px solid ${color}55`,
            }}
          >
            {toPersianDigits(count)} سرویس
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/85 transition-colors group-hover:text-[#d4a853]">
            مشاهده
            <ChevronLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
          </span>
        </div>
      </div>
    </button>
  )
}
