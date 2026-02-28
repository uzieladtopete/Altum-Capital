-- Tabla amenidades_opciones: amenidades personalizadas ("otro") que el admin agrega al crear/editar propiedades.
-- Se reutilizan como opciones en el panel al crear otra propiedad.
-- Ejecutar en Supabase: SQL Editor > New query > Pegar y Run.

CREATE TABLE IF NOT EXISTS public.amenidades_opciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria text NOT NULL CHECK (categoria IN ('general', 'politicas', 'recreacion')),
  nombre text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(categoria, nombre)
);

CREATE INDEX IF NOT EXISTS idx_amenidades_opciones_categoria ON public.amenidades_opciones(categoria);

COMMENT ON TABLE public.amenidades_opciones IS 'Amenidades personalizadas (otro) usadas en propiedades; se muestran como opciones al crear/editar.';

ALTER TABLE public.amenidades_opciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read amenidades_opciones" ON public.amenidades_opciones FOR SELECT USING (true);
CREATE POLICY "Allow insert amenidades_opciones" ON public.amenidades_opciones FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update amenidades_opciones" ON public.amenidades_opciones FOR UPDATE USING (true);
CREATE POLICY "Allow delete amenidades_opciones" ON public.amenidades_opciones FOR DELETE USING (true);
