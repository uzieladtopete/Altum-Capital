import { useNavigate } from 'react-router-dom'
import { Hero as AnimatedHero } from '@/components/ui/animated-hero'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop)`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      {/* Animated hero content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        <AnimatedHero
          dark
          titles={['espacio', 'momento', 'lugar', 'sueño', 'hogar']}
          staticPrefix="Diseño que habita el "
          lead="Donde las oportunidades alcanzan su punto más alto."
        />
        <InteractiveHoverButton
          text="Ver propiedades"
          light
          onClick={() => navigate('/resultados')}
          className="mt-4 w-44"
        />
      </div>
    </section>
  )
}
