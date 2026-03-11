import ImagenPropiedad from './ImagenPropiedad'

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
          <ImagenPropiedad
            src={prop.imagen}
            alt={prop.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        <div className={compact ? 'p-2' : 'p-3'}>
          <h3 className={`font-serif font-semibold text-gray-900 truncate ${compact ? 'text-sm' : ''}`}>
            {prop.titulo}
          </h3>
          <p className={compact ? 'text-xs text-gray-600' : 'text-sm text-gray-600'}>{prop.ciudad}</p>
          <p className={`font-medium text-gray-900 mt-1 ${compact ? 'text-sm' : ''}`}>
            {formatPrecio(prop.precio)}
          </p>
          <div className={`flex items-center justify-between mt-2 ${compact ? 'mt-1' : ''}`}>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
              {prop.estado}
            </span>
            <span className="text-xs text-gray-500">{prop.m2} m²</span>
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
