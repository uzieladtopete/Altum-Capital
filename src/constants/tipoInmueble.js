/** Valores permitidos para la columna `tipo_inmueble` (mismo criterio que el filtro público). */
export const TIPOS_INMUEBLE_VALUES = [
  'Casa',
  'Casa en condominio',
  'Departamento',
  'Terreno',
  'Local Comercial',
  'Oficina',
  'Bodega',
]

const asOptions = (values) => values.map((v) => ({ value: v, label: v }))

/** Select en admin (crear / editar) */
export const TIPOS_INMUEBLE_OPTIONS_ADMIN = [
  { value: '', label: 'Selecciona tipo de inmueble' },
  ...asOptions(TIPOS_INMUEBLE_VALUES),
]

/** Select en Filtro (resultados) */
export const TIPOS_INMUEBLE_OPTIONS_FILTRO = [
  { value: '', label: 'Tipo de Inmueble' },
  ...asOptions(TIPOS_INMUEBLE_VALUES),
]
