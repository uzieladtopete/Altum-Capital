# Configurar inicio de sesión de admin en Supabase

Para que el admin pueda iniciar sesión con email y contraseña, hay que configurar **Auth** y la **tabla de roles** en Supabase.

---

## 1. Habilitar Email/Password en Supabase

1. Entra al [Dashboard de Supabase](https://supabase.com/dashboard) y abre tu proyecto.
2. Ve a **Authentication** → **Providers**.
3. En **Email**, asegúrate de que esté **Enabled**.
4. Opcional: en **Auth** → **Settings** puedes ajustar:
   - **Enable email confirmations**: si lo activas, el usuario debe confirmar el email antes de poder entrar (para admin suele desactivarse).
   - **Minimum password length**: por defecto 6.

Con esto ya se puede usar `signInWithPassword` con email y contraseña.

---

## 2. Tabla de roles (para que el app reconozca al admin)

La app busca el rol del usuario en una tabla. Tiene que existir una tabla con al menos: `id`, `email`, `role`.

### Opción A: Crear la tabla desde SQL (recomendado)

En Supabase: **SQL Editor** → New query, pega y ejecuta:

```sql
-- Tabla de usuarios con rol (admin o usuario)
create table if not exists public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'usuario' check (role in ('admin', 'usuario'))
);

-- Permitir que la app (anon) lea solo el rol del usuario actual
alter table public.usuarios enable row level security (rls);

create policy "Usuarios pueden leer su propio registro"
  on public.usuarios for select
  using (auth.uid() = id);
```

Si prefieres otro nombre de tabla (`usuarios_admin` o `Usuarios`), la app ya intenta esos nombres; en ese caso créala con las mismas columnas: `id` (uuid, PK), `email`, `role`.

---

## 3. Crear el usuario admin

Tienes dos formas: desde el Dashboard o con el script del proyecto.

### Opción A: Desde el Dashboard de Supabase

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: el que quieras para el admin (ej. `admin@altumcapital.com`).
3. Password: la contraseña que usará para iniciar sesión.
4. Marca **Auto Confirm User** para que no pida confirmar email.
5. Clic en **Create user**.
6. Copia el **User UID** (uuid) del usuario recién creado.
7. Ve a **Table Editor** → tabla **usuarios** (o la que hayas creado).
8. **Insert row**:
   - **id**: pega el User UID copiado.
   - **email**: el mismo email del usuario (ej. `admin@altumcapital.com`).
   - **role**: `admin`.

Con eso ya puedes iniciar sesión en la app con ese email y contraseña y el panel te tratará como admin.

### Opción B: Script del proyecto (crea usuario + fila con rol admin)

El script usa la API de administración de Supabase, así que necesitas la **service role key** (no la anon key).

1. En Supabase: **Settings** → **API** → copia **service_role** (secret).
2. En el proyecto, en el `.env` (junto a `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`), añade:
   ```env
   VITE_SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aquí
   ```
   No subas este archivo a Git (debe estar en `.gitignore`).
3. Crea la tabla `usuarios` como en el paso 2 si aún no existe.
4. En la raíz del proyecto ejecuta:
   ```bash
   node scripts/createTestUser.js
   ```
   Eso crea (o actualiza) el usuario con email `admin@altumcapital.com` y contraseña `admin123`, y una fila en `usuarios` con `role: admin`.

Para usar **otro email o contraseña**, edita `scripts/createTestUser.js` (variables `testEmail` y `testPassword`) y vuelve a ejecutar el script.

---

## 4. Cambiar la contraseña del admin

- **Desde el Dashboard**: **Authentication** → **Users** → el usuario → **⋮** → **Reset password** (o editar y poner nueva contraseña si tu plan lo permite).
- **Con el script**: cambia `testPassword` en `createTestUser.js`, ejecuta el script; si el usuario ya existe, el script actualiza la contraseña.

---

## Resumen

| Paso | Dónde | Qué hacer |
|------|--------|-----------|
| 1 | Auth → Providers | Email habilitado |
| 2 | SQL Editor o Table Editor | Tabla `usuarios` con `id`, `email`, `role` y RLS |
| 3 | Auth → Users y tabla `usuarios` | Crear usuario + fila con `role: admin` (o ejecutar `node scripts/createTestUser.js`) |

Después de esto, al ir a `/login` en la app e ingresar ese email y contraseña, la sesión se inicia y el app te considera admin porque encuentra `role: 'admin'` en la tabla.
