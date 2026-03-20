import { Navigate } from 'react-router-dom'

/**
 * La sección de contacto está al final de todas las páginas (excepto resultados).
 * Esta ruta redirige a inicio y hace scroll a #contacto.
 */
export default function ContactPage() {
  return <Navigate to="/#contacto" replace />
}
