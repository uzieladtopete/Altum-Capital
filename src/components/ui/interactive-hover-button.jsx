import React from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const InteractiveHoverButton = React.forwardRef(
  ({ text = 'Button', className, light = false, ...props }, ref) => {
    const isLight = light
    return (
      <button
        ref={ref}
        className={cn(
          'group relative w-32 cursor-pointer overflow-hidden rounded-full border p-2 text-center font-semibold',
          isLight
            ? 'border-white bg-white/15 text-white'
            : 'bg-background',
          className
        )}
        {...props}
      >
        <span className="inline-block translate-x-1 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {text}
        </span>
        <div
          className={cn(
            'absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100',
            isLight ? 'text-gray-900' : 'text-primary-foreground'
          )}
        >
          <span>{text}</span>
          <ArrowRight />
        </div>
        <div
          className={cn(
            'absolute left-0 top-[40%] ml-[15px] mr-[15px] h-2 w-2 scale-[1] rounded-lg transition-all duration-300 group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]',
            isLight ? 'bg-white group-hover:bg-white' : 'bg-primary group-hover:bg-primary'
          )}
        />
      </button>
    )
  }
)
InteractiveHoverButton.displayName = 'InteractiveHoverButton'

export { InteractiveHoverButton }
