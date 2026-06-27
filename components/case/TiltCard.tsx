"use client"

import React, { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Max tilt angle in degrees (default 8). */
  max?: number
  /** Render the pointer-following glare highlight (default true). */
  glare?: boolean
  /** Scale applied on hover (default 1.02). */
  scale?: number
  /** Border radius for the card + glare overlay (default '1rem'). */
  radius?: string
}

const SPRING = { stiffness: 220, damping: 22 } as const

export default function TiltCard({
  children,
  className,
  style,
  max = 8,
  glare = true,
  scale = 1.02,
  radius = '1rem',
}: TiltCardProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  // --- All hooks declared unconditionally at the top level (Rules of Hooks). ---

  // Normalized pointer position relative to element rect (-0.5 .. 0.5).
  const px = useMotionValue(0)
  const py = useMotionValue(0)

  // Glare position in percent (0 .. 100), centered by default.
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const glareOpacity = useMotionValue(0)

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), SPRING)

  const smoothGlareX = useSpring(gx, SPRING)
  const smoothGlareY = useSpring(gy, SPRING)
  const smoothGlareOpacity = useSpring(glareOpacity, SPRING)

  // Glare background must be derived via a hook — keep it at top level so it is
  // never called conditionally, regardless of the `glare` / `reduce` props.
  const glareBackground: MotionValue<string> = useTransform(
    [smoothGlareX, smoothGlareY] as [MotionValue<number>, MotionValue<number>],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.28), rgba(255,255,255,0) 55%)`
  )

  // Reduced motion: plain static wrapper, no tilt, no glare. Still honor
  // className / style / radius so layout and visuals (border/shadow/glow set by
  // the caller) are fully preserved.
  if (reduce) {
    return (
      <div className={className} style={{ borderRadius: radius, ...style }}>
        {children}
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width // 0..1
    const ny = (e.clientY - rect.top) / rect.height // 0..1
    px.set(nx - 0.5)
    py.set(ny - 0.5)
    gx.set(nx * 100)
    gy.set(ny * 100)
    glareOpacity.set(1)
  }

  const handleMouseEnter = () => {
    glareOpacity.set(1)
  }

  const handleMouseLeave = () => {
    px.set(0)
    py.set(0)
    gx.set(50)
    gy.set(50)
    glareOpacity.set(0)
  }

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale }}
        transition={{ type: 'spring', ...SPRING }}
        className={className}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          borderRadius: radius,
          position: 'relative',
          ...style,
        }}
      >
        {children}

        {glare && (
          <motion.div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: radius,
              pointerEvents: 'none',
              mixBlendMode: 'screen',
              opacity: smoothGlareOpacity,
              background: glareBackground,
              zIndex: 2,
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
