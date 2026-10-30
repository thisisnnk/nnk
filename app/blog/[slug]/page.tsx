import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogDetailClient from './BlogDetailClient'
import { getPostBySlug, getPosts } from '@/lib/blog'

export const revalidate = 60

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt
  return {
    title,
    description,
    openGraph: { title, description, type: 'article', images: post.ogImage ? [post.ogImage] : undefined },
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [post, all] = await Promise.all([getPostBySlug(params.slug), getPosts()])
  if (!post) notFound()

  // Prefer posts in the same category, then fill remaining slots with others.
  const others = all.filter((p) => p.id !== post.id)
  const related = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3)

  return <BlogDetailClient post={post} related={related} />
}
