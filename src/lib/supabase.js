import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').toString().trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').toString().trim()

const isValidUrl = (s) => typeof s === 'string' && (s.startsWith('https://') || s.startsWith('http://')) && s.length > 10

const hasSupabaseConfig = isValidUrl(supabaseUrl) && supabaseAnonKey.length > 20

if (import.meta.env.DEV) {
  console.log('[Supabase] URL en uso:', supabaseUrl || '(vacía)')
} else if (typeof window !== 'undefined' && !hasSupabaseConfig) {
  // Vite sustituye import.meta.env en tiempo de BUILD: si Render no tenía las vars al hacer npm run build, el sitio público queda sin cliente.
  console.warn(
    '[Supabase] Cliente no creado: faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en el build. ' +
      'En el hosting (p. ej. Render), añade esas variables de entorno y vuelve a desplegar para que se ejecute un build nuevo.',
  )
}

// Solo crear cliente si URL y key son válidos; si no, la app carga sin Supabase (evita "Must be a valid HTTP or HTTPS URL")
export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null
