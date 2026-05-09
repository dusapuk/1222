import { useEffect, useMemo, useState } from 'react'
import { Search as SearchIcon, Inbox } from 'lucide-react'
import {
  applyFilter,
  applySort,
  defaultFilter,
  services,
  type FilterState,
  type SortKey,
} from '../lib/data'
import { ProductCard } from '../components/ProductCard'
import { SortSelect } from '../components/SortSelect'
import { Pagination } from '../components/Pagination'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { toPersianDigits } from '../lib/format'

const PAGE_SIZE = 24

export type SearchPageProps = {
  query: string
  initialSort?: SortKey
  initialPage?: number
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  onUpdateParams: (updates: Record<string, string | number | null | undefined>) => void
}

export function SearchPage({
  query,
  initialSort = 'popular',
  initialPage = 1,
  onNavigate,
  onUpdateParams,
}: SearchPageProps) {
  const [localQuery, setLocalQuery] = useState(query)
  const [sort, setSort] = useState<SortKey>(initialSort)
  const [page, setPage] = useState(initialPage)

  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  useEffect(() => {
    onUpdateParams({
      q: localQuery || null,
      sort: sort === 'popular' ? null : sort,
      page: page > 1 ? page : null,
    })
  }, [localQuery, sort, page, onUpdateParams])

  useEffect(() => {
    setPage(1)
  }, [localQuery, sort])

  const filter: FilterState = useMemo(
    () => ({ ...defaultFilter, query: localQuery }),
    [localQuery],
  )
  const filtered = useMemo(() => applyFilter(services, filter), [filter])
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort])
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'جستجو' }]} onNavigate={onNavigate} />

      <header className="mt-6 mb-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
          جستجو
        </span>
        <h1 className="font-display mt-1 text-2xl text-[#141413] md:text-4xl">
          نتایج جستجو {localQuery && <span className="text-[#c2410c]">«{localQuery}»</span>}
        </h1>
        <div className="mt-5 relative max-w-2xl">
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="جستجو در همه سرویس‌ها..."
            className="h-11 w-full rounded-full bg-[#ffffff] pl-3 pr-11 text-sm text-[#141413] placeholder-[#a8a39d] outline-none ring-1 ring-[#e8e6e0] focus:ring-[#141413] transition-shadow"
            autoFocus
          />
          <SearchIcon
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e8a85]"
          />
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <span className="rounded-full bg-[#ffffff] ring-1 ring-[#e8e6e0] px-4 py-2 text-xs text-[#5b5755]">
          {toPersianDigits(filtered.length)} نتیجه
        </span>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
            <Inbox size={22} className="text-[#5b5755]" />
          </div>
          <h3 className="font-display text-lg text-[#141413] mb-2">نتیجه‌ای پیدا نشد</h3>
          <p className="max-w-sm text-sm text-[#5b5755]">
            با کلمات کلیدی متفاوت جستجو کنید یا یکی از دسته‌بندی‌ها را مرور کنید.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/categories')}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-2.5 text-sm font-medium text-[#faf9f5] transition-colors hover:bg-[#000000]"
          >
            مشاهده دسته‌بندی‌ها
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visible.map((s) => (
              <ProductCard
                key={s.id}
                service={s}
                onClick={() => onNavigate('/s/' + s.slug)}
              />
            ))}
          </div>
          <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </div>
  )
}
