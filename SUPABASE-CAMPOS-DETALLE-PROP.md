# Agregar columnas de detalle en Supabase (descripción, especificaciones, amenidades)

Estas columnas permiten guardar en la base de datos la **descripción**, las **especificaciones** (recámaras, baños, estacionamientos, año, piso) y las **amenidades** de cada propiedad. Si ya tienes la tabla `Propiedades` (o `propiedades`), añade las columnas que falten.

---

## Opción A: Desde el Table Editor de Supabase

1. Entra a [Supabase](https://supabase.com) → tu proyecto → **Table Editor**.
2. Abre la tabla **Propiedades** (o el nombre que uses).
3. Haz clic en **"Add column"** / **"Agregar columna"** y crea cada una con estos datos:

| Nombre de columna   | Tipo    | Nullable |
|---------------------|---------|----------|
| `descripcion`       | `text`  | Sí ✅    |
| `recamaras`         | `int4` (integer) | Sí ✅ |
| `banos`             | `int4` (integer) | Sí ✅ |
| `estacionamientos`  | `int4` (integer) | Sí ✅ |
| `anio_construccion` | `int4` (integer) | Sí ✅ |
| `piso`              | `int4` (integer) | Sí ✅ |
| `galeria`           | `jsonb` | Sí ✅   |
| `amenidades`        | `jsonb` | Sí ✅   |

- **descripcion**: texto largo de la propiedad.
- **recamaras, banos, estacionamientos, piso, anio_construccion**: números (enteros). Déjalos en blanco si no aplican.
- **galeria**: lista de URLs de imágenes en JSON, ej: `["https://...", "https://..."]`.
- **amenidades**: objeto JSON con tres listas de texto (strings). Cuando seleccionas cuadritos en el panel admin, se guardan los textos de las opciones seleccionadas.

### Ejemplo de cómo se guardan las amenidades:

Cuando seleccionas cuadritos en el panel admin (por ejemplo: "Elevador", "Portero" en General, "Mascotas permitidas" en Políticas, "Alberca" en Recreación), se guarda así en Supabase:

```json
{
  "general": ["Elevador", "Portero"],
  "politicas": ["Mascotas permitidas"],
  "recreacion": ["Alberca"]
}
```

**Importante:** Los "cuadritos" (checkboxes) se convierten automáticamente en texto. No se guardan como checkboxes, sino como un array de strings con los nombres de las amenidades seleccionadas. Por ejemplo, si marcas "Alberca" y "Gimnasio", se guarda `["Alberca", "Gimnasio"]` en la categoría correspondiente.

En Supabase, para tipo **integer** elige **int4** si te lo pide. Para **jsonb** elige **jsonb**.

### Crear la columna `amenidades` paso a paso:

1. En **Table Editor** → tabla **Propiedades** → **"Add column"**.
2. **Name**: `amenidades`
3. **Type**: Selecciona **`jsonb`** (no `text`, no `json`, debe ser `jsonb`).
4. **Nullable**: ✅ Sí (marca la casilla para permitir NULL).
5. **Default Value**: Puedes dejarlo vacío o poner `{}` (objeto vacío).
6. Haz clic en **"Save"**.

**¿Por qué `jsonb`?** Porque las amenidades se guardan como un objeto JSON con tres arrays de texto. Por ejemplo:
```json
{
  "general": ["Elevador", "Portero"],
  "politicas": ["Mascotas permitidas"],
  "recreacion": ["Alberca", "Gimnasio"]
}
```

El tipo `jsonb` permite guardar y consultar este tipo de datos estructurados de forma eficiente.

---

## Opción B: Con SQL en el editor SQL de Supabase

1. En el menú lateral: **SQL Editor** → **New query**.
2. Pega y ejecuta (ajusta el nombre de la tabla si la tuya se llama distinto, por ejemplo `propiedades` en minúscula):

```sql
-- Ajusta "Propiedades" por "propiedades" si tu tabla está en minúscula
ALTER TABLE "Propiedades"
  ADD COLUMN IF NOT EXISTS descripcion text,
  ADD COLUMN IF NOT EXISTS recamaras int4,
  ADD COLUMN IF NOT EXISTS banos int4,
  ADD COLUMN IF NOT EXISTS estacionamientos int4,
  ADD COLUMN IF NOT EXISTS anio_construccion int4,
  ADD COLUMN IF NOT EXISTS piso int4,
  ADD COLUMN IF NOT EXISTS galeria jsonb,
  ADD COLUMN IF NOT EXISTS amenidades jsonb;
```

3. Ejecuta la consulta (Run).

---

## Comportamiento en la app

- **Panel Admin (Crear / Editar propiedad)**: 
  - Podrás rellenar descripción, recámaras, baños, estacionamientos, año de construcción, piso, galería (varias imágenes) y amenidades.
  - **Amenidades**: Seleccionas cuadritos (checkboxes) en tres categorías: General, Políticas, Recreación. Al guardar, esos cuadritos seleccionados se convierten en un objeto JSON con arrays de texto (los nombres de las amenidades seleccionadas) y se guardan en la columna `amenidades` (tipo `jsonb`).
- **Página de detalle de la propiedad**: Mostrará esos datos cuando existan; si no, seguirá usando valores por defecto o lo guardado en la edición rápida (localStorage) como hasta ahora.

### Cómo funcionan las amenidades:

1. **En el formulario**: Ves cuadritos (checkboxes) con opciones como "Elevador", "Portero", "Alberca", etc.
2. **Al seleccionar**: Marcas los cuadritos que aplican a la propiedad.
3. **Al guardar**: El código toma los textos de los cuadritos seleccionados y los guarda como arrays de strings en un objeto JSON:
   - `general`: array con las amenidades de "General" seleccionadas
   - `politicas`: array con las amenidades de "Políticas" seleccionadas
   - `recreacion`: array con las amenidades de "Recreación" seleccionadas
4. **En Supabase**: Se guarda como un objeto JSON en la columna `amenidades` (tipo `jsonb`).

Si tu tabla tiene el nombre en minúscula (`propiedades`), en el SQL cambia `"Propiedades"` por `"propiedades"`.

---

## Si los cambios no se guardan (panel admin)

1. **Nombre de la tabla**: En el código la tabla se usa como `propiedades` (minúscula). Si en Supabase la creaste como `Propiedades`, en `src/services/propiedadesSupabase.js` cambia la constante `TABLE` a `'Propiedades'`.
2. **Políticas RLS**: En Supabase → Table Editor → tabla propiedades → **Policies**. Si solo tienes "insert, update, delete for **authenticated** users", las peticiones con la clave anónima no podrán guardar. Opciones: crear una política que permita a **anon** hacer INSERT/UPDATE/DELETE en esa tabla, o que el admin de la app inicie sesión (usuarios autenticados).
3. **Columnas**: Si faltan columnas (`descripcion`, `galeria`, `amenidades`, etc.), el guardado puede fallar. Revisa la consola del navegador (F12) y el mensaje de error; añade las columnas que indique Supabase.
