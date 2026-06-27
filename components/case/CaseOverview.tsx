'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  Briefcase,
  Users,
  Clock,
  Monitor,
  ShieldCheck,
  FileText,
  Layers,
  Database,
  Code2,
  Wrench,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import CountUp from '@/components/ui/CountUp'
import { Reveal, Stagger, StaggerItem } from '@/components/case/Reveal'
import type { OverviewMetaCard, OverviewScaleItem, OverviewOutcomeItem } from '@/lib/case-studies'

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Icon registry ─────────────────────────────────────── */

const ICONS: Record<string, LucideIcon> = {
  Briefcase, Users, Clock, Monitor, ShieldCheck,
  FileText, Layers, Database, Code2, Wrench,
  TrendingDown, TrendingUp,
}

function Icon({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) {
  const Comp = ICONS[name]
  if (!Comp) return null
  return <Comp size={size} className={className} />
}

/**
 * Split a signed metric like "↓ 88%", "+42 pts", "2.5 hrs" into a leading
 * prefix (arrows / sign), a numeric core that can count up, and a suffix.
 * Returns num:null when there is no clean numeric core to animate.
 */
function parseSigned(raw: string): { prefix: string; num: number | null; suffix: string } {
  const m = raw.match(/^([^\d-]*?)(-?\d+(?:\.\d+)?)([\s\S]*)$/)
  if (!m) return { prefix: '', num: null, suffix: raw }
  const num = Number(m[2])
  if (!Number.isFinite(num)) return { prefix: m[1] ?? '', num: null, suffix: m[3] ?? '' }
  return { prefix: m[1] ?? '', num, suffix: m[3] ?? '' }
}

/* ── Meta card ─────────────────────────────────────────── */

// One variant set drives BOTH the staggered entrance (hidden→show, controlled
// by the parent Stagger) and the hover lift (hov). Living on the grid cell
// itself keeps every card stretched to equal row height.
const META_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE } },
  hov: { y: -5, boxShadow: '0 22px 46px -26px rgba(0,170,255,0.45)' },
}
const META_ICON_HOVER: Variants = {
  hov: { scale: 1.14, rotate: -8 },
}

function MetaCard({ card }: { card: OverviewMetaCard }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      variants={META_VARIANTS}
      whileHover={reduce ? undefined : 'hov'}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <motion.div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(0,170,255,0.10)', border: '1px solid rgba(0,170,255,0.18)' }}
        variants={META_ICON_HOVER}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      >
        <Icon name={card.icon} size={17} className="text-[var(--accent)]" />
      </motion.div>
      <div>
        <p
          className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1.5"
          style={{ color: 'var(--text-dim)' }}
        >
          {card.label}
        </p>
        <p className="text-base font-semibold leading-snug mb-1" style={{ color: 'var(--text)' }}>
          {card.value}
        </p>
        {card.sub && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {card.sub}
          </p>
        )}
      </div>
    </motion.div>
  )
}

/* ── Scale item ────────────────────────────────────────── */

function ScaleItem({ item, last }: { item: OverviewScaleItem; last: boolean }) {
  const reduce = useReducedMotion()
  const { prefix, num, suffix } = parseSigned(String(item.n))
  return (
    <StaggerItem
      className="flex flex-col items-center text-center py-6 px-4"
      style={{ borderRight: last ? 'none' : '1px solid var(--border)' }}
      y={14}
    >
      <motion.div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
        style={{ background: 'rgba(0,170,255,0.08)', border: '1px solid rgba(0,170,255,0.15)' }}
        whileHover={reduce ? undefined : { scale: 1.15, rotate: -6 }}
        transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      >
        <Icon name={item.icon} size={14} className="text-[var(--accent)]" />
      </motion.div>
      <span
        className="font-display font-bold leading-none mb-2"
        style={{ fontSize: '2.4rem', letterSpacing: '-0.03em', color: 'var(--text)' }}
      >
        {num !== null ? <CountUp value={num} prefix={prefix} suffix={suffix} duration={2.3} /> : item.n}
      </span>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {item.label}
      </span>
    </StaggerItem>
  )
}

/* ── Chip ──────────────────────────────────────────────── */

function Chip({ label }: { label: string }) {
  const reduce = useReducedMotion()
  return (
    <StaggerItem y={10}>
      <motion.span
        className="inline-block text-xs px-3 py-1.5 rounded-full"
        style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
        whileHover={reduce ? undefined : { y: -2, borderColor: 'var(--accent)', color: 'var(--accent)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        {label}
      </motion.span>
    </StaggerItem>
  )
}

/* ── Outcome metric ────────────────────────────────────── */

function OutcomeItem({ item, first }: { item: OverviewOutcomeItem; first: boolean }) {
  const isDown = item.n.startsWith('↓')
  const isUp   = item.n.startsWith('+') || item.n.startsWith('↑')
  const { prefix, num, suffix } = parseSigned(item.n)
  return (
    <StaggerItem
      className="flex-1 py-2 px-6"
      style={
        first
          ? undefined
          : { borderLeft: '1px solid rgba(255,255,255,0.08)' }
      }
      y={16}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-display font-semibold"
          style={{ fontSize: '1.75rem', lineHeight: 1, color: '#9FE1CB' }}
        >
          {num !== null ? <CountUp value={num} prefix={prefix} suffix={suffix} duration={2.6} /> : item.n}
        </span>
        {isDown && <TrendingDown size={16} style={{ color: '#5DCAA5', flexShrink: 0 }} />}
        {isUp   && <TrendingUp   size={16} style={{ color: '#5DCAA5', flexShrink: 0 }} />}
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: '#E1F5EE' }}>
        {item.label}
      </p>
      <p className="text-xs" style={{ color: '#1D9E75' }}>
        {item.sub}
      </p>
    </StaggerItem>
  )
}

/* ── Main component ────────────────────────────────────── */

export default function CaseOverview({
  problem,
  metaCards = [],
  scaleItems = [],
  techStack = [],
  tools = [],
  outcome,
}: {
  problem?: string
  metaCards?: OverviewMetaCard[]
  scaleItems?: OverviewScaleItem[]
  techStack?: string[]
  tools?: string[]
  outcome?: { period: string; items: OverviewOutcomeItem[] }
}) {
  const reduce = useReducedMotion()

  return (
    <div className="flex flex-col gap-3">

      {/* ── Problem statement ──────────────────────────── */}
      {problem && (
        <Reveal
          className="relative overflow-hidden rounded-xl px-6 py-5"
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border)',
            borderRight: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* Drawing accent bar (replaces the static left border) */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 3, background: 'var(--accent)', transformOrigin: 'top' }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={reduce ? undefined : { scaleY: 1 }}
            viewport={{ once: true, margin: '-12%' }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--accent)' }}>
            The problem
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {problem}
          </p>
        </Reveal>
      )}

      {/* ── Meta cards ─────────────────────────────────── */}
      {metaCards.length > 0 && (
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3" delayChildren={0.05}>
          {metaCards.map((c) => (
            <MetaCard key={c.label} card={c} />
          ))}
        </Stagger>
      )}

      {/* ── Scale card ─────────────────────────────────── */}
      {scaleItems.length > 0 && (
        <Reveal
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.12em] px-6 pt-5 pb-3"
            style={{ color: 'var(--text-dim)' }}
          >
            Scale
          </p>
          <Stagger
            className="grid"
            style={{ gridTemplateColumns: `repeat(${scaleItems.length}, 1fr)`, borderTop: '1px solid var(--border)' }}
            delayChildren={0.05}
          >
            {scaleItems.map((item, i) => (
              <ScaleItem key={item.label} item={item} last={i === scaleItems.length - 1} />
            ))}
          </Stagger>
        </Reveal>
      )}

      {/* ── Tech + Tools ───────────────────────────────── */}
      {(techStack.length > 0 || tools.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.length > 0 && (
            <Reveal
              className="rounded-xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: 'rgba(0,170,255,0.10)', border: '1px solid rgba(0,170,255,0.18)' }}
                >
                  <Code2 size={13} className="text-[var(--accent)]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
                  Tech stack
                </p>
              </div>
              <Stagger className="flex flex-wrap gap-2" delayChildren={0.1}>
                {techStack.map((t) => <Chip key={t} label={t} />)}
              </Stagger>
            </Reveal>
          )}
          {tools.length > 0 && (
            <Reveal
              className="rounded-xl p-5"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              delay={0.08}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: 'rgba(0,170,255,0.10)', border: '1px solid rgba(0,170,255,0.18)' }}
                >
                  <Wrench size={13} className="text-[var(--accent)]" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--text-dim)' }}>
                  Tools
                </p>
              </div>
              <Stagger className="flex flex-wrap gap-2" delayChildren={0.1}>
                {tools.map((t) => <Chip key={t} label={t} />)}
              </Stagger>
            </Reveal>
          )}
        </div>
      )}

      {/* ── Outcome ────────────────────────────────────── */}
      {outcome && (
        <Reveal
          className="relative overflow-hidden rounded-2xl px-8 py-4"
          style={{ background: '#04342C' }}
          y={30}
        >
          {/* Sweeping sheen — a slow specular pass across the dark card */}
          {!reduce && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(105deg, transparent 32%, rgba(159,225,203,0.12) 50%, transparent 68%)',
              }}
              initial={{ x: '-130%' }}
              animate={{ x: '130%' }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
            />
          )}

          <div className="relative z-10">
            <p
              className="font-display font-bold mb-1"
              style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', color: '#9FE1CB' }}
            >
              Outcome
            </p>
            <p className="text-xs mb-3" style={{ color: '#1D9E75' }}>
              {outcome.period}
            </p>
            <Stagger className="flex flex-col sm:flex-row" delayChildren={0.15}>
              {outcome.items.map((item, i) => (
                <OutcomeItem key={item.label} item={item} first={i === 0} />
              ))}
            </Stagger>
          </div>
        </Reveal>
      )}

    </div>
  )
}
