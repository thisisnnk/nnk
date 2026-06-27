'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type {
  QuantReport as QuantReportData,
  QuantQuestion,
} from '@/lib/case-studies'
import { Reveal, Stagger, StaggerItem } from '@/components/case/Reveal'

/* -------------------------------------------------------------------------- */
/*  QuantReport — charted survey results + per-question insight callouts.      */
/*  Renders the Quantitative Research block when a case study supplies a       */
/*  `quantitative.report`. Pure CSS/framer bars (no Chart.js), dark+light.     */
/* -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const

// Grid-cell rise — applied directly to the cell so the grid's equal-height
// stretch is preserved (a wrapper div would collapse the cards to content height).
const CARD_ITEM: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
}

function BarChart({ q }: { q: QuantQuestion }) {
  const reduce = useReducedMotion()
  const max = q.max ?? Math.max(...q.bars.map((b) => b.value), 1)
  const unit = q.unit ?? ''

  return (
    <div className="space-y-2.5">
      {q.bars.map((b, i) => {
        const pct = max > 0 ? Math.max(0, Math.min(100, (b.value / max) * 100)) : 0
        const empty = b.value === 0
        return (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-24 sm:w-44 shrink-0 text-[11.5px] leading-tight text-right"
              style={{ color: 'var(--text-muted)' }}
            >
              {b.label}
            </div>
            <div
              className="flex-1 h-6 rounded-[3px] relative overflow-hidden"
              style={{ background: `${q.color}14` }}
            >
              {!empty && (
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-r-[3px]"
                  style={{ background: q.color }}
                  initial={reduce ? false : { width: 0 }}
                  whileInView={reduce ? undefined : { width: `${pct}%` }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.06 * i }}
                />
              )}
            </div>
            <div
              className="w-11 shrink-0 text-[12px] font-semibold tabular-nums text-right"
              style={{ color: empty ? 'var(--text-dim)' : 'var(--text)' }}
            >
              {b.value}
              {unit}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function QuestionCard({ q }: { q: QuantQuestion }) {
  return (
    <Reveal className="overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: `${q.color}1A`, color: q.color }}
          >
            {q.n}
          </span>
          <span
            className="text-[10.5px] px-2.5 py-1 rounded-full"
            style={{ border: '1px solid var(--border)', color: 'var(--text-dim)' }}
          >
            {q.type}
          </span>
        </div>
        <p className="text-[14px] font-semibold leading-snug mb-1" style={{ color: 'var(--text)' }}>
          {q.question}
        </p>
        {q.note && (
          <p className="text-[11.5px] mb-5" style={{ color: 'var(--text-dim)' }}>
            {q.note}
          </p>
        )}
        <BarChart q={q} />
      </div>

      {/* Insight callout */}
      <div
        className="mx-5 sm:mx-6 mb-5 sm:mb-6 flex rounded-lg overflow-hidden"
        style={{ background: `${q.color}10` }}
      >
        <div className="w-[3px] shrink-0" style={{ background: q.color }} />
        <div className="p-3.5 flex-1">
          <div className="text-[20px] font-bold leading-none mb-1.5" style={{ color: q.color }}>
            {q.insight.metric}
          </div>
          <div className="text-[11.5px] font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
            {q.insight.label}
          </div>
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {q.insight.text}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

function SectionSep({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span
        className="text-[9.5px] font-bold uppercase tracking-[0.1em] whitespace-nowrap"
        style={{ color: 'var(--text-dim)' }}
      >
        {label}
      </span>
      <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
    </div>
  )
}

export default function QuantReport({ report }: { report: QuantReportData }) {
  // Group questions by their `group`, preserving first-seen order.
  const groups: { label: string; questions: QuantQuestion[] }[] = []
  for (const q of report.questions) {
    let g = groups.find((x) => x.label === q.group)
    if (!g) {
      g = { label: q.group, questions: [] }
      groups.push(g)
    }
    g.questions.push(q)
  }

  return (
    <div>
      {report.subtitle && (
        <p className="text-[12px] mb-5" style={{ color: 'var(--text-muted)' }}>
          {report.subtitle}
        </p>
      )}

      {/* Meta grid */}
      <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3" delayChildren={0.05}>
        {report.meta.map((m, i) => (
          <motion.div key={i} className="p-3.5" style={{ border: '1px solid var(--border)' }} variants={CARD_ITEM}>
            <div
              className="text-[9.5px] font-semibold uppercase tracking-[0.08em] mb-1.5"
              style={{ color: 'var(--text-dim)' }}
            >
              {m.label}
            </div>
            <div className="text-[14px] font-semibold leading-tight" style={{ color: 'var(--text)' }}>
              {m.value}
            </div>
            {m.sub && (
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {m.sub}
              </div>
            )}
          </motion.div>
        ))}
      </Stagger>

      {/* Roles strip */}
      <Stagger
        className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 mb-9"
        style={{ border: '1px solid var(--border)' }}
        delayChildren={0.05}
      >
        <StaggerItem y={8}>
          <span className="text-[11px] font-medium" style={{ color: 'var(--text-muted)' }}>
            {report.rolesTitle ?? 'Participant roles'}
          </span>
        </StaggerItem>
        {report.roles.map((r, i) => (
          <StaggerItem key={i} y={8} className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2 h-2 rounded-[2px] shrink-0" style={{ background: r.color }} />
            {r.label}{' '}
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              {r.count}
            </span>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Grouped question cards */}
      <div className="space-y-3">
        {groups.map((g, gi) => (
          <div key={gi} className={gi > 0 ? 'pt-5' : undefined}>
            <SectionSep label={g.label} />
            <div className="space-y-3">
              {g.questions.map((q) => (
                <QuestionCard key={q.n} q={q} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
