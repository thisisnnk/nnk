import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import HowISolveProblems from '@/components/sections/HowISolveProblems'
import Testimonials from '@/components/sections/Testimonials'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <HowISolveProblems />
      <Testimonials />
    </main>
  )
}
