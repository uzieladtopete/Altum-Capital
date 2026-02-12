import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const CIUDADES = [
  { value: '', label: 'Ciudad' },
  { value: 'Guadalajara', label: 'Guadalajara' },
  { value: 'Zapopan', label: 'Zapopan' },
]

const TIPOS = [
  { value: '', label: 'Tipo de propiedad' },
  { value: 'Residencial', label: 'Residencial' },
  { value: 'Comercial', label: 'Comercial' },
]

const initialFilters = {
  ciudad: '',
  tipo: '',
  minPrecio: '',
  maxPrecio: '',
  minM2: '',
  maxM2: '',
}

export default function Filtro() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(initialFilters)
  const navigate = useNavigate()

  useEffect(() => {
    setFilters({
      ciudad: searchParams.get('ciudad') ?? '',
      tipo: searchParams.get('tipo') ?? '',
      minPrecio: searchParams.get('minPrecio') ?? '',
      maxPrecio: searchParams.get('maxPrecio') ?? '',
      minM2: searchParams.get('minM2') ?? '',
      maxM2: searchParams.get('maxM2') ?? '',
    })
  }, [searchParams.toString()])

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    navigate(`/resultados?${params.toString()}`, { state: { filters } })
  }

  const handleClear = () => {
    setFilters(initialFilters)
  }

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            <select
              value={filters.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Ciudad"
            >
              {CIUDADES.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={filters.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Tipo de propiedad"
            >
              {TIPOS.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Presupuesto mín"
              value={filters.minPrecio}
              onChange={(e) => handleChange('minPrecio', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Presupuesto mínimo"
            />
            <input
              type="number"
              placeholder="Presupuesto máx"
              value={filters.maxPrecio}
              onChange={(e) => handleChange('maxPrecio', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Presupuesto máximo"
            />
            <input
              type="number"
              placeholder="m² mín"
              value={filters.minM2}
              onChange={(e) => handleChange('minM2', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Metros cuadrados mínimos"
            />
            <input
              type="number"
              placeholder="m² máx"
              value={filters.maxM2}
              onChange={(e) => handleChange('maxM2', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Metros cuadrados máximos"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
