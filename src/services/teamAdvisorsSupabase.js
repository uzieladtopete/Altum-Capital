import { supabase } from '../lib/supabase'

const TABLE = 'team_advisors'

/**
 * Obtiene asesores desde Supabase (RLS debe permitir select a `public`).
 */
export async function getTeamAdvisors() {
  if (!supabase) return []

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, description, phone, email, image_url, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[teamAdvisorsSupabase] getTeamAdvisors:', error.message || error)
    return []
  }

  return data || []
}

/**
 * Crea un nuevo asesor.
 */
export async function createAdvisor(payload) {
  if (!supabase) throw new Error('Supabase no configurado')

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: payload.name,
      description: payload.description || '',
      phone: payload.phone || '',
      email: payload.email || '',
      image_url: payload.image_url || '',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Actualiza un asesor existente por ID.
 */
export async function updateAdvisor(id, payload) {
  if (!supabase) throw new Error('Supabase no configurado')

  const updates = {}
  if (payload.name !== undefined) updates.name = payload.name
  if (payload.description !== undefined) updates.description = payload.description
  if (payload.phone !== undefined) updates.phone = payload.phone
  if (payload.email !== undefined) updates.email = payload.email
  if (payload.image_url !== undefined) updates.image_url = payload.image_url

  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Elimina un asesor por ID.
 */
export async function deleteAdvisor(id) {
  if (!supabase) throw new Error('Supabase no configurado')

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) throw error
}

/**
 * Suscripción en tiempo real a cambios en la tabla team_advisors.
 * Devuelve la suscripción para poder hacer .unsubscribe() al desmontar.
 */
export function subscribeToAdvisors(callback) {
  if (!supabase) return null

  const channel = supabase
    .channel('team_advisors_realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE },
      (payload) => {
        callback(payload)
      },
    )
    .subscribe()

  return channel
}
