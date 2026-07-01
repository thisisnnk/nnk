'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/data'

/**
 * MASTER project block — Left: product mockup. Right: details (Name, Duration
 * highlighted in #00AAFF, Problem, Solution, Result metrics, "View Details").
 * Always left-right — NO alternating. Spring entrance + dual-speed parallax.
 */
export default function ProjectShowcase({
  project,
}: {
  project: typeof projects[0]
  /** Position in the list — accepted by callers; no longer rendered. */
  index?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-9%', '9%'])
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['5%', '-5%'])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 64 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 58, damping: 15, mass: 0.9 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 md:py-20"
    >
      {/* Left: mockup image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/3] group">
        <div className="absolute inset-0">
          <Image
            src={project.mockup}
            alt={project.name}
            fill
            className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Right: details (parallax) */}
      <motion.div style={{ y: textY }} className="flex flex-col gap-[1.85rem]">
        <h3 className="display-md">{project.name}</h3>

        {/* Duration — highlighted #00AAFF background, white text */}
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide rounded-full"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          >
            {project.duration}
          </span>
          <span className="label-muted">{project.category}</span>
        </div>

        {/* Problem */}
        <div>
          <p className="label mb-1.5">Problem</p>
          <p className="text-sm md:text-base leading-[1.65]" style={{ color: 'var(--text-muted)' }}>
            {project.problem}
          </p>
        </div>

        {/* Solution */}
        <div>
          <p className="label mb-1.5">Solution</p>
          <p className="text-sm md:text-base leading-[1.65]" style={{ color: 'var(--text-muted)' }}>
            {project.solution}
          </p>
        </div>

        {/* Result — numeric metrics */}
        <div>
          <p className="label mb-2.5">Result</p>
          <div className="flex flex-wrap gap-3">
            {project.metrics.map((m, i) => (
              <div key={i} className="flex-1 px-5 py-3 rounded-2xl" style={{ border: '1px solid var(--border-strong)', minWidth: '9rem' }}>
                <p
                  className="font-display font-bold text-2xl"
                  style={{ color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.02em' }}
                >
                  {m.value}{m.suffix}
                </p>
                <p className="label-muted mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href={`/projects/${project.slug}`} className="btn-light cursor-pointer w-fit mt-2 group">
          View Details
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
        </Link>
      </motion.div>
    </motion.div>
  )
}
