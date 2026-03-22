-- Ejecutar en Supabase SQL Editor DESPUÉS de crear la columna:
--   ALTER TABLE "Propiedades" ADD COLUMN IF NOT EXISTS tipo_inmueble text;
--
-- Asigna un tipo de inmueble a las 2 propiedades más recientes (ajusta el valor y el criterio si lo necesitas).

UPDATE "Propiedades"
SET tipo_inmueble = 'Casa'
WHERE id IN (
  SELECT id
  FROM "Propiedades"
  ORDER BY created_at DESC NULLS LAST
  LIMIT 2
);

-- Para asignar distinto tipo por fila, usa UPDATE por id concreto:
-- UPDATE "Propiedades" SET tipo_inmueble = 'Departamento' WHERE id = 'uuid-aqui';
