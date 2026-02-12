import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Proyectos', path: '#' },
  { label: 'Nosotros', path: '#' },
  { label: 'Contacto', path: '#' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { role, toggleRole } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-xl md:text-2xl font-semibold text-gray-900 tracking-[0.2em] md:tracking-[0.25em] uppercase hover:text-accent transition-colors"
          >
            Altum Capital
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, path }) => (
              <li key={label}>
                {path === '/' ? (
                  <Link
                    to="/"
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      location.pathname === '/' ? 'text-accent' : 'text-gray-600 hover:text-accent'
                    }`}
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={path}
                    className="text-sm font-medium tracking-wide text-gray-600 hover:text-accent transition-colors"
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
            {role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    location.pathname.startsWith('/admin') ? 'text-accent' : 'text-gray-600 hover:text-accent'
                  }`}
                >
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          {/* DEV: toggle rol - eliminar en producción */}
          <div className="hidden md:block">
            <button
              type="button"
              onClick={toggleRole}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200"
              title="Cambiar rol (solo desarrollo)"
            >
              Modo: {role === 'admin' ? 'Admin' : 'Usuario'}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <ul className="flex flex-col gap-1">
              {navItems.map(({ label, path }) => (
                <li key={label}>
                  {path === '/' ? (
                    <Link
                      to="/"
                      className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={path}
                      className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
              {role === 'admin' && (
                <li>
                  <Link
                    to="/admin"
                    className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileOpen(false)}
                  >
                    Panel Admin
                  </Link>
                </li>
              )}
            </ul>
            {/* DEV: toggle rol móvil */}
            <div className="mt-2 pt-2 border-t border-gray-100 px-3">
              <button
                type="button"
                onClick={toggleRole}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Modo: {role === 'admin' ? 'Admin' : 'Usuario'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
