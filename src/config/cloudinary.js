/**
 * Configuración de Cloudinary para subida directa desde el frontend.
 * No se expone API Secret; se usa unsigned upload preset.
 */

export const CLOUDINARY_CLOUD_NAME =
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').toString().trim()

/** Nombre del upload preset (unsigned) configurado en Cloudinary Dashboard */
export const CLOUDINARY_UPLOAD_PRESET =
  (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').toString().trim()

export const isCloudinaryConfigured = () =>
  Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET)

/** URL base para transformaciones al mostrar (width 1200, quality auto, format auto) */
export function getOptimizedImageUrl(secureUrl, options = {}) {
  if (!secureUrl || typeof secureUrl !== 'string') return secureUrl
  const { width = 1200, quality = 'auto', format = 'auto' } = options
  // Si ya es una URL de Cloudinary, insertar transformaciones en la ruta
  const match = secureUrl.match(/^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/)
  if (!match) return secureUrl
  const [, base, rest] = match
  const trans = `w_${width},q_${quality},f_${format}`
  return `${base}${trans}/${rest}`
}
