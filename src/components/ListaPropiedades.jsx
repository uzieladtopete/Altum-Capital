import ImagenPropiedad from './ImagenPropiedad'

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ListaPropiedades({ propiedades = [], selectedId, onSelect }) {
  if (propiedades.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 font-serif">
        No hay propiedades que mostrar.
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <ul className="space-y-3 p-2">
        {propiedades.map((prop) => (
          <li key={prop.id}>
            <button
              type="button"
              onClick={() => onSelect?.(prop.id)}
              className={`w-full text-left rounded-lg border overflow-hidden transition-colors hover:border-gray-300 ${
                selectedId === prop.id ? 'border-gray-900 ring-2 ring-gray-900/20' : 'border-gray-200 bg-white'
              }`}
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
          </li>
        ))}
      </ul>
    </div>
  )
}
