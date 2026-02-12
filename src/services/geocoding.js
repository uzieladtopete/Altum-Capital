/**
 * Geocodificación mediante OpenStreetMap Nominatim.
 * En el futuro se puede sustituir por otro proveedor (Google, Mapbox, etc.) sin cambiar la interfaz.
 * @see https://nominatim.org/release-docs/develop/api/Search/
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'AltumCapital-WebApp/1.0'

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
