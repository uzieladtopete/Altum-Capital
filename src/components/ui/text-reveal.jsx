import { cn } from '@/lib/utils'

/**
 * Text reveal con animación por caracter (cinematic).
 * word: texto a animar. Usa \n para saltos de línea.
 * className: clases para el contenedor del título.
 * noReplay: si es true no se muestra el botón Replay (por defecto true para hero).
 */
export default function TextReveal({
  word = '',
  className = '',
  titleClassName = '',
  noReplay = true,
  onReplay,
}) {
  const normalizedWord = typeof word === 'string' ? word.replace(/\\n/g, '\n') : ''
  const lines = normalizedWord.split('\n')
  let charIndex = 0

  return (
    <div className={cn('text-reveal-container flex flex-col items-center justify-center', className)}>
      <div className="relative z-10 w-full">
        <h1
          className={cn('text-reveal-title font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight', titleClassName)}
          aria-label={normalizedWord.replace(/\n/g, ' ')}
        >
          {lines.map((line, lineIdx) => (
            <span key={lineIdx} className="text-reveal-line">
              {line.split('').map((char, i) => {
                const idx = charIndex++
                return (
                  <span
                    key={`${lineIdx}-${idx}`}
                    className="text-reveal-char"
                    style={{ '--char-index': idx }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                )
              })}
              {lineIdx < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
      </div>
      {!noReplay && onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="mt-6 px-6 py-2 text-sm font-medium rounded-full border border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors"
        >
          Replay
        </button>
      )}
    </div>
  )
}
