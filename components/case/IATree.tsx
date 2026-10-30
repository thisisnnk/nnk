'use client'

/* ------------------------------------------------------------------ *
 *  IATree — hierarchical information-architecture diagram             *
 *                                                                     *
 *  Root → top-level sections (one column each) → pages → detail views. *
 *  Structure only, not a user flow. Pure SVG; lines, root label and    *
 *  top-level boxes follow the active theme via CSS variables.          *
 * ------------------------------------------------------------------ */

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { IANode, IATreeData } from '@/lib/iaTrees'

const BW = 172
const BH = 34
const GAP = 12
const IND = 22
const CG = 34
const PAD = 24
const TOP = 130
const L1_Y = 60

const EASE = [0.16, 1, 0.3, 1] as const

const depth = (n: IANode): number => 1 + Math.max(0, ...(n.c ?? []).map(depth))

function wrap(t: string, max: number): string[] {
  if (t.length <= max) return [t]
  const w = t.split(' ')
  let a = ''
  let i = 0
  for (; i < w.length; i++) {
    if ((a + ' ' + w[i]).trim().length > max) break
    a = (a + ' ' + w[i]).trim()
  }
  let b = w.slice(i).join(' ')
  if (!a) {
    a = t.slice(0, max)
    b = t.slice(max)
  }
  if (b.length > max + 4) b = b.slice(0, max + 1) + '…'
  return b ? [a, b] : [a]
}

function Box({
  x,
  y,
  h,
  fill,
  label,
  dashed,
}: {
  x: number
  y: number
  h: number
  fill: string
  label: string
  dashed?: boolean
}) {
  const lines = wrap(label, Math.floor(BW / 6.6))
  const ty = lines.length === 1 ? y + h / 2 + 4 : y + h / 2 - 3
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BW}
        height={h}
        rx={4}
        style={{ fill }}
        stroke={dashed ? 'rgba(0,0,0,.55)' : 'none'}
        strokeDasharray={dashed ? '4 3' : undefined}
        strokeWidth={dashed ? 1.5 : 0}
      />
      {lines.map((l, i) => (
        <text key={i} x={x + BW / 2} y={ty + i * 13} textAnchor="middle" fontSize={12} fontWeight={500} fill="#fff">
          {l}
        </text>
      ))}
    </g>
  )
}

export default function IATree({ tree }: { tree: IATreeData }) {
  const reduce = useReducedMotion()

  const layout = useMemo(() => {
    const parts: React.ReactNode[] = []
    const centers: number[] = []
    let x = PAD
    let maxY = TOP

    tree.cols.forEach((col, ci) => {
      const d = depth(col.n)
      const colW = BW + (d - 1) * IND + 10
      centers.push(x + BW / 2)
      parts.push(<Box key={`h${ci}`} x={x} y={L1_Y} h={BH + 6} fill="var(--accent)" label={col.n.t} />)

      let cursor = TOP
      const walk = (n: IANode, px: number, py: number, path: string) => {
        const kids = n.c ?? []
        const kx = px + IND
        kids.forEach((k, ki) => {
          const ky = cursor
          cursor += BH + GAP
          const key = `${path}-${ki}`
          parts.push(
            <g key={`l${key}`} style={{ stroke: 'var(--border-strong)' }} strokeWidth={1} fill="none">
              <line x1={px + 10} y1={py} x2={px + 10} y2={ky + BH / 2} />
              <line x1={px + 10} y1={ky + BH / 2} x2={kx - 3} y2={ky + BH / 2} />
              <path d={`M${kx - 5} ${ky + BH / 2 - 3} L${kx} ${ky + BH / 2} L${kx - 5} ${ky + BH / 2 + 3}`} />
            </g>,
            <Box key={`b${key}`} x={kx} y={ky} h={BH} fill={col.color} label={k.t} dashed={k.d} />,
          )
          walk(k, kx, ky + BH, key)
        })
      }
      walk(col.n, x, L1_Y + BH + 6, String(ci))

      maxY = Math.max(maxY, cursor)
      x += colW + CG
    })

    const W = Math.max(x - CG + PAD, 520)
    return { parts, centers, W, H: maxY + 10 }
  }, [tree])

  const { parts, centers, W, H } = layout
  const rx = W / 2
  const first = centers[0]
  const last = centers[centers.length - 1]

  return (
    <motion.div
      className="overflow-x-auto"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${tree.root} information architecture`}
        style={{ width: '100%', minWidth: Math.min(W, 1100), height: 'auto', display: 'block' }}
      >
        {/* root */}
        <g transform={`translate(${rx - 18},6)`}>
          <path d="M18 2 L34 16 L30 16 L30 30 L6 30 L6 16 L2 16 Z" style={{ fill: 'var(--border-strong)' }} />
          <rect x="14" y="18" width="8" height="12" style={{ fill: 'var(--bg)' }} />
        </g>
        <text x={rx + 26} y={26} fontSize={13} fontWeight={700} style={{ fill: 'var(--text)' }}>
          {tree.root}
        </text>
        {/* bus */}
        <g style={{ stroke: 'var(--border-strong)' }} strokeWidth={1}>
          <line x1={rx} y1={40} x2={rx} y2={56} />
          <line x1={first} y1={56} x2={last} y2={56} />
          {centers.map((c, i) => (
            <line key={i} x1={c} y1={56} x2={c} y2={L1_Y} />
          ))}
        </g>
        {parts}
      </svg>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-3.5 h-2.5 rounded-sm" style={{ background: 'var(--accent)' }} />
          Top-level section
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-3.5 h-2.5 rounded-sm" style={{ background: '#6a2fbf' }} />
          Page (colour = branch)
        </span>
        <span className="inline-flex items-center gap-2">
          <i className="inline-block w-3.5 h-2.5 rounded-sm" style={{ border: '1.5px dashed var(--text-muted)' }} />
          Detail view / field / entity
        </span>
        {tree.note && <span>{tree.note}</span>}
      </div>
    </motion.div>
  )
}
