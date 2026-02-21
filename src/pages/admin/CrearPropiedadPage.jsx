import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePropiedades } from '../../context/PropiedadesContext'
import { useToast } from '../../context/ToastContext'
import { geocodeAddress, DEFAULT_CENTER } from '../../services/geocoding'
import MapaPreview from '../../components/MapaPreview'
import InputDireccion from '../../components/InputDireccion'
import { AMENIDADES_OPCIONES } from '../../constants/amenidades'

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
  lat: '',
  lng: '',
  descripcion: '',
  recamaras: '',
  banos: '',
  estacionamientos: '',
  anio_construccion: '',
  piso: '',
  galeria: '', // URLs una por línea
  amenidadesGeneral: [], // array de labels seleccionados
  amenidadesPoliticas: [],
  amenidadesRecreacion: [],
}

const DEBOUNCE_MS = 800

/**
 * Convierte coordenadas DMS (grados/minutos/segundos) a decimal
 * Formato esperado: "20°41'31"N 103°20'36"W" o variaciones
 */
function parseDMSToDecimal(dmsString) {
  const trimmed = dmsString.trim()
  if (!trimmed) return null

  // Patrón para latitud: grados°minutos'segundos" dirección
  // Ejemplos: 20°41'31"N, 20°41'31" N, 20° 41' 31" N
  const dmsPattern = /(\d+)[°\s]+(\d+)['\s]+(\d+)["]*\s*([NSEW])/gi
  const matches = [...trimmed.matchAll(dmsPattern)]

  if (matches.length < 2) return null

  // Primer match es latitud, segundo es longitud
  const latMatch = matches[0]
  const lngMatch = matches[1]

  const parseDMS = (degrees, minutes, seconds, direction) => {
    const deg = Number(degrees)
    const min = Number(minutes)
    const sec = Number(seconds)
    if (Number.isNaN(deg) || Number.isNaN(min) || Number.isNaN(sec)) return null

    let decimal = deg + min / 60 + sec / 3600
    // Sur y Oeste son negativos
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

export default function CrearPropiedadPage() {
  const navigate = useNavigate()
  const { addPropiedad } = usePropiedades()
  const { addToast } = useToast()
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')
  const [previewCoords, setPreviewCoords] = useState(null)
  const [geocodeError, setGeocodeError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inputMode, setInputMode] = useState('direccion') // 'direccion' o 'coordenadas'
  const [coordenadasDMS, setCoordenadasDMS] = useState('')

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
    }
  }, [imagePreviewUrl])

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (field === 'direccion') setGeocodeError(false)
  }, [])

  // Geocode cuando se escribe dirección (solo si el modo es dirección)
  useEffect(() => {
    if (inputMode !== 'direccion') return
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
          setForm((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }))
          setGeocodeError(false)
        } else {
          setPreviewCoords(null)
          setGeocodeError(true)
        }
      })
    }, DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [form.direccion, inputMode])

  // Convertir coordenadas DMS cuando se escriben (solo si el modo es coordenadas)
  useEffect(() => {
    if (inputMode !== 'coordenadas') return
    const dms = coordenadasDMS.trim()
    if (!dms) {
      setPreviewCoords(null)
      setGeocodeError(false)
      return
    }
    const coords = parseDMSToDecimal(dms)
    if (coords) {
      setPreviewCoords(coords)
      setForm((prev) => ({ ...prev, lat: coords.lat, lng: coords.lng }))
      setGeocodeError(false)
    } else {
      setPreviewCoords(null)
      setGeocodeError(true)
    }
  }, [coordenadasDMS, inputMode])

  const resetForm = useCallback(() => {
    setForm(initialForm)
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return ''
    })
    setPreviewCoords(null)
    setGeocodeError(false)
    setInputMode('direccion')
    setCoordenadasDMS('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

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
    const imagenUrl = imagePreviewUrl || form.imagen?.trim()
    if (!imagenUrl) {
      addToast({ type: 'error', message: 'Sube una imagen.' })
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

    // Validar que las coordenadas estén dentro de México
    // México aproximadamente: lat 14.5-32.7, lng -118.4 a -86.8
    const MEXICO_BOUNDS = {
      minLat: 14.5,
      maxLat: 32.7,
      minLng: -118.4,
      maxLng: -86.8,
    }
    
    if (
      coords.lat < MEXICO_BOUNDS.minLat ||
      coords.lat > MEXICO_BOUNDS.maxLat ||
      coords.lng < MEXICO_BOUNDS.minLng ||
      coords.lng > MEXICO_BOUNDS.maxLng
    ) {
      addToast({
        type: 'error',
        message: `⚠️ Las coordenadas (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}) están fuera de México. Por favor verifica la ubicación.`,
      })
      return
    }

    const recamaras = form.recamaras.trim() ? Number(form.recamaras) : null
    const banos = form.banos.trim() ? Number(form.banos) : null
    const estacionamientos = form.estacionamientos.trim() ? Number(form.estacionamientos) : null
    const anio_construccion = form.anio_construccion.trim() ? Number(form.anio_construccion) : null
    const piso = form.piso.trim() ? Number(form.piso) : null
    const galeria = form.galeria.trim()
      ? form.galeria.split('\n').map((u) => u.trim()).filter(Boolean)
      : []
    const amenidades = {
      general: Array.isArray(form.amenidadesGeneral) ? form.amenidadesGeneral : [],
      politicas: Array.isArray(form.amenidadesPoliticas) ? form.amenidadesPoliticas : [],
      recreacion: Array.isArray(form.amenidadesRecreacion) ? form.amenidadesRecreacion : [],
    }

    try {
      setIsSubmitting(true)
      await addPropiedad({
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
        descripcion: form.descripcion.trim() || null,
        recamaras: Number.isNaN(recamaras) ? null : recamaras,
        banos: Number.isNaN(banos) ? null : banos,
        estacionamientos: Number.isNaN(estacionamientos) ? null : estacionamientos,
        anio_construccion: Number.isNaN(anio_construccion) ? null : anio_construccion,
        piso: Number.isNaN(piso) ? null : piso,
        galeria: galeria.length > 0 ? galeria : null,
        amenidades: (amenidades.general.length || amenidades.politicas.length || amenidades.recreacion.length) ? amenidades : null,
      })
      addToast({ type: 'success', message: 'Propiedad creada correctamente' })
      resetForm()
    } catch (err) {
      console.error(err)
      addToast({ type: 'error', message: err?.message || 'No se pudo crear. Revisa la consola y que Supabase tenga las columnas necesarias.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const effectiveCoords =
    typeof form.lat === 'number' && typeof form.lng === 'number' && !Number.isNaN(form.lat) && !Number.isNaN(form.lng)
      ? { lat: form.lat, lng: form.lng }
      : previewCoords

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-6">
        Crear propiedad
      </h1>

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
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            rows={4}
            value={form.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
            placeholder="Texto descriptivo de la propiedad..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="recamaras" className="block text-sm font-medium text-gray-700 mb-1">Recámaras</label>
            <input
              id="recamaras"
              type="number"
              min="0"
              value={form.recamaras}
              onChange={(e) => handleChange('recamaras', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              placeholder="—"
            />
          </div>
          <div>
            <label htmlFor="banos" className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
            <input
              id="banos"
              type="number"
              min="0"
              value={form.banos}
              onChange={(e) => handleChange('banos', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              placeholder="—"
            />
          </div>
          <div>
            <label htmlFor="estacionamientos" className="block text-sm font-medium text-gray-700 mb-1">Estacionamientos</label>
            <input
              id="estacionamientos"
              type="number"
              min="0"
              value={form.estacionamientos}
              onChange={(e) => handleChange('estacionamientos', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              placeholder="—"
            />
          </div>
          <div>
            <label htmlFor="anio_construccion" className="block text-sm font-medium text-gray-700 mb-1">Año</label>
            <input
              id="anio_construccion"
              type="number"
              min="1900"
              max="2100"
              value={form.anio_construccion}
              onChange={(e) => handleChange('anio_construccion', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              placeholder="—"
            />
          </div>
          <div>
            <label htmlFor="piso" className="block text-sm font-medium text-gray-700 mb-1">Piso</label>
            <input
              id="piso"
              type="number"
              min="0"
              value={form.piso}
              onChange={(e) => handleChange('piso', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900"
              placeholder="—"
            />
          </div>
        </div>
        <div>
          <label htmlFor="galeria" className="block text-sm font-medium text-gray-700 mb-1">
            Galería (URLs de imágenes, una por línea)
          </label>
          <textarea
            id="galeria"
            rows={3}
            value={form.galeria}
            onChange={(e) => handleChange('galeria', e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 font-mono text-sm"
            placeholder="https://ejemplo.com/img1.jpg&#10;https://ejemplo.com/img2.jpg"
          />
        </div>
        <div>
          <p className="block text-xs font-medium text-gray-600 mb-2">Amenidades (clic en cuadro para añadir; pasa el mouse en la barra y usa × para quitar)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General */}
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 min-w-0">
              <p className="text-xs font-medium text-gray-800 mb-2">General</p>
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 border border-gray-200 rounded-lg bg-white mb-3">
                {(form.amenidadesGeneral || []).map((label) => (
                  <span
                    key={label}
                    className="group inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs text-gray-800"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => {
                        const next = (form.amenidadesGeneral || []).filter((x) => x !== label)
                        handleChange('amenidadesGeneral', next)
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-0.5 text-gray-500 hover:text-red-600 transition-opacity"
                      aria-label="Quitar"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {AMENIDADES_OPCIONES.general.map((label) => {
                  const selected = (form.amenidadesGeneral || []).includes(label)
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const arr = form.amenidadesGeneral || []
                        const next = selected ? arr.filter((x) => x !== label) : [...arr, label]
                        handleChange('amenidadesGeneral', next)
                      }}
                      className={`w-full px-3 py-2 text-xs text-left rounded-lg border transition-colors ${
                        selected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Políticas */}
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 min-w-0">
              <p className="text-xs font-medium text-gray-800 mb-2">Políticas</p>
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 border border-gray-200 rounded-lg bg-white mb-3">
                {(form.amenidadesPoliticas || []).map((label) => (
                  <span
                    key={label}
                    className="group inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs text-gray-800"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => {
                        const next = (form.amenidadesPoliticas || []).filter((x) => x !== label)
                        handleChange('amenidadesPoliticas', next)
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-0.5 text-gray-500 hover:text-red-600 transition-opacity"
                      aria-label="Quitar"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {AMENIDADES_OPCIONES.politicas.map((label) => {
                  const selected = (form.amenidadesPoliticas || []).includes(label)
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const arr = form.amenidadesPoliticas || []
                        const next = selected ? arr.filter((x) => x !== label) : [...arr, label]
                        handleChange('amenidadesPoliticas', next)
                      }}
                      className={`w-full px-3 py-2 text-xs text-left rounded-lg border transition-colors ${
                        selected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
            {/* Recreación */}
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/50 min-w-0">
              <p className="text-xs font-medium text-gray-800 mb-2">Recreación</p>
              <div className="flex flex-wrap gap-1.5 min-h-[40px] p-2 border border-gray-200 rounded-lg bg-white mb-3">
                {(form.amenidadesRecreacion || []).map((label) => (
                  <span
                    key={label}
                    className="group inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 border border-gray-300 rounded-md text-xs text-gray-800"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() => {
                        const next = (form.amenidadesRecreacion || []).filter((x) => x !== label)
                        handleChange('amenidadesRecreacion', next)
                      }}
                      className="opacity-0 group-hover:opacity-100 ml-0.5 text-gray-500 hover:text-red-600 transition-opacity"
                      aria-label="Quitar"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {AMENIDADES_OPCIONES.recreacion.map((label) => {
                  const selected = (form.amenidadesRecreacion || []).includes(label)
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const arr = form.amenidadesRecreacion || []
                        const next = selected ? arr.filter((x) => x !== label) : [...arr, label]
                        handleChange('amenidadesRecreacion', next)
                      }}
                      className={`w-full px-3 py-2 text-xs text-left rounded-lg border transition-colors ${
                        selected
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <div id="seccion-ubicacion" className="space-y-0 border-t-2 border-gray-200 pt-6 mt-6">
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
          <div id="mapa-de-ubicacion" className="mt-4 pt-4 border-t-2 border-gray-300">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Mapa de ubicación</h3>
            <p className="text-sm text-gray-600 mb-2">
              Haz clic en el mapa para colocar el puntero o arrástralo para ajustar. Las coordenadas se guardan al crear la propiedad.
            </p>
            <div className="mt-2 h-[400px] min-h-[400px] w-full rounded-lg overflow-hidden border-2 border-gray-400 bg-gray-100">
              <MapaPreview
              center={effectiveCoords ?? undefined}
              markerPosition={effectiveCoords ?? undefined}
              onMarkerMove={(lat, lng) => {
                const MEXICO_BOUNDS = { minLat: 14.5, maxLat: 32.7, minLng: -118.4, maxLng: -86.8 }
                if (lat < MEXICO_BOUNDS.minLat || lat > MEXICO_BOUNDS.maxLat || lng < MEXICO_BOUNDS.minLng || lng > MEXICO_BOUNDS.maxLng) {
                  addToast({ type: 'warning', message: `⚠️ Las coordenadas están fuera de México.` })
                }
                setForm((prev) => ({ ...prev, lat, lng }))
                setPreviewCoords({ lat, lng })
              }}
              onMapClick={(lat, lng) => {
                setForm((prev) => ({ ...prev, lat, lng }))
                setPreviewCoords({ lat, lng })
              }}
            />
            </div>
            {effectiveCoords && (
              <p className="mt-2 text-xs text-gray-500">
                Coordenadas: {effectiveCoords.lat.toFixed(6)}, {effectiveCoords.lng.toFixed(6)}
              </p>
            )}
            {effectiveCoords && (
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, lat: '', lng: '' }))
                  setPreviewCoords(null)
                }}
                className="mt-2 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Quitar puntero
              </button>
            )}
          </div>
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
