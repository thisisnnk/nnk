'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ResultMetric } from '@/lib/case-studies'

/* -------------------------------------------------------------------------- */
/*  ResultCards — full-width before/after metric cards for the Results section. */
/*                                                                            */
/*  One big card per row, split horizontally: identity (number · category ·    */
/*  description · delta) on the left, before→after values + proportional bars   */
/*  on the right. Each card slides up as it scrolls into view. Semantic teal /  */
/*  coral are fixed so they read on both themes; structure uses portfolio tokens.*/
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const
const TEAL = '#10b981'
const CORAL = '#ef4444'

function Bar({
  label,
  width,
  color,
  labelColor,
  delay,
}: {
  label: string
  width: number
  color: string
  labelColor: string
  delay: number
}) {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-medium w-11 shrink-0" style={{ color: labelColor }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={reduce ? false : { width: 0 }}
          whileInView={reduce ? undefined : { width: `${width}%` }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.3, ease: EASE, delay }}
        />
      </div>
    </div>
  )
}

function Card({ m }: { m: ResultMetric }) {
  const reduce = useReducedMotion()
  const down = m.direction === 'down'
  const beforeBarColor = down ? CORAL : 'var(--text-dim)'
  const arrow = down ? '↓' : '↑'

  return (
    <motion.div
      className="rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-12"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 22px 50px -34px rgba(0,0,0,0.3)',
      }}
      initial={reduce ? false : { opacity: 0, y: 38 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 1.0, ease: EASE }}
    >
      {/* LEFT — identity */}
      <div className="md:flex-1 flex flex-col gap-3.5">
        <div className="flex items-center gap-3">
          <span
            className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full tabular-nums"
            style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}
          >
            {m.n}
          </span>
          <span className="text-[16px] font-semibold leading-tight" style={{ color: 'var(--text)' }}>
            {m.category}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed max-w-md" style={{ color: 'var(--text-muted)' }}>
          {m.desc}
        </p>
        <div
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-1.5 mt-1"
          style={{ background: 'rgba(16,185,129,0.12)' }}
        >
          <span className="text-[14px] font-bold" style={{ color: TEAL }}>
            {arrow} {m.delta}
          </span>
          <span className="text-[11px]" style={{ color: TEAL }}>
            improvement
          </span>
        </div>
      </div>

      {/* RIGHT — before → after values + bars */}
      <div className="md:flex-1 flex flex-col gap-5">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--text-dim)' }}>
              Before
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 600, lineHeight: 1, color: 'var(--text-muted)' }}>
              {m.before}
            </div>
          </div>
          <div className="pb-2 text-[20px] leading-none" style={{ color: 'var(--text-dim)' }}>
            →
          </div>
          <div className="flex-1 text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: TEAL }}>
              After
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 700, lineHeight: 0.95, color: TEAL }}>
              {m.after}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Bar label="Before" width={m.beforeBar} color={beforeBarColor} labelColor="var(--text-dim)" delay={0.1} />
          <Bar label="After" width={m.afterBar} color={TEAL} labelColor={TEAL} delay={0.2} />
        </div>
      </div>
    </motion.div>
  )
}

export default function ResultCards({ items }: { items: ResultMetric[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((m) => (
        <Card key={m.n} m={m} />
      ))}
    </div>
  )
}
