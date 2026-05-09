import { ArrowLeft } from 'lucide-react'
import type { Category } from '../lib/data'
import { iconFor, imageForCategory } from '../lib/icons'
import { toPersianDigits } from '../lib/format'

export type CategoryCardProps = {
  category: Category
  count: number
  onClick?: (slug: string) => void
}

export function CategoryCard({ category, count, onClick }: CategoryCardProps) {
  const Icon = iconFor(category.icon)
  const image = imageForCategory(category.slug)

  return (
    <button
      type="button"
      onClick={() => onClick?.(category.slug)}
      className="group flex w-full flex-col overflow-hidden rounded-[12px] bg-[#ffffff] text-right ring-1 ring-[#e8e6e0] transition-[transform,box-shadow] duration-200 hover:-translate-y-[1px] hover:ring-[#dad7d0] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f3ed]">
        <img
          src={image}
          alt={category.titleFa}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]"
          >
            <Icon size={16} className="text-[#5b5755]" />
          </span>
          <div className="min-w-0 flex-1">
            {category.titleEn && (
              <span className="block text-[10px] uppercase tracking-[0.16em] text-[#8e8a85]">
                {category.titleEn}
              </span>
            )}
            <h3 className="font-display text-xl leading-tight text-[#141413] line-clamp-1">
              {category.titleFa}
            </h3>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-[#5b5755]">
            {toPersianDigits(count)} سرویس
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#141413] transition-colors group-hover:text-[#c2410c]">
            مشاهده
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </button>
  )
}
