import { notFound } from 'next/navigation'
import ProjectDetailClient from './ProjectDetailClient'
import { projects } from '@/lib/data'

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }))
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug)
  if (!project) notFound()
  return <ProjectDetailClient project={project} />
}
