import { supabase } from '../lib/supabase'

const TABLE = 'consultas'

/**
 * Lista todas las consultas de la tabla consultas (ordenadas por created_at desc).
 * @returns {Promise<Array<{ id: string, nombre: string, email: string, mensaje: string, created_at: string }>>}
 */
export async function getConsultas() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, nombre, email, mensaje, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[consultasSupabase]', error)
    return []
  }
  return data || []
}

/**
 * Inserta una consulta (desde formulario de contacto).
 * @param {{ nombre: string, email: string, mensaje: string, telefono?: string }} payload
 * @returns {Promise<{ data?: object, error?: Error }>}
 */
export async function insertConsulta(payload) {
  if (!supabase) return { error: new Error('Supabase no configurado') }
  const { nombre, email, mensaje, telefono } = payload
  const mensajeFinal = telefono ? `Teléfono: ${telefono}\n\n${mensaje || ''}`.trim() : (mensaje || '')
  const { data, error } = await supabase.from(TABLE).insert({ nombre, email, mensaje: mensajeFinal }).select().single()
  if (error) {
    console.error('[consultasSupabase] insert', error)
    return { error }
  }
  return { data }
}
