/**
 * Per-service user reviews loader.
 *
 * Pikart wants `aggregateRating` + `review` rich-result eligibility on
 * service pages, but Google's review-snippet guidelines explicitly
 * forbid fabricated ratings. So we ship the schema, the loader and the
 * UI, but no review data — until real verified reviews are imported,
 * the JSON-LD `aggregateRating` field is omitted entirely and the
 * "نظرات کاربران" UI section doesn't render.
 *
 * Operator workflow:
 *   1. Collect verified reviews (post-purchase email/SMS).
 *   2. Drop a JSON file at `public/data/reviews/<service-slug>.json`
 *      with the schema documented in `public/data/reviews/README.md`.
 *   3. Next build picks them up — `aggregateRating` lights up once at
 *      least 3 verified reviews exist.
 */

export type ServiceReview = {
  /** Author display name. Falls back to "کاربر پی‌کارت" in the LD. */
  author?: string
  /** ISO date the review was published. */
  datePublished?: string
  /** Integer 1..5 inclusive. */
  rating: number
  /** Persian review body. */
  body?: string
  /**
   * Whether the reviewer was verified (e.g. order-confirmed). Defaults
   * to true — operators are expected to only ship verified rows. Set
   * to false to keep a record but exclude it from aggregate snippets.
   */
  verified?: boolean
}

export type ServiceReviewsBundle = {
  slug: string
  reviews: ServiceReview[]
}

const reviewSyncCache = new Map<string, ServiceReview[] | null>()
const reviewAsyncCache = new Map<string, Promise<ServiceReview[] | null>>()

/**
 * Synchronously seed the per-service review cache. Used by the Node
 * prerender step so `productLd()` can read reviews from a sync getter
 * during SSR (mirrors the per-service-detail seed pattern).
 */
export function seedServiceReviews(slug: string, reviews: ServiceReview[] | null): void {
  reviewSyncCache.set(slug, reviews)
  if (reviews !== null || !reviewAsyncCache.has(slug)) {
    reviewAsyncCache.set(slug, Promise.resolve(reviews))
  }
}

/**
 * Synchronous read of seeded reviews. Returns `undefined` when nothing
 * has been seeded; callers should then defer to `loadServiceReviews`.
 */
export function getCachedServiceReviews(
  slug: string,
): ServiceReview[] | null | undefined {
  return reviewSyncCache.get(slug)
}

/**
 * Lazy fetch of `/data/reviews/<slug>.json`. Cached per-slug. On 404 /
 * network error resolves to null so the caller can render the page
 * without reviews (the file is intentionally absent for services
 * without reviews — we don't want to commit empty files everywhere).
 */
export function loadServiceReviews(slug: string): Promise<ServiceReview[] | null> {
  const cached = reviewAsyncCache.get(slug)
  if (cached) return cached
  if (typeof fetch === 'undefined') {
    const p = Promise.resolve<ServiceReview[] | null>(null)
    reviewAsyncCache.set(slug, p)
    return p
  }
  const p = fetch(`/data/reviews/${encodeURIComponent(slug)}.json`)
    .then((r) => (r.ok ? (r.json() as Promise<ServiceReviewsBundle | ServiceReview[]>) : null))
    .then((data) => normalizeReviews(data))
    .catch(() => null)
  reviewAsyncCache.set(slug, p)
  return p
}

/**
 * Accept either the wrapper format (`{slug, reviews: [...]}`) or a raw
 * array. Returns `null` when the payload is empty / malformed so calls
 * upstream can early-exit.
 */
function normalizeReviews(
  data: ServiceReviewsBundle | ServiceReview[] | null,
): ServiceReview[] | null {
  if (!data) return null
  const list = Array.isArray(data) ? data : data.reviews
  if (!Array.isArray(list) || list.length === 0) return null
  return list.filter((r) => Number.isFinite(r.rating) && r.rating >= 1 && r.rating <= 5)
}

/**
 * Compute average rating for visible UI display. Returns null when
 * there aren't enough verified reviews to surface (matches the
 * 3-review threshold used by `productLd`).
 */
export function summarizeReviews(reviews: ServiceReview[] | null | undefined): {
  count: number
  average: number
} | null {
  if (!reviews || reviews.length < 3) return null
  const verified = reviews.filter(
    (r) => r.verified !== false && r.rating > 0 && r.rating <= 5,
  )
  if (verified.length < 3) return null
  const sum = verified.reduce((acc, r) => acc + r.rating, 0)
  return {
    count: verified.length,
    average: Math.round((sum / verified.length) * 10) / 10,
  }
}
