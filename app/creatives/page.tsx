'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowUpLeft } from 'lucide-react'

// ─── Grid constants ───────────────────────────────────────────────────────────
const GAP    = 28
const COL_W  = 192
const ROW_H  = 144
const STEP_X = COL_W + GAP   // 246 — column stride
const STEP_Y = ROW_H + GAP   // 188 — row stride
const PAD    = GAP            // padding inside each tile

// Total pixel dimensions of one grid tile
const GRID_W = 6 * COL_W + 5 * GAP   // 2020
const GRID_H = 6 * ROW_H + 5 * GAP   // 1540

// Tile stride — gap between tiles = same GAP so seams are seamless
const TILE_W = GRID_W + GAP   // 2040
const TILE_H = GRID_H + GAP   // 1560

// Canvas = 3 × 3 tiles so we always have a full copy on every side
const CANVAS_W = TILE_W * 3   // 6120
const CANVAS_H = TILE_H * 3   // 4680

// ─── Grid layout: [col, row, colSpan, rowSpan] — no overlaps, even GAP ───────
const GRID: [number,number,number,number][] = [
  [0,0,2,2], [2,0,1,1], [3,0,1,2], [4,0,2,1],
  [2,1,1,1], [4,1,1,1], [5,1,1,1],
  [0,2,1,1], [1,2,1,2], [2,2,2,1], [4,2,1,2], [5,2,1,1],
  [0,3,1,1], [2,3,1,1], [3,3,1,1], [5,3,1,1],
  [0,4,2,1], [2,4,1,1], [3,4,1,2], [4,4,2,1],
  [0,5,1,1], [1,5,1,1], [2,5,1,1], [4,5,1,1], [5,5,1,1],
]

const ITEMS_DATA = [
  { title: 'Brand Identity — Meridian',  type: 'Branding',     year: '2024', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=75' },
  { title: 'Visual System — Apex',       type: 'Visual',       year: '2024', img: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&q=75' },
  { title: 'UI Design — Dashboard',      type: 'UI/UX',        year: '2023', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=75' },
  { title: 'Motion — Intro Reel',        type: 'Motion',       year: '2024', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=75' },
  { title: 'Dashboard UI — ScaleBoard',  type: 'UI/UX',        year: '2024', img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=75' },
  { title: 'Illustration — Abstract',   type: 'Illustration', year: '2023', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=75' },
  { title: 'Editorial Typography',       type: 'Typography',   year: '2023', img: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=75' },
  { title: 'Product Design — FormSync',  type: 'Product',      year: '2024', img: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&q=75' },
  { title: 'Concept — Future Interface', type: 'Concept',      year: '2024', img: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=75' },
  { title: 'Web Design — Agency',        type: 'UI/UX',        year: '2024', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=75' },
  { title: 'Data Visualisation',         type: 'UI/UX',        year: '2023', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=75' },
  { title: 'Icon System — Monoline',     type: 'Visual',       year: '2024', img: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&q=75' },
  { title: 'Brand Mark — Velocity',      type: 'Branding',     year: '2024', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=75' },
  { title: 'Wireframes — WorkMap',       type: 'UI/UX',        year: '2023', img: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=75' },
  { title: 'Color System — Studio',      type: 'Visual',       year: '2024', img: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=75' },
  { title: 'App UI — Onboarding',        type: 'UI/UX',        year: '2024', img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=75' },
  { title: 'Packaging Concept',          type: 'Product',      year: '2024', img: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=75' },
  { title: 'Poster Series — Flux',       type: 'Visual',       year: '2023', img: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=75' },
  { title: 'Event Identity — Studio',    type: 'Branding',     year: '2023', img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=75' },
  { title: 'Interactive Installation',   type: 'Concept',      year: '2023', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=75' },
  { title: 'System Map — ClientOS',      type: 'Concept',      year: '2024', img: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=800&q=75' },
  { title: 'Spatial UI — XR Concept',    type: 'Concept',      year: '2024', img: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=75' },
  { title: 'Presentation Deck',          type: 'Visual',       year: '2024', img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&q=75' },
  { title: 'App Prototype — Mobile',     type: 'Product',      year: '2023', img: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=75' },
  { title: 'Design System — NNK',        type: 'Visual',       year: '2024', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=75' },
]

// ─── Convert grid spec to pixel rect ─────────────────────────────────────────
function gridRect(col: number, row: number, cs: number, rs: number) {
  return {
    gx: col * STEP_X,
    gy: row * STEP_Y,
    w:  cs * COL_W + (cs - 1) * GAP,
    h:  rs * ROW_H + (rs - 1) * GAP,
  }
}

// Base 25 items with grid positions
const BASE_ITEMS = ITEMS_DATA.map((d, i) => ({ idx: i, ...d, ...gridRect(...GRID[i]) }))

// 3×3 tile copies → 225 rendered cards
// Each copy occupies (PAD + gx + tx*TILE_W, PAD + gy + ty*TILE_H)
const RENDER_ITEMS = BASE_ITEMS.flatMap(item =>
  ([0, 1, 2] as const).flatMap(tx =>
    ([0, 1, 2] as const).map(ty => ({
      ...item,
      key: `${item.idx}-${tx}-${ty}`,
      x: PAD + item.gx + tx * TILE_W,
      y: PAD + item.gy + ty * TILE_H,
    }))
  )
)

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreativesPage() {
  const wrapRef       = useRef<HTMLDivElement>(null)
  const canvasRef     = useRef<HTMLDivElement>(null)
  const offset        = useRef({ x: 0, y: 0 })
  const initOff       = useRef({ x: 0, y: 0 })   // anchor for normalization
  const velocity      = useRef({ x: 0, y: 0 })
  const isDragging    = useRef(false)
  const hasDragged    = useRef(false)
  const lastMouse     = useRef({ x: 0, y: 0 })
  const rafId         = useRef(0)
  const [cursorStyle, setCursorStyle] = useState<'grab'|'grabbing'>('grab')
  const [activeItem, setActiveItem]   = useState<typeof BASE_ITEMS[0] | null>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  // Lightbox a11y: Escape to close + focus management.
  useEffect(() => {
    if (!activeItem) return
    lastFocused.current = document.activeElement as HTMLElement
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveItem(null) }
    document.addEventListener('keydown', onKey)
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
      lastFocused.current?.focus?.()
    }
  }, [activeItem])

  // ── Centre of the grid within the center tile (tile index 1,1) ────────────
  //    = tile-start + PAD + half-grid
  const GRID_CX = TILE_W + PAD + GRID_W / 2   // 2040 + 20 + 1010 = 3070
  const GRID_CY = TILE_H + PAD + GRID_H / 2   // 1560 + 20 +  770 = 2350

  // ── Apply transform — raw offset grows freely, display offset is normalised ─
  // Separating raw from display means no snap ever happens during a drag gesture.
  // The Math.round trick keeps displayX within ±TILE_W/2 of the anchor while
  // offset.current is completely unclamped — this is what kills the cylinder feel.
  const applyTransform = useCallback(() => {
    const el = canvasRef.current
    if (!el) return
    const ix = initOff.current.x
    const iy = initOff.current.y
    // Snap display by whole tile — invisible because tile N looks identical to tile N±1
    const dispX = offset.current.x - Math.round((offset.current.x - ix) / TILE_W) * TILE_W
    const dispY = offset.current.y - Math.round((offset.current.y - iy) / TILE_H) * TILE_H
    el.style.transform = `translate(${dispX}px,${dispY}px)`
  }, [])

  // ── Init offset so grid center = viewport center ───────────────────────────
  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const start = { x: vw / 2 - GRID_CX, y: vh / 2 - GRID_CY }
    offset.current  = { ...start }
    initOff.current = { ...start }
    applyTransform()
  }, [GRID_CX, GRID_CY, applyTransform])

  // ── Momentum loop ─────────────────────────────────────────────────────────
  const momentumLoop = useCallback(() => {
    velocity.current.x *= 0.93
    velocity.current.y *= 0.93
    offset.current.x += velocity.current.x
    offset.current.y += velocity.current.y
    applyTransform()
    if (Math.abs(velocity.current.x) > 0.2 || Math.abs(velocity.current.y) > 0.2) {
      rafId.current = requestAnimationFrame(momentumLoop)
    }
  }, [applyTransform])

  // ── Pointer / touch handlers ──────────────────────────────────────────────
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onDown = (e: MouseEvent) => {
      isDragging.current  = true
      hasDragged.current  = false
      lastMouse.current   = { x: e.clientX, y: e.clientY }
      velocity.current    = { x: 0, y: 0 }
      cancelAnimationFrame(rafId.current)
      setCursorStyle('grabbing')
    }

    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastMouse.current.x
      const dy = e.clientY - lastMouse.current.y
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) hasDragged.current = true
      // Exponential moving average for velocity (time-independent feel)
      velocity.current.x = velocity.current.x * 0.4 + dx * 0.6
      velocity.current.y = velocity.current.y * 0.4 + dy * 0.6
      offset.current.x += dx
      offset.current.y += dy
      lastMouse.current = { x: e.clientX, y: e.clientY }
      applyTransform()
    }

    const onUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      setCursorStyle('grab')
      rafId.current = requestAnimationFrame(momentumLoop)
    }

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      isDragging.current = true
      hasDragged.current = false
      lastMouse.current  = { x: t.clientX, y: t.clientY }
      velocity.current   = { x: 0, y: 0 }
      cancelAnimationFrame(rafId.current)
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const t  = e.touches[0]
      const dx = t.clientX - lastMouse.current.x
      const dy = t.clientY - lastMouse.current.y
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) hasDragged.current = true
      velocity.current.x = velocity.current.x * 0.4 + dx * 0.6
      velocity.current.y = velocity.current.y * 0.4 + dy * 0.6
      offset.current.x += dx
      offset.current.y += dy
      lastMouse.current = { x: t.clientX, y: t.clientY }
      applyTransform()
    }

    const onTouchEnd = () => {
      isDragging.current = false
      rafId.current = requestAnimationFrame(momentumLoop)
    }

    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd)

    return () => {
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
      cancelAnimationFrame(rafId.current)
    }
  }, [applyTransform, momentumLoop])

  const handleCardClick = useCallback((item: typeof BASE_ITEMS[0]) => {
    if (hasDragged.current) return
    setActiveItem(item)
  }, [])

  return (
    <>
      {/* ── Viewport ── */}
      <div
        ref={wrapRef}
        className="fixed inset-0 overflow-hidden select-none"
        style={{ background: 'var(--bg)', cursor: cursorStyle }}
      >
        {/* ── World canvas ── */}
        <div
          ref={canvasRef}
          className="absolute top-0 left-0"
          style={{ width: CANVAS_W, height: CANVAS_H, willChange: 'transform' }}
        >
          {/* Dot grid — gives spatial awareness while panning */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          {/* All 225 cards (25 items × 3×3 tiles) */}
          {RENDER_ITEMS.map((item, i) => (
            <CanvasCard
              key={item.key}
              item={item}
              delay={(item.idx * 0.04) % 0.6}   // stagger by base index only
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>

      {/* ── HUD ── */}
      <div className="fixed top-6 left-6 z-[800]">
        <Link href="/"
          className="flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-text/40 hover:text-accent transition-colors duration-200">
          <ArrowUpLeft className="w-3 h-3" /> NNK
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="hidden sm:block fixed top-6 left-1/2 -translate-x-1/2 z-[800]"
      >
        <span className="text-[11px] tracking-[0.4em] uppercase text-text/35">
          Playground — Infinite Canvas
        </span>
      </motion.div>

      <div className="fixed bottom-6 right-8 z-[800] text-[11px] text-text/25 tabular-nums">
        {BASE_ITEMS.length}&thinsp;works · ∞
      </div>

      <HintBadge />

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${activeItem.title} — ${activeItem.type}, ${activeItem.year}`}
            className="fixed inset-0 z-[900] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className="relative w-full max-w-5xl mx-6 rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.82, opacity: 0, y: 50 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={   { scale: 0.82, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-surface">
                <Image src={activeItem.img} alt={activeItem.title} fill className="object-cover" sizes="90vw" priority />
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-5 py-5 sm:px-8 sm:py-6 flex items-end justify-between gap-3"
                style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 100%)' }}>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-accent mb-2">
                    {activeItem.type} · {activeItem.year}
                  </p>
                  <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {activeItem.title}
                  </h2>
                </div>
                <button
                  ref={closeBtnRef}
                  onClick={() => setActiveItem(null)}
                  aria-label="Close"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Single card ──────────────────────────────────────────────────────────────
function CanvasCard({ item, delay, onClick }: {
  item: typeof RENDER_ITEMS[0]
  delay: number
  onClick: (item: typeof BASE_ITEMS[0]) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute"
      style={{ left: item.x, top: item.y, width: item.w, height: item.h }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1,  scale: 1    }}
        transition={{ duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ scale: hovered ? 1.03 : 1,
                 transition: 'scale 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}
      >
        <Image
          src={item.img}
          alt={item.title}
          fill
          className="object-cover pointer-events-none"
          sizes={`${item.w}px`}
          draggable={false}
          loading="lazy"
        />

        {/* Subtle overlay always */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-200"
          style={{
            opacity: hovered ? 1 : 0,
            background: 'linear-gradient(to top,rgba(0,0,0,0.82) 0%,rgba(0,0,0,0.08) 60%,transparent 100%)',
          }}
        >
          <div
            className="transition-all duration-200"
            style={{ transform: hovered ? 'translateY(0)' : 'translateY(10px)', opacity: hovered ? 1 : 0 }}
          >
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-accent mb-1">{item.type}</p>
            <p className="text-sm font-semibold text-white leading-snug">{item.title}</p>
            <p className="text-xs text-white/35 mt-0.5">{item.year}</p>
          </div>
        </div>

        {/* Border */}
        <div
          className="absolute inset-0 rounded-2xl border transition-colors duration-200 pointer-events-none"
          style={{ borderColor: hovered ? 'rgba(0,170,255,0.45)' : 'rgba(0,0,0,0.08)' }}
        />
      </motion.div>
    </div>
  )
}

// ─── Hint badge ───────────────────────────────────────────────────────────────
function HintBadge() {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShow(false), 3500); return () => clearTimeout(t) }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[800] pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1,  y: 0  }}
          exit={   { opacity: 0,  y: 6  }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-border"
            style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(12px)' }}>
            <span className="text-text/35 text-sm">✦</span>
            <span className="text-xs text-text/40 tracking-wide">Drag in any direction — loops infinitely</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
