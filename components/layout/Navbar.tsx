'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LetterSwapPingPong } from '@/components/ui/LetterSwap'

const LINKS = [
  { href: '/projects', label: 'Projects' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.3 }}
      className="fixed top-0 inset-x-0 z-[900] h-16 flex items-center justify-between"
      style={{
        paddingLeft: 'clamp(1.25rem, 5vw, 5rem)',
        paddingRight: 'clamp(1.25rem, 5vw, 5rem)',
        background: 'linear-gradient(to bottom, rgba(15,15,15,0.92) 0%, rgba(15,15,15,0.55) 40%, rgba(15,15,15,0.15) 70%, transparent 100%)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="group cursor-pointer">
        <img
          src="/nnk-logo.png"
          alt="NNK"
          style={{ height: '1.25rem', width: 'auto', display: 'block' }}
        />
      </Link>

      {/* Right: two links */}
      <div className="flex items-center gap-1 sm:gap-2">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontFamily: 'var(--font-display)' }}
              className={`relative px-3 sm:px-4 py-2 text-base font-semibold tracking-wide uppercase transition-colors duration-200 cursor-pointer ${
                active ? 'text-text' : 'text-text hover:text-accent'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-1 left-3 right-3 sm:left-4 sm:right-4 h-px bg-accent"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <LetterSwapPingPong label={link.label.toUpperCase()} staggerDuration={0.03} />
            </Link>
          )
        })}
      </div>
    </motion.nav>
  )
}
