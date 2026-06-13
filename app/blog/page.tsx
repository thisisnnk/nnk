'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { blogPosts } from '@/lib/data'
import DotGrid from '@/components/ui/DotGrid'

export default function BlogPage() {
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
          Writing
        </motion.p>
        {['Thoughts on', 'Systems & Design.'].map((line, i) => (
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
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-10 max-w-xl text-lg"
          style={{ color: 'var(--text-muted)', lineHeight: 1.65 }}
        >
          Writing on operational systems, product design, and the thinking behind building things that work.
        </motion.p>
        </div>
      </section>

      {/* 3-column grid — all 10 posts */}
      <section className="container-pad py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </section>
    </main>
  )
}

function BlogCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-6%' })

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 80, damping: 16, delay: 0.05 * (index % 3) }}
      className="group"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group-hover:-translate-y-1.5"
        style={{ border: '1px solid var(--border)' }}
      >
        {/* Image with parallax-style hover shift */}
        <div className="relative overflow-hidden aspect-[16/10]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{ background: 'linear-gradient(135deg, var(--accent-glow) 0%, transparent 70%)' }}
          />
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-7">
          <div className="flex items-center gap-3 mb-4">
            <span className="label">{post.category}</span>
            <span className="label-muted">{post.readTime}</span>
          </div>

          <h3 className="display-sm mb-3 group-hover:text-accent transition-colors duration-200 line-clamp-2" style={{ fontSize: 'clamp(1.125rem, 1.7vw, 1.375rem)', lineHeight: 1.25 }}>
            {post.title}
          </h3>

          <p className="text-sm leading-relaxed mb-7 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
            {post.excerpt}
          </p>

          {/* Read the blog — text link (rendered as span to avoid nested anchors) */}
          <span className="mt-auto w-fit inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-accent group-hover:gap-2.5 transition-all duration-200">
            Read the Blog
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  )
}
