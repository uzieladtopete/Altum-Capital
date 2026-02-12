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
