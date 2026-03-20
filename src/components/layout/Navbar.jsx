import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SCROLL_THRESHOLD = 24 // px: arriba de esto = "al inicio", se ve el logo
const SCROLL_DURATION_MS = 650 // más rápido y natural al clic en logo

/**
 * Scroll suave al tope. Devuelve una función para cancelar la animación
 * (p. ej. si el usuario hace scroll hacia abajo).
 */
function smoothScrollToTop(durationMs = SCROLL_DURATION_MS) {
  let rafId = null
  let cancelled = false
  const start = window.scrollY
  const startTime = performance.now()

  function step(now) {
    if (cancelled) return
    const elapsed = now - startTime
    const progress = Math.min(elapsed / durationMs, 1)
    const ease = 1 - (1 - progress) ** 2 // easeOutQuad
    window.scrollTo(0, start * (1 - ease))
    if (progress < 1) rafId = requestAnimationFrame(step)
  }

  rafId = requestAnimationFrame(step)

  return function cancel() {
    cancelled = true
    if (rafId != null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
}

const navItems = [
  { label: 'Inicio', path: '/' },
  { label: 'Propiedades', path: '/resultados' },
  { label: 'Nosotros', path: '/nosotros' },
  { label: 'Bolsa de trabajo', path: '/bolsa-de-trabajo' },
  { label: 'Contacto', path: '/contacto' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const scrollToTopCancelRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, signOut } = useAuth()
  const isAdmin = user && role === 'admin'

  const scrollToContact = () => {
    setMobileOpen(false)
    if (location.pathname === '/resultados') {
      navigate('/#contacto')
    } else {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < SCROLL_THRESHOLD)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Si el usuario hace scroll hacia abajo durante la animación de "subir", cancelarla para no trabar la página
  useEffect(() => {
    const onWheel = (e) => {
      if (e.deltaY > 0 && scrollToTopCancelRef.current) {
        scrollToTopCancelRef.current()
        scrollToTopCancelRef.current = null
      }
    }
    const onTouchMove = () => {
      if (scrollToTopCancelRef.current) {
        scrollToTopCancelRef.current()
        scrollToTopCancelRef.current = null
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between relative transition-all duration-300 ${atTop ? 'h-[72px] md:h-24' : 'h-[88px] md:h-[112px]'}`}>
          <Link
            to="/"
            className="relative inline-flex items-center justify-center h-full min-w-[160px] md:min-w-[200px] z-10"
            aria-label="Altum Capital - Inicio"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault()
                scrollToTopCancelRef.current?.()
                scrollToTopCancelRef.current = smoothScrollToTop()
              } else {
                scrollToTopCancelRef.current?.()
                setTimeout(() => {
                  scrollToTopCancelRef.current = smoothScrollToTop()
                }, 150)
              }
            }}
          >
            <div className={`overflow-hidden transition-all duration-300 ease-out ${atTop ? 'max-h-[46px] md:max-h-[56px]' : 'max-h-[72px] md:max-h-[88px]'}`}>
              <img
                src="/logo_altum_full.png"
                alt="Altum Capital"
                className="-my-[5px] h-[72px] w-auto md:h-[88px]"
              />
            </div>
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
                ) : label === 'Contacto' ? (
                  <button
                    type="button"
                    onClick={scrollToContact}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      location.pathname === '/contacto' ? 'text-accent' : 'text-gray-600 hover:text-accent'
                    }`}
                  >
                    {label}
                  </button>
                ) : path.startsWith('/') ? (
                  <Link
                    to={path}
                    className={`text-sm font-medium tracking-wide transition-colors ${
                      location.pathname === path ? 'text-accent' : 'text-gray-600 hover:text-accent'
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
                  ) : label === 'Contacto' ? (
                    <button
                      type="button"
                      className="block w-full text-left py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                      onClick={scrollToContact}
                    >
                      {label}
                    </button>
                  ) : path.startsWith('/') ? (
                    <Link
                      to={path}
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
