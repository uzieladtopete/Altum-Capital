-- Tabla detalles_prop: detalles por propiedad (Recámaras, Baños, Estacionamientos, Año, Piso, Amenidades).
-- Vinculada a Propiedades por propiedad_id (FK) y opcionalmente por titulo (copia para referencia).
-- Ejecutar en Supabase: SQL Editor > New query > Pegar y Run.

-- Crear tabla detalles_prop (1:1 con Propiedades)
CREATE TABLE IF NOT EXISTS public.detalles_prop (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  propiedad_id uuid NOT NULL REFERENCES public."Propiedades"(id) ON DELETE CASCADE,
  titulo text,
  recamaras int,
  banos int,
  estacionamientos int,
  anio_construccion int,
  piso int,
  amenidades jsonb DEFAULT '{"general":[],"politicas":[],"recreacion":[]}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(propiedad_id)
);

-- Índice para joins por propiedad_id
CREATE INDEX IF NOT EXISTS idx_detalles_prop_propiedad_id ON public.detalles_prop(propiedad_id);

-- Comentarios
COMMENT ON TABLE public.detalles_prop IS 'Detalles de cada propiedad: recámaras, baños, estacionamientos, año, piso, amenidades (general, políticas, recreación).';
COMMENT ON COLUMN public.detalles_prop.propiedad_id IS 'FK a Propiedades.id';
COMMENT ON COLUMN public.detalles_prop.titulo IS 'Copia opcional del título de la propiedad (Propiedades.titulo).';
COMMENT ON COLUMN public.detalles_prop.amenidades IS 'JSON: { "general": [], "politicas": [], "recreacion": [] }';

-- RLS: permitir leer/escribir con la misma política que Propiedades (ajustar si usas RLS)
ALTER TABLE public.detalles_prop ENABLE ROW LEVEL SECURITY;

-- Política básica: permitir todo para anon/authenticated (igual que suele usarse en desarrollo).
-- En producción puedes restringir por auth.role() o por tabla Propiedades.
CREATE POLICY "Allow read detalles_prop" ON public.detalles_prop FOR SELECT USING (true);
CREATE POLICY "Allow insert detalles_prop" ON public.detalles_prop FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update detalles_prop" ON public.detalles_prop FOR UPDATE USING (true);
CREATE POLICY "Allow delete detalles_prop" ON public.detalles_prop FOR DELETE USING (true);

-- (Opcional) Trigger para updated_at: en algunas versiones de Postgres usar EXECUTE FUNCTION en lugar de EXECUTE PROCEDURE.
-- La app puede enviar updated_at al hacer update; si prefieres trigger, descomenta:
/*
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS detalles_prop_updated_at ON public.detalles_prop;
CREATE TRIGGER detalles_prop_updated_at
  BEFORE UPDATE ON public.detalles_prop
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
*/
