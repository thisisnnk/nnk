'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import GlassButton from '@/components/ui/GlassButton'

const BENTO_ITEMS = [
  { id: 1, img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', label: 'Brand Identity', span: 'col-span-2 row-span-2' },
  { id: 2, img: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=800&q=80', label: 'Visual System', span: 'col-span-1 row-span-1' },
  { id: 3, img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', label: 'UI Design', span: 'col-span-1 row-span-2' },
  { id: 4, img: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80', label: 'Motion', span: 'col-span-1 row-span-1' },
  { id: 5, img: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80', label: 'Typography', span: 'col-span-2 row-span-1' },
  { id: 6, img: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', label: 'Illustration', span: 'col-span-1 row-span-1' },
]

export default function Creatives() {
  return (
    <section className="relative py-16 md:py-24 lg:py-32 section-pad overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 md:mb-16">
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold tracking-[0.3em] uppercase text-accent mb-4"
        >
          Creative Work
        </motion.p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text" style={{ fontFamily: 'var(--font-display)' }}>
            {['Beyond', 'Systems'].map((w, i) => (
              <motion.span key={i} className="inline-block mr-[0.25em]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}>
                {w}
              </motion.span>
            ))}
          </h2>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <GlassButton href="/creatives" variant="secondary">
              View More <ArrowUpRight className="w-4 h-4" />
            </GlassButton>
          </motion.div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[180px] md:grid-rows-4 gap-3 md:gap-4 md:h-[800px]">
          {BENTO_ITEMS.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BentoCard({ item, index }: { item: typeof BENTO_ITEMS[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Scroll-driven parallax — the image drifts at a different speed than the
  // card frame as the card travels through the viewport.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? ['0%', '0%'] : ['-7%', '7%'])

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card || reduceMotion) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const yy = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(800px) rotateX(${-yy * 8}deg) rotateY(${x * 8}deg) scale(1.02)`
  }
  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${item.span} relative rounded-2xl overflow-hidden cursor-pointer group`}
      style={{ transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div className="absolute inset-[-8%]" style={{ y, willChange: 'transform' }}>
        <Image
          src={item.img}
          alt={item.label}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 33vw, 25vw"
        />
      </motion.div>
      {/* Overlay — kept dark in both themes for label legibility over imagery */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 100%)' }} />
      {/* Label */}
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
        <span className="text-xs font-semibold tracking-wide text-white px-3 py-1.5 rounded-full bg-glass border border-white/10">
          {item.label}
        </span>
      </div>
      {/* Border on hover */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-accent/20 transition-colors duration-400" />
    </motion.div>
  )
}
