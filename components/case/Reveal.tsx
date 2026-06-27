"use client"

import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/* -------------------------------------------------------------------------- */
/*  RevealHeading — word-mask reveal                                          */
/* -------------------------------------------------------------------------- */

type HeadingTag = keyof JSX.IntrinsicElements

export function RevealHeading({
  text,
  as = 'h2',
  className,
  style,
  delay = 0,
  stagger = 0.085,
}: {
  text: string
  as?: HeadingTag
  className?: string
  style?: React.CSSProperties
  delay?: number
  stagger?: number
}): JSX.Element {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  const Tag = as as React.ElementType

  // Reduced motion: render plain, static text.
  if (reduce) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    )
  }

  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'top',
            }}
          >
            <motion.span
              style={{ display: 'inline-block', willChange: 'transform, opacity' }}
              initial={{ y: '110%', opacity: 0 }}
              animate={inView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
              transition={{
                duration: 1.15,
                ease: EASE,
                delay: delay + i * stagger,
              }}
            >
              {word}
            </motion.span>
          </span>
          {/* keep the inter-word space OUTSIDE the clipping mask so it is
              not trimmed by the inline-block's overflow:hidden box */}
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  )
}

/* -------------------------------------------------------------------------- */
/*  RevealText / Reveal — fade-up-blur block                                  */
/* -------------------------------------------------------------------------- */

function FadeUpBlur({
  children,
  className,
  style,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  y?: number
}): JSX.Element {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  if (reduce) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: 'transform, opacity, filter', ...style }}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      animate={
        inView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: 0, y, filter: 'blur(8px)' }
      }
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

export function RevealText(props: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  y?: number
}): JSX.Element {
  return <FadeUpBlur {...props} />
}

// Generic in-view block — identical behavior to RevealText.
export function Reveal(props: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  delay?: number
  y?: number
}): JSX.Element {
  return <FadeUpBlur {...props} />
}

/* -------------------------------------------------------------------------- */
/*  Stagger / StaggerItem                                                      */
/* -------------------------------------------------------------------------- */

export function Stagger({
  children,
  className,
  style,
  gap,
  delayChildren = 0.1,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  gap?: number
  delayChildren?: number
}): JSX.Element {
  const reduce = useReducedMotion()

  const mergedStyle: React.CSSProperties =
    gap != null ? { gap, ...style } : { ...style }

  if (reduce) {
    return (
      <div className={className} style={mergedStyle}>
        {children}
      </div>
    )
  }

  const variants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.13,
        delayChildren,
      },
    },
  }

  return (
    <motion.div
      className={className}
      style={mergedStyle}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10%' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  style,
  y = 20,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  y?: number
}): JSX.Element {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const variants: Variants = {
    hidden: { opacity: 0, y, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9, ease: EASE },
    },
  }

  return (
    <motion.div
      className={className}
      style={{ willChange: 'transform, opacity, filter', ...style }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
