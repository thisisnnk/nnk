import { notFound } from 'next/navigation'
import BlogDetailClient from './BlogDetailClient'
import { blogPosts } from '@/lib/data'

export function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) notFound()
  return <BlogDetailClient post={post} />
}
