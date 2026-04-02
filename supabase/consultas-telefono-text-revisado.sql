-- =============================================================================
-- Altum Capital · Tabla public.consultas
-- Ejecutar en Supabase → SQL Editor (una sola vez por proyecto)
-- =============================================================================
-- El formulario web envía teléfono como TEXTO (+52, espacios, 10 dígitos).
-- Columnas numéricas (int4 / int8 / bigint) rompen números largos o el símbolo +.
-- =============================================================================

-- 1) Revisado (badge de pendientes en admin). Omitir si ya existe.
ALTER TABLE public.consultas
  ADD COLUMN IF NOT EXISTS revisado boolean NOT NULL DEFAULT false;

-- 2) Teléfono → TEXT
--    Si la columna NO existe aún:
--    ALTER TABLE public.consultas ADD COLUMN telefono text;
--
--    Si ya existe como entero (int4, int8, bigint), convierte valores a texto:
ALTER TABLE public.consultas
  ALTER COLUMN telefono TYPE text USING (
    CASE WHEN telefono IS NULL THEN NULL ELSE telefono::text END
  );

-- 3) (Opcional) Mover "Teléfono: ..." del mensaje a la columna telefono
UPDATE public.consultas c
SET
  telefono = NULLIF(trim(x.m[1]), ''),
  mensaje = NULLIF(trim(COALESCE(x.m[2], '')), '')
FROM (
  SELECT
    id,
    regexp_match(mensaje, '^Teléfono:\s*([^\n]+)\n\n([\s\S]*)') AS m
  FROM public.consultas
  WHERE mensaje ~ '^Teléfono:'
    AND (telefono IS NULL OR btrim(telefono) = '')
) x
WHERE c.id = x.id
  AND x.m IS NOT NULL;

-- 4) Índice opcional para contar pendientes
CREATE INDEX IF NOT EXISTS consultas_revisado_idx
  ON public.consultas (revisado)
  WHERE revisado = false;

-- Tras esto: en Dashboard → Settings → API, "Reload schema" si PostgREST cachea viejo.
