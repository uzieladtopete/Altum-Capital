import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const sidebarItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Propiedades', path: '/admin' },
  { label: 'Crear Propiedad', path: '/admin/crear' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-200 transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 lg:justify-start">
          <span className="font-serif font-semibold text-gray-900">Panel Admin</span>
          <button
            type="button"
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarItems.map(({ label, path }) => (
            <Link
              key={path + label}
              to={path}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === path
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay móvil */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Cerrar"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-16 lg:top-20 z-10 flex items-center h-14 px-4 bg-white border-b border-gray-100 lg:px-8">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-gray-600"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
