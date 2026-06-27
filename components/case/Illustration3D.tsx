'use client'

import { motion, useReducedMotion } from 'framer-motion'
import React, { useId } from 'react'

/**
 * Illustration3D — self-contained isometric "3D illustration" spot-art SVGs
 * themed to the accent #00AAFF. Each name is a distinct composition built from
 * isometric primitives (stacked rounded panels / cubes / cards floating with
 * depth). Depth is sold via layered faces (light top / mid front / dark side),
 * accent gradients, inner highlights and a soft elliptical ground shadow.
 *
 * Renders correctly on both light + dark cards (it sits ON a surface, using
 * subtle blues/greys + accent, never relying on page-vs-surface contrast).
 *
 * Honours reduced-motion: when reduced (or float=false) everything is static.
 */

export const ILLUSTRATIONS = [
  'dashboard',
  'workflow',
  'database',
  'roles',
  'pipeline',
  'mobile',
  'gate',
  'analytics',
] as const

export type IllustrationName = (typeof ILLUSTRATIONS)[number]

export interface Illustration3DProps {
  name: string
  className?: string
  style?: React.CSSProperties
  size?: number
  float?: boolean
}

/* ------------------------------------------------------------------ *
 * Shared <defs> — gradients/filters scoped per-instance via a uid so
 * multiple illustrations on one page never collide.
 * ------------------------------------------------------------------ */
function Defs({ uid }: { uid: string }) {
  return (
    <defs>
      {/* Accent top face: bright -> deep blue */}
      <linearGradient id={`${uid}-accTop`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3DC4FF" />
        <stop offset="0.5" stopColor="#00AAFF" />
        <stop offset="1" stopColor="#0077CC" />
      </linearGradient>
      {/* Accent front face (a touch darker) */}
      <linearGradient id={`${uid}-accFront`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0099E6" />
        <stop offset="1" stopColor="#0062AA" />
      </linearGradient>
      {/* Accent side face (darkest) */}
      <linearGradient id={`${uid}-accSide`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0072C2" />
        <stop offset="1" stopColor="#004E8C" />
      </linearGradient>

      {/* Neutral light top face — works on light + dark cards */}
      <linearGradient id={`${uid}-nTop`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#F4F8FC" />
        <stop offset="1" stopColor="#DCE8F2" />
      </linearGradient>
      {/* Neutral front face */}
      <linearGradient id={`${uid}-nFront`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D2E0EC" />
        <stop offset="1" stopColor="#B4C7D8" />
      </linearGradient>
      {/* Neutral side face (darkest) */}
      <linearGradient id={`${uid}-nSide`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#AFC2D4" />
        <stop offset="1" stopColor="#8FA6BB" />
      </linearGradient>

      {/* Glassy white highlight for floating cards */}
      <linearGradient id={`${uid}-glass`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="1" stopColor="#EAF4FC" stopOpacity="0.85" />
      </linearGradient>

      {/* Soft radial accent glow */}
      <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#00AAFF" stopOpacity="0.55" />
        <stop offset="0.6" stopColor="#00AAFF" stopOpacity="0.12" />
        <stop offset="1" stopColor="#00AAFF" stopOpacity="0" />
      </radialGradient>

      {/* Ground shadow */}
      <radialGradient id={`${uid}-ground`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#0A1A2A" stopOpacity="0.28" />
        <stop offset="1" stopColor="#0A1A2A" stopOpacity="0" />
      </radialGradient>

      {/* Soft drop shadow for floating elements */}
      <filter id={`${uid}-soft`} x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0A2238" floodOpacity="0.22" />
      </filter>
    </defs>
  )
}

/* Soft elliptical ground shadow shared by all comps */
function Ground({ uid }: { uid: string }) {
  return <ellipse cx="120" cy="206" rx="78" ry="16" fill={`url(#${uid}-ground)`} />
}

/* ------------------------------------------------------------------ *
 * Compositions. Each returns an array-able fragment.
 * `f` = floating-sub-element JSX.Element factory: receives a motion wrapper.
 * To keep layered float, sub-elements are passed as render via `Float`.
 * ------------------------------------------------------------------ */

type SubFloat = (
  child: React.ReactNode,
  opts?: { dur?: number; range?: number; delay?: number; rotate?: number },
) => React.ReactNode

interface CompProps {
  uid: string
  Float: SubFloat
}

/* dashboard — iso dashboard panel with chart bars + floating KPI card above */
function Dashboard({ uid, Float }: CompProps) {
  const a = `url(#${uid}-accTop)`
  return (
    <g>
      <ellipse cx="120" cy="150" rx="70" ry="34" fill={`url(#${uid}-glow)`} opacity="0.7" />
      {/* base slab */}
      <g filter={`url(#${uid}-soft)`}>
        {/* top face */}
        <path d="M120 96 L196 134 L120 172 L44 134 Z" fill={`url(#${uid}-nTop)`} />
        {/* front-left side */}
        <path d="M44 134 L120 172 L120 188 L44 150 Z" fill={`url(#${uid}-nSide)`} />
        {/* front-right side */}
        <path d="M196 134 L120 172 L120 188 L196 150 Z" fill={`url(#${uid}-nFront)`} />
      </g>
      {/* chart bars standing on the slab */}
      {[
        { x: 92, y: 118, h: 22 },
        { x: 110, y: 127, h: 34 },
        { x: 128, y: 118, h: 28 },
        { x: 146, y: 127, h: 16 },
      ].map((b, i) => (
        <g key={i}>
          <path d={`M${b.x} ${b.y} L${b.x + 12} ${b.y + 6} L${b.x + 12} ${b.y + 6 - b.h} L${b.x} ${b.y - b.h} Z`} fill={a} />
          <path d={`M${b.x + 12} ${b.y + 6} L${b.x} ${b.y} L${b.x} ${b.y - b.h} L${b.x + 12} ${b.y + 6 - b.h} Z`} fill={`url(#${uid}-accFront)`} opacity="0.85" />
          <path d={`M${b.x} ${b.y - b.h} L${b.x + 12} ${b.y + 6 - b.h} L${b.x + 12} ${b.y + 6 - b.h - 5} L${b.x} ${b.y - b.h - 5} Z`} fill="#EAF6FF" opacity="0.9" />
        </g>
      ))}
      {/* floating KPI card */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <rect x="118" y="44" width="64" height="40" rx="8" fill={`url(#${uid}-glass)`} stroke="#BFE2F7" strokeWidth="1" />
          <circle cx="130" cy="58" r="6" fill={a} />
          <rect x="142" y="53" width="30" height="5" rx="2.5" fill="#9FC4DC" />
          <rect x="142" y="63" width="22" height="5" rx="2.5" fill="#C3D9E8" />
          <path d="M124 76 l8 -6 l8 4 l10 -10 l8 5" fill="none" stroke="#00AAFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>,
        { dur: 6, range: 8, delay: 0.4 },
      )}
    </g>
  )
}

/* workflow — 3 connected iso nodes with linking arrows along an iso plane */
function Workflow({ uid, Float }: CompProps) {
  const node = (cx: number, cy: number, accent: boolean) => {
    const top = accent ? `url(#${uid}-accTop)` : `url(#${uid}-nTop)`
    const front = accent ? `url(#${uid}-accFront)` : `url(#${uid}-nFront)`
    const side = accent ? `url(#${uid}-accSide)` : `url(#${uid}-nSide)`
    const r = 26
    const d = 12
    return (
      <g filter={`url(#${uid}-soft)`}>
        <path d={`M${cx} ${cy - r / 2} L${cx + r} ${cy} L${cx} ${cy + r / 2} L${cx - r} ${cy} Z`} fill={top} />
        <path d={`M${cx - r} ${cy} L${cx} ${cy + r / 2} L${cx} ${cy + r / 2 + d} L${cx - r} ${cy + d} Z`} fill={side} />
        <path d={`M${cx + r} ${cy} L${cx} ${cy + r / 2} L${cx} ${cy + r / 2 + d} L${cx + r} ${cy + d} Z`} fill={front} />
        <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" opacity="0.85" />
      </g>
    )
  }
  const arrow = (x1: number, y1: number, x2: number, y2: number) => (
    <g stroke="#00AAFF" strokeWidth="3" strokeLinecap="round">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M${x2} ${y2} l-7 -1 M${x2} ${y2} l-3 -6`} strokeWidth="3" fill="none" />
    </g>
  )
  return (
    <g>
      <ellipse cx="120" cy="150" rx="74" ry="30" fill={`url(#${uid}-glow)`} opacity="0.55" />
      {arrow(78, 96, 104, 118)}
      {arrow(136, 118, 162, 96)}
      {node(58, 90, false)}
      {Float(node(120, 132, true), { dur: 5.5, range: 7 })}
      {node(182, 90, false)}
    </g>
  )
}

/* database — stacked DB cylinders/disks with a glow */
function Database({ uid, Float }: CompProps) {
  const disk = (cy: number, accent: boolean) => {
    const top = accent ? `url(#${uid}-accTop)` : `url(#${uid}-nTop)`
    const body = accent ? `url(#${uid}-accFront)` : `url(#${uid}-nFront)`
    const ry = 16
    const rx = 50
    const h = 26
    return (
      <g>
        {/* body */}
        <path d={`M${120 - rx} ${cy} L${120 - rx} ${cy + h} A${rx} ${ry} 0 0 0 ${120 + rx} ${cy + h} L${120 + rx} ${cy} Z`} fill={body} />
        {/* top ellipse */}
        <ellipse cx="120" cy={cy} rx={rx} ry={ry} fill={top} />
        <ellipse cx="120" cy={cy} rx={rx} ry={ry} fill="none" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1" />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="120" cy="196" rx="60" ry="14" fill={`url(#${uid}-ground)`} />
      <ellipse cx="120" cy="120" rx="66" ry="46" fill={`url(#${uid}-glow)`} opacity="0.75" />
      <g filter={`url(#${uid}-soft)`}>
        {disk(150, false)}
        {disk(118, false)}
        {disk(86, true)}
      </g>
      {/* floating data card popping off */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <rect x="150" y="58" width="46" height="30" rx="7" fill={`url(#${uid}-glass)`} stroke="#BFE2F7" strokeWidth="1" />
          <rect x="158" y="66" width="20" height="4" rx="2" fill="#00AAFF" />
          <rect x="158" y="74" width="30" height="4" rx="2" fill="#B9D4E6" />
          <rect x="158" y="80" width="24" height="4" rx="2" fill="#C9DDEC" />
        </g>,
        { dur: 5.6, range: 9, delay: 0.5 },
      )}
    </g>
  )
}

/* roles — a grid of small iso person/badge cards fanned in 3D */
function Roles({ uid, Float }: CompProps) {
  const badge = (cx: number, cy: number, accent: boolean) => {
    const top = accent ? `url(#${uid}-accTop)` : `url(#${uid}-nTop)`
    const side = accent ? `url(#${uid}-accSide)` : `url(#${uid}-nSide)`
    const w = 26
    const h = 18
    const d = 10
    return (
      <g filter={`url(#${uid}-soft)`}>
        {/* top */}
        <path d={`M${cx} ${cy - h} L${cx + w} ${cy} L${cx} ${cy + h} L${cx - w} ${cy} Z`} fill={top} />
        {/* sides */}
        <path d={`M${cx - w} ${cy} L${cx} ${cy + h} L${cx} ${cy + h + d} L${cx - w} ${cy + d} Z`} fill={side} />
        <path d={`M${cx + w} ${cy} L${cx} ${cy + h} L${cx} ${cy + h + d} L${cx + w} ${cy + d} Z`} fill={accent ? `url(#${uid}-accFront)` : `url(#${uid}-nFront)`} />
        {/* person glyph on top face */}
        <circle cx={cx} cy={cy - 5} r="4.2" fill="#FFFFFF" opacity="0.92" />
        <path d={`M${cx - 7} ${cy + 5} q7 -8 14 0 Z`} fill="#FFFFFF" opacity="0.9" />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="120" cy="150" rx="78" ry="34" fill={`url(#${uid}-glow)`} opacity="0.55" />
      {/* back row */}
      {badge(78, 96, false)}
      {badge(162, 96, false)}
      {/* mid */}
      {badge(120, 110, false)}
      {/* front fanned accent badge floats */}
      {Float(badge(78, 138, true), { dur: 5.4, range: 7 })}
      {Float(badge(162, 138, true), { dur: 6.2, range: 7, delay: 0.6 })}
    </g>
  )
}

/* pipeline — left-to-right iso pipeline of chevron blocks */
function Pipeline({ uid, Float }: CompProps) {
  const chevron = (x: number, accent: boolean, key: number) => {
    const top = accent ? `url(#${uid}-accTop)` : `url(#${uid}-nTop)`
    const side = accent ? `url(#${uid}-accSide)` : `url(#${uid}-nSide)`
    const front = accent ? `url(#${uid}-accFront)` : `url(#${uid}-nFront)`
    const y = 120
    const w = 34
    const dep = 14
    // iso chevron top face (parallelogram with notch)
    return (
      <g key={key} filter={`url(#${uid}-soft)`}>
        <path d={`M${x} ${y - 14} L${x + w} ${y - 2} L${x + w - 10} ${y + 4} L${x + w} ${y + 10} L${x} ${y + 22} L${x + 10} ${y + 4} Z`} fill={top} />
        <path d={`M${x} ${y + 22} L${x + 10} ${y + 4} L${x + 10} ${y + 4 + dep} L${x} ${y + 22 + dep} Z`} fill={side} />
        <path d={`M${x} ${y + 22} L${x + w} ${y + 10} L${x + w} ${y + 10 + dep} L${x} ${y + 22 + dep} Z`} fill={front} />
      </g>
    )
  }
  return (
    <g>
      <ellipse cx="120" cy="160" rx="86" ry="26" fill={`url(#${uid}-glow)`} opacity="0.5" />
      {chevron(36, false, 0)}
      {chevron(72, false, 1)}
      {chevron(108, true, 2)}
      {chevron(144, false, 3)}
      {/* floating "packet" gliding above the pipeline */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <path d="M120 60 L138 69 L120 78 L102 69 Z" fill={`url(#${uid}-glass)`} stroke="#BFE2F7" strokeWidth="1" />
          <path d="M102 69 L120 78 L120 88 L102 79 Z" fill="#CFE6F4" />
          <path d="M138 69 L120 78 L120 88 L138 79 Z" fill="#B7D6EB" />
        </g>,
        { dur: 5, range: 9 },
      )}
    </g>
  )
}

/* mobile — floating iso phone with a card popping off its surface */
function Mobile({ uid, Float }: CompProps) {
  const top = `url(#${uid}-nTop)`
  return (
    <g>
      <ellipse cx="120" cy="170" rx="56" ry="20" fill={`url(#${uid}-glow)`} opacity="0.6" />
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          {/* phone iso body: a tall rounded slab */}
          {/* top face */}
          <path d="M104 52 L150 78 L120 142 L74 116 Z" fill={top} />
          {/* left side */}
          <path d="M74 116 L120 142 L120 156 L74 130 Z" fill={`url(#${uid}-nSide)`} />
          {/* right side */}
          <path d="M150 78 L120 142 L120 156 L150 92 Z" fill={`url(#${uid}-nFront)`} />
          {/* screen glass on top face */}
          <path d="M104 60 L143 82 L118 132 L80 110 Z" fill={`url(#${uid}-accFront)`} opacity="0.18" />
          {/* status rows */}
          <path d="M99 72 l24 14" stroke="#00AAFF" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <path d="M95 84 l30 17" stroke="#9FC4DC" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </g>,
        { dur: 6, range: 7 },
      )}
      {/* card popping off the phone surface (offset float for layered depth) */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <rect x="128" y="60" width="58" height="38" rx="9" fill={`url(#${uid}-glass)`} stroke="#BFE2F7" strokeWidth="1" />
          <circle cx="142" cy="74" r="7" fill={`url(#${uid}-accTop)`} />
          <rect x="154" y="69" width="26" height="5" rx="2.5" fill="#9FC4DC" />
          <rect x="154" y="79" width="18" height="5" rx="2.5" fill="#C3D9E8" />
          <path d="M134 90 l10 -2 l8 1 l10 -1" stroke="#00AAFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>,
        { dur: 5, range: 11, delay: 0.5 },
      )}
    </g>
  )
}

/* gate — an iso locked gate/shield panel (quality gate) */
function Gate({ uid, Float }: CompProps) {
  return (
    <g>
      <ellipse cx="120" cy="120" rx="60" ry="48" fill={`url(#${uid}-glow)`} opacity="0.7" />
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          {/* iso shield top face */}
          <path d="M120 50 L168 78 L168 118 Q168 150 120 172 Q72 150 72 118 L72 78 Z" fill={`url(#${uid}-accTop)`} />
          {/* darker inner front for depth */}
          <path d="M120 60 L158 82 L158 116 Q158 142 120 160 Q82 142 82 116 L82 82 Z" fill={`url(#${uid}-accFront)`} opacity="0.45" />
          {/* lock body */}
          <rect x="106" y="102" width="28" height="24" rx="5" fill="#FFFFFF" opacity="0.95" />
          {/* shackle */}
          <path d="M111 102 v-7 a9 9 0 0 1 18 0 v7" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.95" />
          {/* keyhole */}
          <circle cx="120" cy="112" r="3.6" fill="#0077CC" />
          <rect x="118.4" y="113" width="3.2" height="8" rx="1.4" fill="#0077CC" />
        </g>,
        { dur: 6, range: 6 },
      )}
      {/* floating "check" badge to imply a passed gate */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <circle cx="170" cy="66" r="16" fill={`url(#${uid}-glass)`} stroke="#BFE2F7" strokeWidth="1" />
          <path d="M163 66 l5 5 l9 -10" stroke="#00AAFF" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>,
        { dur: 4.6, range: 9, delay: 0.5 },
      )}
    </g>
  )
}

/* analytics — iso bar+line chart on a floating slab */
function Analytics({ uid, Float }: CompProps) {
  const a = `url(#${uid}-accTop)`
  return (
    <g>
      <ellipse cx="120" cy="160" rx="74" ry="28" fill={`url(#${uid}-glow)`} opacity="0.6" />
      {/* floating slab */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <path d="M120 92 L196 130 L120 168 L44 130 Z" fill={`url(#${uid}-nTop)`} />
          <path d="M44 130 L120 168 L120 182 L44 144 Z" fill={`url(#${uid}-nSide)`} />
          <path d="M196 130 L120 168 L120 182 L196 144 Z" fill={`url(#${uid}-nFront)`} />
          {/* iso bars */}
          {[
            { x: 86, h: 16 },
            { x: 104, h: 30 },
            { x: 122, h: 22 },
            { x: 140, h: 38 },
          ].map((b, i) => {
            const y = 118 + (b.x - 86) * 0.5
            return (
              <g key={i}>
                <path d={`M${b.x} ${y} L${b.x + 10} ${y + 5} L${b.x + 10} ${y + 5 - b.h} L${b.x} ${y - b.h} Z`} fill={a} />
                <path d={`M${b.x} ${y} L${b.x} ${y - b.h} L${b.x - 8} ${y - b.h - 4} L${b.x - 8} ${y - 4} Z`} fill={`url(#${uid}-accSide)`} />
              </g>
            )
          })}
          {/* iso line overlay */}
          <path d="M84 116 l18 -6 l18 4 l18 -12" fill="none" stroke="#EAF6FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        </g>,
        { dur: 6.2, range: 8 },
      )}
      {/* floating trend pill */}
      {Float(
        <g filter={`url(#${uid}-soft)`}>
          <rect x="150" y="52" width="50" height="26" rx="13" fill={`url(#${uid}-glass)`} stroke="#BFE2F7" strokeWidth="1" />
          <path d="M160 70 l8 -8 l5 4 l9 -10" stroke="#00AAFF" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M182 56 l4 0 l0 4" stroke="#00AAFF" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>,
        { dur: 4.8, range: 9, delay: 0.5 },
      )}
    </g>
  )
}

const COMPS: Record<IllustrationName, (p: CompProps) => JSX.Element> = {
  dashboard: Dashboard,
  workflow: Workflow,
  database: Database,
  roles: Roles,
  pipeline: Pipeline,
  mobile: Mobile,
  gate: Gate,
  analytics: Analytics,
}

export function Illustration3D({
  name,
  className,
  style,
  size = 240,
  float = true,
}: Illustration3DProps) {
  const reduce = useReducedMotion()
  const uid = useId().replace(/[:]/g, '')

  const key = (ILLUSTRATIONS as readonly string[]).includes(name)
    ? (name as IllustrationName)
    : 'dashboard'
  const Comp = COMPS[key]

  const animate = float && !reduce

  // Sub-element floater. When static, render the child as-is (no motion).
  const Float: SubFloat = (child, opts) => {
    if (!animate) return child
    const { dur = 6, range = 8, delay = 0, rotate = 0 } = opts ?? {}
    return (
      <motion.g
        animate={{
          y: [0, -range, 0],
          ...(rotate ? { rotate: [0, rotate, 0] } : {}),
        }}
        transition={{
          duration: dur,
          ease: 'easeInOut',
          repeat: Infinity,
          delay,
        }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        {child}
      </motion.g>
    )
  }

  const svg = (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="img"
      aria-label={`${key} illustration`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <Defs uid={uid} />
      <Ground uid={uid} />
      <Comp uid={uid} Float={Float} />
    </svg>
  )

  if (!animate) {
    return (
      <div className={className} style={style}>
        {svg}
      </div>
    )
  }

  return (
    <motion.div
      className={className}
      style={style}
      animate={{ y: [0, -10, 0], rotate: [0, 0.6, 0] }}
      transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
    >
      {svg}
    </motion.div>
  )
}

export default Illustration3D
