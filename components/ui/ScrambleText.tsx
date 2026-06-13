'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const CHARS = '!<>-_\\/[]{}—=+*^?#01010'

/**
 * Scramble / glitch-to-clear text effect (MASTER: "How I Solve Problems"
 * heading). Characters resolve left-to-right on scroll-enter. Reduced-motion
 * users see the final text immediately.
 */
export default function ScrambleText({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useReducedMotion()
  const [output, setOutput] = useState(text)

  useEffect(() => {
    if (!inView) return
    if (reduce) { setOutput(text); return }

    const total = text.length
    const revealEvery = 2 // animation frames before the next char locks in
    let frame = 0
    let raf = 0

    const step = () => {
      const revealed = Math.floor(frame / revealEvery)
      let out = ''
      for (let i = 0; i < total; i++) {
        const ch = text[i]
        if (ch === ' ' || ch === '\n') { out += ch; continue }
        out += i < revealed ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      setOutput(out)
      frame++
      if (revealed <= total) raf = requestAnimationFrame(step)
      else setOutput(text)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduce, text])

  return (
    <span ref={ref} className={className} style={style}>
      {output}
    </span>
  )
}
