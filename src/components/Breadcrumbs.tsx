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
    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-[#5b5755]">
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="inline-flex items-center gap-1 transition-colors hover:text-[#c2410c]"
      >
        <Home size={12} />
        خانه
      </button>
      {items.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          <ChevronLeft size={11} className="text-[#a8a39d]" />
          {c.path ? (
            <button
              type="button"
              onClick={() => onNavigate(c.path!)}
              className="transition-colors hover:text-[#c2410c]"
            >
              {c.label}
            </button>
          ) : (
            <span className="font-medium text-[#141413]">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
