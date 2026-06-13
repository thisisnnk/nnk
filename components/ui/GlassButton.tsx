'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const MotionLink = motion(Link)

interface GlassButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  target?: string
}

export default function GlassButton({
  children, href, onClick, variant = 'secondary', className, size = 'md', target,
}: GlassButtonProps) {
  // Apple liquid-glass styling lives in the .btn-primary / .btn-secondary
  // classes (frosted blur, #00AAFF glow, spring hover/press) so every button
  // across the site shares one motion language.
  const base = cn(
    variant === 'primary' ? 'btn-primary' : 'btn-secondary',
    size === 'sm' && 'text-[0.6875rem] px-4 py-2',
    size === 'lg' && 'text-sm px-7 py-4',
    className,
  )

  if (href) {
    // Internal routes go through Next.js client-side navigation so the
    // page-transition curtain and Lenis stay intact. External / mailto / tel
    // links fall back to a plain anchor.
    const isInternal = href.startsWith('/') && !target

    if (isInternal) {
      return (
        <MotionLink href={href} className={base} whileTap={{ scale: 0.97 }}>
          {children}
        </MotionLink>
      )
    }

    return (
      <motion.a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={base}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button onClick={onClick} className={base} whileTap={{ scale: 0.97 }}>
      {children}
    </motion.button>
  )
}
