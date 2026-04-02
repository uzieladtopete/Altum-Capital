/** Enlace directo a WhatsApp (México +52 33 1769 5263) */
const WHATSAPP_LINK = 'https://wa.me/5213317695263'

/**
 * Botón flotante inferior derecho.
 * Aura con box-shadow (#293d51) + logo con animación de “respiración” (~5 s por ciclo).
 * Imagen: /public/whatsapp-float.png
 */
export default function WhatsAppFloatButton() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex items-center justify-center overflow-visible p-3 sm:bottom-6 sm:right-6">
      <div className="pointer-events-auto relative h-16 w-16">
        {/* Capas de aura: detrás del botón, sin fondo sólido (evita tapar el ripple) */}
        <span
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-transparent animate-whatsapp-aura"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-0 z-0 rounded-full bg-transparent animate-whatsapp-aura [animation-delay:1.2s]"
          aria-hidden
        />
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-full shadow-lg ring-2 ring-white/30 transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#293d51]"
          aria-label="Contactar por WhatsApp (Altum Capital)"
        >
          {/* Animación en un span: en <img> a veces no aplica bien; evitamos motion-reduce en clase Tailwind */}
          <span className="whatsapp-logo-breathe flex h-full w-full items-center justify-center rounded-full">
            <img
              src="/whatsapp-float.png"
              alt=""
              width={64}
              height={64}
              className="h-full w-full rounded-full object-cover pointer-events-none"
              draggable={false}
            />
          </span>
        </a>
      </div>
    </div>
  )
}
