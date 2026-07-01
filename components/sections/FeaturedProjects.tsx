'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/data'
import ProjectShowcase from './ProjectShowcase'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// MASTER: landing features 3 of the 5 case studies.
const FEATURED = projects.slice(0, 3)

/* Premium soft easing — long tail, no abrupt stops (Apple-keynote feel). */
const EASE = 'power3.inOut'
const EASE_OUT = 'power2.out'

/**
 * Cinematic scroll-synced featured-projects sequence.
 *
 * Desktop (≥1024px, motion allowed): one pinned stage. A full project image
 * rises from the bottom, scales down and docks LEFT; the case-study content
 * reveals on the RIGHT with staggered fade/slide/blur. On continued scroll the
 * content blurs out, the image returns to centre and scales up, then crossfades
 * into the next project — repeating for every case study.
 *
 * Tablet / mobile / reduced-motion: graceful fallback to the stacked
 * `ProjectShowcase` blocks (CSS-toggled, SSR-safe, no JS branch).
 */
export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRefs = useRef<HTMLDivElement[]>([])

  // activeIndex = the project the scroll position currently targets (-1 = hidden
  // before project 0 docks). displayedIndex = the project actually rendered; it
  // lags activeIndex so the old content can fade OUT before the new fades IN.
  const [activeIndex, setActiveIndex] = useState(-1)
  const activeIndexRef = useRef(-1)
  const [displayedIndex, setDisplayedIndex] = useState(-1)
  // Two opacity layers: blockVisible fades the WHOLE block on first appearance /
  // exit; valuesVisible crossfades ONLY the dynamic values (name / problem /
  // solution / metrics) on a project→project change — the labels, kicker and
  // View Details button stay put.
  const [blockVisible, setBlockVisible] = useState(false)
  const [valuesVisible, setValuesVisible] = useState(false)

  // FADE_MS must match the opacity transitions in the CSS below.
  const FADE_MS = 300
  useEffect(() => {
    if (activeIndex === displayedIndex) return
    // Exit → fade the whole block out, then unmount the content.
    if (activeIndex === -1) {
      setBlockVisible(false)
      setValuesVisible(false)
      const id = setTimeout(() => setDisplayedIndex(-1), FADE_MS)
      return () => clearTimeout(id)
    }
    // First appearance → render and fade the whole block in.
    if (displayedIndex === -1) {
      setDisplayedIndex(activeIndex)
      setValuesVisible(true)
      setBlockVisible(true)
      return
    }
    // Project → project → block stays; crossfade ONLY the values: fade them out,
    // swap the copy while invisible, then fade in. The value elements aren't
    // re-keyed, so they persist and the opacity transition runs both ways.
    setValuesVisible(false)
    const id = setTimeout(() => {
      setDisplayedIndex(activeIndex)
      setValuesVisible(true)
    }, FADE_MS)
    return () => clearTimeout(id)
  }, [activeIndex, displayedIndex])

  const setFrame = (el: HTMLDivElement | null, i: number) => {
    if (el) frameRefs.current[i] = el
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Cinematic build only on wide screens where motion is welcome.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const frames = frameRefs.current
        const count = FEATURED.length

        // Geometry — re-evaluated on every ScrollTrigger.refresh (resize-safe).
        // Frames live inside the STAGE (the area below the pinned heading), so
        // all boxes are measured against the stage, not the whole viewport. The
        // frame's BOX (width/height/position) is animated — not a uniform scale —
        // so the docked image fills the tall left cell via object-cover.
        const stageW = () => stageRef.current?.offsetWidth ?? window.innerWidth
        const stageH = () => stageRef.current?.offsetHeight ?? window.innerHeight
        const pad = () => Math.min(Math.max(window.innerWidth * 0.05, 20), 80) // clamp(1.25rem,5vw,5rem)
        const dockLeft = () => pad()
        const dockWidth = () => window.innerWidth * 0.48 - pad() // right edge at 48vw
        const dockTop = () => stageH() * 0.015 // sits high in the stage, just below the heading
        const dockHeight = () => stageH() * 0.9 // fills the stage's left cell
        // ── Initial states ──────────────────────────────────────────────
        // Frames default to full-viewport (CSS); the timeline drives box+slide.
        // visibility is OWNED by syncFrames() from here on — never by a tween's
        // autoAlpha — so it reverts perfectly under reverse scrub.
        // clipPath default = fully revealed; the rise tween owns the wipe and
        // syncFrames() owns visibility, so a not-yet-active frame defaulting to
        // full reveal is harmless (it's hidden until it becomes active).
        gsap.set(frames, {
          x: 0,
          y: 0,
          borderRadius: 0,
          transformOrigin: '50% 50%',
          clipPath: 'inset(0% 0% 0% 0%)',
        })

        // Dock geometry for the non-first frames lives OUTSIDE the rise tween —
        // applied here and re-applied on every ScrollTrigger refresh. The rise
        // tween then animates ONLY yPercent. This kills the failure that showed
        // the incoming image at FULL-STAGE size covering the content: the old
        // rise tween carried width/height/left/top in its `from` ONLY, and with
        // immediateRender:false + invalidateOnRefresh, a refresh landing while the
        // playhead was PAST the tween dropped those from-only props, so the frame
        // snapped back to its CSS 100%×100% box. Geometry set outside the tween
        // can never be lost that way.
        const dockFrameGeometry = () => {
          for (let idx = 1; idx < frames.length; idx++) {
            if (frames[idx]) {
              gsap.set(frames[idx], {
                left: dockLeft(),
                top: dockTop(),
                width: dockWidth(),
                height: dockHeight(),
                borderRadius: 0,
                x: 0,
              })
            }
          }
        }
        dockFrameGeometry()

        // Slide-start time of each frame (captured during the build below).
        // syncFrames() reads these against the live tl.time() to decide — every
        // tick AND on every refresh — which single frame is the ACTIVE (top,
        // docked) one, making image visibility deterministic in BOTH scroll
        // directions and immune to immediateRender / invalidateOnRefresh races.
        // (The old approach let visibility emerge from a tween's autoAlpha + a
        // stageH-measured park, which a mid-scroll refresh could strand on-stage
        // → the intermittent blank on scroll-up.)
        const frameStarts: number[] = []
        const syncFrames = () => {
          const t = tl.time()
          // Active = highest-index frame whose rise has begun.
          let active = 0
          for (let idx = 1; idx < frames.length; idx++) {
            if (frameStarts[idx] !== undefined && t >= frameStarts[idx] - 0.0001) active = idx
          }
          for (let idx = 0; idx < frames.length; idx++) {
            const f = frames[idx]
            if (!f) continue
            // Active + earlier frames stay visible (the active opaque dock box is
            // last in DOM order, so it correctly occludes the ones beneath).
            // Every later / parked frame is forced hidden, so a mis-parked or
            // mid-decode frame can never leak onto the stage.
            f.style.visibility = idx <= active ? 'visible' : 'hidden'
          }
        }

        // ── Timeline timing constants ────────────────────────────────────
        const DOCK_DUR = 1.3 // project 0: full-cover → docked
        const MORPH = 0.35   // project 0: content sharpen-in hold
        const RISE_DUR = 1.1 // each later image's rise

        // ── Active project → React state ─────────────────────────────────
        // The content's roll/fade is a one-shot React animation that replays
        // whenever the block is re-keyed by activeIndex (see JSX). Here we only
        // resolve WHICH project is active from the scrubbed scroll position:
        //  -1 until project 0 docks; otherwise the highest project whose image
        //  has begun rising. Committed to state only on change.
        const targetAt = (t: number) => {
          if (t < DOCK_DUR) return -1
          let k = 0
          for (let i = 1; i < count; i++) {
            if (frameStarts[i] !== undefined && t >= frameStarts[i] - 0.0001) k = i
          }
          return k
        }
        const syncContents = () => {
          const t = tl.time()
          const k = targetAt(t)
          if (k !== activeIndexRef.current) {
            activeIndexRef.current = k
            setActiveIndex(k)
          }
        }

        const tl = gsap.timeline({
          defaults: { ease: EASE },
          onUpdate: () => {
            syncContents()
            syncFrames()
          },
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            // Scroll distance per project. Lower = the whole sequence (and each
            // transition) scrubs through faster.
            end: () => '+=' + count * 1.4 * window.innerHeight,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // After any refresh (resize / font / lazy-image layout shift),
            // re-apply the dock geometry the rise tween no longer owns, then
            // re-assert deterministic visibility — so an invalidated tween can
            // never leave a frame full-stage-size or stranded on the stage.
            onRefresh: () => {
              dockFrameGeometry()
              syncContents()
              syncFrames()
            },
            onUpdate: (self) => {
              if (progressRef.current)
                progressRef.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        FEATURED.forEach((_, i) => {
          const frame = frames[i]
          const isLast = i === count - 1

          if (i === 0) {
            frameStarts[0] = 0
            // First image: full-page cover → shrinks to fill the left cell.
            tl.fromTo(
              frame,
              {
                left: 0,
                top: 0,
                width: stageW,
                height: stageH,
                borderRadius: 0,
                x: 0,
                y: 0,
              },
              {
                left: dockLeft,
                top: dockTop,
                width: dockWidth,
                height: dockHeight,
                borderRadius: 0,
                duration: DOCK_DUR,
              },
              0
            )
            // Content loads ONLY once the image has fully docked (dock ends at
            // DOCK_DUR), never before. The blur/opacity is driven entirely by
            // syncContents() from tl.time(); this empty tween only RESERVES the
            // sharpen-in window on the timeline so the read-hold lands after it.
            tl.to({}, { duration: MORPH }, DOCK_DUR)
          } else {
            // The previous segment's end is this one's start.
            const base = tl.duration()
            frameStarts[i] = base

            // The next image is REVEALED (not slid) over the one beneath it: it
            // sits in its final docked box and a clip-path wipe uncovers it from
            // the BOTTOM edge upward (inset top 100%→0%). The image content never
            // translates, so it reads as an unveiling rather than a slide. The
            // wipe animates ONLY clipPath (self-relative, immune to stage
            // re-measurement). The CONTENT crossover is derived from tl.time() in
            // syncContents() using the SAME eased-coverage formula — deterministic
            // at rest and on refresh. Dock geometry is owned by dockFrameGeometry();
            // image visibility by syncFrames() — so all revert cleanly on reverse.
            tl.fromTo(
              frame,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              {
                clipPath: 'inset(0% 0% 0% 0%)',
                duration: RISE_DUR,
                ease: EASE_OUT,
                immediateRender: false,
              },
              base
            )
          }

          // Hold the composed frame so it can be read.
          tl.to({}, { duration: isLast ? 0.6 : 1.0 })
        })

        // Assert correct frame AND content state synchronously now that
        // frameStarts is populated — frame0 shows on first paint with no
        // hidden-flash and every text block starts fully dissolved (so none can
        // flash over the first image), instead of waiting for the first
        // ScrollTrigger refresh/update tick.
        syncContents()
        syncFrames()

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="fp-root relative">
      {/* Inject via dangerouslySetInnerHTML so quotes/apostrophes in the CSS
          aren't HTML-escaped by React (which would break hydration). */}
      <style dangerouslySetInnerHTML={{ __html: FP_CSS }} />

      {/* ── Desktop cinematic stage — heading stays pinned above the project ── */}
      <div className="fp-cinematic">
        <div ref={pinRef} className="fp-pin">
          {/* Progress rail */}
          <div className="fp-rail">
            <div ref={progressRef} className="fp-rail-fill" />
          </div>

          {/* Pinned heading — visible for every project */}
          <div className="fp-header">
            <h2
              className="display-md uppercase"
              style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
            >
              Case Studies
            </h2>
          </div>

          {/* Stage — the image/content area below the heading */}
          <div ref={stageRef} className="fp-stage">
            {/* Image layer */}
            {FEATURED.map((p, i) => (
              <div key={p.slug} ref={(el) => setFrame(el, i)} className="fp-frame">
                <Image
                  src={p.mockup}
                  alt={p.name}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : 'eager'}
                  className="object-cover object-left-top"
                  sizes="100vw"
                />
              </div>
            ))}

            {/* Content layer — ONE persistent block. The static scaffolding
                (kicker, PROBLEM/SOLUTION/KEY RESULTS labels, View Details) stays
                put; only the .fp-value elements (name / problem / solution /
                metrics) crossfade on a project change via the --vis var. The
                whole block fades only on first appearance / exit (blockVisible).
                Value elements are NOT re-keyed, so the opacity transition runs
                both ways for a true crossfade. */}
            {(() => {
              const cur = displayedIndex >= 0 ? FEATURED[displayedIndex] : null
              const itin = cur?.slug === 'ah-itinerary'
              return (
                <div
                  className="fp-content"
                  style={{
                    opacity: blockVisible ? 1 : 0,
                    visibility: cur ? 'visible' : 'hidden',
                  }}
                >
                  {cur && (
                    <div
                      className="fp-content-inner"
                      style={{ '--vis': valuesVisible ? 1 : 0 } as React.CSSProperties}
                    >
                      <span className="label">{cur.category}</span>
                      <h3 className="display-md fp-title fp-value">{cur.name}</h3>

                      <div>
                        <p className="label mb-1.5">Problem</p>
                        <p className="fp-body fp-value">{cur.problem}</p>
                      </div>

                      <div>
                        <p className="label mb-1.5">Solution</p>
                        <p className="fp-body fp-value">{cur.solution}</p>
                      </div>

                      <div>
                        <p className="label mb-2.5">Key Results</p>
                        <div className="flex flex-wrap gap-3 fp-value">
                          {cur.metrics.map((m, mi) => (
                            <div
                              key={mi}
                              className="flex-1 px-5 py-3 rounded-2xl"
                              style={{
                                border: '1px solid var(--border-strong)',
                                flexGrow: itin && mi === 0 ? 1.7 : undefined,
                                flexBasis: itin ? 0 : undefined,
                                minWidth: itin ? (mi === 0 ? '11rem' : '8rem') : '9rem',
                              }}
                            >
                              <p
                                className="font-display font-bold text-2xl"
                                style={{
                                  color: 'var(--accent)',
                                  lineHeight: 1,
                                  letterSpacing: '-0.02em',
                                  whiteSpace: itin && mi === 0 ? 'nowrap' : undefined,
                                }}
                              >
                                {`${m.value}${m.suffix}`}
                              </p>
                              <p className="label-muted mt-1">{m.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={`/projects/${cur.slug}`}
                        className="btn-light cursor-pointer w-fit mt-1 group"
                      >
                        View Details
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
                      </Link>
                    </div>
                  )}
                </div>
              )
            })()}
          </div>
        </div>
      </div>

      {/* ── Tablet / mobile / reduced-motion fallback ───────────────────── */}
      <div className="fp-stacked container-pad pb-4">
        <div className="pt-16 pb-6 border-b border-border">
          <h2
            className="display-md uppercase"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
          >
            Case Studies
          </h2>
        </div>
        <div className="divide-y divide-border">
          {FEATURED.map((p, i) => (
            <ProjectShowcase key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* Scoped styles — fp-* class names keep this self-contained. The responsive /
   reduced-motion toggle is pure CSS so there is no hydration branch. */
const FP_CSS = `
.fp-cinematic { display: none; }
@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
  .fp-cinematic { display: block; }
  .fp-stacked { display: none; }
}

.fp-pin {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Pinned heading — clears the fixed navbar and stays visible for every project.
   A touch more top gap than the "How I Solve Problems" heading (pt-28). */
.fp-header {
  flex: 0 0 auto;
  padding: 6rem clamp(1.25rem, 5vw, 5rem) 1.5rem;
  border-bottom: 1px solid var(--border);
}

/* Stage — positioning context for the image/content layers.
   A small top margin leaves breathing space between the header line and the
   first full-cover image at the initial scroll position. */
.fp-stage {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  margin-top: 1.75rem;
}

.fp-rail {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: transparent;
  z-index: 20;
}
.fp-rail-fill {
  width: 100%; height: 100%;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  will-change: transform;
}
.fp-frame {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* visibility is OWNED by syncFrames() in JS (deterministic in both scroll
     directions); frame0 is shown synchronously right after the build. The solid
     theme background means any sub-frame raster gap shows the page bg, never a
     see-through hole — and it stays correct in light mode (var(--bg)). */
  visibility: hidden;
  background: var(--bg);
  will-change: transform, opacity;
  box-shadow: 0 50px 130px -36px rgba(0,0,0,0.6);
  z-index: 2;
}
/* Vertical rule lines on the image's left & right edges — overlaid above the
   photo so they're always visible, and they hug the image as it scales/docks. */
.fp-frame-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.7);
  z-index: 4;
  pointer-events: none;
}
.fp-frame-edge-l { left: 0; }
.fp-frame-edge-r { right: 0; }
.fp-content {
  position: absolute;
  /* Overlay the image's exact vertical band (dockTop 1.5% → dockHeight 90%) and
     vertically centre the content within it (justify-content:center), so every
     project's block is centre-aligned with the image — image centre and content
     centre both land at ~46.5% of the stage. Paired with yPercent:0 in JS. */
  top: 1.5%;
  height: 90%;
  left: 52%;
  /* Right edge aligns with the "PROJECTS" nav text:
     nav padding clamp(...) + the link's own px-4 (1rem). */
  right: calc(clamp(1.25rem, 5vw, 5rem) + 1rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
  visibility: hidden;
  will-change: opacity;
  /* Crossfade between projects (fade out → swap → fade in). Duration MUST match
     FADE_MS in the component so the swap lands at zero opacity. */
  transition: opacity 0.3s ease;
  /* Above both the grid and the image layers. */
  z-index: 3;
}
/* The inner wrapper carries the flex layout; .fp-content just centres it
   vertically within the image band. */
.fp-content-inner {
  display: flex;
  flex-direction: column;
  gap: 1.85rem;
}
/* Only the dynamic values crossfade on a project change (driven by --vis on the
   inner). The labels / kicker / button stay put. */
.fp-value {
  opacity: var(--vis, 1);
  transition: opacity 0.3s ease;
}
.fp-title { font-size: clamp(2rem, 3.4vw, 3.25rem); }
.fp-body {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text-muted);
  /* Fill the full content column out to the right edge (no narrow cap). */
  max-width: none;
}
`
