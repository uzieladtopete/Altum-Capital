import { createContext, useContext, useState, useCallback } from 'react'
import { useToast } from './ToastContext'
import { insertConsulta } from '../services/consultasSupabase'

const ContactModalContext = createContext(null)

export function useContactModal() {
  const ctx = useContext(ContactModalContext)
  return ctx
}

export function ContactModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()

  const openContactModal = useCallback(() => setIsOpen(true), [])
  const closeContactModal = useCallback(() => setIsOpen(false), [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      addToast({ type: 'error', message: 'Completa todos los campos' })
      return
    }
    setLoading(true)
    try {
      const { error } = await insertConsulta({
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
        telefono: telefono.trim() || undefined,
      })
      if (error) throw Object.assign(new Error(error.message || 'Error al enviar'), error)
      addToast({ type: 'success', message: 'Consulta enviada. Te contactaremos pronto.' })
      setNombre('')
      setEmail('')
      setTelefono('')
      setMensaje('')
      closeContactModal()
    } catch (err) {
      console.error(err)
      addToast({ type: 'error', message: err.message || 'No se pudo enviar. Intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const value = { isOpen, openContactModal, closeContactModal }

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !loading && closeContactModal()}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-semibold text-gray-900">Contáctanos</h3>
              <button
                type="button"
                onClick={() => !loading && closeContactModal()}
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
                <label htmlFor="contact-modal-nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="contact-modal-nombre"
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
                <label htmlFor="contact-modal-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="contact-modal-email"
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
                <label htmlFor="contact-modal-telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  id="contact-modal-telefono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Ej. 33 1234 5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="contact-modal-mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="contact-modal-mensaje"
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
                  onClick={() => !loading && closeContactModal()}
                  className="px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  )
}
