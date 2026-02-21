import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { propiedades } from '../src/data/propiedades.js'

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Leer el archivo .env manualmente
const envFile = readFileSync(join(__dirname, '..', '.env'), 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

const supabaseUrl = envVars.VITE_SUPABASE_URL
// Para importar datos, usamos la service_role key que puede bypassear RLS
const supabaseKey = envVars.VITE_SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or API key in .env file')
  process.exit(1)
}

if (!envVars.VITE_SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  Advertencia: No se encontró VITE_SUPABASE_SERVICE_ROLE_KEY, usando anon key')
  console.warn('   Esto puede fallar si RLS está habilitado. Usa service_role para importar datos.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importData() {
  console.log('Importing propiedades...')
  
  // Primero, obtener la estructura de la tabla para saber qué columnas existen
  const { data: sampleData, error: sampleError } = await supabase
    .from('Propiedades')
    .select('*')
    .limit(1)
  
  if (sampleError && sampleError.code !== 'PGRST116') {
    console.error('Error checking table structure:', sampleError)
    return
  }
  
  for (const prop of propiedades) {
    // Preparar datos: solo incluir campos básicos que seguramente existen
    // (omite campos opcionales que pueden no estar en la tabla)
    const now = new Date().toISOString()
    const dataToInsert = {
      titulo: prop.titulo,
      ciudad: prop.ciudad,
      tipo: prop.tipo,
      precio: prop.precio,
      m2: prop.m2,
      estado: prop.estado,
      created_at: now,
      updated_at: now,
    }
    
    // Agregar campos opcionales solo si existen en los datos
    if (prop.zona) dataToInsert.zona = prop.zona
    if (prop.imagen) dataToInsert.imagen = prop.imagen
    if (prop.direccion) dataToInsert.direccion = prop.direccion
    if (prop.lat != null) dataToInsert.lat = prop.lat
    // Mapear lng -> long para la base de datos
    if (prop.lng != null) dataToInsert.long = prop.lng
    
    const { data, error } = await supabase
      .from('Propiedades')
      .insert(dataToInsert)
      .select()
    
    if (error) {
      // Si el error es por columna faltante, intentar sin esa columna
      if (error.code === 'PGRST204') {
        const missingColumn = error.message.match(/'(\w+)'/)?.[1]
        if (missingColumn) {
          delete dataToInsert[missingColumn]
          // Reintentar sin la columna problemática
          const { data: retryData, error: retryError } = await supabase
            .from('Propiedades')
            .insert(dataToInsert)
            .select()
          
          if (retryError) {
            console.error(`Error importing ${prop.titulo}:`, retryError.message)
          } else {
            console.log(`✓ Imported ${prop.titulo} (sin ${missingColumn})`)
          }
        } else {
          console.error(`Error importing ${prop.titulo}:`, error.message)
        }
      } else {
        console.error(`Error importing ${prop.titulo}:`, error.message)
      }
    } else {
      console.log(`✓ Imported ${prop.titulo}`)
    }
  }
  
  console.log('Import complete!')
}

importData()
