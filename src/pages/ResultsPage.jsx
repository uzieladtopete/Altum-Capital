import { useMemo, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import Filtro from '../components/Filtro'
import Mapa from '../components/Mapa'
import ListaPropiedades from '../components/ListaPropiedades'
import { usePropiedades } from '../context/PropiedadesContext'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const { getFiltered, list } = usePropiedades()
  const [selectedId, setSelectedId] = useState(null)
  const [propiedades, setPropiedades] = useState([])
  const [loading, setLoading] = useState(true)
  const mapContainerRef = useRef(null)

  const filters = useMemo(() => ({
    ciudad: searchParams.get('ciudad') ?? '',
    tipo: searchParams.get('tipo') ?? '',
    minPrecio: searchParams.get('minPrecio') ?? '',
    maxPrecio: searchParams.get('maxPrecio') ?? '',
    minM2: searchParams.get('minM2') ?? '',
    maxM2: searchParams.get('maxM2') ?? '',
    operacion: searchParams.get('operacion') ?? '',
    tipoInmueble: searchParams.get('tipoInmueble') ?? '',
    ubicacion: searchParams.get('ubicacion') ?? '',
    precio: searchParams.get('precio') ?? '',
    tamano: searchParams.get('tamano') ?? '',
    cuartos: searchParams.get('cuartos') ?? '',
    banos: searchParams.get('banos') ?? '',
    estacionamientos: searchParams.get('estacionamientos') ?? '',
  }), [searchParams])

  // Cargar propiedades filtradas cuando cambian los filtros
  useEffect(() => {
    let cancelled = false

    const filterListClientSide = (items, f) => {
      if (!Array.isArray(items)) return []
      return items.filter((p) => {
        if (f.ciudad && (p.ciudad || '') !== f.ciudad) return false
        if (f.tipo && (p.tipo || '') !== f.tipo) return false
        if (f.operacion && (p.tipo || '') !== f.operacion) return false
        if (f.tipoInmueble && (p.tipo_inmueble || '') !== f.tipoInmueble) return false
        const precio = Number(p.precio)
        if (f.minPrecio && !Number.isNaN(precio) && precio < Number(f.minPrecio)) return false
        if (f.maxPrecio && !Number.isNaN(precio) && precio > Number(f.maxPrecio)) return false
        const m2 = Number(p.m2)
        if (f.minM2 && !Number.isNaN(m2) && m2 < Number(f.minM2)) return false
        if (f.maxM2 && !Number.isNaN(m2) && m2 > Number(f.maxM2)) return false
        return true
      })
    }

    const loadPropiedades = async () => {
      setLoading(true)
      try {
        const filtered = await getFiltered(filters)
        if (!cancelled) {
          // Si Supabase devuelve [], significa que no hay resultados para estos filtros.
          // No debemos volver a filtrar en cliente con filtros "viejos", porque eso hace que aparezca todo.
          const next = Array.isArray(filtered) ? filtered : []
          setPropiedades(next)
        }
      } catch (error) {
        console.error('Error loading propiedades:', error)
        if (!cancelled) {
          setPropiedades(filterListClientSide(list, filters))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPropiedades()

    return () => {
      cancelled = true
    }
  }, [getFiltered, filters, list])

  return (
    <div className="min-h-screen bg-gray-50">
      <Filtro />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16 lg:pb-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
          Resultados
        </h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando propiedades...</p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              {propiedades.length} {propiedades.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
            </p>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:h-[calc(100vh-16rem)] min-h-0 lg:min-h-[400px]">
              <div
                ref={mapContainerRef}
                className="lg:w-[70%] h-[260px] sm:h-[280px] lg:h-full flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm"
              >
                <Mapa
                  propiedades={Array.isArray(propiedades) ? propiedades : []}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
              <div className="lg:w-[30%] lg:min-w-[280px] flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden max-lg:min-h-0 max-lg:border-0 max-lg:shadow-none max-lg:bg-transparent">
                <div className="px-3 py-2 border-b border-gray-100 text-sm font-medium text-gray-700 max-lg:border-gray-200 max-lg:bg-white max-lg:rounded-t-xl">
                  Propiedades
                </div>
                <ListaPropiedades
                  propiedades={Array.isArray(propiedades) ? propiedades : []}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onFocusMap={() => {
                    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                />
              </div>
            </div>
            <div className="h-8 flex-shrink-0" aria-hidden />
          </>
        )}
      </div>
    </div>
  )
}
