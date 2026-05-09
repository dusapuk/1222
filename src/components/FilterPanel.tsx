import { useEffect, useState } from 'react'
import { X, RotateCcw, Sparkles, Flame, Percent, CheckCircle2, Check } from 'lucide-react'
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
      className={`flex w-full items-center justify-between gap-2 rounded-[12px] px-3 py-2.5 text-right transition-colors ring-1 ${
        checked
          ? 'bg-[#fef2e9] ring-[#fbd4b8] text-[#141413]'
          : 'bg-[#ffffff] ring-[#e8e6e0] text-[#5b5755] hover:ring-[#dad7d0]'
      }`}
    >
      <span className="flex items-center gap-2 text-sm">
        {icon}
        {label}
      </span>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-[4px] transition-colors ${
          checked ? 'bg-[#141413] text-[#faf9f5]' : 'ring-1 ring-[#dad7d0]'
        }`}
      >
        {checked && <Check size={11} />}
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
      className={`overflow-hidden rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0] ${className ?? ''}`}
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#e8e6e0]">
        <div>
          <h3 className="font-display text-base text-[#141413]">فیلترها</h3>
          <p className="mt-0.5 text-[10px] text-[#5b5755]">
            نمایش {filteredCount.toLocaleString('en-US')} از {totalCount.toLocaleString('en-US')}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#5b5755] transition-colors hover:bg-[#faf9f5] hover:text-[#141413]"
            aria-label="پاک کردن فیلترها"
            title="پاک کردن فیلترها"
          >
            <RotateCcw size={14} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#5b5755] transition-colors hover:bg-[#faf9f5] hover:text-[#141413] lg:hidden"
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
          <h4 className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[#8e8a85]">
            ویژگی‌ها
          </h4>
          <CheckRow
            label="فقط موجود"
            checked={value.inStockOnly}
            onChange={(v) => onChange({ ...value, inStockOnly: v })}
            icon={<CheckCircle2 size={14} className="text-[#5b5755]" />}
          />
          <CheckRow
            label="فقط با تخفیف"
            checked={value.discountedOnly}
            onChange={(v) => onChange({ ...value, discountedOnly: v })}
            icon={<Percent size={14} className="text-[#5b5755]" />}
          />
          <CheckRow
            label="فقط هوش مصنوعی"
            checked={value.aiOnly}
            onChange={(v) => onChange({ ...value, aiOnly: v })}
            icon={<Sparkles size={14} className="text-[#5b5755]" />}
          />
          <CheckRow
            label="فقط محبوب"
            checked={value.popularOnly}
            onChange={(v) => onChange({ ...value, popularOnly: v })}
            icon={<Flame size={14} className="text-[#5b5755]" />}
          />
        </div>

        {/* price range */}
        <div>
          <h4 className="mb-3 text-[10px] uppercase tracking-[0.16em] text-[#8e8a85]">
            محدوده قیمت (تومان)
          </h4>
          <div className="mb-3 flex items-center justify-between text-[11px] text-[#5b5755]">
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
            className="w-full cursor-pointer"
            aria-label="حداکثر قیمت"
          />
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="space-y-1">
              <label className="block text-[10px] text-[#5b5755]">حداقل</label>
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
                className="w-full rounded-[8px] bg-[#faf9f5] ring-1 ring-[#e8e6e0] focus:ring-[#141413] h-9 px-3 text-xs text-[#141413] outline-none transition-shadow"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] text-[#5b5755]">حداکثر</label>
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
                className="w-full rounded-[8px] bg-[#faf9f5] ring-1 ring-[#e8e6e0] focus:ring-[#141413] h-9 px-3 text-xs text-[#141413] outline-none transition-shadow"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={reset}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ffffff] ring-1 ring-[#e8e6e0] hover:ring-[#141413] text-[#141413] text-sm h-10 transition-shadow"
        >
          <RotateCcw size={13} />
          پاک کردن همه فیلترها
        </button>
      </div>
    </div>
  )
}
