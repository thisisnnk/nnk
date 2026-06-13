'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { aboutApproach } from '@/lib/data'

/* ── Looping idle SVG illustrations (one per approach card) ─────────────── */

function SearchIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" stroke="var(--accent)" strokeWidth="2.5">
      <circle cx="50" cy="50" r="26" />
      <line x1="69" y1="69" x2="94" y2="94" strokeLinecap="round" />
      <motion.circle
        cx="50" cy="50" r="26"
        animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '50px 50px' }}
      />
      <motion.line
        x1="38" y1="50" x2="62" y2="50" strokeWidth="2" strokeLinecap="round"
        animate={{ x: [-6, 6, -6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function FunnelIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" stroke="var(--accent)" strokeWidth="2.5">
      <path d="M24 32 H96 L66 64 V92 L54 84 V64 Z" strokeLinejoin="round" />
      {[0, 0.7, 1.4].map((d, i) => (
        <motion.circle
          key={i} cx="60" cy="18" r="3.5" fill="var(--accent)" stroke="none"
          animate={{ y: [0, 42], opacity: [1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeIn', delay: d }}
        />
      ))}
    </svg>
  )
}

function BalanceIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" stroke="var(--accent)" strokeWidth="2.5">
      <line x1="60" y1="26" x2="60" y2="92" strokeLinecap="round" />
      <line x1="44" y1="92" x2="76" y2="92" strokeLinecap="round" />
      <motion.g
        animate={{ rotate: [-7, 7, -7] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 30px' }}
      >
        <line x1="30" y1="30" x2="90" y2="30" strokeLinecap="round" />
        <path d="M30 30 L22 46 H38 Z" strokeLinejoin="round" />
        <path d="M90 30 L82 46 H98 Z" strokeLinejoin="round" />
      </motion.g>
    </svg>
  )
}

function SimplifyIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" stroke="var(--accent)" strokeWidth="2.5">
      <motion.path
        d="M20 60 C35 30, 45 90, 60 55 S85 25, 100 60"
        strokeLinecap="round"
        animate={{ opacity: [1, 0], pathLength: [1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.line
        x1="20" y1="60" x2="100" y2="60" strokeLinecap="round"
        animate={{ opacity: [0, 1], pathLength: [0, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

const ILLUSTRATIONS: Record<string, () => React.JSX.Element> = {
  search: SearchIllustration,
  layers: FunnelIllustration,
  scale: BalanceIllustration,
  simplify: SimplifyIllustration,
}

/* ── Horizontal card track driven by vertical scroll ──────────────────── */

export default function AboutApproach() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [distance, setDistance] = useState(0)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  useEffect(() => {
    const calc = () => {
      const track = trackRef.current
      if (!track) return
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth + 80))
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  // Reduced-motion / no-pin fallback: a simple horizontal scroll strip.
  if (reduce) {
    return (
      <section className="py-24 md:py-36 border-b border-border" style={{ background: 'var(--surface)' }}>
        <div className="container-pad mb-12">
          <p className="label mb-3">Philosophy</p>
          <h2 className="display-md">My Approach</h2>
        </div>
        <div className="flex gap-6 overflow-x-auto px-[clamp(1.25rem,5vw,5rem)] no-scrollbar">
          {aboutApproach.map((card, i) => (
            <ApproachCard key={i} card={card} index={i} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-b border-border"
      style={{ height: `calc(100vh + ${distance}px)`, background: 'var(--surface)' }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container-pad mb-10">
          <p className="label mb-3">Philosophy</p>
          <h2 className="display-md">My Approach</h2>
        </div>
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 md:gap-8 px-[clamp(1.25rem,5vw,5rem)] will-change-transform"
        >
          {aboutApproach.map((card, i) => (
            <ApproachCard key={i} card={card} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ApproachCard({ card, index }: { card: typeof aboutApproach[0]; index: number }) {
  const Illustration = ILLUSTRATIONS[card.icon] ?? SearchIllustration
  return (
    <div
      className="shrink-0 w-[80vw] sm:w-[60vw] md:w-[44vw] lg:w-[32vw] p-8 md:p-10 rounded-2xl flex flex-col gap-6"
      style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between">
        <span className="label">0{index + 1}</span>
        <Illustration />
      </div>
      <h3 className="display-sm">{card.title}</h3>
      <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {card.body}
      </p>
    </div>
  )
}
