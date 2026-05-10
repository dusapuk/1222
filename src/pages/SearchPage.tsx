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
import { AppLink } from '../components/AppLink'
import { toPersianDigits } from '../lib/format'
import { useSEO } from '../hooks/useSEO'
import { seoForSearch } from '../lib/seoConfig'

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

  useSEO(
    seoForSearch({ query: localQuery, resultCount: filtered.length }),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <Breadcrumbs items={[{ label: 'جستجو' }]} onNavigate={onNavigate} />

      <header className="mt-5 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-1 h-7 bg-[#d4a853] rounded-full" />
          <h1 className="text-xl md:text-2xl font-black text-white">
            نتایج جستجو {localQuery && <span className="text-[#d4a853]">«{localQuery}»</span>}
          </h1>
        </div>
        <div className="relative max-w-2xl">
          <input
            type="text"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            placeholder="جستجو در همه سرویس‌ها..."
            className="w-full bg-[#13141a] border border-[#252630] rounded-xl h-11 pr-11 pl-3 text-sm text-white placeholder-[#505162] outline-none focus:border-[#d4a853] transition-colors"
            autoFocus
          />
          <SearchIcon
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#505162]"
          />
        </div>
      </header>

      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <span className="text-xs text-[#8a8b96] bg-[#13141a] border border-[#1e1f2a] px-3 py-2 rounded-xl">
          {toPersianDigits(filtered.length)} نتیجه
        </span>
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-[#13141a] border border-[#1e1f2a] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-[#1e1f2a] flex items-center justify-center mb-4">
            <Inbox size={24} className="text-[#505162]" />
          </div>
          <h3 className="font-bold text-base text-white mb-2">نتیجه‌ای پیدا نشد</h3>
          <p className="text-sm text-[#8a8b96] max-w-sm">
            با کلمات کلیدی متفاوت جستجو کنید یا یکی از دسته‌بندی‌ها را مرور کنید.
          </p>
          <AppLink
            href="/categories"
            onNavigate={onNavigate}
            className="mt-4 bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors no-underline"
          >
            مشاهده دسته‌بندی‌ها
          </AppLink>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visible.map((s) => (
              <ProductCard
                key={s.id}
                service={s}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </div>
  )
}
