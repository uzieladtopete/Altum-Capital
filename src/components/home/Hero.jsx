import AnimateOnScroll from '../AnimateOnScroll'

export default function Hero() {
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
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <AnimateOnScroll direction="up" delay={0.1}>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight">
            Diseño que habita el espacio
          </h1>
        </AnimateOnScroll>
        <AnimateOnScroll direction="up" delay={0.25}>
          <p className="mt-6 text-lg sm:text-xl text-white/90 font-light max-w-2xl mx-auto">
            Arquitectura contemporánea con enfoque en luz, materiales y bienestar.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
