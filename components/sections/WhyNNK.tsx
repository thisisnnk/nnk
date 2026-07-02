'use client'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from 'framer-motion'
import { whyNnkStats } from '@/lib/data'
import CountUp from '@/components/ui/CountUp'
import ShinyButton from '@/components/ui/ShinyButton'
import { gmailCompose } from '@/lib/utils'

const PARA_LINES = [
  'Writing code is easy, but',
  'understanding business operations,',
  "functions, and automation isn't.",
  'I engineer systems that solve',
  'real operational problems —',
  'not just building software',
  'that already exists.',
]

const TEXT_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.4rem, 2.4vw, 2rem)',
  lineHeight: 1.3,
  letterSpacing: '-0.015em',
}

const TOTAL_WORDS = PARA_LINES.reduce((sum, line) => sum + line.split(' ').length, 0)

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

// One continuous scroll timeline spanning the whole pin duration (see sequenceRef below).
// Phase boundaries are fractions of that pinned window: "why" reaches viewport-center at
// ~40% through it, the row's words finish by ~81% — so words run in the 40–81% slice and
// stat cards get whatever's left (81–100%), each phase gated strictly after the previous ends.
const WHY_END = 0.4 // "why NNK?" fades in until it's centered in the viewport
const ROW_END = 0.81 // magic-text words finish by the time the row exits the viewport
const WORDS_START = WHY_END // magic-text words only start once "why NNK?" has fully faded in

function Word({
  children,
  progress,
  range,
  reduce,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean | null
}) {
  const opacity = useTransform(progress, range, [0, 1])

  return (
    <span className="relative" style={{ marginRight: '0.3em' }}>
      <span className="absolute" style={{ opacity: 0.06 }}>{children}</span>
      <motion.span style={{ opacity: reduce ? 1 : opacity }}>{children}</motion.span>
    </span>
  )
}

function StatCard({
  stat,
  progress,
  range,
  reduce,
}: {
  stat: { value: number; suffix: string; label: string }
  progress: MotionValue<number>
  range: [number, number]
  reduce: boolean | null
}) {
  // local: this card's own 0→1 window inside the shared stats phase (drives the count).
  const local = useTransform(progress, range, [0, 1], { clamp: true })
  const eased = useTransform(local, easeOutCubic)
  // wave: card rises past rest then settles back — the "crest" that rolls across the row.
  const y = useTransform(local, [0, 0.7, 1], [56, -8, 0])
  const scale = useTransform(local, [0, 0.7, 1], [0.94, 1.02, 1])

  return (
    <motion.div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        opacity: reduce ? 1 : eased,
        y: reduce ? 0 : y,
        scale: reduce ? 1 : scale,
      }}
      className="p-8 md:p-10 rounded-2xl"
    >
      <CountUp
        value={stat.value}
        suffix={stat.suffix}
        progress={local}
        range={[0, 1]}
        className="font-display font-bold block mb-3"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)' }}
      />
      <p className="label-muted" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
    </motion.div>
  )
}

export default function WhyNNK() {
  const reduce = useReducedMotion()

  // sequenceRef is a tall scroll spacer; the visible content pins via `position: sticky`
  // inside it, so the section holds its position while the user keeps scrolling, and only
  // releases to the next section once all three phases below have finished.
  const sequenceRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: seqRaw } = useScroll({
    target: sequenceRef,
    offset: ['start start', 'end end'], // pin starts (spacer top hits viewport top) → pin ends (spacer bottom hits viewport bottom)
  })
  // Kept linear: phase fractions below (WHY_END, ROW_END) are measured against real
  // scroll-pixel distances, so easing the raw fraction first would distort them —
  // easing is applied per-phase instead, after each slice is carved out below.
  const progress = seqRaw

  // Phase 1 — "why NNK?" fades in, eased on its own 0→1 window.
  const whyLocal = useTransform(progress, [0, WHY_END], [0, 1], { clamp: true })
  const whyOpacity = useTransform(whyLocal, easeOutCubic)

  // Phase 2 — magic-text words reveal (starts only once phase 1 has fully finished).
  const wordsProgress = useTransform(progress, [WORDS_START, ROW_END], [0, 1], { clamp: true })
  let wordIndex = 0

  // Phase 3 — stat cards wave in + count up. Starts at ROW_END, i.e. only once the
  // magic-text words above have fully finished (wordsProgress is already clamped to 1).
  const statsProgress = useTransform(progress, [ROW_END, 1], [0, 1], { clamp: true })
  const STAT_STAGGER = 0.18
  const STAT_SPAN = 0.55

  // CTA fades in only after every stat card's own wave-in animation has
  // finished (last card completes at STAT_STAGGER*2 + STAT_SPAN = 0.91).
  const ctaOpacity = useTransform(statsProgress, [0.91, 1], [0, 1], { clamp: true })
  const ctaY = useTransform(statsProgress, [0.91, 1], [16, 0], { clamp: true })

  return (
    <section>
      <div ref={sequenceRef} className="relative" style={{ height: '300vh' }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center container-pad">
        {/* ── Logo + heading / reveal paragraph ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 mb-16 md:mb-24">
          <div className="md:col-span-3 flex flex-col gap-4">
            <motion.p
              className="label flex flex-col gap-3 leading-none"
              style={{
                color: 'var(--text)',
                textTransform: 'none',
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '0.01em',
                fontSize: 'clamp(1.75rem, 4vw, 3.4375rem)',
                opacity: reduce ? 1 : whyOpacity,
              }}
            >
              <span style={{ fontSize: '0.82em' }}>why</span>
              <span className="inline-flex items-center gap-3" style={{ whiteSpace: 'nowrap' }}>
                <img
                  src="/nnk-logo-transparent.png"
                  alt="NNK"
                  style={{ height: 'clamp(2.25rem, 5vw, 4.5rem)', width: 'auto', flexShrink: 0 }}
                />
                <span style={{ fontSize: 'clamp(2.25rem, 5vw, 4.5rem)', lineHeight: 1 }}>?</span>
              </span>
            </motion.p>
          </div>

          <div className="md:col-span-9 md:col-start-4">
            <p
              style={{
                ...TEXT_STYLE,
                color: 'var(--text)',
                fontWeight: 500,
                textAlign: 'right',
              }}
            >
              {PARA_LINES.map((line, li) => (
                <span key={li} style={{ display: 'block', whiteSpace: 'nowrap' }}>
                  {line.split(' ').map((word, wi) => {
                    const i = wordIndex++
                    const start = i / TOTAL_WORDS
                    const end = start + 1 / TOTAL_WORDS
                    return (
                      <Word key={wi} progress={wordsProgress} range={[start, end]} reduce={reduce}>
                        {word}
                      </Word>
                    )
                  })}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* ── Stat cards — wave-in, scroll-scrubbed reveal with eased count-up ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          {whyNnkStats.map((stat, i) => {
            const start = i * STAT_STAGGER
            const end = Math.min(start + STAT_SPAN, 1)
            return (
              <StatCard key={stat.label} stat={stat} progress={statsProgress} range={[start, end]} reduce={reduce} />
            )
          })}
        </div>

        <motion.div
          className="flex justify-center mt-10 md:mt-14"
          style={{ opacity: reduce ? 1 : ctaOpacity, y: reduce ? 0 : ctaY }}
        >
          <a href={gmailCompose('Build My System')} target="_blank" rel="noopener noreferrer">
            <ShinyButton>Build My System</ShinyButton>
          </a>
        </motion.div>
        </div>
      </div>
    </section>
  )
}
