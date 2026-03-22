import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Hero con título animado.
 * - Modo dos líneas: `headlineLine1` + `headlineLine2Prefix` + palabras rotativas (alineación estable en móvil y escritorio).
 * - Modo legacy: `staticPrefix` en un solo bloque.
 */
function Hero({
  dark = false,
  titles = ['increíble', 'nuevo', 'único', 'exclusivo', 'perfecto'],
  lead = 'Donde las oportunidades alcanzan su punto más alto.',
  staticPrefix = 'Diseño que habita el ',
  headlineLine1 = null,
  headlineLine2Prefix = null,
}) {
  const [titleNumber, setTitleNumber] = useState(0)
  const titleList = useMemo(() => titles, [titles])
  const measureRef = useRef(null)
  const [slotWidth, setSlotWidth] = useState(0)

  const twoLine = headlineLine1 != null && headlineLine2Prefix != null

  const measureSlot = () => {
    if (!measureRef.current) return
    const spans = measureRef.current.querySelectorAll('span')
    let max = 0
    spans.forEach((s) => {
      const w = s.getBoundingClientRect().width
      if (w > max) max = w
    })
    setSlotWidth(Math.ceil(max))
  }

  useLayoutEffect(() => {
    measureSlot()
  }, [titleList])

  useEffect(() => {
    const onResize = () => measureSlot()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [titleList])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titleList.length - 1) {
        setTitleNumber(0)
      } else {
        setTitleNumber(titleNumber + 1)
      }
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titleList])

  const textAccent = dark ? 'text-white' : 'text-spektr-cyan-50'
  const textMuted = dark ? 'text-white/90' : 'text-muted-foreground'
  const titleClass = dark ? 'text-white' : ''

  const titleSizeClass =
    'font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-semibold'

  /** Altura de línea del slot: serif con g/j/p/y necesita ~1.35+ para no recortar descendentes */
  const slotLineHeight = 1.35
  const slotMinHeightEm = 1.5

  const rotatingSlot = (
    <span
      className="relative inline-block shrink-0 overflow-hidden align-middle"
      style={{
        width: slotWidth > 0 ? slotWidth + 12 : 'min-content',
        minHeight: `${slotMinHeightEm}em`,
        lineHeight: slotLineHeight,
      }}
      aria-live="polite"
    >
      {titleList.map((title, index) => (
        <motion.span
          key={index}
          className={`absolute inset-0 flex items-center justify-start whitespace-nowrap ${textAccent}`}
          style={{ lineHeight: slotLineHeight }}
          initial={{ opacity: 0, y: '-100%' }}
          transition={{ type: 'spring', stiffness: 50, damping: 22 }}
          animate={
            titleNumber === index
              ? { y: 0, opacity: 1 }
              : { y: titleNumber > index ? '-120%' : '120%', opacity: 0 }
          }
        >
          {title}
        </motion.span>
      ))}
    </span>
  )

  return (
    <div className="w-full">
      <div className="container mx-auto px-2 sm:px-0">
        <div className="flex gap-8 py-12 lg:py-20 items-center justify-center flex-col">
          <div className="flex w-full max-w-[min(100%,42rem)] flex-col items-center gap-3">
            {/* Medición invisible (misma tipografía que el h1) */}
            <div
              ref={measureRef}
              aria-hidden="true"
              className={`pointer-events-none fixed left-0 top-0 -z-10 flex flex-col items-start opacity-0 ${titleSizeClass}`}
            >
              {titleList.map((title, i) => (
                <span key={i} className="inline-block whitespace-nowrap">
                  {title}
                </span>
              ))}
            </div>

            {twoLine ? (
              <h1
                className={`${titleSizeClass} flex flex-col items-center gap-1 text-center leading-normal sm:gap-1.5 sm:leading-tight`}
              >
                <span className={`block w-full ${titleClass}`}>{headlineLine1}</span>
                <span className={`block w-full text-center ${titleClass}`}>
                  {/*
                    flex-nowrap: en ~400px si wrap activa, la palabra rotativa pasa a una “fila” nueva y parece que “bajó”.
                    items-center + align-middle en el slot: misma altura visual que “construyendo” en móvil y escritorio.
                  */}
                  <span className="inline-flex max-w-full flex-nowrap items-center justify-center gap-x-0">
                    <span className="shrink-0 whitespace-pre">{headlineLine2Prefix}</span>
                    {rotatingSlot}
                  </span>
                </span>
              </h1>
            ) : (
              <h1 className={`${titleSizeClass} text-center`}>
                <span className={titleClass} style={{ whiteSpace: 'pre-line' }}>
                  {staticPrefix}
                </span>
                <span
                  className="relative inline-block align-middle overflow-hidden text-center"
                  style={{
                    width: slotWidth > 0 ? slotWidth + 16 : 'auto',
                    minHeight: `${slotMinHeightEm}em`,
                    lineHeight: slotLineHeight,
                    verticalAlign: 'middle',
                  }}
                >
                  {titleList.map((title, index) => (
                    <motion.span
                      key={index}
                      className={`absolute inset-0 flex items-center justify-start whitespace-nowrap ${textAccent}`}
                      style={{ lineHeight: slotLineHeight }}
                      initial={{ opacity: 0, y: '-100%' }}
                      transition={{ type: 'spring', stiffness: 50, damping: 22 }}
                      animate={
                        titleNumber === index
                          ? { y: 0, opacity: 1 }
                          : { y: titleNumber > index ? '-120%' : '120%', opacity: 0 }
                      }
                    >
                      {title}
                    </motion.span>
                  ))}
                </span>
              </h1>
            )}

            <p
              className={`text-base sm:text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-center px-1 ${textMuted}`}
            >
              {lead}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Hero }
