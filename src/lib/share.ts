export type SharePayload = {
  title?: string
  text?: string
  url: string
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'failed'

/**
 * Share via the Web Share API when supported (mobile / modern browsers),
 * otherwise copy the URL to the clipboard. Returns the resolved outcome
 * so the caller can show inline feedback.
 */
export async function share(payload: SharePayload): Promise<ShareResult> {
  if (typeof window === 'undefined') return 'failed'
  const nav = window.navigator as Navigator & {
    share?: (data: SharePayload) => Promise<void>
    canShare?: (data: SharePayload) => boolean
  }
  if (typeof nav.share === 'function' && (!nav.canShare || nav.canShare(payload))) {
    try {
      await nav.share(payload)
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      // Fall through to clipboard fallback on any other error.
    }
  }
  try {
    if (nav.clipboard && typeof nav.clipboard.writeText === 'function') {
      await nav.clipboard.writeText(payload.url)
      return 'copied'
    }
  } catch {
    // Continue to manual fallback.
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = payload.url
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok ? 'copied' : 'failed'
  } catch {
    return 'failed'
  }
}
