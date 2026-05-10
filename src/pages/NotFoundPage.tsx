import { useSEO } from '../hooks/useSEO'
import { seoForNotFound } from '../lib/seoConfig'
import { AppLink } from '../components/AppLink'

export type NotFoundPageProps = {
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
}

export function NotFoundPage({ onNavigate }: NotFoundPageProps) {
  useSEO(
    seoForNotFound(typeof window !== 'undefined' ? window.location.pathname : '/404'),
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <p className="text-xs font-bold text-[#d4a853] mb-2">۴۰۴</p>
      <h1 className="text-3xl md:text-4xl font-black text-white mb-3">صفحه پیدا نشد</h1>
      <p className="text-sm text-[#8a8b96] leading-7 mb-6">
        آدرسی که وارد کرده‌اید وجود ندارد یا ممکن است حذف شده باشد. می‌توانید از صفحه اصلی شروع کنید
        یا از دسته‌بندی‌ها سرویس مورد نظر خود را پیدا کنید.
      </p>
      <div className="flex items-center justify-center gap-3">
        <AppLink
          href="/"
          onNavigate={onNavigate}
          className="bg-[#d4a853] hover:bg-[#c49a48] text-[#0b0c10] font-bold px-6 py-3 rounded-xl text-sm transition-colors no-underline"
        >
          خانه
        </AppLink>
        <AppLink
          href="/categories"
          onNavigate={onNavigate}
          className="border border-[#2a2b35] hover:border-[#d4a853] text-[#c4c5d0] hover:text-white px-6 py-3 rounded-xl text-sm transition-all no-underline"
        >
          مشاهده دسته‌بندی‌ها
        </AppLink>
      </div>
    </div>
  )
}
