'use client'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X, Expand } from 'lucide-react'
import clsx from 'clsx'

type LenisLike = { stop: () => void; start: () => void }

/**
 * Wraps an image (passed as children) with:
 *  • a hover hint ("Click to see the Image"),
 *  • click-to-open full-screen view with a close button + Esc / backdrop close.
 *
 * The full-screen layer is rendered through a portal to <body> so it escapes any
 * transformed / pinned ancestor (framer-motion parallax, the GSAP-pinned
 * featured stage) — otherwise `position: fixed` would anchor to that ancestor
 * instead of the viewport. The trigger fills its (positioned) parent, so the
 * caller just needs a relatively/absolutely positioned container.
 */
export default function ImageLightbox({
  src,
  alt,
  label = 'Click to see the Image',
  className,
  children,
  fill = true,
}: {
  src: string
  alt: string
  label?: string
  className?: string
  children: ReactNode
  /**
   * `true` (default): trigger is absolutely positioned (`inset: 0`) to cover a
   * sized parent — pairs with a `next/image fill` thumbnail (BrowserFrame,
   * aspect-ratio boxes). Set `false` for naturally-flowing content (e.g. a
   * plain `<img>` with intrinsic height inside a CSS-columns masonry grid),
   * where the trigger must be a normal block so it doesn't collapse to 0 height.
   */
  fill?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const reduce = useReducedMotion()
  // The hint badge is glued to the cursor: on each move we translate its wrapper
  // to the pointer position (relative to the trigger). Done via a ref + direct
  // style write so tracking stays smooth without re-rendering on every move.
  const followRef = useRef<HTMLSpanElement>(null)

  const trackCursor = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = followRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    el.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`
  }

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    // Freeze smooth scroll (and, with it, the pinned featured animation) while
    // the overlay is up — restarted on close. No-op under reduced motion where
    // Lenis isn't running.
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis
    lenis?.stop()
    return () => {
      document.removeEventListener('keydown', onKey)
      lenis?.start()
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        onMouseEnter={trackCursor}
        onMouseMove={trackCursor}
        aria-label={`${alt} — ${label}`}
        className={clsx('il-trigger', !fill && 'il-trigger-inline', className)}
      >
        {children}
        <span className="il-hint" aria-hidden>
          <span ref={followRef} className="il-hint-follow">
            <span className="il-hint-badge">
              <Expand className="w-4 h-4" strokeWidth={2.2} />
              {label}
            </span>
          </span>
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="il-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.25, ease: 'easeOut' }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label={alt}
              >
                <button
                  type="button"
                  className="il-close"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpen(false)
                  }}
                  aria-label="Close full-screen image"
                >
                  <X className="w-5 h-5" strokeWidth={2.2} />
                </button>
                <motion.div
                  className="il-figure"
                  initial={{ scale: reduce ? 1 : 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: reduce ? 1 : 0.96, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    quality={90}
                    className="il-img"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
