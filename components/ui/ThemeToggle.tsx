'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

/**
 * Toggles dark mode by adding/removing the `.dark` class on <html>.
 * Default (no class) = light. `.dark` = dark override.
 */
export default function ThemeToggle() {
  const [dark, setDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('nnk-theme')
    const isDark = saved !== 'light'
    document.documentElement.classList.toggle('dark', isDark)
    setDark(isDark)
    setMounted(true)
  }, [])

  const toggle = () => {
    const el = document.documentElement
    const next = !el.classList.contains('dark')
    el.classList.toggle('dark', next)
    try { localStorage.setItem('nnk-theme', next ? 'dark' : 'light') } catch { /* private mode */ }
    setDark(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle colour theme"
      className="relative w-9 h-9 flex items-center justify-center rounded-full bg-glass cursor-pointer transition-colors duration-200 hover:text-accent"
      style={{ color: 'var(--text-muted)' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mounted ? (dark ? 'sun' : 'moon') : 'init'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
