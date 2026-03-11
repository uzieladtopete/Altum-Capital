import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AnimateOnScroll from './AnimateOnScroll'
import { RippleButton } from './ui/ripple-button'

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
  const [presupuestoOpen, setPresupuestoOpen] = useState(false)
  const [m2Open, setM2Open] = useState(false)
  const presupuestoRef = useRef(null)
  const m2Ref = useRef(null)
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
    setPresupuestoOpen(false)
    setM2Open(false)
  }

  // Cerrar desplegables al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (presupuestoRef.current && !presupuestoRef.current.contains(e.target)) {
        setPresupuestoOpen(false)
      }
      if (m2Ref.current && !m2Ref.current.contains(e.target)) {
        setM2Open(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getPresupuestoLabel = () => {
    if (filters.minPrecio && filters.maxPrecio) {
      return `$${Number(filters.minPrecio).toLocaleString()} - $${Number(filters.maxPrecio).toLocaleString()}`
    }
    if (filters.minPrecio) return `Desde $${Number(filters.minPrecio).toLocaleString()}`
    if (filters.maxPrecio) return `Hasta $${Number(filters.maxPrecio).toLocaleString()}`
    return 'Presupuesto'
  }

  const getM2Label = () => {
    if (filters.minM2 && filters.maxM2) {
      return `${filters.minM2} - ${filters.maxM2} m²`
    }
    if (filters.minM2) return `Desde ${filters.minM2} m²`
    if (filters.maxM2) return `Hasta ${filters.maxM2} m²`
    return 'm²'
  }

  return (
    <section className="bg-white border-b border-gray-100">
      <AnimateOnScroll direction="up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            <select
              value={filters.ciudad}
              onChange={(e) => handleChange('ciudad', e.target.value)}
              className="w-full min-w-0 pl-4 pr-10 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white shadow-none focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition appearance-none bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")" }}
              aria-label="Ciudad"
            >
              {CIUDADES.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            <select
              value={filters.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
              className="w-full min-w-[11rem] pl-4 pr-10 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white shadow-none focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition appearance-none bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")" }}
              aria-label="Tipo de propiedad"
            >
              {TIPOS.map(({ value, label }) => (
                <option key={value || 'all'} value={value}>{label}</option>
              ))}
            </select>
            
            {/* Presupuesto desplegable */}
            <div ref={presupuestoRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setPresupuestoOpen(!presupuestoOpen)
                  setM2Open(false)
                }}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-left flex items-center justify-between transition ${
                  presupuestoOpen ? 'ring-2 ring-accent/20 border-accent' : 'focus:ring-2 focus:ring-accent/20 focus:border-accent'
                } ${filters.minPrecio || filters.maxPrecio ? 'font-medium' : ''}`}
                aria-label="Presupuesto"
              >
                <span className="truncate">{getPresupuestoLabel()}</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${presupuestoOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {presupuestoOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Desde</label>
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={filters.minPrecio}
                      onChange={(e) => handleChange('minPrecio', e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hasta</label>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={filters.maxPrecio}
                      onChange={(e) => handleChange('maxPrecio', e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* m² desplegable */}
            <div ref={m2Ref} className="relative">
              <button
                type="button"
                onClick={() => {
                  setM2Open(!m2Open)
                  setPresupuestoOpen(false)
                }}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-700 bg-white text-left flex items-center justify-between transition ${
                  m2Open ? 'ring-2 ring-accent/20 border-accent' : 'focus:ring-2 focus:ring-accent/20 focus:border-accent'
                } ${filters.minM2 || filters.maxM2 ? 'font-medium' : ''}`}
                aria-label="Metros cuadrados"
              >
                <span className="truncate">{getM2Label()}</span>
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${m2Open ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {m2Open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Desde</label>
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={filters.minM2}
                      onChange={(e) => handleChange('minM2', e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hasta</label>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={filters.maxM2}
                      onChange={(e) => handleChange('maxM2', e.target.value)}
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <RippleButton
                type="submit"
                rippleColor="bg-white"
                className="bg-gray-900 text-white hover:text-white h-12 px-6"
              >
                Buscar
              </RippleButton>
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
      </AnimateOnScroll>
    </section>
  )
}
