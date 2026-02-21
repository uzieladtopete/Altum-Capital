import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').toString().trim()
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').toString().trim()

const isValidUrl = (s) => typeof s === 'string' && (s.startsWith('https://') || s.startsWith('http://')) && s.length > 10

// Solo crear cliente si URL y key son válidos; si no, la app carga sin Supabase (evita "Must be a valid HTTP or HTTPS URL")
export const supabase =
  isValidUrl(supabaseUrl) && supabaseAnonKey.length > 20
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
