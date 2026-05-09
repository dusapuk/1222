import { ChevronLeft, Home } from 'lucide-react'

export type Crumb = {
  label: string
  path?: string
}

export type BreadcrumbsProps = {
  items: Crumb[]
  onNavigate: (path: string) => void
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  // Build full crumb list including the implicit Home root.
  const all: Crumb[] = [{ label: 'خانه', path: '/' }, ...items]
  return (
    <nav aria-label="مسیر صفحه" className="text-xs text-[#6b6c78]">
      <ol className="flex items-center gap-1 flex-wrap m-0 p-0 list-none">
        {all.map((c, i) => {
          const isLast = i === all.length - 1
          const isHome = i === 0
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronLeft size={12} className="text-[#3a3b48]" aria-hidden />}
              {c.path && !isLast ? (
                <button
                  type="button"
                  onClick={() => onNavigate(c.path!)}
                  className="flex items-center gap-1 hover:text-[#d4a853] transition-colors"
                >
                  {isHome && <Home size={12} aria-hidden />}
                  {c.label}
                </button>
              ) : (
                <span
                  className={
                    isLast
                      ? 'text-white font-medium flex items-center gap-1'
                      : 'flex items-center gap-1'
                  }
                  aria-current={isLast ? 'page' : undefined}
                >
                  {isHome && <Home size={12} aria-hidden />}
                  {c.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
