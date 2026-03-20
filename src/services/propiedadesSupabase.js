import { supabase } from '../lib/supabase'
import { getPropertyImages } from './propertyImagesSupabase'

const TABLE = 'Propiedades'
const DETAILS_TABLE = 'detalles_prop'

// Campos de detalle que viven en la tabla detalles_prop (vinculada por propiedad_id)
const DETAIL_FIELDS = ['recamaras', 'banos', 'estacionamientos', 'anio_construccion', 'piso', 'amenidades', 'titulo']

const mapToDB = (prop) => {
  if (prop == null) return prop
  const { lng, ...rest } = prop
  const out = lng !== undefined ? { ...rest, long: lng } : rest
  // En Propiedades van todos menos los que viven en detalles_prop; galeria no se guarda aquí (se usa property_images)
  const { amenidades, recamaras, banos, estacionamientos, anio_construccion, piso, galeria, ...restFiltered } = out
  return { ...restFiltered }
}

/** Extrae solo los campos que se guardan en detalles_prop */
function toDetallesRow(propiedadId, prop) {
  if (prop == null) return null
  const amenidades = prop.amenidades && typeof prop.amenidades === 'object'
    ? {
        general: Array.isArray(prop.amenidades.general) ? prop.amenidades.general : [],
        politicas: Array.isArray(prop.amenidades.politicas) ? prop.amenidades.politicas : [],
        recreacion: Array.isArray(prop.amenidades.recreacion) ? prop.amenidades.recreacion : [],
      }
    : { general: [], politicas: [], recreacion: [] }
  return {
    propiedad_id: propiedadId,
    titulo: prop.titulo ?? null,
    recamaras: prop.recamaras ?? null,
    banos: prop.banos ?? null,
    estacionamientos: prop.estacionamientos ?? null,
    anio_construccion: prop.anio_construccion ?? null,
    piso: prop.piso ?? null,
    amenidades,
    updated_at: new Date().toISOString(),
  }
}

/** Normaliza amenidades (puede venir como objeto, string JSON o null) */
function normalizeAmenidades(val) {
  if (val == null) return { general: [], politicas: [], recreacion: [] }
  if (typeof val === 'string') {
    try { val = JSON.parse(val) } catch (_) { return { general: [], politicas: [], recreacion: [] } }
  }
  if (typeof val !== 'object') return { general: [], politicas: [], recreacion: [] }
  return {
    general: Array.isArray(val.general) ? val.general : [],
    politicas: Array.isArray(val.politicas) ? val.politicas : [],
    recreacion: Array.isArray(val.recreacion) ? val.recreacion : [],
  }
}

/** Une una fila de Propiedades con su detalles_prop en un solo objeto para la app */
function mapFromDB(row) {
  if (row == null) return row
  const { long, detalles_prop, ...rest } = row
  const out = long !== undefined ? { ...rest, lng: long } : rest
  const det = Array.isArray(detalles_prop) ? detalles_prop[0] : detalles_prop
  if (det && typeof det === 'object') {
    out.recamaras = det.recamaras ?? undefined
    out.banos = det.banos ?? undefined
    out.estacionamientos = det.estacionamientos ?? undefined
    out.anio_construccion = det.anio_construccion ?? undefined
    out.piso = det.piso ?? undefined
    out.amenidades = normalizeAmenidades(det.amenidades)
    if (det.titulo != null) out.titulo = row.titulo ?? det.titulo
  }
  return out
}

const selectWithDetails = '*, detalles_prop(*)'

function parseRange(str) {
  if (!str || typeof str !== 'string') return {}
  const [minStr, maxStr] = str.split('-')
  const min = minStr ? Number(minStr) : undefined
  const max = maxStr ? Number(maxStr) : undefined
  return {
    min: min != null && !Number.isNaN(min) ? min : undefined,
    max: max != null && !Number.isNaN(max) ? max : undefined,
  }
}

async function getPropiedadesWithDetails(filters) {
  let query = supabase.from(TABLE).select(selectWithDetails)

  // Legacy filters (backward-compat)
  if (filters.ciudad) query = query.ilike('ciudad', `%${filters.ciudad}%`)
  if (filters.tipo) query = query.eq('tipo', filters.tipo)
  if (filters.minPrecio) query = query.gte('precio', Number(filters.minPrecio))
  if (filters.maxPrecio) query = query.lte('precio', Number(filters.maxPrecio))
  if (filters.minM2) query = query.gte('m2', Number(filters.minM2))
  if (filters.maxM2) query = query.lte('m2', Number(filters.maxM2))

  // New filters
  if (filters.operacion) query = query.eq('tipo', filters.operacion)
  if (filters.tipoInmueble) query = query.eq('tipo_inmueble', filters.tipoInmueble)
  if (filters.ubicacion) query = query.eq('ciudad', filters.ubicacion)

  if (filters.precio) {
    const { min, max } = parseRange(filters.precio)
    if (min !== undefined) query = query.gte('precio', min)
    if (max !== undefined) query = query.lte('precio', max)
  }
  if (filters.tamano) {
    const { min, max } = parseRange(filters.tamano)
    if (min !== undefined) query = query.gte('m2', min)
    if (max !== undefined) query = query.lte('m2', max)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return { data, error }

  // Client-side filtering for detalles_prop fields (recamaras, banos, estacionamientos)
  let results = data || []
  if (filters.cuartos) {
    const min = Number(filters.cuartos)
    results = results.filter((p) => {
      const det = Array.isArray(p.detalles_prop) ? p.detalles_prop[0] : p.detalles_prop
      const val = det?.recamaras
      return val != null && Number(val) >= min
    })
  }
  if (filters.banos) {
    const min = Number(filters.banos)
    results = results.filter((p) => {
      const det = Array.isArray(p.detalles_prop) ? p.detalles_prop[0] : p.detalles_prop
      const val = det?.banos
      return val != null && Number(val) >= min
    })
  }
  if (filters.estacionamientos) {
    const min = Number(filters.estacionamientos)
    results = results.filter((p) => {
      const det = Array.isArray(p.detalles_prop) ? p.detalles_prop[0] : p.detalles_prop
      const val = det?.estacionamientos
      return val != null && Number(val) >= min
    })
  }

  return { data: results, error: null }
}

export async function getPropiedades(filters = {}) {
  if (!supabase) throw new Error('Supabase no configurado')
  let { data, error } = await getPropiedadesWithDetails(filters)
  if (error) {
    let q = supabase.from(TABLE).select('*')
    if (filters.ciudad) q = q.ilike('ciudad', `%${filters.ciudad}%`)
    if (filters.tipo) q = q.eq('tipo', filters.tipo)
    if (filters.operacion) q = q.eq('tipo', filters.operacion)
    if (filters.tipoInmueble) q = q.eq('tipo_inmueble', filters.tipoInmueble)
    if (filters.ubicacion) q = q.eq('ciudad', filters.ubicacion)
    if (filters.minPrecio) q = q.gte('precio', Number(filters.minPrecio))
    if (filters.maxPrecio) q = q.lte('precio', Number(filters.maxPrecio))
    if (filters.minM2) q = q.gte('m2', Number(filters.minM2))
    if (filters.maxM2) q = q.lte('m2', Number(filters.maxM2))
    if (filters.precio) {
      const { min, max } = parseRange(filters.precio)
      if (min !== undefined) q = q.gte('precio', min)
      if (max !== undefined) q = q.lte('precio', max)
    }
    if (filters.tamano) {
      const { min, max } = parseRange(filters.tamano)
      if (min !== undefined) q = q.gte('m2', min)
      if (max !== undefined) q = q.lte('m2', max)
    }
    const res = await q.order('created_at', { ascending: false })
    if (res.error) {
      console.error('Error fetching propiedades:', res.error)
      return []
    }
    return (res.data || []).map(mapFromDB)
  }
  return (data || []).map(mapFromDB)
}

export async function getPropiedadById(id) {
  if (!supabase) return null
  let { data, error } = await supabase
    .from(TABLE)
    .select(selectWithDetails)
    .eq('id', id)
    .single()
  if (error) {
    const res = await supabase.from(TABLE).select('*').eq('id', id).single()
    if (res.error) {
      console.error('Error fetching propiedad:', res.error)
      return null
    }
    data = res.data
    if (data) {
      const { data: detData } = await supabase
        .from(DETAILS_TABLE)
        .select('*')
        .eq('propiedad_id', id)
        .maybeSingle()
      data = { ...data, detalles_prop: detData ? [detData] : [] }
    }
  }
  if (!data) return null
  const out = mapFromDB(data)
  const images = await getPropertyImages(id)
  if (images.length) {
    const cover = images.find((i) => i.is_cover) || images[0]
    out.imagen = cover?.image_url ?? out.imagen
    out.galeria = images.map((i) => i.image_url).filter(Boolean)
    out.property_images = images
  }
  return out
}

export async function createPropiedad(propiedad) {
  if (!supabase) throw new Error('Supabase no configurado')
  const dbProp = mapToDB(propiedad)
  const now = new Date().toISOString()
  const row = {
    ...dbProp,
    created_at: dbProp.created_at || now,
    updated_at: dbProp.updated_at || now,
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert([row])
    .select()
    .single()

  if (error) {
    console.error('Error creating propiedad:', error)
    throw error
  }

  const id = data?.id
  if (id) {
    const detallesRow = toDetallesRow(id, propiedad)
    if (detallesRow) {
      const { error: errDet } = await supabase.from(DETAILS_TABLE).insert([detallesRow])
      if (errDet) console.error('Error creating detalles_prop:', errDet)
    }
  }

  const full = id ? await getPropiedadById(id) : null
  return full ?? (data ? mapFromDB(data) : null)
}

export async function updatePropiedad(id, updates) {
  if (!supabase) throw new Error('Supabase no configurado')
  let dbUpdates = mapToDB(updates)
  const hasDetailFields = DETAIL_FIELDS.some((f) => updates[f] !== undefined)

  let { data, error } = await supabase
    .from(TABLE)
    .update({ ...dbUpdates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error && (error.message || '').toLowerCase().includes('galeria')) {
    const { galeria, ...safe } = dbUpdates
    const res = await supabase
      .from(TABLE)
      .update({ ...safe, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (!res.error) {
      data = res.data
      error = null
    }
  }

  if (error) {
    console.error('Error updating propiedad:', error)
    throw error
  }

  if (hasDetailFields) {
    const detallesRow = toDetallesRow(id, updates)
    if (detallesRow) {
      const { error: errUpsert } = await supabase
        .from(DETAILS_TABLE)
        .upsert([detallesRow], { onConflict: 'propiedad_id' })
      if (errUpsert) console.error('Error upserting detalles_prop:', errUpsert)
    }
  }

  const withDetails = await getPropiedadById(id)
  return withDetails ?? (data ? mapFromDB(data) : null)
}

export async function deletePropiedad(id) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    console.error('Error deleting propiedad:', error)
    throw error
  }
}
