import { useState } from 'react'
import { Contact2 } from '@/components/ui/contact-2'
import { insertConsulta } from '@/services/consultasSupabase'
import { useToast } from '@/context/ToastContext'

function formatConsultaError(err) {
  if (!err) return 'Error desconocido al enviar.'
  const msg = String(err.message || '')
  const details = String(err.details || '')
  const combined = `${msg} ${details}`.toLowerCase()

  if (combined.includes('row-level security') || combined.includes('rls') || err.code === '42501') {
    return 'El envío fue rechazado por seguridad de la base de datos. En Supabase, tabla consultas: añade una política RLS que permita INSERT a anon (o authenticated) según uses el formulario público.'
  }
  if (combined.includes('jwt') || combined.includes('invalid api key')) {
    return 'Clave o URL de Supabase incorrecta en el sitio publicado. Revisa VITE_SUPABASE_ANON_KEY y VITE_SUPABASE_URL en el hosting y vuelve a desplegar.'
  }
  if (combined.includes('out of range') && combined.includes('integer')) {
    return 'El teléfono no cabe en la columna numérica de la base de datos (límite de entero). Tras actualizar el sitio, el teléfono se guarda dentro del mensaje; si aún falla, pide cambiar la columna telefono a tipo texto en Supabase.'
  }
  if (combined.includes('telefono')) {
    return 'Error relacionado con el campo teléfono en la base de datos. Si acabas de añadir la columna, recarga; si no existe, el sistema intentó un respaldo automático—revisa la consola o políticas RLS.'
  }
  const tail = details && details !== msg ? ` — ${details}` : ''
  return `No se pudo enviar: ${msg || 'Error sin mensaje'}${tail}`
}

const EMAIL = 'contacto@altum-capital.com.mx'
/** Número para mostrar y para el enlace tel: (ajusta al número real de Altum). */
const PHONE = '+52 33 1769 5263'

export default function ContactSection() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successBanner, setSuccessBanner] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const handleSubmit = async (payload) => {
    setError(null)
    setSuccessBanner(false)
    setLoading(true)
    try {
      const { error: err } = await insertConsulta({
        nombre: payload.nombre,
        email: payload.email,
        mensaje: payload.mensaje,
        telefono: payload.telefono || undefined,
      })
      if (err) {
        const userMsg = formatConsultaError(err)
        setError(userMsg)
        addToast({ type: 'error', message: userMsg })
        return
      }
      addToast({
        type: 'success',
        message: 'Consulta enviada. Te responderemos pronto.',
      })
      setSuccessBanner(true)
      setFormKey((k) => k + 1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto">
      {error && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </p>
        </div>
      )}
      {successBanner && (
        <div className="max-w-7xl mx-auto px-4 pt-6">
          <p
            className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3"
            role="status"
          >
            Tu mensaje se envió correctamente. Gracias por contactarnos; te responderemos lo antes posible.
          </p>
        </div>
      )}
      <Contact2
        key={formKey}
        title="Contáctanos"
        description="Estamos disponibles para dudas, comentarios o oportunidades de colaboración. Cuéntanos en qué podemos ayudarte."
        phone={PHONE}
        email={EMAIL}
        web={null}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </section>
  )
}
