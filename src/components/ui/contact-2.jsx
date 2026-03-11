import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function Contact2({
  title = 'Contáctanos',
  description = 'Estamos disponibles para dudas, comentarios o oportunidades de colaboración. Cuéntanos en qué podemos ayudarte.',
  phone = '',
  email = 'contacto@altumcapital.com',
  web = null,
  className = '',
  onSubmit,
  loading = false,
}) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [emailVal, setEmailVal] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.({
      nombre: `${nombre.trim()} ${apellido.trim()}`.trim(),
      email: emailVal.trim(),
      telefono: telefono.trim(),
      mensaje: mensaje.trim(),
    })
  }

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-12 lg:flex-row lg:gap-20">
          <div className="mx-auto flex max-w-sm flex-col justify-between gap-10 lg:mx-0">
            <div className="text-center lg:text-left">
              <h1 className="font-serif mb-2 text-4xl font-semibold sm:text-5xl lg:mb-1 lg:text-5xl">
                {title}
              </h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            <div className="mx-auto w-fit lg:mx-0">
              <h3 className="mb-6 text-center text-xl font-semibold lg:text-left">
                Datos de contacto
              </h3>
              <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
                {phone && (
                  <li>
                    <span className="font-bold text-foreground">Teléfono: </span>
                    {phone}
                  </li>
                )}
                <li>
                  <span className="font-bold text-foreground">Email: </span>
                  <a href={`mailto:${email}`} className="underline hover:text-foreground">
                    {email}
                  </a>
                </li>
                {web?.url && (
                  <li>
                    <span className="font-bold text-foreground">Web: </span>
                    <a href={web.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                      {web.label || web.url}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-lg flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="contact-nombre">Nombre</Label>
                <Input
                  type="text"
                  id="contact-nombre"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="contact-apellido">Apellido</Label>
                <Input
                  type="text"
                  id="contact-apellido"
                  placeholder="Apellido"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                type="email"
                id="contact-email"
                placeholder="tu@email.com"
                value={emailVal}
                onChange={(e) => setEmailVal(e.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="contact-telefono">Teléfono</Label>
              <Input
                type="tel"
                id="contact-telefono"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="contact-mensaje">Mensaje</Label>
              <Textarea
                id="contact-mensaje"
                placeholder="Escribe tu mensaje aquí."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar mensaje'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
