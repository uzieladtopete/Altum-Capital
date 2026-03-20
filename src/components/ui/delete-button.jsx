import { cn } from '@/lib/utils'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from './button'

const sizeVariants = {
  sm: 'h-8 text-xs px-3',
  md: 'h-10 text-sm px-4',
  lg: 'h-12 text-base px-6',
}

const iconSizeVariants = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

const cancelButtonSizes = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
}

// Smooth spring preset for natural feel
const smoothSpring = {
  type: 'spring',
  bounce: 0,
  duration: 0.35,
}

/**
 * Botón con confirmación animada para eliminar (sin window.confirm).
 */
export function NativeDelete({
  onConfirm,
  onDelete,
  buttonText = 'Eliminar',
  confirmText = 'Confirmar',
  size = 'md',
  showIcon = true,
  className,
  buttonClassName,
  disabled = false,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleDeleteClick = () => {
    if (disabled) return
    setIsExpanded(true)
    onConfirm()
  }

  const handleConfirm = () => {
    onDelete()
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setIsExpanded(false)
  }

  return (
    <MotionConfig transition={smoothSpring}>
      <motion.div layout className={cn('relative inline-flex items-center gap-2', className)}>
        {/* Main Delete/Confirm button */}
        <motion.div
          layout
          whileHover={!disabled ? { scale: 1.02 } : undefined}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
        >
          <Button
            variant="destructive"
            size="default"
            className={cn(
              sizeVariants[size],
              'cursor-pointer transition-shadow text-white',
              disabled && 'opacity-50 cursor-not-allowed',
              buttonClassName,
            )}
            onClick={isExpanded ? handleConfirm : handleDeleteClick}
            disabled={disabled}
            aria-label={isExpanded ? confirmText : buttonText}
          >
            <AnimatePresence mode="wait" initial={false}>
              {showIcon && (
                <motion.span
                  key={isExpanded ? 'check-icon' : 'trash-icon'}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="mr-2 flex items-center"
                >
                  {isExpanded ? (
                    <Check className={iconSizeVariants[size]} />
                  ) : (
                    <Trash2 className={cn(iconSizeVariants[size], 'absolute left-[1px] ml-3 mr-3')} />
                  )}
                </motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isExpanded ? 'confirm' : 'delete'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {isExpanded ? confirmText : buttonText}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>

        {/* Cancel button */}
        <AnimatePresence mode="popLayout">
          {isExpanded && (
            <motion.div
              key="cancel-button"
              layout
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                className={cn(cancelButtonSizes[size], 'cursor-pointer transition-shadow')}
                onClick={handleCancel}
                aria-label="Cancelar eliminación"
              >
                <X className={iconSizeVariants[size]} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  )
}

