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
import { iconFor, colorForCategory, imageForCategory } from '../lib/icons'
import { toPersianDigits } from '../lib/format'
import { useSEO } from '../hooks/useSEO'
import { seoForCategory, seoForCategoryNotFound } from '../lib/seoConfig'

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

  // sync filter / sort / page back to URL
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

  // reset page when filters change
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

  useSEO(
    category
      ? seoForCategory({
          category,
          services: visible.length > 0 ? visible : all,
          categoryImage: imageForCategory(slug),
          page: safePage,
        })
      : seoForCategoryNotFound(slug),
  )

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-white mb-3">دسته‌بندی پیدا نشد</h1>
        <button
          type="button"
          onClick={() => onNavigate('/categories')}
          className="text-[#d4a853] hover:underline"
        >
          مشاهده همه دسته‌بندی‌ها
        </button>
      </div>
    )
  }

  const Icon = iconFor(category.icon)
  const color = colorForCategory(category.slug)
  const image = imageForCategory(category.slug)

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <Breadcrumbs
        items={[
          { label: 'دسته‌بندی‌ها', path: '/categories' },
          { label: category.titleFa },
        ]}
        onNavigate={onNavigate}
      />

      <header className="relative mt-5 mb-6 overflow-hidden rounded-2xl ring-1 ring-[#1e1f2a] bg-[#0e0f15]">
        {/* Mobile: full-bleed banner with overlay text (image keeps its native aspect) */}
        <div className="relative md:hidden">
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={image}
              alt={category.titleFa}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 mix-blend-multiply"
              style={{ background: `linear-gradient(135deg, ${color}40 0%, #0b0c10cc 100%)` }}
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-3/4"
              style={{
                background:
                  'linear-gradient(to top, rgba(8,9,14,0.96) 0%, rgba(8,9,14,0.7) 35%, rgba(8,9,14,0.18) 75%, rgba(8,9,14,0) 100%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl backdrop-blur-md"
                style={{
                  background: `${color}30`,
                  border: `1px solid ${color}66`,
                  boxShadow: `0 6px 22px -8px ${color}aa`,
                }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <div className="min-w-0">
                {category.titleEn && (
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    {category.titleEn}
                  </span>
                )}
                <h1 className="text-2xl font-black leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  خرید {category.titleFa}
                </h1>
                <p className="mt-1 line-clamp-1 text-xs text-white/70">
                  {category.description ?? `${toPersianDigits(all.length)} سرویس`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-4 border-t border-[#1e1f2a]">
            <span
              className="rounded-xl px-3 py-2 text-xs font-bold"
              style={{
                background: `${color}1f`,
                color,
                border: `1px solid ${color}55`,
              }}
            >
              {toPersianDigits(filtered.length)} از {toPersianDigits(all.length)} سرویس
            </span>
            <SortSelect value={sort} onChange={setSort} />
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#13141a] border border-[#252630] hover:border-[#d4a853]/40 text-sm text-white rounded-xl h-10 px-4 transition-colors"
            >
              <SlidersHorizontal size={14} />
              فیلترها
            </button>
          </div>
        </div>

        {/* Desktop: split layout with image card on the right at its native aspect */}
        <div className="hidden md:grid md:grid-cols-12 md:items-stretch">
          <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between gap-5 p-7">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `${color}26`,
                  border: `1px solid ${color}55`,
                  boxShadow: `0 6px 22px -8px ${color}88`,
                }}
              >
                <Icon size={22} style={{ color }} />
              </div>
              <div className="min-w-0">
                {category.titleEn && (
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
                    {category.titleEn}
                  </span>
                )}
                <h1 className="text-2xl font-black leading-tight text-white md:text-3xl">
                  خرید {category.titleFa}
                </h1>
                <p className="mt-1 line-clamp-2 text-xs text-white/70">
                  {category.description ?? `${toPersianDigits(all.length)} سرویس`}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-xl px-3 py-2 text-xs font-bold"
                style={{
                  background: `${color}1f`,
                  color,
                  border: `1px solid ${color}55`,
                }}
              >
                {toPersianDigits(filtered.length)} از {toPersianDigits(all.length)} سرویس
              </span>
              <SortSelect value={sort} onChange={setSort} />
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-[#13141a] border border-[#252630] hover:border-[#d4a853]/40 text-sm text-white rounded-xl h-10 px-4 transition-colors"
              >
                <SlidersHorizontal size={14} />
                فیلترها
              </button>
            </div>
          </div>

          <div className="relative md:col-span-5 lg:col-span-4 overflow-hidden bg-[#0b0c10]">
            <div className="relative h-full w-full aspect-[4/3] md:aspect-auto md:min-h-[220px]">
              <img
                src={image}
                alt={category.titleFa}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-multiply"
                style={{ background: `linear-gradient(225deg, ${color}33 0%, transparent 60%)` }}
              />
              <div
                aria-hidden
                className="absolute inset-y-0 right-0 w-1/3"
                style={{
                  background:
                    'linear-gradient(to left, rgba(14,15,21,0.85) 0%, rgba(14,15,21,0) 100%)',
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3">
          <div className="sticky top-20 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={filter.query}
                onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                placeholder="جستجو در این دسته..."
                className="w-full bg-[#13141a] border border-[#252630] rounded-xl h-10 pr-10 pl-3 text-sm text-white placeholder-[#505162] outline-none focus:border-[#d4a853] transition-colors"
              />
              <SearchIcon
                size={14}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#505162]"
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
            <div className="flex flex-col items-center justify-center py-20 text-center bg-[#13141a] border border-[#1e1f2a] rounded-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#1e1f2a] flex items-center justify-center mb-4">
                <Inbox size={24} className="text-[#505162]" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">نتیجه‌ای پیدا نشد</h3>
              <p className="text-sm text-[#8a8b96] mb-4 max-w-sm">
                با فیلترها یا کلمات جستجوی متفاوت دوباره امتحان کنید.
              </p>
              <button
                type="button"
                onClick={() => setFilter(defaultFilter)}
                className="bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="absolute bottom-0 right-0 left-0 max-h-[85vh] overflow-y-auto bg-[#0b0c10] rounded-t-3xl border-t border-[#1e1f2a] p-4 animate-[slide-up_.2s_ease]">
            <div className="w-12 h-1.5 bg-[#252630] rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-base text-white">فیلتر و مرتب‌سازی</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-lg text-[#8a8b96] hover:bg-[#1e1f2a]"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-3">
              <label className="text-[11px] text-[#6b6c78] block mb-1.5">جستجو در دسته</label>
              <input
                type="text"
                value={filter.query}
                onChange={(e) => setFilter({ ...filter, query: e.target.value })}
                placeholder="جستجو..."
                className="w-full bg-[#13141a] border border-[#252630] rounded-xl h-10 px-3 text-sm text-white outline-none focus:border-[#d4a853]"
              />
            </div>
            <div className="mb-3">
              <label className="text-[11px] text-[#6b6c78] block mb-1.5">مرتب‌سازی</label>
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

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="w-full mt-3 bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold h-11 rounded-xl text-sm"
            >
              نمایش {toPersianDigits(filtered.length)} نتیجه
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
