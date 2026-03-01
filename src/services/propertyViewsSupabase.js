import { supabase } from '../lib/supabase'

const TABLE = 'property_views'

/**
 * Registra una vista a la página de detalle de una propiedad.
 * Llamar desde PropiedadDetailPage al montar (una vez por visita).
 */
export async function recordPropertyView(propertyId) {
  if (!supabase || !propertyId) return
  try {
    await supabase.from(TABLE).insert({ property_id: propertyId })
  } catch (e) {
    console.warn('[property_views] No se pudo registrar la vista:', e?.message)
  }
}

/**
 * Devuelve estadísticas de visitas para el mes actual (vía RPC en la BD).
 * Solo tiene sentido con usuario autenticado (RLS permite ejecutar la función a authenticated).
 * @returns { Promise<{ visitasDelMes: number, promedioVisitas: number | null, topByViews: Array<{ property_id: string, count: number }> }> }
 */
export async function getPropertyViewStats(totalPropiedades = 0) {
  if (!supabase) {
    return { visitasDelMes: 0, promedioVisitas: null, topByViews: [] }
  }
  try {
    const { data, error } = await supabase.rpc('get_property_view_stats', { limite: 10 })
    if (error) throw error
    const row = Array.isArray(data) ? data[0] : data
    const visitasDelMes = row?.visitas_del_mes ?? 0
    const topByViews = Array.isArray(row?.top_by_views) ? row.top_by_views : []
    const promedioVisitas = totalPropiedades > 0 ? Math.round(visitasDelMes / totalPropiedades) : null
    return { visitasDelMes, promedioVisitas, topByViews }
  } catch (e) {
    console.warn('[property_views] Error al obtener estadísticas:', e?.message)
    return { visitasDelMes: 0, promedioVisitas: null, topByViews: [] }
  }
}
