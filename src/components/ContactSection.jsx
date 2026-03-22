import { useState } from 'react'
import { Contact2 } from '@/components/ui/contact-2'
import { insertConsulta } from '@/services/consultasSupabase'

const EMAIL = 'contacto@altumcapital.com'
/** Número para mostrar y para el enlace tel: (ajusta al número real de Altum). */
const PHONE = '+52 33 1769 5263'

export default function ContactSection() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (payload) => {
    setError(null)
    setLoading(true)
    try {
      const { error: err } = await insertConsulta({
        nombre: payload.nombre,
        email: payload.email,
        mensaje: payload.mensaje,
        telefono: payload.telefono || undefined,
      })
      if (err) {
        setError('No se pudo enviar el mensaje. Inténtalo de nuevo.')
        return
      }
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <section id="contacto" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-md mx-auto">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">Mensaje enviado</h2>
            <p className="text-muted-foreground">
              Gracias por contactarnos. Te responderemos lo antes posible.
            </p>
          </div>
        </div>
      </section>
    )
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
      <Contact2
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
