# Arquitectura: Imágenes con Cloudinary y Supabase

## Resumen

Las imágenes de propiedades se suben **directamente desde el frontend a Cloudinary** (direct upload), sin pasar por el backend. Cloudinary se encarga de la optimización (formato, compresión, redimensionamiento). **Supabase solo almacena las URLs** en la tabla `property_images`; no se usa Supabase Storage para archivos.

---

## Flujo de datos

```
[Usuario selecciona imágenes] → [Frontend valida] → [Frontend sube a Cloudinary]
                                                           ↓
                                              [Cloudinary devuelve secure_url]
                                                           ↓
[Al guardar propiedad] → [Supabase: insert/update en property_images con las URLs]
```

- **Ancho de banda del backend:** no se consume; las subidas van del navegador a Cloudinary.
- **Supabase:** solo escribe/lee filas en `property_images` (URLs). No almacena bytes de imagen.

---

## Componentes

### 1. Cloudinary

- **Upload:** unsigned preset (no se expone API Secret). Límites en el preset: 5MB por imagen, formatos jpg/jpeg/png/webp.
- **Transformaciones al mostrar:** en la app se usa `getOptimizedImageUrl(url)` que genera URLs con `w_1200,q_auto,f_auto` (ancho máx 1200px, calidad y formato automáticos).
- **Variables de entorno (frontend):** `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`.

### 2. Frontend

- **PropertyImageUploader:** componente de subida múltiple. Valida (máx 20 imágenes, 5MB cada una, tipos permitidos), muestra vista previa, barra de progreso por imagen y maneja errores. Llama a `uploadImageToCloudinary()` y recibe `secure_url`.
- **Validación:** en `cloudinaryUpload.js` (`validateImageFile`, `validateImageFileList`).
- **Crear/Editar propiedad:** el formulario usa `PropertyImageUploader`; al enviar se guardan las URLs en `property_images` vía `propertyImagesSupabase.js`.

### 3. Supabase

- **Tabla `property_images`:** `id`, `property_id` (FK a Propiedades), `image_url`, `is_cover`, `order_index`, `created_at`.
- **RLS:** lectura pública; inserción/actualización/borrado solo para `authenticated`. Opcional: restringir por dueño de la propiedad cuando exista `user_id` en Propiedades.
- **Servicio:** `propertyImagesSupabase.js` (getPropertyImages, insertPropertyImages, setCoverImage, updateImagesOrder, deletePropertyImage, deleteAllPropertyImages).

### 4. Seguridad

- **API Secret de Cloudinary:** no se usa en el frontend; solo unsigned upload con preset seguro.
- **Firma desde backend:** si en el futuro se requiere signed upload, la firma debe generarse en un backend (p. ej. Edge Function) y el frontend solo envía el archivo con la firma.
- **Subida solo autenticados:** las políticas RLS de `property_images` exigen `authenticated` para INSERT/UPDATE/DELETE. La UI de crear/editar propiedad está protegida por ruta admin.

---

## Escalabilidad y buenas prácticas

- **Múltiples inmobiliarias:** la tabla `property_images` está asociada a `property_id`. Si se añade `user_id` (o `empresa_id`) a Propiedades, las políticas RLS pueden restringir que las imágenes solo se asocien a propiedades del usuario/empresa autenticado.
- **Código modular:** subida y validación en `cloudinaryUpload.js`; persistencia en `propertyImagesSupabase.js`; UI en `PropertyImageUploader.jsx`; configuración en `config/cloudinary.js`.
- **Compatibilidad:** `getPropiedadById` rellena `imagen` y `galeria` desde `property_images` cuando existen; si no, se usan los campos legacy de Propiedades.

---

## Archivos relevantes

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/config/cloudinary.js` | Cloud name, upload preset, `getOptimizedImageUrl()` |
| `src/services/cloudinaryUpload.js` | Validación y subida directa a Cloudinary |
| `src/services/propertyImagesSupabase.js` | CRUD de `property_images` |
| `src/components/PropertyImageUploader.jsx` | UI de subida múltiple con preview y progreso |
| `supabase/property_images-migration.sql` | Creación de tabla y RLS |

---

## Configuración en Cloudinary (Dashboard)

1. **Upload preset:** Settings → Upload → Add upload preset.
   - **Signing Mode:** Unsigned.
   - **Max file size:** 5 MB (5000 KB).
   - Restricciones de tipo según necesidad (jpg, png, webp).
2. Copiar el **Preset name** y usarlo en `VITE_CLOUDINARY_UPLOAD_PRESET`.

Variables en `.env` (o en Render/Vite):

```env
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_unsigned_preset_name
```

No incluir `API Secret` en el frontend.
