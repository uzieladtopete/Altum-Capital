/**
 * Lista fija de amenidades por categoría para Crear/Editar propiedad.
 * El admin marca con check las que aplican; se guardan como arrays en la BD.
 * La categoría "otro" no tiene lista fija: el usuario ingresa texto libre (una por línea).
 */
export const AMENIDADES_OPCIONES = {
  general: [
    'Accesibilidad para adultos mayores',
    'Portero',
    'Cocina integral',
    'Seguridad 24 horas',
    'Elevador',
    'Aire acondicionado',
    'Calefacción',
    'Cisterna',
    'Tinaco',
  ],
  politicas: [
    'Mascotas permitidas',
    'Mascotas no permitidas',
    'Fumadores permitidos',
    'Renta de muebles',
  ],
  recreacion: [
    'Alberca',
    'Gimnasio',
    'Salón de usos múltiples',
    'Área de juegos infantiles',
    'Terraza',
    'Jardín',
    'Área de BBQ',
    'Roof garden',
  ],
}
