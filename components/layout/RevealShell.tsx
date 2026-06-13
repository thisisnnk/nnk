'use client'
import { useEffect, useRef, useState } from 'react'
import Footer from '@/components/layout/Footer'

/**
 * Footer slide-reveal (ref: nvrmndstudio.com).
 *
 * The page content sits in an opaque, z-10 layer with a bottom margin equal to
 * the footer height. The footer is fixed to the bottom of the viewport at z-0,
 * so it stays hidden beneath the content until the user scrolls to the very end
 * — at which point the content "lifts up" like a panel and reveals the footer.
 */
export default function RevealShell({ children }: { children: React.ReactNode }) {
  const footerRef = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(0)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const update = () => setH(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <>
      <div className="relative z-10 bg-bg" style={{ marginBottom: h }}>
        {children}
      </div>
      <div ref={footerRef} className="fixed bottom-0 left-0 right-0 z-0">
        <Footer />
      </div>
    </>
  )
}
