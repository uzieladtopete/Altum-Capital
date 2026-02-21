import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { usePropiedades } from '../context/PropiedadesContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useContactModal } from '../context/ContactModalContext'
import { getPropiedadById } from '../services/propiedadesSupabase'
import ImagenPropiedad from '../components/ImagenPropiedad'
import MapaPreview from '../components/MapaPreview'

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function PropiedadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { list, loading: propiedadesLoading, updatePropiedad: updatePropiedadContext } = usePropiedades()
  const { role } = useAuth()
  const { addToast } = useToast()
  const { openContactModal } = useContactModal()
  const propiedadFromList = list.find((p) => p.id === id)
  const [propiedadFull, setPropiedadFull] = useState(null)
  const propiedad = propiedadFull ?? propiedadFromList
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const isAdmin = role === 'admin'

  // Cargar propiedad por ID para tener siempre datos completos (amenidades, recámaras, etc. desde detalles_prop)
  useEffect(() => {
    if (!id) return
    setPropiedadFull(null)
    let cancelled = false
    getPropiedadById(id).then((data) => {
      if (!cancelled && data) setPropiedadFull(data)
    })
    return () => { cancelled = true }
  }, [id])
  
  // Detectar si viene del inicio o de resultados
  // Si viene del inicio (desde ProjectCard), el state tendrá from: '/'
  // Si viene de resultados o del mapa, irá a /resultados
  const comesFromHome = location.state?.from === '/' || (!location.state?.from && document.referrer && new URL(document.referrer).pathname === '/')
  const backPath = comesFromHome ? '/' : '/resultados'

  // Imágenes: principal + galería (para el collage)
  const imagenes = propiedad?.imagen
    ? [propiedad.imagen, ...(propiedad.galeria || [])].filter(Boolean)
    : []
  const imagenesCollage = imagenes.length > 0 ? imagenes : []
  const imagenesParaGrid = imagenesCollage.length >= 5
    ? imagenesCollage.slice(0, 5)
    : imagenesCollage.length > 0
      ? [...imagenesCollage, ...Array(5 - imagenesCollage.length).fill(imagenesCollage[0])].slice(0, 5)
      : []

  useEffect(() => {
    // Scroll al top cuando se carga la página
    window.scrollTo({ top: 0, behavior: 'instant' })
    
    // Cleanup: resetear estado cuando se sale de la página
    return () => {
      setSelectedImageIndex(0)
    }
  }, [id])

  useEffect(() => {
    if (propiedad && imagenes.length > 0) {
      setSelectedImageIndex(0)
    }
  }, [propiedad, imagenes.length])

  // Descripción: usar la de Supabase si existe; solo generar automática si es null/undefined
  const descripcionGenerada = !propiedad ? '' : `Hermosa ${(propiedad.tipo || '').toLowerCase()} ubicada en ${propiedad.ciudad}${propiedad.zona ? `, ${propiedad.zona}` : ''}. Con ${propiedad.m2} m² de construcción, esta propiedad ofrece espacios amplios y modernos. ${propiedad.estado === 'Disponible' ? 'Disponible para venta.' : propiedad.estado === 'Vendido' ? 'Ya vendida.' : 'En preventa.'}`
  const descripcionBase = !propiedad ? '' : (propiedad.descripcion != null && propiedad.descripcion !== '' ? propiedad.descripcion : descripcionGenerada)
  const amenidadesFromProp = propiedad?.amenidades ?? {}
  const amenidadesGeneralInit = Array.isArray(amenidadesFromProp.general) ? amenidadesFromProp.general : []
  const amenidadesPoliticasInit = Array.isArray(amenidadesFromProp.politicas) ? amenidadesFromProp.politicas : []
  const amenidadesRecreacionInit = Array.isArray(amenidadesFromProp.recreacion) ? amenidadesFromProp.recreacion : []
  // Hooks de Casa Providencia (siempre declarados para no variar el número de hooks)
  const seccionesDefault = [
    { titulo: 'La Entrada', subtitulo: 'El Proyecto Perfecto Para Ti', descripcion: 'Al cruzar el umbral de Casa Providencia, te recibe un espacio diseñado para impresionar.', imagen: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80', lado: 'right' },
    { titulo: 'Baños de Lujo', subtitulo: 'La Comodidad Es Lo Esencial', descripcion: 'Espacios diseñados para el descanso y la relajación.', imagen: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=1200&q=80', lado: 'left' },
    { titulo: 'Habitaciones Principales', subtitulo: 'Tu Refugio Personal', descripcion: 'Amplios espacios que invitan al descanso.', imagen: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80', lado: 'right' },
    { titulo: 'Cocina Gourmet', subtitulo: 'Donde Nacen Los Momentos Especiales', descripcion: 'Una cocina completamente equipada con isla central.', imagen: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80', lado: 'left' },
    { titulo: 'Áreas Comunes', subtitulo: 'Espacios Para Compartir', descripcion: 'Amplias áreas de convivencia diseñadas para reuniones familiares.', imagen: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80', lado: 'right' },
    { titulo: 'Terraza y Exteriores', subtitulo: 'Vive El Exterior Como Nunca', descripcion: 'Espacios exteriores diseñados para disfrutar del clima perfecto de Guadalajara.', imagen: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80', lado: 'left' },
  ]
  const [isEditing, setIsEditing] = useState(false)
  const [heroData, setHeroData] = useState({
    titulo: propiedad?.titulo || '',
    subtitulo: 'El Proyecto Perfecto Para Ti',
    descripcion: 'Una experiencia de vida única en el corazón de Providencia.',
    imagen: propiedad?.imagen || '',
  })
  const [seccionesCasaProvidencia, setSeccionesCasaProvidencia] = useState(seccionesDefault)

  const STORAGE_KEY_DETAIL = `propiedad-detail-override-${id}`
  const [isEditingDetail, setIsEditingDetail] = useState(false)
  const [editOverride, setEditOverride] = useState({
    titulo: propiedad?.titulo ?? '',
    tituloSeccion: `${propiedad?.tipo ?? ''} en venta ${propiedad?.zona || propiedad?.ciudad || ''}`.trim(),
    imagen: propiedad?.imagen ?? '',
    galeria: (propiedad?.galeria || []).slice(),
    // Usar descripción de Supabase si existe; si no, string vacío (se generará automática si hace falta)
    descripcion: (propiedad?.descripcion != null && propiedad.descripcion !== '') ? propiedad.descripcion : '',
    amenidades: {
      general: amenidadesGeneralInit.slice(),
      politicas: amenidadesPoliticasInit.slice(),
      recreacion: amenidadesRecreacionInit.slice(),
    },
  })
  const didInitEditRef = useRef(false)

  useEffect(() => {
    if (propiedad) {
      setHeroData(prev => ({
        ...prev,
        titulo: propiedad.titulo || prev.titulo,
        imagen: propiedad.imagen || prev.imagen,
      }))
    }
  }, [propiedad])

  useEffect(() => {
    if (id === '1') {
      const savedHero = localStorage.getItem('casa-providencia-hero')
      const savedSecciones = localStorage.getItem('casa-providencia-secciones')
      if (savedHero) {
        try { setHeroData(JSON.parse(savedHero)) } catch (_) {}
      }
      if (savedSecciones) {
        try { setSeccionesCasaProvidencia(JSON.parse(savedSecciones)) } catch (_) {}
      }
    }
  }, [id])

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY_DETAIL)
    if (raw && propiedad) {
      try {
        const parsed = JSON.parse(raw)
        setEditOverride((prev) => ({
          // Título siempre desde el servidor para que coincida con la tarjeta/listado
          titulo: propiedad.titulo ?? parsed.titulo ?? prev.titulo,
          tituloSeccion: parsed.tituloSeccion ?? prev.tituloSeccion,
          imagen: parsed.imagen ?? prev.imagen,
          galeria: Array.isArray(parsed.galeria) ? parsed.galeria : prev.galeria,
          // Si Supabase tiene descripción, usarla; si no, usar la del localStorage
          descripcion: (propiedad.descripcion != null && propiedad.descripcion !== '') 
            ? propiedad.descripcion 
            : (parsed.descripcion ?? prev.descripcion),
          amenidades: {
            general: Array.isArray(parsed.amenidades?.general) ? parsed.amenidades.general : prev.amenidades.general,
            politicas: Array.isArray(parsed.amenidades?.politicas) ? parsed.amenidades.politicas : prev.amenidades.politicas,
            recreacion: Array.isArray(parsed.amenidades?.recreacion) ? parsed.amenidades.recreacion : prev.amenidades.recreacion,
          },
        }))
      } catch (_) {}
    }
  }, [id, propiedad?.id, propiedad?.descripcion, propiedad?.titulo, STORAGE_KEY_DETAIL])

  // Mantener titulo en sync con el servidor cuando cambia (p. ej. tras guardar), sin pisar si está editando
  useEffect(() => {
    if (!isEditingDetail && propiedad?.titulo != null) {
      setEditOverride((prev) => (prev.titulo !== propiedad.titulo ? { ...prev, titulo: propiedad.titulo } : prev))
    }
  }, [propiedad?.titulo, isEditingDetail])

  useEffect(() => {
    if (isEditingDetail) {
      if (!didInitEditRef.current) {
        // Al entrar en modo edición, usar descripción de Supabase si existe, sino la generada
        const descripcionParaEditar = (propiedad?.descripcion != null && propiedad.descripcion !== '') 
          ? propiedad.descripcion 
          : descripcionBase
        setEditOverride((prev) => ({ ...prev, descripcion: descripcionParaEditar }))
        didInitEditRef.current = true
      }
    } else {
      didInitEditRef.current = false
    }
  }, [isEditingDetail, propiedad?.descripcion, descripcionBase])

  // Mostrar loading mientras se cargan las propiedades
  if (propiedadesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando propiedad...</p>
        </div>
      </div>
    )
  }

  // Mostrar mensaje si no se encuentra la propiedad (solo después de que termine de cargar)
  if (!propiedadesLoading && !propiedad && id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
            Propiedad no encontrada
          </h1>
          <p className="text-gray-600 mb-4">La propiedad que buscas no existe.</p>
          <Link
            to="/resultados"
            className="inline-block px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    )
  }

  if (!propiedad) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
            Propiedad no encontrada
          </h1>
          <p className="text-gray-600 mb-4">La propiedad que buscas no existe.</p>
          <Link
            to="/resultados"
            className="inline-block px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </div>
    )
  }

  const coords = propiedad.lat != null && propiedad.lng != null
    ? { lat: propiedad.lat, lng: propiedad.lng }
    : null

  const descripcion = descripcionBase
  const isCasaProvidencia = propiedad?.id === '1'

  const handleSave = () => {
    localStorage.setItem('casa-providencia-hero', JSON.stringify(heroData))
    localStorage.setItem('casa-providencia-secciones', JSON.stringify(seccionesCasaProvidencia))
    setIsEditing(false)
    addToast({ type: 'success', message: 'Cambios guardados correctamente' })
  }

  const handleCancel = () => {
    // Recargar datos guardados
    const savedHero = localStorage.getItem('casa-providencia-hero')
    const savedSecciones = localStorage.getItem('casa-providencia-secciones')
    
    if (savedHero) {
      setHeroData(JSON.parse(savedHero))
    } else {
      setHeroData({
        titulo: propiedad.titulo,
        subtitulo: 'El Proyecto Perfecto Para Ti',
        descripcion: 'Una experiencia de vida única en el corazón de Providencia. Cada espacio ha sido diseñado pensando en tu comodidad, elegancia y bienestar. Descubre un hogar donde cada detalle cuenta.',
        imagen: propiedad.imagen,
      })
    }
    
    if (savedSecciones) {
      setSeccionesCasaProvidencia(JSON.parse(savedSecciones))
    } else {
      setSeccionesCasaProvidencia(seccionesDefault)
    }
    
    setIsEditing(false)
  }

  const updateSeccion = (index, field, value) => {
    setSeccionesCasaProvidencia((prev) =>
      prev.map((sec, i) => (i === index ? { ...sec, [field]: value } : sec))
    )
  }

  // Si es Casa Providencia, mostrar diseño especial
  if (isCasaProvidencia && propiedad) {
    return (
      <div className="min-h-screen bg-white">
        {/* Botones de edición (solo admin) */}
        {isAdmin && (
          <div className="fixed top-20 right-4 z-50 flex gap-2">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Contenido
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}

        {/* Hero Section con Descripción Épica */}
        <div className="relative w-full h-[70vh] min-h-[600px] bg-gray-900">
          {isEditing ? (
            <div className="absolute top-4 right-4 z-10">
              <label className="block text-white text-sm mb-2">URL de imagen:</label>
              <input
                type="text"
                value={heroData.imagen}
                onChange={(e) => setHeroData({ ...heroData, imagen: e.target.value })}
                className="w-64 px-3 py-2 rounded-lg text-sm bg-white/90 text-gray-900"
                placeholder="URL de la imagen"
              />
            </div>
          ) : null}
          <ImagenPropiedad
            src={heroData.imagen}
            alt={heroData.titulo}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={heroData.titulo}
                    onChange={(e) => setHeroData({ ...heroData, titulo: e.target.value })}
                    className="font-serif text-4xl md:text-6xl font-semibold text-white mb-6 bg-white/20 border-2 border-white/50 rounded-lg px-4 py-2 w-full text-center"
                    placeholder="Título principal"
                  />
                  <input
                    type="text"
                    value={heroData.subtitulo}
                    onChange={(e) => setHeroData({ ...heroData, subtitulo: e.target.value })}
                    className="font-serif text-xl md:text-2xl text-white/90 mb-4 bg-white/20 border-2 border-white/50 rounded-lg px-4 py-2 w-full text-center"
                    placeholder="Subtítulo"
                  />
                  <textarea
                    value={heroData.descripcion}
                    onChange={(e) => setHeroData({ ...heroData, descripcion: e.target.value })}
                    className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed bg-white/20 border-2 border-white/50 rounded-lg px-4 py-2 w-full"
                    rows="4"
                    placeholder="Descripción épica"
                  />
                </>
              ) : (
                <>
                  <h1 className="font-serif text-4xl md:text-6xl font-semibold text-white mb-6">
                    {heroData.titulo}
                  </h1>
                  <p className="font-serif text-xl md:text-2xl text-white/90 mb-4">
                    {heroData.subtitulo}
                  </p>
                  <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                    {heroData.descripcion}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* Botón volver */}
          <Link
            to={backPath}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-lg px-4 py-2 text-sm font-medium text-gray-900 shadow-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </Link>
        </div>

        {/* Información Principal */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 text-lg mb-6">
              <span className="font-semibold text-gray-900">{formatPrecio(propiedad.precio)}</span>
              <span className="text-gray-500">{propiedad.m2} m²</span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                {propiedad.estado}
              </span>
            </div>
            <p className="text-lg text-gray-600">
              {propiedad.ciudad}
              {propiedad.zona ? ` · ${propiedad.zona}` : ''}
            </p>
          </div>

          {/* Secciones Scrollables Alternadas */}
          <div className="space-y-24">
            {seccionesCasaProvidencia.map((seccion, index) => (
              <div
                key={index}
                className={`flex flex-col ${seccion.lado === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
              >
                {/* Imagen */}
                <div className="w-full lg:w-1/2">
                  {isEditing ? (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">URL de imagen:</label>
                      <input
                        type="text"
                        value={seccion.imagen}
                        onChange={(e) => updateSeccion(index, 'imagen', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="URL de la imagen"
                      />
                    </div>
                  ) : null}
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <ImagenPropiedad
                      src={seccion.imagen}
                      alt={seccion.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Texto */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  {isEditing ? (
                    <>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Título:</label>
                      <input
                        type="text"
                        value={seccion.titulo}
                        onChange={(e) => updateSeccion(index, 'titulo', e.target.value)}
                        className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-4 px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Título de la sección"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo:</label>
                      <input
                        type="text"
                        value={seccion.subtitulo}
                        onChange={(e) => updateSeccion(index, 'subtitulo', e.target.value)}
                        className="font-serif text-xl md:text-2xl text-gray-600 mb-6 italic px-3 py-2 border border-gray-300 rounded-lg"
                        placeholder="Subtítulo"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
                      <textarea
                        value={seccion.descripcion}
                        onChange={(e) => updateSeccion(index, 'descripcion', e.target.value)}
                        className="text-gray-700 text-lg leading-relaxed px-3 py-2 border border-gray-300 rounded-lg"
                        rows="4"
                        placeholder="Descripción de la sección"
                      />
                      <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Lado de imagen:</label>
                      <select
                        value={seccion.lado}
                        onChange={(e) => updateSeccion(index, 'lado', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="right">Derecha</option>
                        <option value="left">Izquierda</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <h2 className="font-serif text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
                        {seccion.titulo}
                      </h2>
                      <h3 className="font-serif text-xl md:text-2xl text-gray-600 mb-6 italic">
                        {seccion.subtitulo}
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {seccion.descripcion}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mapa */}
          {coords && (
            <div className="mt-24">
              <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-6 text-center">Ubicación</h2>
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg h-[500px]">
                <MapaPreview
                  center={coords}
                  markerPosition={coords}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Sidebar de Contacto */}
          <div className="mt-16 max-w-md mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-4 text-center">
                    ¿Te interesa esta propiedad?
                  </h3>
                  <div className="space-y-3 text-sm text-center">
                    <div>
                      <span className="text-gray-500">Precio:</span>
                      <p className="font-semibold text-gray-900">{formatPrecio(propiedad.precio)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Superficie:</span>
                      <p className="font-semibold text-gray-900">{propiedad.m2} m²</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={openContactModal}
                  className="w-full px-6 py-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-lg"
                >
                  Me interesa
                </button>
                <button
                  type="button"
                  onClick={openContactModal}
                  className="w-full px-6 py-4 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-lg"
                >
                  Contactar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Especificaciones: datos reales o ejemplos para mostrar debajo del precio (recámaras, baños, etc.)
  const recamaras = propiedad.recamaras ?? propiedad.recámaras ?? 2
  const banos = propiedad.banos ?? propiedad.baños ?? 1
  const estacionamientos = propiedad.estacionamientos ?? 1
  const anioConstruccion = propiedad.anio_construccion ?? propiedad.anioConstruccion ?? 2020
  const piso = propiedad.piso ?? 7
  const amenidades = propiedad.amenidades ?? {}
  const amenidadesGeneral = Array.isArray(amenidades.general) ? amenidades.general : []
  const amenidadesPoliticas = Array.isArray(amenidades.politicas) ? amenidades.politicas : []
  const amenidadesRecreacion = Array.isArray(amenidades.recreacion) ? amenidades.recreacion : []

  // Amenidades de ejemplo (cuando no hay datos), con iconos como en la referencia
  const amenidadesEjemploGeneral = [
    { label: 'Accesibilidad para adultos mayores', icon: 'accesibilidad' },
    { label: 'Portero', icon: 'portero' },
    { label: 'Cocina integral', icon: 'cocina' },
    { label: 'Seguridad 24 horas', icon: 'seguridad' },
    { label: 'Elevador', icon: 'elevador' },
  ]
  const amenidadesEjemploPoliticas = [
    { label: 'Mascotas permitidas', icon: 'mascotas' },
  ]
  const amenidadesEjemploRecreacion = [
    { label: 'Alberca', icon: 'alberca' },
    { label: 'Salón de usos múltiples', icon: 'salon' },
    { label: 'Área de juegos infantiles', icon: 'juegos' },
    { label: 'Gimnasio', icon: 'gimnasio' },
  ]
  const usarAmenidadesEjemplo = amenidadesGeneral.length === 0 && amenidadesPoliticas.length === 0 && amenidadesRecreacion.length === 0

  const saveDetailOverride = async () => {
    localStorage.setItem(STORAGE_KEY_DETAIL, JSON.stringify(editOverride))
    setIsEditingDetail(false)
    try {
      if (id && updatePropiedadContext) {
        await updatePropiedadContext(id, {
          titulo: (editOverride.titulo ?? propiedad?.titulo ?? '').trim() || propiedad?.titulo,
          descripcion: editOverride.descripcion ?? propiedad?.descripcion,
          imagen: editOverride.imagen ?? propiedad?.imagen,
          galeria: (editOverride.galeria?.length > 0 ? editOverride.galeria : propiedad?.galeria) ?? [],
        })
        const refreshed = await getPropiedadById(id)
        if (refreshed) setPropiedadFull(refreshed)
        addToast({ type: 'success', message: 'Base de datos actualizada correctamente.' })
      } else {
        addToast({ type: 'success', message: 'Cambios guardados (solo en esta vista).' })
      }
    } catch (e) {
      console.error('Error al guardar en la base de datos:', e)
      const msg = e?.message || String(e)
      addToast({ type: 'error', message: msg.includes('galeria') ? 'Falta la columna "galeria" en Propiedades. Ejecuta add-galeria-propiedades.sql en tu base de datos.' : `No se pudo guardar en la base de datos: ${msg.slice(0, 80)}. Los cambios se aplican solo en esta vista.` })
    }
  }

  const cancelDetailOverride = () => {
    const raw = localStorage.getItem(STORAGE_KEY_DETAIL)
    if (raw) {
      try {
        setEditOverride(JSON.parse(raw))
      } catch (_) {}
    }
    setIsEditingDetail(false)
  }

  // Datos mostrados: override desde localStorage (si hay) o desde propiedad
  const tituloMostrado = editOverride.titulo || propiedad.titulo
  const tituloSeccionMostrado = editOverride.tituloSeccion || `${propiedad.tipo} en venta ${propiedad.zona || propiedad.ciudad}`
  const imagenPrincipal = editOverride.imagen || propiedad.imagen
  const galeriaMostrada = editOverride.galeria.length > 0 ? editOverride.galeria : (propiedad.galeria || [])
  const imagenesParaMostrar = imagenPrincipal ? [imagenPrincipal, ...galeriaMostrada].filter(Boolean) : []
  const imagenesParaGridMostrado = imagenesParaMostrar.length >= 5
    ? imagenesParaMostrar.slice(0, 5)
    : imagenesParaMostrar.length > 0
      ? [...imagenesParaMostrar, ...Array(5 - imagenesParaMostrar.length).fill(imagenesParaMostrar[0])].slice(0, 5)
      : []
  // Prioridad: 1) propiedad.descripcion de Supabase, 2) editOverride (localStorage), 3) descripción generada
  const descripcionMostrada = (propiedad?.descripcion != null && propiedad.descripcion !== '') 
    ? propiedad.descripcion 
    : (editOverride.descripcion || descripcion)
  const amenidadesMostradas = {
    general: editOverride.amenidades.general.length > 0 ? editOverride.amenidades.general : amenidadesGeneral,
    politicas: editOverride.amenidades.politicas.length > 0 ? editOverride.amenidades.politicas : amenidadesPoliticas,
    recreacion: editOverride.amenidades.recreacion.length > 0 ? editOverride.amenidades.recreacion : amenidadesRecreacion,
  }
  const usarAmenidadesEditadas = editOverride.amenidades.general.length > 0 || editOverride.amenidades.politicas.length > 0 || editOverride.amenidades.recreacion.length > 0

  // Diseño estándar para otras propiedades: collage → precio/estado → descripción → especificaciones → amenidades → mapa
  return (
    <div className="min-h-screen bg-white">
      {/* Botón Volver ARRIBA (siempre visible) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      {/* Botones de edición para admin (solo en detalle estándar) */}
      {isAdmin && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 flex flex-wrap gap-2">
          {!isEditingDetail ? (
            <button
              type="button"
              onClick={() => setIsEditingDetail(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Editar contenido de la página
            </button>
          ) : (
            <>
              <button type="button" onClick={saveDetailOverride} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Guardar
              </button>
              <button type="button" onClick={cancelDetailOverride} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg shadow">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Cancelar
              </button>
              <p className="text-xs text-gray-500 self-center ml-2">Precio, estado, m² y ubicación se editan en Panel Admin.</p>
            </>
          )}
        </div>
      )}

      {/* Título (mismo que columna titulo en Supabase) y acciones (Español / Compartir) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {isEditingDetail ? (
            <input
              type="text"
              value={editOverride.titulo ?? ''}
              onChange={(e) => setEditOverride((o) => ({ ...o, titulo: e.target.value }))}
              className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 border border-gray-300 rounded-lg px-3 py-2 w-full max-w-xl"
              placeholder="Ej: Comercial en venta Centro"
            />
          ) : (
            <h1 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900">
              {tituloMostrado}
            </h1>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900" aria-label="Idioma">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
              Español
            </button>
            <button type="button" className="flex items-center gap-1.5 hover:text-gray-900" aria-label="Compartir">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Collage de imágenes: 1 grande + 4 en grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        {isEditingDetail && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL imagen principal</label>
            <input
              type="text"
              value={editOverride.imagen}
              onChange={(e) => setEditOverride((o) => ({ ...o, imagen: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="https://..."
            />
            <label className="block text-sm font-medium text-gray-700 mt-2">Galería (una URL por línea)</label>
            <textarea
              value={(editOverride.galeria || []).join('\n')}
              onChange={(e) => setEditOverride((o) => ({ ...o, galeria: e.target.value.split('\n').map((u) => u.trim()).filter(Boolean) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24"
              placeholder="https://...\nhttps://..."
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-xl overflow-hidden bg-gray-100">
          <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:min-h-[320px]">
            {imagenesParaGridMostrado[0] ? (
              <ImagenPropiedad
                src={imagenesParaGridMostrado[0]}
                alt={tituloMostrado}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">Sin imagen</div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square">
                {imagenesParaGridMostrado[i] ? (
                  <ImagenPropiedad
                    src={imagenesParaGridMostrado[i]}
                    alt={`${tituloMostrado} ${i}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>
        {imagenesParaMostrar.length > 5 && (
          <p className="mt-2 text-center text-sm text-gray-500">
            Ver todas ({imagenesParaMostrar.length}) fotos
          </p>
        )}
      </div>

      {/* Precio, estado y ubicación */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-100">
        <p className="text-sm text-gray-500 mb-1">
          ID: {propiedad.id}
        </p>
        <p className="text-2xl font-bold text-gray-900 mb-1">
          {formatPrecio(propiedad.precio)} MXN{' '}
          {propiedad.estado === 'En renta' ? 'en renta' : propiedad.estado === 'Vendido' ? 'vendido' : 'en venta'}
        </p>
        <p className="text-gray-600 mb-4">
          {propiedad.tipo} en {[propiedad.zona, propiedad.ciudad].filter(Boolean).join(', ')}
        </p>

        {/* Especificaciones con iconos (debajo del precio), estilo referencia */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 text-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11v2m0 5.5v2m0-5.5V19m0-5.5a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-5.5 0h2m-5.5 0H9" /></svg>
            </span>
            <span>{recamaras} recámara{recamaras !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
            </span>
            <span>{banos} baño{banos !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </span>
            <span>{estacionamientos} estacionamiento{estacionamientos !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </span>
            <span>{propiedad.m2} m² de construcción</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </span>
            <span>Año de construcción: {anioConstruccion}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 shrink-0" aria-hidden>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </span>
            <span>Piso: {piso}</span>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
        <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
        {isEditingDetail ? (
          <textarea
            value={editOverride.descripcion}
            onChange={(e) => setEditOverride((o) => ({ ...o, descripcion: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 leading-relaxed min-h-[120px]"
            placeholder="Descripción de la propiedad..."
          />
        ) : (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{descripcionMostrada}</p>
        )}
      </div>

      {/* Amenidades (arriba de Ubicación): General, Políticas, Recreación — con iconos o ejemplo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
        <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Amenidades</h2>
        <div className="space-y-6">
          {isEditingDetail ? (
            <>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">General (una por línea)</h3>
                <textarea
                  value={(editOverride.amenidades.general || []).map((x) => (typeof x === 'string' ? x : x.nombre || x)).join('\n')}
                  onChange={(e) => setEditOverride((o) => ({
                    ...o,
                    amenidades: { ...o.amenidades, general: e.target.value.split('\n').filter((s) => s.trim() !== '') },
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px]"
                  placeholder="Accesibilidad para adultos mayores&#10;Portero&#10;..."
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Políticas (una por línea)</h3>
                <textarea
                  value={(editOverride.amenidades.politicas || []).map((x) => (typeof x === 'string' ? x : x.nombre || x)).join('\n')}
                  onChange={(e) => setEditOverride((o) => ({
                    ...o,
                    amenidades: { ...o.amenidades, politicas: e.target.value.split('\n').filter((s) => s.trim() !== '') },
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[60px]"
                  placeholder="Mascotas permitidas"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Recreación (una por línea)</h3>
                <textarea
                  value={(editOverride.amenidades.recreacion || []).map((x) => (typeof x === 'string' ? x : x.nombre || x)).join('\n')}
                  onChange={(e) => setEditOverride((o) => ({
                    ...o,
                    amenidades: { ...o.amenidades, recreacion: e.target.value.split('\n').filter((s) => s.trim() !== '') },
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[80px]"
                  placeholder="Alberca&#10;Gimnasio&#10;..."
                />
              </div>
              </>
          ) : (
            <>
          {/* General */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">General</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {usarAmenidadesEditadas && amenidadesMostradas.general.length > 0
                ? amenidadesMostradas.general.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {typeof item === 'string' ? item : item.nombre || item}
                    </div>
                  ))
                : usarAmenidadesEjemplo
                ? amenidadesEjemploGeneral.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-gray-500 shrink-0 w-6 h-6 flex items-center justify-center">
                        {item.icon === 'accesibilidad' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11l-3 3m0 0l-3-3m3 3V8" /></svg>}
                        {item.icon === 'portero' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                        {item.icon === 'cocina' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>}
                        {item.icon === 'seguridad' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                        {item.icon === 'elevador' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))
                : amenidadesGeneral.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {typeof item === 'string' ? item : item.nombre || item}
                    </div>
                  ))}
            </div>
          </div>
          {/* Políticas */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Políticas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {usarAmenidadesEditadas && amenidadesMostradas.politicas.length > 0
                ? amenidadesMostradas.politicas.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {typeof item === 'string' ? item : item.nombre || item}
                    </div>
                  ))
                : usarAmenidadesEjemplo
                ? amenidadesEjemploPoliticas.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-gray-500 shrink-0 w-6 h-6 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C9.24 2 7 4.24 7 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm-5 5c-2.21 0-4 1.79-4 4v2h2v-2c0-1.1.9-2 2-2s2 .9 2 2v2h2v-2c0-2.21-1.79-4-4-4zm10 0c-2.21 0-4 1.79-4 4v2h2v-2c0-1.1.9-2 2-2s2 .9 2 2v2h2v-2c0-2.21-1.79-4-4-4z"/></svg>
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))
                : amenidadesPoliticas.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {typeof item === 'string' ? item : item.nombre || item}
                    </div>
                  ))}
            </div>
          </div>
          {/* Recreación */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Recreación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {usarAmenidadesEditadas && amenidadesMostradas.recreacion.length > 0
                ? amenidadesMostradas.recreacion.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {typeof item === 'string' ? item : item.nombre || item}
                    </div>
                  ))
                : usarAmenidadesEjemplo
                ? amenidadesEjemploRecreacion.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-gray-500 shrink-0 w-6 h-6 flex items-center justify-center">
                        {item.icon === 'alberca' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>}
                        {item.icon === 'salon' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>}
                        {item.icon === 'juegos' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        {item.icon === 'gimnasio' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))
                : amenidadesRecreacion.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700">
                      <span className="text-gray-400">•</span>
                      {typeof item === 'string' ? item : item.nombre || item}
                    </div>
                  ))}
            </div>
          </div>
            </>
          )}
        </div>
      </div>

      {/* Ubicación: dirección, coordenadas y mapa (solo lectura; para editar ubicación usar Panel Admin) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
        <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">Ubicación</h2>
        {propiedad.direccion && (
          <p className="text-gray-700 mb-2">{propiedad.direccion}</p>
        )}
        {coords ? (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Coordenadas: <span className="font-mono">{Number(propiedad.lat).toFixed(6)}, {Number(propiedad.lng).toFixed(6)}</span>
            </p>
            <div className="rounded-xl overflow-hidden border border-gray-200 h-[400px]">
              <MapaPreview
                center={coords}
                markerPosition={coords}
                className="w-full h-full"
              />
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center h-[280px] text-gray-500">
            No hay ubicación disponible para esta propiedad.
          </div>
        )}
      </div>

      {/* Botón volver (fijo o en cabecera) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      {/* Sidebar de contacto / Me interesa (abajo del contenido o sticky) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-w-md">
          <h3 className="font-serif text-lg font-semibold text-gray-900 mb-4">¿Te interesa esta propiedad?</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={openContactModal}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Me interesa
            </button>
            <button
              type="button"
              onClick={openContactModal}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Contactar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
