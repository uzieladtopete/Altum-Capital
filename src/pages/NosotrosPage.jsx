import { useRef, useState, useEffect } from 'react'
import AnimateOnScroll from '../components/AnimateOnScroll'
import { useAuth } from '../context/AuthContext'
import AdvisorAdminPanel from '../components/admin/AdvisorAdminPanel'

// Hero con título que entra suave (sin depender de IntersectionObserver para el primer frame)
function HeroNosotros() {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop)`,
        }}
      />
      <div className="absolute inset-0 bg-accent/75" aria-hidden />
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className={`nosotros-hero-inner transition-all duration-1000 ease-out ${mounted ? 'nosotros-hero-visible' : ''}`}>
          <p className="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-white/80 mb-4">
            Quiénes somos
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight">
            Tu hogar, con confianza
          </h1>
          <div className={`mt-8 h-px w-24 mx-auto bg-white/50 transition-all duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
          <p className="mt-8 text-lg sm:text-xl text-white/90 font-light max-w-xl mx-auto">
            Porque no solo vendemos propiedades, construimos patrimonio.
          </p>
        </div>
      </div>
    </section>
  )
}

const pilares = [
  {
    titulo: 'Integridad',
    descripcion: 'Actuamos con honestidad y transparencia en cada operación.',
    icono: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12 12 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
  },
  {
    titulo: 'Profesionalismo',
    descripcion: 'Brindamos asesoría con conocimiento, preparación y estrategia.',
    icono: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
  },
  {
    titulo: 'Visión de crecimiento',
    descripcion: 'Buscamos oportunidades que realmente generen plusvalía y expansión.',
    icono: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    ),
  },
]

export default function NosotrosPage() {
  const { role } = useAuth()
  const isAdmin = role === 'admin'

  return (
    <div className="min-h-screen bg-white">
      <HeroNosotros />

      {/* Introducción */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <p className="font-serif text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto text-center leading-relaxed">
              Somos un equipo donde asesoramos estratégicamente con transparencia total, realizamos operaciones claras, damos enfoque de plusvalía y acompañamiento integral; te guiamos desde la búsqueda hasta el cierre y postventa. Adquirimos un compromiso real: tu inversión la tratamos como si fuera nuestra.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Pilares */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-accent mb-2 text-center">
              Nuestros pilares
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-14">
              Los principios que guían cada operación.
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pilares.map((pilar, i) => (
              <AnimateOnScroll key={pilar.titulo} direction="up" delay={i * 0.1}>
                <div className="group h-full p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                    {pilar.icono}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-gray-900 mt-6 mb-3">
                    {pilar.titulo}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {pilar.descripcion}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdvisorAdminPanel />
          </div>
        </section>
      )}

    </div>
  )
}
