import AnimateOnScroll from '../AnimateOnScroll'

const testimonials = [
  {
    quote: 'Un trabajo impecable. Cada detalle fue pensado para mejorar nuestra vida en el espacio.',
    author: 'María G.',
    role: 'Cliente residencial',
  },
  {
    quote: 'Profesionalismo y sensibilidad con el entorno. Recomiendo totalmente su estudio.',
    author: 'Roberto L.',
    role: 'Desarrollador inmobiliario',
  },
  {
    quote: 'La mejor decisión que tomamos para nuestra oficina. Espacios que inspiran.',
    author: 'Ana S.',
    role: 'Directora comercial',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-accent mb-2">
            Testimonios
          </h2>
          <p className="text-gray-600 max-w-2xl mb-12">
            Lo que dicen quienes han confiado en nosotros para sus proyectos.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, author, role }, i) => (
            <AnimateOnScroll key={i} direction="up" delay={i * 0.1}>
              <blockquote className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-gray-700 text-lg leading-relaxed font-light italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <footer className="mt-6">
                  <cite className="not-italic font-medium text-accent">{author}</cite>
                  <span className="text-gray-500 text-sm block">{role}</span>
                </footer>
              </blockquote>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
