/**
 * Componente de subida múltiple de imágenes a Cloudinary (direct upload).
 * - Vista previa antes y después de subir.
 * - Validación: máx 20 imágenes, 5MB por imagen, jpg/jpeg/png/webp.
 * - Barra de progreso por imagen.
 * - Manejo de errores.
 * Supabase no almacena archivos; el padre guarda las URLs en property_images.
 */

import { useState, useRef } from 'react'
import {
  uploadImageToCloudinary,
  validateImageFileList,
  MAX_IMAGES,
} from '../services/cloudinaryUpload'
import { getOptimizedImageUrl } from '../config/cloudinary'

/** Un ítem de imagen: ya guardada (desde Supabase) o recién subida (solo URL). */
const emptyItem = (overrides = {}) => ({
  id: null,
  image_url: '',
  is_cover: false,
  order_index: 0,
  ...overrides,
})

export default function PropertyImageUploader({
  value = [],
  onChange,
  maxImages = MAX_IMAGES,
  disabled = false,
  className = '',
  /** Título del apartado: "Portada" o "Galería" */
  label = 'Imágenes de la propiedad',
  /** Si false, no se muestra el botón "Usar como portada" (para Galería) */
  showCoverButton = true,
}) {
  const [uploading, setUploading] = useState([]) // { file, progress, error }
  const [validationErrors, setValidationErrors] = useState([])
  const inputRef = useRef(null)

  const isPortada = maxImages === 1
  const currentCount = (value && value.length) || 0
  const canAddMore = currentCount + uploading.length < maxImages

  const handleFileSelect = (e) => {
    let files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    if (maxImages === 1 && files.length > 1) files = [files[0]]

    const { valid, errors } = validateImageFileList(files, currentCount + uploading.length, maxImages)
    if (!valid) {
      setValidationErrors(errors || [])
      return
    }
    setValidationErrors([])

    const newUploads = files.map((file) => ({ file, progress: 0, error: null }))
    setUploading((prev) => [...prev, ...newUploads])

    newUploads.forEach((_, index) => {
      const file = files[index]
      const uploadIndex = (uploading.length + index)
      uploadImageToCloudinary(file, (percent) => {
        setUploading((prev) => {
          const next = [...prev]
          const idx = uploadIndex
          if (next[idx]) next[idx] = { ...next[idx], progress: percent }
          return next
        })
      })
        .then(({ secure_url }) => {
          setUploading((prev) => prev.filter((u) => u.file !== file))
          const newItem = emptyItem({
            image_url: secure_url,
            is_cover: false, // el primero que llega lo marcaremos como portada si no hay ninguna
            order_index: 0,
          })
          // Usar forma funcional para no pisar otras subidas que terminen a la vez
          onChange((prev) => {
            const list = [...(prev || [])]
            if (!list.length) newItem.is_cover = true
            newItem.order_index = list.length
            return [...list, newItem]
          })
        })
        .catch((err) => {
          setUploading((prev) =>
            prev.map((u) => (u.file === file ? { ...u, progress: 0, error: err?.message || 'Error al subir' } : u))
          )
        })
    })
  }

  const removeImage = (index) => {
    const list = [...(value || [])]
    list.splice(index, 1)
    // Asegurar que al menos una sea portada si hay imágenes
    if (list.length && !list.some((i) => i.is_cover)) list[0].is_cover = true
    list.forEach((item, i) => { item.order_index = i })
    onChange(list)
  }

  const setCover = (index) => {
    const list = (value || []).map((item, i) => ({
      ...item,
      is_cover: i === index,
      order_index: i,
    }))
    onChange(list)
  }

  const list = value || []
  const hasCover = list.some((i) => i.is_cover)

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {validationErrors.length > 0 && (
        <ul className="mb-2 text-sm text-red-600 list-disc list-inside">
          {validationErrors.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}

      {/* Grid: imágenes ya guardadas + en subida */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
        {list.map((item, index) => (
          <div
            key={item.id || item.image_url || index}
            className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50 group"
          >
            <img
              src={getOptimizedImageUrl(item.image_url)}
              alt={`Preview ${index + 1}`}
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              {!disabled && (
                <>
                  {showCoverButton && (
                    <button
                      type="button"
                      onClick={() => setCover(index)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.is_cover ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
                      }`}
                    >
                      {item.is_cover ? 'Portada' : 'Usar como portada'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-2 py-1 rounded text-xs font-medium bg-red-600 text-white"
                  >
                    Quitar
                  </button>
                </>
              )}
            </div>
            {showCoverButton && item.is_cover && (
              <span className="absolute top-1 left-1 bg-gray-900 text-white text-xs px-2 py-0.5 rounded">
                Portada
              </span>
            )}
          </div>
        ))}

        {uploading.map((u, idx) => (
          <div
            key={`upload-${idx}-${u.file?.name}`}
            className="relative rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
          >
            <div className="w-full aspect-[4/3] flex items-center justify-center p-2">
              {u.error ? (
                <p className="text-sm text-red-600 text-center break-words px-1 hyphens-auto">{u.error}</p>
              ) : (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-700 h-2 rounded-full transition-all"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{u.progress}%</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate px-2 py-1">{u.file?.name}</p>
          </div>
        ))}
      </div>

      {!disabled && canAddMore && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            multiple={maxImages > 1}
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          <p className="text-xs text-gray-500 mt-1">
            {isPortada ? 'Una imagen, 5MB. Formatos: JPG, PNG, WEBP.' : `Máximo ${maxImages} imágenes, 5MB cada una. Formatos: JPG, PNG, WEBP.`}
          </p>
        </div>
      )}

      {currentCount >= maxImages && !uploading.length && !isPortada && (
        <p className="text-sm text-amber-600">Has llegado al máximo de {maxImages} imágenes.</p>
      )}
    </div>
  )
}
