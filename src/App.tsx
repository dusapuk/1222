import './App.css'
import { useRoute } from './hooks/useRoute'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { CategoriesPage } from './pages/CategoriesPage'
import { CategoryPage } from './pages/CategoryPage'
import { SearchPage } from './pages/SearchPage'
import { ServiceDetailPage } from './pages/ServiceDetailPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StaticPageView } from './pages/StaticPage'
import type { SortKey } from './lib/data'
import { findStaticPage } from './lib/staticPages'

function parseSort(value: string | null): SortKey {
  switch (value) {
    case 'price-asc':
    case 'price-desc':
    case 'discount':
    case 'name':
    case 'popular':
      return value
    default:
      return 'popular'
  }
}

function parseNumOrNull(v: string | null): number | null {
  if (!v) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function App() {
  const { route, navigate, setParams } = useRoute()

  const renderRoute = () => {
    const path = route.path

    if (path === '/' || path === '') {
      return <HomePage onNavigate={navigate} />
    }

    if (path.startsWith('/c/')) {
      const slug = decodeURIComponent(path.slice(3))
      const params = route.params
      return (
        <CategoryPage
          slug={slug}
          initialQuery={params.get('q') ?? ''}
          initialSort={parseSort(params.get('sort'))}
          initialPage={Number(params.get('page')) || 1}
          initialMinPrice={parseNumOrNull(params.get('min'))}
          initialMaxPrice={parseNumOrNull(params.get('max'))}
          initialFlags={{
            inStock: params.get('stock') === '1',
            discount: params.get('disc') === '1',
            ai: params.get('ai') === '1',
            popular: params.get('pop') === '1',
          }}
          onNavigate={navigate}
          onUpdateParams={setParams}
        />
      )
    }

    if (path.startsWith('/s/')) {
      const slug = decodeURIComponent(path.slice(3))
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />
    }

    if (path === '/categories') {
      return <CategoriesPage onNavigate={navigate} />
    }

    if (path === '/search') {
      return (
        <SearchPage
          query={route.params.get('q') ?? ''}
          initialSort={parseSort(route.params.get('sort'))}
          initialPage={Number(route.params.get('page')) || 1}
          onNavigate={navigate}
          onUpdateParams={setParams}
        />
      )
    }

    // Static content pages (about, contact, privacy, terms, refund, faq, guide).
    // Mapped from the leading path segment so /privacy and /privacy/ both work.
    const slug = path.replace(/^\/+|\/+$/g, '')
    const staticPage = findStaticPage(slug)
    if (staticPage) {
      return <StaticPageView page={staticPage} onNavigate={navigate} />
    }

    return <NotFoundPage onNavigate={navigate} />
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
      <Header onNavigate={navigate} />
      <main className="flex-1">{renderRoute()}</main>
      <Footer onNavigate={navigate} />
    </div>
  )
}

export default App
