import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SCROLL_THRESHOLD = 24 // px: arriba de esto = "al inicio", se ve el logo
const SCROLL_DURATION_MS = 1600 // más lento y suave al clic en logo

function smoothScrollToTop(durationMs = SCROLL_DURATION_MS) {
  const start = window.scrollY
  const startTime = performance.now()
  function step(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    const ease = 1 - (1 - progress) ** 2
    window.scrollTo(0, start * (1 - ease))
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Proyectos', path: '#' },
  { label: 'Nosotros', path: '#' },
  { label: 'Contacto', path: '#' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const location = useLocation()
  const { user, role, signOut } = useAuth()
  const isAdmin = user && role === 'admin'

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 relative">
          {/* Arriba del todo: solo logo. Al bajar: solo texto ALTUM CAPITAL. Ancho suficiente para que las letras no se salgan. */}
          <Link
            to="/"
            className="relative inline-flex items-center justify-center h-full min-w-[160px] md:min-w-[200px] overflow-hidden z-10"
            aria-label="Altum Capital - Inicio"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                smoothScrollToTop()
              } else {
                setTimeout(() => smoothScrollToTop(), 150)
              }
            }}
          >
            <img
              src="/logo_altum.png?v=nav3"
              alt=""
              className={`max-h-9 w-auto md:max-h-11 object-contain object-center transition-opacity duration-300 invert hue-rotate-[200deg] mix-blend-multiply ${atTop ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <span
              className={`font-serif text-sm md:text-base font-semibold text-gray-900 tracking-[0.15em] md:tracking-[0.2em] uppercase whitespace-nowrap transition-opacity duration-300 ${atTop ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
            >
              ALTUM CAPITAL
            </span>
          </Link>

          {/* Desktop menu: centrado en la barra */}
          <ul className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
            {isAdmin && (
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

          {/* Solo si hay sesión: email y cerrar sesión; Panel Admin solo cuando role === admin */}
          {user ? (
            <div className="hidden md:flex items-center gap-4 z-10">
              <span className="text-xs text-gray-500">{user.email}</span>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await signOut()
                    window.location.href = '/'
                  } catch (error) {
                    console.error('Error signing out:', error)
                  }
                }}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            /* Espaciador para que el menú centrado quede bien cuando no hay usuario */
            <div className="hidden md:block min-w-[160px] md:min-w-[200px]" />
          )}
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 z-10"
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
              {isAdmin && (
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
            {/* Solo si hay sesión: email y cerrar sesión (móvil) */}
            {user && (
              <div className="mt-2 pt-2 border-t border-gray-100 px-3">
                <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signOut()
                      setMobileOpen(false)
                      window.location.href = '/'
                    } catch (error) {
                      console.error('Error signing out:', error)
                    }
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
