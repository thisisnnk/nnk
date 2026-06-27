'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  MessageCircle,
  Gauge,
  TrendingDown,
  Users,
  Clock,
  Hourglass,
  Ban,
  FileDown,
  AlertTriangle,
  PenLine,
  Shuffle,
  FileText,
  ListChecks,
  type LucideIcon,
} from 'lucide-react'
import CountUp from '@/components/ui/CountUp'
import type { FindingStat } from '@/lib/case-studies'

/* -------------------------------------------------------------------------- */
/*  FindingsBento — headline-stat mosaic for the Key Findings section.         */
/*                                                                            */
/*  Each tile carries its own accent `color`. Three tones (depth comes from    */
/*  fills/borders, never surface contrast — --bg / --surface are identical):   */
/*    • accent   — solid colour fill (uses `color`), white text + watermark     */
/*    • contrast — inverts black↔white per theme via --text/--bg               */
/*    • surface  — flat bordered tile: colour top-bar, glow, icon chip          */
/*                                                                            */
/*  Spans (lg+ only, so the mobile 2-col grid always packs cleanly):           */
/*    normal 1×1 · wide 2×1 · tall 1×2 · hero 2×2                              */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const
const BRAND = '#00AAFF'

const ICONS: Record<string, LucideIcon> = {
  message: MessageCircle,
  gauge: Gauge,
  'trending-down': TrendingDown,
  users: Users,
  clock: Clock,
  hourglass: Hourglass,
  ban: Ban,
  'file-down': FileDown,
  'alert-triangle': AlertTriangle,
  'pen-line': PenLine,
  shuffle: Shuffle,
  'file-text': FileText,
  'list-checks': ListChecks,
}

const SPAN_CLASS: Record<NonNullable<FindingStat['span']>, string> = {
  normal: '',
  wide: 'lg:col-span-2',
  tall: 'lg:row-span-2',
  hero: 'col-span-2 lg:row-span-2',
  spotlight: 'col-span-2 lg:col-span-1 lg:row-span-3',
  banner: 'col-span-2 lg:col-span-3',
}

type Span = NonNullable<FindingStat['span']>

function isBig(span: Span): boolean {
  return span === 'hero' || span === 'tall' || span === 'spotlight' || span === 'banner'
}

function watermarkSize(span: Span): number {
  if (span === 'banner') return 168
  if (span === 'spotlight') return 200
  if (span === 'hero') return 188
  if (span === 'tall') return 150
  return 124
}

function valueSize(span: Span): string {
  if (span === 'spotlight') return 'clamp(4rem, 9vw, 6.5rem)'
  if (span === 'hero') return 'clamp(3.6rem, 9vw, 5.5rem)'
  if (span === 'tall') return 'clamp(3rem, 7vw, 4.25rem)'
  if (span === 'wide') return 'clamp(2.7rem, 6vw, 3.6rem)'
  return 'clamp(2.2rem, 5.5vw, 2.9rem)'
}

/** Per-tile number-size override (decoupled from span) for typographic rhythm. */
const SIZE_MAP: Record<string, string> = {
  sm: 'clamp(1.85rem, 4.5vw, 2.35rem)',
  md: 'clamp(2.3rem, 5.5vw, 3rem)',
  lg: 'clamp(3rem, 7vw, 4.25rem)',
  xl: 'clamp(3.7rem, 8.5vw, 5.25rem)',
  '2xl': 'clamp(4.4rem, 10vw, 6.75rem)',
}

/** Leading number + suffix so the figure counts up ('2.6/5' → 2.6 + '/5'). */
function parseMetric(value: string): { num: number | null; suffix: string } {
  const match = value.match(/^\s*(-?\d+(?:\.\d+)?)([\s\S]*)$/)
  if (!match) return { num: null, suffix: '' }
  const num = Number(match[1])
  if (!Number.isFinite(num)) return { num: null, suffix: '' }
  return { num, suffix: match[2] }
}

function StatTile({ stat, index }: { stat: FindingStat; index: number }) {
  const reduce = useReducedMotion()
  const span = stat.span ?? 'normal'
  const tone = stat.tone ?? 'surface'
  const c = stat.color ?? BRAND
  const Icon = stat.icon ? ICONS[stat.icon] : undefined
  const big = isBig(span)
  const { num, suffix } = parseMetric(stat.value)

  const filled = tone === 'accent'
  const inverted = tone === 'contrast'
  const surface = !filled && !inverted

  // Resolve the per-tone palette around the tile's accent colour.
  const bg = filled ? c : inverted ? 'var(--text)' : 'var(--surface)'
  const fg = surface ? 'var(--text)' : filled ? '#FFFFFF' : 'var(--bg)'
  const labelColor = surface ? 'var(--text-muted)' : fg
  const noteColor = surface ? 'var(--text-dim)' : fg
  const chipBg = filled ? 'rgba(255,255,255,0.18)' : surface ? `${c}1A` : `${c}26`
  const chipFg = filled ? '#FFFFFF' : c
  const wmColor = surface ? c : fg
  const border = surface
    ? '1px solid var(--border)'
    : filled
      ? '1px solid rgba(255,255,255,0.12)'
      : undefined
  // No glow/shadow — the platform is flat (definition comes from borders + fills).
  const boxShadow = undefined

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-transform duration-200 ease-out hover:-translate-y-0.5 ${
        big ? 'min-h-[200px] sm:min-h-[236px]' : 'min-h-[150px]'
      } ${SPAN_CLASS[span]}`}
      style={{ background: bg, color: fg, border, boxShadow }}
      initial={reduce ? false : { opacity: 0, y: 22, filter: 'blur(8px)' }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.07 }}
    >
      {/* colour top-bar (surface only) */}
      {surface && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${c}, transparent)` }}
        />
      )}

      {/* soft depth wash (filled only) */}
      {filled && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(150deg, rgba(255,255,255,0.08) 0%, transparent 42%, rgba(0,0,0,0.2) 100%)' }}
        />
      )}

      {/* big watermark icon that bleeds off the corner — fills the larger tiles */}
      {Icon && big && (
        <Icon
          aria-hidden
          className="pointer-events-none absolute"
          style={{ right: -18, bottom: -22, width: watermarkSize(span), height: watermarkSize(span), color: wmColor, opacity: filled ? 0.16 : inverted ? 0.12 : 0.1 }}
          strokeWidth={1.25}
        />
      )}

      {/* crisp icon chip, top-right */}
      {Icon && (
        <span
          className="absolute top-5 right-5 z-10 flex items-center justify-center rounded-xl"
          style={{ width: 38, height: 38, background: chipBg, color: chipFg }}
        >
          <Icon style={{ width: 19, height: 19 }} strokeWidth={2} />
        </span>
      )}

      <div
        className="relative z-10 leading-none tracking-tight tabular-nums"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: stat.size ? SIZE_MAP[stat.size] : valueSize(span) }}
      >
        {num !== null ? <CountUp value={num} suffix={suffix} duration={2.3} /> : stat.value}
      </div>

      <div className="relative z-10 mt-4 max-w-[24ch]">
        <p
          className="text-[13px] sm:text-sm font-semibold leading-snug"
          style={{ color: labelColor, opacity: inverted ? 0.92 : 1 }}
        >
          {stat.label}
        </p>
        {stat.note && (
          <p
            className="text-[11px] mt-1.5 leading-snug"
            style={{ color: noteColor, opacity: inverted ? 0.6 : surface ? 1 : 0.72 }}
          >
            {stat.note}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default function FindingsBento({
  items,
  className,
}: {
  items: FindingStat[]
  className?: string
}) {
  return (
    <div
      className={`grid grid-cols-2 lg:grid-cols-3 gap-3 ${className ?? ''}`}
      style={{ gridAutoRows: 'minmax(150px, auto)' }}
    >
      {items.map((stat, i) => (
        <StatTile key={i} stat={stat} index={i} />
      ))}
    </div>
  )
}
