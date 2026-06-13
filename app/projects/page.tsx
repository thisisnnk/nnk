'use client'
import { motion } from 'framer-motion'
import { projects } from '@/lib/data'
import ProjectShowcase from '@/components/sections/ProjectShowcase'
import DotGrid from '@/components/ui/DotGrid'

export default function ProjectsPage() {
  return (
    <main className="pt-14">
      {/* Page hero */}
      <section className="relative overflow-hidden container-pad py-14 md:py-20 border-b border-border">
        <DotGrid />
        {/* Bottom fade — blends hero into the page background */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--bg) 100%)' }}
        />
        <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="label mb-5"
        >
          All Projects
        </motion.p>
        {['Work That', 'Delivers.'].map((line, i) => (
          <div key={i} className="overflow-hidden">
            <motion.h1
              className="display-xl"
              style={{ color: i === 1 ? 'var(--accent)' : 'var(--text)', fontFamily: "'Montserrat', sans-serif", fontWeight: i === 1 ? 900 : 700, textTransform: 'uppercase', fontSize: i === 1 ? 'clamp(2.5rem, 5.5vw, 5rem)' : 'clamp(1.875rem, 4vw, 3.5rem)' }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              {line}
            </motion.h1>
          </div>
        ))}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 text-lg max-w-lg"
          style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}
        >
          Five systems built for real businesses solving real operational challenges.
        </motion.p>
        </div>
      </section>

      {/* All 5 projects — same left-right layout, no alternating */}
      <section className="container-pad py-12 md:py-20">
        <div className="divide-y divide-border">
          {projects.map((project, i) => (
            <ProjectShowcase key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
