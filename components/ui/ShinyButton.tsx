'use client'

import React, { useRef, useState } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion'

function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

interface ShinyButtonProps extends HTMLMotionProps<'button'> {
  children?: React.ReactNode
}

export default function ShinyButton({
  className,
  children = 'Shiny Day',
  ...props
}: ShinyButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [18, -18]), { stiffness: 350, damping: 20 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-18, 18]), { stiffness: 350, damping: 20 })
  const scale = useSpring(hovered ? 1.06 : 1, { stiffness: 350, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    rawX.set((e.clientX - left) / width - 0.5)
    rawY.set((e.clientY - top) / height - 0.5)
  }

  const handleMouseEnter = () => setHovered(true)

  const handleMouseLeave = () => {
    setHovered(false)
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '500px' }}
    >
      <motion.button
        style={{ rotateX, rotateY, scale, fontFamily: 'var(--font-display)', background: 'var(--accent)' }}
        className={cn(
          'h-12 w-max max-w-full rounded-full border-none px-7 py-2 font-bold uppercase tracking-wide text-black cursor-pointer focus:outline-none',
          className
        )}
        type='button'
        {...props}
      >
        {children}
      </motion.button>
    </div>
  )
}
