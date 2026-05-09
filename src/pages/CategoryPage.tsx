import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, X, Search as SearchIcon, Inbox } from 'lucide-react'
import {
  applyFilter,
  applySort,
  defaultFilter,
  getCategoryBySlug,
  getPriceRange,
  getServicesByCategory,
  type FilterState,
  type SortKey,
} from '../lib/data'
import { ProductCard } from '../components/ProductCard'
import { FilterPanel } from '../components/FilterPanel'
import { SortSelect } from '../components/SortSelect'
import { Pagination } from '../components/Pagination'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { iconFor, imageForCategory } from '../lib/icons'
import { toPersianDigits } from '../lib/format'

export type CategoryPageProps = {
  slug: string
  initialQuery?: string
  initialSort?: SortKey
  initialPage?: number
  initialMinPrice?: number | null
  initialMaxPrice?: number | null
  initialFlags?: { inStock?: boolean; discount?: boolean; ai?: boolean; popular?: boolean }
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  onUpdateParams: (updates: Record<string, string | number | null | undefined>) => void
}

const PAGE_SIZE = 24

export function CategoryPage({
  slug,
  initialQuery = '',
  initialSort = 'popular',
  initialPage = 1,
  initialMinPrice = null,
  initialMaxPrice = null,
  initialFlags = {},
  onNavigate,
  onUpdateParams,
}: CategoryPageProps) {
  const category = getCategoryBySlug(slug)
  const all = useMemo(() => (category ? getServicesByCategory(category.id) : []), [category])
  const range = useMemo(() => getPriceRange(all), [all])

  const [filter, setFilter] = useState<FilterState>(() => ({
    ...defaultFilter,
    query: initialQuery,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    inStockOnly: !!initialFlags.inStock,
    discountedOnly: !!initialFlags.discount,
    aiOnly: !!initialFlags.ai,
    popularOnly: !!initialFlags.popular,
  }))
  const [sort, setSort] = useState<SortKey>(initialSort)
  const [page, setPage] = useState(initialPage)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    onUpdateParams({
      q: filter.query || null,
      sort: sort === 'popular' ? null : sort,
      page: page > 1 ? page : null,
      min: filter.minPrice ?? null,
      max: filter.maxPrice ?? null,
      stock: filter.inStockOnly ? '1' : null,
      disc: filter.discountedOnly ? '1' : null,
      ai: filter.aiOnly ? '1' : null,
      pop: filter.popularOnly ? '1' : null,
    })
  }, [filter, sort, page, onUpdateParams])

  useEffect(() => {
    setPage(1)
  }, [
    filter.query,
    filter.minPrice,
    filter.maxPrice,
    filter.inStockOnly,
    filter.discountedOnly,
    filter.aiOnly,
    filter.popularOnly,
    sort,
  ])

  const filtered = useMemo(() => applyFilter(all, filter), [all, filter])
  const sorted = useMemo(() => applySort(filtered, sort), [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-[#141413] mb-3">دسته‌بندی پیدا نشد</h1>
        <button
          type="button"
          onClick={() => onNavigate('/categories')}
          className="text-[#c2410c] hover:underline"
        >
          مشاهده همه دسته‌بندی‌ها
        </button>
      </div>
    )
  }

  const Icon = iconFor(category.icon)
  const image = imageForCategory(category.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[
          { label: 'دسته‌بندی‌ها', path: '/categories' },
          { label: category.titleFa },
        ]}
        onNavigate={onNavigate}
      />

      {/* editorial split header: text left, image right */}
      <header className="mt-6 mb-10 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7 lg:col-span-8 order-2 md:order-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
              <Icon size={16} className="text-[#5b5755]" />
            </span>
            {category.titleEn && (
              <span className="text-[11px] uppercase tracking-[0.18em] text-[#8e8a85]">
                {category.titleEn}
              </span>
            )}
          </div>
          <h1 className="font-display mt-3 text-3xl leading-[1.1] text-[#141413] md:text-5xl">
            {category.titleFa}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[#5b5755] md:text-base md:leading-8">
            {category.description ?? `${toPersianDigits(all.length)} سرویس فعال در این دسته`}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#ffffff] px-4 py-2 text-xs text-[#5b5755] ring-1 ring-[#e8e6e0]">
              {toPersianDigits(filtered.length)} از {toPersianDigits(all.length)} سرویس
            </span>
            <SortSelect value={sort} onChange={setSort} />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-full bg-[#ffffff] ring-1 ring-[#e8e6e0] hover:ring-[#141413] text-sm text-[#141413] h-10 px-4 transition-shadow"
            >
              <SlidersHorizontal size={13} />
              فیلترها
            </button>
          </div>
        </div>

        <div className="md:col-span-5 lg:col-span-4 order-1 md:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#f5f3ed] ring-1 ring-[#e8e6e0]">
            <img
              src={image}
              alt={category.titleFa}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3">
          <div className="sticky top-24 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={filter.query}
                onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                placeholder="جستجو در این دسته..."
                className="h-10 w-full rounded-full bg-[#ffffff] pl-3 pr-10 text-sm text-[#141413] placeholder-[#a8a39d] outline-none ring-1 ring-[#e8e6e0] focus:ring-[#141413] transition-shadow"
              />
              <SearchIcon
                size={14}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8e8a85]"
              />
            </div>
            <FilterPanel
              value={filter}
              onChange={setFilter}
              priceMin={range.min}
              priceMax={range.max}
              totalCount={all.length}
              filteredCount={filtered.length}
            />
          </div>
        </aside>

        <main className="lg:col-span-9 xl:col-span-9">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f5] ring-1 ring-[#e8e6e0]">
                <Inbox size={22} className="text-[#5b5755]" />
              </div>
              <h3 className="font-display text-lg text-[#141413] mb-2">نتیجه‌ای پیدا نشد</h3>
              <p className="mb-4 max-w-sm text-sm text-[#5b5755]">
                با فیلترها یا کلمات جستجوی متفاوت دوباره امتحان کنید.
              </p>
              <button
                type="button"
                onClick={() => setFilter(defaultFilter)}
                className="inline-flex items-center gap-2 rounded-full bg-[#141413] px-5 py-2.5 text-sm font-medium text-[#faf9f5] transition-colors hover:bg-[#000000]"
              >
                پاک کردن فیلترها
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
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
        </main>
      </div>

      {/* mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="بستن"
            className="absolute inset-0 bg-[#141413]/40"
          />
          <div className="absolute bottom-0 right-0 left-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#faf9f5] border-t border-[#e8e6e0] p-4 animate-[slide-up_.2s_ease]">
            <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#e8e6e0]" />
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg text-[#141413]">فیلتر و مرتب‌سازی</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#5b5755] hover:bg-[#f5f3ed]"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <label className="mb-1.5 block text-[11px] text-[#5b5755]">جستجو در دسته</label>
              <input
                type="text"
                value={filter.query}
                onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                placeholder="جستجو..."
                className="h-10 w-full rounded-full bg-[#ffffff] px-4 text-sm text-[#141413] placeholder-[#a8a39d] outline-none ring-1 ring-[#e8e6e0] focus:ring-[#141413] transition-shadow"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1.5 block text-[11px] text-[#5b5755]">مرتب‌سازی</label>
              <SortSelect value={sort} onChange={setSort} className="w-full [&>select]:w-full" />
            </div>

            <FilterPanel
              value={filter}
              onChange={setFilter}
              priceMin={range.min}
              priceMax={range.max}
              totalCount={all.length}
              filteredCount={filtered.length}
              onClose={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
