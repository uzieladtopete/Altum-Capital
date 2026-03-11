import { useState, useEffect } from 'react'
import { getConsultas } from '../../services/consultasSupabase'
import { ContactsTable } from '../../components/ui/contacts-table-with-modal'

/**
 * Mapea una fila de la tabla "consultas" (Supabase) al formato Contact de la tabla.
 * consultas: id, nombre, email, mensaje, created_at
 */
function mapConsultaToContact(row) {
  return {
    id: row.id,
    name: row.nombre ?? '',
    email: row.email ?? '',
    connectionStrength: 'Good',
    twitterFollowers: 0,
    description: row.mensaje ?? '',
    created_at: row.created_at,
  }
}

export default function AdminConsultasPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getConsultas()
      .then((rows) => {
        if (!cancelled) {
          setContacts(rows.map(mapConsultaToContact))
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err)
          setContacts([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

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
        </div>
        <ContactsTable
          title="Nombre"
          contacts={contacts}
          showConnectionColumn={false}
          showTwitterColumn={false}
        />
      </div>
    </div>
  )
}
