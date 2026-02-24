# Tutorial: Imágenes optimizadas y almacenamiento (Supabase + opción Cloudinary)

Guía paso a paso para que las fotos de propiedades pesen menos y se guarden en Supabase.

---

## Resumen de opciones

| Opción | Complejidad | Dónde se optimiza | Dónde se guarda |
|--------|-------------|--------------------|------------------|
| **A. Solo Supabase** | Baja | En el navegador (comprimir antes de subir) | Supabase Storage |
| **B. Cloudinary + Supabase** | Media | Cloudinary (URL optimizada) → se descarga y se sube a Supabase | Supabase Storage |

Recomendación: empezar con **Opción A**. Si más adelante quieres usar Cloudinary, seguir con **Opción B**.

---

## Parte 1: Configurar Supabase Storage

### 1.1 Crear el bucket en Supabase

1. Entra a tu proyecto en [supabase.com](https://supabase.com) → **Storage** (menú izquierdo).
2. **New bucket**.
3. Nombre: `propiedades` (o el que prefieras).
4. **Public bucket**: activado (para que las URLs de las imágenes se puedan usar en la web sin auth).
5. Crear.

### 1.2 Políticas (RLS) del bucket

Para que tu app pueda subir y leer:

1. En Storage → **Policies** del bucket `propiedades`.
2. **New policy** → “For full customization”.
3. **Policy 1 – Lectura pública**  
   - Name: `Public read`  
   - Allowed operation: **SELECT** (Read)  
   - Target roles: `public`  
   - USING expression: `true`
4. **Policy 2 – Subida** (solo si usas la anon key desde el front; si subes desde backend con service role, no hace falta esta).  
   - Name: `Authenticated upload`  
   - Allowed operation: **INSERT**  
   - Target roles: `authenticated` o `anon` (según cómo subas)  
   - WITH CHECK: `true`  
   O bien permitir **INSERT** para `anon` si quieres subir sin login (solo si tu lógica de “quién puede subir” está en otra capa).

Si quieres que **cualquiera** pueda subir (solo para desarrollo/pruebas):

- INSERT para `anon` con WITH CHECK: `true`.

En producción conviene que solo usuarios autenticados (o un backend) puedan subir.

### 1.3 Obtener la URL pública

Las URLs de archivos serán de la forma:

```text
https://<PROYECTO>.supabase.co/storage/v1/object/public/propiedades/<ruta>/<nombre>
```

No necesitas variable de entorno extra; con `VITE_SUPABASE_URL` ya tienes la base.

---

## Parte 2: Opción A – Solo Supabase (recomendada para empezar)

Comprimes la imagen en el navegador y la subes a Supabase Storage. No usas Cloudinary.

### 2.1 Instalar dependencia

```bash
npm install browser-image-compression
```

### 2.2 Subir y guardar URL en la base de datos

En tu formulario de crear/editar propiedad, cuando el usuario elija un archivo:

1. Comprimir el archivo con `browser-image-compression` (calidad ~0.8, max width p. ej. 1200).
2. Subir ese archivo a Supabase Storage en el bucket `propiedades`, por ejemplo en `propiedades/<uuid>.jpg`.
3. Obtener la URL pública con `getPublicUrl()`.
4. Guardar esa URL en la columna `imagen` (y en `galeria` si aplica) de tu tabla en Supabase (Propiedades / detalles_prop según tu esquema).

Ejemplo de flujo (pseudocódigo):

```javascript
import imageCompression from 'browser-image-compression'
import { supabase } from '../lib/supabase'

async function subirImagenPropiedad(file) {
  const opciones = { maxSizeMB: 0.5, maxWidthOrHeight: 1200, useWebWorker: true }
  const fileComprimido = await imageCompression(file, opciones)

  const nombre = `${crypto.randomUUID()}.${fileComprimido.name.split('.').pop() || 'jpg'}`
  const { data, error } = await supabase.storage
    .from('propiedades')
    .upload(nombre, fileComprimido, { upsert: false })

  if (error) throw error
  const { data: { publicUrl } } = supabase.storage.from('propiedades').getPublicUrl(data.path)
  return publicUrl
}
```

Luego usas `publicUrl` como `imagen` al crear/actualizar la propiedad en la base de datos (no en Storage: la imagen ya está en Storage; en la BD solo guardas la URL).

Con esto ya cumples: “Supabase guarde esa imagen” (el archivo en Storage) y “que esté menos pesado” (gracias a la compresión en el navegador).

---

## Parte 3: Opción B – Cloudinary para optimizar y Supabase para guardar

Aquí Cloudinary se usa solo para generar una versión liviana; el archivo final que guardas es en Supabase.

Flujo:

1. **Frontend:** el usuario elige una imagen → la subes a **Cloudinary** (upload API).
2. Cloudinary te devuelve un `public_id` (o URL). Construyes la **URL de entrega optimizada** (ej. con `q_auto`, `f_auto`, ancho máximo).
3. Esa URL es la “imagen ya optimizada” que quieres guardar en Supabase. Para que **Supabase guarde esa imagen** (el archivo), necesitas que un backend **descargue** esa URL y **suba el archivo** a Supabase Storage.
4. El backend te devuelve la **URL pública de Supabase Storage** y esa es la que guardas en tu base de datos (columna `imagen` / `galeria`).

Así “el URL de la imagen está menos pesado” (porque lo generaste con Cloudinary) y “Supabase guarda esa imagen” (el archivo descargado se sube a Storage).

### 3.1 Cloudinary – Cuenta y variables

1. Crear cuenta en [cloudinary.com](https://cloudinary.com).
2. En Dashboard: **Cloud name**, **API Key**, **API Secret**.
3. En tu proyecto (env o Supabase Edge Function):  
   `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

### 3.2 Subir desde el front (Cloudinary)

Puedes usar **unsigned upload** con un upload preset:

1. En Cloudinary: Settings → Upload → Add upload preset → Unsigned. Guardar el nombre del preset.
2. En el front, POST al endpoint de Cloudinary con el file; respuesta incluye `secure_url` y `public_id`.
3. URL optimizada para “menos pesado”:  
   `https://res.cloudinary.com/<cloud_name>/image/upload/q_auto,f_auto,w_1200/<public_id>.<format>`

Esa URL es la que tu backend debe “descargar” y volver a subir a Supabase.

### 3.3 Backend que “guarda en Supabase” la imagen de Cloudinary

Tienes que tener un backend (por ejemplo una **Supabase Edge Function** o un pequeño servidor Node) que:

1. Reciba la **URL de Cloudinary optimizada** (o `public_id` + cloud name y construyas la URL).
2. Haga `fetch(url)` (o similar) y obtenga los bytes de la imagen.
3. Suba esos bytes a Supabase Storage (mismo bucket `propiedades`, nombre de archivo único).
4. Use `getPublicUrl()` para la ruta subida.
5. Devuelva esa **URL de Supabase** para que el front la guarde en la base de datos (Propiedades.imagen, etc.).

Ejemplo muy resumido (Edge Function en Deno):

```javascript
// Supabase Edge Function: recibe body { imageUrl: "https://res.cloudinary.com/..." }
const imageUrl = req.body?.imageUrl
const res = await fetch(imageUrl)
const blob = await res.blob()
const nombre = `${crypto.randomUUID()}.jpg`
const { data, error } = await supabaseAdmin.storage.from('propiedades').upload(nombre, blob, { contentType: blob.type })
const { data: { publicUrl } } = supabaseAdmin.storage.from('propiedades').getPublicUrl(data.path)
return new Response(JSON.stringify({ url: publicUrl }))
```

Tu front llamaría a esta función con la URL optimizada de Cloudinary y guardaría en la BD la `url` que devuelve (Supabase).

---

## Qué guardar en la base de datos

- En **Supabase** (tablas Propiedades / detalles_prop):  
  - Guardas **solo la URL** (texto) en columnas como `imagen` y `galeria`.
- El **archivo** está en:
  - **Opción A:** Supabase Storage (bucket `propiedades`).
  - **Opción B:** también en Supabase Storage; Cloudinary solo se usó para generar la versión liviana que luego ese backend subió a Supabase.

No hace falta “guardar la imagen” en otra tabla; la imagen es el archivo en Storage; en la BD solo la referencia (URL).

---

## Orden sugerido

1. Hacer **Parte 1** (bucket y políticas en Supabase).
2. Implementar **Opción A** en tu formulario (compresión + subida a Storage + guardar URL en `imagen`).
3. Cuando quieras usar Cloudinary, añadir upload a Cloudinary en el front y la Edge Function (o backend) de la **Opción B** para que Supabase guarde esa imagen optimizada.

Si quieres, en el siguiente paso podemos bajar al código concreto de tu `CrearPropiedadPage` y conectar ahí la subida a Supabase (Opción A) usando el cliente de Supabase que ya tienes en `src/lib/supabase.js`.
