import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AnimateOnScroll from './AnimateOnScroll'
import { RippleButton } from './ui/ripple-button'
import {
  Home,
  MapPin,
  DollarSign,
  Ruler,
  BedDouble,
  Bath,
  Car,
} from 'lucide-react'
import { TIPOS_INMUEBLE_OPTIONS_FILTRO } from '../constants/tipoInmueble'

const OPERACIONES = [
  { value: '', label: 'Todas' },
  { value: 'Venta', label: 'Venta' },
  { value: 'Renta', label: 'Renta' },
  { value: 'Traspaso', label: 'Traspaso' },
]

const UBICACIONES = [
  { value: '', label: 'Ubicación' },
  { value: 'Zapopan', label: 'Zapopan' },
  { value: 'Guadalajara', label: 'Guadalajara' },
  { value: 'Tlajomulco', label: 'Tlajomulco' },
  { value: 'Tonalá', label: 'Tonalá' },
]

const PRECIO_RANGOS = [
  { value: '', label: 'Precio' },
  { value: '0-500000', label: 'Hasta $500K' },
  { value: '500000-1000000', label: '$500K – $1M' },
  { value: '1000000-2000000', label: '$1M – $2M' },
  { value: '2000000-5000000', label: '$2M – $5M' },
  { value: '5000000-10000000', label: '$5M – $10M' },
  { value: '10000000-', label: 'Más de $10M' },
]

const TAMANO_RANGOS = [
  { value: '', label: 'Tamaño' },
  { value: '0-100', label: 'Hasta 100 m²' },
  { value: '100-200', label: '100 – 200 m²' },
  { value: '200-500', label: '200 – 500 m²' },
  { value: '500-1000', label: '500 – 1,000 m²' },
  { value: '1000-', label: 'Más de 1,000 m²' },
]

const CUARTOS_OPCIONES = [
  { value: '', label: 'Cuartos' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5+' },
]

const BANOS_OPCIONES = [
  { value: '', label: 'Baños' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
]

const ESTACIONAMIENTOS_OPCIONES = [
  { value: '', label: 'Estacionamientos' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4+' },
]

const initialFilters = {
  operacion: '',
  tipoInmueble: '',
  ubicacion: '',
  precio: '',
  tamano: '',
  cuartos: '',
  banos: '',
  estacionamientos: '',
}

const selectClass =
  'w-full pl-10 pr-10 py-3.5 border border-gray-200 rounded-full text-gray-700 bg-white shadow-none focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none transition appearance-none bg-[length:1rem_1rem] bg-[right_0.75rem_center] bg-no-repeat cursor-pointer text-sm'

const chevronBg =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234b5563'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")"

function IconSelect({ icon: Icon, value, onChange, options, label }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent pointer-events-none z-10" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
        style={{ backgroundImage: chevronBg }}
        aria-label={label}
      >
        {options.map(({ value: v, label: l }) => (
          <option key={v || 'all'} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function Filtro() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState(initialFilters)
  const navigate = useNavigate()

  useEffect(() => {
    setFilters({
      operacion: searchParams.get('operacion') ?? '',
      tipoInmueble: searchParams.get('tipoInmueble') ?? '',
      ubicacion: searchParams.get('ubicacion') ?? '',
      precio: searchParams.get('precio') ?? '',
      tamano: searchParams.get('tamano') ?? '',
      cuartos: searchParams.get('cuartos') ?? '',
      banos: searchParams.get('banos') ?? '',
      estacionamientos: searchParams.get('estacionamientos') ?? '',
    })
  }, [searchParams.toString()])

  const set = (field, value) => applyFilter(field, value)

  const buildUrl = (f) => {
    const params = new URLSearchParams()
    Object.entries(f).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    return `/resultados?${params.toString()}`
  }

  const applyFilter = (field, value) => {
    const next = { ...filters, [field]: value }
    setFilters(next)
    navigate(buildUrl(next), { replace: true })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate(buildUrl(filters))
  }

  const handleClear = () => {
    setFilters(initialFilters)
    navigate(buildUrl(initialFilters), { replace: true })
  }

  return (
    <section className="bg-white border-b border-gray-100">
      <AnimateOnScroll direction="up">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Operación (radio pills) */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {OPERACIONES.map(({ value, label }) => (
                <label
                  key={value || 'todas'}
                  className={`inline-flex items-center gap-2 cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition-colors ${
                    filters.operacion === value
                      ? 'border-accent bg-accent text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-accent/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="operacion"
                    value={value}
                    checked={filters.operacion === value}
                    onChange={() => set('operacion', value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Tipo de Inmueble + Ubicación */}
            <div className="grid grid-cols-2 gap-4">
              <IconSelect
                icon={Home}
                value={filters.tipoInmueble}
                onChange={(v) => set('tipoInmueble', v)}
                options={TIPOS_INMUEBLE_OPTIONS_FILTRO}
                label="Tipo de Inmueble"
              />
              <IconSelect
                icon={MapPin}
                value={filters.ubicacion}
                onChange={(v) => set('ubicacion', v)}
                options={UBICACIONES}
                label="Ubicación"
              />
            </div>

            {/* Precio + Tamaño */}
            <div className="grid grid-cols-2 gap-4">
              <IconSelect
                icon={DollarSign}
                value={filters.precio}
                onChange={(v) => set('precio', v)}
                options={PRECIO_RANGOS}
                label="Precio"
              />
              <IconSelect
                icon={Ruler}
                value={filters.tamano}
                onChange={(v) => set('tamano', v)}
                options={TAMANO_RANGOS}
                label="Tamaño"
              />
            </div>

            {/* Cuartos + Baños */}
            <div className="grid grid-cols-2 gap-4">
              <IconSelect
                icon={BedDouble}
                value={filters.cuartos}
                onChange={(v) => set('cuartos', v)}
                options={CUARTOS_OPCIONES}
                label="Cuartos"
              />
              <IconSelect
                icon={Bath}
                value={filters.banos}
                onChange={(v) => set('banos', v)}
                options={BANOS_OPCIONES}
                label="Baños"
              />
            </div>

            {/* Estacionamientos */}
            <div className="grid grid-cols-2 gap-4">
              <IconSelect
                icon={Car}
                value={filters.estacionamientos}
                onChange={(v) => set('estacionamientos', v)}
                options={ESTACIONAMIENTOS_OPCIONES}
                label="Estacionamientos"
              />
              <div />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-3">
              <RippleButton
                type="submit"
                rippleColor="bg-white"
                className="flex-1 bg-accent text-white hover:text-white h-12 px-6 rounded-full font-medium"
              >
                Buscar
              </RippleButton>
              <button
                type="button"
                onClick={handleClear}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </AnimateOnScroll>
    </section>
  )
}
