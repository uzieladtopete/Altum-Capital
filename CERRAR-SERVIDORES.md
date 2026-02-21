# Cerrar otros servidores y usar solo uno

## Opción 1: Usar el script que cierra el puerto y arranca (recomendado)

En la terminal, desde esta carpeta:

```bash
npm run dev:one
```

Eso **cierra** lo que esté usando el puerto 5173 y **arranca** un solo servidor en http://localhost:5173. Así siempre ves los mismos cambios.

---

## Opción 2: Cerrar servidores a mano

**Cerrar el puerto 5173** (y que puedas volver a hacer `npm run dev`):

```bash
lsof -ti :5173 | xargs kill -9
```

Luego:

```bash
npm run dev
```

**Cerrar varios puertos** (5173, 5174, 5175, etc.) de una vez:

```bash
for p in 5173 5174 5175 5176 5177; do lsof -ti :$p | xargs kill -9 2>/dev/null; done
```

Después:

```bash
npm run dev
```

---

## Para que siempre sea la misma página

1. Cierra todas las pestañas del navegador con `localhost:51xx`.
2. Usa **solo** `npm run dev:one` (o `npm run dev` después de cerrar el puerto).
3. Abre **solo** esta URL: **http://localhost:5173**
4. Cuando haya cambios, refresca con **Cmd+Shift+R** (Mac) o **Ctrl+Shift+R** (Windows).

Así siempre trabajas con un solo servidor y la misma página.
