'use client'
import { useRef } from 'react'
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
  const contentRefs = useRef<HTMLDivElement[]>([])
  // One gaussian-blur node per project's goo filter — the timeline animates its
  // stdDeviation to melt/reform the whole content block (pure goo, no fade).
  const gooRefs = useRef<SVGFEGaussianBlurElement[]>([])

  const setFrame = (el: HTMLDivElement | null, i: number) => {
    if (el) frameRefs.current[i] = el
  }
  const setContent = (el: HTMLDivElement | null, i: number) => {
    if (el) contentRefs.current[i] = el
  }
  const setGoo = (el: SVGFEGaussianBlurElement | null, i: number) => {
    if (el) gooRefs.current[i] = el
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Cinematic build only on wide screens where motion is welcome.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const frames = frameRefs.current
        const contents = contentRefs.current
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
        gsap.set(frames, { x: 0, y: 0, borderRadius: 0, transformOrigin: '50% 50%' })
        gsap.set(contents, { yPercent: -50, autoAlpha: 0 })

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

        // The ONLY thing that changes the content is the goo filter's blur. The
        // blur lives INSIDE the SVG filter (blur → alpha-threshold in one pass),
        // so the eye never sees soft haze — only hard liquid blobs. stdDeviation
        // DISSOLVE = fully melted/invisible (alpha spread under the cutoff). No
        // opacity, no slide, no per-element blur leak.
        const DISSOLVE = 16
        gooRefs.current.forEach((b) => gsap.set(b, { attr: { stdDeviation: DISSOLVE } }))

        // The alpha-threshold filter hardens anti-aliased edges, so it must NOT
        // stay on once a block is at rest — that's what made resting text look
        // chunky. We toggle each block's `filter` purely from its live blur:
        // crisp (filter off, normal smooth AA) while essentially unblurred, goo
        // (filter on) the moment it starts to melt/reform. Driving this from the
        // timeline's onUpdate makes it deterministic in BOTH scroll directions —
        // no reliance on string-property set/revert under scrub.
        const CRISP_BELOW = 0.4
        const filterState: string[] = contents.map(() => '')
        const syncFilters = () => {
          for (let idx = 0; idx < contents.length; idx++) {
            const node = gooRefs.current[idx]
            if (!node) continue
            const std = parseFloat(node.getAttribute('stdDeviation') || '0')
            const want = std < CRISP_BELOW ? 'none' : 'goo'
            if (filterState[idx] !== want) {
              filterState[idx] = want
              contents[idx].style.filter = want === 'none' ? 'none' : `url(#fp-goo-${idx})`
            }
            // Opacity is tied directly to the live blur: blurred = faded, crisp =
            // solid. This guarantees the text is never a bright, fully-opaque
            // blurred blob (no glow at peak blur), and stays deterministic under
            // scrub in BOTH directions. Visibility hides fully-blurred blocks so
            // their links can't intercept clicks.
            const op = Math.max(0, Math.min(1, 1 - std / DISSOLVE))
            contents[idx].style.opacity = String(op)
            contents[idx].style.visibility = op <= 0.001 ? 'hidden' : 'visible'
          }
        }

        const tl = gsap.timeline({
          defaults: { ease: EASE },
          onUpdate: () => {
            syncFilters()
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
              syncFrames()
            },
            onUpdate: (self) => {
              if (progressRef.current)
                progressRef.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        // Initial reveal: how long project 0's content sharpens in at the start.
        const MORPH = 0.35
        // Per-project content crossover is tied to the next image's COVERAGE of
        // the one beneath it: the text morph begins once the new image has mapped
        // this fraction (50%) over the old one, and ends when it is fully mapped.
        const MORPH_START_COVERAGE = 0.5

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
                duration: 1.3,
              },
              0
            )
            // Content sharpens in once the image has docked. The blur filter is
            // ALWAYS on the element (set in JSX) — we only animate stdDeviation
            // (0 = crisp, high = blurred). Opacity is derived from the live blur
            // in syncFilters (blurred = faded), so there's no separate fade tween.
            tl.to(
              gooRefs.current[i],
              { attr: { stdDeviation: 0 }, duration: MORPH, ease: EASE_OUT },
              0.9
            )
          } else {
            // The previous segment's end is this one's start.
            const base = tl.duration()
            frameStarts[i] = base

            // The next image rises from below and overlaps the one beneath it.
            // The CONTENT crossover is driven from this rise's LIVE COVERAGE in
            // onUpdate (not a separate tween): the text morph STARTS when the new
            // image has covered MORPH_START_COVERAGE (50%) of the old one, and
            // ENDS exactly when the new image is fully mapped over it. Reading the
            // eased yPercent ties the text to the real visual coverage, so it
            // stays correct in BOTH scroll directions.
            // The rise animates ONLY yPercent (self-relative, immune to stage
            // re-measurement); dock geometry is owned by dockFrameGeometry();
            // image visibility by syncFrames() — so all revert cleanly on reverse.
            tl.fromTo(
              frame,
              { yPercent: 100 },
              {
                yPercent: 0,
                duration: 1.1,
                ease: EASE_OUT,
                immediateRender: false,
                onUpdate: () => {
                  // yPercent 100 = fully below (0% mapped); 0 = fully mapped.
                  const yp = gsap.getProperty(frame, 'yPercent') as number
                  const coverage = 1 - yp / 100
                  // 0 until 50% coverage, then ramps to 1 at full mapping.
                  const mp = Math.min(
                    1,
                    Math.max(0, (coverage - MORPH_START_COVERAGE) / (1 - MORPH_START_COVERAGE))
                  )
                  gsap.set(gooRefs.current[i - 1], { attr: { stdDeviation: mp * DISSOLVE } })
                  gsap.set(gooRefs.current[i], { attr: { stdDeviation: (1 - mp) * DISSOLVE } })
                },
              },
              base
            )
          }

          // Hold the composed frame so it can be read.
          tl.to({}, { duration: isLast ? 0.6 : 1.0 })
        })

        // Assert correct frame visibility synchronously now that frameStarts is
        // populated — frame0 shows on first paint with no hidden-flash, instead
        // of waiting for the first ScrollTrigger refresh/update tick.
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

      {/* Self-contained blur filters — one per project. A plain Gaussian blur
          (no alpha threshold), so the content reveals as a soft blur transition.
          The timeline animates each filter's stdDeviation to blur the content
          out / sharpen it back in. The wide filter region keeps the blurred
          content from being clipped at peak blur. */}
      <svg className="fp-defs" aria-hidden="true" focusable="false">
        <defs>
          {FEATURED.map((_, i) => (
            <filter
              key={i}
              id={`fp-goo-${i}`}
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur
                ref={(el) => setGoo(el, i)}
                in="SourceGraphic"
                stdDeviation="0"
              />
            </filter>
          ))}
        </defs>
      </svg>

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
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="fp-frame-glow" />
                <span className="fp-frame-index">{String(i + 1).padStart(2, '0')}</span>
                {/* Vertical rule lines on the image's left & right edges. */}
                <span className="fp-frame-edge fp-frame-edge-l" />
                <span className="fp-frame-edge fp-frame-edge-r" />
              </div>
            ))}

            {/* Content layer — the goo filter is toggled on/off per block by the
                timeline's onUpdate, based on each block's live blur: ON while
                melting/forming (liquid), OFF at rest so text keeps its normal
                smooth anti-aliasing (no hardened edges). */}
            {FEATURED.map((p, i) => (
              <div key={p.slug} ref={(el) => setContent(el, i)} className="fp-content">
              <span data-reveal className="label">
                {p.category}
              </span>
              <h3 data-reveal className="display-md fp-title">
                {p.name}
              </h3>

              <div data-reveal>
                <p className="label mb-1.5">Problem</p>
                <p className="fp-body">{p.problem}</p>
              </div>

              <div data-reveal>
                <p className="label mb-1.5">Solution</p>
                <p className="fp-body">{p.solution}</p>
              </div>

              <div data-reveal>
                <p className="label mb-2.5">Key Results</p>
                <div className="flex flex-wrap gap-3">
                  {p.metrics.map((m, mi) => (
                    <div
                      key={mi}
                      className="px-4 py-3 rounded-2xl"
                      style={{ border: '1px solid var(--border-strong)' }}
                    >
                      <p
                        className="font-display font-bold text-2xl"
                        style={{ color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.02em' }}
                      >
                        {m.value}
                        {m.suffix}
                      </p>
                      <p className="label-muted mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                data-reveal
                href={`/projects/${p.slug}`}
                className="btn-primary cursor-pointer w-fit mt-1 group"
              >
                View Details
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </Link>
            </div>
            ))}
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
.fp-frame-glow {
  position: absolute; inset: 0;
  pointer-events: none;
  background: linear-gradient(120deg, rgba(0,170,255,0.12) 0%, transparent 55%);
}
.fp-frame-index {
  position: absolute;
  top: 1.25rem; left: 1.25rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
}

.fp-content {
  position: absolute;
  /* Vertically centred on the image (which now docks high in the stage). */
  top: 46.5%;
  left: 52%;
  /* Right edge aligns with the "PROJECTS" nav text:
     nav padding clamp(...) + the link's own px-4 (1rem). */
  right: calc(clamp(1.25rem, 5vw, 5rem) + 1rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  visibility: hidden;
  will-change: transform, opacity, filter;
  /* Above both the grid and the image layers. */
  z-index: 3;
}
.fp-content [data-reveal] { will-change: opacity, filter; }
.fp-defs { position: absolute; width: 0; height: 0; }
.fp-title { font-size: clamp(2rem, 3.4vw, 3.25rem); }
.fp-body {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text-muted);
  /* Fill the full content column out to the right edge (no narrow cap). */
  max-width: none;
}
`
