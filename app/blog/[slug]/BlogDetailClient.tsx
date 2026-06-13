'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ArrowUpRight } from 'lucide-react'
import { blogPosts } from '@/lib/data'

export default function BlogDetailClient({ post }: { post: typeof blogPosts[0] }) {
  // Prefer posts in the same category, then fill remaining slots with others.
  const related = (() => {
    const others = blogPosts.filter((p) => p.id !== post.id)
    const sameCat = others.filter((p) => p.category === post.category)
    const rest = others.filter((p) => p.category !== post.category)
    return [...sameCat, ...rest].slice(0, 3)
  })()

  const renderContent = (content: string) => {
    const sections = content.split('\n\n')
    return sections.map((section, i) => {
      if (section.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="display-sm mt-14 mb-6"
            style={{ color: 'var(--text)' }}
          >
            {section.replace('## ', '')}
          </h2>
        )
      }
      if (section.startsWith('**') && section.endsWith('**')) {
        return (
          <p key={i} className="font-display font-bold text-lg my-5" style={{ color: 'var(--text)' }}>
            {section.replace(/\*\*/g, '')}
          </p>
        )
      }
      const parts = section.split(/(\*\*[^*]+\*\*)/g)
      return (
        <p key={i} className="text-base leading-relaxed my-5" style={{ color: 'var(--text-muted)' }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={j} style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {part.replace(/\*\*/g, '')}
                </strong>
              )
            }
            return part
          })}
        </p>
      )
    })
  }

  return (
    <main className="pt-14">
      {/* Hero */}
      <section className="relative h-[55vh] flex items-end overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.55) 50%, rgba(7,7,7,0.15) 100%)' }}
          />
        </div>

        <div className="relative z-10 container-pad pb-12 w-full">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
          >
            <ChevronLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="label">{post.category}</span>
              <span className="label-muted">{post.date}</span>
              <span className="label-muted">{post.readTime}</span>
            </div>
            <h1 className="display-lg max-w-4xl">{post.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Article */}
      <article className="container-pad py-20 max-w-4xl mx-auto">
        {/* Lead */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-14 pb-10 border-b border-border"
        >
          <p
            className="text-xl leading-relaxed"
            style={{ color: 'var(--text)', fontStyle: 'italic' }}
          >
            {post.excerpt}
          </p>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-16 pt-10 border-t border-border">
          {[post.category, 'Systems Design', 'NNK'].map((tag) => (
            <span
              key={tag}
              className="label-muted px-4 py-2"
              style={{ border: '1px solid var(--border)' }}
            >
              #{tag.toLowerCase().replace(/\s/g, '-')}
            </span>
          ))}
        </div>
      </article>

      {/* Related posts */}
      <section className="container-pad py-20 border-t border-border">
        <div className="mb-12">
          <p className="label mb-3">More Writing</p>
          <h2 className="display-sm">Related Articles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'var(--border)' }}>
          {related.map((rPost, i) => (
            <motion.div
              key={rPost.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${rPost.slug}`}
                className="block p-8 group cursor-pointer transition-colors duration-200"
                style={{ background: 'var(--bg)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg)' }}
              >
                <div className="relative aspect-[16/9] overflow-hidden mb-5">
                  <Image
                    src={rPost.image}
                    alt={rPost.title}
                    fill
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-600"
                    sizes="33vw"
                  />
                </div>
                <p className="label mb-3">{rPost.category}</p>
                <h3 className="display-sm group-hover:text-accent transition-colors duration-200 line-clamp-2 mb-3">
                  {rPost.title}
                </h3>
                <div className="flex items-center gap-2 label">
                  Read <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/blog" className="btn-secondary cursor-pointer">
            View All Articles <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}
