import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePropiedades } from '../../context/PropiedadesContext'
import { geocodeAddress } from '../../services/geocoding'
import MapaPreview from '../../components/MapaPreview'

const CIUDADES = [
  { value: 'Guadalajara', label: 'Guadalajara' },
  { value: 'Zapopan', label: 'Zapopan' },
]

const TIPOS = [
  { value: 'Residencial', label: 'Residencial' },
  { value: 'Comercial', label: 'Comercial' },
]

const ESTADOS = [
  { value: 'Disponible', label: 'Disponible' },
  { value: 'Vendido', label: 'Vendido' },
  { value: 'En preventa', label: 'En preventa' },
]

const initialForm = {
  titulo: '',
  ciudad: 'Guadalajara',
  tipo: 'Residencial',
  precio: '',
  m2: '',
  estado: 'Disponible',
  imagen: '',
  direccion: '',
}

const DEBOUNCE_MS = 800

export default function CrearPropiedadPage() {
  const navigate = useNavigate()
  const { addPropiedad } = usePropiedades()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [previewCoords, setPreviewCoords] = useState(null)
  const [geocodeError, setGeocodeError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [imagePreviewUrl])

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
    if (field === 'direccion') setGeocodeError(false)
  }, [])

  useEffect(() => {
    const dir = form.direccion.trim()
    if (!dir) {
      setPreviewCoords(null)
      setGeocodeError(false)
      return
    }
    const t = setTimeout(() => {
      geocodeAddress(dir).then((coords) => {
        if (coords) {
          setPreviewCoords(coords)
          setGeocodeError(false)
        } else {
          setPreviewCoords(null)
          setGeocodeError(true)
        }
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [form.direccion])

  const resetForm = useCallback(() => {
    setForm(initialForm)
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return ''
    })
    setPreviewCoords(null)
    setGeocodeError(false)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const titulo = form.titulo.trim()
    const precio = Number(form.precio)
    const m2 = Number(form.m2)
    const direccion = form.direccion.trim()

    if (!titulo) {
      setError('El título es obligatorio.')
      return
    }
    if (Number.isNaN(precio) || precio < 0) {
      setError('Precio debe ser un número válido.')
      return
    }
    if (Number.isNaN(m2) || m2 <= 0) {
      setError('Los m² deben ser un número mayor a 0.')
      return
    }
    if (!direccion) {
      setError('La dirección es obligatoria.')
      return
    }
    const imagenUrl = imagePreviewUrl || form.imagen?.trim()
    if (!imagenUrl) {
      setError('Sube una imagen.')
      return
    }

    setIsSubmitting(true)
    setError('')
    const coords = await geocodeAddress(direccion)
    setIsSubmitting(false)
    if (!coords) {
      setError('No se pudo encontrar la dirección. Verifica e intenta de nuevo.')
      return
    }

    addPropiedad({
      titulo,
      ciudad: form.ciudad,
      zona: '',
      tipo: form.tipo,
      precio,
      m2,
      lat: coords.lat,
      lng: coords.lng,
      estado: form.estado,
      imagen: imagenUrl,
      direccion,
    })
    setShowSuccess(true)
    resetForm()
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
        Crear propiedad
      </h1>

      {showSuccess && (
        <div
          className="mb-6 p-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
          role="status"
        >
          Propiedad creada correctamente
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        {error && (
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            id="titulo"
            type="text"
            value={form.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
            required
          />
        </div>
        <div>
          <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <select
            id="ciudad"
            value={form.ciudad}
            onChange={(e) => handleChange('ciudad', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
          >
            {CIUDADES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="tipo"
            value={form.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
          >
            {TIPOS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              id="precio"
              type="number"
              min="0"
              value={form.precio}
              onChange={(e) => handleChange('precio', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="m2" className="block text-sm font-medium text-gray-700 mb-1">
              m²
            </label>
            <input
              id="m2"
              type="number"
              min="1"
              value={form.m2}
              onChange={(e) => handleChange('m2', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            value={form.estado}
            onChange={(e) => handleChange('estado', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
          >
            {ESTADOS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
            Dirección completa
          </label>
          <input
            id="direccion"
            type="text"
            value={form.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Av. Naciones Unidas 6700, Zapopan, Jalisco"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
          />
          <div className="mt-2">
            <MapaPreview
              center={previewCoords ?? undefined}
              markerPosition={previewCoords ?? undefined}
            />
          </div>
          {geocodeError && form.direccion.trim() && (
            <p className="mt-2 text-sm text-amber-700">Dirección no encontrada</p>
          )}
        </div>
        <div>
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen (subir desde dispositivo)
          </label>
          <input
            ref={fileInputRef}
            id="imagen"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
              if (file) {
                const url = URL.createObjectURL(file)
                setImagePreviewUrl(url)
                setForm((prev) => ({ ...prev, imagen: url }))
              } else {
                setImagePreviewUrl('')
                setForm((prev) => ({ ...prev, imagen: '' }))
              }
              setError('')
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {imagePreviewUrl && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 inline-block max-w-xs">
              <p className="text-xs text-gray-500 px-2 py-1 bg-gray-50">Vista previa</p>
              <img
                src={imagePreviewUrl}
                alt="Vista previa"
                className="w-full h-40 object-cover"
              />
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Se guarda como URL temporal. En el futuro se podrá conectar a Cloudinary o S3.
          </p>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Crear propiedad'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="px-6 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
