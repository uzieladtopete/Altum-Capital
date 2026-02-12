/**
 * Geocodificación mediante OpenStreetMap Nominatim.
 * En el futuro se puede sustituir por otro proveedor (Google, Mapbox, etc.) sin cambiar la interfaz.
 * @see https://nominatim.org/release-docs/develop/api/Search/
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'AltumCapital-WebApp/1.0'

/** Centro por defecto (Guadalajara) cuando no hay dirección ni marcador */
export const DEFAULT_CENTER = { lat: 20.6597, lng: -103.3496 }

/**
 * Convierte una dirección en coordenadas lat/lng.
 * @param {string} address - Dirección completa (ej. "Av. Naciones Unidas 6700, Zapopan, Jalisco")
 * @returns {Promise<{ lat: number, lng: number } | null>} Coordenadas o null si no hay resultados/error
 */
export async function geocodeAddress(address) {
  const trimmed = address?.trim()
  if (!trimmed) return null

  try {
    const params = new URLSearchParams({
      q: trimmed,
      format: 'json',
      limit: '1',
    })
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { 'User-Agent': USER_AGENT },
    })
    if (!res.ok) return null
    const data = await res.json()
    const first = data?.[0]
    if (!first?.lat || !first?.lon) return null
    return {
      lat: Number(first.lat),
      lng: Number(first.lon),
    }
  } catch {
    return null
  }
}

/**
 * Busca sugerencias de dirección para autocompletado (Nominatim).
 * @param {string} query - Texto parcial de la dirección
 * @returns {Promise<Array<{ display_name: string, lat: number, lng: number }>>} Lista de sugerencias
 */
export async function searchAddressSuggestions(query) {
  const trimmed = query?.trim()
  if (!trimmed || trimmed.length < 3) return []

  try {
    const params = new URLSearchParams({
      q: trimmed,
      format: 'json',
      limit: '5',
      addressdetails: '0',
      countrycodes: 'mx',
    })
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { 'User-Agent': USER_AGENT },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data
      .filter((item) => item?.lat != null && item?.lon != null)
      .map((item) => ({
        display_name: item.display_name ?? '',
        lat: Number(item.lat),
        lng: Number(item.lon),
      }))
  } catch {
    return []
  }
}
