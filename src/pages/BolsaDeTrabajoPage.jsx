import { useRef, useState, useEffect } from 'react'
import AnimateOnScroll from '../components/AnimateOnScroll'

const EMAIL = 'contacto@altumcapital.com'
const EMAIL_SUBJECT = 'Quiero ser agente Altum Capital'

const beneficios = [
  {
    titulo: 'Ingresos sin techo',
    descripcion: 'Tu esfuerzo define tus resultados. Sin límite de comisiones, sin techo de ingresos.',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    titulo: 'Capacitación constante',
    descripcion: 'Acceso a formación en ventas, mercado inmobiliario, finanzas y estrategia de cierre.',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    titulo: 'Cartera de propiedades',
    descripcion: 'Trabaja con un portafolio sólido de propiedades en zonas de alta plusvalía y demanda real.',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    titulo: 'Equipo y cultura',
    descripcion: 'Un equipo que comparte conocimiento, se apoya y celebra los logros juntos.',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    titulo: 'Flexibilidad real',
    descripcion: 'Horarios que se adaptan a tu vida. Trabaja desde donde quieras con las herramientas que necesitas.',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    titulo: 'Respaldo y herramientas',
    descripcion: 'CRM, materiales de marketing, apoyo legal y acompañamiento en cada etapa del proceso de venta.',
    icono: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12 12 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const pasos = [
  { numero: '01', titulo: 'Escríbenos', texto: 'Mándanos un correo con tu nombre y por qué quieres unirte. Sin formatos complicados.' },
  { numero: '02', titulo: 'Entrevista', texto: 'Una plática informal para conocernos, entender tus metas y ver si hay fit con el equipo.' },
  { numero: '03', titulo: 'Incorporación', texto: 'Acceso al portafolio, capacitación inicial y asignación de tu primer asesor de apoyo.' },
  { numero: '04', titulo: 'Primeras ventas', texto: 'Con el respaldo del equipo y las herramientas listas, empiezas a generar tus primeras comisiones.' },
]

function HeroBolsa() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop)`,
        }}
      />
      <div className="absolute inset-0 bg-accent/80" aria-hidden />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className={`nosotros-hero-inner transition-all duration-1000 ease-out ${mounted ? 'nosotros-hero-visible' : ''}`}>
          <p className="font-sans text-sm md:text-base tracking-[0.2em] uppercase text-white/70 mb-4">
            Únete al equipo
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-tight">
            Hazte agente de<br />Altum Capital
          </h1>
          <div className={`mt-6 h-px w-20 mx-auto bg-white/40 transition-opacity duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
          <p className="mt-6 font-serif italic text-xl sm:text-2xl text-white/90 font-light max-w-xl mx-auto">
            "El éxito no espera, se construye"
          </p>
        </div>
      </div>
    </section>
  )
}

export default function BolsaDeTrabajoPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroBolsa />

      {/* Intro */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
                Nuestra misión como equipo
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                En Altum Capital creemos que el sector inmobiliario es una de las herramientas más poderosas para construir patrimonio. Por eso buscamos personas que compartan esa visión: asesores comprometidos, honestos y con hambre de crecer.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                No vendemos solo propiedades. Ayudamos a familias e inversionistas a tomar decisiones que cambian su vida financiera. Si quieres ser parte de eso, este es tu lugar.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Buscamos personas… */}
      <section className="py-12 md:py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <div className="max-w-2xl mx-auto text-center">
              <p className="font-sans text-sm tracking-[0.2em] uppercase text-white/60 mb-4">
                A quién buscamos
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-6">
                Personas decididas a crecer
              </h2>
              <p className="text-white/80 text-lg leading-relaxed">
                No pedimos experiencia previa. Pedimos actitud, visión y disposición para aprender. Si tienes eso, nosotros ponemos el resto: capacitación, portafolio, herramientas y un equipo que te respalda desde el día uno.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 text-center mb-2">
              ¿Qué obtienes al unirte?
            </h2>
            <p className="text-gray-600 text-center max-w-xl mx-auto mb-14">
              Más que un trabajo: una plataforma para construir tu carrera y tus ingresos.
            </p>
          </AnimateOnScroll>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((b, i) => (
              <AnimateOnScroll key={b.titulo} direction="up" delay={i * 0.08}>
                <div className="group h-full p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors duration-300 mb-5">
                    {b.icono}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">
                    {b.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {b.descripcion}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 text-center mb-2">
              ¿Cómo empiezas?
            </h2>
            <p className="text-gray-600 text-center max-w-xl mx-auto mb-16">
              Un proceso simple y directo: de la intención a las primeras ventas.
            </p>
          </AnimateOnScroll>
          <div className="space-y-10 md:space-y-14">
            {pasos.map((paso, i) => (
              <AnimateOnScroll key={paso.numero} direction={i % 2 === 0 ? 'left' : 'right'} delay={i * 0.08}>
                <div className={`flex flex-col md:flex-row md:items-center gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center font-serif text-xl font-semibold">
                    {paso.numero}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 mb-1">
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

      {/* CTA / Contacto */}
      <section className="py-16 md:py-24 bg-accent text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              ¿Listo para dar el paso?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Escríbenos con tu nombre y cuéntanos brevemente por qué quieres unirte. Sin CV largo ni formularios complicados.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar correo
            </a>
            <p className="mt-4 text-white/60 text-sm">{EMAIL}</p>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  )
}
