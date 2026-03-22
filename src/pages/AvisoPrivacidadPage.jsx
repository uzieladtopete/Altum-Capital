import AvisoPrivacidadContent from '@/components/AvisoPrivacidadContent'

export default function AvisoPrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16 lg:py-20">
      <h1 className="mb-8 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Aviso de privacidad
      </h1>
      <AvisoPrivacidadContent />
    </article>
  )
}
