import type { Metadata } from 'next'
import BlogListClient from './BlogListClient'
import { getPosts } from '@/lib/blog'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on operational systems, product design, and the thinking behind building things that work.',
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogListClient posts={posts} />
}
