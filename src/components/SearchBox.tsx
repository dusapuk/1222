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
          className="w-full bg-[#16171f] border border-[#252630] rounded-xl h-11 pr-11 pl-10 text-sm text-[#e8e8ed] placeholder-[#505162] outline-none focus:border-[#d4a853] transition-colors"
          aria-label="جستجو"
        />
        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#505162]" size={18} />
        {value && (
          <button
            type="button"
            aria-label="پاک کردن"
            onClick={() => {
              setValue('')
              setActiveIdx(-1)
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#505162] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && value.trim().length >= 2 && (
        <div className="absolute right-0 left-0 top-full mt-2 bg-[#13141a] border border-[#252630] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-[#6b6c78]">نتیجه‌ای یافت نشد</div>
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
                      activeIdx === i ? 'bg-[#1e1f2a]' : 'hover:bg-[#16171f]'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#0e0f15] border border-[#1e1f2a] flex items-center justify-center shrink-0 overflow-hidden">
                      {s.logoUrl ? (
                        <img
                          src={s.logoUrl}
                          alt=""
                          className="max-w-[80%] max-h-[80%] object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Search size={14} className="text-[#505162]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate">
                        {s.titleFa}
                      </div>
                      {s.titleEn && (
                        <div className="text-[10px] text-[#6b6c78] truncate" dir="ltr">
                          {s.titleEn}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
              <li className="border-t border-[#1e1f2a]">
                <button
                  type="button"
                  onClick={() => submit()}
                  className="w-full text-right px-4 py-2.5 text-xs text-[#d4a853] hover:bg-[#16171f] transition-colors font-medium"
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
