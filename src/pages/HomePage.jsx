import Hero from '../components/home/Hero'
import Filtro from '../components/Filtro'
import FeaturedProjects from '../components/home/FeaturedProjects'
import { TestimonialsSection } from '../components/ui/testimonials-with-marquee'

const testimonialsMarquee = [
  {
    author: { name: 'Fernanda González' },
    text: 'Con Altum Capital logré vender mi casa más rápido de lo que esperaba, su asesoría fue clara desde el inicio y siempre estuvieron al pendiente de cada detalle. Me sentí acompañada en todo el proceso.',
  },
  {
    author: { name: 'Roberto Rodriguez' },
    text: 'El nivel de profesionalismo de Altum es impresionante, me explicaron todo con transparencia y me ayudaron a tomar la mejor decisión. Sin duda volvería a invertir con ellos.',
  },
  {
    author: { name: 'Ana Larios' },
    text: 'Lo que más me gustó fue el trato humano, no solo se enfocaron en vender mi propiedad, sino en entender mis necesidades. Siempre disponibles y muy atentos.',
  },
  {
    author: { name: 'Luis y Flor' },
    text: 'Era nuestra primera compra y teníamos muchas dudas, pero nos guiaron paso a paso, nos dieron confianza y tranquilidad durante todo el proceso y estamos agradecidos por eso.',
  },
  {
    author: { name: 'Jorge Mendez' },
    text: 'Gracias a su estrategia de promoción logramos cerrar la venta en muy buen precio, se nota que conocen el mercado y saben de negocios.',
  },
  {
    author: { name: 'Patricia Sol' },
    text: 'Algo que realmente valoro fue el seguimiento. Siempre me mantuvieron informada y resolvieron todas mis dudas rápidamente.',
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
    </>
  )
}
