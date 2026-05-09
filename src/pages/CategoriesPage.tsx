import { categories, getCategoryServiceCount, getFeaturedServices, services } from '../lib/data'
import { CategoryCard } from '../components/CategoryCard'
import { ProductCard } from '../components/ProductCard'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { toPersianDigits } from '../lib/format'

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

      <header className="mt-6 mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
            کاتالوگ
          </span>
          <h1 className="font-display mt-1 text-3xl text-[#141413] md:text-5xl">
            همه دسته‌بندی‌ها
          </h1>
          <p className="mt-3 text-sm leading-7 text-[#5b5755] md:text-base md:leading-8">
            {toPersianDigits(categories.length)} دسته‌بندی،{' '}
            {toPersianDigits(totalServices.toLocaleString('en-US'))} سرویس فعال — هر چیزی که برای زندگی دیجیتال نیاز داری.
          </p>
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
        <section className="mt-12">
          <div className="hairline mb-6" />
          <div className="mb-6 flex items-end justify-between">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#c2410c]">
                ویژه
              </span>
              <h2 className="font-display mt-1 text-2xl text-[#141413] md:text-3xl">
                پیشنهادهای ویژه
              </h2>
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
