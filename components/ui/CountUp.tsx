'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Count-up number animation triggered on scroll-enter (MASTER: Result metrics).
 * Renders `prefix + animatedValue + suffix`. Honours reduced-motion by jumping
 * straight to the final value.
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 2.3,
  className,
  style,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) { setDisplay(value); return }

    let raf = 0
    let start: number | null = null
    const ease = (t: number) => 1 - Math.pow(1 - t, 3) // easeOutCubic

    const step = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setDisplay(value * ease(p))
      if (p < 1) raf = requestAnimationFrame(step)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, value, duration])

  // Preserve integer vs decimal formatting based on the target value.
  const rounded = Number.isInteger(value) ? Math.round(display) : display.toFixed(1)

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{rounded}{suffix}
    </span>
  )
}
