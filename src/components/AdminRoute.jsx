import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege rutas /admin: solo muestra contenido si hay usuario autenticado y role === "admin".
 */
export default function AdminRoute() {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  // Mostrar loading mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: location.pathname } }} replace />
  }

  // Si hay usuario pero no es admin, mostrar mensaje de acceso restringido
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
            Acceso restringido
          </h1>
          <p className="text-gray-600">
            No tienes permiso para ver esta página. Necesitas ser administrador.
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
