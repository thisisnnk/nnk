'use client'

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import TiltCard from '@/components/case/TiltCard'

/* ------------------------------------------------------------------ */
/*  Shared                                                            */
/* ------------------------------------------------------------------ */

const EASE = [0.16, 1, 0.3, 1] as const

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/* ------------------------------------------------------------------ */
/*  BentoGrid                                                         */
/* ------------------------------------------------------------------ */

type BentoCols = 2 | 3 | 4 | 6

export interface BentoGridProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Number of columns on md+ screens. Mobile is always 2-up. */
  cols?: BentoCols
}

/**
 * Literal Tailwind class map so the JIT compiler never purges the
 * responsive column classes (they must appear verbatim in source).
 */
const COL_CLASS: Record<BentoCols, string> = {
  2: 'grid grid-cols-2 md:grid-cols-2 gap-3',
  3: 'grid grid-cols-2 md:grid-cols-3 gap-3',
  4: 'grid grid-cols-2 md:grid-cols-4 gap-3',
  6: 'grid grid-cols-2 md:grid-cols-6 gap-3',
}

export function BentoGrid({ children, className, style, cols = 4 }: BentoGridProps) {
  const colClass = COL_CLASS[cols] ?? COL_CLASS[4]
  return (
    <div
      className={cx(colClass, className)}
      style={{ gridAutoRows: 'minmax(0, auto)', ...style }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BentoCard                                                         */
/* ------------------------------------------------------------------ */

export interface BentoCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** Grid column span (md+). */
  colSpan?: number
  /** Grid row span. */
  rowSpan?: number
  /** Per-item accent hex (e.g. '#8b5cf6') for top border + glow tint. */
  accent?: string
  /** Render the accent radial glow. Default true. */
  glow?: boolean
  /** 3D tilt on hover. Disabled automatically under reduced motion. */
  tilt?: boolean
  /** Apply internal padding. Default true. */
  padded?: boolean
}

export function BentoCard({
  children,
  className,
  style,
  colSpan = 1,
  rowSpan = 1,
  accent,
  glow = true,
  tilt = true,
  padded = true,
}: BentoCardProps) {
  const reduce = useReducedMotion()

  // Spans live on the OUTER wrapper so they participate in the grid.
  const spanStyle: React.CSSProperties = {
    gridColumn: `span ${colSpan}`,
    gridRow: `span ${rowSpan}`,
    ...style,
  }

  const hasAccent = Boolean(accent)
  const showGlow = hasAccent && glow

  // Tile surface: subtle gradient over --surface, always a visible border
  // (depth comes from border + shadow, never surface contrast in light mode).
  const tileStyle: React.CSSProperties = {
    background:
      'linear-gradient(160deg, var(--surface) 0%, var(--surface-2) 100%)',
    border: '1px solid var(--border)',
    boxShadow: showGlow
      ? `0 1px 2px rgba(0,0,0,0.04), 0 18px 40px -24px ${accent}55`
      : '0 1px 2px rgba(0,0,0,0.04), 0 18px 40px -28px rgba(0,0,0,0.22)',
  }

  const tile = (
    <div
      className={cx(
        'relative h-full w-full overflow-hidden rounded-2xl isolate',
        padded && 'p-6 md:p-7',
        className,
      )}
      style={tileStyle}
    >
      {/* Accent top border (2px) */}
      {hasAccent && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      )}

      {/* Accent radial glow */}
      {showGlow && (
        <span
          aria-hidden
          className="pointer-events-none absolute -z-10 h-56 w-56 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            top: '-22%',
            left: '50%',
            background: `radial-gradient(circle, ${accent}40 0%, ${accent}10 45%, transparent 72%)`,
          }}
        />
      )}

      {/* Always-present soft sheen so cards read in flat light mode */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-2xl"
        style={{
          background:
            'radial-gradient(120% 80% at 50% -10%, var(--accent-glow) 0%, transparent 55%)',
          opacity: showGlow ? 0 : 0.5,
        }}
      />

      {/* Content sits above decorative layers */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )

  // Reveal-on-enter wrapper (fade + rise + blur), honoring reduced motion.
  const revealed = reduce ? (
    <div className="h-full">{tile}</div>
  ) : (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {tile}
    </motion.div>
  )

  // Tilt wrap only when enabled and motion is allowed.
  const inner =
    tilt && !reduce ? (
      <TiltCard className="h-full" max={7} radius="1rem">
        {revealed}
      </TiltCard>
    ) : (
      revealed
    )

  return <div style={spanStyle}>{inner}</div>
}

export default BentoGrid
