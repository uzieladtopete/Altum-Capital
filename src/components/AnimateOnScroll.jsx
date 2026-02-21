import { useRef, useState, useEffect } from 'react'

const defaultOptions = {
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1,
}

/**
 * Hook que detecta cuando el elemento entra en el viewport (Intersection Observer).
 * @param {Object} options - { rootMargin, threshold }
 * @returns {[React.Ref, boolean]} ref para el elemento y si está visible
 */
export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  const { rootMargin, threshold } = { ...defaultOptions, ...options }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { rootMargin, threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [ref, inView]
}

/**
 * Envuelve el contenido y lo anima al entrar en viewport: desvanecimiento + desplazamiento.
 * @param {React.ReactNode} children
 * @param {string} direction - 'up' | 'down' | 'left' | 'right'
 * @param {number} delay - segundos de retraso (para stagger)
 * @param {boolean} once - si true, la animación solo se aplica una vez
 */
export default function AnimateOnScroll({ children, direction = 'up', delay = 0, once = true, className = '' }) {
  const [ref, inView] = useInView(once ? {} : { threshold: 0 })

  const dirClass = {
    up: 'animate-scroll-in-up',
    down: 'animate-scroll-in-down',
    left: 'animate-scroll-in-left',
    right: 'animate-scroll-in-right',
  }

  return (
    <div
      ref={ref}
      className={`scroll-animate ${inView ? 'scroll-animate-visible ' + dirClass[direction] : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}
