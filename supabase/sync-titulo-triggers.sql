-- Sincronizar titulo entre Propiedades y detalles_prop.
-- Si editas el título en una tabla, se actualiza en la otra.
-- Ejecutar en Supabase > SQL Editor > Run.
-- (Si da error con EXECUTE FUNCTION, cambia a EXECUTE PROCEDURE.)

-- 1) Al editar titulo en Propiedades → actualizar detalles_prop.titulo
CREATE OR REPLACE FUNCTION public.sync_titulo_propiedades_to_detalles()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.titulo IS DISTINCT FROM OLD.titulo THEN
    UPDATE public.detalles_prop
    SET titulo = NEW.titulo, updated_at = now()
    WHERE propiedad_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_titulo_after_propiedades_update ON public."Propiedades";
CREATE TRIGGER sync_titulo_after_propiedades_update
  AFTER UPDATE OF titulo ON public."Propiedades"
  FOR EACH ROW EXECUTE FUNCTION public.sync_titulo_propiedades_to_detalles();

-- 2) Al editar titulo en detalles_prop → actualizar Propiedades.titulo
CREATE OR REPLACE FUNCTION public.sync_titulo_detalles_to_propiedades()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.titulo IS DISTINCT FROM OLD.titulo THEN
    UPDATE public."Propiedades"
    SET titulo = NEW.titulo, updated_at = now()
    WHERE id = NEW.propiedad_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_titulo_after_detalles_update ON public.detalles_prop;
CREATE TRIGGER sync_titulo_after_detalles_update
  AFTER UPDATE OF titulo ON public.detalles_prop
  FOR EACH ROW EXECUTE FUNCTION public.sync_titulo_detalles_to_propiedades();
