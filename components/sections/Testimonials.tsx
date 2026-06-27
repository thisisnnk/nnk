'use client'
import { Fragment, useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import { testimonials } from '@/lib/data'
import ShinyButton from '@/components/ui/ShinyButton'
import { gmailCompose } from '@/lib/utils'

// Word-by-word fade-up
const wordContainer: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const wordContainerDelayed: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.025, delayChildren: 0.55 } },
}
const wordReveal: Variants = {
  hidden: { opacity: 0, y: '0.6em' },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

const HEADING_WORDS: { t: string; cls?: string; st?: React.CSSProperties; br?: boolean }[] = [
  { t: 'what', st: { fontWeight: 400, fontSize: '0.7em' } },
  { t: 'my', cls: 'uppercase', st: { fontFamily: "'Montserrat', sans-serif", fontWeight: 900 } },
  { t: 'users', cls: 'uppercase', br: true, st: { fontFamily: "'Montserrat', sans-serif", fontWeight: 900 } },
  { t: 'are', st: { fontWeight: 400, fontSize: '0.7em' } },
  { t: 'saying', st: { fontWeight: 400, fontSize: '0.7em' } },
]

const PARAGRAPH = 'Our platform has delivered consistent and measurable improvements for professionals across various industries.'

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div
      className="p-5 flex flex-col gap-4 mb-4 rounded-lg"
      style={{
        border: '1px solid rgba(var(--accent-rgb), 0.4)',
        background: 'var(--surface-2)',
      }}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid var(--border-strong)',
            color: 'var(--accent)',
            fontFamily: 'var(--font-display)',
          }}
        >
          {t.name[0]}
        </div>
        <div>
          <p
            className="text-sm font-semibold leading-tight"
            style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}
          >
            {t.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t.role}
          </p>
        </div>
      </div>

      {/* Quote mark + text */}
      <div>
        <p
          className="select-none leading-none mb-2"
          style={{
            fontSize: '1.75rem',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--accent)',
            opacity: 0.25,
            lineHeight: 1,
          }}
        >
          &#x201C;&#x201D;
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {t.text}
        </p>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  // Split into two columns and triple for a seamless infinite loop
  // Uneven split so the two columns have different heights and never line up row-to-row
  const col1 = [testimonials[0], testimonials[2], testimonials[3], testimonials[5]]
  const col2 = [testimonials[1], testimonials[4]]
  const col1Items = [...col1, ...col1, ...col1]
  const col2Items = [...col2, ...col2, ...col2]

  return (
    <section ref={ref} className="py-24 md:py-36 border-t border-border">
      <div className="container-pad">
        <div className="grid md:grid-cols-[5fr_7fr] gap-16 md:gap-20 items-center">

          {/* ── Left: Vertically centered heading ─────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded-full text-xs font-medium uppercase"
              style={{
                border: '1px solid var(--border)',
                background: 'var(--surface-2)',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.14em',
              }}
            >
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>/</span>
              Testimonials
            </motion.div>
            <motion.h2
              className="display-md mb-6"
              style={{ lineHeight: 0.75 }}
              variants={wordContainer}
              initial="hidden"
              animate={inView ? 'shown' : 'hidden'}
            >
              {HEADING_WORDS.map((w, i) => (
                <Fragment key={i}>
                  <motion.span
                    variants={wordReveal}
                    className={`inline-block ${w.cls ?? ''}`}
                    style={w.st}
                  >
                    {w.t}
                  </motion.span>
                  {w.br ? <br /> : ' '}
                </Fragment>
              ))}
            </motion.h2>
            <motion.p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-muted)', maxWidth: '28ch' }}
              variants={wordContainerDelayed}
              initial="hidden"
              animate={inView ? 'shown' : 'hidden'}
            >
              {PARAGRAPH.split(' ').map((word, i) => (
                <Fragment key={i}>
                  <motion.span variants={wordReveal} className="inline-block">
                    {word}
                  </motion.span>
                  {' '}
                </Fragment>
              ))}
            </motion.p>
          </div>

          {/* ── Right: auto-scroll marquee + CTA underneath ─────────── */}
          <div className="flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative overflow-hidden"
            style={{ height: '72vh' }}
          >
            {/* Top fade mask */}
            <div
              className="absolute inset-x-0 top-0 z-10 pointer-events-none"
              style={{
                height: '100px',
                background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)',
              }}
            />
            {/* Bottom fade mask */}
            <div
              className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
              style={{
                height: '100px',
                background: 'linear-gradient(to top, var(--bg) 0%, transparent 100%)',
              }}
            />

            {/* Two scrolling columns */}
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Column 1 */}
              <div className="testimonials-col flex flex-col">
                {col1Items.map((t, i) => (
                  <TestimonialCard key={i} t={t} />
                ))}
              </div>

              {/* Column 2 — different speed + offset for depth */}
              <div className="testimonials-col-offset flex flex-col">
                {col2Items.map((t, i) => (
                  <TestimonialCard key={i} t={t} />
                ))}
              </div>
            </div>
          </motion.div>

            {/* CTA — sits directly under the testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center"
            >
              <a
                href={gmailCompose('Build My System')}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Email NNK to build your system"
              >
                <ShinyButton>Build My System</ShinyButton>
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
