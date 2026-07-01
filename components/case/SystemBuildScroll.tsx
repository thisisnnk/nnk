'use client'

/* ─────────────────────────────────────────────────────────────────────────
 * SystemBuildScroll — System Build screen walkthrough.
 *
 * Each screen is its OWN separate section: the heading + image pin on the left
 * while that screen's numbered features scroll past on the right, holding until
 * the last feature line reaches the image's bottom edge, then the image scrolls
 * away and the next screen's section begins. No cross-fade / shared stage.
 *
 * Image height: the frame takes the screenshot's full natural ratio (uncropped).
 * If the image ends up taller than its feature column, the pin releases cleanly
 * at the viewport bottom instead of forcing an impossible alignment.
 *
 * The pin is driven by GSAP ScrollTrigger (already loaded + Lenis-synced in
 * LenisProvider) rather than `position: sticky`, because an `overflow: hidden`
 * ancestor on the section breaks native sticky.
 *
 * Content is data-driven: add a screen to `systemBuild.screens` and a new
 * section appears. Missing screenshots render a labelled placeholder showing
 * the expected /public path, so the layout never breaks while assets are added.
 * ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { SystemScreen } from '@/lib/case-studies'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.16, 1, 0.3, 1] as const

/** Distance from the top of the viewport the pinned stage rests at (clears the navbar). */
const PIN_TOP = 88
/** Frame ratio used before a screenshot reports its natural dimensions. */
const DEFAULT_RATIO = 16 / 10

/* Browser-chrome frame around the image stage. The image area takes `ratio`,
   unless `fitWidth` is true — in that case the image defines its own height.
   When `scrollable` is also true the content area becomes an overflow-y:auto
   window (75vh) so very tall full-page screenshots are fully accessible. */
function Frame({
  ratio,
  fitWidth,
  scrollable,
  children,
}: {
  ratio: number
  fitWidth?: boolean
  scrollable?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: '0 24px 60px -28px rgba(0,0,0,0.45)',
      }}
    >
      <div
        className="flex items-center gap-1.5 px-4 h-9"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#febc2e' }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
      </div>
      {fitWidth ? (
        <div
          className="w-full"
          style={scrollable ? { overflowY: 'auto', maxHeight: '90vh' } : undefined}
          {...(scrollable ? { 'data-lenis-prevent': '' } : {})}
        >
          {children}
        </div>
      ) : (
        <div className="relative w-full" style={{ aspectRatio: String(ratio) }}>
          {children}
        </div>
      )}
    </div>
  )
}

/* Fills the frame: the screenshot (top-anchored), or a labelled placeholder. */
function ScreenImage({
  screen,
  errored,
  fitWidth,
  onError,
  onMeta,
}: {
  screen: SystemScreen
  errored: boolean
  fitWidth?: boolean
  onError: () => void
  onMeta: (ratio: number) => void
}) {
  const reduce = useReducedMotion()
  if (errored) {
    return (
      <div
        className={fitWidth ? 'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center' : 'absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center'}
        style={{ background: 'var(--surface)' }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          style={{ color: 'var(--border-strong)' }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21,15 16,10 5,21" />
        </svg>
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-dim)' }}>
          {screen.title}
        </p>
        <code className="text-[11px]" style={{ color: 'var(--text-dim)', opacity: 0.75 }}>
          {screen.image}
        </code>
      </div>
    )
  }
  if (fitWidth) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <motion.img
        src={screen.image}
        alt={screen.title}
        loading="eager"
        onError={onError}
        onLoad={(e) => {
          const el = e.currentTarget
          if (el.naturalWidth && el.naturalHeight) onMeta(el.naturalWidth / el.naturalHeight)
        }}
        className="w-full h-auto block"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={reduce ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: '-8%' }}
        transition={{ duration: 1.1, ease: EASE }}
      />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <motion.img
      src={screen.image}
      alt={screen.title}
      loading="lazy"
      onError={onError}
      onLoad={(e) => {
        const el = e.currentTarget
        if (el.naturalWidth && el.naturalHeight) onMeta(el.naturalWidth / el.naturalHeight)
      }}
      className="absolute inset-0 w-full h-full object-cover object-top"
      initial={reduce ? false : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.8, ease: EASE }}
    />
  )
}

/* Download CTA shown beneath a screen's features. A same-origin <a download>
   triggers an automatic save to the visitor's device on click — no JS needed. */
function DownloadButton({ download }: { download: NonNullable<SystemScreen['download']> }) {
  const reduce = useReducedMotion()
  const label = download.label ?? 'Download PDF'
  return (
    <motion.a
      href={download.href}
      download={download.filename ?? ''}
      className="group inline-flex items-center gap-2.5 mt-8 rounded-full px-6 py-3 text-sm font-semibold transition-transform"
      style={{ background: 'var(--accent)', color: 'var(--accent-contrast, #fff)' }}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduce ? undefined : { y: -2 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform group-hover:translate-y-0.5"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </motion.a>
  )
}

/* The screen heading shown above the image (kicker + title). */
function ScreenHeading({ index, title }: { index: number; title: string }) {
  return (
    <>
      <p
        className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
        style={{ color: 'var(--accent)' }}
      >
        Screen {String(index + 1).padStart(2, '0')}
      </p>
      <h4
        className="font-display font-bold mb-5"
        style={{ fontSize: '1.5rem', lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--text)' }}
      >
        {title}
      </h4>
    </>
  )
}

/* One self-contained screen: pinned image (left) + scrolling features (right). */
function ScreenSection({ screen, index }: { screen: SystemScreen; index: number }) {
  const reduce = useReducedMotion()
  const [errored, setErrored] = useState(false)
  const [ratio, setRatio] = useState<number | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const lastContentRef = useRef<HTMLOListElement>(null)

  // Pin this screen's stage while its features scroll (lg+ only). Native
  // `position: sticky` is defeated by an `overflow: hidden` ancestor, so the
  // pin is driven by ScrollTrigger.
  // noPin screens (very tall images) skip the pin so the full image scrolls naturally.
  useEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage || screen.noPin) return

    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const st = ScrollTrigger.create({
        trigger: container,
        start: `top ${PIN_TOP}`,
        // Release when the last feature line reaches the image's bottom edge, so
        // the text ends level with the image. If the image is taller than the
        // text column (so the last line can't reach it), release cleanly at the
        // viewport bottom instead.
        end: () => {
          const frame = frameRef.current
          const lastContent = lastContentRef.current
          if (!frame || !stage || !lastContent) return 'bottom bottom'
          const headingH = frame.getBoundingClientRect().top - stage.getBoundingClientRect().top
          const imageBottomY = PIN_TOP + headingH + frame.offsetHeight
          const padGap = container.getBoundingClientRect().bottom - lastContent.getBoundingClientRect().bottom
          const alignEnd = imageBottomY + padGap
          const containerBottomAtStart = PIN_TOP + container.getBoundingClientRect().height
          if (alignEnd >= containerBottomAtStart) return 'bottom bottom'
          return `bottom top+=${Math.round(alignEnd)}`
        },
        pin: stage,
        // pinSpacing:true reserves the pin's scroll distance in the layout so the
        // NEXT screen never scrolls up over the still-pinned image (the overlap
        // bug where a previous screenshot bled under the next section).
        pinSpacing: true,
        invalidateOnRefresh: true,
        // Scrollbar-drag / keyboard PgUp-PgDn / trackpad flicks can jump the
        // scroll position several pixels between ticks. Without this, a fast
        // jump right at the pin boundary can leave this screen's frame still
        // rendered fixed for one frame while the next screen's pin engages,
        // producing the flash where two screenshots appear stacked. anticipatePin
        // makes ScrollTrigger account for that gap so the pin engages/releases
        // exactly at the boundary regardless of scroll speed or direction.
        anticipatePin: 1,
      })
      return () => st.kill()
    })

    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 200)
    window.addEventListener('load', refresh)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      mm.revert()
    }
  }, [])

  // Image height changes the pinned stage height — re-measure the pin.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 60)
    return () => clearTimeout(t)
  }, [ratio])

  const frameRatio = ratio ?? DEFAULT_RATIO

  return (
    <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 xl:gap-x-16">
      {/* LEFT — pinned stage: heading + image (desktop only). The heading pins
          with the image so it stays at the top while the features scroll, and
          whatever was above the section is pushed out of view. */}
      <div className="hidden lg:block">
        <div ref={stageRef}>
          <ScreenHeading index={index} title={screen.title} />
          <div ref={frameRef}>
            <Frame ratio={frameRatio} fitWidth={screen.fitWidth} scrollable={screen.scrollable}>
              <ScreenImage
                screen={screen}
                errored={errored}
                fitWidth={screen.fitWidth}
                onError={() => setErrored(true)}
                onMeta={setRatio}
              />
            </Frame>
          </div>
        </div>
      </div>

      {/* RIGHT — features. Top-aligned, with a heading-sized spacer on desktop so
          the first feature lines up with the image's top edge (not the heading). */}
      <div className="lg:min-h-[78vh] lg:pb-16">
        {/* Heading + image — mobile only (desktop shows them in the pinned stage) */}
        <div className="lg:hidden mb-7">
          <ScreenHeading index={index} title={screen.title} />
          <Frame ratio={frameRatio} fitWidth={screen.fitWidth} scrollable={screen.scrollable}>
            <ScreenImage
              screen={screen}
              errored={errored}
              fitWidth={screen.fitWidth}
              onError={() => setErrored(true)}
              onMeta={setRatio}
            />
          </Frame>
        </div>

        {/* Invisible spacer matching the heading's height (desktop only). */}
        <div className="hidden lg:block invisible" aria-hidden>
          <ScreenHeading index={index} title={screen.title} />
        </div>

        <ol className="space-y-5" ref={lastContentRef}>
          {screen.features.map((f, fi) => (
            <motion.li
              key={fi}
              className="flex gap-4"
              initial={reduce ? false : { opacity: 0, y: 26, filter: 'blur(6px)' }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-12% 0px -10% 0px' }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <motion.span
                className="font-display font-bold text-sm shrink-0 mt-0.5 tabular-nums"
                style={{ color: 'var(--accent)', minWidth: '1.75rem' }}
                initial={reduce ? false : { scale: 0.3, opacity: 0 }}
                whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-12%' }}
                transition={reduce ? undefined : { type: 'spring', stiffness: 360, damping: 14, delay: 0.08 }}
              >
                {String(fi + 1).padStart(2, '0')}
              </motion.span>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>
                  {f.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {f.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {screen.download && <DownloadButton download={screen.download} />}
      </div>
    </div>
  )
}

export default function SystemBuildScroll({ screens }: { screens: SystemScreen[] }) {
  return (
    <div className="space-y-16 lg:space-y-24">
      {screens.map((s, i) => (
        <ScreenSection key={s.id} screen={s} index={i} />
      ))}
    </div>
  )
}
