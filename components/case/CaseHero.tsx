'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { RevealHeading, RevealText } from '@/components/case/Reveal'
import TiltCard from '@/components/case/TiltCard'
import ImageLightbox from '@/components/ui/ImageLightbox'

/* ── Types ───────────────────────────────────────────────────── */

export interface CaseHeroMetric {
  label: string
  value: string | number
  suffix?: string
}

export interface CaseHeroProject {
  name: string
  tagline: string
  category: string
  duration: string
  year: string | number
  image: string
  mockup: string
  metrics: CaseHeroMetric[]
}

export interface CaseHeroProps {
  project: CaseHeroProject
}

/* ── Signature easing ────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const

/* ── Component ───────────────────────────────────────────────── */

export default function CaseHero({ project }: CaseHeroProps) {
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)

  /* Background Ken-Burns parallax (eased to a no-op when reduced) */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const scrimOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6])

  const chips = [project.category, project.duration, String(project.year)].filter(
    Boolean,
  )

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden border-b border-border"
      style={{ minHeight: '92vh' }}
    >
      {/* ── Background parallax image ─────────────────────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0 will-change-transform"
        style={
          reduce
            ? undefined
            : { scale: bgScale, y: bgY, transformOrigin: 'center center' }
        }
      >
        <img
          src={project.image}
          alt=""
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </motion.div>

      {/* ── Dark scrim (legible in both themes) ───────────────── */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(7,7,7,0.96) 0%, rgba(7,7,7,0.6) 42%, rgba(7,7,7,0.1) 100%)',
          opacity: reduce ? 1 : scrimOpacity,
        }}
      />
      {/* Subtle side vignette to anchor the text column */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(7,7,7,0.55) 0%, rgba(7,7,7,0.15) 38%, rgba(7,7,7,0) 65%)',
        }}
      />

      {/* ── Animated accent mesh blobs ────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={reduce ? '' : 'animate-mesh-a'}
          style={{
            position: 'absolute',
            top: '-12%',
            right: '-6%',
            width: '46vw',
            height: '46vw',
            maxWidth: 720,
            maxHeight: 720,
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, var(--accent-glow) 0%, rgba(0,170,255,0) 68%)',
            filter: 'blur(60px)',
            willChange: 'transform',
          }}
        />
        <div
          className={reduce ? '' : 'animate-mesh-b'}
          style={{
            position: 'absolute',
            bottom: '-18%',
            left: '-10%',
            width: '40vw',
            height: '40vw',
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: '9999px',
            background:
              'radial-gradient(circle, var(--accent-glow) 0%, rgba(0,170,255,0) 70%)',
            filter: 'blur(70px)',
            willChange: 'transform',
          }}
        />
      </div>

      {/* ── Faint grain ───────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ── Floating 3D mockup (lg+) ──────────────────────────── */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] hidden w-[46%] items-center justify-center pr-[clamp(1.25rem,5vw,5rem)] lg:flex">
        <motion.div
          className="pointer-events-auto w-full max-w-[560px]"
          style={reduce ? undefined : { y: mockupY }}
          initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 7, ease: 'easeInOut', repeat: Infinity }
            }
          >
            <TiltCard max={9} scale={1.02} radius="14px" glare>
              <div
                className="overflow-hidden rounded-[14px] border bg-glass"
                style={{
                  borderColor: 'var(--glass-border)',
                  boxShadow:
                    '0 40px 90px -30px rgba(0,0,0,0.65), 0 0 60px -12px var(--accent-glow)',
                }}
              >
                {/* Browser chrome */}
                <div
                  className="flex items-center gap-2 border-b px-4 py-3"
                  style={{ borderColor: 'var(--glass-border)' }}
                >
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span
                    className="ml-3 hidden h-5 flex-1 rounded-md sm:block"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  />
                </div>
                <div className="relative aspect-[16/10] w-full">
                  <ImageLightbox src={project.mockup} alt={`${project.name} interface preview`}>
                    <img
                      src={project.mockup}
                      alt={`${project.name} interface preview`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-left-top"
                    />
                  </ImageLightbox>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      {/* pointer-events-none here: this shell is full-width/height (min-h-[92vh])
          but the actual copy is capped at max-w-2xl below, so without this the
          empty right-hand portion of the box would sit above the floating
          mockup (z-10 vs its z-[5]) and silently swallow clicks meant for it. */}
      <div className="container-pad relative z-10 flex min-h-[92vh] flex-col justify-end pb-16 pt-28 lg:pb-20 pointer-events-none">
        <div className="w-full max-w-2xl pointer-events-auto">
          {/* Back link */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-white/60 transition-colors duration-300 hover:text-[var(--accent)]"
            >
              <ChevronLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
              Back to Projects
            </Link>
          </motion.div>

          {/* Chips row */}
          <motion.div
            className="mt-7 flex flex-wrap items-center gap-2.5"
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
          >
            {chips.map((chip) => (
              <motion.span
                key={chip}
                variants={{
                  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.6, ease: EASE },
                  },
                }}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-white/85"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>

          {/* Headline */}
          <RevealHeading
            text={project.name}
            as="h1"
            className="display-lg mt-6 text-white"
            stagger={0.07}
            delay={0.15}
          />

          {/* Tagline */}
          <RevealText
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/55"
            delay={0.3}
          >
            {project.tagline}
          </RevealText>

          {/* Metric pills */}
          {project.metrics?.length ? (
            <motion.div
              className="mt-9 flex flex-wrap gap-3"
              initial={reduce ? false : 'hidden'}
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
              }}
            >
              {project.metrics.map((m, i) => (
                <motion.div
                  key={`${m.label}-${i}`}
                  variants={{
                    hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: 'blur(0px)',
                      transition: { duration: 0.65, ease: EASE },
                    },
                  }}
                  className="rounded-2xl px-5 py-3.5"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 30px -12px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="whitespace-nowrap text-xl font-semibold leading-none text-[var(--accent)] sm:text-2xl">
                    {m.value}
                    {m.suffix ? (
                      <span className="text-base font-medium text-white/70">
                        {m.suffix}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-white/45">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* ── Scroll-down cue ───────────────────────────────────── */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <ChevronDown size={18} className="text-white/55" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
