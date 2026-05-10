const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
}

/** Format an integer rial (toman) value with Persian digits and ٬ thousands. */
export function formatToman(value: number | null | undefined): string {
  if (value == null) return '—'
  // toman is what the dump uses; thousands separator
  const withSep = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '٬')
  return toPersianDigits(withSep)
}

export function formatPercent(value: number): string {
  return `${toPersianDigits(value)}٪`
}

export function formatCount(value: number): string {
  return toPersianDigits(value.toLocaleString('en-US'))
}
