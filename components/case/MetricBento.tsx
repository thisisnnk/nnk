'use client'

import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import CountUp from '@/components/ui/CountUp'
import TiltCard from '@/components/case/TiltCard'
import { Reveal } from '@/components/case/Reveal'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export interface MetricItem {
  value: string
  label: string
  /** Per-item accent HEX (e.g. '#8b5cf6'); falls back to --accent. */
  color?: string
  /** Optional "before" value shown struck-through above the number. */
  before?: string
}

export interface MetricBentoProps {
  items: MetricItem[]
  /** 2 | 3 | 4 columns on md+ screens. Defaults to 3. */
  columns?: 2 | 3 | 4
  className?: string
}

export interface StatTileProps {
  item: MetricItem
  /** Stagger delay (seconds) for the reveal. */
  delay?: number
}

/** Literal class map so Tailwind can statically detect the grid classes. */
const COLS: Record<2 | 3 | 4, string> = {
  2: 'grid grid-cols-2 md:grid-cols-2',
  3: 'grid grid-cols-2 md:grid-cols-3',
  4: 'grid grid-cols-2 md:grid-cols-4',
}

/**
 * Splits a metric string into its leading numeric portion and the remaining
 * suffix. Returns `num: null` when there's no clean leading integer/decimal.
 *
 * '35% -> 0'  => { num: 35,  suffix: '% -> 0' }
 * '14 days'   => { num: 14,  suffix: ' days' }
 * '2.5x'      => { num: 2.5, suffix: 'x' }
 * '∞'         => { num: null, suffix: '' }
 */
function parseMetric(value: string): { num: number | null; suffix: string } {
  // Use [\s\S] rather than the `s` (dotAll) flag, which needs target es2018+.
  const match = value.match(/^\s*(-?\d+(?:\.\d+)?)([\s\S]*)$/)
  if (!match) return { num: null, suffix: '' }

  const num = Number(match[1])
  if (!Number.isFinite(num)) return { num: null, suffix: '' }

  return { num, suffix: match[2] }
}

const numberStyle = (color: string): React.CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
  lineHeight: 1,
  letterSpacing: '-0.03em',
  color,
})

/** True when the value is a literal HEX color we can append an alpha suffix to. */
function isHex(color: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)
}

/**
 * Build the radial accent glow safely. Per-item HEX colors get an alpha suffix
 * (e.g. '#8b5cf6' -> '#8b5cf614'); the '--accent' fallback uses the token
 * '--accent-glow' / '--accent-dim' so we never emit invalid `var(--accent)14`.
 */
function glowGradient(isHexColor: boolean, color: string): string {
  if (isHexColor) {
    return `radial-gradient(120% 90% at 50% 18%, ${color}24 0%, ${color}12 30%, transparent 64%)`
  }
  return 'radial-gradient(120% 90% at 50% 18%, var(--accent-glow) 0%, var(--accent-dim) 30%, transparent 64%)'
}

/**
 * A single polished bento stat tile: glowing number with optional count-up,
 * a struck-through "before" value, a muted label, and a 3D tilt on hover.
 */
export function StatTile({ item, delay = 0 }: StatTileProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  const hex = Boolean(item.color && isHex(item.color))
  const color = hex ? (item.color as string) : 'var(--accent)'
  const { num, suffix } = parseMetric(item.value)

  return (
    <TiltCard
      max={reduce ? 0 : 6}
      scale={reduce ? 1 : 1.02}
      radius="1rem"
      className="h-full"
    >
      <motion.div
        ref={ref}
        initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={
          inView
            ? { opacity: 1, y: 0, filter: 'blur(0px)' }
            : undefined
        }
        transition={{ duration: 0.7, ease: EASE, delay }}
        className="relative h-full overflow-hidden rounded-2xl p-8 text-center md:p-10"
        style={{
          background: 'var(--surface)',
          border: hex ? `1px solid ${color}35` : '1px solid var(--border)',
          // Depth via soft shadow + accent glow (flat light-mode surfaces give
          // no surface-vs-bg contrast, so this carries the elevation).
          boxShadow: hex
            ? `0 1px 2px rgba(0,0,0,0.04), 0 14px 40px -22px ${color}55`
            : '0 1px 2px rgba(0,0,0,0.04), 0 14px 40px -22px var(--accent-glow)',
        }}
      >
        {/* Faint radial accent glow behind the number. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: glowGradient(hex, color) }}
        />

        <div className="relative flex flex-col items-center gap-2.5">
          {/* "Before" value — struck-through, low opacity, same hue. */}
          {item.before && (
            <span
              className="text-sm font-semibold line-through"
              style={{ color, opacity: 0.4, fontFamily: 'var(--font-display)' }}
            >
              {item.before}
            </span>
          )}

          {/* Big number — count-up when a clean leading number exists. */}
          {num !== null ? (
            <span style={numberStyle(color)}>
              <CountUp value={num} suffix={suffix} duration={1.6} />
            </span>
          ) : (
            <Reveal>
              <span style={numberStyle(color)}>{item.value}</span>
            </Reveal>
          )}

          {/* Label — muted caption beneath the number. */}
          <span
            className="label-muted mt-1"
            style={{ color: 'var(--text-dim)' }}
          >
            {item.label}
          </span>
        </div>
      </motion.div>
    </TiltCard>
  )
}

/**
 * Responsive bento board of animated metric tiles. Numbers count up on enter
 * (reduced-motion safe via CountUp + tilt disabled). Depth comes from borders,
 * soft surface, and per-item accent glow — works in flat light mode.
 */
export default function MetricBento({
  items,
  columns = 3,
  className,
}: MetricBentoProps) {
  const wrap = COLS[columns] ?? COLS[3]

  return (
    <div className={[wrap, 'gap-3', className].filter(Boolean).join(' ')}>
      {items.map((item, i) => (
        <StatTile
          key={`${item.label}-${i}`}
          item={item}
          delay={i * 0.08}
        />
      ))}
    </div>
  )
}
