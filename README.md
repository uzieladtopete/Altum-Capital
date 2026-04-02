# Web profesional – Estudio de arquitectura

Estructura frontend de la página de inicio y resultados para un estudio de arquitectura contemporánea. Diseño minimalista, elegante y responsive.

## Stack

- **Vite** + **React** + **React Router** + **Tailwind CSS**

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173).

## Estructura

- **/** – Inicio: hero, barra de filtros, proyectos recientes, testimonios, CTA
- **/resultados** – Resultados de búsqueda con mapa (placeholder) y tarjetas de proyectos

Los filtros en la home redirigen a `/resultados` con los criterios; el filtrado es en cliente con datos mock (sin backend).

## Build

```bash
npm run build
npm run preview
```

## Variables de entorno (producción)

Vite sustituye `import.meta.env.VITE_*` **en el momento del build**. Cualquier variable que uses en el código debe existir en el host (p. ej. Render → **Environment**) y volver a desplegar tras cambiarla.

| Variable | Uso |
|----------|-----|
| `VITE_CLOUDINARY_CLOUD_NAME` | Subida de imágenes (crear/editar propiedad) |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Preset unsigned de Cloudinary |

Sin estas dos, en producción verás el error “Cloudinary no configurado” aunque en local funcione con `.env`.
