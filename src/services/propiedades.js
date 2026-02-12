import { propiedades } from '../data/propiedades.js'

export function applyFilters(list, filters) {
  let result = [...list]
  if (filters.ciudad) result = result.filter((p) => p.ciudad === filters.ciudad)
  if (filters.tipo) result = result.filter((p) => p.tipo === filters.tipo)
  if (filters.minPrecio != null && filters.minPrecio !== '') {
    const min = Number(filters.minPrecio)
    if (!Number.isNaN(min)) result = result.filter((p) => p.precio >= min)
  }
  if (filters.maxPrecio != null && filters.maxPrecio !== '') {
    const max = Number(filters.maxPrecio)
    if (!Number.isNaN(max)) result = result.filter((p) => p.precio <= max)
  }
  if (filters.minM2 != null && filters.minM2 !== '') {
    const min = Number(filters.minM2)
    if (!Number.isNaN(min)) result = result.filter((p) => p.m2 >= min)
  }
  if (filters.maxM2 != null && filters.maxM2 !== '') {
    const max = Number(filters.maxM2)
    if (!Number.isNaN(max)) result = result.filter((p) => p.m2 <= max)
  }
  return result
}

/**
 * Obtiene propiedades filtradas. Intenta GET /api/propiedades; si falla (producción estática), filtra en cliente.
 * @param {{ ciudad?: string, zona?: string, tipo?: string, minPrecio?: string|number, maxPrecio?: string|number, minM2?: string|number, maxM2?: string|number }} filters
 * @returns {Promise<Array>}
 */
export async function getPropiedades(filters = {}) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== '') params.set(key, String(value))
  })
  try {
    const res = await fetch(`/api/propiedades?${params.toString()}`)
    if (res.ok) return res.json()
  } catch (_) {
    // fallback: no API (e.g. static deploy)
  }
  return applyFilters(propiedades, filters)
}
