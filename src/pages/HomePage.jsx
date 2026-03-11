import Hero from '../components/home/Hero'
import Filtro from '../components/Filtro'
import FeaturedProjects from '../components/home/FeaturedProjects'
import { TestimonialsSection } from '../components/ui/testimonials-with-marquee'
import CTA from '../components/home/CTA'

const testimonialsMarquee = [
  {
    author: {
      name: 'María González',
      handle: '@mariag',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Encontré mi departamento ideal con Altum Capital. El equipo fue muy profesional y el proceso transparente de principio a fin.',
  },
  {
    author: {
      name: 'Roberto Sánchez',
      handle: '@robertos',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Invertir en bienes raíces con su asesoría fue la mejor decisión. Plusvalía y rentabilidad desde el primer año.',
  },
  {
    author: {
      name: 'Ana Martínez',
      handle: '@anaml',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    text: 'Diseño que habita el espacio: así describiría la casa que compramos. Calidad y ubicación excepcionales.',
  },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <Filtro />
      <FeaturedProjects />
      <TestimonialsSection
        title="Lo que dicen quienes nos eligen"
        description="Familias e inversionistas que ya construyeron patrimonio con nosotros."
        testimonials={testimonialsMarquee}
      />
      <CTA />
    </>
  )
}
