-- Añadir columna galeria a Propiedades (lista de URLs de fotos).
-- Ejecutar en Supabase > SQL Editor > Run.

ALTER TABLE public."Propiedades"
ADD COLUMN IF NOT EXISTS galeria jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public."Propiedades".galeria IS 'Array de URLs de galería (JSON).';
