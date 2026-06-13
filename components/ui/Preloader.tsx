'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Show the preloader only on the first visit of a session, and never when
    // the user prefers reduced motion.
    const skip =
      sessionStorage.getItem('nnk_preloaded') === '1' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (skip) {
      setVisible(false)
      onComplete()
      return
    }

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          try { sessionStorage.setItem('nnk_preloaded', '1') } catch { /* private mode */ }
          setTimeout(() => {
            setVisible(false)
            setTimeout(onComplete, 600)
          }, 250)
          return 100
        }
        return p + Math.random() * 3 + 1.5
      })
    }, 18)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'var(--bg)' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <span
                style={{ fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.04em', fontSize: 'clamp(4rem, 10vw, 7rem)', color: 'var(--text)', lineHeight: 1 }}
              >
                NNK
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-px"
                style={{ background: 'var(--accent)' }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.76, 0, 0.24, 1] }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="label-muted"
            >
              Product &amp; Systems Design
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="absolute bottom-14 w-32"
          >
            <div className="h-px w-full relative" style={{ background: 'var(--border-strong)' }}>
              <motion.div
                className="absolute top-0 left-0 h-full"
                style={{ width: `${Math.min(progress, 100)}%`, background: 'var(--accent)' }}
                transition={{ duration: 0.015 }}
              />
            </div>
            <p className="mt-2 text-center label-muted tabular-nums">
              {String(Math.min(Math.round(progress), 100)).padStart(2, '0')}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
