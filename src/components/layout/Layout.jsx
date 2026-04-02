import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { TeamSection } from '../ui/team-section'
import ContactSection from '../ContactSection'
import SiteFooterBar from '../SiteFooterBar'

export default function Layout() {
  const location = useLocation()
  const showContact = location.pathname !== '/resultados'
  const isAdminPage = location.pathname.startsWith('/admin')
  const isHomePage = location.pathname === '/'
  const isBolsaDeTrabajoPage = location.pathname === '/bolsa-de-trabajo'
  const isAvisoPrivacidadPage = location.pathname === '/aviso-de-privacidad'
  const isPropiedadDetailPage = location.pathname.startsWith('/propiedad/')
  const showFooterBar = !isAdminPage && location.pathname !== '/resultados'
  /** En la página del aviso no repetimos equipo + contacto debajo del texto legal */
  const showContactBlocks = showContact && !isAdminPage && !isAvisoPrivacidadPage

  useEffect(() => {
    if (location.hash === '#contacto' || location.hash === 'contacto') {
      const scroll = () => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })
      const t = setTimeout(scroll, 150)
      return () => clearTimeout(t)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    // Cuando cambias de página desde el navbar, queremos ir al inicio de la vista.
    // Si se está usando el ancla de #contacto, dejamos que la lógica anterior se encargue.
    const isContactHash = location.hash === '#contacto' || location.hash === 'contacto'
    if (isContactHash) return

    window.scrollTo({ top: 0 })
  }, [location.pathname, location.search])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[88px] md:pt-[112px]">
        <Outlet />
      </main>
      {showContactBlocks && !isHomePage && !isBolsaDeTrabajoPage && !isPropiedadDetailPage && (
        <TeamSection />
      )}
      {showContactBlocks && <ContactSection />}
      {showFooterBar && <SiteFooterBar />}
    </div>
  )
}
