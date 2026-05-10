/**
 * Runtime marketplace data store.
 *
 * Historically `marketplace.json` (~3.9 MB raw, ~440 KB gzip) was
 * statically imported, which baked the catalogue into the JS bundle and
 * blew the initial bundle up to 4.2 MB. We now serve it as a separate
 * static asset (`/data/marketplace.json`) and fetch it once at startup
 * via `initMarketplaceData()` in `main.tsx`. The browser caches it
 * independently of our JS, and the JS bundle stays small.
 *
 * Pages keep using the same synchronous getters (`getServiceBySlug`,
 * `getServicesByCategory`, ...). They will just see an empty catalogue
 * until `initMarketplaceData()` resolves; the loader in `main.tsx`
 * blocks the React mount on that promise.
 */

export type Category = {
  id: string
  slug: string
  titleFa: string
  titleEn: string | null
  description: string | null
  icon: string | null
  sortOrder: number
  isActive: boolean
}

export type Service = {
  id: string
  slug: string
  titleFa: string
  titleEn: string | null
  shortDescriptionFa: string | null
  categoryId: string
  logoUrl: string | null
  brandColor: string | null
  tags: string[]
  isAi: boolean
  isFeatured: boolean
  deliveryTimeFa: string | null
  fromPriceIrt: number | null
  maxPriceIrt: number | null
  compareAtIrt: number | null
  planCount: number
  isPopular: boolean
  inStock: boolean
}

export type PlanRequiredField = {
  name: string
  type: string
  label: string
  required: boolean
}

export type Plan = {
  id: string
  serviceId: string
  titleFa: string
  titleEn: string | null
  durationDays: number | null
  credits: number | null
  region: string | null
  accountType: string | null
  priceIrt: number | null
  compareAtIrt: number | null
  isPopular: boolean
  isActive: boolean
  sortOrder: number
  stockStatus: string | null
  requiredFields: PlanRequiredField[] | null
  features: Record<string, unknown> | null
}

export type Marketplace = {
  categories: Category[]
  services: Service[]
  plans: Plan[]
}

/**
 * Rich per-service payload, fetched lazily from
 * `/data/services/<slug>.json` when the user opens a product detail
 * page. Kept out of the main catalogue to avoid bloating browse pages.
 */
export type ServiceDetail = {
  slug: string
  descriptionFa?: string | null
  seoTitleFa?: string | null
  seoDescriptionFa?: string | null
  requirementsFa?: string | null
  instructionsFa?: string | null
  faq?: { question: string; answer: string }[] | null
}

// Mutable module-level stores. Empty until `initMarketplaceData()` runs.
export let categories: Category[] = []
export let services: Service[] = []
export let plans: Plan[] = []

const categoryById = new Map<string, Category>()
const categoryBySlug = new Map<string, Category>()
const serviceBySlug = new Map<string, Service>()
const servicesByCategory = new Map<string, Service[]>()
const plansByService = new Map<string, Plan[]>()

let dataReady = false

export function isMarketplaceReady(): boolean {
  return dataReady
}

export function setMarketplaceData(data: Marketplace): void {
  categories = data.categories ?? []
  services = data.services ?? []
  plans = data.plans ?? []

  categoryById.clear()
  categoryBySlug.clear()
  serviceBySlug.clear()
  servicesByCategory.clear()
  plansByService.clear()

  for (const c of categories) {
    categoryById.set(c.id, c)
    categoryBySlug.set(c.slug, c)
  }
  for (const s of services) {
    serviceBySlug.set(s.slug, s)
    const arr = servicesByCategory.get(s.categoryId) ?? []
    arr.push(s)
    servicesByCategory.set(s.categoryId, arr)
  }
  for (const p of plans) {
    const arr = plansByService.get(p.serviceId) ?? []
    arr.push(p)
    plansByService.set(p.serviceId, arr)
  }
  for (const arr of plansByService.values()) {
    arr.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  dataReady = true
}

let pending: Promise<void> | null = null

/**
 * Fetch /data/marketplace.json and populate the in-memory stores.
 * Idempotent — concurrent calls share the same promise.
 */
export function initMarketplaceData(): Promise<void> {
  if (dataReady) return Promise.resolve()
  if (pending) return pending
  pending = fetch('/data/marketplace.json')
    .then((r) => {
      if (!r.ok) throw new Error(`marketplace fetch ${r.status}`)
      return r.json() as Promise<Marketplace>
    })
    .then(setMarketplaceData)
  return pending
}

const serviceDetailCache = new Map<string, Promise<ServiceDetail | null>>()
const serviceDetailSyncCache = new Map<string, ServiceDetail | null>()

/**
 * Synchronously seed the per-service detail cache. Used by both:
 *   - the Node prerender step (so `renderToString(<ServiceDetailPage />)`
 *     emits the long description + FAQ in the static HTML), and
 *   - the client bootstrap (reads the `<script id="__SERVICE_DETAIL__">`
 *     payload that the prerender inlined, so hydration starts with the
 *     same data and produces no mismatch).
 */
export function seedServiceDetail(slug: string, detail: ServiceDetail | null): void {
  serviceDetailSyncCache.set(slug, detail)
  if (detail !== null || !serviceDetailCache.has(slug)) {
    serviceDetailCache.set(slug, Promise.resolve(detail))
  }
}

/**
 * Synchronous read of the seeded per-service detail. Returns `undefined`
 * when nothing has been seeded yet (callers fall back to `loadServiceDetail`).
 */
export function getCachedServiceDetail(slug: string): ServiceDetail | null | undefined {
  return serviceDetailSyncCache.get(slug)
}

/**
 * Fetch /data/services/<slug>.json. Cached forever — the file is static
 * and per-build. On 404 / network failure we resolve to null so callers
 * can render the basic page without rich data.
 */
export function loadServiceDetail(slug: string): Promise<ServiceDetail | null> {
  const cached = serviceDetailCache.get(slug)
  if (cached) return cached
  if (typeof fetch === 'undefined') {
    // Node SSR without an injected fetch: nothing to load.
    const p = Promise.resolve<ServiceDetail | null>(null)
    serviceDetailCache.set(slug, p)
    return p
  }
  const p = fetch(`/data/services/${encodeURIComponent(slug)}.json`)
    .then((r) => (r.ok ? (r.json() as Promise<ServiceDetail>) : null))
    .catch(() => null)
  serviceDetailCache.set(slug, p)
  return p
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categoryBySlug.get(slug)
}

export function getCategoryById(id: string): Category | undefined {
  return categoryById.get(id)
}

export function getServiceBySlug(slug: string): Service | undefined {
  return serviceBySlug.get(slug)
}

export function getServicesByCategory(categoryId: string): Service[] {
  return servicesByCategory.get(categoryId) ?? []
}

export function getCategoryServiceCount(categoryId: string): number {
  return servicesByCategory.get(categoryId)?.length ?? 0
}

export function getPlansByService(serviceId: string): Plan[] {
  return plansByService.get(serviceId) ?? []
}

export function getPlanDiscountPct(p: Plan): number {
  if (!p.compareAtIrt || !p.priceIrt) return 0
  if (p.compareAtIrt <= p.priceIrt) return 0
  return Math.round(((p.compareAtIrt - p.priceIrt) / p.compareAtIrt) * 100)
}

export function getDiscountPct(s: Service): number {
  if (!s.compareAtIrt || !s.fromPriceIrt) return 0
  if (s.compareAtIrt <= s.fromPriceIrt) return 0
  return Math.round(((s.compareAtIrt - s.fromPriceIrt) / s.compareAtIrt) * 100)
}

export type SortKey =
  | 'popular'
  | 'price-asc'
  | 'price-desc'
  | 'discount'
  | 'name'

export type FilterState = {
  query: string
  minPrice: number | null
  maxPrice: number | null
  inStockOnly: boolean
  discountedOnly: boolean
  aiOnly: boolean
  popularOnly: boolean
}

export const defaultFilter: FilterState = {
  query: '',
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  discountedOnly: false,
  aiOnly: false,
  popularOnly: false,
}

// Map Persian (۰-۹) and Arabic-Indic (٠-٩) digits to Latin (0-9) so
// "خرید گیفت کارت ۱۲۰۰ تومان" and "1200 toman" match the same record.
const PERSIAN_DIGIT_MAP: Record<string, string> = {
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064b-\u065f]/g, '') // arabic diacritics
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰-۹٠-٩]/g, (d) => PERSIAN_DIGIT_MAP[d] ?? d)
    .trim()
}

export function applyFilter(list: Service[], f: FilterState): Service[] {
  const q = f.query ? normalize(f.query) : ''
  return list.filter((s) => {
    if (f.inStockOnly && !s.inStock) return false
    if (f.discountedOnly && getDiscountPct(s) <= 0) return false
    if (f.aiOnly && !s.isAi) return false
    if (f.popularOnly && !s.isPopular) return false
    if (f.minPrice != null && (s.fromPriceIrt ?? 0) < f.minPrice) return false
    if (f.maxPrice != null && (s.fromPriceIrt ?? Infinity) > f.maxPrice) return false
    if (q) {
      const hay = normalize(
        `${s.titleFa} ${s.titleEn ?? ''} ${s.shortDescriptionFa ?? ''} ${s.slug}`,
      )
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function applySort(list: Service[], key: SortKey): Service[] {
  const arr = [...list]
  switch (key) {
    case 'price-asc':
      arr.sort((a, b) => (a.fromPriceIrt ?? Infinity) - (b.fromPriceIrt ?? Infinity))
      break
    case 'price-desc':
      arr.sort((a, b) => (b.fromPriceIrt ?? -Infinity) - (a.fromPriceIrt ?? -Infinity))
      break
    case 'discount':
      arr.sort((a, b) => getDiscountPct(b) - getDiscountPct(a))
      break
    case 'name':
      arr.sort((a, b) => a.titleFa.localeCompare(b.titleFa, 'fa'))
      break
    case 'popular':
    default:
      arr.sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) ||
          Number(b.isPopular) - Number(a.isPopular) ||
          (a.fromPriceIrt ?? Infinity) - (b.fromPriceIrt ?? Infinity),
      )
      break
  }
  return arr
}

export function getPriceRange(list: Service[]): { min: number; max: number } {
  let min = Infinity
  let max = -Infinity
  for (const s of list) {
    if (s.fromPriceIrt != null) {
      if (s.fromPriceIrt < min) min = s.fromPriceIrt
      if (s.fromPriceIrt > max) max = s.fromPriceIrt
    }
    if (s.maxPriceIrt != null && s.maxPriceIrt > max) max = s.maxPriceIrt
  }
  if (!isFinite(min)) min = 0
  if (!isFinite(max)) max = 0
  return { min, max }
}

export function getFeaturedServices(limit = 8): Service[] {
  return services.filter((s) => s.isFeatured).slice(0, limit)
}

export function getPopularServices(limit = 12): Service[] {
  return services.filter((s) => s.isPopular).slice(0, limit)
}

export function searchServices(q: string, limit = 8): Service[] {
  const n = normalize(q)
  if (!n) return []
  const out: { s: Service; score: number }[] = []
  for (const s of services) {
    const t = normalize(s.titleFa)
    const tEn = normalize(s.titleEn ?? '')
    const sl = normalize(s.slug)
    let score = 0
    if (t.startsWith(n) || tEn.startsWith(n) || sl.startsWith(n)) score += 5
    else if (t.includes(n) || tEn.includes(n) || sl.includes(n)) score += 3
    else {
      const desc = normalize(s.shortDescriptionFa ?? '')
      if (desc.includes(n)) score += 1
    }
    if (s.isPopular) score += 1
    if (score > 0) out.push({ s, score })
  }
  out.sort((a, b) => b.score - a.score)
  return out.slice(0, limit).map((x) => x.s)
}
