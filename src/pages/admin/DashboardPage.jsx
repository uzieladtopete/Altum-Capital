import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePropiedades } from '../../context/PropiedadesContext'
import ConfirmModal from '../../components/ConfirmModal'
import ImagenPropiedad from '../../components/ImagenPropiedad'

function formatPrecio(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DashboardPage() {
  const { list, removePropiedad } = usePropiedades()
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-1">
            Panel de administración
          </h1>
          <p className="text-gray-600">
            Total: <strong>{list.length}</strong> {list.length === 1 ? 'propiedad' : 'propiedades'}
          </p>
        </div>
        <Link
          to="/admin/crear"
          className="inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors w-fit"
        >
          Crear nueva propiedad
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((prop) => (
          <div
            key={prop.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-[4/3]">
              <ImagenPropiedad
                src={prop.imagen}
                alt={prop.titulo}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-serif font-semibold text-gray-900 truncate">
                {prop.titulo}
              </h3>
              <p className="text-sm text-gray-600">
                {prop.ciudad}
                {prop.zona ? ` · ${prop.zona}` : ''}
              </p>
              <p className="font-medium text-gray-900 mt-1">
                {formatPrecio(prop.precio)}
              </p>
              <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {prop.estado}
              </span>
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/admin/editar/${prop.id}`}
                  className="flex-1 text-center py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Editar
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(prop.id)}
                  className="flex-1 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmModal
        open={deleteTargetId != null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) removePropiedad(deleteTargetId)
          setDeleteTargetId(null)
        }}
        title="¿Estás seguro?"
        message="Esta acción eliminará la propiedad permanentemente."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        confirmDanger
      />
    </div>
  )
}
