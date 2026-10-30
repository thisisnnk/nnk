'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, ArrowUpRight } from 'lucide-react'
import type { BlogPost } from '@/lib/blog'

export default function BlogDetailClient({ post, related }: { post: BlogPost; related: BlogPost[] }) {
  return (
    <main className="pt-14">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative z-10 container-pad pt-12 md:pt-16 pb-12 w-full">
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
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-4">
              <span className="label">{post.category}</span>
              <span className="label-muted">{post.date}</span>
              {post.readTime && <span className="label-muted">{post.readTime}</span>}
            </div>
            <h1 className="display-lg max-w-4xl">{post.title}</h1>
          </motion.div>
        </div>
      </section>

      {/* Article */}
      <article className="container-pad py-14 md:py-20 max-w-4xl mx-auto">
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

        {/* Cover image — sits directly above the article body ("Quick answer") */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-12"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            <Image
              src={post.image}
              alt={post.imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
            />
          </motion.div>
        )}

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Post body is HTML authored in the Supabase CMS */}
          <div className="blog-prose" dangerouslySetInnerHTML={{ __html: post.content }} />
        </motion.div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-16 pt-10 border-t border-border">
          {(post.tags.length ? post.tags : [post.category]).map((tag) => (
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
      {related.length > 0 && (
      <section className="container-pad py-14 md:py-20 border-t border-border">
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
                <div className="relative aspect-[16/9] overflow-hidden mb-5" style={{ background: 'var(--surface-2)' }}>
                  {rPost.image && (
                    <Image
                      src={rPost.image}
                      alt={rPost.imageAlt}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-600"
                      sizes="33vw"
                    />
                  )}
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
          <Link href="/blog" className="btn-light cursor-pointer">
            View All Articles <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      )}
    </main>
  )
}
