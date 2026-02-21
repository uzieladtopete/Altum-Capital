# Tabla `detalles_prop` en Supabase

Tabla vinculada a **Propiedades** para guardar Recámaras, Baños, Estacionamientos, Año, Piso y Amenidades (general, políticas, recreación).

## Relación

- **Propiedades** (1) ←—— (1) **detalles_prop**
- Vinculación por `detalles_prop.propiedad_id` → `Propiedades.id` (FK).
- Opcional: `detalles_prop.titulo` puede guardar una copia de `Propiedades.titulo`.

## Crear la tabla

1. En Supabase: **SQL Editor** → New query.
2. Copia y pega el contenido de `supabase/detalles_prop-migration.sql`.
3. Run.

Si tu tabla de propiedades no se llama exactamente `"Propiedades"` (con P mayúscula), ajusta en el SQL la referencia:

```sql
REFERENCES public."Propiedades"(id)
```

## Columnas de `detalles_prop`

| Columna           | Tipo   | Descripción                                      |
|-------------------|--------|--------------------------------------------------|
| id                | uuid   | PK                                               |
| propiedad_id      | uuid   | FK a Propiedades.id (UNIQUE, 1:1)                |
| titulo            | text   | Opcional; copia del título de la propiedad      |
| recamaras         | int    | Número de recámaras                              |
| banos             | int    | Número de baños                                  |
| estacionamientos  | int    | Número de estacionamientos                       |
| anio_construccion | int    | Año de construcción                             |
| piso              | int    | Piso                                             |
| amenidades        | jsonb  | `{"general":[],"politicas":[],"recreacion":[]}`  |
| created_at        | timestamptz |                                          |
| updated_at        | timestamptz |                                          |

## Comportamiento de la app

- **Crear propiedad:** se inserta en `Propiedades` y luego una fila en `detalles_prop` con los datos de recámaras, baños, amenidades, etc.
- **Editar propiedad:** se actualiza `Propiedades` (titulo, descripción, imagen, etc.) y se hace upsert en `detalles_prop` por `propiedad_id`.
- **Listar / detalle:** se hace `select('*, detalles_prop(*)')` y la app une los datos en un solo objeto (la UI sigue usando `propiedad.recamaras`, `propiedad.amenidades`, etc.).

Si la tabla `detalles_prop` no existe aún, la app sigue funcionando: solo no persiste ni muestra esos detalles desde Supabase (los formularios de crear/editar siguen enviando los datos).
