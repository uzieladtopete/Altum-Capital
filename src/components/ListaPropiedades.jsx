import { useNavigate } from 'react-router-dom'
import ImagenPropiedad from './ImagenPropiedad'

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ListaPropiedades({ propiedades = [], selectedId, onSelect, onFocusMap }) {
  const navigate = useNavigate()
  
  // Asegurar que propiedades sea siempre un array
  const propiedadesArray = Array.isArray(propiedades) ? propiedades : []

  if (propiedadesArray.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 font-serif">
        No hay propiedades que mostrar.
      </div>
    )
  }

  const handleCardClick = (propId, e) => {
    // Al hacer clic en la tarjeta, centrar el mapa en esa propiedad
    onSelect?.(propId)
  }

  const handleVerPropiedad = (propId, e) => {
    e.stopPropagation()
    // Primero centrar en el mapa y mostrar el popup; el enlace "Ver propiedad" del popup lleva al detalle
    onSelect?.(propId)
    onFocusMap?.()
  }

  return (
    <div className="h-full overflow-y-auto">
      <ul className="space-y-3 p-2">
        {propiedadesArray.map((prop) => (
          <li key={prop.id}>
            <div
              className={`w-full rounded-lg border overflow-hidden transition-colors ${
                selectedId === prop.id ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200 bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => handleCardClick(prop.id)}
                className="w-full text-left hover:border-gray-300 cursor-pointer"
              >
                <div className="aspect-[4/3] relative">
                  <ImagenPropiedad
                    src={prop.imagen}
                    alt={prop.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-serif font-semibold text-gray-900 truncate">
                    {prop.titulo}
                  </h3>
                  <p className="text-sm text-gray-600">{prop.ciudad}</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {formatPrecio(prop.precio)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {prop.estado}
                    </span>
                    <span className="text-xs text-gray-500">{prop.m2} m²</span>
                  </div>
                </div>
              </button>
              <div className="px-3 pb-3">
                <button
                  type="button"
                  onClick={(e) => handleVerPropiedad(prop.id, e)}
                  className="w-full px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Ver propiedad
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
