import { useEffect, useState } from 'react'
import { X, RotateCcw, Sparkles, Flame, Percent, CheckCircle2 } from 'lucide-react'
import type { FilterState } from '../lib/data'
import { defaultFilter } from '../lib/data'
import { formatToman } from '../lib/format'

export type FilterPanelProps = {
  value: FilterState
  onChange: (v: FilterState) => void
  priceMin: number
  priceMax: number
  totalCount: number
  filteredCount: number
  className?: string
  onClose?: () => void
}

function CheckRow({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border transition-all text-right ${
        checked
          ? 'bg-[#d4a853]/10 border-[#d4a853]/40 text-white'
          : 'bg-[#0e0f15] border-[#1e1f2a] text-[#9a9baa] hover:border-[#252630]'
      }`}
    >
      <span className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </span>
      <span
        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
          checked ? 'bg-[#d4a853] border-[#d4a853]' : 'border-[#3a3b48]'
        }`}
      >
        {checked && <CheckCircle2 size={12} className="text-[#0b0c10]" />}
      </span>
    </button>
  )
}

export function FilterPanel({
  value,
  onChange,
  priceMin,
  priceMax,
  totalCount,
  filteredCount,
  className,
  onClose,
}: FilterPanelProps) {
  const [localMin, setLocalMin] = useState<string>(value.minPrice?.toString() ?? '')
  const [localMax, setLocalMax] = useState<string>(value.maxPrice?.toString() ?? '')

  useEffect(() => {
    setLocalMin(value.minPrice?.toString() ?? '')
    setLocalMax(value.maxPrice?.toString() ?? '')
  }, [value.minPrice, value.maxPrice])

  const reset = () => onChange({ ...defaultFilter, query: value.query })
  const sliderValue = value.maxPrice ?? priceMax

  return (
    <div
      className={`bg-[#13141a] border border-[#1e1f2a] rounded-2xl ${className ?? ''}`}
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1e1f2a]">
        <div>
          <h3 className="font-bold text-sm text-white">فیلترها</h3>
          <p className="text-[10px] text-[#6b6c78] mt-0.5">
            نمایش {filteredCount.toLocaleString('en-US')} از {totalCount.toLocaleString('en-US')}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            className="p-1.5 rounded-lg text-[#8a8b96] hover:text-white hover:bg-[#1e1f2a] transition-colors"
            aria-label="پاک کردن فیلترها"
            title="پاک کردن فیلترها"
          >
            <RotateCcw size={14} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8a8b96] hover:text-white hover:bg-[#1e1f2a] transition-colors lg:hidden"
              aria-label="بستن"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-5 max-h-[70vh] lg:max-h-none overflow-y-auto">
        {/* quick toggles */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold text-[#6b6c78] uppercase tracking-wider mb-2">
            ویژگی‌ها
          </h4>
          <CheckRow
            label="فقط موجود"
            checked={value.inStockOnly}
            onChange={(v) => onChange({ ...value, inStockOnly: v })}
            icon={<CheckCircle2 size={14} className="text-[#2ec4b6]" />}
          />
          <CheckRow
            label="فقط با تخفیف"
            checked={value.discountedOnly}
            onChange={(v) => onChange({ ...value, discountedOnly: v })}
            icon={<Percent size={14} className="text-[#e63946]" />}
          />
          <CheckRow
            label="فقط هوش مصنوعی"
            checked={value.aiOnly}
            onChange={(v) => onChange({ ...value, aiOnly: v })}
            icon={<Sparkles size={14} className="text-[#9b5de5]" />}
          />
          <CheckRow
            label="فقط محبوب"
            checked={value.popularOnly}
            onChange={(v) => onChange({ ...value, popularOnly: v })}
            icon={<Flame size={14} className="text-[#d4a853]" />}
          />
        </div>

        {/* price range */}
        <div>
          <h4 className="text-[11px] font-bold text-[#6b6c78] uppercase tracking-wider mb-3">
            محدوده قیمت (تومان)
          </h4>
          <div className="flex items-center justify-between text-[11px] text-[#9a9baa] mb-3">
            <span>تا {formatToman(sliderValue)}</span>
            <span>از {formatToman(priceMin)}</span>
          </div>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={Math.max(1, Math.round((priceMax - priceMin) / 200))}
            value={sliderValue}
            onChange={(e) => onChange({ ...value, maxPrice: Number(e.target.value) })}
            className="w-full accent-[#d4a853] cursor-pointer"
            aria-label="حداکثر قیمت"
          />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="space-y-1">
              <label className="text-[10px] text-[#6b6c78] block">حداقل</label>
              <input
                type="number"
                inputMode="numeric"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onBlur={() => {
                  const n = localMin === '' ? null : Number(localMin)
                  onChange({ ...value, minPrice: n != null && !Number.isNaN(n) ? n : null })
                }}
                placeholder={priceMin.toString()}
                className="w-full bg-[#0e0f15] border border-[#252630] rounded-lg h-9 px-3 text-xs text-white outline-none focus:border-[#d4a853] transition-colors"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-[#6b6c78] block">حداکثر</label>
              <input
                type="number"
                inputMode="numeric"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onBlur={() => {
                  const n = localMax === '' ? null : Number(localMax)
                  onChange({ ...value, maxPrice: n != null && !Number.isNaN(n) ? n : null })
                }}
                placeholder={priceMax.toString()}
                className="w-full bg-[#0e0f15] border border-[#252630] rounded-lg h-9 px-3 text-xs text-white outline-none focus:border-[#d4a853] transition-colors"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="w-full flex items-center justify-center gap-2 bg-[#0e0f15] border border-[#1e1f2a] hover:border-[#d4a853]/40 text-[#9a9baa] hover:text-white text-sm h-10 rounded-xl transition-all"
        >
          <RotateCcw size={14} />
          پاک کردن همه فیلترها
        </button>
      </div>
    </div>
  )
}
