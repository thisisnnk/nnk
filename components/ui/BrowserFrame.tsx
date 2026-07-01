'use client'
import { ReactNode } from 'react'
import clsx from 'clsx'

/* macOS-style traffic lights — red / amber / green. */
const DOTS = ['#ff5f57', '#febc2e', '#28c840']

/**
 * Browser window chrome bar — just the macOS traffic-light dots.
 * Rendered on its own so it can be dropped into a custom body (e.g. the pinned
 * featured-projects stage) as well as inside {@link BrowserFrame}. Styling lives
 * in globals.css under the "Browser Frame" section so a single definition is
 * shared across every instance (no per-mount <style> injection).
 */
export function BrowserChrome() {
  return (
    <div className="bf-chrome" aria-hidden>
      <div className="bf-dots">
        {DOTS.map((c) => (
          <span key={c} style={{ background: c }} />
        ))}
      </div>
    </div>
  )
}

/**
 * Reusable floating browser window. Renders the chrome bar and a clipped body —
 * drop an `<Image fill>` or any content inside. Give it a size via `className`
 * (e.g. `aspect-[4/3]`); the body fills whatever space is left below the bar.
 */
export default function BrowserFrame({
  className,
  bodyClassName,
  children,
}: {
  className?: string
  bodyClassName?: string
  children: ReactNode
}) {
  return (
    <div className={clsx('bf-frame', className)}>
      <BrowserChrome />
      <div className={clsx('bf-body', bodyClassName)}>{children}</div>
    </div>
  )
}
