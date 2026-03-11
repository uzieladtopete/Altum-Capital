import { useRef, useState, useEffect } from 'react'
import { TrendingUp, BookOpen, Building2, Users, Clock, ShieldCheck } from 'lucide-react'
import AnimateOnScroll from '../components/AnimateOnScroll'
import RadialOrbitalTimeline from '../components/ui/radial-orbital-timeline'
import TextReveal from '../components/ui/text-reveal'

const EMAIL = 'contacto@altumcapital.com'
const EMAIL_SUBJECT = 'Quiero ser agente Altum Capital'

const timelineBeneficios = [
  {
    id: 1,
    title: 'Ingresos sin techo',
    date: 'Core',
    content: 'Tu esfuerzo define tus resultados. Sin límite de comisiones, sin techo de ingresos.',
    category: 'Beneficio',
    icon: TrendingUp,
    relatedIds: [2, 6],
    status: 'completed',
    energy: 100,
  },
  {
    id: 2,
    title: 'Capacitación',
    date: 'Core',
    content: 'Acceso a formación en ventas, mercado inmobiliario, finanzas y estrategia de cierre.',
    category: 'Beneficio',
    icon: BookOpen,
    relatedIds: [1, 3],
    status: 'completed',
    energy: 95,
  },
  {
    id: 3,
    title: 'Cartera de propiedades',
    date: 'Core',
    content: 'Trabaja con un portafolio sólido de propiedades en zonas de alta plusvalía y demanda real.',
    category: 'Beneficio',
    icon: Building2,
    relatedIds: [2, 4],
    status: 'completed',
    energy: 90,
  },
  {
    id: 4,
    title: 'Equipo y cultura',
    date: 'Core',
    content: 'Un equipo que comparte conocimiento, se apoya y celebra los logros juntos.',
    category: 'Beneficio',
    icon: Users,
    relatedIds: [3, 5],
    status: 'in-progress',
    energy: 85,
  },
  {
    id: 5,
    title: 'Flexibilidad real',
    date: 'Core',
    content: 'Horarios que se adaptan a tu vida. Trabaja desde donde quieras con las herramientas que necesitas.',
    category: 'Beneficio',
    icon: Clock,
    relatedIds: [4, 6],
    status: 'in-progress',
    energy: 80,
  },
  {
    id: 6,
    title: 'Respaldo y herramientas',
    date: 'Core',
    content: 'CRM, materiales de marketing, apoyo legal y acompañamiento en cada etapa del proceso de venta.',
    category: 'Beneficio',
    icon: ShieldCheck,
    relatedIds: [5, 1],
    status: 'completed',
    energy: 95,
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
            Hazte agente de Altum Capital
          </p>
          <TextReveal
            word="Únete al Equipo"
            titleClassName="text-white"
          />
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

      {/* Beneficios — Radial Orbital Timeline */}
      <section className="py-16 md:py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll direction="up">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 text-center mb-2">
              ¿Qué obtienes al unirte?
            </h2>
            <p className="text-gray-600 text-center max-w-xl mx-auto mb-10">
              Más que un trabajo: una plataforma para construir tu carrera y tus ingresos.
            </p>
          </AnimateOnScroll>
          <RadialOrbitalTimeline timelineData={timelineBeneficios} />
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
