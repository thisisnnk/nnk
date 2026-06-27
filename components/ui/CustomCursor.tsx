'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, [role="button"]'

export default function CustomCursor() {
  const pathname = usePathname()
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const rafRef = useRef<number>(0)
  const [enabled, setEnabled] = useState(false)

  // The Creatives page renders its own grab/grabbing cursor — don't double up.
  const disabled = pathname?.startsWith('/creatives') ?? false

  useEffect(() => {
    if (disabled) {
      setEnabled(false)
      return
    }
    // Only run on devices with a real hovering, fine pointer (skip touch).
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) {
      setEnabled(false)
      return
    }
    setEnabled(true)

    // Hide the dot while scrolling (the pointer is stationary, so it would
    // otherwise float over the content like a stray circle) and when the pointer
    // leaves the window. It reappears the instant the mouse moves again.
    const show = () => { if (dotRef.current) dotRef.current.style.opacity = '' }
    const hide = () => { if (dotRef.current) dotRef.current.style.opacity = '0' }

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      show()
    }

    // Event delegation: any element added after mount (route changes, modals,
    // drawers) is covered without re-querying the DOM.
    const over = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) {
        dotRef.current?.classList.add('hovering')
      }
    }
    const out = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.(INTERACTIVE)) {
        dotRef.current?.classList.remove('hovering')
      }
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    document.addEventListener('mouseleave', hide)
    window.addEventListener('scroll', hide, { passive: true })
    window.addEventListener('wheel', hide, { passive: true })

    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 5}px, ${pos.current.y - 5}px)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('scroll', hide)
      window.removeEventListener('wheel', hide)
      cancelAnimationFrame(rafRef.current)
    }
  }, [disabled])

  if (disabled || !enabled) return null

  return <div ref={dotRef} className="cursor-dot" />
}
