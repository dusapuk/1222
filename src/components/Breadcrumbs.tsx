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
  return (
    <nav className="flex items-center gap-1 text-xs text-[#6b6c78] flex-wrap">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="flex items-center gap-1 hover:text-[#d4a853] transition-colors"
      >
        <Home size={12} />
        خانه
      </button>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronLeft size={12} className="text-[#3a3b48]" />
          {c.path ? (
            <button
              type="button"
              onClick={() => onNavigate(c.path!)}
              className="hover:text-[#d4a853] transition-colors"
            >
              {c.label}
            </button>
          ) : (
            <span className="text-white font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
