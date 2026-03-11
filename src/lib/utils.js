import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes with clsx. Used by shadcn-style UI components.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
