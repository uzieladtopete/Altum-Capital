import { useState } from 'react'

const PLACEHOLDER_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#f3f4f6" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Sin imagen</text></svg>'
)}`

/**
 * Muestra la imagen de una propiedad. Si falla la carga (p. ej. URL temporal inválida), muestra un placeholder.
 */
export default function ImagenPropiedad({ src, alt, className = '' }) {
  const [errored, setErrored] = useState(false)
  const displaySrc = errored || !src ? PLACEHOLDER_SVG : src

  return (
    <img
      src={displaySrc}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  )
}
