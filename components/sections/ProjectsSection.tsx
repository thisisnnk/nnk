'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { projects } from '@/lib/data'
import ProjectShowcase from './ProjectShowcase'

// MASTER: Landing shows 3 of the 5 projects.
const FEATURED = projects.slice(0, 3)

export default function ProjectsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })

  return (
    <section ref={ref} className="py-16 md:py-32">
      <div className="container-pad">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-6 pb-6 border-b border-border"
        >
          <div>
            <h2 className="display-md uppercase" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>Featured Projects</h2>
          </div>
        </motion.div>

        {/* 3 projects — same left-right layout, no alternating */}
        <div className="divide-y divide-border">
          {FEATURED.map((project, i) => (
            <ProjectShowcase key={project.slug} project={project} index={i} />
          ))}
        </div>

        {/* Mobile all-projects link */}
        <div className="mt-10 md:hidden">
          <Link href="/projects" className="btn-secondary cursor-pointer">
            All Projects
          </Link>
        </div>
      </div>
    </section>
  )
}
