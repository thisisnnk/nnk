'use client'

import { MessageCircle, Brain, Zap, Heart, type LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Persona } from '@/lib/case-studies'
import { Stagger, StaggerItem } from '@/components/case/Reveal'

/* -------------------------------------------------------------------------- */
/*  EmpathyMap — Says / Thinks / Does / Feels quadrants for a single persona   */
/*  Pairs with <PersonaCard> in the Qualitative Research section.             */
/*  A flat 2D human illustration sits at the centre of the 2×2 (the classic    */
/*  empathy-map "persona in the middle") to rest the eye amid the dense text.  */
/* -------------------------------------------------------------------------- */

type QuadrantKey = keyof Persona['empathy']

const QUADRANTS: { key: QuadrantKey; label: string; icon: LucideIcon }[] = [
  { key: 'says', label: 'Says', icon: MessageCircle },
  { key: 'thinks', label: 'Thinks', icon: Brain },
  { key: 'does', label: 'Does', icon: Zap },
  { key: 'feels', label: 'Feels', icon: Heart },
]

/* Extra padding on each quadrant's inner edges (sm+) so list text clears the
   central figure. Index matches the row-major 2×2 order above. */
const INNER_PAD = [
  'sm:pr-24 sm:pb-24', // says   — top-left
  'sm:pl-24 sm:pb-24', // thinks — top-right
  'sm:pr-24 sm:pt-24', // does   — bottom-left
  'sm:pl-24 sm:pt-24', // feels  — bottom-right
]

/* First names that should render with the feminine hair variant. Kept local
   and presentation-only; defaults to the masculine variant otherwise. */
const FEMININE_NAMES = new Set(['Meena', 'Priya', 'Deepa', 'Lakshmi'])

/* Flat 2D human illustration, framed in a circular badge. The surface "halo"
   (box-shadow) punches a clean hole through the quadrant dividers behind it. */
function PersonaFigure({
  color,
  variant,
  senior,
}: {
  color: string
  variant: 'm' | 'f'
  senior: boolean
}) {
  const reduce = useReducedMotion()

  const skin = '#E9B58C'
  const skinShade = '#CE9469'
  const hair = senior ? '#ADA59C' : '#3A2C22'
  const brow = senior ? '#9C958C' : '#4A3A2E'
  const eye = '#3B3340'
  const mouth = '#B66A56'

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
    >
      <motion.div
        className="flex items-center justify-center overflow-hidden rounded-full"
        style={{
          width: 160,
          height: 160,
          background: 'var(--surface)',
          border: `2.5px solid ${color}`,
          boxShadow: `0 0 0 8px var(--surface), 0 18px 48px -12px ${color}80`,
        }}
        initial={reduce ? false : { opacity: 0, scale: 0.5 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 240, damping: 17, delay: 0.18 }}
      >
        <svg width="160" height="160" viewBox="0 0 76 76" role="img" aria-label="Persona illustration">
        {/* studio backdrop tinted to the persona accent */}
        <circle cx="38" cy="38" r="38" fill={`${color}14`} />

        {/* long hair behind the shoulders (feminine variant) */}
        {variant === 'f' && (
          <path
            d="M22 34 C19 17 57 17 54 34 C55 43 52 50 51 52 L48.5 42 C49 31 45 24 38 24 C31 24 27 31 27.5 42 L25 52 C24 50 21 43 22 34 Z"
            fill={hair}
          />
        )}

        {/* neck */}
        <rect x="33.5" y="39.5" width="9" height="12" rx="4.5" fill={skin} />
        <path d="M33.5 44 q4.5 3.6 9 0 v-2.5 h-9 Z" fill={skinShade} opacity="0.45" />

        {/* shoulders / collared top in the persona colour */}
        <path d="M11 76 C11 58 23 50 38 50 C53 50 65 58 65 76 Z" fill={color} />
        <path
          d="M11 76 C11 58 23 50 38 50 C45 50 50 51.5 54 53.5 C41 55 29 62 27 76 Z"
          fill="#ffffff"
          opacity="0.08"
        />
        {/* V-collar */}
        <path d="M34 50.5 L38 56 L42 50.5" fill="none" stroke="var(--surface)" strokeWidth="1.4" strokeLinejoin="round" opacity="0.85" />

        {/* face */}
        <circle cx="38" cy="30" r="13" fill={skin} />

        {/* ears (masculine variant — hidden by hair on feminine) */}
        {variant === 'm' && (
          <>
            <circle cx="25.6" cy="31" r="3" fill={skin} />
            <circle cx="50.4" cy="31" r="3" fill={skin} />
          </>
        )}

        {/* hair on top */}
        {variant === 'm' ? (
          <path d="M25 31 C24 17 52 17 51 31 C50 25 46 21 38 21 C30 21 26 25 25 31 Z" fill={hair} />
        ) : (
          <path d="M26 30.5 C26 18 50 18 50 30.5 C50 25 46 21 38 21 C30 21 26 25 26 30.5 Z" fill={hair} />
        )}

        {/* brows */}
        <rect x="30.6" y="25" width="5" height="1.5" rx="0.75" fill={brow} />
        <rect x="40.4" y="25" width="5" height="1.5" rx="0.75" fill={brow} />

        {/* eyes + catchlights */}
        <ellipse cx="33.2" cy="29.6" rx="1.7" ry="2.3" fill={eye} />
        <ellipse cx="42.8" cy="29.6" rx="1.7" ry="2.3" fill={eye} />
        <circle cx="33.8" cy="28.9" r="0.6" fill="#fff" opacity="0.85" />
        <circle cx="43.4" cy="28.9" r="0.6" fill="#fff" opacity="0.85" />

        {/* nose */}
        <path d="M38 30.6 L36.6 33.5 Q38 34.2 39.4 33.5 Z" fill={skinShade} opacity="0.55" />

        {/* gentle smile */}
        <path d="M34.4 36.4 Q38 39.3 41.6 36.4" fill="none" stroke={mouth} strokeWidth="1.4" strokeLinecap="round" />

        {/* accent-tinted cheeks */}
        <circle cx="31.2" cy="33.2" r="1.9" fill={color} opacity="0.16" />
        <circle cx="44.8" cy="33.2" r="1.9" fill={color} opacity="0.16" />
      </svg>
      </motion.div>
    </div>
  )
}

export default function EmpathyMap({ p }: { p: Persona }) {
  const e = p.empathy
  const variant: 'm' | 'f' = FEMININE_NAMES.has(p.name.split(' ')[0]) ? 'f' : 'm'
  const senior = p.age >= 50

  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between gap-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: p.color }} />
          <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>
            Empathy Map
          </p>
        </div>
        <span className="text-xs font-semibold" style={{ color: p.color }}>{p.name}</span>
      </div>

      {/* Body — relative wrapper hosts the centred figure over the 2×2 */}
      <div className="relative flex-1 flex flex-col">
        {/* 2×2 quadrants — hairline dividers via 1px gap over a border-coloured bed */}
        <Stagger
          className="grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 flex-1"
          style={{ gap: '1px', background: 'var(--border)' }}
          delayChildren={0.05}
        >
          {QUADRANTS.map(({ key, label, icon: Icon }, i) => (
            <StaggerItem key={key} className={`p-5 ${INNER_PAD[i]}`} style={{ background: 'var(--surface)' }}>
              <div className="flex items-center gap-2.5 mb-3.5">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${p.color}16`, color: p.color }}
                >
                  <Icon size={14} strokeWidth={2.2} />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: p.color }}>
                  {label}
                </span>
              </div>
              <ul className="space-y-2">
                {e[key].map((item, j) => (
                  <li
                    key={j}
                    className="text-[13px] leading-snug flex gap-2 items-start"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0 mt-[7px]"
                      style={{ background: p.color, opacity: 0.55 }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Centred 2D human illustration */}
        <PersonaFigure color={p.color} variant={variant} senior={senior} />
      </div>
    </div>
  )
}
