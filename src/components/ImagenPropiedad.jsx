import { useState } from 'react'
import { getOptimizedImageUrl } from '../config/cloudinary'

const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#f3f4f6" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Sin imagen</text></svg>'
)}`

/**
 * Muestra la imagen de una propiedad. Si la URL es de Cloudinary, usa la versión optimizada (w_1200, q_auto, f_auto).
 * Si falla la carga, muestra un placeholder.
 */
export default function ImagenPropiedad({ src, alt, className = '' }) {
  const [errored, setErrored] = useState(false)
  const optimizedSrc = src ? getOptimizedImageUrl(src) : ''
  const displaySrc = errored || !src ? PLACEHOLDER_SVG : optimizedSrc

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
