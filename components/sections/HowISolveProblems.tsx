'use client'
import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { howISolveProblems } from '@/lib/data'
import ShinyButton from '@/components/ui/ShinyButton'
import { gmailCompose } from '@/lib/utils'

/* ── Keyframes (injected once) ──────────────────────────────────────────── */
const SVG_ANIM = `
  @keyframes hsp-pop    { 0%,100%{transform:scale(.7);opacity:.35} 45%{transform:scale(1.9);opacity:1} }
  @keyframes hsp-core   { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(1.45);opacity:1} }
  @keyframes hsp-dash   { to{stroke-dashoffset:-200} }
  @keyframes hsp-dashR  { to{stroke-dashoffset:200} }
  @keyframes hsp-draw   { 0%{stroke-dashoffset:var(--len)} 55%,100%{stroke-dashoffset:0} }
  @keyframes hsp-scan   { 0%{transform:translateY(-48px);opacity:0} 12%,88%{opacity:.9} 100%{transform:translateY(48px);opacity:0} }
  @keyframes hsp-breathe{ 0%,100%{opacity:.1} 50%{opacity:.5} }
  @keyframes hsp-flick  { 0%,100%{opacity:.2} 50%{opacity:.9} }
  @keyframes hsp-spin   { to{transform:rotate(360deg)} }
`

/* scale about an element's own centre */
const FB: React.CSSProperties = { transformBox: 'fill-box', transformOrigin: 'center' }

/* Scroll (px) held before the horizontal pan begins. The heading is now static
   (no word-reveal), so there is no hold — the pan starts immediately. */
const REVEAL = 0

/* ── Per-card heavy visuals ─────────────────────────────────────────────── */
function StepVisual({ index, animated }: { index: number; animated: boolean }) {
  const A = `var(--accent)`
  const gid = `hsp-glow-${index}`

  const Defs = (
    <defs>
      <filter id={gid} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  )

  /* ── 01 Strategy — counter-rotating layered architecture + radar sweep ── */
  if (index === 0) {
    const squares = [
      { s: 56, dur: 26, dir: 1, op: 0.1 },
      { s: 40, dur: 20, dir: -1, op: 0.18 },
      { s: 24, dur: 15, dir: 1, op: 0.32 },
    ]
    return (
      <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        {Defs}
        {/* flowing crosshair */}
        {[
          'M80 8 V60', 'M80 100 V152', 'M8 80 H60', 'M100 80 H152',
        ].map((d, i) => (
          <path key={i} d={d} strokeDasharray="3 7"
            style={{ animation: animated ? `hsp-dash 3s linear infinite` : undefined, opacity: 0.25 }} />
        ))}

        {/* rotating concentric squares */}
        {squares.map((sq, i) => (
          <g key={i} opacity={sq.op}>
            <rect x={80 - sq.s} y={80 - sq.s} width={sq.s * 2} height={sq.s * 2} rx="3" />
            {animated && (
              <animateTransform attributeName="transform" type="rotate"
                from={`0 80 80`} to={`${sq.dir * 360} 80 80`} dur={`${sq.dur}s`} repeatCount="indefinite" />
            )}
          </g>
        ))}

        {/* radar sweep */}
        <g>
          <path d="M80 80 L80 22 A58 58 0 0 1 121 39 Z" fill={A} opacity="0.07" />
          <line x1="80" y1="80" x2="80" y2="22" stroke={A} strokeWidth="1.5" opacity="0.5" />
          {animated && (
            <animateTransform attributeName="transform" type="rotate"
              from="0 80 80" to="360 80 80" dur="7s" repeatCount="indefinite" />
          )}
        </g>

        {/* corner ticks */}
        {[[24, 24], [136, 24], [24, 136], [136, 136]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="1.5" fill="currentColor"
            style={{ animation: animated ? `hsp-flick 2.4s ease-in-out ${i * 0.3}s infinite` : undefined, opacity: 0.4 }} />
        ))}

        {/* pulsing core diamond */}
        <rect x="73" y="73" width="14" height="14" rx="2" fill={A} filter={`url(#${gid})`}
          transform="rotate(45 80 80)" style={{ animation: animated ? `hsp-core 2.6s ease-in-out infinite` : undefined, ...FB }} />
      </svg>
    )
  }

  /* ── 02 Systems — live network: flowing edges + travelling data packets ── */
  if (index === 1) {
    const N: [number, number][] = [[80, 24], [128, 52], [128, 108], [80, 136], [32, 108], [32, 52]]
    const C: [number, number] = [80, 80]
    return (
      <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        {Defs}

        {/* outer rotating dashed ring */}
        <g>
          <circle cx="80" cy="80" r="70" strokeDasharray="2 10" opacity="0.18" />
          {animated && (
            <animateTransform attributeName="transform" type="rotate"
              from="0 80 80" to="360 80 80" dur="24s" repeatCount="indefinite" />
          )}
        </g>

        {/* perimeter + spoke edges with flowing dashes */}
        {N.map(([x, y], i) => {
          const [nx, ny] = N[(i + 1) % N.length]
          return (
            <g key={i}>
              <path d={`M${C[0]} ${C[1]} L${x} ${y}`} strokeDasharray="3 5"
                style={{ animation: animated ? `hsp-dash 1.8s linear infinite` : undefined, opacity: 0.28 }} />
              <path d={`M${x} ${y} L${nx} ${ny}`} strokeDasharray="3 5"
                style={{ animation: animated ? `hsp-dashR 2.4s linear infinite` : undefined, opacity: 0.18 }} />
            </g>
          )
        })}

        {/* pulsing nodes */}
        {N.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="currentColor"
            style={{ animation: animated ? `hsp-pop 3s ease-in-out ${i * 0.5}s infinite` : undefined, opacity: 0.5, ...FB }} />
        ))}

        {/* travelling data packets (spokes) */}
        {animated && N.map(([x, y], i) => (
          <circle key={`p${i}`} r="2.4" fill={A} filter={`url(#${gid})`}>
            <animateMotion dur="2.2s" begin={`${i * 0.37}s`} repeatCount="indefinite"
              path={`M${C[0]},${C[1]} L${x},${y}`} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
          </circle>
        ))}

        {/* travelling packets (perimeter ring) */}
        {animated && [0, 2, 4].map((i) => {
          const ring = N.map(([x, y]) => `${x},${y}`).join(' L')
          return (
            <circle key={`r${i}`} r="2" fill={A} filter={`url(#${gid})`}>
              <animateMotion dur="6s" begin={`${i * 2}s`} repeatCount="indefinite"
                path={`M${ring} L${N[0][0]},${N[0][1]}`} />
            </circle>
          )
        })}

        {/* core */}
        <circle cx="80" cy="80" r="6" fill={A} filter={`url(#${gid})`}
          style={{ animation: animated ? `hsp-core 2s ease-in-out infinite` : undefined, ...FB }} />
      </svg>
    )
  }

  /* ── 03 Execution — radial supernova burst (outward ripple wave) ───────── */
  if (index === 2) {
    const RINGS = [
      { r: 14, n: 8 }, { r: 23, n: 12 }, { r: 32, n: 16 },
      { r: 41, n: 18 }, { r: 50, n: 22 }, { r: 59, n: 24 }, { r: 67, n: 26 },
    ]
    const dots: { cx: number; cy: number; delay: number; ring: number }[] = []
    RINGS.forEach((ring, ri) => {
      for (let k = 0; k < ring.n; k++) {
        const a = (k / ring.n) * Math.PI * 2 + ri * 0.4
        // Round to a fixed precision so the server- and client-rendered SVG
        // attribute strings match exactly (avoids a float hydration warning).
        dots.push({
          cx: Math.round((80 + ring.r * Math.cos(a)) * 1000) / 1000,
          cy: Math.round((80 + ring.r * Math.sin(a)) * 1000) / 1000,
          delay: -(RINGS.length - ri) * 0.16,
          ring: ri,
        })
      }
    })
    return (
      <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        {Defs}

        {/* faint guide rings */}
        {[30, 48, 66].map((r, i) => (
          <circle key={i} cx="80" cy="80" r={r} opacity="0.08" />
        ))}

        {/* rotating dot field with outward ripple */}
        <g>
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.ring < 2 ? 2 : 1.6}
              fill={d.ring < 2 ? A : 'currentColor'}
              style={{
                animation: animated ? `hsp-pop 2.2s ease-in-out infinite` : undefined,
                animationDelay: animated ? `${d.delay}s` : undefined,
                opacity: 0.5, ...FB,
              }} />
          ))}
          {animated && (
            <animateTransform attributeName="transform" type="rotate"
              from="0 80 80" to="360 80 80" dur="40s" repeatCount="indefinite" />
          )}
        </g>

        {/* crosshair spikes */}
        {[[80, 6, 80, 30], [80, 130, 80, 154], [6, 80, 30, 80], [130, 80, 154, 80]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={A} strokeWidth="1.4" opacity="0.45" />
        ))}

        {/* bright pulsing core */}
        <circle cx="80" cy="80" r="5" fill={A} filter={`url(#${gid})`}
          style={{ animation: animated ? `hsp-core 1.8s ease-in-out infinite` : undefined, ...FB }} />
      </svg>
    )
  }

  /* ── 04 Risk — self-drawing shield + descending scan beam + pulse rings ── */
  if (index === 3) {
    const shieldPath = 'M80 16 L132 46 V104 Q132 138 80 150 Q28 138 28 104 V46 Z'
    const inner = 'M80 32 L118 54 V102 Q118 126 80 136 Q42 126 42 102 V54 Z'
    return (
      <svg viewBox="0 0 160 160" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
        <defs>
          <filter id={gid} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id={`hsp-clip-${index}`}>
            <path d={shieldPath} />
          </clipPath>
        </defs>

        {/* dot grid inside shield */}
        <g clipPath={`url(#hsp-clip-${index})`}>
          {Array.from({ length: 7 }).map((_, row) =>
            Array.from({ length: 6 }).map((__, col) => (
              <circle key={`${row}-${col}`} cx={36 + col * 18} cy={28 + row * 18} r="1" fill="currentColor"
                style={{ animation: animated ? `hsp-breathe 3s ease-in-out ${(row + col) * 0.2}s infinite` : undefined, opacity: 0.2 }} />
            ))
          )}
          {/* descending scan beam */}
          <rect x="20" y="78" width="120" height="8" fill={A} filter={`url(#${gid})`}
            style={{ animation: animated ? `hsp-scan 3s ease-in-out infinite` : undefined }} />
        </g>

        {/* inner shield (static) */}
        <path d={inner} opacity="0.2" />

        {/* outer shield self-drawing */}
        <path d={shieldPath} stroke={A} strokeWidth="1.6" filter={`url(#${gid})`}
          pathLength={100}
          style={{
            // @ts-expect-error CSS custom property
            '--len': 100,
            strokeDasharray: 100,
            animation: animated ? `hsp-draw 4s ease-in-out infinite` : undefined,
            opacity: 0.85,
          }} />

        {/* central pulse */}
        <circle cx="80" cy="86" r="4" fill={A} filter={`url(#${gid})`}
          style={{ animation: animated ? `hsp-core 2.4s ease-in-out infinite` : undefined, ...FB }} />
      </svg>
    )
  }

  /* ── 05 Partnership — dual orbital system + infinity data exchange ─────── */
  const L: [number, number] = [54, 80]
  const R: [number, number] = [106, 80]
  const orbit = (cx: number, cy: number, rx: number, ry: number) =>
    `M${cx},${cy - ry} A${rx},${ry} 0 1,1 ${cx},${cy + ry} A${rx},${ry} 0 1,1 ${cx},${cy - ry}`
  const infinity = 'M80,80 C100,58 128,58 128,80 C128,102 100,102 80,80 C60,58 32,58 32,80 C32,102 60,102 80,80 Z'
  return (
    /* zoomed-in viewBox (centred at 80,80) enlarges the orbital system vs. the other cards */
    <svg viewBox="20 20 120 120" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full">
      {Defs}

      {/* orbit rings */}
      <ellipse cx={L[0]} cy={L[1]} rx="34" ry="44" opacity="0.22" />
      <ellipse cx={R[0]} cy={R[1]} rx="34" ry="44" opacity="0.22" />
      <ellipse cx={L[0]} cy={L[1]} rx="20" ry="28" opacity="0.14" />
      <ellipse cx={R[0]} cy={R[1]} rx="20" ry="28" opacity="0.14" />

      {/* infinity exchange path */}
      <path d={infinity} strokeDasharray="3 6" stroke={A} opacity="0.25"
        style={{ animation: animated ? `hsp-dash 4s linear infinite` : undefined }} />

      {/* orbiting particles */}
      {animated && (
        <>
          <circle r="3" fill="currentColor" opacity="0.7">
            <animateMotion dur="5s" repeatCount="indefinite" path={orbit(L[0], L[1], 34, 44)} />
          </circle>
          <circle r="2.4" fill="currentColor" opacity="0.5">
            <animateMotion dur="3.5s" begin="-1.5s" repeatCount="indefinite" path={orbit(L[0], L[1], 20, 28)} />
          </circle>
          <circle r="3" fill="currentColor" opacity="0.7">
            <animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite" path={orbit(R[0], R[1], 34, 44)} />
          </circle>
          <circle r="2.4" fill="currentColor" opacity="0.5">
            <animateMotion dur="3.5s" begin="-0.8s" repeatCount="indefinite" path={orbit(R[0], R[1], 20, 28)} />
          </circle>

          {/* packets exchanged across the infinity */}
          {[0, 1.3, 2.6].map((b, i) => (
            <circle key={i} r="2.4" fill={A} filter={`url(#${gid})`}>
              <animateMotion dur="4s" begin={`-${b}s`} repeatCount="indefinite" path={infinity} />
            </circle>
          ))}
        </>
      )}

      {/* core nodes */}
      <circle cx={L[0]} cy={L[1]} r="4.5" fill={A} filter={`url(#${gid})`}
        style={{ animation: animated ? `hsp-core 2.6s ease-in-out infinite` : undefined, ...FB }} />
      <circle cx={R[0]} cy={R[1]} r="4.5" fill={A} filter={`url(#${gid})`}
        style={{ animation: animated ? `hsp-core 2.6s ease-in-out .6s infinite` : undefined, ...FB }} />
    </svg>
  )
}

/* ── Main component (sticky horizontal pan until all cards visible) ──────── */
export default function HowISolveProblems() {
  const reduceMotion = useReducedMotion()
  const steps = howISolveProblems

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lastCardRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  // Ref drives the transform every frame; state drives the section height.
  const dragRef = useRef(820)
  const [dragDistance, setDragDistance] = useState(820)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // Function transform reads the ref: hold at 0 during the reveal, then pan.
  const x = useTransform(scrollYProgress, (p) => {
    const rf = REVEAL / (REVEAL + dragRef.current)
    if (p <= rf) return 0
    return -((p - rf) / (1 - rf)) * dragRef.current
  })

  useEffect(() => {
    const measure = () => {
      const card = lastCardRef.current
      if (!card || !ctaRef.current) return
      // Right edge of the last card at REST — offsetLeft/Width ignore the CSS transform.
      const op = card.offsetParent as HTMLElement | null
      const opLeft = op ? op.getBoundingClientRect().left : 0
      const restLastCardRight = opLeft + card.offsetLeft + card.offsetWidth
      // Target: right edge of CTA container == right edge of "PROJECTS" nav text.
      const targetRight = ctaRef.current.getBoundingClientRect().right
      const next = Math.max(0, restLastCardRight - targetRight)
      dragRef.current = next
      setDragDistance((prev) => (Math.abs(prev - next) > 0.5 ? next : prev))
    }

    // Measure across two frames so fonts/layout have settled.
    const raf = requestAnimationFrame(() => requestAnimationFrame(measure))

    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    if (ctaRef.current) ro.observe(ctaRef.current)

    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
    }
  }, [])

  /* ── Reduced-motion fallback ───────────────────────────────────────────── */
  if (reduceMotion) {
    return (
      <section className="border-t border-border" style={{ background: 'var(--surface)' }}>
        <style>{SVG_ANIM}</style>
        <div className="container-pad pt-14 pb-8 flex items-end justify-between gap-8">
          <h2 className="display-md leading-none uppercase" style={{ fontFamily: "'Enigma', sans-serif" }}>How I Solve Problems</h2>
          <p className="hidden md:block max-w-[22rem] text-sm leading-relaxed text-right pb-1" style={{ color: 'var(--text-muted)' }}>
            Every engagement starts with a complete understanding of your workflow — not just your feature request.
          </p>
        </div>
        <div className="container-pad pb-8 flex gap-4">
          {steps.map((s, i) => (
            <article key={i} className="flex-1 flex flex-col rounded-2xl overflow-hidden border"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-center py-6 px-4" style={{ color: 'var(--text-muted)' }}>
                <div className="w-24 h-24"><StepVisual index={i} animated={false} /></div>
              </div>
              <div className="p-5 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <span className="label text-accent">0{i + 1}</span>
                <h3 className="display-sm" style={{ fontFamily: 'var(--font-body)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{s.body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="container-pad py-8 flex items-center justify-between gap-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
            Have a problem worth solving? Let's find the right approach together.
          </p>
          <a href={gmailCompose('Build Your System')} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <ShinyButton>Build Your System</ShinyButton>
          </a>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-border"
      style={{ background: 'var(--surface)', height: `calc(100vh + ${dragDistance + REVEAL}px)` }}
    >
      <style>{SVG_ANIM}</style>

      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        <motion.div className="absolute top-0 left-0 h-px w-full origin-left z-10"
          style={{ background: 'var(--accent)', scaleX: scrollYProgress }} />

        {/* Header */}
        <div className="container-pad pt-28 pb-0 flex items-end justify-between gap-8 flex-shrink-0">
          <h2 className="display-md leading-none uppercase" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
            How I Solve Problems
          </h2>
        </div>

        {/* Cards track — pans horizontally until all 5 cards are in view */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-hidden">
            <motion.div ref={trackRef} style={{ x, paddingLeft: 'clamp(1.25rem, 5vw, 5rem)' }} className="flex gap-4 h-full items-center will-change-transform">
              {steps.map((step, i) => (
                <article key={i}
                  ref={i === steps.length - 1 ? lastCardRef : undefined}
                  className="flex-none flex flex-col rounded-2xl overflow-hidden border group"
                  style={{ width: '420px', minWidth: '420px', maxWidth: '420px', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-center py-6 px-4" style={{ color: 'var(--text-muted)' }}>
                    <div className="w-56 h-56"><StepVisual index={i} animated={true} /></div>
                  </div>
                  <div className="p-6 border-t flex flex-col gap-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <span className="label text-accent">0{i + 1}</span>
                    <h3 className="text-2xl font-semibold leading-snug" style={{ fontFamily: 'var(--font-body)' }}>{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.body}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <div className="container-pad py-8 flex-shrink-0 flex items-center justify-between gap-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
            Have a problem worth solving? Let's find the right approach together.
          </p>
          {/* ctaRef marks the page right margin — last card's right edge aligns here */}
          <a ref={ctaRef} href={gmailCompose('Build Your System')} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <ShinyButton>Build Your System</ShinyButton>
          </a>
        </div>
      </div>
    </section>
  )
}
