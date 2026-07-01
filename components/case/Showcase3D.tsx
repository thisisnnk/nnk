"use client"

import React, { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import TiltCard from '@/components/case/TiltCard'
import { Illustration3D } from '@/components/case/Illustration3D'

type ShowcaseKind = 'browser' | 'window' | 'phone' | 'plain'

type IllustrationName =
  | 'dashboard'
  | 'workflow'
  | 'database'
  | 'roles'
  | 'pipeline'
  | 'mobile'
  | 'gate'
  | 'analytics'

export interface Showcase3DProps {
  /** Optional image URL. Rendered with a plain <img> (loading="lazy"). */
  src?: string
  /** Short label rendered below the frame and used as the placeholder caption. */
  label?: string
  /** CSS aspect-ratio string for the media area, e.g. '21/9' or '16/9'. */
  ratio?: string
  /** Frame chrome style. */
  kind?: ShowcaseKind
  /** Caption rendered below the frame (falls back to label). */
  caption?: string
  className?: string
  /** Illustration shown in the generated placeholder when no src is given. */
  illustration?: IllustrationName
}

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Showcase3D — premium 3D-perspective device/browser mockup that holds a sample
 * image. Full-width drop-in replacement for the old ImagePlaceholder.
 */
export default function Showcase3D({
  src,
  label,
  ratio = '21/9',
  kind = 'browser',
  caption,
  className,
  illustration = 'dashboard',
}: Showcase3DProps) {
  const reduce = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  // Scroll-driven parallax: lift + slight rotateX as the frame travels through view.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const yRaw = useTransform(scrollYProgress, [0, 1], [54, -54])
  const rotRaw = useTransform(scrollYProgress, [0, 0.5, 1], [5.5, 0, -5.5])

  const y = useSpring(yRaw, { stiffness: 80, damping: 22, mass: 0.6 })
  const rotateX = useSpring(rotRaw, { stiffness: 80, damping: 22, mass: 0.6 })

  const captionText = caption ?? label
  const altText = label || caption || ''

  return (
    <section
      ref={sectionRef}
      className={`relative w-full container-pad py-10 sm:py-14 lg:py-16 ${className ?? ''}`}
    >
      <div
        className="relative mx-auto w-full max-w-6xl"
        style={{ perspective: 1100 }}
      >
        <motion.div
          style={
            reduce
              ? undefined
              : { y, rotateX, transformStyle: 'preserve-3d' as const }
          }
        >
          <TiltCard max={6} scale={1.015} radius="1rem" glare>
            <FrameChrome kind={kind}>
              <Media
                src={src}
                ratio={ratio}
                altText={altText}
                label={label}
                illustration={illustration}
                kind={kind}
              />
            </FrameChrome>
          </TiltCard>
        </motion.div>
      </div>

      {captionText ? (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="label-muted relative mt-7 text-center"
        >
          {captionText}
        </motion.p>
      ) : null}
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Frame chrome                                                       */
/* ------------------------------------------------------------------ */

function FrameChrome({
  kind,
  children,
}: {
  kind: ShowcaseKind
  children: React.ReactNode
}) {
  const isPhone = kind === 'phone'

  const frameStyle: React.CSSProperties = {
    background: 'var(--surface)',
    border: '1px solid var(--border-strong)',
    boxShadow:
      '0 40px 120px -40px rgba(0,0,0,0.55), 0 0 0 1px var(--border)',
  }

  if (isPhone) {
    return (
      <div
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[2.25rem] p-2.5"
        style={frameStyle}
      >
        {/* Notch */}
        <div className="pointer-events-none absolute left-1/2 top-2.5 z-10 -translate-x-1/2">
          <div
            className="h-5 w-28 rounded-b-2xl"
            style={{ background: 'var(--border-strong)' }}
          />
        </div>
        <div
          className="overflow-hidden rounded-[1.65rem]"
          style={{ border: '1px solid var(--border)' }}
        >
          {children}
        </div>
      </div>
    )
  }

  if (kind === 'plain') {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={frameStyle}
      >
        {children}
      </div>
    )
  }

  // 'browser' | 'window'
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={frameStyle}
    >
      <TopBar kind={kind} />
      <div
        className="overflow-hidden"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {children}
      </div>
    </div>
  )
}

function TopBar({ kind }: { kind: ShowcaseKind }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3"
      style={{ background: 'var(--surface)' }}
    >
      <div className="flex items-center gap-2">
        <Dot color="#ff5f57" />
        <Dot color="#febc2e" />
        <Dot color="#28c840" />
      </div>

      {kind === 'browser' ? (
        <div
          className="ml-2 flex h-7 flex-1 items-center gap-2 rounded-full px-3"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
          }}
        >
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ border: '1.5px solid var(--text-dim)' }}
            aria-hidden
          />
          <span
            className="truncate text-[11px] tracking-wide"
            style={{ color: 'var(--text-dim)' }}
          >
            nnk.design / case-study
          </span>
        </div>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3 w-3 rounded-full"
      style={{ background: color, boxShadow: `0 0 0 0.5px rgba(0,0,0,0.15)` }}
      aria-hidden
    />
  )
}

/* ------------------------------------------------------------------ */
/* Media area                                                         */
/* ------------------------------------------------------------------ */

function Media({
  src,
  ratio,
  altText,
  label,
  illustration,
  kind,
}: {
  src?: string
  ratio: string
  altText: string
  label?: string
  illustration: IllustrationName
  kind: ShowcaseKind
}) {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: ratio, background: 'var(--surface)' }}
    >
      {src ? (
        <img
          src={src}
          alt={altText}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <Placeholder label={label} illustration={illustration} kind={kind} />
      )}
    </div>
  )
}

function Placeholder({
  label,
  illustration,
  kind,
}: {
  label?: string
  illustration: IllustrationName
  kind: ShowcaseKind
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 120% at 30% 0%, var(--accent-dim) 0%, transparent 55%), radial-gradient(120% 120% at 80% 100%, var(--accent-glow) 0%, transparent 50%), var(--surface)',
      }}
    >
      {/* Mesh grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.6]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage:
            'radial-gradient(80% 80% at 50% 50%, #000 0%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(80% 80% at 50% 50%, #000 0%, transparent 78%)',
        }}
      />

      <div className="relative">
        <Illustration3D
          name={illustration}
          size={kind === 'phone' ? 116 : 168}
          float
        />
      </div>

      {label ? (
        <span className="label-muted relative">{label}</span>
      ) : null}
    </div>
  )
}
