import { useRef, useState, useEffect } from 'react'
import AnimateOnScroll from '../components/AnimateOnScroll'
import VisionPatrimonio from '../components/home/VisionPatrimonio'
import { useContactModal } from '../context/ContactModalContext'

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
    titulo: 'Seguridad',
    descripcion: 'Verificamos documentación, legalidad y estado de cada propiedad. Trabajamos con transparencia para que tu inversión esté protegida.',
    icono: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12 12 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
  },
  {
    titulo: 'Proceso claro',
    descripcion: 'Sabrás en todo momento en qué etapa estás: búsqueda, visitas, oferta, papeles y cierre. Sin sorpresas ni trámites opacos.',
    icono: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    ),
  },
  {
    titulo: 'Acompañamiento',
    descripcion: 'Un asesor te guía de principio a fin: filtros según tu perfil, visitas, negociación y apoyo con notaría y crédito si lo necesitas.',
    icono: (
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
  },
]

const pasos = [
  { numero: '01', titulo: 'Consulta y perfil', texto: 'Platicamos contigo: tipo de propiedad, zona, presupuesto y uso (vivienda o inversión). Con eso afinamos la búsqueda desde el primer día.' },
  { numero: '02', titulo: 'Búsqueda y visitas', texto: 'Te mostramos opciones que encajan con tu perfil. Coordinamos visitas y resolvemos dudas sobre cada propiedad y la zona.' },
  { numero: '03', titulo: 'Oferta y negociación', texto: 'Te apoyamos en la oferta, el trato con el vendedor y la revisión de documentación para que todo quede en orden.' },
  { numero: '04', titulo: 'Cierre y acompañamiento', texto: 'Te guiamos con notaría, escrituración y, si aplica, con crédito hipotecario. Estamos contigo hasta las llaves y después.' },
]

export default function NosotrosPage() {
  const { openContactModal } = useContactModal()

  return (
    <div className="min-h-screen bg-white">
      <HeroNosotros />

      {/* Introducción */}
      <section className="py-16 md:py-24 bg-white h-[310px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <p className="font-serif text-2xl md:text-3xl text-gray-700 italic max-w-3xl mx-auto text-center leading-relaxed">
              “Comprar o vender una propiedad es una decisión grande; por eso nos enfocamos en seguridad, proceso claro y acompañamiento en cada paso.”
            </p>
            <p className="mt-8 text-gray-600 text-center max-w-xl mx-auto">
              Nuestro objetivo no es cerrar una venta, sino construir relaciones duraderas basadas en confianza y resultados.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Visión estratégica / Patrimonio en ascenso */}
      <VisionPatrimonio />

      {/* Pilares */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-accent mb-2 text-center">
              Nuestros pilares
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-14">
              Tres principios que guían cada operación: que te sientas seguro, informado y acompañado.
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

      {/* Cómo trabajamos (timeline alternado) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-accent mb-2 text-center">
              Cómo trabajamos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-16">
              Desde la primera plática hasta la entrega de llaves: un camino ordenado y sin sorpresas.
            </p>
          </AnimateOnScroll>
          <div className="space-y-12 md:space-y-16">
            {pasos.map((paso, i) => (
              <AnimateOnScroll
                key={paso.numero}
                direction={i % 2 === 0 ? 'left' : 'right'}
                delay={i * 0.08}
              >
                <div className={`flex flex-col md:flex-row md:items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-accent text-white flex items-center justify-center font-serif text-2xl font-semibold">
                    {paso.numero}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                      {paso.titulo}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {paso.texto}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-accent text-white">
        <AnimateOnScroll direction="up">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Encuentra tu propiedad o vende la tuya
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Cuéntanos qué buscas o qué quieres ofrecer. Te respondemos con opciones y un proceso claro, con seguridad y acompañamiento.
            </p>
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex items-center px-8 py-4 bg-white text-accent font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar consulta
            </button>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  )
}
