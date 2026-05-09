import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toPersianDigits } from '../lib/format'

export type PaginationProps = {
  page: number
  pageCount: number
  onChange: (p: number) => void
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null

  const items: (number | '…')[] = []
  const win = 1
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || (i >= page - win && i <= page + win)) {
      items.push(i)
    } else if (items[items.length - 1] !== '…') {
      items.push('…')
    }
  }

  const baseBtn =
    'flex h-9 min-w-9 items-center justify-center rounded-full text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="mt-10 flex flex-wrap items-center justify-center gap-1.5"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${baseBtn} w-9 bg-[#ffffff] text-[#141413] ring-1 ring-[#e8e6e0] hover:ring-[#141413]`}
        aria-label="قبلی"
      >
        <ChevronRight size={15} />
      </button>

      {items.map((it, idx) =>
        it === '…' ? (
          <span
            key={`gap-${idx}`}
            className="flex h-9 w-9 items-center justify-center text-xs text-[#a8a39d]"
          >
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            aria-current={it === page ? 'page' : undefined}
            className={`${baseBtn} px-3 ${
              it === page
                ? 'bg-[#141413] text-[#faf9f5]'
                : 'bg-[#ffffff] text-[#141413] ring-1 ring-[#e8e6e0] hover:ring-[#141413]'
            }`}
          >
            {toPersianDigits(it)}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={`${baseBtn} w-9 bg-[#ffffff] text-[#141413] ring-1 ring-[#e8e6e0] hover:ring-[#141413]`}
        aria-label="بعدی"
      >
        <ChevronLeft size={15} />
      </button>
    </nav>
  )
}
