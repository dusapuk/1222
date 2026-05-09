import raw from '../data/marketplace.json'

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

type Marketplace = {
  categories: Category[]
  services: Service[]
  plans: Plan[]
}

const data = raw as unknown as Marketplace

export const categories: Category[] = data.categories
export const services: Service[] = data.services
export const plans: Plan[] = data.plans ?? []

const categoryById = new Map<string, Category>()
const categoryBySlug = new Map<string, Category>()
const serviceBySlug = new Map<string, Service>()
const servicesByCategory = new Map<string, Service[]>()
const plansByService = new Map<string, Plan[]>()

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

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u064b-\u065f]/g, '') // arabic diacritics
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
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
      arr.sort((a, b) => (b.fromPriceIrt ?? -1) - (a.fromPriceIrt ?? -1))
      break
    case 'discount':
      arr.sort((a, b) => getDiscountPct(b) - getDiscountPct(a))
      break
    case 'name':
      arr.sort((a, b) => a.titleFa.localeCompare(b.titleFa, 'fa'))
      break
    case 'popular':
    default:
      arr.sort((a, b) => {
        const pa = (a.isPopular ? 1 : 0) - (b.isPopular ? 1 : 0)
        if (pa !== 0) return -pa
        const ip = (a.inStock ? 1 : 0) - (b.inStock ? 1 : 0)
        if (ip !== 0) return -ip
        return b.planCount - a.planCount
      })
      break
  }
  return arr
}

export function getPriceRange(list: Service[]): { min: number; max: number } {
  let min = Infinity
  let max = 0
  for (const s of list) {
    if (s.fromPriceIrt == null) continue
    if (s.fromPriceIrt < min) min = s.fromPriceIrt
    if (s.fromPriceIrt > max) max = s.fromPriceIrt
  }
  if (!isFinite(min)) min = 0
  return { min, max }
}

/* derive a few "featured" services per category for the home page */
export function getFeaturedServices(limit = 8): Service[] {
  const featured: Service[] = []
  const perCategory = new Map<string, number>()
  // pick services with discount first, sorted by discount pct
  const withDiscount = [...services]
    .filter((s) => getDiscountPct(s) > 0 && s.inStock)
    .sort((a, b) => getDiscountPct(b) - getDiscountPct(a))
  for (const s of withDiscount) {
    const n = perCategory.get(s.categoryId) ?? 0
    if (n >= 2) continue
    perCategory.set(s.categoryId, n + 1)
    featured.push(s)
    if (featured.length >= limit) break
  }
  if (featured.length < limit) {
    for (const s of services) {
      if (!s.inStock) continue
      if (featured.includes(s)) continue
      featured.push(s)
      if (featured.length >= limit) break
    }
  }
  return featured.slice(0, limit)
}

export function getPopularServices(limit = 12): Service[] {
  return [...services]
    .filter((s) => s.inStock)
    .sort((a, b) => {
      const pa = (a.isPopular ? 1 : 0) - (b.isPopular ? 1 : 0)
      if (pa !== 0) return -pa
      return b.planCount - a.planCount
    })
    .slice(0, limit)
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
