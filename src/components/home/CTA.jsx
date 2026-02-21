import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../context/ToastContext'

export default function CTA() {
  const [showModal, setShowModal] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      addToast({ type: 'error', message: 'Completa todos los campos' })
      return
    }
    if (!supabase) {
      addToast({ type: 'error', message: 'Envío no disponible. Configura Supabase en el servidor.' })
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.from('consultas').insert({
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
      })
      if (error) throw error
      addToast({ type: 'success', message: 'Consulta enviada. Te contactaremos pronto.' })
      setNombre('')
      setEmail('')
      setMensaje('')
      setShowModal(false)
    } catch (err) {
      console.error(err)
      addToast({ type: 'error', message: err.message || 'No se pudo enviar. Intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-accent text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
            Agenda una consulta
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Cuéntanos tu proyecto y te respondemos con una propuesta a medida.
          </p>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-8 py-4 bg-white text-accent font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Solicitar consulta
          </button>
        </div>
      </section>

      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-semibold text-gray-900">Solicitar consulta</h3>
              <button
                type="button"
                onClick={() => !loading && setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Deja tu mensaje y te responderemos por correo.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cta-nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="cta-nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="cta-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="cta-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  disabled={loading}
                  required
                />
              </div>
              <div>
                <label htmlFor="cta-mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="cta-mensaje"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntanos tu proyecto o consulta..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
                  disabled={loading}
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                  type="button"
                  onClick={() => !loading && setShowModal(false)}
                  className="px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
