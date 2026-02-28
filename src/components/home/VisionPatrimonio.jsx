import { useState } from 'react'
import AnimateOnScroll from '../AnimateOnScroll'

export default function VisionPatrimonio() {
  const [hoverSide, setHoverSide] = useState(null) // 'left' | 'right' | null

  const isHovered = hoverSide !== null

  return (
    <section className="py-6 md:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div
            className="flex flex-col sm:flex-row w-full max-w-3xl mx-auto"
            onMouseLeave={() => setHoverSide(null)}
          >

            {/* ─── IZQUIERDA: Visión estratégica ─── */}
            <div
              className="flex-1 min-h-[72px] sm:min-h-[140px] relative flex items-center justify-center border-[3px] border-b-0 sm:border-b-[3px] sm:border-r-0 border-gray-900 bg-white cursor-default overflow-hidden transition-colors duration-300"
              onMouseEnter={() => setHoverSide('left')}
            >
              {/* Relleno negro: entra deslizándose desde la derecha */}
              <span
                className={`absolute inset-0 bg-gray-900 transition-transform duration-500 ease-out ${hoverSide === 'left' ? 'translate-x-0' : 'translate-x-full'}`}
                aria-hidden
              />

              {/* Texto principal "Visión estratégica" – oculto al hover derecho */}
              <span className={`absolute inset-0 flex items-center justify-center p-4 font-serif italic text-lg sm:text-xl md:text-2xl font-semibold text-center transition-all duration-400
                ${hoverSide === 'left' ? 'text-white' : 'text-gray-900'}
                ${hoverSide === 'right' ? 'opacity-0' : 'opacity-100'}
                relative z-10`}
              >
                Visión estratégica
              </span>

              {/* Frase que aparece al hover DERECHO */}
              <span className={`absolute inset-0 flex items-center justify-center p-4 font-serif italic text-[15px] sm:text-base font-semibold text-gray-900 text-center leading-snug transition-opacity duration-400 z-10
                ${hoverSide === 'right' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                Proyectos diseñados para generar crecimiento sostenido y seguridad a largo plazo.
              </span>
            </div>

            {/* ─── DERECHA: Patrimonio en ascenso ─── */}
            <div
              className="flex-1 min-h-[72px] sm:min-h-[140px] relative flex items-center justify-center border-[3px] border-t-0 sm:border-t-[3px] border-l-0 border-gray-900 bg-gray-900 cursor-default overflow-hidden transition-colors duration-300"
              onMouseEnter={() => setHoverSide('right')}
            >
              {/* Relleno blanco en cualquier hover */}
              <span
                className={`absolute inset-0 bg-white origin-left transition-transform duration-500 ease-out ${isHovered ? 'scale-x-100' : 'scale-x-0'}`}
                aria-hidden
              />

              {/* "Patrimonio en ascenso": visible siempre, solo cambia color */}
              <span className={`absolute inset-0 flex items-center justify-center p-4 font-serif italic text-lg sm:text-xl md:text-2xl font-semibold text-center transition-all duration-400 z-10
                ${isHovered ? 'opacity-0 pointer-events-none' : 'text-white opacity-100'}`}
              >
                Patrimonio en ascenso
              </span>

              {/* Hover derecho: solo invierte fondo y letra, muestra "Patrimonio en ascenso" en negro */}
              <span className={`absolute inset-0 flex items-center justify-center p-4 font-serif italic text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 text-center transition-opacity duration-400 z-10
                ${hoverSide === 'right' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                Patrimonio en ascenso
              </span>

              {/* Frase que aparece solo al hover IZQUIERDO */}
              <span className={`absolute inset-0 flex items-center justify-center p-4 font-serif italic text-[15px] sm:text-base font-semibold text-gray-900 text-center leading-snug transition-opacity duration-400 z-10
                ${hoverSide === 'left' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              >
                Ubicación, plusvalía y proyección de crecimiento para que cada decisión tenga fundamento financiero real.
              </span>
            </div>

          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
