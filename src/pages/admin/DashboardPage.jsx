import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePropiedades } from '../../context/PropiedadesContext'
import { getPropertyViewStats } from '../../services/propertyViewsSupabase'
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
  const { list } = usePropiedades()
  const [viewStats, setViewStats] = useState({
    visitasDelMes: null,
    promedioVisitas: null,
    topByViews: [],
  })

  const totalPropiedades = list.length
  const visitasDelMes = viewStats.visitasDelMes
  const promedioVisitas = viewStats.promedioVisitas
  const masVistas =
    viewStats.topByViews.length > 0
      ? viewStats.topByViews
          .map(({ property_id, count }) => ({ prop: list.find((p) => p.id === property_id), count }))
          .filter((x) => x.prop)
          .map((x) => ({ ...x.prop, _viewCount: x.count }))
      : list.slice(0, 5)

  useEffect(() => {
    let cancelled = false
    getPropertyViewStats(totalPropiedades).then((stats) => {
      if (!cancelled) setViewStats(stats)
    })
    return () => { cancelled = true }
  }, [totalPropiedades])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-1">
          Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Resumen de tu inventario y actividad.
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Total propiedades
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {totalPropiedades}
          </p>
          <Link
            to="/admin/propiedades"
            className="mt-2 inline-block text-sm text-gray-600 hover:text-gray-900"
          >
            Ver todas →
          </Link>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Visitas del mes
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {visitasDelMes != null ? visitasDelMes : '—'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Vistas en detalle
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Promedio visitas / propiedad
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {promedioVisitas != null ? promedioVisitas : '—'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {promedioVisitas == null ? 'Por mes' : ''}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Estados publicados
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {new Set(list.map((p) => p.estado).filter(Boolean)).size}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Tipos de estado distintos
          </p>
        </div>
      </div>

      {/* Propiedades más vistas del mes o recientes */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-lg font-semibold text-gray-900">
            {viewStats.topByViews.length > 0 ? 'Propiedades más vistas' : 'Propiedades recientes'}
          </h2>
          <Link
            to="/admin/propiedades"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Ver todas
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {masVistas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aún no hay propiedades. <Link to="/admin/crear" className="text-gray-900 font-medium hover:underline">Crear la primera</Link>.
            </div>
          ) : (
            masVistas.map((prop) => (
              <div
                key={prop.id}
                className="flex flex-col sm:flex-row gap-4 p-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="w-full sm:w-32 aspect-video sm:aspect-square rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <ImagenPropiedad
                    src={prop.imagen}
                    alt={prop.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-gray-900 truncate">
                    {prop.titulo}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {prop.ciudad}
                    {prop.zona ? ` · ${prop.zona}` : ''}
                    {' · '}
                    {formatPrecio(prop.precio)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {prop.estado}
                    </span>
                    {prop._viewCount != null && (
                      <span className="inline-block text-xs text-gray-600 bg-blue-50 px-2 py-0.5 rounded">
                        {prop._viewCount} visita{prop._viewCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 sm:justify-center">
                  <Link
                    to={`/propiedad/${prop.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-2 px-4 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
                  >
                    Ver página
                  </Link>
                  <Link
                    to={`/admin/editar/${prop.id}`}
                    className="inline-block py-2 px-4 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 text-center"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
