-- =============================================================================
-- COPIAR TODO ESTE ARCHIVO Y PEGARLO EN SUPABASE > SQL EDITOR > New query > Run
-- =============================================================================
-- Crea la tabla detalles_prop vinculada a Propiedades (id y opcional titulo).
-- =============================================================================

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

CREATE INDEX IF NOT EXISTS idx_detalles_prop_propiedad_id ON public.detalles_prop(propiedad_id);

ALTER TABLE public.detalles_prop ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read detalles_prop" ON public.detalles_prop FOR SELECT USING (true);
CREATE POLICY "Allow insert detalles_prop" ON public.detalles_prop FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update detalles_prop" ON public.detalles_prop FOR UPDATE USING (true);
CREATE POLICY "Allow delete detalles_prop" ON public.detalles_prop FOR DELETE USING (true);
