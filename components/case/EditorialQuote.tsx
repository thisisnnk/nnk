'use client'

import { useRef } from 'react'
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { RevealText } from '@/components/case/Reveal'

const EASE = [0.16, 1, 0.3, 1] as const

export interface EditorialQuoteProps {
  children: React.ReactNode
  label?: string
}

/* Single word — opacity is driven by scroll position so the line
   reveals word-by-word as it crosses the viewport. */
function Word({
  word,
  progress,
  start,
  end,
  reduce,
}: {
  word: string
  progress: MotionValue<number>
  start: number
  end: number
  reduce: boolean | null
}) {
  const opacity = useTransform(progress, [start, end], [0.14, 1])
  const blur = useTransform(progress, [start, end], ['blur(3px)', 'blur(0px)'])
  return (
    <motion.span
      className="inline-block"
      style={{
        opacity: reduce ? 1 : opacity,
        filter: reduce ? undefined : blur,
        willChange: 'opacity, filter',
      }}
    >
      {word}
    </motion.span>
  )
}

export default function EditorialQuote({
  children,
  label = 'Key Insight',
}: EditorialQuoteProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)

  const barInView = useInView(barRef, { once: true, margin: '-12%' })
  const blockInView = useInView(quoteRef, { once: true, margin: '-12%' })

  // Scroll progress across the quote — drives the word-by-word reveal.
  // Keyed to the quote's TOP edge (not bottom) so even tall quotes finish
  // revealing once they're comfortably in the reading area.
  const { scrollYProgress } = useScroll({
    target: quoteRef,
    offset: ['start 0.95', 'start 0.55'],
  })

  // Word-level reveal only works on plain text; anything else falls back
  // to a single fade-up-blur block.
  const words = typeof children === 'string' ? children.trim().split(/\s+/) : null

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        paddingTop: 'clamp(6rem, 12vw, 7rem)',
        paddingBottom: 'clamp(6rem, 12vw, 7rem)',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Accent mesh / radial glow in a corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 80% at 92% 12%, var(--accent-glow), transparent 62%), radial-gradient(50% 70% at 4% 96%, var(--accent-dim), transparent 60%)',
          opacity: 0.7,
        }}
      />

      {/* Oversized quotation-mark watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute select-none"
        style={{
          top: 'clamp(-1.5rem, -2vw, -0.5rem)',
          left: 'clamp(0.5rem, 3vw, 3rem)',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          lineHeight: 1,
          fontSize: 'clamp(12rem, 26vw, 22rem)',
          color: 'var(--border)',
          opacity: 0.45,
        }}
      >
        &ldquo;
      </span>

      <div className="container-pad relative">
        {/* Kicker label */}
        <RevealText className="label" y={14}>
          {label}
        </RevealText>

        <div
          className="relative mt-6 flex items-stretch"
          style={{ gap: 'clamp(1.25rem, 3vw, 2rem)' }}
        >
          {/* Drawing accent bar */}
          <motion.span
            ref={barRef}
            aria-hidden
            className="block shrink-0 self-stretch rounded-full"
            style={{
              width: 4,
              minHeight: '100%',
              transformOrigin: 'top',
              background:
                'linear-gradient(180deg, var(--accent), var(--accent-glow))',
              boxShadow: '0 0 18px var(--accent-glow)',
            }}
            initial={reduce ? false : { scaleY: 0, opacity: 0 }}
            animate={
              reduce
                ? { scaleY: 1, opacity: 1 }
                : barInView
                ? { scaleY: 1, opacity: 1 }
                : { scaleY: 0, opacity: 0 }
            }
            transition={{ duration: 0.8, ease: EASE }}
          />

          {/* The quote */}
          <blockquote
            ref={quoteRef}
            className="max-w-5xl"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontStyle: 'normal',
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
              color: 'var(--text)',
            }}
          >
            {words ? (
              words.map((w, i) => {
                const span = 1 / words.length
                const start = i * span
                // each word finishes a touch before the next begins → smooth sweep
                const end = Math.min(1, start + span * 1.8)
                return (
                  <span key={`${w}-${i}`}>
                    <Word word={w} progress={scrollYProgress} start={start} end={end} reduce={reduce} />
                    {i < words.length - 1 ? ' ' : null}
                  </span>
                )
              })
            ) : (
              <motion.span
                style={{ display: 'inline-block' }}
                initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : blockInView
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : { opacity: 0, y: 24, filter: 'blur(8px)' }
                }
                transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
              >
                {children}
              </motion.span>
            )}
          </blockquote>
        </div>
      </div>
    </section>
  )
}
