'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { gmailCompose } from '@/lib/utils'

// MASTER Block 4 — Navigation: Blogs, Creatives, Projects.
const NAV: [string, string][] = [
  ['About', '/about'],
  ['Blogs', '/blog'],
  ['Creatives', '/creatives'],
  ['Projects', '/projects'],
]

const block = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Footer() {
  // The footer lives beneath the page (fixed, in RevealShell) and is uncovered
  // as the last section slides up. Animate its contents in once revealed.
  const [revealed, setRevealed] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const distanceFromBottom =
        document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      if (distanceFromBottom < 220) setRevealed(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <footer className="relative overflow-hidden" style={{ background: 'var(--bg)' }}>

      <motion.div
        initial="hidden"
        animate={revealed ? 'show' : 'hidden'}
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="relative container-pad pt-20 pb-10 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8"
      >
        {/* Block 2 · Contact */}
        <motion.div variants={block} className="md:col-span-3 md:order-2">
          <p className="label-muted mb-4">Contact</p>
          <a
            href={gmailCompose()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
            style={{ color: 'var(--text-muted)' }}
          >
            thenameisnnk@gmail.com
          </a>
        </motion.div>

        {/* Block 3 · Social */}
        <motion.div variants={block} className="md:col-span-3 md:order-3">
          <p className="label-muted mb-4">Social</p>
          <div className="flex flex-col gap-3">
            <a
              href="https://www.linkedin.com/in/thenameisnnk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
              style={{ color: 'var(--text-muted)' }}
            >
              LinkedIn
            </a>
            <a
              href={gmailCompose()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
              style={{ color: 'var(--text-muted)' }}
            >
              Gmail
            </a>
          </div>
        </motion.div>

        {/* Block 4 · Navigation */}
        <motion.nav variants={block} className="md:col-span-2 md:order-4">
          <p className="label-muted mb-4">Navigation</p>
          <div className="flex flex-col gap-3">
            {NAV.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-sm cursor-pointer transition-colors duration-200 hover:text-accent"
                style={{ color: 'var(--text-muted)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.nav>

        {/* Block 1 · Brand / Statement — bottom left, name at the very bottom */}
        <motion.div variants={block} className="col-span-2 md:col-span-4 md:order-1 flex flex-col justify-start">
          <Link
            href="/"
            className="leading-none cursor-pointer transition-opacity duration-200 hover:opacity-80"
          >
            <img
              src="/nnk-logo.png"
              alt="NNK"
              style={{ height: 'clamp(1.75rem, 4vw, 3rem)', width: 'auto', display: 'block' }}
            />
          </Link>
        </motion.div>
      </motion.div>

      {/* Baseline bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative container-pad py-6 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="text-xs" style={{ color: 'var(--text-dim)' }}>© {new Date().getFullYear()} NNK — Product &amp; Systems Design</span>
        <span className="label-muted">Built with intention.</span>
      </motion.div>
    </footer>
  )
}
