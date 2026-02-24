-- Tabla property_images: múltiples imágenes por propiedad (URLs de Cloudinary).
-- Supabase solo almacena las URLs; las imágenes se sirven desde Cloudinary.
-- Ejecutar en Supabase: SQL Editor > New query > Pegar y Run.

-- Tabla property_images
CREATE TABLE IF NOT EXISTS public.property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public."Propiedades"(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_cover boolean NOT NULL DEFAULT false,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_order ON public.property_images(property_id, order_index);

COMMENT ON TABLE public.property_images IS 'URLs de imágenes por propiedad (Cloudinary). Una fila por imagen; is_cover indica portada.';
COMMENT ON COLUMN public.property_images.image_url IS 'secure_url devuelta por Cloudinary.';
COMMENT ON COLUMN public.property_images.is_cover IS 'True solo para la imagen de portada de la propiedad.';
COMMENT ON COLUMN public.property_images.order_index IS 'Orden de visualización en galería (0, 1, 2, ...).';

-- RLS: solo usuarios autenticados pueden insertar/actualizar/borrar.
-- Lectura pública para que la web muestre las fotos.
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "property_images_select" ON public.property_images
  FOR SELECT USING (true);

CREATE POLICY "property_images_insert_authenticated" ON public.property_images
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "property_images_update_authenticated" ON public.property_images
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "property_images_delete_authenticated" ON public.property_images
  FOR DELETE TO authenticated
  USING (true);

-- Opcional: restringir por dueño de la propiedad cuando Propiedades tenga user_id.
-- Primero añade: ALTER TABLE public."Propiedades" ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
-- Luego reemplaza las políticas de INSERT/UPDATE/DELETE por:
--   WITH CHECK (EXISTS (SELECT 1 FROM public."Propiedades" p WHERE p.id = property_id AND p.user_id = auth.uid()))
--   USING (EXISTS (SELECT 1 FROM public."Propiedades" p WHERE p.id = property_id AND p.user_id = auth.uid()))
