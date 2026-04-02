-- =============================================================================
-- RLS: UPDATE (y opcionalmente SELECT) en consultas para admins autenticados
-- El checkbox "revisado" en el panel usa UPDATE + .select() en PostgREST:
-- hace falta poder actualizar la fila y devolverla (misma sesión).
-- Ejecutar en SQL Editor. Elige UNA variante según usuarios_admin.
-- =============================================================================
-- Si obtienes error "policy already exists": DROP POLICY "..." ON public.consultas;

-- Variante 1: usuarios_admin.id = auth.users.id (más común)

-- Lectura de consultas para admins (si aún no tienes política SELECT equivalente)
CREATE POLICY "consultas_select_admin"
  ON public.consultas
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios_admin u WHERE u.id = auth.uid()));

CREATE POLICY "consultas_update_admin"
  ON public.consultas
  FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios_admin u WHERE u.id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.usuarios_admin u WHERE u.id = auth.uid()));

-- Variante 2: usuarios_admin.user_id = auth.uid() (sustituye las dos CREATE POLICY de arriba)
-- CREATE POLICY "consultas_select_admin" ... USING (... u.user_id = auth.uid());
-- CREATE POLICY "consultas_update_admin" ... USING (... u.user_id = auth.uid()) WITH CHECK (...);
