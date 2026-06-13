'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Honour the OS "reduce motion" setting — skip smooth scroll entirely so
    // the page uses native, instant scrolling.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })

    // Expose for programmatic smooth-scroll (e.g. in-page anchor navigation).
    ;(window as unknown as { lenis?: Lenis }).lenis = lenis

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const update = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(update)
      lenis.destroy()
      ;(window as unknown as { lenis?: Lenis }).lenis = undefined
    }
  }, [])

  return <>{children}</>
}
