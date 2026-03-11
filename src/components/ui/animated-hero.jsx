import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function Hero({
  dark = false,
  titles = ['increíble', 'nuevo', 'único', 'exclusivo', 'perfecto'],
  lead = 'Donde las oportunidades alcanzan su punto más alto.',
  staticPrefix = 'Diseño que habita el ',
}) {
  const [titleNumber, setTitleNumber] = useState(0)
  const titleList = useMemo(() => titles, [titles])
  const measureRef = useRef(null)
  const [slotWidth, setSlotWidth] = useState(0)

  useEffect(() => {
    if (measureRef.current) {
      const spans = measureRef.current.querySelectorAll('span')
      let max = 0
      spans.forEach((s) => { if (s.offsetWidth > max) max = s.offsetWidth })
      setSlotWidth(max)
    }
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

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-12 lg:py-20 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col items-center">
            {/* Hidden measurer to compute the width of the longest word */}
            <div ref={measureRef} aria-hidden="true" className="absolute overflow-hidden h-0 pointer-events-none font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter font-semibold whitespace-nowrap">
              {titleList.map((title, i) => (
                <span key={i} className="inline-block">{title}</span>
              ))}
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter text-center font-semibold whitespace-nowrap">
              <span className={titleClass}>{staticPrefix}</span>
              <span
                className="relative inline-block align-bottom overflow-hidden"
                style={{ width: slotWidth > 0 ? slotWidth + 4 : 'auto', height: '1.15em', marginTop: -10, marginBottom: -10 }}
              >
                {titleList.map((title, index) => (
                  <motion.span
                    key={index}
                    className={`absolute left-0 top-0 font-semibold whitespace-nowrap ${textAccent}`}
                    initial={{ opacity: 0, y: '-100%' }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? '-150%' : '150%', opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className={`text-lg md:text-xl leading-relaxed tracking-tight max-w-2xl text-center ${textMuted}`}>
              {lead}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Hero }
