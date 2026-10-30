'use client'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/lib/data'
import BrowserFrame from '@/components/ui/BrowserFrame'
import ImageLightbox from '@/components/ui/ImageLightbox'

/**
 * MASTER project block — Left: product mockup. Right: details (Name, Problem,
 * Solution, Result metrics, "View Details").
 * Always left-right — NO alternating. Spring entrance.
 *
 * Desktop: the mockup defines the row height; the details column spans exactly
 * from its top edge to its bottom edge (no parallax, so the edges stay aligned).
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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 64 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 58, damping: 15, mass: 0.9 }}
      className="grid grid-cols-1 min-[1400px]:grid-cols-2 gap-10 min-[1400px]:gap-16 items-center min-[1400px]:items-stretch py-14 md:py-20"
    >
      {/* Left: mockup inside a floating browser window — click to view full */}
      <BrowserFrame className="group aspect-[4/3] min-[1400px]:aspect-[5/4]">
        <ImageLightbox src={project.mockup} alt={project.name}>
          <Image
            src={project.mockup}
            alt={project.name}
            fill
            className="object-cover object-left-top transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 1400px) 100vw, 50vw"
          />
        </ImageLightbox>
      </BrowserFrame>

      {/* Right: details. On desktop h-0 + min-h-full keeps this column from
          adding height to the row, so it fills exactly the mockup's height and
          spreads its sections between the mockup's top and bottom edges. */}
      <div className="flex flex-col gap-[1.85rem] min-[1400px]:gap-[clamp(0.5rem,0.8vw,1.85rem)] min-[1400px]:justify-between min-[1400px]:h-0 min-[1400px]:min-h-full">
        <h3 className="display-md ps-title">{project.name}</h3>

        {/* Problem */}
        <div>
          <p className="label mb-1.5">Problem</p>
          <p className="text-sm md:text-base leading-[1.65] min-[1400px]:line-clamp-3" style={{ color: 'var(--text-muted)' }}>
            {project.problem}
          </p>
        </div>

        {/* Solution */}
        <div>
          <p className="label mb-1.5">Solution</p>
          <p className="text-sm md:text-base leading-[1.65] min-[1400px]:line-clamp-3" style={{ color: 'var(--text-muted)' }}>
            {project.solution}
          </p>
        </div>

        {/* Result — numeric metrics */}
        <div>
          <p className="label mb-2.5">Result</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.metrics.map((m, i) => (
              <div key={i} className="min-w-0 px-5 py-3 rounded-2xl" style={{ border: '1px solid var(--border-strong)' }}>
                <p
                  className="font-display font-bold text-2xl"
                  style={{ color: 'var(--accent)', lineHeight: 1, letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
                >
                  {m.value}{m.suffix}
                </p>
                <p className="label-muted mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Link href={`/projects/${project.slug}`} className="btn-light cursor-pointer w-fit group">
          View Details
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
        </Link>
      </div>
    </motion.div>
  )
}
