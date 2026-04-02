import { supabase } from '../lib/supabase'

const TABLE = 'consultas'

/**
 * Lista todas las consultas (created_at desc).
 * Requiere columna revisado en Supabase (ver supabase/consultas-telefono-text-revisado.sql).
 */
export async function getConsultas() {
  if (!supabase) return []
  const full = await supabase
    .from(TABLE)
    .select('id, nombre, email, mensaje, telefono, revisado, created_at')
    .order('created_at', { ascending: false })
  if (!full.error) return full.data || []

  const errBlob = `${String(full.error.message || '')} ${String(full.error.details || '')}`.toLowerCase()
  const useLegacyWithoutRevisado =
    errBlob.includes('revisado') ||
    errBlob.includes('schema cache') ||
    (errBlob.includes('column') && errBlob.includes('does not exist'))

  if (!useLegacyWithoutRevisado) {
    console.error('[consultasSupabase] getConsultas', full.error)
    return []
  }

  const legacy = await supabase
    .from(TABLE)
    .select('id, nombre, email, mensaje, telefono, created_at')
    .order('created_at', { ascending: false })
  if (!legacy.error) {
    return (legacy.data || []).map((row) => ({ ...row, revisado: false }))
  }
  console.error('[consultasSupabase] getConsultas legacy', legacy.error)
  return []
}

/**
 * Consultas sin marcar como revisadas (badge Navbar).
 * Usa el mismo SELECT que la lista (no count head-only), porque con RLS el conteo agregado a veces devuelve 0 o falla.
 */
export async function countConsultasNoRevisadas() {
  if (!supabase) return 0
  const r = await supabase.from(TABLE).select('id, revisado')
  if (r.error) {
    const r2 = await supabase.from(TABLE).select('id')
    if (r2.error) {
      console.error('[consultasSupabase] countConsultasNoRevisadas', r.error, r2.error)
      return 0
    }
    return r2.data?.length ?? 0
  }
  const rows = r.data || []
  return rows.filter((row) => row.revisado !== true).length
}

/**
 * Marca una consulta como revisada o pendiente.
 * Usa .select() para comprobar filas afectadas: sin política RLS UPDATE suele devolver 0 filas sin error.
 * @returns {Promise<{ data?: { id: string, revisado: boolean }, error?: object }>}
 */
export async function updateConsultaRevisado(id, revisado) {
  if (!supabase) return { error: { message: 'Supabase no configurado' } }
  const idStr = String(id).trim()

  const { data, error } = await supabase
    .from(TABLE)
    .update({ revisado: Boolean(revisado) })
    .eq('id', idStr)
    .select('id, revisado')

  if (error) {
    const msg = `${String(error.message || '')} ${String(error.details || '')}`.toLowerCase()
    if (msg.includes('revisado') || msg.includes('schema cache')) {
      return {
        error: {
          message:
            'No se pudo usar la columna revisado. Revisa que exista y recarga el esquema en Supabase (API → Reload schema).',
        },
      }
    }
    if (msg.includes('row-level security') || msg.includes('rls') || error.code === '42501') {
      return {
        error: {
          message:
            'Sin permiso para guardar “revisado”. En Supabase → Authentication → Policies, añade UPDATE en la tabla consultas para admins (guía: supabase/consultas-rls-revisado.sql).',
        },
      }
    }
    console.error('[consultasSupabase] updateConsultaRevisado', error)
    return { error }
  }

  const rows = Array.isArray(data) ? data : data != null ? [data] : []
  if (rows.length === 0) {
    return {
      error: {
        message:
          'No se guardó el cambio (0 filas actualizadas). Casi siempre falta una política RLS que permita UPDATE en public.consultas para usuarios autenticados admin. Abre supabase/consultas-rls-revisado.sql, ejecútalo en el SQL Editor y prueba de nuevo.',
      },
    }
  }

  const row = rows[0]
  return { data: { id: row.id, revisado: row.revisado === true } }
}

/**
 * Inserta una consulta (formulario de contacto).
 * `telefono` debe ser columna **text** en Supabase (ver consultas-telefono-text-revisado.sql).
 * Si la BD sigue con entero o sin columna, un intento legacy guarda el teléfono dentro de mensaje.
 */
export async function insertConsulta(payload) {
  if (!supabase) return { error: { message: 'Supabase no configurado (faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY en el build).' } }
  const { nombre, email, mensaje, telefono } = payload
  const telRaw = telefono != null && String(telefono).trim() !== '' ? String(telefono).trim() : null
  const msgTrim = (mensaje || '').trim()
  const mensajeBody = msgTrim || null

  const legacyMensajeConTel = telRaw
    ? `Teléfono: ${telRaw}\n\n${msgTrim}`.trim()
    : msgTrim || null

  const rowPreferred = {
    nombre,
    email,
    mensaje: mensajeBody,
    ...(telRaw ? { telefono: telRaw } : {}),
  }

  let { data, error } = await supabase.from(TABLE).insert(rowPreferred).select().single()

  const errText = `${String(error?.message || '')} ${String(error?.details || '')} ${String(error?.hint || '')}`.toLowerCase()

  const looksLikeMissingTelefonoCol =
    error &&
    errText.includes('telefono') &&
    (errText.includes('does not exist') ||
      errText.includes('could not find') ||
      errText.includes('schema cache') ||
      errText.includes('column'))
  const looksLikeIntegerProblem =
    error &&
    (/out of range/i.test(errText) ||
      /invalid input/i.test(errText) ||
      /type integer/i.test(errText) ||
      /bigint/i.test(errText))

  if (error && (looksLikeMissingTelefonoCol || looksLikeIntegerProblem)) {
    const retry = await supabase
      .from(TABLE)
      .insert({ nombre, email, mensaje: legacyMensajeConTel })
      .select()
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) {
    console.error('[consultasSupabase] insert', error)
  }
  return error ? { error } : { data }
}
