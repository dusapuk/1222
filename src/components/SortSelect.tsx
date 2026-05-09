import { ChevronDown, ArrowUpDown } from 'lucide-react'
import type { SortKey } from '../lib/data'

const options: { value: SortKey; label: string }[] = [
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'price-asc', label: 'ارزان‌ترین' },
  { value: 'price-desc', label: 'گران‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
  { value: 'name', label: 'حروف الفبا' },
]

export type SortSelectProps = {
  value: SortKey
  onChange: (v: SortKey) => void
  className?: string
}

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  return (
    <div className={`relative inline-flex items-center ${className ?? ''}`}>
      <ArrowUpDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5b5755] pointer-events-none"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none rounded-full bg-[#ffffff] ring-1 ring-[#e8e6e0] hover:ring-[#dad7d0] text-sm text-[#141413] h-10 pr-9 pl-9 cursor-pointer transition-shadow focus:outline-none focus:ring-[#141413]"
        aria-label="مرتب سازی"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5b5755] pointer-events-none"
      />
    </div>
  )
}
