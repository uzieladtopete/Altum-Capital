/**
 * Amenidades personalizadas ("otro") en Supabase.
 * Al guardar una propiedad, las amenidades de texto libre se guardan aquí para aparecer como opciones al crear otra.
 */

import { supabase } from '../lib/supabase'

const TABLE = 'amenidades_opciones'
const CATEGORIAS = ['general', 'politicas', 'recreacion']

/**
 * Obtiene todas las amenidades personalizadas por categoría.
 * @returns {Promise<{ general: string[], politicas: string[], recreacion: string[] }>}
 */
export async function getAmenidadesOpciones() {
  if (!supabase) return { general: [], politicas: [], recreacion: [] }
  const { data, error } = await supabase
    .from(TABLE)
    .select('categoria, nombre')
    .in('categoria', CATEGORIAS)
    .order('nombre', { ascending: true })
  if (error) {
    console.error('getAmenidadesOpciones:', error)
    return { general: [], politicas: [], recreacion: [] }
  }
  const out = { general: [], politicas: [], recreacion: [] }
  for (const row of data || []) {
    if (out[row.categoria] && !out[row.categoria].includes(row.nombre)) {
      out[row.categoria].push(row.nombre)
    }
  }
  return out
}

/**
 * Guarda amenidades personalizadas (las que el usuario escribe en "Otro") para que aparezcan como opciones después.
 * Inserta cada (categoria, nombre) ignorando duplicados.
 * @param {string} categoria - 'general' | 'politicas' | 'recreacion'
 * @param {string[]} nombres - lista de nombres a guardar
 */
export async function upsertAmenidadesOpciones(categoria, nombres) {
  if (!supabase) return
  if (!CATEGORIAS.includes(categoria) || !Array.isArray(nombres) || nombres.length === 0) return
  const trimmed = [...new Set(nombres.map((n) => String(n).trim()).filter(Boolean))]
  if (trimmed.length === 0) return
  const rows = trimmed.map((nombre) => ({ categoria, nombre }))
  const { error } = await supabase.from(TABLE).upsert(rows, {
    onConflict: 'categoria,nombre',
    ignoreDuplicates: true,
  })
  if (error) console.error('upsertAmenidadesOpciones:', error)
}
