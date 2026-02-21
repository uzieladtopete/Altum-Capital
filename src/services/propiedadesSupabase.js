import { supabase } from '../lib/supabase'

// Nombre de la tabla: debe coincidir con Supabase (tu captura muestra "Propiedades" con P mayúscula)
const TABLE = 'Propiedades'

// Mientras no tengas estas columnas en Supabase, no las enviamos.
// Cuando las agregues (ver SUPABASE-CAMPOS-DETALLE-PROP.md), cambia a false.
const SKIP_COLUMNAS_NUEVAS = true

const mapToDB = (prop) => {
  if (prop == null) return prop
  // Convertir lng (código) -> long (base de datos)
  const { lng, ...rest } = prop
  const out = lng !== undefined ? { ...rest, long: lng } : rest
  
  if (!SKIP_COLUMNAS_NUEVAS) return out
  // Omitir campos que aún no existen en la tabla de Supabase
  const {
    amenidades,
    galeria,
    recamaras,
    banos,
    estacionamientos,
    anio_construccion,
    piso,
    ...restFiltered
  } = out
  return { ...restFiltered }
}
const mapFromDB = (prop) => {
  if (prop == null) return prop
  // Convertir long (base de datos) -> lng (código)
  const { long, ...rest } = prop
  return long !== undefined ? { ...rest, lng: long } : rest
}

export async function getPropiedades(filters = {}) {
  let query = supabase.from(TABLE).select('*')

  // Aplicar filtros
  if (filters.ciudad) {
    query = query.eq('ciudad', filters.ciudad)
  }
  if (filters.tipo) {
    query = query.eq('tipo', filters.tipo)
  }
  if (filters.minPrecio) {
    query = query.gte('precio', Number(filters.minPrecio))
  }
  if (filters.maxPrecio) {
    query = query.lte('precio', Number(filters.maxPrecio))
  }
  if (filters.minM2) {
    query = query.gte('m2', Number(filters.minM2))
  }
  if (filters.maxM2) {
    query = query.lte('m2', Number(filters.maxM2))
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching propiedades:', error)
    return []
  }

  // Convertir long -> lng para el código
  return (data || []).map(mapFromDB)
}

export async function getPropiedadById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching propiedad:', error)
    return null
  }

  return data ? mapFromDB(data) : null
}

export async function createPropiedad(propiedad) {
  // Convertir lng -> long para la base de datos
  const dbProp = mapToDB(propiedad)
  
  const { data, error } = await supabase
    .from(TABLE)
    .insert([dbProp])
    .select()
    .single()

  if (error) {
    console.error('Error creating propiedad:', error)
    throw error
  }

  return data ? mapFromDB(data) : null
}

export async function updatePropiedad(id, updates) {
  // Convertir lng -> long para la base de datos
  const dbUpdates = mapToDB(updates)
  
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...dbUpdates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating propiedad:', error)
    throw error
  }

  return data ? mapFromDB(data) : null
}

export async function deletePropiedad(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting propiedad:', error)
    throw error
  }
}
