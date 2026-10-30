import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import HowISolveProblems from '@/components/sections/HowISolveProblems'
import WhyNNK from '@/components/sections/WhyNNK'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <HowISolveProblems />
      <WhyNNK />
      <Testimonials />
      <FAQ />
    </main>
  )
}
