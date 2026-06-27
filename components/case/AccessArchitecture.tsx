'use client'

/* ------------------------------------------------------------------ *
 *  AccessArchitecture — interactive role / page / module map          *
 *                                                                     *
 *  A brand-matched re-draw of the AH-CRM information-architecture     *
 *  diagram: 8 roles, 25 pages, 7 functional modules. Three views —    *
 *  By Role · By Module · Access Matrix — sharing one data source so   *
 *  the per-role totals are always internally consistent.              *
 * ------------------------------------------------------------------ */

import React, { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'
import {
  ROLES, ROLE_MAP, MODULES, COUNT, TOTAL_PAGES, STATS,
  type Role,
} from '@/lib/ahCrmIa'

const EASE = [0.16, 1, 0.3, 1] as const

type ViewKey = 'role' | 'module' | 'matrix'
const VIEWS: { key: ViewKey; label: string }[] = [
  { key: 'role',   label: 'By Role' },
  { key: 'module', label: 'By Module' },
  { key: 'matrix', label: 'Access Matrix' },
]

/* ---------------------------------------------------------------- */
/*  Small shared pieces                                             */
/* ---------------------------------------------------------------- */

function RoleDot({ role, size = 7 }: { role: Role; size?: number }) {
  return (
    <span
      title={role.label}
      aria-label={role.label}
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, background: role.color }}
    />
  )
}

/* ---------------------------------------------------------------- */
/*  View — By Role                                                  */
/* ---------------------------------------------------------------- */

function RoleView({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {ROLES.map((r) => {
        const count = COUNT[r.key]
        const pct = Math.round((count / TOTAL_PAGES) * 100)
        return (
          <motion.div
            key={r.key}
            className="rounded-xl p-5 flex flex-col"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderTop: `2px solid ${r.color}`,
            }}
            whileHover={reduce ? undefined : { y: -4 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="flex items-baseline justify-between gap-2 mb-3">
              <span className="font-semibold text-sm" style={{ color: r.color }}>{r.label}</span>
              <span className="text-[11px] font-mono shrink-0" style={{ color: 'var(--text-dim)' }}>
                {count}/{TOTAL_PAGES}
              </span>
            </div>

            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'var(--border)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: r.color }}
                initial={reduce ? false : { width: 0 }}
                whileInView={reduce ? undefined : { width: `${pct}%` }}
                animate={reduce ? { width: `${pct}%` } : undefined}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.2, ease: EASE }}
              />
            </div>

            <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--text-muted)' }}>
              {r.blurb}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>
                Lands on
              </span>
              <code
                className="text-[10px] font-mono px-1.5 py-0.5 rounded leading-none"
                style={{ color: r.color, background: `${r.color}15`, border: `1px solid ${r.color}30` }}
              >
                {r.landing}
              </code>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  View — By Module                                                */
/* ---------------------------------------------------------------- */

function ModuleView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {MODULES.map((m) => (
        <div key={m.name} className="rounded-xl overflow-hidden self-start" style={{ border: '1px solid var(--border)' }}>
          {/* Module header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: `${m.color}12`, borderBottom: '1px solid var(--border)', borderLeft: `3px solid ${m.color}` }}
          >
            <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{m.name}</span>
            <span className="text-[10px] font-mono ml-auto" style={{ color: 'var(--text-dim)' }}>
              {m.pages.length} {m.pages.length === 1 ? 'page' : 'pages'}
            </span>
          </div>

          {/* Pages */}
          <div style={{ background: 'var(--surface)' }}>
            {m.pages.map((p, i) => (
              <div
                key={p.route}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
              >
                <code className="text-[11px] font-mono shrink-0" style={{ color: m.color }}>{p.route}</code>
                <span className="text-xs truncate hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{p.label}</span>
                <div className="ml-auto flex items-center gap-1 shrink-0">
                  {p.roles.map((rk) => <RoleDot key={rk} role={ROLE_MAP[rk]} size={6} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  View — Access Matrix                                            */
/* ---------------------------------------------------------------- */

function MatrixView() {
  const stickyBg = 'var(--surface)'
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full border-collapse text-left" style={{ minWidth: 720 }}>
        <thead>
          <tr>
            <th
              className="sticky left-0 z-20 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ background: stickyBg, color: 'var(--text-dim)', borderBottom: '2px solid var(--border)' }}
            >
              Page / Route
            </th>
            {ROLES.map((r) => (
              <th
                key={r.key}
                className="px-2 py-3 align-bottom"
                style={{ borderBottom: '2px solid var(--border)' }}
              >
                <div className="flex flex-col items-center gap-1.5">
                  <RoleDot role={r} size={8} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.04em]" style={{ color: 'var(--text-muted)' }}>
                    {r.short}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MODULES.map((m) => (
            <React.Fragment key={m.name}>
              <tr>
                <td
                  colSpan={ROLES.length + 1}
                  className="sticky left-0 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em]"
                  style={{ background: `${m.color}12`, color: m.color }}
                >
                  {m.name}
                </td>
              </tr>
              {m.pages.map((p) => (
                <tr key={p.route} className="group">
                  <td
                    className="sticky left-0 z-10 px-4 py-2 text-[11px] font-mono whitespace-nowrap"
                    style={{ background: stickyBg, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}
                  >
                    {p.route}
                  </td>
                  {ROLES.map((r) => {
                    const has = p.roles.includes(r.key)
                    return (
                      <td
                        key={r.key}
                        className="px-2 py-2 text-center"
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        {has ? (
                          <Check className="inline-block w-3.5 h-3.5" style={{ color: r.color }} strokeWidth={3} />
                        ) : (
                          <span
                            className="inline-block w-1 h-1 rounded-full align-middle"
                            style={{ background: 'var(--text-dim)', opacity: 0.5 }}
                          />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}

          {/* Totals */}
          <tr>
            <td
              className="sticky left-0 z-10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em]"
              style={{ background: stickyBg, color: 'var(--text)', borderTop: '2px solid var(--border-strong)' }}
            >
              Total pages
            </td>
            {ROLES.map((r) => (
              <td
                key={r.key}
                className="px-2 py-2.5 text-center text-xs font-bold font-mono"
                style={{ color: r.color, borderTop: '2px solid var(--border-strong)' }}
              >
                {COUNT[r.key]}
              </td>
            ))}
          </tr>
          <tr>
            <td
              className="sticky left-0 z-10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em]"
              style={{ background: stickyBg, color: 'var(--text-dim)' }}
            >
              Access %
            </td>
            {ROLES.map((r) => (
              <td
                key={r.key}
                className="px-2 py-2 text-center text-[11px] font-mono"
                style={{ color: 'var(--text-dim)' }}
              >
                {Math.round((COUNT[r.key] / TOTAL_PAGES) * 100)}%
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Root                                                            */
/* ---------------------------------------------------------------- */

export default function AccessArchitecture() {
  const reduce = useReducedMotion()
  const [view, setView] = useState<ViewKey>('role')

  return (
    <div>
      {/* Stat strip */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-px mb-8"
        style={{ background: 'var(--border)', border: '1px solid var(--border)' }}
      >
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center justify-center py-5" style={{ background: 'var(--surface)' }}>
            <span
              className="font-display font-black"
              style={{ fontSize: '1.9rem', lineHeight: 1, color: 'var(--text)', letterSpacing: '-0.03em' }}
            >
              {s.value}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] mt-1.5" style={{ color: 'var(--text-dim)' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Segmented control + legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div
          className="inline-flex p-1 rounded-full"
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          role="tablist"
          aria-label="Information architecture views"
        >
          {VIEWS.map((v) => {
            const active = v.key === view
            return (
              <button
                key={v.key}
                role="tab"
                aria-selected={active}
                onClick={() => setView(v.key)}
                className="relative px-4 py-2 rounded-full text-[11px] font-semibold uppercase tracking-[0.08em] cursor-pointer transition-colors"
                style={{ color: active ? 'var(--accent-fg)' : 'var(--text-muted)' }}
              >
                {active && (
                  <motion.span
                    layoutId="ia-view-pill"
                    className="absolute inset-0 rounded-full -z-10"
                    style={{ background: 'var(--accent)' }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{v.label}</span>
              </button>
            )
          })}
        </div>

        {/* Role legend */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {ROLES.map((r) => (
            <span key={r.key} className="inline-flex items-center gap-1.5">
              <RoleDot role={r} size={7} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Active view */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          initial={reduce ? false : { opacity: 0, y: 8, filter: 'blur(6px)' }}
          animate={reduce ? {} : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduce ? {} : { opacity: 0, y: -8, filter: 'blur(6px)' }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          {view === 'role' && <RoleView reduce={reduce} />}
          {view === 'module' && <ModuleView />}
          {view === 'matrix' && <MatrixView />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
