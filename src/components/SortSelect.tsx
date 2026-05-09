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
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6c78] pointer-events-none"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none bg-[#13141a] border border-[#252630] hover:border-[#d4a853]/40 text-sm text-white rounded-xl h-10 pr-9 pl-9 cursor-pointer transition-colors focus:outline-none focus:border-[#d4a853]"
        aria-label="مرتب سازی"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#13141a]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6c78] pointer-events-none"
      />
    </div>
  )
}
