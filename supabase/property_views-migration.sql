-- Seguimiento de visitas a la página de detalle de cada propiedad.
-- Ejecutar en Supabase: SQL Editor > New query > Pegar y Run.

-- Tabla: una fila por vista (cada vez que alguien abre la ficha de una propiedad)
CREATE TABLE IF NOT EXISTS public.property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public."Propiedades"(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON public.property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON public.property_views(viewed_at);
CREATE INDEX IF NOT EXISTS idx_property_views_property_viewed ON public.property_views(property_id, viewed_at);

COMMENT ON TABLE public.property_views IS 'Registro de visitas a la página de detalle de cada propiedad. Usado para estadísticas en el Dashboard.';

-- RLS
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;

-- Cualquiera (incl. anónimo) puede insertar: al abrir la ficha de una propiedad se registra la vista
CREATE POLICY "property_views_insert" ON public.property_views
  FOR INSERT WITH CHECK (true);

-- Solo autenticados pueden leer (el panel admin usa un usuario logueado)
CREATE POLICY "property_views_select_authenticated" ON public.property_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Estadísticas del mes ya agregadas en la BD (el Dashboard llama a esta RPC)
CREATE OR REPLACE FUNCTION public.get_property_view_stats(limite int DEFAULT 10)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT json_build_object(
    'visitas_del_mes', (SELECT COUNT(*)::int FROM property_views WHERE viewed_at >= date_trunc('month', now())),
    'top_by_views', COALESCE(
      (SELECT json_agg(json_build_object('property_id', property_id, 'count', cnt))
       FROM (
         SELECT property_id, COUNT(*)::int AS cnt
         FROM property_views
         WHERE viewed_at >= date_trunc('month', now())
         GROUP BY property_id
         ORDER BY cnt DESC
         LIMIT limite
       ) sub),
      '[]'::json
    )
  );
$$;
GRANT EXECUTE ON FUNCTION public.get_property_view_stats(int) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_property_view_stats(int) TO service_role;
