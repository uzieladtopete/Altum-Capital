import { useContactModal } from '../../context/ContactModalContext'
import AnimateOnScroll from '../AnimateOnScroll'

export default function CTA() {
  const { openContactModal } = useContactModal()

  return (
    <>
      <section className="py-16 md:py-24 bg-accent text-white">
        <AnimateOnScroll direction="up">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Agenda una consulta
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Cuéntanos tu proyecto y te respondemos con una propuesta a medida.
            </p>
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex items-center px-8 py-4 bg-white text-accent font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar consulta
            </button>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  )
}
