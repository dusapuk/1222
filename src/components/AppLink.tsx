import { forwardRef, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from 'react'

/**
 * In-app navigation link.
 *
 * Renders a real `<a href="...">` so search engines (and accessibility
 * tools, and right-click "open in new tab") see a proper hyperlink — but
 * intercepts plain left-clicks to call the SPA navigate handler instead
 * of triggering a full page reload. This is the same pattern React Router's
 * `<Link>` uses internally.
 *
 * Modifier-clicks (cmd/ctrl/shift/alt, middle button, target=_blank, etc.)
 * fall through to native browser behaviour so users can still open links
 * in a new tab. Default-prevented events are also left alone so callers
 * can compose their own `onClick` handlers without breaking the link.
 *
 * Usage:
 *   <AppLink href="/c/ai-assistants" onNavigate={navigate}>...</AppLink>
 *
 * Pass `params` to append query string fragments (preserves URL semantics
 * for cmd-click) — kept out of `href` if undefined so the canonical URL
 * stays clean.
 */
export type AppLinkProps = {
  href: string
  onNavigate: (path: string, params?: Record<string, string | number | null | undefined>) => void
  params?: Record<string, string | number | null | undefined>
  children?: ReactNode
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  }

function buildHref(path: string, params?: Record<string, string | number | null | undefined>): string {
  if (!params) return path
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue
    sp.set(k, String(v))
  }
  const qs = sp.toString()
  return qs ? `${path}?${qs}` : path
}

function isModifiedEvent(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink(
  { href, onNavigate, params, onClick, target, children, ...rest },
  ref,
) {
  const fullHref = buildHref(href, params)

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    onClick?.(event)
    if (event.defaultPrevented) return
    if (target && target !== '_self') return
    if (isModifiedEvent(event)) return
    event.preventDefault()
    onNavigate(href, params)
  }

  return (
    <a ref={ref} href={fullHref} onClick={handleClick} target={target} {...rest}>
      {children}
    </a>
  )
})
