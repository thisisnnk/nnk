'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import DotGrid from '@/components/ui/DotGrid'
import ShinyButton from '@/components/ui/ShinyButton'

const HERO_SIZE = 'clamp(1.25rem, 4.8vw, 5.25rem)'
const EXIT_DUR  = 0.14
const ENTER_DUR = 0.32
const CYCLE_MS  = 2200
const E_OUT: [number,number,number,number] = [0.0, 0.0, 0.2, 1.0]
const E_IN:  [number,number,number,number] = [0.4, 0.0, 1.0, 1.0]

const CYCLE_WORDS = ['OPERATIONAL', 'WORKFLOW']

const LINE_1: { w: string; accent: boolean }[] = [
  { w: 'building', accent: false },
  { w: 'SYSTEMS',  accent: true  },
  { w: 'that',     accent: false },
  { w: 'solve',    accent: false },
]

// ─── Blur-stagger helpers ─────────────────────────────────────────────────────
const blurLetter = {
  hidden: { opacity: 0, filter: 'blur(12px)' },
  show:   { opacity: 1, filter: 'blur(0px)'  },
}

function blurContainer(delayChildren: number) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        // Snap the parent visible only once the stagger begins —
        // prevents children (e.g. cycling word box) appearing early.
        opacity: { delay: delayChildren, duration: 0 },
        staggerChildren: 0.03,
        delayChildren,
      },
    },
  }
}

// Splits a string into individually animated blur-stagger spans
function BlurChars({ text }: { text: string }) {
  return (
    <>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={blurLetter}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

const wordStyle = (accent: boolean): React.CSSProperties =>
  accent
    ? { fontFamily: "'Montserrat', sans-serif", fontWeight: 900, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--accent)' }
    : { fontFamily: "'Montserrat', sans-serif", fontWeight: 900, letterSpacing: '-0.01em', textTransform: 'uppercase', color: 'var(--text)'   }

function CursorIcon() {
  return (
    <svg width="13" height="18" viewBox="0 0 13 18" fill="none" aria-hidden style={{ display: 'block' }}>
      <path
        d="M1.5 1.5 L1.5 15 L5 11 L7.5 17.5 L10.5 16.5 L8 10 L12.5 10 Z"
        fill="var(--text)" stroke="rgba(0,0,0,0.35)" strokeWidth="1" strokeLinejoin="round"
      />
    </svg>
  )
}

function CtaWithTooltip() {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 25 })
  const springY = useSpring(y, { stiffness: 300, damping: 25 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const { left, top } = el.getBoundingClientRect()
    x.set(e.clientX - left)
    y.set(e.clientY - top - 40)
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <a href="mailto:thenameisnnk@gmail.com?subject=Build%20Your%20System">
        <ShinyButton>Build Your System</ShinyButton>
      </a>
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="tooltip"
            style={{ x: springX, y: springY, translateX: '-50%', position: 'absolute', top: 0, left: 0 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none flex items-center justify-center"
          >
            <span
              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Let&apos;s Talk
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => setWordIndex(i => (i + 1) % CYCLE_WORDS.length), CYCLE_MS)
    }, 3600)
    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <DotGrid />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center container-pad pt-14">

        <h1 className="mx-auto" style={{ lineHeight: 1.12, fontSize: HERO_SIZE }}>

          {/* Line 1 — single container so stagger runs across all words */}
          <motion.span
            className="block whitespace-nowrap"
            variants={blurContainer(0.5)}
            initial="hidden"
            animate="show"
          >
            {LINE_1.map((word, wi) => (
              <span key={wi} className="inline-block mr-[0.25em]" style={wordStyle(word.accent)}>
                <BlurChars text={word.w} />
              </span>
            ))}
          </motion.span>

          {/* Line 2 — cycling word box + CHALLENGES */}
          <motion.span
            className="block mt-2 text-center"
            variants={blurContainer(1.2)}
            initial="hidden"
            animate="show"
          >
            <span style={{ display: 'inline-flex', flexWrap: 'nowrap', alignItems: 'center', gap: '0.3em' }}>

              {/* Cycling word box — border draws in after all content loads */}
              <motion.span
                layout
                transition={{ layout: { duration: ENTER_DUR, ease: E_OUT } }}
                className="relative rounded-2xl"
                style={{ display: 'inline-flex', alignItems: 'center', padding: '0.1em 0.28em', overflow: 'visible', willChange: 'transform', flexShrink: 0 }}
              >
                {/* Border sides — draw clockwise: top → right → bottom → left */}
                <motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.2, duration: 0.35, ease: 'easeOut' }} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2.5, background: 'var(--text)', transformOrigin: 'left center', pointerEvents: 'none' }} />
                <motion.span aria-hidden initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 2.55, duration: 0.2, ease: 'easeOut' }} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 2.5, background: 'var(--text)', transformOrigin: 'center top', pointerEvents: 'none' }} />
                <motion.span aria-hidden initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 2.75, duration: 0.35, ease: 'easeOut' }} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2.5, background: 'var(--text)', transformOrigin: 'right center', pointerEvents: 'none' }} />
                <motion.span aria-hidden initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 3.1, duration: 0.2, ease: 'easeOut' }} style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2.5, background: 'var(--text)', transformOrigin: 'center bottom', pointerEvents: 'none' }} />

                <span style={{ position: 'relative', display: 'block', overflow: 'hidden', lineHeight: 1 }}>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={wordIndex}
                      layout
                      initial={{ opacity: 0, y: '1.1em' }}
                      animate={{ opacity: 1, y: 0, transition: { duration: ENTER_DUR, ease: [0.16, 1, 0.3, 1] } }}
                      exit={{    opacity: 0, y: '-1.1em', transition: { duration: EXIT_DUR, ease: E_IN } }}
                      className="inline-block"
                      style={{ ...wordStyle(true), willChange: 'transform, opacity' }}
                    >
                      {CYCLE_WORDS[wordIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>

                {/* Corner squares — appear after box is fully drawn */}
                <motion.span aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 0.2 }} style={{ position: 'absolute', width: 11, height: 11, background: 'var(--text)', top: -4, left: -4, pointerEvents: 'none' }} />
                <motion.span aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 0.2 }} style={{ position: 'absolute', width: 11, height: 11, background: 'var(--text)', top: -4, right: -4, pointerEvents: 'none' }} />
                <motion.span aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 0.2 }} style={{ position: 'absolute', width: 11, height: 11, background: 'var(--text)', bottom: -4, left: -4, pointerEvents: 'none' }} />
                <motion.span aria-hidden initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.3, duration: 0.2 }} style={{ position: 'absolute', bottom: -4, right: -4, pointerEvents: 'none' }}>
                  <span style={{ display: 'block', width: 11, height: 11, background: 'var(--text)' }} />
                  <span style={{ position: 'absolute', top: 8, left: 8 }}><CursorIcon /></span>
                </motion.span>
              </motion.span>

              {/* CHALLENGES — char stagger */}
              <motion.span
                layout
                transition={{ layout: { duration: ENTER_DUR, ease: E_OUT } }}
                style={{ ...wordStyle(false), flexShrink: 0 }}
              >
                <BlurChars text="CHALLENGES" />
              </motion.span>

            </span>
          </motion.span>

        </h1>

        {/* CTAs — blur fade as a whole */}
        <motion.div
          className="mt-12 flex flex-row flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <CtaWithTooltip />
        </motion.div>


      </div>

      {/* Bottom fade — blends hero into the page background */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--bg) 100%)' }}
      />
    </section>
  )
}
