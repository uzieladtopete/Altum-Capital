-- Rellenar detalles_prop con una fila por cada propiedad existente.
-- Así las propiedades ya creadas quedan "anexadas" y se ven en la app.
-- Ejecutar UNA VEZ en Supabase > SQL Editor > Run.

INSERT INTO public.detalles_prop (propiedad_id, titulo, recamaras, banos, estacionamientos, anio_construccion, piso, amenidades)
SELECT
  p.id,
  p.titulo,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '{"general":[],"politicas":[],"recreacion":[]}'::jsonb
FROM public."Propiedades" p
ON CONFLICT (propiedad_id) DO NOTHING;
