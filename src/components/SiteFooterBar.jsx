import { Link } from 'react-router-dom'

/**
 * Pie bajo contacto: derechos reservados + enlace al aviso de privacidad.
 */
export default function SiteFooterBar() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-5 text-center sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-1">
        <p className="text-xs text-muted-foreground sm:text-sm">
          Todos los derechos reservados por Altum Capital{' '}
          <sup className="text-[0.65em] font-normal" aria-label="marca registrada">
            ®
          </sup>
        </p>
        <Link
          to="/aviso-de-privacidad"
          className="text-xs font-medium text-foreground underline decoration-gray-400 underline-offset-2 transition-colors hover:text-accent hover:decoration-accent sm:text-sm"
        >
          Aviso de Privacidad
        </Link>
      </div>
    </footer>
  )
}
