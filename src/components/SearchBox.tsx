import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { searchServices } from '../lib/data'
import type { Service } from '../lib/data'

export type SearchBoxProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  placeholder?: string
  className?: string
}

export function SearchBox({ onNavigate, placeholder, className }: SearchBoxProps) {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const ref = useRef<HTMLDivElement>(null)

  const suggestions: Service[] = useMemo(() => {
    if (value.trim().length < 2) return []
    return searchServices(value.trim(), 8)
  }, [value])

  useEffect(() => {
    const onClickOut = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOut)
    return () => document.removeEventListener('mousedown', onClickOut)
  }, [])

  const submit = (qOverride?: string) => {
    const q = (qOverride ?? value).trim()
    if (!q) return
    setOpen(false)
    onNavigate('/search', { q })
  }

  return (
    <div ref={ref} className={`relative w-full ${className ?? ''}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
            setActiveIdx(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              if (activeIdx >= 0 && suggestions[activeIdx]) {
                onNavigate('/s/' + suggestions[activeIdx].slug)
                setOpen(false)
              } else {
                submit()
              }
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActiveIdx((i) => Math.min(suggestions.length - 1, i + 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActiveIdx((i) => Math.max(-1, i - 1))
            } else if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
          placeholder={placeholder ?? 'جستجوی سرویس، گیفت کارت، اشتراک...'}
          className="h-11 w-full rounded-full bg-[#ffffff] pl-10 pr-11 text-sm text-[#141413] placeholder-[#a8a39d] outline-none ring-1 ring-[#e8e6e0] transition-shadow focus:ring-[#141413]"
          aria-label="جستجو"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e8a85]" size={16} />
        {value && (
          <button
            type="button"
            aria-label="پاک کردن"
            onClick={() => {
              setValue('')
              setActiveIdx(-1)
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8e8a85] transition-colors hover:text-[#141413]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && value.trim().length >= 2 && (
        <div className="absolute right-0 left-0 top-full mt-2 z-50 overflow-hidden rounded-[12px] bg-[#ffffff] ring-1 ring-[#e8e6e0]">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[#5b5755]">نتیجه‌ای یافت نشد</div>
          ) : (
            <ul role="listbox" className="max-h-[60vh] overflow-y-auto">
              {suggestions.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => {
                      onNavigate('/s/' + s.slug)
                      setOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-right transition-colors ${
                      activeIdx === i ? 'bg-[#faf9f5]' : 'hover:bg-[#faf9f5]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-[8px] bg-[#faf9f5] ring-1 ring-[#e8e6e0] flex items-center justify-center shrink-0 overflow-hidden">
                      {s.logoUrl ? (
                        <img
                          src={s.logoUrl}
                          alt=""
                          className="max-w-[80%] max-h-[80%] object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Search size={14} className="text-[#8e8a85]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-[#141413] truncate">
                        {s.titleFa}
                      </div>
                      {s.titleEn && (
                        <div className="text-[10px] text-[#5b5755] truncate" dir="ltr">
                          {s.titleEn}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
              <li className="border-t border-[#e8e6e0]">
                <button
                  type="button"
                  onClick={() => submit()}
                  className="w-full text-right px-4 py-2.5 text-xs font-medium text-[#c2410c] transition-colors hover:bg-[#fef2e9]"
                >
                  مشاهده همه نتایج برای «{value}»
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
