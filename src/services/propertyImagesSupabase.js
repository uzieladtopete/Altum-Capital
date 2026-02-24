/**
 * CRUD de imágenes de propiedad en Supabase (tabla property_images).
 * Solo almacena URLs devueltas por Cloudinary; no usa Supabase Storage.
 */

import { supabase } from '../lib/supabase'

const TABLE = 'property_images'

/**
 * Obtiene todas las imágenes de una propiedad, ordenadas por order_index.
 * @param {string} propertyId - uuid de la propiedad
 * @returns {Promise<Array<{ id: string, property_id: string, image_url: string, is_cover: boolean, order_index: number, created_at: string }>>}
 */
export async function getPropertyImages(propertyId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, property_id, image_url, is_cover, order_index, created_at')
    .eq('property_id', propertyId)
    .order('order_index', { ascending: true })
  if (error) {
    console.error('getPropertyImages:', error)
    return []
  }
  return data || []
}

/**
 * Inserta varias imágenes para una propiedad.
 * @param {string} propertyId
 * @param {Array<{ image_url: string, is_cover?: boolean, order_index?: number }>} images
 * @returns {Promise<{ data?: any[], error?: any }>}
 */
export async function insertPropertyImages(propertyId, images) {
  if (!supabase) throw new Error('Supabase no configurado')
  if (!propertyId || !images?.length) return { data: [] }
  const rows = images.map((img, i) => ({
    property_id: propertyId,
    image_url: img.image_url,
    is_cover: Boolean(img.is_cover),
    order_index: img.order_index ?? i,
  }))
  const { data, error } = await supabase.from(TABLE).insert(rows).select()
  if (error) {
    console.error('insertPropertyImages:', error)
    throw error
  }
  return { data: data || [] }
}

/**
 * Marca una imagen como portada y desmarca las demás de esa propiedad.
 * @param {string} propertyId
 * @param {string} imageId - id de la fila en property_images
 */
export async function setCoverImage(propertyId, imageId) {
  if (!supabase) throw new Error('Supabase no configurado')
  await supabase.from(TABLE).update({ is_cover: false }).eq('property_id', propertyId)
  const { error } = await supabase.from(TABLE).update({ is_cover: true }).eq('id', imageId).eq('property_id', propertyId)
  if (error) throw error
}

/**
 * Actualiza el orden de las imágenes (array de ids en el orden deseado).
 * @param {string} propertyId
 * @param {string[]} orderedIds - ids de property_images en el orden final
 */
export async function updateImagesOrder(propertyId, orderedIds) {
  if (!supabase || !orderedIds?.length) return
  const updates = orderedIds.map((id, index) =>
    supabase.from(TABLE).update({ order_index: index }).eq('id', id).eq('property_id', propertyId)
  )
  await Promise.all(updates)
}

/**
 * Elimina una imagen de la propiedad.
 * @param {string} imageId
 */
export async function deletePropertyImage(imageId) {
  if (!supabase) throw new Error('Supabase no configurado')
  const { error } = await supabase.from(TABLE).delete().eq('id', imageId)
  if (error) throw error
}

/**
 * Elimina todas las imágenes de una propiedad (p. ej. al reemplazar galería).
 * @param {string} propertyId
 */
export async function deleteAllPropertyImages(propertyId) {
  if (!supabase) return
  await supabase.from(TABLE).delete().eq('property_id', propertyId)
}
