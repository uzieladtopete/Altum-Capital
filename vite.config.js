import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function filterPropiedades(list, params) {
  let result = [...list]
  const ciudad = params.get('ciudad')
  const tipo = params.get('tipo')
  const minPrecio = params.get('minPrecio')
  const maxPrecio = params.get('maxPrecio')
  const minM2 = params.get('minM2')
  const maxM2 = params.get('maxM2')
  if (ciudad) result = result.filter((p) => p.ciudad === ciudad)
  if (tipo) result = result.filter((p) => p.tipo === tipo)
  if (minPrecio) {
    const min = Number(minPrecio)
    if (!Number.isNaN(min)) result = result.filter((p) => p.precio >= min)
  }
  if (maxPrecio) {
    const max = Number(maxPrecio)
    if (!Number.isNaN(max)) result = result.filter((p) => p.precio <= max)
  }
  if (minM2) {
    const min = Number(minM2)
    if (!Number.isNaN(min)) result = result.filter((p) => p.m2 >= min)
  }
  if (maxM2) {
    const max = Number(maxM2)
    if (!Number.isNaN(max)) result = result.filter((p) => p.m2 <= max)
  }
  return result
}

export default defineConfig({
  server: {
    port: 5173,
    strictPort: true, // no usar otro puerto si 5173 está ocupado
  },
  plugins: [
    react(),
    {
      name: 'api-propiedades',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url?.startsWith('/api/propiedades')) {
            try {
              const url = new URL(req.url, `http://${req.headers.host}`)
              const { propiedades } = await import(path.resolve(__dirname, 'src/data/propiedades.js'))
              const filtered = filterPropiedades(propiedades, url.searchParams)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(filtered))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: String(err.message) }))
            }
            return
          }
          next()
        })
      },
    },
  ],
})
