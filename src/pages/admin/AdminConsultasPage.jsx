import { useState, useEffect, useCallback } from 'react'
import { getConsultas, updateConsultaRevisado } from '../../services/consultasSupabase'
import { ContactsTable } from '../../components/ui/contacts-table-with-modal'
import { useToast } from '../../context/ToastContext'

/**
 * Filas antiguas: teléfono incrustado en mensaje ("Teléfono: ...\n\n...").
 * Supabase devuelve INT8/BIGINT como número en JSON: jamás llamar .trim() directo.
 */
function splitLegacyMensaje(mensaje, telefonoDb) {
  const t =
    telefonoDb != null && telefonoDb !== ''
      ? String(telefonoDb).trim()
      : ''
  if (t) return { phone: t, description: String(mensaje ?? '').trim() }
  const raw = String(mensaje ?? '')
  const m = raw.match(/^Teléfono:\s*([^\n]+)\n\n([\s\S]*)$/)
  if (m) return { phone: m[1].trim(), description: (m[2] || '').trim() }
  return { phone: '', description: raw.trim() }
}

/**
 * Mapea una fila de la tabla "consultas" al formato Contact de la tabla UI.
 */
/** Valor boolean `revisado` desde PostgREST / JSON. */
function isRevisadoDb(v) {
  return v === true || v === 'true' || v === 't' || v === 1
}

function mapConsultaToContact(row) {
  const { phone, description } = splitLegacyMensaje(row.mensaje, row.telefono)
  return {
    id: row.id,
    name: row.nombre ?? '',
    email: row.email ?? '',
    phone,
    connectionStrength: 'Good',
    twitterFollowers: 0,
    description,
    created_at: row.created_at,
    revisado: isRevisadoDb(row.revisado),
  }
}

export default function AdminConsultasPage() {
  const { addToast } = useToast()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [revisadoSavingId, setRevisadoSavingId] = useState(null)

  const load = useCallback(async (opts = {}) => {
    const silent = opts.silent === true
    if (!silent) setLoading(true)
    try {
      const rows = await getConsultas()
      setContacts(rows.map(mapConsultaToContact))
    } catch (err) {
      console.error(err)
      if (!silent) setContacts([])
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleRevisadoChange = useCallback(
    async (id, revisado) => {
      setRevisadoSavingId(id)
      setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, revisado } : c)))
      const { error, data } = await updateConsultaRevisado(id, revisado)
      setRevisadoSavingId(null)
      if (error) {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, revisado: !revisado } : c)))
        addToast({
          type: 'error',
          message:
            typeof error.message === 'string'
              ? error.message
              : 'No se pudo guardar el estado de revisado.',
        })
        return
      }
      if (data) {
        setContacts((prev) =>
          prev.map((c) => (c.id === data.id ? { ...c, revisado: data.revisado } : c))
        )
      }
      window.dispatchEvent(new CustomEvent('altum-consultas-count-refresh'))
    },
    [addToast]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Cargando consultas...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-6 md:py-12">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold text-foreground">Consultas / Contacto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Marca la casilla de <strong>revisado</strong> (columna con ✓) cuando hayas atendido la consulta; el número junto a Panel Admin son las pendientes.
          </p>
        </div>
        <ContactsTable
          title="Nombre"
          contacts={contacts}
          showConnectionColumn={false}
          showTwitterColumn={false}
          showPhoneColumn
          showRevisadoColumn
          revisadoSavingId={revisadoSavingId}
          onRevisadoChange={handleRevisadoChange}
        />
      </div>
    </div>
  )
}
