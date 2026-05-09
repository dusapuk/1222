import { categories, getCategoryServiceCount, getFeaturedServices, services } from '../lib/data'
import { CategoryCard } from '../components/CategoryCard'
import { ProductCard } from '../components/ProductCard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { toPersianDigits } from '../lib/format'
import { Layers } from 'lucide-react'

export type CategoriesPageProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const featured = getFeaturedServices(8)
  const totalServices = services.length

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs
        items={[{ label: 'دسته‌بندی‌ها' }]}
        onNavigate={onNavigate}
      />

      <header className="mt-5 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-1 h-7 bg-[#d4a853] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-black text-white">همه دسته‌بندی‌ها</h1>
          </div>
          <p className="text-sm text-[#8a8b96] leading-7">
            {toPersianDigits(categories.length)} دسته‌بندی،{' '}
            {toPersianDigits(totalServices.toLocaleString('en-US'))} سرویس فعال — هر چیزی که برای زندگی دیجیتال نیاز داری
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-[#d4a853] bg-[#d4a853]/10 px-3 py-2 rounded-lg border border-[#d4a853]/20">
          <Layers size={14} />
          {toPersianDigits(categories.length)} دسته‌بندی
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-12">
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            count={getCategoryServiceCount(c.id)}
            onClick={(slug) => onNavigate('/c/' + slug)}
          />
        ))}
      </section>

      {featured.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="w-1 h-6 bg-[#e63946] rounded-full" />
              <h2 className="text-xl font-black text-white">پیشنهادهای ویژه</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {featured.map((s) => (
              <ProductCard
                key={s.id}
                service={s}
                onClick={() => onNavigate('/s/' + s.slug)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
