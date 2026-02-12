import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { usePropiedades } from '../../context/PropiedadesContext'
import { useToast } from '../../context/ToastContext'
import { geocodeAddress, DEFAULT_CENTER } from '../../services/geocoding'
import MapaPreview from '../../components/MapaPreview'
import InputDireccion from '../../components/InputDireccion'

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

const DEBOUNCE_MS = 800

/**
 * Convierte coordenadas DMS (grados/minutos/segundos) a decimal
 * Formato esperado: "20°41'31"N 103°20'36"W" o variaciones
 */
function parseDMSToDecimal(dmsString) {
  const trimmed = dmsString.trim()
  if (!trimmed) return null

  const dmsPattern = /(\d+)[°\s]+(\d+)['\s]+(\d+)["]*\s*([NSEW])/gi
  const matches = [...trimmed.matchAll(dmsPattern)]

  if (matches.length < 2) return null

  const latMatch = matches[0]
  const lngMatch = matches[1]

  const parseDMS = (degrees, minutes, seconds, direction) => {
    const deg = Number(degrees)
    const min = Number(minutes)
    const sec = Number(seconds)
    if (Number.isNaN(deg) || Number.isNaN(min) || Number.isNaN(sec)) return null

    let decimal = deg + min / 60 + sec / 3600
    if (direction.toUpperCase() === 'S' || direction.toUpperCase() === 'W') {
      decimal = -decimal
    }
    return decimal
  }

  const lat = parseDMS(latMatch[1], latMatch[2], latMatch[3], latMatch[4])
  const lng = parseDMS(lngMatch[1], lngMatch[2], lngMatch[3], lngMatch[4])

  if (lat == null || lng == null) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

export default function EditarPropiedadPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { list, updatePropiedad } = usePropiedades()
  const { addToast } = useToast()
  const fileInputRef = useRef(null)
  const prop = list.find((p) => p.id === id)

  const [form, setForm] = useState({
    titulo: '',
    ciudad: 'Guadalajara',
    tipo: 'Residencial',
    precio: '',
    m2: '',
    estado: 'Disponible',
    direccion: '',
    imagen: '',
    lat: '',
    lng: '',
  })
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [previewCoords, setPreviewCoords] = useState(null)
  const [geocodeError, setGeocodeError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputMode, setInputMode] = useState('direccion')
  const [coordenadasDMS, setCoordenadasDMS] = useState('')

  useEffect(() => {
    if (prop) {
      setForm({
        titulo: prop.titulo ?? '',
        ciudad: prop.ciudad ?? 'Guadalajara',
        tipo: prop.tipo ?? 'Residencial',
        precio: prop.precio != null ? String(prop.precio) : '',
        m2: prop.m2 != null ? String(prop.m2) : '',
        estado: prop.estado ?? 'Disponible',
        direccion: prop.direccion ?? '',
        imagen: prop.imagen ?? '',
        lat: prop.lat != null ? prop.lat : '',
        lng: prop.lng != null ? prop.lng : '',
      })
      if (prop.lat != null && prop.lng != null) {
        setPreviewCoords({ lat: prop.lat, lng: prop.lng })
      }
      // Si tiene coordenadas pero no dirección, mostrar en modo coordenadas
      if ((prop.lat != null || prop.lng != null) && !prop.direccion) {
        setInputMode('coordenadas')
      } else {
        setInputMode('direccion')
      }
    }
  }, [prop])

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [imagePreviewUrl])

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'direccion') setGeocodeError(false)
  }, [])

  useEffect(() => {
    if (inputMode !== 'direccion') return
    const dir = form.direccion.trim()
    if (!dir) {
      setGeocodeError(false)
      return
    }
    const t = setTimeout(() => {
      geocodeAddress(dir).then((coords) => {
        if (coords) {
          setPreviewCoords(coords)
          setForm((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }))
          setGeocodeError(false)
        } else {
          setGeocodeError(true)
        }
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [form.direccion, inputMode])

  useEffect(() => {
    if (inputMode !== 'coordenadas') return
    const dms = coordenadasDMS.trim()
    if (!dms) {
      setGeocodeError(false)
      return
    }
    const coords = parseDMSToDecimal(dms)
    if (coords) {
      setPreviewCoords(coords)
      setForm((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }))
      setGeocodeError(false)
    } else {
      setGeocodeError(true)
    }
  }, [coordenadasDMS, inputMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const titulo = form.titulo.trim()
    const precio = Number(form.precio)
    const m2 = Number(form.m2)
    const direccion = form.direccion.trim()

    if (!titulo) {
      addToast({ type: 'error', message: 'El título es obligatorio.' })
      return
    }
    if (Number.isNaN(precio) || precio < 0) {
      addToast({ type: 'error', message: 'Precio debe ser un número válido.' })
      return
    }
    if (Number.isNaN(m2) || m2 <= 0) {
      addToast({ type: 'error', message: 'Los m² deben ser un número mayor a 0.' })
      return
    }

    const imagenUrl = imagePreviewUrl || form.imagen?.trim() || ''
    if (!imagenUrl) {
      addToast({ type: 'error', message: 'La imagen es obligatoria.' })
      return
    }

    const hasManualCoords =
      typeof form.lat === 'number' && typeof form.lng === 'number' && !Number.isNaN(form.lat) && !Number.isNaN(form.lng)
    let coords = hasManualCoords ? { lat: form.lat, lng: form.lng } : null
    if (!coords && direccion) {
      setIsSubmitting(true)
      coords = await geocodeAddress(direccion)
      setIsSubmitting(false)
      if (!coords) {
        addToast({ type: 'error', message: 'No se pudo encontrar la dirección. Verifica e intenta de nuevo.' })
        return
      }
    }
    if (!coords) coords = DEFAULT_CENTER

    updatePropiedad(id, {
      titulo,
      ciudad: form.ciudad,
      tipo: form.tipo,
      precio,
      m2,
      estado: form.estado,
      direccion,
      imagen: imagenUrl,
      lat: coords.lat,
      lng: coords.lng,
    })
    addToast({ type: 'success', message: 'Propiedad actualizada correctamente' })
    navigate('/admin')
  }

  const effectiveCoords =
    typeof form.lat === 'number' && typeof form.lng === 'number' && !Number.isNaN(form.lat) && !Number.isNaN(form.lng)
      ? { lat: form.lat, lng: form.lng }
      : previewCoords

  if (!prop) {
    return (
      <div>
        <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Editar propiedad</h1>
        <p className="text-gray-600 mb-4">No se encontró la propiedad.</p>
        <Link to="/admin" className="text-gray-600 hover:text-gray-900 underline">
          Volver al panel
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Editar propiedad</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
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
              <option key={value} value={value}>
                {label}
              </option>
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
              <option key={value} value={value}>
                {label}
              </option>
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
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicación
          </label>
          <div className="mb-2">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                type="button"
                onClick={() => {
                  setInputMode('direccion')
                  setCoordenadasDMS('')
                  setGeocodeError(false)
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                  inputMode === 'direccion'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dirección
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode('coordenadas')
                  setForm((prev) => ({ ...prev, direccion: '' }))
                  setGeocodeError(false)
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
                  inputMode === 'coordenadas'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Coordenadas
              </button>
            </div>
          </div>
          {inputMode === 'direccion' ? (
            <>
              <InputDireccion
                id="direccion"
                value={form.direccion}
                onChange={(val) => handleChange('direccion', val)}
                onCoordsSelect={({ lat, lng }) => {
                  setPreviewCoords({ lat, lng })
                  setForm((prev) => ({ ...prev, lat, lng }))
                }}
                placeholder="Escribe tu dirección para buscar en el mapa..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              />
              {geocodeError && form.direccion.trim() && (
                <p className="mt-2 text-sm text-amber-700">Dirección no encontrada</p>
              )}
            </>
          ) : (
            <>
              <input
                type="text"
                value={coordenadasDMS}
                onChange={(e) => setCoordenadasDMS(e.target.value)}
                placeholder={'Ej: 20°41\'31"N 103°20\'36"W'}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 font-mono text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Formato: grados°minutos&apos;segundos&quot; dirección (ej: 20°41&apos;31&quot;N 103°20&apos;36&quot;W)
              </p>
              {geocodeError && coordenadasDMS.trim() && (
                <p className="mt-2 text-sm text-amber-700">Formato de coordenadas inválido</p>
              )}
            </>
          )}
          <div className="mt-2">
            <MapaPreview
              center={effectiveCoords ?? undefined}
              markerPosition={effectiveCoords ?? undefined}
              onMarkerMove={(lat, lng) => setForm((prev) => ({ ...prev, lat, lng }))}
            />
          </div>
        </div>
        <div>
          <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
            Imagen
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
                setForm((prev) => ({ ...prev, imagen: prop.imagen ?? '' }))
              }
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
          />
          {(imagePreviewUrl || form.imagen) && (
            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 inline-block max-w-xs">
              <p className="text-xs text-gray-500 px-2 py-1 bg-gray-50">Vista previa</p>
              <img
                src={imagePreviewUrl || form.imagen}
                alt="Vista previa"
                className="w-full h-40 object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
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
