/**
 * Subida directa a Cloudinary desde el frontend (unsigned upload).
 * Validación: 5MB máx, jpg/jpeg/png/webp. No expone API Secret.
 */

import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, isCloudinaryConfigured } from '../config/cloudinary'

// Límites y tipos permitidos (requisitos del producto)
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5MB
export const MAX_IMAGES = 20
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

/**
 * Valida un archivo antes de subir.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Archivo no válido.' }
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `Máximo 5MB por imagen (${(file.size / 1024 / 1024).toFixed(2)}MB).` }
  }
  const ext = (file.name.split('.').pop() || '').toLowerCase()
  const typeOk = ALLOWED_MIME_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext)
  if (!typeOk) {
    return { valid: false, error: 'Solo se permiten JPG, JPEG, PNG y WEBP.' }
  }
  return { valid: true }
}

/**
 * Valida una lista de archivos y que no se exceda el máximo.
 * @param {File[]} files
 * @param {number} currentCount - Cantidad actual de imágenes ya subidas (para edición).
 * @param {number} [maxAllowed=MAX_IMAGES] - Límite de imágenes (ej. 1 para portada).
 * @returns {{ valid: boolean, errors?: string[] }}
 */
export function validateImageFileList(files, currentCount = 0, maxAllowed = MAX_IMAGES) {
  const errors = []
  const total = currentCount + (files?.length || 0)
  if (total > maxAllowed) {
    errors.push(`Máximo ${maxAllowed} imagen${maxAllowed === 1 ? '' : 's'} (tienes ${currentCount} y agregaste ${files?.length}).`)
  }
  if (!files?.length) {
    return { valid: errors.length === 0, errors: errors.length ? errors : undefined }
  }
  for (const file of files) {
    const { valid, error } = validateImageFile(file)
    if (!valid && error) errors.push(`${file.name}: ${error}`)
  }
  return {
    valid: errors.length === 0,
    errors: errors.length ? errors : undefined,
  }
}

/**
 * Sube un archivo a Cloudinary por unsigned upload.
 * Usa XMLHttpRequest para reportar progreso.
 * @param {File} file
 * @param {(percent: number) => void} onProgress - 0..100
 * @returns {Promise<{ secure_url: string }>}
 */
export function uploadImageToCloudinary(file, onProgress) {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error('Cloudinary no configurado. Añade VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET.'))
  }
  const validation = validateImageFile(file)
  if (!validation.valid) {
    return Promise.reject(new Error(validation.error))
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          if (data.secure_url) {
            resolve({ secure_url: data.secure_url })
          } else {
            reject(new Error('Cloudinary no devolvió secure_url.'))
          }
        } catch (err) {
          reject(new Error('Respuesta inválida de Cloudinary.'))
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err.error?.message || `Error ${xhr.status}: ${xhr.statusText}`))
        } catch (_) {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Error de red al subir.')))
    xhr.addEventListener('abort', () => reject(new Error('Subida cancelada.')))

    xhr.open('POST', url)
    xhr.send(formData)
  })
}
