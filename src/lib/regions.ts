/**
 * Per-service / per-category multi-region overrides. The default
 * marketplace serves Iran (IR) — emitted everywhere via
 * `Product.audience.geographicArea` and `Offer.eligibleRegion`. Some
 * services genuinely target a wider customer base (Persian speakers in
 * Turkey / UAE / Afghanistan / Tajikistan) and Google rewards explicit
 * multi-region hints with the «Available in your country» badge in
 * SERP.
 *
 * This file is the single source of truth for those overrides. Edit
 * `CATEGORY_REGIONS` to add / remove regions for an entire vertical;
 * use `SERVICE_REGIONS` for fine-grained per-slug overrides (which take
 * precedence). Both maps return ISO 3166-1 alpha-2 country codes.
 *
 * Iran (IR) is always included implicitly — the helper functions below
 * inject it as the first entry, so the map only needs to list the
 * EXTRA regions a service serves.
 */
import type { Category, Service } from './data'

/** ISO 3166-1 alpha-2 country code → human-readable name (Persian + English). */
const COUNTRY_NAMES: Record<string, { fa: string; en: string }> = {
  IR: { fa: 'ایران', en: 'Iran' },
  TR: { fa: 'ترکیه', en: 'Turkey' },
  AE: { fa: 'امارات متحده عربی', en: 'United Arab Emirates' },
  AF: { fa: 'افغانستان', en: 'Afghanistan' },
  TJ: { fa: 'تاجیکستان', en: 'Tajikistan' },
  AZ: { fa: 'آذربایجان', en: 'Azerbaijan' },
  IQ: { fa: 'عراق', en: 'Iraq' },
  AM: { fa: 'ارمنستان', en: 'Armenia' },
  GE: { fa: 'گرجستان', en: 'Georgia' },
}

export type RegionRef = {
  code: string
  nameFa: string
  nameEn: string
}

function buildRegionRef(code: string): RegionRef | null {
  const meta = COUNTRY_NAMES[code]
  if (!meta) return null
  return { code, nameFa: meta.fa, nameEn: meta.en }
}

/**
 * Category-level extra regions. Streaming / music sell well to the
 * Persian-speaking diaspora in Turkey + UAE; education + ai-* serve
 * the same audience plus students in Afghanistan / Tajikistan.
 *
 * Categories not listed here implicitly have no extra regions beyond
 * Iran (which is always added by the helpers below).
 */
const CATEGORY_REGIONS: Record<string, string[]> = {
  streaming: ['TR', 'AE', 'AF'],
  music: ['TR', 'AE', 'AF'],
  'ai-assistants': ['TR', 'AE', 'AF', 'TJ', 'IQ'],
  'ai-image': ['TR', 'AE', 'AF', 'TJ'],
  'ai-video': ['TR', 'AE', 'AF', 'TJ'],
  'ai-voice-music': ['TR', 'AE', 'AF', 'TJ'],
  'ai-writing-seo': ['TR', 'AE', 'AF', 'TJ'],
  education: ['TR', 'AE', 'AF', 'TJ', 'IQ'],
  'cloud-storage': ['TR', 'AE', 'AF'],
  'productivity-work': ['TR', 'AE'],
  'design-creative': ['TR', 'AE'],
  'developer-tools': ['TR', 'AE'],
  'social-communication': ['TR', 'AE', 'AF'],
  'business-marketing': ['TR', 'AE'],
}

/**
 * Per-service overrides — apply on top of (and replace) the category
 * default when the service has region-specific gotchas. Empty by
 * default — the category map is the right level for most services.
 */
const SERVICE_REGIONS: Record<string, string[]> = {}

/**
 * Resolve the full list of regions a service is sold in. Iran is
 * ALWAYS first (the canonical region); category extras come next; any
 * per-service override entirely replaces the category list (so the
 * operator can opt out of a region for a single service).
 *
 * Returns at minimum `[{ code: 'IR', ... }]` — never an empty array,
 * never duplicates.
 */
export function getServiceRegions(args: {
  service: Service
  category?: Category
}): RegionRef[] {
  const { service, category } = args
  const seen = new Set<string>()
  const out: RegionRef[] = []
  const ir = buildRegionRef('IR')!
  out.push(ir)
  seen.add('IR')

  const override = SERVICE_REGIONS[service.slug]
  const codes =
    override ?? (category ? CATEGORY_REGIONS[category.slug] ?? [] : [])

  for (const code of codes) {
    if (seen.has(code)) continue
    const ref = buildRegionRef(code)
    if (!ref) continue
    seen.add(code)
    out.push(ref)
  }

  return out
}

/**
 * Convenience — comma-separated Persian region names for use in human
 * copy («ارسال به ایران، ترکیه، امارات»). Kept separate from
 * getServiceRegions() so JSON-LD callers don't pay for Persian
 * formatting they don't need.
 */
export function formatRegionsFa(regions: RegionRef[]): string {
  return regions.map((r) => r.nameFa).join('، ')
}
