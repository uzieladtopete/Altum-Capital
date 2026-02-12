import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PROJECT_TYPES = [
  { value: '', label: 'Tipo de proyecto' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'remodelacion', label: 'Remodelación' },
  { value: 'otro', label: 'Otro' },
]

const LOCATIONS = [
  { value: '', label: 'Ubicación' },
  { value: 'cdmx', label: 'Ciudad de México' },
  { value: 'guadalajara', label: 'Guadalajara' },
  { value: 'monterrey', label: 'Monterrey' },
  { value: 'otra', label: 'Otra' },
]

const BUDGET_RANGES = [
  { value: '', label: 'Presupuesto' },
  { value: '0-500', label: 'Hasta $500k' },
  { value: '500-1000', label: '$500k - $1M' },
  { value: '1000-2000', label: '$1M - $2M' },
  { value: '2000-5000', label: '$2M - $5M' },
  { value: '5000+', label: 'Más de $5M' },
]

const initialFilters = {
  tipo: '',
  ubicacion: '',
  presupuesto: '',
  sqmMin: '',
  sqmMax: '',
}

export default function FilterBar() {
  const [filters, setFilters] = useState(initialFilters)
  const navigate = useNavigate()

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <select
              value={filters.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Tipo de proyecto"
            >
              {PROJECT_TYPES.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={filters.ubicacion}
              onChange={(e) => handleChange('ubicacion', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Ubicación"
            >
              {LOCATIONS.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={filters.presupuesto}
              onChange={(e) => handleChange('presupuesto', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Rango de presupuesto"
            >
              {BUDGET_RANGES.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="m² mín"
              value={filters.sqmMin}
              onChange={(e) => handleChange('sqmMin', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Metros cuadrados mínimos"
            />
            <input
              type="number"
              placeholder="m² máx"
              value={filters.sqmMax}
              onChange={(e) => handleChange('sqmMax', e.target.value)}
              min="0"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition"
              aria-label="Metros cuadrados máximos"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-accent-light transition-colors"
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
