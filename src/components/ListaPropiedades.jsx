import { BedDouble, Bath, Car } from 'lucide-react'
import ImagenPropiedad from './ImagenPropiedad'

function safeCount(value) {
  const n = value == null || value === '' ? NaN : Number(value)
  return Number.isNaN(n) ? null : n
}

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function Card({ prop, selectedId, onCardClick, onVerPropiedad, compact = false }) {
  return (
    <div
      className={`w-full rounded-lg border overflow-hidden transition-colors ${
        selectedId === prop.id ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200 bg-white'
      } ${compact ? 'shadow-sm' : ''}`}
    >
      <button
        type="button"
        onClick={() => onCardClick(prop.id)}
        className="w-full text-left hover:border-gray-300 cursor-pointer"
      >
        <div className="aspect-[4/3] relative">
          {prop.tipo ? (
            <span className="absolute left-2 top-2 z-[1] max-w-[calc(100%-1rem)] rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold leading-tight text-white shadow-sm sm:text-xs">
              {prop.tipo}
            </span>
          ) : null}
          <ImagenPropiedad
            src={prop.imagen}
            alt={prop.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={compact ? 'p-2' : 'p-3'}>
          <h3
            className={`font-serif font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] ${compact ? 'text-sm' : ''}`}
          >
            {prop.titulo}
          </h3>
          <p className={compact ? 'text-xs text-gray-600' : 'text-sm text-gray-600'}>{prop.ciudad}</p>
          <p className={`font-medium text-gray-900 mt-1 ${compact ? 'text-[17px]' : ''}`}>
            {formatPrecio(prop.precio)}
          </p>
          <div className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mt-2 ${compact ? 'mt-1' : ''}`}>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-gray-600 min-w-0">
              {(() => {
                const r = safeCount(prop.recamaras)
                const b = safeCount(prop.banos)
                const e = safeCount(prop.estacionamientos)
                const parts = []
                if (r != null) {
                  parts.push(
                    <span key="r" className={`inline-flex items-center gap-0.5 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                      <BedDouble className={`shrink-0 opacity-80 ${compact ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} aria-hidden />
                      {r}
                    </span>
                  )
                }
                if (b != null) {
                  parts.push(
                    <span key="b" className={`inline-flex items-center gap-0.5 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                      <Bath className={`shrink-0 opacity-80 ${compact ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} aria-hidden />
                      {b}
                    </span>
                  )
                }
                if (e != null) {
                  parts.push(
                    <span key="e" className={`inline-flex items-center gap-0.5 ${compact ? 'text-[10px]' : 'text-xs'}`}>
                      <Car className={`shrink-0 opacity-80 ${compact ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} aria-hidden />
                      {e}
                    </span>
                  )
                }
                return parts.length ? parts : null
              })()}
            </div>
            <span className={`text-gray-500 shrink-0 font-medium ${compact ? 'text-[10px]' : 'text-xs'}`}>{prop.m2} m²</span>
          </div>
          <div className="mt-1">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded inline-block">
              {prop.estado}
            </span>
          </div>
        </div>
      </button>
      <div className={compact ? 'px-2 pb-2' : 'px-3 pb-3'}>
        <button
          type="button"
          onClick={(e) => onVerPropiedad(prop.id, e)}
          className={`w-full bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
        >
          Ver propiedad
        </button>
      </div>
    </div>
  )
}

export default function ListaPropiedades({ propiedades = [], selectedId, onSelect, onFocusMap }) {
  const propiedadesArray = Array.isArray(propiedades) ? propiedades : []

  if (propiedadesArray.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 font-serif">
        No hay propiedades que mostrar.
      </div>
    )
  }

  const handleCardClick = (propId) => {
    if (selectedId === propId) {
      onSelect?.(null)
      setTimeout(() => onSelect?.(propId), 50)
    } else {
      onSelect?.(propId)
    }
  }

  const handleVerPropiedad = (propId, e) => {
    e.stopPropagation()
    if (selectedId === propId) {
      onSelect?.(null)
      setTimeout(() => { onSelect?.(propId); onFocusMap?.() }, 50)
    } else {
      onSelect?.(propId)
      onFocusMap?.()
    }
  }

  return (
    <>
      {/* Móvil: scroll horizontal (derecha a izquierda), tarjetas más pequeñas */}
      <div className="lg:hidden overflow-x-auto overflow-y-hidden -mx-4 px-4 pb-6 snap-x snap-mandatory scroll-smooth">
        <ul className="flex gap-3 flex-nowrap">
          {propiedadesArray.map((prop) => (
            <li key={prop.id} className="flex-shrink-0 w-[72vw] max-w-[280px] snap-start">
              <Card
                prop={prop}
                selectedId={selectedId}
                onCardClick={handleCardClick}
                onVerPropiedad={handleVerPropiedad}
                compact
              />
            </li>
          ))}
        </ul>
      </div>
      {/* Desktop: scroll vertical como antes */}
      <div className="hidden lg:block h-full overflow-y-auto">
        <ul className="space-y-3 p-2">
          {propiedadesArray.map((prop) => (
            <li key={prop.id}>
              <Card
                prop={prop}
                selectedId={selectedId}
                onCardClick={handleCardClick}
                onVerPropiedad={handleVerPropiedad}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
