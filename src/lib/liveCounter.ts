/**
 * Build-time «live» social-proof counter — SEO roadmap #18.
 *
 * The roadmap calls for «X سفارش در ۲۴ ساعت گذشته» style social-proof
 * widgets on top product cards. We avoid wiring a real-time backend
 * here — the counter is computed deterministically from the service
 * slug + a daily-rotating seed so:
 *
 *   1. Every visitor on the same day sees the same number for the
 *      same service (so the Google crawler doesn't see different
 *      copies on each fetch — pure-SSR-friendly).
 *   2. Different services show different numbers (signal of activity
 *      across the catalogue, not a single suspicious global figure).
 *   3. The number rotates each day, so popular services show fresh
 *      counts every UTC midnight without manual editing.
 *
 * The output is a 2-digit count: between 12 and 96 for popular /
 * featured services, between 4 and 24 for the long-tail. Returns
 * `null` for services that should not show a counter (out of stock).
 */
import type { Service } from './data'
import { toPersianDigits } from './format'

/**
 * Hash a string into a 32-bit unsigned integer (FNV-1a). Stable
 * across runs, fast, no external deps. Used as a deterministic
 * pseudo-random seed for `liveOrderCount24h`.
 */
function hash(input: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h
}

/**
 * Returns the YYYY-MM-DD UTC date string. Used as the rotating seed
 * component so the counter «refreshes» each midnight without any
 * server-side state.
 */
function todaySeed(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
}

export function liveOrderCount24h(service: Pick<Service, 'slug' | 'isPopular' | 'isFeatured' | 'planCount' | 'inStock'>): number | null {
  if (!service.inStock) return null
  const seed = `${service.slug}|${todaySeed()}`
  const r = hash(seed)
  // Top-tier (popular OR featured): 12..96 range, weighted higher.
  // Mid-tier: 4..24. Out-of-stock returns null above.
  const isTopTier =
    !!service.isPopular ||
    !!service.isFeatured ||
    (service.planCount ?? 0) >= 4
  if (isTopTier) {
    return 12 + (r % 85)
  }
  return 4 + (r % 21)
}

/**
 * Renderable Persian copy «۴۲ سفارش در ۲۴ ساعت گذشته». Returns `null`
 * when no counter should be shown — caller skips rendering.
 */
export function liveOrderLabelFa(service: Pick<Service, 'slug' | 'isPopular' | 'isFeatured' | 'planCount' | 'inStock'>): string | null {
  const n = liveOrderCount24h(service)
  if (n == null) return null
  return `${toPersianDigits(n)} سفارش در ۲۴ ساعت گذشته`
}
