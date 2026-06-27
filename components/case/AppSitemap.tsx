'use client'

/* ------------------------------------------------------------------ *
 *  AppSitemap — one connected sitemap for the whole product           *
 *                                                                     *
 *  Login → role-based routing → all eight role workspaces in a SINGLE  *
 *  row. Screens within each workspace are left-aligned (shared edge,   *
 *  left rail). The whole diagram is auto-scaled to fit the container   *
 *  width — never wraps, never scrolls. Brand-matched, light + dark.    *
 * ------------------------------------------------------------------ */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ROLE_MAP, ROLE_NAV, type RoleKey } from '@/lib/ahCrmIa'

const EASE = [0.16, 1, 0.3, 1] as const

// Geometry
const COL_W = 158 // column width / pitch
const GAP = 18 // gap between columns

const ORDER: RoleKey[] = ['admin', 'employee', 'execution', 'owner', 'tour_guide', 'accounts', 'itinerary', 'backend']
const NATURAL_W = ORDER.length * COL_W + (ORDER.length - 1) * GAP // full single-row width

const useIso = typeof window !== 'undefined' ? useLayoutEffect : useEffect

type Kind = 'login' | 'route' | 'header' | 'section' | 'leaf'

interface FlatNode { label: string; route: string; leaf: boolean }

function flatten(role: RoleKey): FlatNode[] {
  const out: FlatNode[] = []
  for (const n of ROLE_NAV[role]) {
    out.push({ label: n.label, route: n.route, leaf: false })
    n.children?.forEach((c) => out.push({ label: c.label, route: c.route, leaf: true }))
  }
  return out
}

/* ---------------------------------------------------------------- */
/*  Pieces                                                          */
/* ---------------------------------------------------------------- */

function VLine({ h = '1.3rem' }: { h?: string }) {
  return <div style={{ width: 0, height: h, borderLeft: '1px solid var(--border-strong)' }} />
}

function Pill({ kind, color, label, route }: { kind: Kind; color?: string; label: string; route?: string }) {
  let style: React.CSSProperties
  if (kind === 'login') {
    style = { background: 'var(--surface)', border: '1.5px solid var(--accent)', color: 'var(--accent)' }
  } else if (kind === 'route') {
    style = { background: 'var(--surface)', border: '1px dashed var(--border-strong)', color: 'var(--text-dim)' }
  } else if (kind === 'header') {
    style = { background: color, border: `1px solid ${color}`, color: '#fff' }
  } else if (kind === 'section') {
    style = { background: 'var(--surface)', border: '1px solid var(--border-strong)', color: 'var(--text)' }
  } else {
    style = { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }
  }
  return (
    <div
      className="inline-block px-3 py-2 rounded-lg text-center text-[11px] font-semibold whitespace-nowrap"
      style={{ ...style, maxWidth: COL_W - 16 }}
      title={route}
    >
      {label}
    </div>
  )
}

/* ---------------------------------------------------------------- */
/*  Diagram                                                         */
/* ---------------------------------------------------------------- */

export default function AppSitemap() {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ scale: 1, marginLeft: 0, height: 0 })

  // Scale the natural single-row diagram down to the container width.
  useIso(() => {
    const root = rootRef.current
    const inner = innerRef.current
    if (!root || !inner) return
    const measure = () => {
      const cw = root.clientWidth
      const naturalH = inner.offsetHeight // layout height, ignores transform
      const scale = Math.min(1, cw / NATURAL_W)
      const marginLeft = Math.max(0, (cw - NATURAL_W) / 2) // centre when it fits at 1×
      setBox((b) =>
        b.scale === scale && b.marginLeft === marginLeft && b.height === naturalH * scale
          ? b
          : { scale, marginLeft, height: naturalH * scale },
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(root)
    return () => ro.disconnect()
  }, [])

  const railX = (i: number) => i * (COL_W + GAP)

  return (
    <div ref={rootRef}>
      <div style={{ height: box.height || undefined, overflow: 'hidden' }}>
        <div
          ref={innerRef}
          style={{ width: NATURAL_W, marginLeft: box.marginLeft, transform: `scale(${box.scale})`, transformOrigin: '0 0' }}
        >
          {/* Entry funnel — centred over the row */}
          <motion.div
            className="flex flex-col items-center"
            style={{ width: NATURAL_W }}
            initial={reduce ? false : { opacity: 0, y: -14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <Pill kind="login" label="Login" route="/login" />
            <VLine />
            <Pill kind="route" label="Role-based routing" />
            <VLine />
          </motion.div>

          {/* Single row of role workspaces */}
          <div className="relative">
            {/* bus across all columns */}
            <div
              className="absolute"
              style={{ top: 0, left: 0, width: railX(ORDER.length - 1) + 1, borderTop: '1px solid var(--border-strong)' }}
            />

            {/* paddingTop = the .ia-chain::before stem height (gap below the bus) */}
            <div className="flex" style={{ gap: GAP, paddingTop: 16 }}>
              {ORDER.map((key, ci) => {
                const r = ROLE_MAP[key]
                return (
                  <motion.div
                    key={key}
                    style={{ width: COL_W, flex: '0 0 auto' }}
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-6%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : ci * 0.07 }}
                  >
                    {/* left-aligned chain: header + screens share one left edge */}
                    <div className="ia-chain">
                      <div className="ia-item">
                        <Pill kind="header" color={r.color} label={r.label} route={r.landing} />
                      </div>
                      {flatten(key).map((node, idx) => (
                        <div className="ia-item" key={`${node.route}-${idx}`}>
                          <Pill kind={node.leaf ? 'leaf' : 'section'} color={r.color} label={node.label} route={node.route} />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
