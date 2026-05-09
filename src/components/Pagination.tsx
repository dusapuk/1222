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

  return (
    <nav
      aria-label="صفحه‌بندی"
      className="flex items-center justify-center gap-1.5 mt-8 flex-wrap"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center bg-[#13141a] border border-[#1e1f2a] rounded-lg text-[#9a9baa] hover:text-white hover:border-[#d4a853]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="قبلی"
      >
        <ChevronRight size={16} />
      </button>

      {items.map((it, idx) =>
        it === '…' ? (
          <span
            key={`gap-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-[#505162] text-xs"
          >
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            aria-current={it === page ? 'page' : undefined}
            className={`min-w-9 h-9 px-3 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${
              it === page
                ? 'bg-[#d4a853] text-[#0b0c10] border border-[#d4a853]'
                : 'bg-[#13141a] border border-[#1e1f2a] text-[#9a9baa] hover:text-white hover:border-[#d4a853]/40'
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
        className="w-9 h-9 flex items-center justify-center bg-[#13141a] border border-[#1e1f2a] rounded-lg text-[#9a9baa] hover:text-white hover:border-[#d4a853]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="بعدی"
      >
        <ChevronLeft size={16} />
      </button>
    </nav>
  )
}
