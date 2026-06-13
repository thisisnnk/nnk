'use client'
import { useRef } from 'react'
import { motion, useInView, type TargetAndTransition } from 'framer-motion'
import { aboutMetrics } from '@/lib/data'
import CountUp from '@/components/ui/CountUp'
import AboutApproach from '@/components/sections/AboutApproach'

const WHAT_I_DO = [
  'Identify operational bottlenecks and inefficiencies',
  'Understand user, team, and business needs',
  'Design workflows, products and systems around real problems',
  'Build internal tools, automations, and business solutions',
]

// Each "What I Do" line gets a distinct entrance (MASTER: not all the same).
const WHAT_I_DO_VARIANTS: { hidden: TargetAndTransition; shown: TargetAndTransition }[] = [
  { hidden: { opacity: 0, x: -40 }, shown: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, y: 40 }, shown: { opacity: 1, y: 0 } },
  { hidden: { opacity: 0, x: 40 }, shown: { opacity: 1, x: 0 } },
  { hidden: { opacity: 0, scale: 0.9 }, shown: { opacity: 1, scale: 1 } },
]

const CLIENT_LOGOS = ['Meridian Logistics', 'Okafor Consulting', 'VelocityHealth', 'LayerStack', 'Studio Forma', 'Axis Creative']

const INTRO = "Hi, I'm NNK. I design and build systems that help businesses operate better."

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <main className="pt-14">
      {/* ── Section 1 · Intro ──────────────────────────────── */}
      <section className="relative container-pad py-24 md:py-36 border-b border-border overflow-hidden">
        {/* Ambient background motion */}
        <div
          className="absolute -top-1/4 right-0 w-[50vw] h-[50vw] rounded-full pointer-events-none animate-mesh-a"
          style={{ background: 'radial-gradient(circle, rgba(0,170,255,0.12) 0%, transparent 60%)', filter: 'blur(50px)' }}
        />
        <div className="relative max-w-6xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="label mb-6"
          >
            About NNK
          </motion.p>
          {/* Headline — word by word */}
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
            className="display-lg max-w-5xl"
          >
            {INTRO.split(' ').map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  variants={{ hidden: { opacity: 0, y: '0.7em' }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 18 } } }}
                  className="inline-block mr-[0.22em]"
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-muted)' }}
          >
            My background is in design — over time I expanded into Product Design, Business Systems Design, and No-Code Development to solve operational challenges and create scalable solutions.
          </motion.p>
        </div>
      </section>

      {/* ── Section 2 · Clients ────────────────────────────── */}
      <section className="py-20 border-b border-border overflow-hidden">
        <div className="container-pad mb-10">
          <FadeIn>
            <p className="label mb-2">Clients</p>
            <h2 className="display-sm">Businesses I&apos;ve Worked With</h2>
          </FadeIn>
        </div>
        <div className="flex overflow-hidden">
          {[0, 1].map((dup) => (
            <ul
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 min-w-full items-center justify-around gap-8 animate-marquee"
            >
              {CLIENT_LOGOS.map((logo) => (
                <li
                  key={logo}
                  className="flex-shrink-0 px-6 py-3 whitespace-nowrap rounded-full"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <span className="text-sm font-medium tracking-wide" style={{ color: 'var(--text-muted)' }}>{logo}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* ── Section 3 · What I Do ──────────────────────────── */}
      <section className="container-pad py-24 md:py-36 border-b border-border">
        <FadeIn className="mb-16">
          <p className="label mb-3">Capabilities</p>
          <h2 className="display-md">What I Do</h2>
        </FadeIn>
        <div className="flex flex-col">
          {WHAT_I_DO.map((point, i) => {
            const v = WHAT_I_DO_VARIANTS[i]
            return (
              <WhatIDoRow key={i} variant={v} index={i}>
                {point}
              </WhatIDoRow>
            )
          })}
        </div>
      </section>

      {/* ── Section 4 · My Approach (horizontal scroll) ────── */}
      <AboutApproach />

      {/* ── Section 5 · Results ────────────────────────────── */}
      <section className="container-pad py-24 md:py-36">
        <FadeIn className="mb-16">
          <p className="label mb-3">Impact</p>
          <h2 className="display-md">What This Delivers</h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: 'var(--border)' }}>
          {aboutMetrics.map((m, i) => (
            <FadeIn key={i} delay={0.08 * i}>
              <div className="py-12 md:py-16 px-6" style={{ background: 'var(--bg)' }}>
                <CountUp
                  value={m.value}
                  suffix={m.suffix}
                  className="font-display font-bold block mb-2"
                  style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--accent)' }}
                />
                <p className="label-muted">{m.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </main>
  )
}

function WhatIDoRow({
  children,
  variant,
  index,
}: {
  children: React.ReactNode
  variant: { hidden: TargetAndTransition; shown: TargetAndTransition }
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  return (
    <motion.div
      ref={ref}
      variants={{ hidden: variant.hidden, shown: variant.shown }}
      initial="hidden"
      animate={inView ? 'shown' : 'hidden'}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-5 py-7 border-b border-border last:border-none group"
    >
      <span className="font-display font-bold text-text-dim text-lg shrink-0 w-8">0{index + 1}</span>
      <span className="text-accent text-xl leading-none mt-1">→</span>
      <span className="text-xl md:text-2xl font-medium leading-snug group-hover:text-accent transition-colors duration-200">
        {children}
      </span>
    </motion.div>
  )
}
