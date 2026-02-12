import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Filtro from '../components/Filtro'
import Mapa from '../components/Mapa'
import ListaPropiedades from '../components/ListaPropiedades'
import { usePropiedades } from '../context/PropiedadesContext'

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const { getFiltered } = usePropiedades()
  const [selectedId, setSelectedId] = useState(null)

  const filters = useMemo(() => ({
    ciudad: searchParams.get('ciudad') ?? '',
    tipo: searchParams.get('tipo') ?? '',
    minPrecio: searchParams.get('minPrecio') ?? '',
    maxPrecio: searchParams.get('maxPrecio') ?? '',
    minM2: searchParams.get('minM2') ?? '',
    maxM2: searchParams.get('maxM2') ?? '',
  }), [searchParams])

  const propiedades = useMemo(() => getFiltered(filters), [getFiltered, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <Filtro />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
          Resultados
        </h1>
        <p className="text-gray-600 mb-4">
          {propiedades.length} {propiedades.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
        </p>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-[calc(100vh-16rem)] min-h-[400px]">
          <div className="lg:w-[70%] h-[320px] lg:h-full flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <Mapa propiedades={propiedades} selectedId={selectedId} />
          </div>
          <div className="lg:w-[30%] lg:min-w-[280px] flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 text-sm font-medium text-gray-700">
              Propiedades
            </div>
            <ListaPropiedades
              propiedades={propiedades}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
