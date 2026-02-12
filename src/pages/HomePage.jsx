import Hero from '../components/home/Hero'
import Filtro from '../components/Filtro'
import FeaturedProjects from '../components/home/FeaturedProjects'
import Testimonials from '../components/home/Testimonials'
import CTA from '../components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Filtro />
      <FeaturedProjects />
      <Testimonials />
      <CTA />
    </>
  )
}
