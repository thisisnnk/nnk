'use client'
import { useEffect, useRef, useState } from 'react'
import {
  MotionValue,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion'

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Count-up number animation. Two modes:
 *  - default: triggers a fixed-duration count on scroll-enter (viewport trigger).
 *  - scroll-driven: pass `progress` + `range` (a MotionValue and its sub-range,
 *    e.g. from useScroll) to scrub the count directly off scroll position instead
 *    of a timer. Both modes ease out (fast start, slow finish).
 * Honours reduced-motion by jumping straight to the final value.
 */
export default function CountUp({
  value,
  suffix = '',
  prefix = '',
  duration = 2.3,
  progress,
  range,
  className,
  style,
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  progress?: MotionValue<number>
  range?: [number, number]
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const scrollDriven = !!progress && !!range

  const fallbackProgress = useMotionValue(0)
  const rawProgress = useTransform(progress ?? fallbackProgress, range ?? [0, 1], [0, 1], {
    clamp: true,
  })

  useMotionValueEvent(rawProgress, 'change', (t) => {
    if (!scrollDriven || reduce) return
    setDisplay(value * easeOutCubic(t))
  })

  useEffect(() => {
    if (scrollDriven) {
      if (reduce) setDisplay(value)
      return
    }
    if (!inView) return
    if (reduce) { setDisplay(value); return }

    let raf = 0
    let start: number | null = null

    const step = (ts: number) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / (duration * 1000), 1)
      setDisplay(value * easeOutCubic(p))
      if (p < 1) raf = requestAnimationFrame(step)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [scrollDriven, inView, reduce, value, duration])

  // Preserve integer vs decimal formatting based on the target value.
  const rounded = Number.isInteger(value) ? Math.round(display) : display.toFixed(1)

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}{rounded}{suffix}
    </span>
  )
}
