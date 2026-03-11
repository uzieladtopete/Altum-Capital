import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function RippleButton({ children, className = '', rippleColor = 'bg-white', ...props }) {
  const buttonRef = useRef(null)
  const [ripple, setRipple] = useState(null)
  const [isHovered, setIsHovered] = useState(false)

  const createRipple = useCallback(
    (event) => {
      if (isHovered || !buttonRef.current) return
      setIsHovered(true)
      const rect = buttonRef.current.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, size, key: Date.now() })
    },
    [isHovered]
  )

  const removeRipple = useCallback((event) => {
    if (event.target !== event.currentTarget) return
    setIsHovered(false)
    const rect = buttonRef.current.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    setRipple({ x: event.clientX - rect.left, y: event.clientY - rect.top, size, key: Date.now(), isLeaving: true })
  }, [])

  const handleMouseMove = useCallback(
    (event) => {
      if (!buttonRef.current || !isHovered || !ripple) return
      const rect = buttonRef.current.getBoundingClientRect()
      setRipple((prev) => ({ ...prev, x: event.clientX - rect.left, y: event.clientY - rect.top }))
    },
    [isHovered, ripple]
  )

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-lg px-8 py-3 text-base font-medium transition-colors duration-[600ms]',
        className
      )}
      onMouseEnter={(e) => { if (e.target === e.currentTarget) createRipple(e) }}
      onMouseLeave={(e) => { if (e.target === e.currentTarget) removeRipple(e) }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <span className={`relative z-[2] transition-colors duration-300 ${isHovered ? 'text-gray-900' : ''}`}>{children}</span>

      <AnimatePresence>
        {ripple && (
          <motion.span
            key={ripple.key}
            className={`absolute rounded-full pointer-events-none z-[1] ${rippleColor}`}
            style={{
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
              x: '-50%',
              y: '-50%',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: ripple.isLeaving ? 0 : 1, x: '-50%', y: '-50%' }}
            exit={{ scale: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() => {
              if (ripple.isLeaving) setRipple(null)
            }}
          />
        )}
      </AnimatePresence>
    </button>
  )
}
