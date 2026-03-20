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
    </div>
  )
}
