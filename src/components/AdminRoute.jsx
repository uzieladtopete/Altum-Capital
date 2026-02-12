import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege rutas /admin: solo muestra contenido si role === "admin".
 * Futuro: comprobar user?.role === 'admin' o isAdmin cuando exista auth real.
 */
export default function AdminRoute() {
  const { role } = useAuth()

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-semibold text-gray-900 mb-2">
            Acceso restringido
          </h1>
          <p className="text-gray-600">
            No tienes permiso para ver esta página.
          </p>
        </div>
      </div>
    )
  }

  return <Outlet />
}
